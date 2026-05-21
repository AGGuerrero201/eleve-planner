/**
 * StepRoute.tsx — Step 5 of the PlannerWizard
 *
 * The final step. Two paths side by side:
 *
 *   LEFT  — Template Baseline
 *     Shows 1–3 matched templates filtered by the chosen eventType.
 *     If no match, shows all templates.
 *     Clicking one calls onLoadTemplate(template) → instant plan, no Claude call.
 *
 *   RIGHT — Premium AI Generation
 *     One card. Shows a summary of the choices made in steps 1–4.
 *     Clicking generates via the Edge Function → full Claude plan.
 *
 * Both paths produce an EventPlan that flows into EventPlanResult unchanged.
 */

import { useMemo } from 'react'
import { Loader2, Zap, BookOpen } from 'lucide-react'
import { LUXURY_TEMPLATES, type LuxuryTemplate } from '@/lib/templates'
import type { EventFormData } from '@/types'
import { cn } from '@/lib/utils'

// ─── Props ────────────────────────────────────────────────────────────────────

interface StepRouteProps {
  formData:        EventFormData
  isLoading:       boolean
  onGenerate:      () => void
  onLoadTemplate:  (template: LuxuryTemplate) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns up to 3 templates matched by eventType, falling back to all. */
function matchTemplates(formData: EventFormData): LuxuryTemplate[] {
  const byEventType = LUXURY_TEMPLATES.filter(
    (t) => t.formData.eventType === formData.eventType
  )
  if (byEventType.length > 0) return byEventType.slice(0, 3)

  // Loose fallback: match by demographic
  const byDemo = LUXURY_TEMPLATES.filter(
    (t) => t.formData.demographic === formData.demographic
  )
  if (byDemo.length > 0) return byDemo.slice(0, 3)

  // Final fallback: first 3 templates
  return LUXURY_TEMPLATES.slice(0, 3)
}

/** One-line summary of what was chosen across steps 1–4. */
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

// ─── Component ────────────────────────────────────────────────────────────────

export function StepRoute({
  formData,
  isLoading,
  onGenerate,
  onLoadTemplate,
}: StepRouteProps) {
  const matched  = useMemo(() => matchTemplates(formData), [formData])
  const summary  = useMemo(() => buildSummary(formData), [formData])
  const hasExact = LUXURY_TEMPLATES.some((t) => t.formData.eventType === formData.eventType)

  return (
    <div className="flex flex-col gap-4">

      {/* Instruction */}
      <p className="text-[0.78rem] text-muted font-light">
        Your event profile is ready. Choose how you want your plan generated.
      </p>

      {/* Two-column route cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* ── LEFT: Template Baseline ─────────────────────────────────── */}
        <div className="flex flex-col border border-border rounded-sm overflow-hidden">
          {/* Card header */}
          <div className="bg-warm-gray px-4 py-3 border-b border-border flex items-center gap-2">
            <BookOpen size={13} className="text-charcoal-light shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-[0.75rem] font-medium text-charcoal leading-none">
                Template Baseline
              </p>
              <p className="text-[0.65rem] font-light text-muted mt-0.5">
                Instant — no AI call required
              </p>
            </div>
          </div>

          {/* Matched templates */}
          <div className="flex flex-col flex-1 divide-y divide-border">
            {matched.map((t) => (
              <button
                key={t.id}
                type="button"
                disabled={isLoading}
                onClick={() => onLoadTemplate(t)}
                className={cn(
                  'text-left px-4 py-3 transition-colors duration-150',
                  'hover:bg-gold/5 disabled:opacity-40 disabled:cursor-not-allowed',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-inset'
                )}
              >
                <p className="text-[0.82rem] font-medium text-charcoal leading-snug">
                  {t.label}
                </p>
                <p className="text-[0.7rem] font-light text-muted leading-snug mt-0.5">
                  {t.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {t.previewTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.62rem] font-light px-1.5 py-0.5 bg-warm-gray border border-border rounded-sm text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}

            {/* If no exact eventType match, add a note */}
            {!hasExact && (
              <p className="px-4 py-2 text-[0.67rem] text-muted/60 font-light italic">
                Showing similar templates — no exact match for {formData.eventType || 'your selection'}.
              </p>
            )}
          </div>
        </div>

        {/* ── RIGHT: Premium AI Generation ───────────────────────────── */}
        <div className="flex flex-col border border-charcoal rounded-sm overflow-hidden">
          {/* Card header */}
          <div className="bg-charcoal px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <Zap size={13} className="text-gold shrink-0" strokeWidth={1.5} />
            <div>
              <p className="text-[0.75rem] font-medium text-gold-light leading-none">
                Premium AI Plan
              </p>
              <p className="text-[0.65rem] font-light text-white/40 mt-0.5">
                Custom-generated by Claude Sonnet 4
              </p>
            </div>
          </div>

          {/* Summary of choices + generate button */}
          <div className="flex flex-col flex-1 px-4 py-3 justify-between gap-4">

            {/* Choices recap */}
            <div>
              <p className="text-[0.67rem] font-medium tracking-[0.1em] uppercase text-muted mb-2">
                Your selections
              </p>
              <div className="flex flex-col gap-1">
                {summary.map((line) => (
                  <div key={line} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gold/50 shrink-0" />
                    <span className="text-[0.78rem] font-light text-charcoal">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              type="button"
              onClick={onGenerate}
              disabled={isLoading}
              className={cn(
                'w-full flex items-center justify-center gap-2',
                'bg-gold text-white text-[0.78rem] font-medium tracking-[0.07em] uppercase',
                'py-2.5 rounded-sm transition-all duration-200',
                'hover:bg-gold-dark active:scale-[0.98]',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40'
              )}
            >
              {isLoading
                ? <><Loader2 size={13} className="animate-spin" /> Generating…</>
                : <>Generate My Plan</>
              }
            </button>

            <p className="text-[0.65rem] text-muted/50 font-light text-center -mt-2">
              Takes 20–40 seconds
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
