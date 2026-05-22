/**
 * StepAtmosphere.tsx — Step 3 of the PlannerWizard
 *
 * Single choice: what feeling should this event create?
 *
 * Unlike other steps, atmosphere is NOT a direct EventFormData field.
 * It is a mapping layer that sets three fields at once:
 *   venue    → EventFormData.venue
 *   alcohol  → EventFormData.alcohol
 *
 * Season is intentionally NOT set here — it is collected in Step 4 (StepBudget)
 * so the user can confirm it explicitly. Atmosphere gives a season hint in the
 * cue pills for context only.
 *
 * The mapping is shown transparently to the user via the "Sets" row on each tile
 * so they understand exactly what the choice does.
 */

import type { VenueSetting, AlcoholService } from '@/types'
import { cn } from '@/lib/utils'

// ─── Props ────────────────────────────────────────────────────────────────────

interface StepAtmosphereProps {
  /** Currently selected atmosphere id, or '' if none */
  value:    string
  onChange: (patch: { id: string; venue: VenueSetting; alcohol: AlcoholService }) => void
}

// ─── Atmosphere option type ───────────────────────────────────────────────────

interface AtmosphereOption {
  id:      string           // internal key
  label:   string           // display name
  sub:     string           // one-line descriptor
  glyph:   string           // decorative character
  cues:    string[]         // 3 planning cues shown as pills
  // The fields this selection sets
  venue:   VenueSetting
  alcohol: AlcoholService
  // Transparent mapping labels shown on the tile
  sets:    string[]
}

// ─── Options ──────────────────────────────────────────────────────────────────

const ATMOSPHERE_OPTIONS: AtmosphereOption[] = [
  {
    id:      'upscale-social',
    label:   'Upscale Social',
    sub:     'Polished, cocktail-forward, elegant',
    glyph:   '◆',
    cues:    ['Full bar service', 'Indoor setting', 'Formal presentation'],
    venue:   'Indoor',
    alcohol: 'Full bar',
    sets:    ['Indoor', 'Full Bar'],
  },
  {
    id:      'relaxed-luxury',
    label:   'Relaxed Luxury',
    sub:     'Refined but comfortable, wine-led',
    glyph:   '◇',
    cues:    ['Wine & beer', 'Indoor or outdoor', 'Unhurried pace'],
    venue:   'Indoor & Outdoor',
    alcohol: 'Wine & beer only',
    sets:    ['Indoor & Outdoor', 'Wine & Beer'],
  },
  {
    id:      'family-focused',
    label:   'Family Focused',
    sub:     'All-ages, inclusive, welcoming',
    glyph:   '○',
    cues:    ['Non-alcoholic', 'Indoor space', 'Kid-friendly flow'],
    venue:   'Indoor',
    alcohol: 'No alcohol',
    sets:    ['Indoor', 'Non-Alcoholic'],
  },
  {
    id:      'wellness-focused',
    label:   'Wellness Focused',
    sub:     'Calm, restorative, mindful',
    glyph:   '◎',
    cues:    ['Non-alcoholic', 'Open-air setting', 'Morning or midday'],
    venue:   'Indoor & Outdoor',
    alcohol: 'No alcohol',
    sets:    ['Indoor & Outdoor', 'Non-Alcoholic'],
  },
  {
    id:      'networking-focused',
    label:   'Networking Focused',
    sub:     'Professional, energised, purposeful',
    glyph:   '◈',
    cues:    ['Full bar service', 'Indoor setting', 'Standing format'],
    venue:   'Indoor',
    alcohol: 'Full bar',
    sets:    ['Indoor', 'Full Bar'],
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function StepAtmosphere({ value, onChange }: StepAtmosphereProps) {
  return (
    <div className="flex flex-col gap-3">

      {/* Instruction */}
      <p className="text-[0.78rem] text-muted font-light mb-1">
        Choose the feeling you want residents to experience. This sets the venue and beverage style automatically.
      </p>

      {/* Tile grid — 2 cols on mobile, still readable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {ATMOSPHERE_OPTIONS.map((opt) => {
          const selected = value === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange({ id: opt.id, venue: opt.venue, alcohol: opt.alcohol })}
              className={cn(
                'text-left px-5 py-4 rounded-sm border transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                selected
                  ? 'border-gold bg-gold/6'
                  : 'border-border bg-white hover:border-gold/40 hover:bg-warm-gray'
              )}
            >
              {/* Top row */}
              <div className="flex items-start gap-3 mb-2.5">
                <span
                  className={cn(
                    'text-[1rem] leading-none mt-0.5 shrink-0 transition-colors',
                    selected ? 'text-gold' : 'text-muted/40'
                  )}
                  aria-hidden
                >
                  {opt.glyph}
                </span>
                <div className="flex-1">
                  <p className="text-[0.9rem] font-medium leading-snug text-charcoal">
                    {opt.label}
                  </p>
                  <p className="text-[0.72rem] font-light text-muted leading-snug mt-0.5">
                    {opt.sub}
                  </p>
                </div>
                {selected && (
                  <span className="text-[0.62rem] font-medium text-green-600 shrink-0 mt-0.5">
                    ✓
                  </span>
                )}
              </div>

              {/* Planning cue pills */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {opt.cues.map((cue) => (
                  <span
                    key={cue}
                    className={cn(
                      'text-[0.65rem] font-light px-2 py-0.5 rounded-sm border transition-colors duration-200',
                      selected
                        ? 'border-gold/30 bg-gold/8 text-charcoal-light'
                        : 'border-border bg-warm-gray text-muted'
                    )}
                  >
                    {cue}
                  </span>
                ))}
              </div>

              {/* Transparent mapping row — shows exactly what fields are set */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-border/60">
                <span className="text-[0.62rem] text-muted/50 font-light uppercase tracking-[0.08em]">
                  Sets:
                </span>
                {opt.sets.map((s) => (
                  <span
                    key={s}
                    className={cn(
                      'text-[0.62rem] font-medium px-1.5 py-0.5 rounded-sm',
                      selected
                        ? 'bg-charcoal text-gold-light'
                        : 'bg-charcoal/8 text-charcoal-light'
                    )}
                  >
                    {s}
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
