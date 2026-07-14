/**
 * experience/experienceStore.ts
 *
 * The isolated data layer for Experience Elevé.
 *
 * When the experience is active, all events, vendors, the property profile,
 * and the activity feed read and write to namespaced localStorage keys —
 * never to Supabase. Production data is untouched in both directions:
 * starting the experience does not read it, exiting does not write it,
 * and resetting only clears the `eleve_experience_*` namespace.
 *
 * The store is also the app's signal bus for the guided walkthrough:
 * data operations emit signals ('event_saved', 'event_edited', …) that the
 * ExperienceContext listens to in order to auto-advance the tour, and every
 * meaningful operation appends to the activity feed shown on the dashboard.
 */

import type { SavedEvent, EventWorkflowStatus } from '@/types'
import type { Vendor } from '@/types/vendor'
import type { PropertyProfile } from '@/types/property'
import { buildSeedData } from './seedData'

// ─── Keys ───────────────────────────────────────────────────────────────────────

const K = {
  active:   'eleve_experience_active',
  events:   'eleve_experience_events',
  vendors:  'eleve_experience_vendors',
  profile:  'eleve_experience_profile',
  activity: 'eleve_experience_activity',
  tour:     'eleve_experience_tour',
} as const

// ─── Safe storage helpers ────────────────────────────────────────────────────────

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable (private mode) — the experience degrades to in-memory
    memory[key] = value
  }
}

// In-memory fallback for storage-restricted browsers
const memory: Record<string, unknown> = {}

// ─── Signal bus ─────────────────────────────────────────────────────────────────

export type ExperienceSignal =
  | 'planner_mode_selected'
  | 'plan_ready'
  | 'event_saved'
  | 'event_opened'
  | 'event_edited'
  | 'data_changed'

type SignalListener = (signal: ExperienceSignal) => void

const listeners = new Set<SignalListener>()

export function onExperienceSignal(fn: SignalListener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function emitExperienceSignal(signal: ExperienceSignal): void {
  listeners.forEach((fn) => fn(signal))
}

// ─── Activation ─────────────────────────────────────────────────────────────────

export function isExperienceActive(): boolean {
  try {
    return localStorage.getItem(K.active) === '1'
  } catch {
    return memory[K.active] === '1'
  }
}

/** Turns the experience on, seeding data on first run (or after a reset). */
export function activateExperience(): void {
  try {
    localStorage.setItem(K.active, '1')
  } catch {
    memory[K.active] = '1'
  }
  if (!read<SavedEvent[] | null>(K.events, null)) {
    seedExperienceData()
  } else {
    emitExperienceSignal('data_changed')
  }
}

/** Turns the experience off. Experience data is kept for a later return. */
export function deactivateExperience(): void {
  try {
    localStorage.removeItem(K.active)
  } catch {
    delete memory[K.active]
  }
  emitExperienceSignal('data_changed')
}

/** Wipes and reseeds every experience dataset. Production data is untouched. */
export function seedExperienceData(): void {
  const seed = buildSeedData()
  write(K.events,   seed.events)
  write(K.vendors,  seed.vendors)
  write(K.profile,  seed.profile)
  write(K.activity, seed.activity)
  emitExperienceSignal('data_changed')
}

// ─── Activity feed ──────────────────────────────────────────────────────────────

export interface ActivityEntry {
  id:   string
  ts:   string   // ISO timestamp
  kind: 'generated' | 'saved' | 'status' | 'edited' | 'vendor' | 'profile'
  text: string
}

export function getActivity(): ActivityEntry[] {
  return read<ActivityEntry[]>(K.activity, [])
}

export function logActivity(kind: ActivityEntry['kind'], text: string): void {
  const entries = getActivity()
  entries.unshift({
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    ts: new Date().toISOString(),
    kind,
    text,
  })
  write(K.activity, entries.slice(0, 30))
}

// ─── Tour persistence ───────────────────────────────────────────────────────────

export interface TourState {
  stepIndex: number
  dismissed: boolean
  completed: boolean
}

export function getTourState(): TourState {
  return read<TourState>(K.tour, { stepIndex: 0, dismissed: false, completed: false })
}

export function setTourState(state: TourState): void {
  write(K.tour, state)
}

// ─── Events ─────────────────────────────────────────────────────────────────────

export function expGetEvents(): SavedEvent[] {
  return read<SavedEvent[]>(K.events, [])
}

export function expSaveEvent(event: SavedEvent): SavedEvent {
  const events = expGetEvents()
  const row: SavedEvent = {
    ...event,
    id: event.id || `exp_${Date.now()}`,
    savedAt: new Date().toISOString(),
    workflowStatus: event.workflowStatus ?? 'draft',
  }
  events.unshift(row)
  write(K.events, events)
  logActivity('saved', `Saved “${row.title}” to the event library`)
  emitExperienceSignal('event_saved')
  emitExperienceSignal('data_changed')
  return row
}

export function expRemoveEvent(id: string): void {
  const events = expGetEvents()
  const target = events.find((e) => e.id === id)
  write(K.events, events.filter((e) => e.id !== id))
  if (target) logActivity('edited', `Removed “${target.title}” from the library`)
  emitExperienceSignal('data_changed')
}

export function expUpdateEventStatus(id: string, status: EventWorkflowStatus): void {
  const events = expGetEvents()
  const next = events.map((e) => (e.id === id ? { ...e, workflowStatus: status } : e))
  write(K.events, next)
  const target = next.find((e) => e.id === id)
  if (target) {
    const label = { draft: 'Draft', in_progress: 'In Progress', finalized: 'Finalized', archived: 'Archived' }[status]
    logActivity('status', `Moved “${target.title}” to ${label}`)
  }
  emitExperienceSignal('data_changed')
}

/** Applies a snake_case patch (same contract as the Supabase event service). */
export function expUpdateEventField(id: string, patch: Record<string, unknown>): void {
  const events = expGetEvents()
  const next = events.map((e) => {
    if (e.id !== id) return e
    const u: Partial<SavedEvent> = {}
    if ('flyer_headline'   in patch) u.flyerHeadline   = patch.flyer_headline as string
    if ('resident_email'   in patch) u.residentEmail   = patch.resident_email as SavedEvent['residentEmail']
    if ('catering'         in patch) u.catering        = patch.catering as string[]
    if ('entertainment'    in patch) u.entertainment   = patch.entertainment as string[]
    if ('logistics'        in patch) u.logistics       = patch.logistics as string[]
    if ('budget_breakdown' in patch) u.budgetBreakdown = patch.budget_breakdown as string[]
    if ('setup_logistics'  in patch) u.setupLogistics  = patch.setup_logistics as string[]
    if ('timeline'         in patch) u.timeline        = patch.timeline as SavedEvent['timeline']
    if ('vendor_ideas'     in patch) u.vendorIdeas     = patch.vendor_ideas as SavedEvent['vendorIdeas']
    if ('staffing'         in patch) u.staffing        = patch.staffing as SavedEvent['staffing']
    if ('alcohol_estimate' in patch) u.alcoholEstimate = patch.alcohol_estimate as SavedEvent['alcoholEstimate']
    if ('overview'         in patch) u.overview        = patch.overview as string
    if ('theme'            in patch) u.theme           = patch.theme as string
    if ('pro_tip'          in patch) u.proTip          = patch.pro_tip as string
    return { ...e, ...u }
  })
  write(K.events, next)
  const target = next.find((e) => e.id === id)
  if (target) logActivity('edited', `Updated details on “${target.title}”`)
  emitExperienceSignal('event_edited')
  emitExperienceSignal('data_changed')
}

// ─── Vendors ────────────────────────────────────────────────────────────────────

export function expGetVendors(): Vendor[] {
  return [...read<Vendor[]>(K.vendors, [])].sort((a, b) => a.name.localeCompare(b.name))
}

export function expAddVendor(v: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Vendor {
  const now = new Date().toISOString()
  const vendor: Vendor = { ...v, id: `exp_v_${Date.now()}`, createdAt: now, updatedAt: now }
  const vendors = read<Vendor[]>(K.vendors, [])
  vendors.push(vendor)
  write(K.vendors, vendors)
  logActivity('vendor', `Added ${vendor.name} to the vendor directory`)
  emitExperienceSignal('data_changed')
  return vendor
}

export function expUpdateVendor(id: string, patch: Partial<Vendor>): void {
  const vendors = read<Vendor[]>(K.vendors, [])
  const next = vendors.map((v) =>
    v.id === id ? { ...v, ...patch, updatedAt: new Date().toISOString() } : v
  )
  write(K.vendors, next)
  const target = next.find((v) => v.id === id)
  if (target && !('favorite' in patch && Object.keys(patch).length === 1)) {
    logActivity('vendor', `Updated ${target.name} in the vendor directory`)
  }
  emitExperienceSignal('data_changed')
}

export function expRemoveVendor(id: string): void {
  const vendors = read<Vendor[]>(K.vendors, [])
  const target = vendors.find((v) => v.id === id)
  write(K.vendors, vendors.filter((v) => v.id !== id))
  if (target) logActivity('vendor', `Removed ${target.name} from the vendor directory`)
  emitExperienceSignal('data_changed')
}

// ─── Property profile ───────────────────────────────────────────────────────────

export function expGetProfile(): PropertyProfile | null {
  return read<PropertyProfile | null>(K.profile, null)
}

export function expSaveProfile(profile: PropertyProfile): PropertyProfile {
  const saved: PropertyProfile = {
    ...profile,
    id: profile.id ?? 'exp_profile',
    updatedAt: new Date().toISOString(),
  }
  write(K.profile, saved)
  logActivity('profile', `Updated the ${saved.propertyName} property profile`)
  emitExperienceSignal('data_changed')
  return saved
}
