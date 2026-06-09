import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import type { SavedEvent, EventWorkflowStatus, RegenerableSection } from '@/types'
import { regenerateSection, sectionToPatch } from '@/lib/sectionRegeneration'
import { WORKFLOW_STATUS_LABELS, WORKFLOW_STATUS_ORDER } from '@/lib/workflowStatus'
import { useSavedEvents } from '@/hooks/useSavedEvents'
import { EventCard } from '@/components/events/EventCard'
import { EventDetailModal } from '@/components/events/EventDetailModal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type FilterValue = 'all' | EventWorkflowStatus

export function SavedEventsPage() {
  const { events, status, error, fetch, remove, updateStatus, updateField } = useSavedEvents()
  const navigate = useNavigate()
  const [selectedEvent, setSelectedEvent] = useState<SavedEvent | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')

  const counts = useMemo(() => {
    const map: Partial<Record<FilterValue, number>> = {
      all: events.length,
      draft: 0,
      in_progress: 0,
      finalized: 0,
      archived: 0,
    }
    events.forEach((e) => {
      if (e.workflowStatus) { map[e.workflowStatus] = (map[e.workflowStatus] ?? 0) + 1 }
    })
    return map
  }, [events])

  const filteredEvents = useMemo(
    () => activeFilter === 'all' ? events : events.filter((e) => e.workflowStatus === activeFilter),
    [events, activeFilter]
  )

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this saved event?')) return
    setDeletingId(id)
    await remove(id)
    setDeletingId(null)
    if (selectedEvent?.id === id) setSelectedEvent(null)
  }

  const handleStatusChange = useCallback(async (id: string, newStatus: EventWorkflowStatus) => {
    await updateStatus(id, newStatus)
    setSelectedEvent((prev) => prev?.id === id ? { ...prev, workflowStatus: newStatus } : prev)
  }, [updateStatus])

  const handleFieldSave = useCallback(async (
    id: string,
    patch: Record<string, unknown>
  ): Promise<string | null> => {
    const err = await updateField(id, patch)
    if (!err) {
      setSelectedEvent((prev) => {
        if (!prev || prev.id !== id) return prev
        const updates: Partial<SavedEvent> = {}
        if ('flyer_headline'   in patch) updates.flyerHeadline   = patch.flyer_headline as string
        if ('resident_email'   in patch) updates.residentEmail   = patch.resident_email as SavedEvent['residentEmail']
        if ('catering'         in patch) updates.catering        = patch.catering as string[]
        if ('entertainment'    in patch) updates.entertainment   = patch.entertainment as string[]
        if ('logistics'        in patch) updates.logistics       = patch.logistics as string[]
        if ('budget_breakdown' in patch) updates.budgetBreakdown = patch.budget_breakdown as string[]
        if ('setup_logistics'  in patch) updates.setupLogistics  = patch.setup_logistics as string[]
        if ('overview'         in patch) updates.overview        = patch.overview as string
        if ('theme'            in patch) updates.theme           = patch.theme as string
        if ('pro_tip'          in patch) updates.proTip          = patch.pro_tip as string
        return { ...prev, ...updates }
      })
    }
    return err
  }, [updateField])

  const handleSectionRegenerate = useCallback(async (
    id: string,
    section: RegenerableSection
  ): Promise<string | null> => {
    const event = events.find((e) => e.id === id)
    if (!event) return 'Event not found'
    const result = await regenerateSection(event, section)
    if (result.error) return result.error
    const patch = sectionToPatch(section, result.value!)
    return handleFieldSave(id, patch)
  }, [events, handleFieldSave])

  const isLoading = status === 'loading'
  const noEventsAtAll = status === 'success' && events.length === 0
  const isEmpty = status === 'success' && filteredEvents.length === 0 && !noEventsAtAll

  const TABS: { value: FilterValue; label: string }[] = [
    { value: 'all', label: 'All' },
    ...WORKFLOW_STATUS_ORDER.map((s) => ({ value: s, label: WORKFLOW_STATUS_LABELS[s] })),
  ]

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-[2.25rem] font-light text-charcoal mb-1.5 leading-tight">
            Saved Events
          </h1>
          {status === 'success' && events.length > 0 && (
            <p className="text-muted font-light text-[0.875rem]">
              {events.length} event{events.length !== 1 ? 's' : ''} in your library
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={() => void fetch()}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-[0.72rem] text-muted/70 hover:text-charcoal transition-colors duration-200 disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          {events.length > 0 && (
            <Button variant="gold" size="sm" onClick={() => navigate('/planner')}>
              + Plan New Event
            </Button>
          )}
        </div>
      </div>

      {/* ── Filter tabs ──────────────────────────────────────────────────── */}
      {status === 'success' && events.length > 0 && (
        <div className="mb-8 relative">
          {/* Fade mask — signals scroll on mobile */}
          <div
            className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none sm:hidden"
            style={{
              background: 'linear-gradient(to right, transparent, var(--warm-white, #FEFCFA))',
              zIndex: 1,
            }}
            aria-hidden
          />
          <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0 pb-px scrollbar-thin">
            <div
              className="flex items-center rounded-sm overflow-hidden w-fit min-w-full sm:min-w-0 sm:w-fit"
              style={{ border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))' }}
            >
              {TABS.map((tab) => {
                const count = (counts[tab.value ?? "all"] ?? 0)
                const isActive = activeFilter === tab.value
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveFilter(tab.value)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5',
                      'text-[0.65rem] font-medium tracking-[0.10em] uppercase',
                      'transition-colors duration-150 whitespace-nowrap',
                      'border-r last:border-r-0',
                      isActive
                        ? 'bg-charcoal text-gold-light border-charcoal'
                        : 'bg-[var(--card-bg,#FAFAF8)] text-[var(--stone,#8C8478)] hover:bg-warm-gray hover:text-charcoal border-[rgba(180,166,150,0.20)]'
                    )}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span className={cn(
                        'text-[0.6rem] px-1.5 py-px rounded-sm font-medium tabular-nums leading-none',
                        isActive ? 'bg-white/15 text-gold-light' : 'bg-border/60 text-muted'
                      )}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Loading skeleton ─────────────────────────────────────────────── */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-sm animate-pulse"
              style={{
                backgroundColor: 'var(--card-bg, #FAFAF8)',
                border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
              }}
            >
              <div className="h-5 w-20 rounded-sm mb-5" style={{ backgroundColor: 'var(--stone-pale,#E8E4E0)' }} />
              <div className="h-2.5 w-24 rounded mb-2.5" style={{ backgroundColor: 'var(--stone-pale,#E8E4E0)' }} />
              <div className="h-6 w-3/4 rounded mb-2" style={{ backgroundColor: 'var(--stone-pale,#E8E4E0)' }} />
              <div className="h-4 w-full rounded mb-1.5" style={{ backgroundColor: 'var(--stone-pale,#E8E4E0)' }} />
              <div className="h-4 w-2/3 rounded mb-6" style={{ backgroundColor: 'var(--stone-pale,#E8E4E0)' }} />
            </div>
          ))}
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {status === 'error' && error && (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <div className="w-12 h-12 border border-red-100 bg-red-50 flex items-center justify-center rounded-sm">
            <AlertCircle size={18} className="text-red-400" />
          </div>
          <div>
            <p className="text-[0.875rem] text-charcoal-light font-light mb-1">Could not load saved events</p>
            <p className="text-[0.78rem] text-muted font-light">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void fetch()}>Try Again</Button>
        </div>
      )}

      {/* ── Empty — no events ────────────────────────────────────────────── */}
      {noEventsAtAll && (
        <div className="text-center py-28 px-6">
          <div
            className="w-14 h-14 flex items-center justify-center mx-auto mb-7 rounded-sm"
            style={{
              border: 'var(--card-border)',
              backgroundColor: 'var(--gold-ghost, #FBF7F2)',
            }}
          >
            <BookOpen size={18} strokeWidth={1.25} style={{ color: 'var(--gold,#B8955A)', opacity: 0.5 }} />
          </div>
          <div className="eleve-divider mb-6" />
          <h3 className="font-serif text-[1.6rem] font-light text-charcoal-light mb-3 leading-snug">
            Your library awaits
          </h3>
          <p className="text-muted font-light text-[0.875rem] mb-9 max-w-xs mx-auto leading-relaxed">
            Event plans you generate and save will appear here, ready to refine and share.
          </p>
          <Button variant="gold" size="md" onClick={() => navigate('/planner')}>
            Plan Your First Event
          </Button>
        </div>
      )}

      {/* ── Empty — filter has no results ────────────────────────────────── */}
      {isEmpty && (
        <div className="text-center py-20 px-6 animate-fade-up">
          <div className="eleve-divider mb-6" />
          <p className="font-serif text-[1.4rem] font-light text-charcoal-light mb-2">
            Nothing here yet
          </p>
          <p className="text-muted font-light text-[0.875rem] mb-6">
            Move an event to this status from its detail view.
          </p>
          <button
            onClick={() => setActiveFilter('all')}
            className="text-[0.68rem] font-medium tracking-[0.10em] uppercase text-muted hover:text-charcoal underline underline-offset-4 transition-colors"
          >
            View all events
          </button>
        </div>
      )}

      {/* ── Cards grid ───────────────────────────────────────────────────── */}
      {/* 
        Clean gap-based grid. Each card carries its own border via EventCard.
        No background-color on the grid parent — eliminates the beige empty-cell bleed.
        Cards wrap naturally; incomplete last rows leave transparent space, not a filled block.
      */}
      {status === 'success' && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-up">
          {filteredEvents.map((event) => (
            <div key={event.id} className="relative">
              {deletingId === event.id && (
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center rounded-sm"
                  style={{ backgroundColor: 'rgba(250,250,248,0.85)' }}
                >
                  <Loader2 size={16} className="text-gold animate-spin" />
                </div>
              )}
              <EventCard
                event={event}
                onClick={() => setSelectedEvent(event)}
                onDelete={() => void handleDelete(event.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Detail modal ─────────────────────────────────────────────────── */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onStatusChange={handleStatusChange}
        onFieldSave={handleFieldSave}
        onSectionRegenerate={handleSectionRegenerate}
      />
    </div>
  )
}
