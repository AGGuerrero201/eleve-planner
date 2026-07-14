import { useState, useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { AlertTriangle, RefreshCw, CheckCircle2, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import type { EventFormData, SavedEvent, LoadingStep } from '@/types'
import { useEventPlanner } from '@/hooks/useEventPlanner'
import { useSavedEvents } from '@/hooks/useSavedEvents'
import { useProperty } from '@/context/PropertyContext'
import { EventPlannerForm } from '@/components/events/EventPlannerForm'
import { EventPlanResult } from '@/components/events/EventPlanResult'
import { PlannerWizard } from '@/components/events/PlannerWizard'
import { PlannerEntry } from '@/components/events/PlannerEntry'
import { CollectionBrowser } from '@/components/events/CollectionBrowser'
import { LoadingDots } from '@/components/ui/LoadingDots'
import { Button } from '@/components/ui/Button'
import { SupabaseStatus } from '@/components/ui/SupabaseStatus'
import { cn } from '@/lib/utils'
import type { LuxuryTemplate } from '@/lib/templates'
import { isExperienceActive, emitExperienceSignal } from '@/experience/experienceStore'

type PlannerMode = 'entry' | 'templates' | 'wizard' | 'classic'

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

export function PlannerPage() {
  const { status, plan, error, retryCount, loadingSteps, generate, retry, reset, loadTemplate } = useEventPlanner()
  const { save, isSaved } = useSavedEvents()
  // Phase 3: read property context — nullable, generation works without it
  const { contextBlock, isSufficient, profile } = useProperty()

  // Deep links may open the planner directly in a specific mode
  // (e.g. the dashboard's "Browse Templates" quick action).
  const location = useLocation()
  const requestedMode = (location.state as { mode?: PlannerMode } | null)?.mode

  const [currentFormData, setCurrentFormData] = useState<EventFormData | null>(null)
  const [mode, setModeRaw] = useState<PlannerMode>(
    requestedMode === 'templates' || requestedMode === 'wizard' ? requestedMode : 'entry'
  )

  // A deep-linked mode (dashboard quick action) is itself a selection —
  // let the walkthrough advance past the entry step.
  useEffect(() => {
    if ((requestedMode === 'templates' || requestedMode === 'wizard') && isExperienceActive()) {
      emitExperienceSignal('planner_mode_selected')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Wrap mode changes so the Experience Elevé walkthrough can follow along.
  const setMode = useCallback((m: PlannerMode) => {
    setModeRaw(m)
    if ((m === 'templates' || m === 'wizard' || m === 'classic') && isExperienceActive()) {
      emitExperienceSignal('planner_mode_selected')
    }
  }, [])

  const [wizardFormData, setWizardFormData]         = useState<EventFormData>(DEFAULT_FORM)
  const [wizardStep, setWizardStep]                 = useState(1)
  const [wizardAtmosphereId, setWizardAtmosphereId] = useState('')
  const [wizardCollapsed, setWizardCollapsed]       = useState(false)

  const handleSave = async (event: SavedEvent): Promise<SavedEvent | null> => save(event)

  const handleSelectTemplate = useCallback((template: LuxuryTemplate) => {
    setCurrentFormData(template.formData ?? null)
    if (template.plan) {
      loadTemplate(template.plan)
      setTimeout(() => {
        document.getElementById('plan-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    } else {
      // Pass property context for template-triggered generation too
      void generate(template.formData!, contextBlock)
      setTimeout(() => {
        document.getElementById('plan-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    }
  }, [loadTemplate, generate, contextBlock])

  const handleWizardGenerate = useCallback((data: EventFormData) => {
    setCurrentFormData(data)
    setWizardFormData(data)
    void generate(data, contextBlock)
    setWizardCollapsed(true)
    setTimeout(() => {
      document.getElementById('plan-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
  }, [generate, contextBlock])

  const handleWizardTemplate = useCallback((template: LuxuryTemplate) => {
    setWizardCollapsed(true)
    handleSelectTemplate(template)
  }, [handleSelectTemplate])

  const handleWizardReset = useCallback(() => {
    setWizardFormData(DEFAULT_FORM)
    setWizardStep(1)
    setWizardAtmosphereId('')
    setWizardCollapsed(false)
    reset()
  }, [reset])

  const handleClassicSubmit = (data: EventFormData) => {
    setCurrentFormData(data)
    void generate(data, contextBlock)
  }

  const handleEntrySelect = (selected: 'templates' | 'custom', prefillEventType?: string) => {
    if (prefillEventType) {
      // A suggested starting point carries a concrete event type —
      // honor the promise by pre-filling the wizard with it.
      setWizardFormData({ ...DEFAULT_FORM, eventType: prefillEventType })
      setWizardStep(1)
      setMode('wizard')
      return
    }
    setMode(selected === 'templates' ? 'templates' : 'wizard')
  }

  const planIsSaved = plan !== null ? isSaved(plan.title, plan.tagline) : false
  const showResult  = status === 'success' && plan && currentFormData

  // Announce plan arrival to the walkthrough exactly once per plan
  const lastAnnouncedPlan = useRef<string | null>(null)
  useEffect(() => {
    if (!showResult || !plan) return
    const key = `${plan.title}::${plan.tagline}`
    if (lastAnnouncedPlan.current === key) return
    lastAnnouncedPlan.current = key
    if (isExperienceActive()) emitExperienceSignal('plan_ready')
  }, [showResult, plan])

  const subtitle =
    mode === 'entry'     ? 'Choose your planning approach below.' :
    mode === 'templates' ? 'Browse curated collections and select an experience.' :
    mode === 'wizard'    ? 'Answer a few questions and we\'ll find the perfect event plan.' :
                           'Start from a template or fill in the form to generate a plan.'

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">

      {!isExperienceActive() && <SupabaseStatus />}

      {/* Phase 3: property intelligence banner — shown only when profile is active */}
      {isSufficient && profile && (
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-sm mb-6"
          style={{
            backgroundColor: 'var(--charcoal)',
            border: '0.5px solid rgba(184,149,90,0.25)',
          }}
        >
          <span
            className="text-[0.6rem] font-medium uppercase shrink-0"
            style={{ letterSpacing: '0.14em', color: 'var(--gold)' }}
          >
            ✦ Property Intelligence Active
          </span>
          <span
            className="text-[0.72rem] font-light truncate"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Generating for {profile.propertyName} · {profile.city}, {profile.state}
          </span>
        </div>
      )}

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 gap-3">
        <div>
          <h1 className="font-serif text-[2.25rem] font-light text-charcoal mb-2 leading-tight">
            Event Planner
          </h1>
          <p className="text-muted font-light text-[0.875rem] leading-relaxed max-w-sm">
            {subtitle}
          </p>
        </div>
        {mode !== 'entry' && (
          <ModeToggle
            mode={mode}
            onSwitch={setMode}
            disabled={status === 'loading'}
            className="self-start sm:mt-1.5 sm:shrink-0"
          />
        )}
      </div>

      {/* ── Entry choice ─────────────────────────────────────────────────── */}
      {mode === 'entry' && (
        <PlannerEntry onSelect={handleEntrySelect} disabled={status === 'loading'} />
      )}

      {/* ── Collection browser ───────────────────────────────────────────── */}
      {mode === 'templates' && (
        <div className="mb-6">
          <CollectionBrowser
            onSelect={handleSelectTemplate}
            onBack={() => setMode('entry')}
            disabled={status === 'loading'}
          />
        </div>
      )}

      {/* ── Guided wizard ────────────────────────────────────────────────── */}
      {mode === 'wizard' && (
        <>
          {wizardCollapsed && showResult ? (
            <button
              type="button"
              onClick={() => setWizardCollapsed(false)}
              className="w-full flex items-center justify-between px-5 py-4 mb-5 rounded-sm transition-colors duration-200 min-h-[52px]"
              style={{
                backgroundColor: 'var(--card-bg, #FAFAF8)',
                border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="text-[0.62rem] font-medium tracking-[0.16em] uppercase shrink-0"
                  style={{ color: 'var(--gold, #B8955A)' }}
                >
                  Event Profile
                </span>
                <span className="w-px h-3 bg-border shrink-0" />
                <span className="text-[0.8rem] font-light text-charcoal-light truncate">
                  {wizardFormData.eventType || currentFormData?.eventType}
                  {(wizardFormData.season || currentFormData?.season)
                    ? ` · ${wizardFormData.season || currentFormData?.season}`
                    : ''}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[0.62rem] text-muted font-light tracking-wide">Revise</span>
                <ChevronDown size={11} className="text-muted" strokeWidth={1.5} />
              </div>
            </button>
          ) : wizardCollapsed ? null : (
            <PlannerWizard
              onGenerate={handleWizardGenerate}
              onLoadTemplate={handleWizardTemplate}
              onReset={handleWizardReset}
              isLoading={status === 'loading'}
              initialStep={wizardStep}
              initialFormData={wizardFormData}
              initialAtmosphereId={wizardAtmosphereId}
              onStepChange={setWizardStep}
              onFormChange={setWizardFormData}
              onAtmosphereChange={setWizardAtmosphereId}
            />
          )}

          {wizardCollapsed && !showResult && (
            <button
              type="button"
              onClick={() => setWizardCollapsed(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-[0.72rem] text-muted hover:text-charcoal transition-colors rounded-sm mb-5 min-h-[44px]"
              style={{
                border: 'var(--card-border)',
                backgroundColor: 'var(--card-bg, #FAFAF8)',
              }}
            >
              <ChevronUp size={11} strokeWidth={1.5} /> Revise selections
            </button>
          )}
        </>
      )}

      {/* ── Classic form ─────────────────────────────────────────────────── */}
      {mode === 'classic' && (
        <EventPlannerForm onSubmit={handleClassicSubmit} isLoading={status === 'loading'} />
      )}

      {/* ── Loading ───────────────────────────────────────────────────────── */}
      {status === 'loading' && (
        <div
          className="mt-7 rounded-sm overflow-hidden animate-fade-up"
          style={{
            backgroundColor: 'var(--card-bg, #FAFAF8)',
            border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
            boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div className="bg-charcoal px-6 py-4 flex items-center gap-3">
            <Loader2 size={12} className="text-gold animate-spin" strokeWidth={1.5} />
            <span
              className="text-[0.62rem] font-medium uppercase"
              style={{ letterSpacing: '0.16em', color: 'var(--gold-light, #E8D5B0)' }}
            >
              {isSufficient ? `Crafting your event for ${profile?.propertyName ?? 'your property'}` : 'Crafting your event plan'}
            </span>
          </div>
          <div className="p-6 sm:p-7">
            <div className="space-y-3.5 mb-6">
              {loadingSteps.map((step: LoadingStep) => (
                <div key={step.id} className="flex items-center gap-3">
                  <StepIndicator status={step.status} />
                  <span className={cn(
                    'text-[0.85rem] font-light transition-colors duration-300',
                    step.status === 'active'  && 'text-charcoal font-normal',
                    step.status === 'done'    && 'text-muted',
                    step.status === 'pending' && 'text-muted/40',
                  )}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <LoadingDots label="" />
            <p
              className="text-[0.7rem] text-muted/40 font-light mt-2 text-center italic"
              style={{ borderTop: 'var(--border-section)', paddingTop: '16px' }}
            >
              Usually takes under a minute
            </p>
          </div>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {status === 'error' && error && currentFormData && (
        <div className="mt-7 rounded-sm overflow-hidden animate-fade-up border border-red-200">
          <div className="bg-red-50 px-5 py-3.5 flex items-center gap-2.5 border-b border-red-100">
            <AlertTriangle size={13} className="text-red-400 shrink-0" />
            <span className="text-[0.65rem] font-medium tracking-[0.12em] uppercase text-red-600">
              Generation failed
              {retryCount > 0 && ` · attempt ${retryCount + 1}`}
            </span>
          </div>
          <div className="p-7 text-center bg-white">
            <p className="text-[0.875rem] text-red-600 font-light mb-6 leading-relaxed">{error}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="gold" size="sm" className="w-full sm:w-auto" onClick={() => retry(currentFormData, contextBlock)}>
                <RefreshCw size={12} className="mr-2" />
                Try Again
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => { handleWizardReset(); setMode('entry') }}>
                Start Over
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success ──────────────────────────────────────────────────────── */}
      {showResult && (
        <div className="mt-7 animate-fade-up" id="plan-result">
          <EventPlanResult
            plan={plan}
            formData={currentFormData}
            onSave={handleSave}
            onRegenerate={() => void retry(currentFormData, contextBlock)}
            isSaved={planIsSaved}
          />
        </div>
      )}

    </div>
  )
}

// ─── Mode toggle ──────────────────────────────────────────────────────────────

function ModeToggle({
  mode,
  onSwitch,
  disabled,
  className,
}: {
  mode:      PlannerMode
  onSwitch:  (m: PlannerMode) => void
  disabled:  boolean
  className?: string
}) {
  const options: { value: PlannerMode; label: string }[] = [
    { value: 'templates', label: 'Templates' },
    { value: 'wizard',    label: 'Guided' },
    { value: 'classic',   label: 'Classic' },
  ]

  return (
    <div
      className={cn('flex items-center rounded-sm overflow-hidden', className)}
      style={{ border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))' }}
    >
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onSwitch(value)}
          disabled={disabled}
          className={cn(
            'text-[0.62rem] font-medium tracking-[0.10em] uppercase px-3 py-2 min-h-[36px]',
            'border-r last:border-r-0 transition-colors duration-150',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            mode === value
              ? 'bg-charcoal text-gold-light border-charcoal'
              : 'bg-[var(--card-bg,#FAFAF8)] text-[var(--stone,#8C8478)] hover:bg-warm-gray hover:text-charcoal border-[rgba(180,166,150,0.20)]'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function StepIndicator({ status }: { status: LoadingStep['status'] }) {
  if (status === 'done')   return <CheckCircle2 size={14} className="text-green-500 shrink-0" strokeWidth={1.5} />
  if (status === 'active') return <Loader2 size={14} className="text-gold animate-spin shrink-0" strokeWidth={1.5} />
  return (
    <span
      className="w-[14px] h-[14px] rounded-full shrink-0 border"
      style={{ borderColor: 'rgba(180,166,150,0.40)' }}
    />
  )
}
