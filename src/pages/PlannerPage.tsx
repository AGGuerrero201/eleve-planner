import { useState, useCallback } from 'react'
import { AlertTriangle, RefreshCw, CheckCircle2, Loader2, LayoutList, Sparkles } from 'lucide-react'
import type { EventFormData, SavedEvent, LoadingStep } from '@/types'
import { useEventPlanner } from '@/hooks/useEventPlanner'
import { useSavedEvents } from '@/hooks/useSavedEvents'
import { EventPlannerForm } from '@/components/events/EventPlannerForm'
import { EventPlanResult } from '@/components/events/EventPlanResult'
import { TemplateSelector } from '@/components/events/TemplateSelector'
import { PlannerWizard } from '@/components/events/PlannerWizard'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { LuxuryTemplate } from '@/lib/templates'

export function PlannerPage() {
  const { status, plan, error, retryCount, loadingSteps, generate, retry, reset, loadTemplate } = useEventPlanner()
  const { save, isSaved } = useSavedEvents()
  const [currentFormData, setCurrentFormData] = useState<EventFormData | null>(null)

  // ── wizardMode toggle ───────────────────────────────────────────────────────
  // true  = guided wizard flow (new)
  // false = classic form + template selector (existing, always preserved)
  // Defaults to wizard so new users experience the guided flow.
  // Power users can switch back instantly via the toggle in the header.

  const [wizardMode, setWizardMode] = useState(true)

  // ── Shared handlers (used by both wizard and classic form) ──────────────────

  const handleSubmit = (data: EventFormData) => {
    setCurrentFormData(data)
    void generate(data)
  }

  const handleSelectTemplate = useCallback((template: LuxuryTemplate) => {
    setCurrentFormData(template.formData)
    loadTemplate(template.plan)
    setTimeout(() => {
      document.getElementById('plan-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }, [loadTemplate])

  const handleSave = async (event: SavedEvent): Promise<SavedEvent | null> => {
    return save(event)
  }

  // ── Wizard-specific handlers ────────────────────────────────────────────────

  // Called by PlannerWizard Step 5 "Generate Plan"
  const handleWizardGenerate = useCallback((data: EventFormData) => {
    setCurrentFormData(data)
    void generate(data)
    // Scroll to result after generation starts
    setTimeout(() => {
      document.getElementById('plan-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }, [generate])

  // Called by PlannerWizard Step 5 "Use Template"
  const handleWizardTemplate = useCallback((template: LuxuryTemplate) => {
    handleSelectTemplate(template)
  }, [handleSelectTemplate])

  const planIsSaved = plan !== null ? isSaved(plan.title, plan.tagline) : false

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      {/* ── Page header with mode toggle ─────────────────────────────────── */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-serif text-4xl font-light text-charcoal mb-2">Event Planner</h1>
          <p className="text-muted font-light text-sm leading-relaxed">
            {wizardMode
              ? 'Answer a few questions and we\'ll find the perfect event plan.'
              : 'Start from a template for an instant plan, or fill in the form to generate one.'}
          </p>
        </div>

        {/* Mode toggle — unobtrusive, top-right */}
        <button
          type="button"
          onClick={() => setWizardMode((v) => !v)}
          disabled={status === 'loading'}
          className={cn(
            'flex items-center gap-1.5 text-[0.7rem] font-medium tracking-[0.06em] uppercase',
            'border px-3 py-1.5 rounded-sm transition-all duration-200 shrink-0 mt-1',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            wizardMode
              ? 'border-border text-muted hover:border-charcoal-light hover:text-charcoal bg-white'
              : 'border-gold/30 text-gold bg-gold/5 hover:bg-gold/10'
          )}
          title={wizardMode ? 'Switch to classic form' : 'Switch to guided wizard'}
        >
          {wizardMode
            ? <><LayoutList size={12} /> Classic Form</>
            : <><Sparkles size={12} /> Guided Flow</>}
        </button>
      </div>

      {/* ── Wizard mode (new) ─────────────────────────────────────────────── */}
      {wizardMode && (
        <PlannerWizard
          onGenerate={handleWizardGenerate}
          onLoadTemplate={handleWizardTemplate}
          isLoading={status === 'loading'}
        />
      )}

      {/* ── Classic mode (existing — fully preserved) ─────────────────────── */}
      {!wizardMode && (
        <>
          {/* Template selector */}
          <TemplateSelector
            onSelect={handleSelectTemplate}
            disabled={status === 'loading'}
          />

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <hr className="flex-1 border-border" />
            <span className="text-[0.7rem] text-muted uppercase tracking-[0.12em] font-light shrink-0">
              or generate with AI
            </span>
            <hr className="flex-1 border-border" />
          </div>

          {/* Classic form */}
          <EventPlannerForm onSubmit={handleSubmit} isLoading={status === 'loading'} />
        </>
      )}

      {/* ── Loading state (shared by both modes) ─────────────────────────── */}
      {status === 'loading' && (
        <div className="mt-6 bg-white border border-border rounded-sm overflow-hidden animate-fade-up">
          <div className="bg-charcoal px-6 py-4 flex items-center gap-3">
            <Loader2 size={14} className="text-gold animate-spin" />
            <span className="text-[0.72rem] font-medium tracking-[0.14em] uppercase text-gold-light">
              Crafting your event plan
            </span>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {loadingSteps.map((step: LoadingStep) => (
                <div key={step.id} className="flex items-center gap-3">
                  <StepIndicator status={step.status} />
                  <span
                    className={cn(
                      'text-[0.85rem] font-light transition-colors duration-300',
                      step.status === 'active'  && 'text-charcoal font-medium',
                      step.status === 'done'    && 'text-muted',
                      step.status === 'pending' && 'text-muted/50',
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[0.75rem] text-muted font-light mt-5 pt-4 border-t border-border italic">
              Powered by Claude Sonnet 4 via Supabase Edge Function
            </p>
          </div>
        </div>
      )}

      {/* ── Error state (shared by both modes) ───────────────────────────── */}
      {status === 'error' && error && currentFormData && (
        <div className="mt-6 bg-white border border-red-200 rounded-sm overflow-hidden animate-fade-up">
          <div className="bg-red-50 px-5 py-3.5 flex items-center gap-2 border-b border-red-200">
            <AlertTriangle size={14} className="text-red-500 shrink-0" />
            <span className="text-[0.72rem] font-medium tracking-[0.12em] uppercase text-red-700">
              Generation failed
              {retryCount > 0 && ` (attempt ${retryCount + 1})`}
            </span>
          </div>
          <div className="p-6 text-center">
            <p className="text-[0.875rem] text-red-700 font-light mb-5 leading-relaxed">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="gold" size="sm" onClick={() => retry(currentFormData)}>
                <RefreshCw size={13} className="mr-2" />
                Try Again
              </Button>
              <Button variant="outline" size="sm" onClick={reset}>
                Start Over
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success (shared by both modes) ───────────────────────────────── */}
      {status === 'success' && plan && currentFormData && (
        <div className="mt-6" id="plan-result">
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

// ─── Step indicator (loading steps, unchanged) ────────────────────────────────

function StepIndicator({ status }: { status: LoadingStep['status'] }) {
  if (status === 'done') {
    return <CheckCircle2 size={15} className="text-green-600 shrink-0" />
  }
  if (status === 'active') {
    return <Loader2 size={15} className="text-gold animate-spin shrink-0" />
  }
  return <span className="w-[15px] h-[15px] rounded-full border border-border shrink-0" />
}