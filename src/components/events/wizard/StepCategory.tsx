/**
 * StepCategory.tsx — Step 1 of the PlannerWizard
 */

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepCategoryProps {
  value:    string
  onChange: (v: string) => void
}

interface EventCategory {
  id:         string
  label:      string
  glyph:      string
  sub:        string
  eventTypes: EventTypeOption[]
}

interface EventTypeOption {
  value: string
  desc:  string
}

const CATEGORIES: EventCategory[] = [
  {
    id:    'social',
    label: 'Social Evenings',
    glyph: '◆',
    sub:   'Cocktails, wine, and curated gatherings',
    eventTypes: [
      { value: 'Cocktail Reception',      desc: 'Polished, passed appetisers, full bar' },
      { value: 'Rooftop Social',          desc: 'Open-air, golden hour, skyline views' },
      { value: 'Wine & Cheese Evening',   desc: 'Guided tasting, artisan boards' },
      { value: 'Brunch Gathering',        desc: 'Morning elegance, mimosas, light fare' },
      { value: 'Bourbon & Cigar Evening', desc: 'Intimate, spirit-forward, mature' },
    ],
  },
  {
    id:    'seasonal',
    label: 'Seasonal & Poolside',
    glyph: '◎',
    sub:   'Calendar moments and outdoor celebrations',
    eventTypes: [
      { value: 'Holiday Party',         desc: 'Festive, all-building, full production' },
      { value: 'Pool Party',            desc: 'Summer debut, music, cold drinks' },
      { value: 'Farmers Market Pop-up', desc: 'Artisan vendors, community feel' },
      { value: 'Movie Night',           desc: 'Outdoor cinema, popcorn, blankets' },
    ],
  },
  {
    id:    'wellness',
    label: 'Wellness & Culture',
    glyph: '◇',
    sub:   'Mindful, enriching, and restorative experiences',
    eventTypes: [
      { value: 'Wellness & Yoga Morning',       desc: 'Guided session, healthy refreshments' },
      { value: 'Cooking Class',                 desc: 'Chef-led, interactive, shareable' },
      { value: 'Art Exhibition & Gallery Walk', desc: 'Curated works, opening reception' },
    ],
  },
  {
    id:    'community',
    label: 'Community & Family',
    glyph: '○',
    sub:   'Inclusive programming for the whole building',
    eventTypes: [
      { value: 'Family Fun Day',   desc: 'All-ages, outdoor activities, casual catering' },
      { value: 'Networking Mixer', desc: 'Professional connections, conversation starters' },
      { value: 'Pet Social',       desc: 'Dog-friendly, laid-back, community warmth' },
    ],
  },
]

export function StepCategory({ value, onChange }: StepCategoryProps) {
  const [expanded, setExpanded] = useState<string>(() => {
    if (!value) return ''
    const cat = CATEGORIES.find((c) => c.eventTypes.some((e) => e.value === value))
    return cat?.id ?? ''
  })

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? '' : id))

  return (
    <div className="flex flex-col gap-2.5">

      <p className="text-[0.78rem] text-muted font-light mb-2 leading-relaxed">
        Choose a category, then select the specific event type that fits best.
      </p>

      {CATEGORIES.map((cat) => {
        const isOpen       = expanded === cat.id
        const hasSelection = cat.eventTypes.some((e) => e.value === value)

        return (
          <div
            key={cat.id}
            className={cn(
              'rounded-sm border overflow-hidden transition-all duration-200',
              isOpen
                ? 'border-gold/50 shadow-sm'
                : hasSelection
                ? 'border-gold/30'
                : 'border-border'
            )}
          >
            {/* Category header */}
            <button
              type="button"
              onClick={() => toggle(cat.id)}
              className={cn(
                'w-full flex items-center gap-3.5 px-5 py-4 text-left transition-colors duration-200',
                isOpen
                  ? 'bg-charcoal'
                  : hasSelection
                  ? 'bg-gold/5 hover:bg-gold/8'
                  : 'bg-white hover:bg-warm-gray'
              )}
            >
              <span
                className={cn(
                  'text-[0.9rem] leading-none shrink-0 transition-colors',
                  isOpen || hasSelection ? 'text-gold' : 'text-charcoal/20'
                )}
                aria-hidden
              >
                {cat.glyph}
              </span>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-[0.875rem] font-medium leading-snug',
                  isOpen ? 'text-gold-light' : 'text-charcoal'
                )}>
                  {cat.label}
                </p>
                <p className={cn(
                  'text-[0.7rem] font-light leading-snug mt-0.5 truncate',
                  isOpen ? 'text-white/35' : 'text-muted'
                )}>
                  {hasSelection && !isOpen
                    ? <span className="text-gold font-medium">{value}</span>
                    : cat.sub}
                </p>
              </div>

              <span className="shrink-0">
                {hasSelection && !isOpen
                  ? <span className="text-[0.6rem] font-semibold text-green-600">✓</span>
                  : isOpen
                  ? <ChevronUp size={13} className="text-gold/50" />
                  : <ChevronDown size={13} className="text-muted/30" />
                }
              </span>
            </button>

            {/* Event type tiles */}
            {isOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-border border-t border-gold/20">
                {cat.eventTypes.map((evt) => {
                  const selected = value === evt.value
                  return (
                    <button
                      key={evt.value}
                      type="button"
                      onClick={() => onChange(evt.value)}
                      className={cn(
                        'text-left px-5 py-3.5 transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-inset',
                        selected
                          ? 'bg-gold/8'
                          : 'bg-white hover:bg-warm-gray'
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="flex-1">
                          <p className="text-[0.82rem] font-medium text-charcoal leading-snug">
                            {evt.value}
                          </p>
                          <p className="text-[0.7rem] font-light text-muted leading-snug mt-0.5">
                            {evt.desc}
                          </p>
                        </div>
                        {selected && (
                          <span className="text-[0.6rem] font-semibold text-green-600 shrink-0 mt-0.5">✓</span>
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
