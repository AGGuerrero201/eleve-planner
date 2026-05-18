import { Trash2 } from 'lucide-react'
import type { SavedEvent } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { formatDate, truncate } from '@/lib/utils'

interface EventCardProps {
  event: SavedEvent
  onClick: () => void
  onDelete: () => void
}

export function EventCard({ event, onClick, onDelete }: EventCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Delete this saved event?')) {
      onDelete()
    }
  }

  return (
    <article
      className="bg-white border-r border-b border-border p-6 cursor-pointer transition-colors duration-150 hover:bg-warm-gray group relative"
      onClick={onClick}
    >
      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-4 right-4 p-1.5 text-border group-hover:text-muted hover:!text-red-500 transition-colors duration-150 rounded-sm"
        aria-label="Delete event"
      >
        <Trash2 size={13} />
      </button>

      {/* Type */}
      <p className="text-[0.67rem] font-medium tracking-[0.15em] uppercase text-gold mb-2.5">
        {event.meta.eventType}
      </p>

      {/* Title */}
      <h3 className="font-serif text-xl font-light text-charcoal leading-snug mb-1.5 pr-6">
        {event.title}
      </h3>

      {/* Tagline */}
      <p className="text-[0.8rem] text-muted font-light mb-4 leading-relaxed">
        {truncate(event.tagline, 60)}
      </p>

      {/* Meta tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge variant="muted">{event.meta.season}</Badge>
        <Badge variant="muted">{event.meta.venue}</Badge>
        <Badge variant="muted">{event.meta.budget}</Badge>
      </div>

      {/* Date */}
      <p className="text-[0.72rem] text-muted/70 font-light mt-3">
        Saved {formatDate(event.savedAt)}
      </p>
    </article>
  )
}
