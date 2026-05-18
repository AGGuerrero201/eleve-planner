import { useState } from 'react'
import { Zap, ChevronDown, ChevronUp } from 'lucide-react'
import { LUXURY_TEMPLATES, type LuxuryTemplate } from '@/lib/templates'
import { cn } from '@/lib/utils'

interface TemplateSelectorProps {
  onSelect: (template: LuxuryTemplate) => void
  disabled?: boolean
}

const CATEGORY_LABELS: Record<LuxuryTemplate['category'], string> = {
  social:       'Social',
  wellness:     'Wellness',
  seasonal:     'Seasonal',
  family:       'Family',
  professional: 'Professional',
}

export function TemplateSelector({ onSelect, disabled = false }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-5">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between',
          'bg-charcoal text-gold-light px-5 py-3.5 rounded-sm',
          'text-[0.75rem] font-medium tracking-[0.1em] uppercase',
          'transition-opacity duration-200',
          'disabled:opacity-40',
          open ? 'rounded-b-none' : ''
        )}
      >
        <span className="flex items-center gap-2.5">
          <Zap size={13} className="text-gold" />
          Start from a luxury template
        </span>
        <span className="flex items-center gap-1.5 text-[0.68rem] text-gold/70 normal-case tracking-normal font-light">
          {open ? (
            <>Hide <ChevronUp size={13} /></>
          ) : (
            <>Browse {LUXURY_TEMPLATES.length} templates <ChevronDown size={13} /></>
          )}
        </span>
      </button>

      {/* Template grid */}
      {open && (
        <div className="border border-t-0 border-border rounded-b-sm bg-warm-gray p-4 animate-fade-up">
          <p className="text-[0.72rem] text-muted font-light mb-3 leading-relaxed">
            Each template is a complete, production-ready event plan. Select one to load it instantly — no AI call needed. You can still enhance it with Claude afterwards.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {LUXURY_TEMPLATES.map((template) => (
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

// ─── Individual template card ─────────────────────────────────────────────────

function TemplateCard({
  template,
  onSelect,
  disabled,
}: {
  template: LuxuryTemplate
  onSelect: () => void
  disabled: boolean
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'text-left w-full bg-white border border-border rounded-sm p-3.5',
        'transition-all duration-150',
        'hover:border-gold hover:shadow-sm hover:-translate-y-px',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1'
      )}
    >
      {/* Category */}
      <p className="text-[0.62rem] font-medium tracking-[0.14em] uppercase text-gold mb-1.5">
        {CATEGORY_LABELS[template.category]}
      </p>

      {/* Label */}
      <p className="font-serif text-[1rem] font-light text-charcoal leading-snug mb-1.5">
        {template.label}
      </p>

      {/* Description */}
      <p className="text-[0.75rem] text-muted font-light leading-snug mb-2.5">
        {template.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {template.previewTags.map((tag) => (
          <span
            key={tag}
            className="text-[0.65rem] font-medium tracking-[0.04em] bg-warm-gray border border-border text-charcoal-light px-1.5 py-0.5 rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}
