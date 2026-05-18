import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import type { SavedEvent } from '@/types'
import { useSavedEvents } from '@/hooks/useSavedEvents'
import { EventCard } from '@/components/events/EventCard'
import { EventDetailModal } from '@/components/events/EventDetailModal'
import { Button } from '@/components/ui/Button'

export function SavedEventsPage() {
  const { events, status, error, fetch, remove } = useSavedEvents()
  const navigate = useNavigate()
  const [selectedEvent, setSelectedEvent] = useState<SavedEvent | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this saved event?')) return
    setDeletingId(id)
    await remove(id)
    setDeletingId(null)
    if (selectedEvent?.id === id) setSelectedEvent(null)
  }

  const isLoading = status === 'loading'
  const isEmpty = status === 'success' && events.length === 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl font-light text-charcoal mb-1">
            Saved Events
          </h1>
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

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1.5px] bg-border border-t border-l border-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white p-6 animate-pulse">
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
            <p className="text-sm text-charcoal-light font-light mb-1">
              Could not load saved events
            </p>
            <p className="text-xs text-muted font-light">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void fetch()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="text-center py-24 px-6">
          <div className="w-14 h-14 rounded-sm bg-warm-gray flex items-center justify-center mx-auto mb-6">
            <BookOpen size={22} className="text-border" strokeWidth={1} />
          </div>
          <h3 className="font-serif text-2xl font-light text-charcoal-light mb-2">
            No saved events yet
          </h3>
          <p className="text-muted font-light text-sm mb-8 max-w-xs mx-auto leading-relaxed">
            Generate and save event plans to build your curated event library.
          </p>
          <Button variant="gold" size="md" onClick={() => navigate('/planner')}>
            Plan an Event
          </Button>
        </div>
      )}

      {/* Cards grid */}
      {status === 'success' && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
          {events.map((event) => (
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
      />
    </div>
  )
}
