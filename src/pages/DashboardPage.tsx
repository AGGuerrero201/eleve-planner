/**
 * src/pages/DashboardPage.tsx
 *
 * Elevé command centre — the primary landing experience.
 * Reads live data from useSavedEvents + useVendors.
 * Designed to make the platform look in-use on first load.
 *
 * Sections:
 *   1. Greeting header (time-aware, charcoal, editorial)
 *   2. Stat row (4 live metrics)
 *   3. Recent events (latest 3, compact rows)
 *   4. Vendor directory summary (category breakdown)
 *   5. Quick actions (3 primary CTA tiles)
 *   6. Concierge insight strip
 */

import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, BookOpen, Store, Zap, CalendarDays,
  Package, Sparkles, Shield,
} from 'lucide-react'
import { useSavedEvents } from '@/hooks/useSavedEvents'
import { useVendors } from '@/hooks/useVendors'
import { PropertyProfileCard } from '@/components/property/PropertyProfileCard'
import { useOnboarding } from '@/hooks/useOnboarding'
import { useExperience } from '@/experience/ExperienceContext'
import { getActivity, onExperienceSignal, type ActivityEntry } from '@/experience/experienceStore'
import { OnboardingOverlay } from '@/components/onboarding/OnboardingOverlay'
import { SampleEventBanner } from '@/components/onboarding/SampleEventBanner'
import { WORKFLOW_STATUS_LABELS } from '@/lib/workflowStatus'
import { ALL_VENDOR_CATEGORIES, VENDOR_CATEGORY_LABELS } from '@/types/vendor'
import type { EventWorkflowStatus } from '@/types'
import { cn } from '@/lib/utils'
import { MobileDashboard } from '@/components/mobile/MobileDashboard'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(ms / 60000)
  if (mins < 1)  return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  })
}

// ─── Status badge colours (compact, inline) ───────────────────────────────────

const STATUS_DOT: Record<EventWorkflowStatus, string> = {
  draft:       'bg-muted/40',
  in_progress: 'bg-blue-400',
  finalized:   'bg-green-500',
  archived:    'bg-charcoal-light/30',
}

const STATUS_PILL: Record<EventWorkflowStatus, string> = {
  draft:       'bg-warm-gray text-muted border-border',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  finalized:   'bg-green-50 text-green-700 border-green-200',
  archived:    'bg-charcoal/5 text-charcoal-light border-charcoal/10',
}

// ─── Concierge notes ──────────────────────────────────────────────────────────

const INSIGHTS = [
  { icon: Zap,       text: 'AI-generated plans are crafted to your brief — budget, season, and resident profile.' },
  { icon: Store,     text: 'Vendor matches pull live from your directory, with COI status included.' },
  { icon: Sparkles,  text: 'Template-based plans load instantly — no generation wait required.' },
  { icon: Shield,    text: 'All vendor recommendations respect your COI and approval workflow.' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const navigate = useNavigate()
  const { events, status: evStatus } = useSavedEvents()
  const { vendors, status: vStatus  } = useVendors()

  const eventsLoaded  = evStatus === 'success'
  const vendorsLoaded = vStatus  === 'success'

  // Onboarding state
  const { showOverlay, dismiss, lastChoice } = useOnboarding()

  // Experience Elevé — the walkthrough replaces first-run onboarding,
  // and the dashboard gains a live activity feed while it's active.
  const { active: experienceActive } = useExperience()
  const [activity, setActivity] = useState<ActivityEntry[]>(() =>
    experienceActive ? getActivity() : []
  )
  useEffect(() => {
    if (!experienceActive) return
    setActivity(getActivity())
    return onExperienceSignal(() => setActivity(getActivity()))
  }, [experienceActive])

  function handleSampleGenerate(eventType: string) {
    navigate('/sample?type=' + encodeURIComponent(eventType))
  }

  function handleBannerGenerate() {
    // Re-show the picker by navigating to sample with no type (defaults to Cocktail)
    navigate('/sample?type=Cocktail+Reception')
  }

  // Recent events — latest 3 by savedAt
  const recentEvents = useMemo(() => {
    if (!eventsLoaded) return []
    return [...events]
      .sort((a, b) => new Date(b.savedAt ?? b.created_at ?? new Date().toISOString()).getTime() - new Date(a.savedAt ?? a.created_at ?? new Date().toISOString()).getTime())
      .slice(0, 3)
  }, [events, eventsLoaded])

  // In-progress count
  const inProgressCount = useMemo(
    () => events.filter((e) => e.workflowStatus === 'in_progress').length,
    [events]
  )

  // Vendor counts by category (non-zero only)
  const vendorsByCategory = useMemo(() => {
    if (!vendorsLoaded) return []
    return ALL_VENDOR_CATEGORIES
      .map((cat) => ({
        label: VENDOR_CATEGORY_LABELS[cat],
        count: vendors.filter((v) => v.category === cat).length,
      }))
      .filter((c) => c.count > 0)
  }, [vendors, vendorsLoaded])

  const greeting    = getGreeting()
  const dateStr     = getFormattedDate()

  return (
    <>
      {/* Onboarding overlay — first visit only (suppressed during Experience Elevé,
          which provides its own guided walkthrough) */}
      {showOverlay && !experienceActive && (
        <OnboardingOverlay
          onDismiss={dismiss}
          onGenerate={handleSampleGenerate}
        />
      )}

      {/* Explorer banner — shown after "Explore on my own", dashboard only */}
      {!showOverlay && !experienceActive && lastChoice === 'explore' && (
        <SampleEventBanner onGenerate={handleBannerGenerate} />
      )}

      <div className="hidden sm:block max-w-5xl mx-auto px-5 sm:px-8 py-0">

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — Greeting header
          Charcoal background, full bleed to page edge on mobile.
          Feels like arriving at the front desk.
      ══════════════════════════════════════════════════════ */}
      <div
        className="-mx-5 sm:-mx-8 px-5 sm:px-8 pt-10 pb-9 mb-10"
        style={{ backgroundColor: 'var(--charcoal, #1C1C1E)' }}
      >
        {/* Thin gold rule at top */}
        <div className="h-px mb-8" style={{ backgroundColor: 'rgba(184,149,90,0.25)' }} />

        <p
          className="text-[0.6rem] font-medium uppercase mb-3"
          style={{ letterSpacing: '0.18em', color: 'rgba(184,149,90,0.60)' }}
        >
          Elevé Event Operations
        </p>

        <h1
          className="font-serif font-light leading-tight mb-2"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--off-white, #FAFAF8)' }}
        >
          {greeting}.
        </h1>

        <p
          className="font-light"
          style={{ fontSize: '0.78rem', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.35)' }}
        >
          {dateStr}
        </p>

        {/* Thin gold rule at bottom */}
        <div className="h-px mt-8" style={{ backgroundColor: 'rgba(184,149,90,0.15)' }} />
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — Stat row
          4 live metrics in a horizontal strip.
      ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">

        <StatCard
          label="Events in library"
          value={eventsLoaded ? String(events.length) : '—'}
          icon={<BookOpen size={14} strokeWidth={1.5} />}
          loading={evStatus === 'loading'}
        />
        <StatCard
          label="Vendors on file"
          value={vendorsLoaded ? String(vendors.length) : '—'}
          icon={<Store size={14} strokeWidth={1.5} />}
          loading={vStatus === 'loading'}
        />
        <StatCard
          label="Plans in progress"
          value={eventsLoaded ? String(inProgressCount) : '—'}
          icon={<CalendarDays size={14} strokeWidth={1.5} />}
          loading={evStatus === 'loading'}
        />
        <StatCard
          label="Templates available"
          value="30"
          icon={<Package size={14} strokeWidth={1.5} />}
        />

      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — Recent events
          Latest 3 saved events, compact row format.
      ══════════════════════════════════════════════════════ */}
      <div className="mb-10">
        <SectionHeader
          label="Recent events"
          action={{ text: 'View all', onClick: () => navigate('/saved') }}
        />

        {evStatus === 'loading' && (
          <div className="space-y-2">
            {[1,2,3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-sm animate-pulse"
                style={{
                  backgroundColor: 'var(--warm-gray, #F5F3EF)',
                  border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
                }}
              />
            ))}
          </div>
        )}

        {eventsLoaded && recentEvents.length === 0 && (
          <EmptyRow
            icon={<BookOpen size={16} strokeWidth={1.25} />}
            text="No saved events yet — generate your first plan to get started."
            action={{ text: 'Plan an event', onClick: () => navigate('/planner') }}
          />
        )}

        {eventsLoaded && recentEvents.length > 0 && (
          <div className="space-y-2">
            {recentEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => navigate('/saved', { state: { openEventId: event.id } })}
                className={cn(
                  'w-full text-left rounded-sm px-4 py-3.5 group',
                  'transition-all duration-150',
                )}
                style={{
                  backgroundColor: 'var(--card-bg, #FAFAF8)',
                  border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(184,154,106,0.50)'
                  e.currentTarget.style.boxShadow   = '0 2px 10px rgba(0,0,0,0.045)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(180,166,150,0.28)'
                  e.currentTarget.style.boxShadow   = 'none'
                }}
              >
                <div className="flex items-center gap-3">

                  {/* Status dot + pill */}
                  <span className={cn(
                    'inline-flex items-center gap-1.5 text-[0.62rem] font-medium tracking-[0.08em] uppercase',
                    'px-2 py-0.5 rounded-sm border shrink-0',
                    STATUS_PILL[event.workflowStatus ?? "draft"]
                  )}>
                    <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', STATUS_DOT[event.workflowStatus ?? "draft"])} />
                    {WORKFLOW_STATUS_LABELS[event.workflowStatus ?? "draft"]}
                  </span>

                  {/* Event type */}
                  <span
                    className="text-[0.62rem] font-medium uppercase shrink-0 hidden sm:block"
                    style={{ letterSpacing: '0.14em', color: 'var(--gold, #B8955A)' }}
                  >
                    {event.meta?.eventType ?? ''}
                  </span>

                  {/* Separator */}
                  <span className="w-px h-3 bg-border shrink-0 hidden sm:block" />

                  {/* Title */}
                  <span className="font-serif text-[0.95rem] font-light text-charcoal leading-snug flex-1 truncate">
                    {event.title}
                  </span>

                  {/* Badges — desktop only */}
                  <span className="hidden md:flex items-center gap-1.5 shrink-0">
                    <MetaBadge>{event.meta?.season ?? ''}</MetaBadge>
                    <MetaBadge>{event.meta?.budget ?? ''}</MetaBadge>
                  </span>

                  {/* Arrow */}
                  <ArrowRight
                    size={13}
                    strokeWidth={1.5}
                    className="shrink-0 text-muted/25 group-hover:text-gold/50 transition-colors duration-150"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — Vendor directory summary
          Category breakdown — shows breadth of setup.
      ══════════════════════════════════════════════════════ */}
      <div className="mb-10">
        <SectionHeader
          label="Vendor directory"
          action={{ text: 'Manage vendors', onClick: () => navigate('/vendors') }}
        />

        {vStatus === 'loading' && (
          <div
            className="h-14 rounded-sm animate-pulse"
            style={{
              backgroundColor: 'var(--warm-gray)',
              border: 'var(--card-border)',
            }}
          />
        )}

        {vendorsLoaded && vendors.length === 0 && (
          <EmptyRow
            icon={<Store size={16} strokeWidth={1.25} />}
            text="No vendors in your directory yet."
            action={{ text: 'Add a vendor', onClick: () => navigate('/vendors') }}
          />
        )}

        {vendorsLoaded && vendors.length > 0 && (
          <div
            className="rounded-sm px-5 py-4"
            style={{
              backgroundColor: 'var(--card-bg, #FAFAF8)',
              border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
            }}
          >
            {/* Summary line */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-[0.82rem] font-light text-charcoal-light">
                <span className="font-serif text-[1.1rem] font-light text-charcoal mr-1.5">
                  {vendors.length}
                </span>
                vendor{vendors.length !== 1 ? 's' : ''} across {vendorsByCategory.length} categories
              </p>
              <button
                type="button"
                onClick={() => navigate('/vendors')}
                className="flex items-center gap-1 text-[0.68rem] font-medium text-muted hover:text-charcoal transition-colors duration-150"
                style={{ letterSpacing: '0.06em' }}
              >
                View all
                <ArrowRight size={11} strokeWidth={1.5} />
              </button>
            </div>

            {/* Category breakdown */}
            <div className="flex flex-wrap gap-2">
              {vendorsByCategory.map(({ label, count }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm"
                  style={{
                    backgroundColor: 'var(--warm-gray, #F5F3EF)',
                    border: '0.5px solid rgba(180,166,150,0.25)',
                  }}
                >
                  <span className="text-[0.68rem] font-light text-charcoal-light">{label}</span>
                  <span
                    className="text-[0.62rem] font-medium tabular-nums"
                    style={{ color: 'var(--gold, #B8955A)' }}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 5 — Property Intelligence
          Phase 3: compact property profile card.
      ══════════════════════════════════════════════════════ */}
      <div className="mb-10">
        <SectionHeader
          label="Property profile"
          action={{ text: 'Edit', onClick: () => navigate('/property') }}
        />
        <PropertyProfileCard />
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 6 — Quick actions
          3 primary CTA tiles — the most demo-critical flows.
      ══════════════════════════════════════════════════════ */}
      <div className="mb-10">
        <SectionHeader label="Quick actions" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          <QuickAction
            icon={<Zap size={18} strokeWidth={1.5} />}
            label="Plan New Event"
            description="Generate a complete event plan with AI"
            primary
            onClick={() => navigate('/planner')}
          />

          <QuickAction
            icon={<BookOpen size={18} strokeWidth={1.5} />}
            label="Browse Templates"
            description="Launch from a curated seasonal template"
            onClick={() => navigate('/planner', { state: { mode: 'templates' } })}
          />

          <QuickAction
            icon={<Store size={18} strokeWidth={1.5} />}
            label="Vendor Hub"
            description="Manage your vendor directory and COI status"
            onClick={() => navigate('/vendors')}
          />

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 6b — Recent activity (Experience Elevé)
          A live feed of the community's planning activity, so the
          dashboard reflects every action taken during the experience.
      ══════════════════════════════════════════════════════ */}
      {experienceActive && activity.length > 0 && (
        <div className="mb-10">
          <SectionHeader label="Recent activity" />
          <div
            className="rounded-sm divide-y"
            style={{
              backgroundColor: 'var(--card-bg, #FAFAF8)',
              border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
            }}
          >
            {activity.slice(0, 6).map((entry) => (
              <div
                key={entry.id}
                className="flex items-baseline justify-between gap-4 px-4 py-3"
                style={{ borderColor: 'rgba(180,166,150,0.18)' }}
              >
                <div className="flex items-baseline gap-3 min-w-0">
                  <span
                    aria-hidden="true"
                    className="text-[0.55rem] shrink-0"
                    style={{ color: 'rgba(184,149,90,0.65)' }}
                  >
                    ◆
                  </span>
                  <p className="text-[0.8rem] font-light text-charcoal-light truncate">
                    {entry.text}
                  </p>
                </div>
                <p
                  className="text-[0.62rem] font-light shrink-0 tabular-nums"
                  style={{ color: 'var(--muted, #8A8578)' }}
                >
                  {timeAgo(entry.ts)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          SECTION 6 — Concierge insight strip
          Positioned last — data leads, capability follows.
      ══════════════════════════════════════════════════════ */}
      <div
        className="rounded-sm px-5 py-5 mb-12"
        style={{
          backgroundColor: 'var(--gold-ghost, #FBF7F2)',
          border: '0.5px solid rgba(184, 149, 90, 0.18)',
        }}
      >
        <p
          className="text-[0.6rem] font-medium uppercase mb-4"
          style={{ letterSpacing: '0.18em', color: 'var(--gold, #B8955A)' }}
        >
          Platform capabilities
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {INSIGHTS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <Icon
                size={13}
                strokeWidth={1.5}
                className="shrink-0 mt-0.5"
                style={{ color: 'var(--gold, #B8955A)', opacity: 0.7 }}
              />
              <p
                className="text-[0.78rem] font-light leading-relaxed"
                style={{ color: 'var(--charcoal-light, #4A4A50)' }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>

      <div className="sm:hidden">
        <MobileDashboard
          greeting={greeting}
          dateStr={dateStr}
          eventsLoaded={eventsLoaded}
          vendorsLoaded={vendorsLoaded}
          eventsCount={events.length}
          vendorsCount={vendors.length}
          inProgressCount={inProgressCount}
          recentEvents={recentEvents}
          vendorsByCategory={vendorsByCategory}
          navigate={navigate}
        />
      </div>
    </>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  label,
  action,
}: {
  label:   string
  action?: { text: string; onClick: () => void }
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p
        className="text-[0.62rem] font-medium uppercase"
        style={{ letterSpacing: '0.18em', color: 'var(--stone, #8C8478)' }}
      >
        {label}
      </p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="flex items-center gap-1 text-[0.68rem] font-medium text-muted hover:text-charcoal transition-colors duration-150"
          style={{ letterSpacing: '0.06em' }}
        >
          {action.text}
          <ArrowRight size={11} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  loading = false,
}: {
  label:    string
  value:    string
  icon:     React.ReactNode
  loading?: boolean
}) {
  return (
    <div
      className="rounded-sm px-4 py-4"
      style={{
        backgroundColor: 'var(--card-bg, #FAFAF8)',
        border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <p
          className="text-[0.6rem] font-medium uppercase"
          style={{ letterSpacing: '0.12em', color: 'var(--stone, #8C8478)' }}
        >
          {label}
        </p>
        <span style={{ color: 'rgba(184,149,90,0.45)' }}>{icon}</span>
      </div>
      {loading ? (
        <div className="h-7 w-10 rounded animate-pulse" style={{ backgroundColor: 'var(--stone-pale, #E8E4E0)' }} />
      ) : (
        <p className="font-serif font-light leading-none" style={{ fontSize: '1.85rem', color: 'var(--charcoal, #1C1C1E)' }}>
          {value}
        </p>
      )}
    </div>
  )
}

function MetaBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[0.6rem] font-medium tracking-[0.06em] uppercase px-2 py-0.5 rounded-sm"
      style={{
        backgroundColor: 'var(--warm-gray, #F5F3EF)',
        border: '0.5px solid rgba(180,166,150,0.30)',
        color: 'var(--muted, #8A8580)',
      }}
    >
      {children}
    </span>
  )
}

function EmptyRow({
  icon,
  text,
  action,
}: {
  icon:    React.ReactNode
  text:    string
  action?: { text: string; onClick: () => void }
}) {
  return (
    <div
      className="flex items-center gap-4 px-5 py-4 rounded-sm"
      style={{
        backgroundColor: 'var(--card-bg, #FAFAF8)',
        border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
      }}
    >
      <span style={{ color: 'rgba(184,149,90,0.40)' }}>{icon}</span>
      <p className="text-[0.82rem] font-light flex-1" style={{ color: 'var(--muted, #8A8580)' }}>
        {text}
      </p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="flex items-center gap-1 text-[0.72rem] font-medium shrink-0 transition-colors duration-150"
          style={{ color: 'var(--gold, #B8955A)' }}
        >
          {action.text}
          <ArrowRight size={11} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}

function QuickAction({
  icon,
  label,
  description,
  primary = false,
  onClick,
}: {
  icon:        React.ReactNode
  label:       string
  description: string
  primary?:    boolean
  onClick:     () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group text-left w-full rounded-sm px-5 py-5 flex flex-col gap-3',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
      )}
      style={primary ? {
        backgroundColor: 'var(--charcoal, #1C1C1E)',
        border: '1px solid rgba(184,149,90,0.25)',
      } : {
        backgroundColor: 'var(--card-bg, #FAFAF8)',
        border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
      }}
      onMouseEnter={(e) => {
        if (primary) {
          e.currentTarget.style.borderColor = 'rgba(184,149,90,0.50)'
        } else {
          e.currentTarget.style.borderColor  = 'rgba(184,154,106,0.50)'
          e.currentTarget.style.boxShadow    = '0 2px 10px rgba(0,0,0,0.045)'
        }
      }}
      onMouseLeave={(e) => {
        if (primary) {
          e.currentTarget.style.borderColor = 'rgba(184,149,90,0.25)'
        } else {
          e.currentTarget.style.borderColor = 'rgba(180,166,150,0.28)'
          e.currentTarget.style.boxShadow   = 'none'
        }
      }}
    >
      {/* Icon */}
      <span style={{ color: primary ? 'var(--gold, #B8955A)' : 'rgba(184,149,90,0.60)' }}>
        {icon}
      </span>

      {/* Label */}
      <div>
        <p
          className="font-serif font-light leading-snug mb-1"
          style={{
            fontSize: '1rem',
            color: primary ? 'var(--gold-light, #E8D5B0)' : 'var(--charcoal, #1C1C1E)',
          }}
        >
          {label}
        </p>
        <p
          className="text-[0.72rem] font-light leading-snug"
          style={{ color: primary ? 'rgba(255,255,255,0.35)' : 'var(--muted, #8A8580)' }}
        >
          {description}
        </p>
      </div>

      {/* Arrow */}
      <div className="mt-auto flex items-center justify-end">
        <ArrowRight
          size={13}
          strokeWidth={1.5}
          className="transition-transform duration-150 group-hover:translate-x-0.5"
          style={{ color: primary ? 'rgba(184,149,90,0.50)' : 'rgba(180,166,150,0.50)' }}
        />
      </div>
    </button>
  )
}
