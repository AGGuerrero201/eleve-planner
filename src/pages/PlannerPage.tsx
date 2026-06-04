import { useState, useCallback } from 'react'
import { AlertTriangle, RefreshCw, CheckCircle2, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import type { EventFormData, SavedEvent, LoadingStep } from '@/types'
import { useEventPlanner } from '@/hooks/useEventPlanner'
import { useSavedEvents } from '@/hooks/useSavedEvents'
import { EventPlannerForm } from '@/components/events/EventPlannerForm'
import { EventPlanResult } from '@/components/events/EventPlanResult'
import { PlannerWizard } from '@/components/events/PlannerWizard'
import { PlannerEntry } from '@/components/events/PlannerEntry'
import { CollectionBrowser } from '@/components/events/CollectionBrowser'
import { Button } from '@/components/ui/Button'
import { SupabaseStatus } from '@/components/ui/SupabaseStatus'
import { cn } from '@/lib/utils'
import type { LuxuryTemplate } from '@/lib/templates'

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export function PlannerPage() {
  const { status, plan, error, retryCount, loadingSteps, generate, retry, reset, loadTemplate } = useEventPlanner()
  const { save, isSaved } = useSavedEvents()
  const [currentFormData, setCurrentFormData] = useState<EventFormData | null>(null)

  // ── Mode state ───────────────────────────────────────────────────────────
  // 'entry'     → show PlannerEntry choice
  // 'templates' → show CollectionBrowser
  // 'wizard'    → show PlannerWizard (guided)
  // 'classic'   → show EventPlannerForm
  const [mode, setMode] = useState<PlannerMode>('entry')

  // ── Wizard lifted state ──────────────────────────────────────────────────
  const [wizardFormData, setWizardFormData]         = useState<EventFormData>(DEFAULT_FORM)
  const [wizardStep, setWizardStep]                 = useState(1)
  const [wizardAtmosphereId, setWizardAtmosphereId] = useState('')
  const [wizardCollapsed, setWizardCollapsed]       = useState(false)

  // ── Shared handlers ──────────────────────────────────────────────────────

  const handleSave = async (event: SavedEvent): Promise<SavedEvent | null> => {
    return save(event)
  }

  const handleSelectTemplate = useCallback((template: LuxuryTemplate) => {
    setCurrentFormData(template.formData)
    if (template.plan) {
      loadTemplate(template.plan)
      setTimeout(() => {
        document.getElementById('plan-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    } else {
      void generate(template.formData)
      setTimeout(() => {
        document.getElementById('plan-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    }
  }, [loadTemplate, generate])

  // ── Wizard handlers ──────────────────────────────────────────────────────

  const handleWizardGenerate = useCallback((data: EventFormData) => {
    setCurrentFormData(data)
    setWizardFormData(data)
    void generate(data)
    setWizardCollapsed(true)
    setTimeout(() => {
      document.getElementById('plan-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
  }, [generate])

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

  // ── Classic form handler ─────────────────────────────────────────────────

  const handleClassicSubmit = (data: EventFormData) => {
    setCurrentFormData(data)
    void generate(data)
  }

  // ── Entry selection ──────────────────────────────────────────────────────

  const handleEntrySelect = (selected: 'templates' | 'custom') => {
    if (selected === 'templates') {
      setMode('templates')
    } else {
      setMode('wizard')
    }
  }

  const planIsSaved = plan !== null ? isSaved(plan.title, plan.tagline) : false
  const showResult  = status === 'success' && plan && currentFormData

  // ── Page title by mode ───────────────────────────────────────────────────

  const subtitle =
    mode === 'entry'     ? 'Choose your planning approach below.' :
    mode === 'templates' ? 'Browse curated collections and select an experience.' :
    mode === 'wizard'    ? 'Answer a few questions and we\'ll find the perfect event plan.' :
                           'Start from a template or fill in the form to generate a plan.'

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">

      <SupabaseStatus />

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-serif text-[2.25rem] font-light text-charcoal mb-2 leading-tight">
            Event Planner
          </h1>
          <p className="text-muted font-light text-[0.875rem] leading-relaxed max-w-sm">
            {subtitle}
          </p>
        </div>

        {/* Mode switcher — only visible after entry choice made */}
        {mode !== 'entry' && (
          <ModeToggle mode={mode} onSwitch={setMode} disabled={status === 'loading'} />
        )}
      </div>

      {/* ── Entry choice ─────────────────────────────────────────────────── */}
      {mode === 'entry' && (
        <PlannerEntry
          onSelect={handleEntrySelect}
          disabled={status === 'loading'}
        />
      )}

      {/* ── Collection browser ───────────────────────────────────────────── */}
      {mode === 'templates' && (
        <div className="mb-6">
          <CollectionBrowser
            onSelect={(template) => {
              handleSelectTemplate(template)
            }}
            onBack={() => setMode('entry')}
            disabled={status === 'loading'}
          />
        </div>
      )}

      {/* ── Guided wizard ────────────────────────────────────────────────── */}
      {mode === 'wizard' && (
        <>
          {wizardCollapsed && showResult ? (
            <div className="bg-white border border-border rounded-sm mb-5 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setWizardCollapsed(false)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-warm-gray transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[0.65rem] font-medium tracking-[0.16em] uppercase text-gold">
                    Event Profile
                  </span>
                  <span className="w-px h-3 bg-border" />
                  <span className="text-[0.8rem] font-light text-charcoal-light">
                    {wizardFormData.eventType || currentFormData?.eventType}
                    {(wizardFormData.season || currentFormData?.season)
                      ? ` · ${wizardFormData.season || currentFormData?.season}`
                      : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[0.65rem] text-muted font-light tracking-wide">Edit</span>
                  <ChevronDown size={12} className="text-muted" />
                </div>
              </button>
            </div>
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
              className="w-full flex items-center justify-center gap-2 py-3.5 text-[0.72rem] text-muted hover:text-charcoal transition-colors border border-border rounded-sm bg-white mb-5"
            >
              <ChevronUp size={12} /> Revise selections
            </button>
          )}
        </>
      )}

      {/* ── Classic form ─────────────────────────────────────────────────── */}
      {mode === 'classic' && (
        <EventPlannerForm
          onSubmit={handleClassicSubmit}
          isLoading={status === 'loading'}
        />
      )}

      {/* ── Loading ───────────────────────────────────────────────────────── */}
      {status === 'loading' && (
        <div className="mt-7 bg-white border border-border rounded-sm overflow-hidden animate-fade-up shadow-sm">
          <div className="bg-charcoal px-6 py-4 flex items-center gap-3">
            <Loader2 size={13} className="text-gold animate-spin" />
            <span className="text-[0.68rem] font-medium tracking-[0.16em] uppercase text-gold-light">
              Crafting your event plan
            </span>
          </div>
          <div className="p-7">
            <div className="space-y-3.5">
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
            <p className="text-[0.72rem] text-muted/50 font-light mt-6 pt-5 border-t border-border italic">
              Plan generated in seconds via AI
            </p>
          </div>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {status === 'error' && error && currentFormData && (
        <div className="mt-7 bg-white border border-red-200 rounded-sm overflow-hidden animate-fade-up">
          <div className="bg-red-50 px-5 py-3.5 flex items-center gap-2.5 border-b border-red-100">
            <AlertTriangle size={13} className="text-red-400 shrink-0" />
            <span className="text-[0.68rem] font-medium tracking-[0.12em] uppercase text-red-600">
              Generation failed
              {retryCount > 0 && ` · attempt ${retryCount + 1}`}
            </span>
          </div>
          <div className="p-7 text-center">
            <p className="text-[0.875rem] text-red-600 font-light mb-6 leading-relaxed">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="gold" size="sm" onClick={() => retry(currentFormData)}>
                <RefreshCw size={12} className="mr-2" />
                Try Again
              </Button>
              <Button variant="outline" size="sm" onClick={() => { handleWizardReset(); setMode('entry') }}>
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
            onRegenerate={() => void generate(currentFormData)}
            isSaved={planIsSaved}
          />
        </div>
      )}

    </div>
  )
}

// ─── Mode toggle ──────────────────────────────────────────────────────────────
// Discreet switcher shown after entry choice — lets user switch between modes

function ModeToggle({
  mode,
  onSwitch,
  disabled,
}: {
  mode:     PlannerMode
  onSwitch: (m: PlannerMode) => void
  disabled: boolean
}) {
  const options: { value: PlannerMode; label: string }[] = [
    { value: 'templates', label: 'Templates' },
    { value: 'wizard',    label: 'Guided' },
    { value: 'classic',   label: 'Classic' },
  ]

  return (
    <div className="flex items-center border border-border rounded-sm overflow-hidden shrink-0 mt-1.5">
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onSwitch(value)}
          disabled={disabled}
          className={cn(
            'text-[0.62rem] font-medium tracking-[0.08em] uppercase px-3 py-1.5',
            'border-r border-border last:border-r-0 transition-colors duration-150',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            mode === value
              ? 'bg-charcoal text-gold-light'
              : 'bg-white text-muted hover:bg-warm-gray hover:text-charcoal'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ status }: { status: LoadingStep['status'] }) {
  if (status === 'done')   return <CheckCircle2 size={14} className="text-green-500 shrink-0" />
  if (status === 'active') return <Loader2 size={14} className="text-gold animate-spin shrink-0" />
  return <span className="w-[14px] h-[14px] rounded-full border border-border/60 shrink-0" />
}
