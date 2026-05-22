/**
 * StepCategory.tsx — Step 1 of the PlannerWizard
 *
 * Two-level selection:
 *   1. User picks a category (Social Evenings, Wellness & Culture, etc.)
 *   2. Category expands to reveal individual event type tiles
 *   3. Selecting an event type sets EventFormData.eventType
 *
 * Local state: which category is expanded (expandedCategory).
 * Parent state: the chosen eventType string via onChange.
 *
 * Required before Next is enabled (enforced in PlannerWizard).
 */

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Props ────────────────────────────────────────────────────────────────────

interface StepCategoryProps {
  value:    string       // current formData.eventType
  onChange: (v: string) => void
}

// ─── Category + event type data ───────────────────────────────────────────────

interface EventCategory {
  id:         string
  label:      string
  glyph:      string
  sub:        string
  eventTypes: EventTypeOption[]
}

interface EventTypeOption {
  value: string    // matches constants.ts EVENT_TYPES exactly
  desc:  string    // one short descriptor
}

const CATEGORIES: EventCategory[] = [
  {
    id:    'social',
    label: 'Social Evenings',
    glyph: '◆',
    sub:   'Cocktails, wine, and curated gatherings',
    eventTypes: [
      { value: 'Cocktail Reception',    desc: 'Polished, passed appetisers, full bar' },
      { value: 'Rooftop Social',        desc: 'Open-air, golden hour, skyline views' },
      { value: 'Wine & Cheese Evening', desc: 'Guided tasting, artisan boards' },
      { value: 'Brunch Gathering',      desc: 'Morning elegance, mimosas, light fare' },
      { value: 'Bourbon & Cigar Evening', desc: 'Intimate, spirit-forward, mature' },
    ],
  },
  {
    id:    'seasonal',
    label: 'Seasonal & Poolside',
    glyph: '◎',
    sub:   'Calendar moments and outdoor celebrations',
    eventTypes: [
      { value: 'Holiday Party',           desc: 'Festive, all-building, full production' },
      { value: 'Pool Party',              desc: 'Summer debut, music, cold drinks' },
      { value: 'Farmers Market Pop-up',   desc: 'Artisan vendors, community feel' },
      { value: 'Movie Night',             desc: 'Outdoor cinema, popcorn, blankets' },
    ],
  },
  {
    id:    'wellness',
    label: 'Wellness & Culture',
    glyph: '◇',
    sub:   'Mindful, enriching, and restorative experiences',
    eventTypes: [
      { value: 'Wellness & Yoga Morning',    desc: 'Guided session, healthy refreshments' },
      { value: 'Cooking Class',              desc: 'Chef-led, interactive, shareable' },
      { value: 'Art Exhibition & Gallery Walk', desc: 'Curated works, opening reception' },
    ],
  },
  {
    id:    'community',
    label: 'Community & Family',
    glyph: '○',
    sub:   'Inclusive programming for the whole building',
    eventTypes: [
      { value: 'Family Fun Day',    desc: 'All-ages, outdoor activities, casual catering' },
      { value: 'Networking Mixer',  desc: 'Professional connections, conversation starters' },
      { value: 'Pet Social',        desc: 'Dog-friendly, laid-back, community warmth' },
    ],
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function StepCategory({ value, onChange }: StepCategoryProps) {
  // Which category accordion is open. Auto-open the one containing the current selection.
  const [expanded, setExpanded] = useState<string>(() => {
    if (!value) return ''
    const cat = CATEGORIES.find((c) => c.eventTypes.some((e) => e.value === value))
    return cat?.id ?? ''
  })

  const toggle = (id: string) => {
    setExpanded((prev) => (prev === id ? '' : id))
  }

  return (
    <div className="flex flex-col gap-2">

      {/* Instruction */}
      <p className="text-[0.78rem] text-muted font-light mb-1">
        Choose a category, then select the specific event type that fits best.
      </p>

      {/* Category accordions */}
      {CATEGORIES.map((cat) => {
        const isOpen     = expanded === cat.id
        const hasSelection = cat.eventTypes.some((e) => e.value === value)

        return (
          <div
            key={cat.id}
            className={cn(
              'rounded-sm border overflow-hidden transition-all duration-200',
              isOpen
                ? 'border-gold/50'
                : hasSelection
                ? 'border-gold/30'
                : 'border-border'
            )}
          >
            {/* Category header — always visible */}
            <button
              type="button"
              onClick={() => toggle(cat.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors duration-200',
                isOpen
                  ? 'bg-charcoal'
                  : hasSelection
                  ? 'bg-gold/5 hover:bg-gold/8'
                  : 'bg-white hover:bg-warm-gray'
              )}
            >
              {/* Glyph */}
              <span
                className={cn(
                  'text-[0.95rem] leading-none shrink-0 transition-colors',
                  isOpen ? 'text-gold' : hasSelection ? 'text-gold' : 'text-charcoal/30'
                )}
                aria-hidden
              >
                {cat.glyph}
              </span>

              {/* Label + sub */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-[0.875rem] font-medium leading-snug',
                  isOpen ? 'text-gold-light' : 'text-charcoal'
                )}>
                  {cat.label}
                </p>
                <p className={cn(
                  'text-[0.7rem] font-light leading-snug mt-0.5 truncate',
                  isOpen ? 'text-white/40' : 'text-muted'
                )}>
                  {/* If a selection is made in this category, show it */}
                  {hasSelection && !isOpen
                    ? <span className="text-gold font-medium">{value}</span>
                    : cat.sub}
                </p>
              </div>

              {/* Check or chevron */}
              <span className="shrink-0">
                {hasSelection && !isOpen
                  ? <span className="text-[0.62rem] font-medium text-green-600">✓</span>
                  : isOpen
                  ? <ChevronUp size={14} className="text-gold/60" />
                  : <ChevronDown size={14} className="text-muted/40" />
                }
              </span>
            </button>

            {/* Event type tiles — only shown when expanded */}
            {isOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-border border-t border-border">
                {cat.eventTypes.map((evt) => {
                  const selected = value === evt.value
                  return (
                    <button
                      key={evt.value}
                      type="button"
                      onClick={() => onChange(evt.value)}
                      className={cn(
                        'text-left px-4 py-3 transition-colors duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-inset',
                        selected
                          ? 'bg-gold/8'
                          : 'bg-white hover:bg-warm-gray'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className={cn(
                            'text-[0.82rem] font-medium leading-snug',
                            selected ? 'text-charcoal' : 'text-charcoal'
                          )}>
                            {evt.value}
                          </p>
                          <p className="text-[0.7rem] font-light text-muted leading-snug mt-0.5">
                            {evt.desc}
                          </p>
                        </div>
                        {selected && (
                          <span className="text-[0.62rem] font-medium text-green-600 shrink-0 mt-0.5">
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

    </div>
  )
}