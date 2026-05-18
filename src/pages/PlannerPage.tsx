import { useState, useCallback } from 'react'
import { AlertTriangle, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react'
import type { EventFormData, SavedEvent, LoadingStep } from '@/types'
import { useEventPlanner } from '@/hooks/useEventPlanner'
import { useSavedEvents } from '@/hooks/useSavedEvents'
import { EventPlannerForm } from '@/components/events/EventPlannerForm'
import { EventPlanResult } from '@/components/events/EventPlanResult'
import { TemplateSelector } from '@/components/events/TemplateSelector'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { LuxuryTemplate } from '@/lib/templates'

export function PlannerPage() {
  const { status, plan, error, retryCount, loadingSteps, generate, retry, reset, loadTemplate } = useEventPlanner()
  const { save, isSaved } = useSavedEvents()
  const [currentFormData, setCurrentFormData] = useState<EventFormData | null>(null)

  const handleSubmit = (data: EventFormData) => {
    setCurrentFormData(data)
    void generate(data)
  }

  const handleSelectTemplate = useCallback((template: LuxuryTemplate) => {
    setCurrentFormData(template.formData)
    loadTemplate(template.plan)
    // Scroll down so the result is visible on mobile
    setTimeout(() => {
      document.getElementById('plan-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }, [loadTemplate])

  const handleSave = async (event: SavedEvent): Promise<SavedEvent | null> => {
    return save(event)
  }

  const planIsSaved = plan !== null ? isSaved(plan.title, plan.tagline) : false

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-serif text-4xl font-light text-charcoal mb-2">Event Planner</h1>
        <p className="text-muted font-light text-sm leading-relaxed">
          Start from a template for an instant plan, or fill in the form to generate one with Claude AI.
        </p>
      </div>

      {/* Template selector — collapses after selection */}
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

      {/* Form */}
      <EventPlannerForm onSubmit={handleSubmit} isLoading={status === 'loading'} />

      {/* ── Loading state ── */}
      {status === 'loading' && (
        <div className="mt-6 bg-white border border-border rounded-sm overflow-hidden animate-fade-up">
          <div className="bg-charcoal px-6 py-4 flex items-center gap-3">
            <Loader2 size={14} className="text-gold animate-spin" />
            <span className="text-[0.72rem] font-medium tracking-[0.14em] uppercase text-gold-light">
              Claude is crafting your event plan
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

      {/* ── Error state ── */}
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

      {/* ── Success ── */}
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

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ status }: { status: LoadingStep['status'] }) {
  if (status === 'done') {
    return <CheckCircle2 size={15} className="text-green-600 shrink-0" />
  }
  if (status === 'active') {
    return <Loader2 size={15} className="text-gold animate-spin shrink-0" />
  }
  return <span className="w-[15px] h-[15px] rounded-full border border-border shrink-0" />
}
