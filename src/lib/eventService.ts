/**
 * eventService.ts — Supabase CRUD for event_plans (v2 schema)
 */

import { supabase } from '@/lib/supabase'
import type { SavedEvent, EventFormData } from '@/types'
import type { EventPlanRow, EventPlanInsert } from '@/types/database'

// ─── Result type ─────────────────────────────────────────────────────────────

export interface ServiceResult<T> {
  data: T | null
  error: string | null
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

function rowToSavedEvent(row: EventPlanRow): SavedEvent {
  return {
    id: row.id,
    savedAt: row.created_at,
    title: row.title,
    tagline: row.tagline,
    overview: row.overview,
    theme: row.theme,
    proTip: row.pro_tip,
    catering: row.catering,
    entertainment: row.entertainment,
    logistics: row.logistics,
    budgetBreakdown: row.budget_breakdown,
    setupLogistics: row.setup_logistics ?? [],
    flyerHeadline: row.flyer_headline ?? '',
    // JSONB fields cast through unknown — validated at runtime by the Edge Function
    timeline: (row.timeline as SavedEvent['timeline']) ?? [],
    vendorIdeas: (row.vendor_ideas as SavedEvent['vendorIdeas']) ?? [],
    staffing: (row.staffing as SavedEvent['staffing']) ?? [],
    alcoholEstimate: (row.alcohol_estimate as SavedEvent['alcoholEstimate']) ?? null,
    residentEmail: (row.resident_email as SavedEvent['residentEmail']) ?? { subject: '', body: '' },
    meta: row.meta as EventFormData,
  }
}

function savedEventToInsert(event: SavedEvent): EventPlanInsert {
  return {
    title: event.title,
    tagline: event.tagline,
    overview: event.overview,
    theme: event.theme,
    pro_tip: event.proTip,
    catering: event.catering,
    entertainment: event.entertainment,
    logistics: event.logistics,
    budget_breakdown: event.budgetBreakdown,
    setup_logistics: event.setupLogistics ?? [],
    flyer_headline: event.flyerHeadline ?? '',
    timeline: event.timeline as unknown as import('@/types/database').Json,
    vendor_ideas: event.vendorIdeas as unknown as import('@/types/database').Json,
    staffing: event.staffing as unknown as import('@/types/database').Json,
    alcohol_estimate: event.alcoholEstimate as unknown as import('@/types/database').Json ?? null,
    resident_email: event.residentEmail as unknown as import('@/types/database').Json,
    meta: event.meta as unknown as import('@/types/database').Json,
  }
}

function extractMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) return String((err as { message: unknown }).message)
  return 'An unexpected error occurred'
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function fetchEventPlans(): Promise<ServiceResult<SavedEvent[]>> {
  try {
    const { data, error } = await supabase
      .from('event_plans')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return { data: null, error: error.message }
    return { data: (data ?? []).map(rowToSavedEvent), error: null }
  } catch (err) {
    return { data: null, error: extractMessage(err) }
  }
}

export async function fetchEventPlanById(id: string): Promise<ServiceResult<SavedEvent>> {
  try {
    const { data, error } = await supabase
      .from('event_plans')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return { data: null, error: error.message }
    if (!data) return { data: null, error: 'Event not found' }
    return { data: rowToSavedEvent(data), error: null }
  } catch (err) {
    return { data: null, error: extractMessage(err) }
  }
}

export async function createEventPlan(event: SavedEvent): Promise<ServiceResult<SavedEvent>> {
  try {
    const payload = savedEventToInsert(event)
    const { data, error } = await supabase
      .from('event_plans')
      .insert(payload)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    if (!data) return { data: null, error: 'Insert returned no data' }
    return { data: rowToSavedEvent(data), error: null }
  } catch (err) {
    return { data: null, error: extractMessage(err) }
  }
}

export async function deleteEventPlan(id: string): Promise<ServiceResult<true>> {
  try {
    const { error } = await supabase.from('event_plans').delete().eq('id', id)
    if (error) return { data: null, error: error.message }
    return { data: true, error: null }
  } catch (err) {
    return { data: null, error: extractMessage(err) }
  }
}

export async function eventPlanExists(title: string, tagline: string): Promise<boolean> {
  try {
    const { count } = await supabase
      .from('event_plans')
      .select('*', { count: 'exact', head: true })
      .eq('title', title)
      .eq('tagline', tagline)
    return (count ?? 0) > 0
  } catch {
    return false
  }
}
