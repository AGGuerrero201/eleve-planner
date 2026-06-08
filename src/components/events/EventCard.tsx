import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { SavedEvent, EventWorkflowStatus } from '@/types'
import { WORKFLOW_STATUS_LABELS } from '@/lib/workflowStatus'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Badge } from '@/components/ui/Badge'
import { formatDate, truncate, cn } from '@/lib/utils'

interface EventCardProps {
  event: SavedEvent
  onClick: () => void
  onDelete: () => void
}

export function EventCard({ event, onClick, onDelete }: EventCardProps) {
  const [confirming, setConfirming] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirming(true)
  }

  return (
    <article
      className={cn(
        'relative p-6 cursor-pointer rounded-sm',
        'transition-colors duration-200 hover:bg-warm-gray group',
      )}
      style={{
        // Each card owns its border — works cleanly in a gap grid at any column count.
        // No border-r / border-b collapse tricks that leave filled empty cells.
        backgroundColor: 'var(--card-bg, #FAFAF8)',
        border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
      }}
      onClick={() => { if (!confirming) onClick() }}
    >
      {/* Inline confirm dialog */}
      <ConfirmDialog
        open={confirming}
        message="Delete this event?"
        confirmLabel="Delete"
        onConfirm={() => { setConfirming(false); onDelete() }}
        onCancel={() => setConfirming(false)}
      />

      {/* Delete button */}
      <button
        onClick={handleDeleteClick}
        className="absolute top-4 right-4 p-1.5 text-border group-hover:text-muted hover:!text-red-500 transition-colors duration-200 rounded-sm"
        aria-label="Delete event"
      >
        <Trash2 size={13} />
      </button>

      {/* Workflow status badge */}
      <div className="mb-2.5">
        <WorkflowBadge status={event.workflowStatus} />
      </div>

      {/* Event type */}
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
