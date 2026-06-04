import { useCallback } from 'react'
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

export const WIZARD_STEP_COUNT = 5

export const WIZARD_STEP_LABELS: Record<number, string> = {
  1: 'Event Type',
  2: 'Residents',
  3: 'Atmosphere',
  4: 'Budget & Scale',
  5: 'Your Plan',
}

const DEFAULT_FORM: EventFormData = {
  eventType:   '',
  budget:      '',
  attendance:  '',
  season:      '',
  venue:       'Indoor',
  alcohol:     'Full bar',
  demographic: '' as EventFormData['demographic'],
  notes:       '',
}

interface PlannerWizardProps {
  onGenerate:          (data: EventFormData) => void
  onLoadTemplate:      (template: LuxuryTemplate) => void
  onReset:             () => void
  isLoading:           boolean
  initialStep:         number
  initialFormData:     EventFormData
  initialAtmosphereId: string
  onStepChange:        (step: number) => void
  onFormChange:        (data: EventFormData) => void
  onAtmosphereChange:  (id: string) => void
}

export function PlannerWizard({
  onGenerate,
  onLoadTemplate,
  onReset,
  isLoading,
  initialStep,
  initialFormData,
  initialAtmosphereId,
  onStepChange,
  onFormChange,
  onAtmosphereChange,
}: PlannerWizardProps) {
  const step         = initialStep
  const formData     = initialFormData
  const atmosphereId = initialAtmosphereId
  const setStep      = onStepChange
  const setAtmosphereId = onAtmosphereChange

  const updateForm = useCallback(<K extends keyof EventFormData>(
    key: K,
    value: EventFormData[K]
  ) => {
    onFormChange({ ...formData, [key]: value })
  }, [formData, onFormChange])

  const updateFormBatch = useCallback((patch: Partial<EventFormData>) => {
    onFormChange({ ...formData, ...patch })
  }, [formData, onFormChange])

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, WIZARD_STEP_COUNT))
  }, [setStep])

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1))
  }, [setStep])

  const reset = useCallback(() => { onReset() }, [onReset])

  const handleGenerate = useCallback(() => {
    onGenerate(formData)
  }, [formData, onGenerate])

  const handleLoadTemplate = useCallback((template: LuxuryTemplate) => {
    onLoadTemplate(template)
  }, [onLoadTemplate])

  const canNext =
    (step === 1 && !!formData.eventType) ||
    (step === 2 && !!formData.demographic) ||
    (step === 3 && !!atmosphereId) ||
    (step === 4 && !!formData.budget && !!formData.attendance && !!formData.season)

  return (
    <div className="bg-white border border-border rounded-sm overflow-hidden shadow-sm">

      {/* ── Progress header ─────────────────────────────────────────────── */}
      <WizardHeader currentStep={step} />

      {/* ── Step content ────────────────────────────────────────────────── */}
      <div className="px-6 sm:px-8 pt-7 pb-6 min-h-[300px] flex flex-col">

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

        {/* ── Navigation ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">

          <button
            type="button"
            onClick={back}
            disabled={step === 1 || isLoading}
            className={cn(
              'flex items-center gap-1 text-[0.72rem] font-medium text-muted',
              'transition-colors duration-150 px-1 py-1',
              step === 1 || isLoading
                ? 'opacity-0 pointer-events-none'
                : 'hover:text-charcoal'
            )}
          >
            <ChevronLeft size={13} />
            Back
          </button>

          {step < WIZARD_STEP_COUNT ? (
            <button
              type="button"
              onClick={next}
              disabled={isLoading || !canNext}
              title={!canNext ? 'Please complete all fields to continue' : undefined}
              className={cn(
                'flex items-center gap-1 text-[0.72rem] font-medium px-1 py-1',
                'transition-colors duration-150',
                canNext
                  ? 'text-charcoal hover:text-gold'
                  : 'text-muted/30 cursor-not-allowed'
              )}
            >
              Next
              <ChevronRight size={13} />
            </button>
          ) : (
            <span />
          )}
        </div>

        {/* Start over */}
        {step > 1 && (
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={reset}
              className="text-[0.6rem] text-muted/25 hover:text-muted/50 transition-colors duration-200"
            >
              Start over
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── WizardHeader ─────────────────────────────────────────────────────────────

function WizardHeader({ currentStep }: { currentStep: number }) {
  return (
    <div className="bg-charcoal px-6 sm:px-8 py-4">
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[0.62rem] font-medium tracking-[0.16em] uppercase text-gold">
          Step {currentStep} of {WIZARD_STEP_COUNT}
        </span>
        <span className="text-[0.72rem] font-light text-gold-light/80 truncate ml-4 max-w-[160px] sm:max-w-none text-right">
          {WIZARD_STEP_LABELS[currentStep]}
        </span>
      </div>

      {/* Segmented progress bar */}
      <div className="flex items-center gap-1">
        {Array.from({ length: WIZARD_STEP_COUNT }, (_, i) => i + 1).map((s) => (
          <div
            key={s}
            className={cn(
              'h-px flex-1 transition-colors duration-300',
              s <= currentStep ? 'bg-gold/60' : 'bg-white/10'
            )}
          />
        ))}
      </div>
    </div>
  )
}
