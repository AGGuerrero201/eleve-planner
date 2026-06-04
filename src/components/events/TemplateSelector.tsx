import { useState } from 'react'
import { Zap, ChevronDown, ChevronUp } from 'lucide-react'
import { LUXURY_TEMPLATES, type LuxuryTemplate } from '@/lib/templates'
import { CATEGORY_LABELS, ALL_TEMPLATE_CATEGORIES, type TemplateCategory } from '@/types/templates'
import { cn } from '@/lib/utils'

interface TemplateSelectorProps {
  onSelect:  (template: LuxuryTemplate) => void
  disabled?: boolean
}

export function TemplateSelector({ onSelect, disabled = false }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all')

  const filtered = activeCategory === 'all'
    ? LUXURY_TEMPLATES
    : LUXURY_TEMPLATES.filter((t) => t.category === activeCategory)

  return (
    <div className="mb-6">

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between',
          'bg-charcoal text-gold-light px-5 py-4',
          'text-[0.7rem] font-medium tracking-[0.12em] uppercase',
          'transition-opacity duration-200 disabled:opacity-40',
          open ? 'rounded-t-sm' : 'rounded-sm'
        )}
      >
        <span className="flex items-center gap-2.5">
          <Zap size={12} className="text-gold" strokeWidth={1.5} />
          Start from a luxury template
        </span>
        <span className="flex items-center gap-1.5 text-[0.65rem] text-white/35 normal-case tracking-normal font-light">
          {open
            ? <><span>Hide</span><ChevronUp size={12} /></>
            : <><span>Browse {LUXURY_TEMPLATES.length} templates</span><ChevronDown size={12} /></>
          }
        </span>
      </button>

      {open && (
        <div className="border border-t-0 border-border rounded-b-sm bg-warm-gray/50 p-5 animate-fade-up">

          <p className="text-[0.72rem] text-muted font-light mb-4 leading-relaxed">
            Templates with a full plan load instantly. Concept templates seed Claude with your event profile.
          </p>

          {/* Category filter pills */}
          <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
            <CategoryPill
              label={`All (${LUXURY_TEMPLATES.length})`}
              active={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
            />
            {ALL_TEMPLATE_CATEGORIES.map((cat) => {
              const count = LUXURY_TEMPLATES.filter((t) => t.category === cat).length
              if (count === 0) return null
              return (
                <CategoryPill
                  key={cat}
                  label={`${CATEGORY_LABELS[cat]} (${count})`}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                />
              )
            })}
          </div>

          {/* Template grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {filtered.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => {
                  onSelect(template)
                  setOpen(false)
                }}
                disabled={disabled}
              />
            ))}
          </div>

        </div>
      )}
    </div>
  )
}

// ─── Category pill ────────────────────────────────────────────────────────────

function CategoryPill({ label, active, onClick }: {
  label:   string
  active:  boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'text-[0.62rem] font-medium tracking-[0.08em] uppercase px-3 py-1.5 rounded-sm border',
        'transition-all duration-200 whitespace-nowrap shrink-0',
        active
          ? 'bg-charcoal text-gold-light border-charcoal'
          : 'bg-white text-muted border-border hover:border-charcoal/20 hover:text-charcoal'
      )}
    >
      {label}
    </button>
  )
}

// ─── Template card ────────────────────────────────────────────────────────────

function TemplateCard({ template, onSelect, disabled }: {
  template: LuxuryTemplate
  onSelect: () => void
  disabled: boolean
}) {
  const isInstant = template.plan !== undefined

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'text-left w-full bg-white border border-border rounded-sm p-4',
        'transition-all duration-200',
        'hover:border-gold/40 hover:shadow-sm',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1'
      )}
    >
      {/* Category + instant badge */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-[0.58rem] font-medium tracking-[0.16em] uppercase text-gold">
          {CATEGORY_LABELS[template.category]}
        </p>
        {isInstant && (
          <span className="text-[0.55rem] font-semibold tracking-[0.08em] uppercase text-green-600 bg-green-50 border border-green-200 px-1.5 py-px rounded-sm">
            Instant
          </span>
        )}
      </div>

      {/* Label */}
      <p className="font-serif text-[0.95rem] font-light text-charcoal leading-snug mb-1.5">
        {template.label}
      </p>

      {/* Description */}
      <p className="text-[0.7rem] text-muted font-light leading-relaxed mb-3">
        {template.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {template.previewTags.map((tag) => (
          <span
            key={tag}
            className="text-[0.58rem] font-medium tracking-[0.04em] bg-warm-gray border border-border text-charcoal-light px-1.5 py-px rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}
