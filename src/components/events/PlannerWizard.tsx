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

export const WIZARD_STEP_COUNT = 5

export const WIZARD_STEP_LABELS: Record<number, string> = {
  1: 'Event Type',
  2: 'Residents',
  3: 'Atmosphere',
  4: 'Budget & Scale',
  5: 'Your Plan',
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
    setStep(Math.min(step + 1, WIZARD_STEP_COUNT))
  }, [setStep, step])

  const back = useCallback(() => {
    setStep(Math.max(step - 1, 1))
  }, [setStep, step])

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
    <div
      className="border rounded-sm overflow-hidden"
      style={{
        backgroundColor: 'var(--card-bg, #FAFAF8)',
        borderColor: 'rgba(180, 166, 150, 0.28)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
      }}
    >

      {/* ── Progress header ─────────────────────────────────────────────── */}
      <WizardHeader currentStep={step} />

      {/* ── Step content ────────────────────────────────────────────────── */}
      <div className="px-5 sm:px-8 pt-7 pb-6 min-h-[300px] flex flex-col">

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
            budget={formData.budget as import('@/types').Budget | ''}
            attendance={formData.attendance as import('@/types').Attendance | ''}
            season={formData.season as import('@/types').Season | ''}
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
        <div
          className="flex items-center justify-between mt-auto pt-5"
          style={{ borderTop: 'var(--border-section, 0.5px solid rgba(180,166,150,0.30))' }}
        >
          <button
            type="button"
            onClick={back}
            disabled={step === 1 || isLoading}
            className={cn(
              'flex items-center gap-1.5 text-[0.7rem] font-medium tracking-[0.06em]',
              'transition-colors duration-150 px-1 py-2 min-h-[44px]',
              step === 1 || isLoading
                ? 'opacity-0 pointer-events-none'
                : 'text-[var(--stone,#8C8478)] hover:text-charcoal'
            )}
          >
            <ChevronLeft size={12} strokeWidth={1.5} />
            Back
          </button>

          {step < WIZARD_STEP_COUNT ? (
            <button
              type="button"
              onClick={next}
              disabled={isLoading || !canNext}
              title={!canNext ? 'Please complete all fields to continue' : undefined}
              className={cn(
                'flex items-center gap-1.5 text-[0.7rem] font-medium tracking-[0.06em]',
                'px-1 py-2 min-h-[44px] transition-colors duration-150',
                canNext
                  ? 'text-charcoal hover:text-gold'
                  : 'text-muted/30 cursor-not-allowed'
              )}
            >
              Continue
              <ChevronRight size={12} strokeWidth={1.5} />
            </button>
          ) : (
            <span />
          )}
        </div>

        {/* Start over */}
        {step > 1 && (
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={reset}
              className="text-[0.6rem] text-muted/25 hover:text-muted/50 transition-colors duration-200 tracking-wide"
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
    <div className="bg-charcoal px-5 sm:px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[0.6rem] font-medium uppercase shrink-0"
          style={{ letterSpacing: '0.14em', color: 'var(--gold, #B8955A)' }}
        >
          Step {currentStep} of {WIZARD_STEP_COUNT}
        </span>
        {/* Removed max-w cap — "Budget & Scale" no longer truncates */}
        <span className="text-[0.7rem] font-light text-white/50 truncate ml-4 text-right tracking-wide">
          {WIZARD_STEP_LABELS[currentStep]}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: WIZARD_STEP_COUNT }, (_, i) => i + 1).map((s) => {
          const isDone    = s < currentStep
          const isCurrent = s === currentStep
          return (
            <div
              key={s}
              className="transition-all duration-300"
              style={{
                width:        isCurrent ? '20px' : '3px',
                height:       isCurrent ? '3px'  : '3px',
                borderRadius: '9999px',
                backgroundColor: isCurrent
                  ? 'var(--gold, #B8955A)'
                  : isDone
                  ? 'rgba(184,149,90,0.40)'
                  : 'rgba(255,255,255,0.12)',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
