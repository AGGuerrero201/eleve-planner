import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// ── Status vocabulary map ─────────────────────────────────────
// Maps raw DB/state values to luxury display labels.
// All existing code that passes a variant string still works.
const STATUS_LABELS: Record<string, string> = {
  draft:        'In Planning',
  in_planning:  'In Planning',
  planning:     'In Planning',
  confirmed:    'Confirmed',
  active:       'Underway',
  in_progress:  'Underway',
  underway:     'Underway',
  completed:    'Delivered',
  delivered:    'Delivered',
  done:         'Delivered',
  archived:     'Archived',
  cancelled:    'Archived',
}

// Resolves a raw status string to one of the 5 CSS tier classes
function resolveStatusClass(status: string): string {
  const s = status?.toLowerCase().trim()
  if (['draft', 'in_planning', 'planning'].includes(s))           return 'status-planning'
  if (['confirmed'].includes(s))                                   return 'status-confirmed'
  if (['active', 'in_progress', 'underway'].includes(s))          return 'status-underway'
  if (['completed', 'delivered', 'done'].includes(s))             return 'status-delivered'
  return 'status-archived'
}

// ─────────────────────────────────────────────────────────────

type BadgeVariant =
  | 'gold'
  | 'muted'
  | 'success'
  // Status variants — pass the raw DB value as `variant`
  | 'draft'
  | 'in_planning'
  | 'planning'
  | 'confirmed'
  | 'active'
  | 'in_progress'
  | 'underway'
  | 'completed'
  | 'delivered'
  | 'done'
  | 'archived'
  | 'cancelled'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  /** If true, renders the luxury status label vocabulary
   *  ("In Planning" instead of "Draft").
   *  Only applies to status variants. Defaults to true. */
  statusLabel?: boolean
}

export function Badge({
  variant = 'muted',
  statusLabel = true,
  className,
  children,
  ...props
}: BadgeProps) {

  // ── Original three variants (unchanged styling) ───────────
  const legacyVariants: Record<string, string> = {
    gold:    'bg-gold/8 text-gold border-gold/15',
    muted:   'bg-warm-gray text-charcoal-light/80 border-border',
    success: 'bg-green-50 text-green-600 border-green-100',
  }

  const isLegacy = ['gold', 'muted', 'success'].includes(variant)

  if (isLegacy) {
    return (
      <span
        className={cn(
          'inline-flex items-center text-[0.65rem] font-medium tracking-[0.08em] uppercase',
          'px-2.5 py-[3px] rounded-sm border',
          legacyVariants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }

  // ── Status variants — luxury palette ─────────────────────
  const statusClass = resolveStatusClass(variant)
  const displayLabel = statusLabel
    ? (STATUS_LABELS[variant?.toLowerCase()] ?? children)
    : children

  return (
    <span
      className={cn('status-badge', statusClass, className)}
      // status-badge + status-{tier} defined in index.css
      {...props}
    >
      {displayLabel}
    </span>
  )
}

// ── Convenience export for direct status use ─────────────────
// <StatusBadge status="in_progress" />
interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: string
  className?: string
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  return (
    <Badge variant={status as BadgeVariant} statusLabel className={className} {...props} />
  )
}

export { STATUS_LABELS, resolveStatusClass }
