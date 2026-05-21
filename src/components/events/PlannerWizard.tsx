/**
 * PlannerWizard.tsx
 *
 * Step 1 of the guided planning flow implementation.
 * This file is the orchestrator only — it manages:
 *   - which step is active (1–5)
 *   - accumulated EventFormData across steps
 *   - next / back / reset navigation
 *   - callbacks to the parent (onGenerate, onLoadTemplate)
 *
 * Each step renders a placeholder until its UI is built in future steps.
 * The wizard is safe to mount and unmount without affecting any other
 * part of the app. All generation logic remains in useEventPlanner.
 *
 * Future step components will be imported here one at a time:
 *   StepCategory    → sets formData.eventType
 *   StepDemographic → sets formData.demographic
 *   StepAtmosphere  → maps to formData.venue + alcohol + season hint
 *   StepBudget      → sets formData.budget + attendance + season
 *   StepRoute       → chooses template vs AI generation
 */

import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { EventFormData } from '@/types'
import type { LuxuryTemplate } from '@/lib/templates'
import { cn } from '@/lib/utils'
import { StepBudget } from '@/components/events/wizard/StepBudget'
import { StepDemographic } from '@/components/events/wizard/StepDemographic'
import { StepAtmosphere } from '@/components/events/wizard/StepAtmosphere'
import { StepCategory } from '@/components/events/wizard/StepCategory'
import { StepRoute } from '@/components/events/wizard/StepRoute'
import type { Budget, Attendance, Season } from '@/types'

// ─── Constants ────────────────────────────────────────────────────────────────

export const WIZARD_STEP_COUNT = 5

export const WIZARD_STEP_LABELS: Record<number, string> = {
  1: 'Event Type',
  2: 'Residents',
  3: 'Atmosphere',
  4: 'Budget & Scale',
  5: 'Your Plan',
}

// ─── Default form state ───────────────────────────────────────────────────────
// Mirrors EventPlannerForm defaults so both paths produce consistent prompts.

const DEFAULT_FORM: EventFormData = {
  eventType:   '',
  budget:      '',
  attendance:  '',
  season:      '',
  venue:       'Indoor',
  alcohol:     'Full bar',
  demographic: '' as EventFormData['demographic'],  // blank — user picks in Step 2
  notes:       '',
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface PlannerWizardProps {
  /** Called when the user chooses Premium AI on Step 5 */
  onGenerate: (data: EventFormData) => void
  /** Called when the user picks a template on Step 5 */
  onLoadTemplate: (template: LuxuryTemplate) => void
  /** Whether a generation is currently in flight — disables navigation */
  isLoading: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PlannerWizard({
  onGenerate,
  onLoadTemplate,
  isLoading,
}: PlannerWizardProps) {
  const [step, setStep]         = useState<number>(1)
  const [formData, setFormData] = useState<EventFormData>(DEFAULT_FORM)
  // Tracks which atmosphere tile is selected (displayed state only).
  // The actual venue + alcohol values are stored in formData.
  const [atmosphereId, setAtmosphereId] = useState<string>('')

  // ── Field updater ──────────────────────────────────────────────────────────
  // Passed to each step so it can update any subset of EventFormData.

  const updateForm = useCallback(<K extends keyof EventFormData>(
    key: K,
    value: EventFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }, [])

  // Batch updater — used by StepAtmosphere which sets multiple fields at once.
  const updateFormBatch = useCallback((patch: Partial<EventFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }))
  }, [])

  // ── Navigation ─────────────────────────────────────────────────────────────

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, WIZARD_STEP_COUNT))
  }, [])

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1))
  }, [])

  const reset = useCallback(() => {
    setStep(1)
    setFormData(DEFAULT_FORM)
    setAtmosphereId('')
  }, [])

  // ── Step 5 actions ─────────────────────────────────────────────────────────

  const handleGenerate = useCallback(() => {
    onGenerate(formData)
  }, [formData, onGenerate])

  const handleLoadTemplate = useCallback((template: LuxuryTemplate) => {
    onLoadTemplate(template)
  }, [onLoadTemplate])

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white border border-border rounded-sm overflow-hidden">

      {/* Progress header */}
      <WizardHeader currentStep={step} />

      {/* Step content */}
      <div className="p-6 sm:p-8 min-h-[280px] flex flex-col">

        {/* ── Step placeholders — replaced one-by-one in future builds ── */}

        {step === 1 && (
          <StepCategory
            value={formData.eventType}
            onChange={(v) => updateForm('eventType', v)}
          />
        )}

        {step === 2 && (
          <StepDemographic
            value={formData.demographic}
            onChange={(v) => updateForm('demographic', v)}
          />
        )}

        {step === 3 && (
          <StepAtmosphere
            value={atmosphereId}
            onChange={({ id, venue, alcohol }) => {
              setAtmosphereId(id)
              updateFormBatch({ venue, alcohol })
            }}
          />
        )}

        {step === 4 && (
          <StepBudget
            budget={formData.budget}
            attendance={formData.attendance}
            season={formData.season}
            onBudget={(v)     => updateForm('budget', v)}
            onAttendance={(v) => updateForm('attendance', v)}
            onSeason={(v)     => updateForm('season', v)}
          />
        )}

        {step === 5 && (
          <StepRoute
            formData={formData}
            isLoading={isLoading}
            onGenerate={handleGenerate}
            onLoadTemplate={handleLoadTemplate}
          />
        )}

        {/* Navigation row — always at the bottom */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">

          {/* Back */}
          <button
            type="button"
            onClick={back}
            disabled={step === 1 || isLoading}
            className={cn(
              'flex items-center gap-1.5 text-[0.78rem] font-medium text-muted',
              'transition-colors duration-150 px-1',
              step === 1 || isLoading
                ? 'opacity-0 pointer-events-none'
                : 'hover:text-charcoal'
            )}
          >
            <ChevronLeft size={14} />
            Back
          </button>

          {/* Step counter */}
          <span className="text-[0.7rem] text-muted/60 font-light tabular-nums">
            {step} of {WIZARD_STEP_COUNT}
          </span>

          {/* Next — hidden on step 5 (StepRoute has its own action buttons) */}
          {step < WIZARD_STEP_COUNT ? (
            <button
              type="button"
              onClick={next}
              disabled={isLoading || (step === 1 && !formData.eventType) || (step === 2 && !formData.demographic) || (step === 3 && !atmosphereId) || (step === 4 && (!formData.budget || !formData.attendance || !formData.season))}
              title={(step === 1 && !formData.eventType) || (step === 2 && !formData.demographic) || (step === 3 && !atmosphereId) || (step === 4 && (!formData.budget || !formData.attendance || !formData.season)) ? 'Please complete all fields' : undefined}
              className="flex items-center gap-1.5 text-[0.78rem] font-medium text-charcoal hover:text-gold transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed px-1"
            >
              Next
              <ChevronRight size={14} />
            </button>
          ) : (
            /* Step 5: StepRoute handles its own buttons — just hold the layout */
            <span />
          )}
        </div>

        {/* Dev helper: reset button visible in all steps */}
        <div className="text-center mt-3">
          <button
            type="button"
            onClick={reset}
            className="text-[0.65rem] text-muted/40 hover:text-muted transition-colors"
          >
            Start over
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Progress bar + step label header.
 * Replaced when real step UIs are built — this is temporary scaffolding.
 */
function WizardHeader({ currentStep }: { currentStep: number }) {
  return (
    <div className="bg-charcoal px-6 py-4">
      {/* Step label row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[0.67rem] font-medium tracking-[0.14em] uppercase text-gold">
          Step {currentStep}
        </span>
        <span className="text-[0.72rem] font-light text-gold-light">
          {WIZARD_STEP_LABELS[currentStep]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-px bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold/60 transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / WIZARD_STEP_COUNT) * 100}%` }}
        />
      </div>

      {/* Step dot indicators */}
      <div className="flex justify-between mt-2.5">
        {Array.from({ length: WIZARD_STEP_COUNT }, (_, i) => i + 1).map((s) => (
          <span
            key={s}
            className={cn(
              'text-[0.6rem] font-medium transition-colors duration-300',
              s === currentStep
                ? 'text-gold'
                : s < currentStep
                ? 'text-gold/40'
                : 'text-white/15'
            )}
          >
            {WIZARD_STEP_LABELS[s]}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Placeholder shown for each step until its real UI is built.
 * Displays the step intent, what's coming, and any accumulated value.
 * Removed step-by-step as real step components replace it.
 */
function StepPlaceholder({
  step,
  title,
  description,
  hint,
  currentValue,
}: {
  step: number
  title: string
  description: string
  hint: string
  currentValue?: string
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-8 gap-4">
      <div className="w-10 h-10 rounded-sm border border-gold/25 flex items-center justify-center">
        <span className="font-serif text-gold text-lg font-light">{step}</span>
      </div>
      <div>
        <h3 className="font-serif text-xl font-light text-charcoal mb-1">{title}</h3>
        <p className="text-[0.82rem] text-muted font-light">{description}</p>
      </div>
      {currentValue && (
        <div className="text-[0.72rem] bg-warm-gray border border-border px-3 py-1.5 rounded-sm text-charcoal-light">
          Current: <span className="font-medium">{currentValue}</span>
        </div>
      )}
      <p className="text-[0.7rem] text-gold/60 font-light italic mt-2 max-w-xs">{hint}</p>
    </div>
  )
}
