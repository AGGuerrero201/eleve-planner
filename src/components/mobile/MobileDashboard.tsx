import { useState } from 'react'
import type { NavigateFunction } from 'react-router-dom'
import { ArrowRight, BookOpen, Store, Zap, CalendarDays, Package, PlayCircle } from 'lucide-react'
import { PropertyProfileCard } from '@/components/property/PropertyProfileCard'
import { ComingSoonCard, ComingSoonSheet } from './ComingSoon'
import { WORKFLOW_STATUS_LABELS } from '@/lib/workflowStatus'
import type { SavedEvent, EventWorkflowStatus } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_DOT: Record<EventWorkflowStatus, string> = {
  draft: 'bg-muted/40', in_progress: 'bg-blue-400', finalized: 'bg-green-500', archived: 'bg-charcoal-light/30',
}
const STATUS_PILL: Record<EventWorkflowStatus, string> = {
  draft: 'bg-warm-gray text-muted border-border',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  finalized: 'bg-green-50 text-green-700 border-green-200',
  archived: 'bg-charcoal/5 text-charcoal-light border-charcoal/10',
}

interface MobileDashboardProps {
  greeting: string
  dateStr: string
  eventsLoaded: boolean
  vendorsLoaded: boolean
  eventsCount: number
  vendorsCount: number
  inProgressCount: number
  recentEvents: SavedEvent[]
  vendorsByCategory: { label: string; count: number }[]
  navigate: NavigateFunction
}

/**
 * Phone-only Dashboard. All data comes from DashboardPage's existing
 * useSavedEvents()/useVendors() calls — no new fetching, no fake data.
 */
export function MobileDashboard({
  greeting, dateStr, eventsLoaded, vendorsLoaded, eventsCount, vendorsCount,
  inProgressCount, recentEvents, vendorsByCategory, navigate,
}: MobileDashboardProps) {
  const [showLivePreview, setShowLivePreview] = useState(false)
  const nextEvent = recentEvents[0]

  return (
    <div className="pb-6">
      <div className="-mx-5 px-5 pt-8 pb-8 mb-6" style={{ backgroundColor: 'var(--charcoal, #1C1C1E)' }}>
        <div className="h-px mb-6" style={{ backgroundColor: 'rgba(184,149,90,0.25)' }} />
        <p className="text-[0.58rem] font-medium uppercase mb-2" style={{ letterSpacing: '0.16em', color: 'rgba(184,149,90,0.6)' }}>
          Elevé Event Operations
        </p>
        <h1 className="font-serif font-light text-[1.7rem] leading-tight mb-1" style={{ color: 'var(--off-white, #FAFAF8)' }}>
          {greeting}.
        </h1>
        <p className="font-light text-[0.72rem]" style={{ letterSpacing: '0.05em', color: 'rgba(255,255,255,0.35)' }}>
          {dateStr}
        </p>
        <div className="h-px mt-6" style={{ backgroundColor: 'rgba(184,149,90,0.15)' }} />
      </div>

      <div className="px-5">
        <div className="grid grid-cols-2 gap-2.5 mb-8">
          <MobileStat label="Events in Library" value={eventsLoaded ? String(eventsCount) : '–'} icon={<BookOpen size={13} strokeWidth={1.5} />} />
          <MobileStat label="Vendors on File" value={vendorsLoaded ? String(vendorsCount) : '–'} icon={<Store size={13} strokeWidth={1.5} />} />
          <MobileStat label="Plans in Progress" value={eventsLoaded ? String(inProgressCount) : '–'} icon={<CalendarDays size={13} strokeWidth={1.5} />} />
          <MobileStat label="Templates" value="30" icon={<Package size={13} strokeWidth={1.5} />} />
        </div>

        <SectionLabel text="Quick actions" />
        <div className="flex gap-2.5 overflow-x-auto -mx-5 px-5 pb-1 mb-8">
          <MobileAction icon={<Zap size={18} strokeWidth={1.5} />} label="Plan New Event" primary onClick={() => navigate('/planner')} />
          <MobileAction icon={<BookOpen size={18} strokeWidth={1.5} />} label="Browse Templates" onClick={() => navigate('/planner', { state: { mode: 'templates' } })} />
          <MobileAction icon={<Store size={18} strokeWidth={1.5} />} label="Vendor Hub" onClick={() => navigate('/vendors')} />
        </div>

        {eventsLoaded && nextEvent && (
          <>
            <SectionLabel text="Most recent event" />
            <button
              type="button"
              onClick={() => navigate('/saved', { state: { openEventId: nextEvent.id } })}
              className="w-full text-left rounded-sm px-4 py-4 mb-3"
              style={{ backgroundColor: 'var(--card-bg, #FAFAF8)', border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))' }}
            >
              <span className={cn(
                'inline-flex items-center gap-1.5 text-[0.62rem] font-medium tracking-[0.08em] uppercase px-2 py-0.5 rounded-sm border mb-2',
                STATUS_PILL[nextEvent.workflowStatus ?? 'draft']
              )}>
                <span className={cn('w-1.5 h-1.5 rounded-full', STATUS_DOT[nextEvent.workflowStatus ?? 'draft'])} />
                {WORKFLOW_STATUS_LABELS[nextEvent.workflowStatus ?? 'draft']}
              </span>
              <p className="font-serif text-[1.05rem] font-light text-charcoal leading-snug">{nextEvent.title}</p>
              {nextEvent.meta?.eventType && (
                <p className="text-[0.68rem] font-medium uppercase mt-1" style={{ letterSpacing: '0.1em', color: 'var(--gold, #B8955A)' }}>
                  {nextEvent.meta.eventType}
                </p>
              )}
            </button>

            <ComingSoonCard
              icon={<PlayCircle size={16} strokeWidth={1.5} />}
              title="Live Event Mode"
              description="A focused, one-handed view for running an event in progress. In development."
              onClick={() => setShowLivePreview(true)}
            />
          </>
        )}

        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <SectionLabel text="Recent events" noMargin />
            <button type="button" onClick={() => navigate('/saved')} className="flex items-center gap-1 text-[0.68rem] font-medium text-muted" style={{ letterSpacing: '0.05em' }}>
              View all <ArrowRight size={11} strokeWidth={1.5} />
            </button>
          </div>
          {eventsLoaded && recentEvents.length === 0 && (
            <p className="text-[0.8rem] font-light text-muted py-3">No saved events yet.</p>
          )}
          <div className="space-y-2">
            {recentEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => navigate('/saved', { state: { openEventId: event.id } })}
                className="w-full text-left rounded-sm px-4 py-3 flex items-center gap-3"
                style={{ backgroundColor: 'var(--card-bg, #FAFAF8)', border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))' }}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', STATUS_DOT[event.workflowStatus ?? 'draft'])} />
                <span className="font-serif text-[0.9rem] font-light text-charcoal flex-1 truncate">{event.title}</span>
                <ArrowRight size={13} strokeWidth={1.5} className="shrink-0 text-muted/40" />
              </button>
            ))}
          </div>
        </div>

        {vendorsLoaded && vendorsByCategory.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <SectionLabel text="Vendor directory" noMargin />
              <button type="button" onClick={() => navigate('/vendors')} className="flex items-center gap-1 text-[0.68rem] font-medium text-muted" style={{ letterSpacing: '0.05em' }}>
                Manage <ArrowRight size={11} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {vendorsByCategory.map(({ label, count }) => (
                <div key={label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm" style={{ backgroundColor: 'var(--warm-gray, #F5F3EF)', border: '0.5px solid rgba(180,166,150,0.25)' }}>
                  <span className="text-[0.68rem] font-light text-charcoal-light">{label}</span>
                  <span className="text-[0.62rem] font-medium tabular-nums" style={{ color: 'var(--gold, #B8955A)' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <SectionLabel text="Property profile" />
          <PropertyProfileCard />
        </div>
      </div>

      {showLivePreview && (
        <ComingSoonSheet
          icon={<PlayCircle size={22} strokeWidth={1.5} />}
          title="Live Event Mode"
          description="A dedicated, distraction-free screen for running an event once it starts: phase timing, quick actions, and at-a-glance status."
          detail="This requires live attendance and phase-tracking data that isn't part of the product yet. We'll wire this up once that data model exists."
          onClose={() => setShowLivePreview(false)}
        />
      )}
    </div>
  )
}

function SectionLabel({ text, noMargin }: { text: string; noMargin?: boolean }) {
  return (
    <p className={cn('text-[0.62rem] font-medium uppercase', !noMargin && 'mb-3')} style={{ letterSpacing: '0.16em', color: 'var(--stone, #8C8478)' }}>
      {text}
    </p>
  )
}

function MobileStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-sm px-3.5 py-3.5" style={{ backgroundColor: 'var(--card-bg, #FAFAF8)', border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[0.58rem] font-medium uppercase" style={{ letterSpacing: '0.1em', color: 'var(--stone, #8C8478)' }}>{label}</p>
        <span style={{ color: 'rgba(184,149,90,0.45)' }}>{icon}</span>
      </div>
      <p className="font-serif font-light leading-none text-[1.6rem]" style={{ color: 'var(--charcoal, #1C1C1E)' }}>{value}</p>
    </div>
  )
}

function MobileAction({ icon, label, primary, onClick }: { icon: React.ReactNode; label: string; primary?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 w-[132px] min-h-[110px] rounded-sm px-4 py-4 flex flex-col justify-between gap-4 text-left"
      style={primary
        ? { backgroundColor: 'var(--charcoal, #1C1C1E)', border: '1px solid rgba(184,149,90,0.25)' }
        : { backgroundColor: 'var(--card-bg, #FAFAF8)', border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))' }}
    >
      <span style={{ color: primary ? 'var(--gold, #B8955A)' : 'rgba(184,149,90,0.6)' }}>{icon}</span>
      <span className="font-serif font-light text-[0.9rem] leading-snug" style={{ color: primary ? 'var(--gold-light, #E8D5B0)' : 'var(--charcoal, #1C1C1E)' }}>
        {label}
      </span>
    </button>
  )
}
