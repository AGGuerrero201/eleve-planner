import { Trash2 } from 'lucide-react'
import type { SavedEvent, EventWorkflowStatus } from '@/types'
import { WORKFLOW_STATUS_LABELS } from '@/lib/workflowStatus'
import { Badge } from '@/components/ui/Badge'
import { formatDate, truncate, cn } from '@/lib/utils'

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

      {/* Workflow status badge */}
      <div className="mb-2.5">
        <WorkflowBadge status={event.workflowStatus} />
      </div>

      {/* Type */}
      <p className="text-[0.67rem] font-medium tracking-[0.15em] uppercase text-gold mb-1.5">
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

// ─── WorkflowBadge ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<EventWorkflowStatus, string> = {
  draft:       'bg-warm-gray border-border text-muted',
  in_progress: 'bg-blue-50 border-blue-200 text-blue-700',
  finalized:   'bg-green-50 border-green-200 text-green-700',
  archived:    'bg-charcoal/5 border-charcoal/15 text-charcoal-light',
}

const STATUS_DOTS: Record<EventWorkflowStatus, string> = {
  draft:       'bg-muted/50',
  in_progress: 'bg-blue-400',
  finalized:   'bg-green-500',
  archived:    'bg-charcoal-light/40',
}

export function WorkflowBadge({ status }: { status: EventWorkflowStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[0.67rem] font-medium tracking-[0.08em] uppercase',
        'px-2 py-0.5 rounded-sm border',
        STATUS_STYLES[status]
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', STATUS_DOTS[status])} />
      {WORKFLOW_STATUS_LABELS[status]}
    </span>
  )
}
