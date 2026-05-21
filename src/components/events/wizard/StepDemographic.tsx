/**
 * StepDemographic.tsx — Step 2 of the PlannerWizard
 *
 * Single choice: who is this event designed for?
 *   demographic → EventFormData.demographic
 *
 * Four large tiles, one per demographic.
 * Each tile shows a label, age/style descriptor, and 3 planning cues
 * so property managers understand how the choice shapes the plan.
 * Required before Next is enabled (enforced in PlannerWizard).
 */

import type { ResidentDemo } from '@/types'
import { cn } from '@/lib/utils'

// ─── Props ────────────────────────────────────────────────────────────────────

interface StepDemographicProps {
  value:    ResidentDemo | ''
  onChange: (v: ResidentDemo) => void
}

// ─── Demographic tile data ────────────────────────────────────────────────────

interface DemoOption {
  value:    ResidentDemo
  label:    string
  sub:      string          // age / lifestyle descriptor
  cues:     string[]        // 3 planning cues shown as pills
  glyph:    string          // decorative character, no icon library needed
}

const DEMO_OPTIONS: DemoOption[] = [
  {
    value: 'Young professionals (25–35)',
    label: 'Young Professionals',
    sub:   '25 – 35',
    cues:  ['Late-evening start', 'Craft cocktails', 'Social & networking'],
    glyph: '◆',
  },
  {
    value: 'Mixed ages, family-oriented',
    label: 'Families',
    sub:   'All ages welcome',
    cues:  ['Early evening (4–7 PM)', 'Kid-friendly activations', 'Casual catering'],
    glyph: '◇',
  },
  {
    value: 'Mature residents (50+)',
    label: 'Mature Residents',
    sub:   '50 +',
    cues:  ['Daytime or early evening', 'Seated comfort', 'Classic programming'],
    glyph: '○',
  },
  {
    value: 'Mixed demographic',
    label: 'Mixed Community',
    sub:   'Whole building',
    cues:  ['Tiered programming zones', 'Something for everyone', 'Flexible timing'],
    glyph: '◉',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function StepDemographic({ value, onChange }: StepDemographicProps) {
  return (
    <div className="flex flex-col gap-3">

      {/* Instruction */}
      <p className="text-[0.78rem] text-muted font-light mb-1">
        Your selection shapes the timing, tone, catering style, and programming of the entire plan.
      </p>

      {/* 2×2 tile grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {DEMO_OPTIONS.map((opt) => {
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                'text-left px-5 py-4 rounded-sm border transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                selected
                  ? 'border-gold bg-gold/6'
                  : 'border-border bg-white hover:border-gold/40 hover:bg-warm-gray'
              )}
            >
              {/* Top row: glyph + label + sub */}
              <div className="flex items-start gap-3 mb-3">
                <span
                  className={cn(
                    'text-[1rem] leading-none mt-0.5 shrink-0 transition-colors',
                    selected ? 'text-gold' : 'text-muted/40'
                  )}
                  aria-hidden
                >
                  {opt.glyph}
                </span>
                <div>
                  <p className={cn(
                    'text-[0.9rem] font-medium leading-snug transition-colors',
                    selected ? 'text-charcoal' : 'text-charcoal'
                  )}>
                    {opt.label}
                  </p>
                  <p className="text-[0.72rem] font-light text-muted leading-snug mt-0.5">
                    {opt.sub}
                  </p>
                </div>

                {/* Selected indicator */}
                {selected && (
                  <span className="ml-auto text-[0.62rem] font-medium text-green-600 shrink-0 mt-0.5">
                    ✓
                  </span>
                )}
              </div>

              {/* Planning cue pills */}
              <div className="flex flex-wrap gap-1.5">
                {opt.cues.map((cue) => (
                  <span
                    key={cue}
                    className={cn(
                      'text-[0.65rem] font-light px-2 py-0.5 rounded-sm border',
                      'transition-colors duration-150',
                      selected
                        ? 'border-gold/30 bg-gold/8 text-charcoal-light'
                        : 'border-border bg-warm-gray text-muted'
                    )}
                  >
                    {cue}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>

    </div>
  )
}
