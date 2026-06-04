/**
 * src/components/events/PlannerEntry.tsx
 *
 * The entry choice for the Planner page.
 * Presents two equal paths: Curated Templates | Custom Event.
 * Calm, editorial, no urgency. Neither path sells harder than the other.
 */

import { BookOpen, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export type PlannerMode = 'templates' | 'custom'

interface PlannerEntryProps {
  onSelect: (mode: PlannerMode) => void
  disabled?: boolean
}

export function PlannerEntry({ onSelect, disabled = false }: PlannerEntryProps) {
  return (
    <div className="mb-8">

      {/* Section label */}
      <p className="text-[0.62rem] font-medium tracking-[0.18em] uppercase text-muted/60 mb-5">
        How would you like to plan?
      </p>

      {/* Two-path choice */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* ── Curated Templates ──────────────────────────────────────── */}
        <EntryCard
          icon={<BookOpen size={15} strokeWidth={1.25} />}
          label="Curated Templates"
          description="Concierge-selected experiences organized by season, occasion, and resident fit. Faster to launch."
          tags={['Seasonal Collections', 'Instant Load', 'Guided']}
          recommended
          disabled={disabled}
          onClick={() => onSelect('templates')}
        />

        {/* ── Custom Event ───────────────────────────────────────────── */}
        <EntryCard
          icon={<SlidersHorizontal size={15} strokeWidth={1.25} />}
          label="Custom Event"
          description="Build a fully tailored event plan using the guided wizard or classic form."
          tags={['Guided Wizard', 'Classic Form', 'Flexible']}
          disabled={disabled}
          onClick={() => onSelect('custom')}
        />

      </div>
    </div>
  )
}

// ─── EntryCard ────────────────────────────────────────────────────────────────

interface EntryCardProps {
  icon:        React.ReactNode
  label:       string
  description: string
  tags:        string[]
  recommended?: boolean
  disabled?:   boolean
  onClick:     () => void
}

function EntryCard({
  icon,
  label,
  description,
  tags,
  recommended,
  disabled,
  onClick,
}: EntryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group text-left w-full rounded-sm border transition-all duration-200',
        'px-6 py-5 flex flex-col gap-4',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        recommended
          ? 'border-gold/30 bg-white hover:border-gold/60 hover:bg-gold/[0.02]'
          : 'border-border bg-white hover:border-charcoal/20 hover:bg-warm-gray/40'
      )}
    >
      {/* Top row: icon + label + recommended indicator */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={cn(
            'transition-colors duration-200',
            recommended
              ? 'text-gold group-hover:text-gold-dark'
              : 'text-charcoal-light group-hover:text-charcoal'
          )}>
            {icon}
          </span>
          <span className={cn(
            'font-serif text-[1.05rem] font-light leading-snug',
            recommended ? 'text-charcoal' : 'text-charcoal'
          )}>
            {label}
          </span>
        </div>
        {recommended && (
          <span className="text-[0.55rem] font-medium tracking-[0.12em] uppercase text-gold/70 border border-gold/20 px-1.5 py-0.5 rounded-sm shrink-0 mt-0.5">
            Recommended
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-[0.78rem] text-muted font-light leading-relaxed">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              'text-[0.6rem] font-medium tracking-[0.08em] uppercase px-2 py-0.5 rounded-sm border',
              'transition-colors duration-200',
              recommended
                ? 'border-gold/15 bg-gold/5 text-gold/80'
                : 'border-border bg-warm-gray text-muted'
            )}
          >
            {tag}
          </span>
        ))}
      </div>

    </button>
  )
}
