/**
 * src/components/events/PlannerEntry.tsx
 *
 * The entry choice for the Planner page.
 * Two primary paths + Suggested Starting Points + Concierge Notes.
 */

import { BookOpen, SlidersHorizontal, ArrowRight, Sparkles, Store, FileCheck, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export type PlannerMode = 'templates' | 'custom'

interface PlannerEntryProps {
  /** prefillEventType is set when a suggested starting point is chosen —
      the parent pre-fills the wizard so the promised event actually loads. */
  onSelect:  (mode: PlannerMode, prefillEventType?: string) => void
  disabled?: boolean
}

// ─── Suggested starting points ────────────────────────────────────────────────

const SUGGESTED = [
  {
    label:    'Summer Soirée',
    type:     'Cocktail Reception',
    tags:     ['Rooftop', 'Full bar', 'Summer'],
    glyph:    '◆',
  },
  {
    label:    'Rooftop Wine Tasting',
    type:     'Wine & Cheese Evening',
    tags:     ['Outdoor', 'Wine & beer', 'Social'],
    glyph:    '◇',
  },
  {
    label:    'Wellness Morning',
    type:     'Wellness & Yoga Morning',
    tags:     ['Non-alcoholic', 'Morning', 'Mindful'],
    glyph:    '◎',
  },
  {
    label:    'Family Movie Night',
    type:     'Movie Night',
    tags:     ['All-ages', 'Outdoor', 'Casual'],
    glyph:    '○',
  },
]

// ─── Concierge notes ──────────────────────────────────────────────────────────

const NOTES = [
  {
    icon: Store,
    text: 'Vendor matches are drawn live from your Vendor Hub directory.',
  },
  {
    icon: Sparkles,
    text: 'Template-based plans load instantly — no AI wait time required.',
  },
  {
    icon: FileCheck,
    text: 'Draft plans can be refined, edited section-by-section, and finalized.',
  },
  {
    icon: Shield,
    text: 'COI-aware vendor recommendations surface only compliant partners.',
  },
]

// ─────────────────────────────────────────────────────────────────────────────

export function PlannerEntry({ onSelect, disabled = false }: PlannerEntryProps) {
  return (
    <div className="mb-8">

      {/* ── Section label ───────────────────────────────────────────────── */}
      <p className="text-[0.62rem] font-medium tracking-[0.18em] uppercase text-muted/60 mb-5">
        How would you like to plan?
      </p>

      {/* ── Two primary paths ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">

        <EntryCard
          icon={<BookOpen size={15} strokeWidth={1.25} />}
          label="Curated Templates"
          description="Concierge-selected experiences organized by season, occasion, and resident fit. Faster to launch."
          tags={['Seasonal Collections', 'Instant Load', 'Guided']}
          recommended
          disabled={disabled}
          onClick={() => onSelect('templates')}
        />

        <EntryCard
          icon={<SlidersHorizontal size={15} strokeWidth={1.25} />}
          label="Custom Event"
          description="Build a fully tailored event plan using the guided wizard or classic form."
          tags={['Guided Wizard', 'Classic Form', 'Flexible']}
          disabled={disabled}
          onClick={() => onSelect('custom')}
        />

      </div>

      {/* ── Suggested starting points ────────────────────────────────────── */}
      <div className="mb-10">
        {/* Label */}
        <p className="text-[0.62rem] font-medium tracking-[0.18em] uppercase mb-4"
           style={{ color: 'var(--stone, #8C8478)' }}>
          Suggested starting points
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SUGGESTED.map((s) => (
            <SuggestedCard
              key={s.label}
              {...s}
              disabled={disabled}
              onClick={() => onSelect('custom', s.type)}
            />
          ))}
        </div>
      </div>

      {/* ── Concierge notes ──────────────────────────────────────────────── */}
      <div
        className="rounded-sm px-5 py-4"
        style={{
          backgroundColor: 'var(--gold-ghost, #FBF7F2)',
          border: '0.5px solid rgba(184, 149, 90, 0.18)',
        }}
      >
        <p className="text-[0.62rem] font-medium tracking-[0.18em] uppercase mb-4"
           style={{ color: 'var(--gold, #B8955A)' }}>
          Concierge notes
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {NOTES.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <Icon
                size={13}
                strokeWidth={1.5}
                className="shrink-0 mt-0.5"
                style={{ color: 'var(--gold, #B8955A)', opacity: 0.7 }}
              />
              <p className="text-[0.78rem] font-light leading-relaxed"
                 style={{ color: 'var(--charcoal-light, #4A4A50)' }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── EntryCard ────────────────────────────────────────────────────────────────

interface EntryCardProps {
  icon:         React.ReactNode
  label:        string
  description:  string
  tags:         string[]
  recommended?: boolean
  disabled?:    boolean
  onClick:      () => void
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
          <span className="font-serif text-[1.05rem] font-light leading-snug text-charcoal">
            {label}
          </span>
        </div>
        {recommended && (
          <span className="text-[0.55rem] font-medium tracking-[0.12em] uppercase text-gold/70 border border-gold/20 px-1.5 py-0.5 rounded-sm shrink-0 mt-0.5">
            Recommended
          </span>
        )}
      </div>

      <p className="text-[0.78rem] text-muted font-light leading-relaxed">
        {description}
      </p>

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

// ─── SuggestedCard ────────────────────────────────────────────────────────────

interface SuggestedCardProps {
  label:    string
  type:     string
  tags:     string[]
  glyph:    string
  disabled: boolean
  onClick:  () => void
}

function SuggestedCard({ label, type, tags, glyph, disabled, onClick }: SuggestedCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group text-left w-full rounded-sm border border-border bg-white',
        'px-4 py-4 flex items-center gap-4',
        'transition-all duration-200',
        'hover:border-gold/35 hover:bg-gold/[0.015]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
        'disabled:opacity-40 disabled:cursor-not-allowed',
      )}
    >
      {/* Glyph */}
      <span
        className="text-[0.9rem] leading-none shrink-0 transition-colors duration-200 group-hover:text-gold"
        style={{ color: 'var(--stone-light, #B8B0A8)' }}
        aria-hidden
      >
        {glyph}
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-serif text-[0.95rem] font-light text-charcoal leading-snug mb-0.5">
          {label}
        </p>
        <p className="text-[0.68rem] font-light text-muted truncate">
          {type}
        </p>
      </div>

      {/* Tags — hidden on mobile, visible sm+ */}
      <div className="hidden sm:flex gap-1 shrink-0">
        {tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-[0.58rem] font-medium tracking-[0.06em] uppercase px-1.5 py-0.5 border border-border bg-warm-gray text-muted rounded-sm whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Arrow */}
      <ArrowRight
        size={13}
        strokeWidth={1.5}
        className="shrink-0 text-muted/25 group-hover:text-gold/50 transition-colors duration-150"
      />
    </button>
  )
}
