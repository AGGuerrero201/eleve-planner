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
    const map: Record<FilterValue, number> = {
      all: events.length,
      draft: 0,
      in_progress: 0,
      finalized: 0,
      archived: 0,
    }
    events.forEach((e) => {
      map[e.workflowStatus] = (map[e.workflowStatus] ?? 0) + 1
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
      // Patch selectedEvent so the modal reflects the change immediately
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

    // Reuse existing handleFieldSave — it patches Supabase and selectedEvent
    const patch = sectionToPatch(section, result.value)
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl font-light text-charcoal mb-1">Saved Events</h1>
          {status === 'success' && events.length > 0 && (
            <p className="text-muted font-light text-sm">
              {events.length} event{events.length !== 1 ? 's' : ''} in your library
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void fetch()}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-[0.75rem] text-muted hover:text-charcoal transition-colors disabled:opacity-40 px-2 py-1"
            title="Refresh"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          {events.length > 0 && (
            <Button variant="gold" size="sm" onClick={() => navigate('/planner')}>
              + Plan New Event
            </Button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      {status === 'success' && events.length > 0 && (
        <div className="flex items-center gap-0 border border-border rounded-sm overflow-hidden mb-6 w-fit">
          {TABS.map((tab) => {
            const count = counts[tab.value]
            const isActive = activeFilter === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 text-[0.72rem] font-medium tracking-[0.06em] uppercase transition-colors duration-150 border-r border-border last:border-r-0',
                  isActive
                    ? 'bg-charcoal text-gold-light'
                    : 'bg-white text-muted hover:bg-warm-gray hover:text-charcoal'
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span className={cn(
                    'text-[0.65rem] px-1.5 py-0.5 rounded-sm font-medium tabular-nums',
                    isActive ? 'bg-white/15 text-gold-light' : 'bg-warm-gray text-muted'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1.5px] bg-border border-t border-l border-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white p-6 animate-pulse">
              <div className="h-3 w-16 bg-warm-gray rounded mb-3" />
              <div className="h-3 w-20 bg-warm-gray rounded mb-4" />
              <div className="h-5 w-3/4 bg-warm-gray rounded mb-2" />
              <div className="h-4 w-full bg-warm-gray rounded mb-1" />
              <div className="h-4 w-2/3 bg-warm-gray rounded mb-5" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-warm-gray rounded" />
                <div className="h-6 w-16 bg-warm-gray rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {status === 'error' && error && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="w-12 h-12 rounded-sm bg-red-50 flex items-center justify-center">
            <AlertCircle size={20} className="text-red-400" />
          </div>
          <div>
            <p className="text-sm text-charcoal-light font-light mb-1">Could not load saved events</p>
            <p className="text-xs text-muted font-light">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void fetch()}>Try Again</Button>
        </div>
      )}

      {/* Empty — no events at all */}
      {noEventsAtAll && (
        <div className="text-center py-24 px-6">
          <div className="w-14 h-14 rounded-sm bg-warm-gray flex items-center justify-center mx-auto mb-6">
            <BookOpen size={22} className="text-border" strokeWidth={1} />
          </div>
          <h3 className="font-serif text-2xl font-light text-charcoal-light mb-2">No saved events yet</h3>
          <p className="text-muted font-light text-sm mb-8 max-w-xs mx-auto leading-relaxed">
            Generate and save event plans to build your curated event library.
          </p>
          <Button variant="gold" size="md" onClick={() => navigate('/planner')}>Plan an Event</Button>
        </div>
      )}

      {/* Empty — filter has no results */}
      {isEmpty && (
        <div className="text-center py-16 px-6">
          <p className="font-serif text-xl font-light text-charcoal-light mb-2">
            No {WORKFLOW_STATUS_LABELS[activeFilter as EventWorkflowStatus]} events
          </p>
          <p className="text-muted font-light text-sm mb-5">
            Change an event status in the modal to see it here.
          </p>
          <button
            onClick={() => setActiveFilter('all')}
            className="text-[0.78rem] font-medium tracking-[0.08em] uppercase text-charcoal-light underline underline-offset-2 hover:text-charcoal transition-colors"
          >
            View all events
          </button>
        </div>
      )}

      {/* Cards grid */}
      {status === 'success' && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
          {filteredEvents.map((event) => (
            <div key={event.id} className="relative">
              {deletingId === event.id && (
                <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                  <Loader2 size={18} className="text-gold animate-spin" />
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

      {/* Detail modal */}
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
