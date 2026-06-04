import type { VenueSetting, AlcoholService } from '@/types'
import { cn } from '@/lib/utils'

interface StepAtmosphereProps {
  value:    string
  onChange: (patch: { id: string; venue: VenueSetting; alcohol: AlcoholService }) => void
}

interface AtmosphereOption {
  id:      string
  label:   string
  sub:     string
  glyph:   string
  cues:    string[]
  venue:   VenueSetting
  alcohol: AlcoholService
  sets:    string[]
}

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

export function StepAtmosphere({ value, onChange }: StepAtmosphereProps) {
  return (
    <div className="flex flex-col gap-3">

      <p className="text-[0.78rem] text-muted font-light mb-2 leading-relaxed">
        Choose the feeling you want residents to experience. This sets the venue and beverage style automatically.
      </p>

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
                  ? 'border-gold bg-gold/6 shadow-sm'
                  : 'border-border bg-white hover:border-gold/30 hover:bg-warm-gray'
              )}
            >
              {/* Top row */}
              <div className="flex items-start gap-3 mb-3">
                <span
                  className={cn(
                    'text-[0.95rem] leading-none mt-0.5 shrink-0 transition-colors',
                    selected ? 'text-gold' : 'text-muted/30'
                  )}
                  aria-hidden
                >
                  {opt.glyph}
                </span>
                <div className="flex-1">
                  <p className="text-[0.875rem] font-medium text-charcoal leading-snug">
                    {opt.label}
                  </p>
                  <p className="text-[0.7rem] font-light text-muted leading-snug mt-0.5">
                    {opt.sub}
                  </p>
                </div>
                {selected && (
                  <span className="text-[0.6rem] font-semibold text-green-600 shrink-0 mt-0.5">✓</span>
                )}
              </div>

              {/* Planning cue pills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {opt.cues.map((cue) => (
                  <span
                    key={cue}
                    className={cn(
                      'text-[0.62rem] font-light px-2 py-0.5 rounded-sm border transition-colors duration-200',
                      selected
                        ? 'border-gold/25 bg-gold/8 text-charcoal-light'
                        : 'border-border bg-warm-gray text-muted'
                    )}
                  >
                    {cue}
                  </span>
                ))}
              </div>

              {/* Transparent mapping row */}
              <div className="flex items-center gap-1.5 pt-2.5 border-t border-border/50">
                <span className="text-[0.58rem] text-muted/40 font-light uppercase tracking-[0.1em] shrink-0">
                  Sets:
                </span>
                {opt.sets.map((s) => (
                  <span
                    key={s}
                    className={cn(
                      'text-[0.6rem] font-medium px-1.5 py-0.5 rounded-sm transition-colors',
                      selected
                        ? 'bg-charcoal text-gold-light'
                        : 'bg-charcoal/6 text-charcoal-light'
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
