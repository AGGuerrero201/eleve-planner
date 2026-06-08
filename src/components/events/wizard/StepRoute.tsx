import { useMemo } from 'react'
import { Loader2, Zap, BookOpen, Sparkles } from 'lucide-react'
import { LUXURY_TEMPLATES, type LuxuryTemplate } from '@/lib/templates'
import { CATEGORY_LABELS } from '@/types/templates'
import { matchTemplates, hasStrongMatch } from '@/lib/templateMatching'
import type { EventFormData } from '@/types'
import { cn } from '@/lib/utils'

interface StepRouteProps {
  formData:       EventFormData
  isLoading:      boolean
  onGenerate:     () => void
  onLoadTemplate: (template: LuxuryTemplate) => void
}

function buildSummary(f: EventFormData): string[] {
  const lines: string[] = []
  if (f.eventType)   lines.push(f.eventType)
  if (f.demographic) lines.push(f.demographic)
  if (f.venue)       lines.push(f.venue)
  if (f.alcohol)     lines.push(f.alcohol)
  if (f.budget)      lines.push(f.budget)
  if (f.attendance)  lines.push(f.attendance)
  if (f.season)      lines.push(f.season)
  return lines
}

export function StepRoute({ formData, isLoading, onGenerate, onLoadTemplate }: StepRouteProps) {
  const matched     = useMemo(() => matchTemplates(formData, LUXURY_TEMPLATES, 3), [formData])
  const strongMatch = useMemo(() => hasStrongMatch(formData, LUXURY_TEMPLATES), [formData])
  const summary     = useMemo(() => buildSummary(formData), [formData])

  return (
    <div className="flex flex-col gap-5">

      <p className="text-[0.78rem] text-muted font-light leading-relaxed">
        Your event profile is ready. Choose how you want your plan generated.
      </p>

      {/* On mobile: AI panel first (order-first), templates second.
          On sm+:   templates left, AI right (original order restored). */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* ── Premium AI Generation — order-first on mobile ─────────── */}
        <div className="order-first sm:order-last flex flex-col border border-charcoal rounded-sm overflow-hidden">
          <div className="bg-charcoal px-4 py-3.5 border-b border-white/10 flex items-center gap-2.5">
            <Zap size={12} className="text-gold shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-[0.72rem] font-medium text-gold-light leading-none">
                Premium AI Plan
              </p>
              <p className="text-[0.62rem] font-light text-white/35 mt-0.5">
                AI-generated to your brief
              </p>
            </div>
          </div>

          <div className="flex flex-col flex-1 px-4 py-4 justify-between gap-5">
            <div>
              <p className="text-[0.62rem] font-medium tracking-[0.12em] uppercase text-muted mb-2.5">
                Your selections
              </p>
              <div className="flex flex-col gap-1.5">
                {summary.map((line) => (
                  <div key={line} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gold/40 shrink-0" />
                    <span className="text-[0.78rem] font-light text-charcoal">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={onGenerate}
                disabled={isLoading}
                className={cn(
                  'w-full flex items-center justify-center gap-2',
                  'bg-gold text-white text-[0.72rem] font-medium tracking-[0.1em] uppercase',
                  'py-3 rounded-sm transition-all duration-200',
                  'hover:bg-gold-dark active:scale-[0.98]',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40'
                )}
              >
                {isLoading
                  ? <><Loader2 size={12} className="animate-spin" /> Generating…</>
                  : <>Generate My Plan</>
                }
              </button>
              <p className="text-[0.62rem] text-muted/40 font-light text-center">
                Takes 20–40 seconds
              </p>
            </div>
          </div>
        </div>

        {/* ── Template Baseline — order-last on mobile ──────────────── */}
        <div className="order-last sm:order-first flex flex-col border border-border rounded-sm overflow-hidden">
          <div className="bg-warm-gray px-4 py-3.5 border-b border-border flex items-center gap-2.5">
            <BookOpen size={12} className="text-charcoal-light shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-[0.72rem] font-medium text-charcoal leading-none">
                Template Baseline
              </p>
              <p className="text-[0.62rem] font-light text-muted mt-0.5">
                {strongMatch ? 'Matched to your selections' : 'Similar templates shown'}
              </p>
            </div>
          </div>

          <div className="flex flex-col flex-1 divide-y divide-border">
            {matched.map((t) => {
              const isInstant = t.plan !== undefined
              return (
                <button
                  key={t.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => onLoadTemplate(t)}
                  className={cn(
                    'text-left px-4 py-3.5 transition-colors duration-150',
                    'hover:bg-gold/5 disabled:opacity-40 disabled:cursor-not-allowed',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-inset'
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[0.82rem] font-medium text-charcoal leading-snug">
                      {t.label}
                    </p>
                    {isInstant
                      ? <span className="text-[0.55rem] font-semibold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-sm shrink-0 uppercase tracking-wide">Instant</span>
                      : <span className="text-[0.55rem] font-semibold text-gold bg-gold/8 border border-gold/20 px-1.5 py-0.5 rounded-sm shrink-0 flex items-center gap-0.5 uppercase tracking-wide"><Sparkles size={7} />AI</span>
                    }
                  </div>
                  <p className="text-[0.7rem] font-light text-muted leading-snug mb-2">
                    {t.description}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[0.58rem] text-gold/70 uppercase tracking-[0.1em] font-medium">
                      {CATEGORY_LABELS[t.category]}
                    </span>
                    {t.previewTags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[0.58rem] text-muted bg-warm-gray border border-border px-1.5 py-px rounded-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}

            {!strongMatch && (
              <div className="px-4 py-3.5 bg-warm-gray/50">
                <p className="text-[0.68rem] text-muted font-light leading-relaxed">
                  No exact match — these are the closest in the library.
                </p>
                <p className="text-[0.67rem] text-gold/80 font-light mt-1">
                  For a precise plan, use Premium AI →
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
