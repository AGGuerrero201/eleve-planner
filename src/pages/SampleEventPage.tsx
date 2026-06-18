/**
 * pages/SampleEventPage.tsx
 *
 * The demo generation experience.
 *
 * Reached when a user selects an event tile from the onboarding overlay.
 * Uses the existing useEventPlanner hook — no special API path.
 * Pre-fills all form fields with sensible demo defaults so the user
 * only provides the event type (selected on the overlay).
 *
 * After the plan is generated:
 *   - Shows a "Sample Event Plan" attribution header
 *   - Shows the full EventPlanResult
 *   - Shows a Property Intelligence conversion callout
 */

import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Loader2, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react'
import { useEventPlanner } from '@/hooks/useEventPlanner'
import { EventPlanResult } from '@/components/events/EventPlanResult'
import { useSavedEvents } from '@/hooks/useSavedEvents'
import { Button } from '@/components/ui/Button'
import { LoadingDots } from '@/components/ui/LoadingDots'
import { cn } from '@/lib/utils'
import type { EventFormData, SavedEvent, LoadingStep } from '@/types'

// ─── Demo defaults ─────────────────────────────────────────────────────────────
// These fill every EventFormData field except eventType, which comes from
// the user's tile selection. They are intentionally generic so the output
// feels like a quality demo rather than a specific property's event.

function buildDemoForm(eventType: string): EventFormData {
  // Pick sensible season based on current month
  const month = new Date().getMonth() // 0–11
  const season =
    month >= 2 && month <= 4  ? 'Spring' :
    month >= 5 && month <= 7  ? 'Summer' :
    month >= 8 && month <= 10 ? 'Fall / Autumn' :
                                'Winter'

  return {
    eventType,
    budget:      '$2,500 – $5,000',
    attendance:  '50 – 100 residents',
    season,
    venue:       'Indoor & Outdoor',
    alcohol:     'Full bar',
    demographic: 'Mixed',
    notes:       '',
  }
}

// ─── Loading steps (improved copy for demo context) ───────────────────────────

const DEMO_LOADING_STEPS: Omit<LoadingStep, 'status'>[] = [
  { id: 'concept',  label: 'Creating event concept & theme'          },
  { id: 'ops',      label: 'Building timeline and logistics'          },
  { id: 'budget',   label: 'Generating budget recommendations'        },
  { id: 'comms',    label: 'Creating resident communications'         },
  { id: 'vendors',  label: 'Preparing vendor recommendations'         },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function SampleEventPage() {
  const navigate       = useNavigate()
  const [params]       = useSearchParams()
  const eventType      = params.get('type') ?? 'Cocktail Reception'

  const { status, plan, error, loadingSteps, generate, retry } = useEventPlanner()
  const { save, isSaved }                                       = useSavedEvents()

  const hasFiredRef = useRef(false)

  // Fire generation once on mount
  useEffect(() => {
    if (hasFiredRef.current) return
    hasFiredRef.current = true
    const formData = buildDemoForm(eventType)
    void generate(formData, null)   // no property context for demo
  }, [eventType, generate])

  const formData   = buildDemoForm(eventType)
  const planIsSaved = plan !== null ? isSaved(plan.title, plan.tagline) : false

  const handleSave = async (event: SavedEvent): Promise<SavedEvent | null> => save(event)

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">

      {/* Back nav */}
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1.5 mb-8 py-2 -my-2 transition-colors duration-150"
        style={{ color: 'var(--stone, #8C8478)', fontSize: '0.75rem' }}
      >
        <ArrowLeft size={13} strokeWidth={1.5} />
        Dashboard
      </button>

      {/* Page header */}
      <div className="mb-8">
        <p
          className="text-[0.58rem] font-medium uppercase mb-2"
          style={{ letterSpacing: '0.24em', color: 'var(--gold, #B8955A)' }}
        >
          Sample Event Plan
        </p>
        <h1
          className="font-serif font-light leading-tight mb-2"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', color: 'var(--charcoal, #1C1C1E)' }}
        >
          {eventType}
        </h1>
        <p
          className="text-[0.8rem] font-light leading-relaxed"
          style={{ color: 'var(--muted, #8A8580)' }}
        >
          Generated using Elevé's AI planning engine.
        </p>
      </div>

      {/* ── Loading ───────────────────────────────────────────────────────── */}
      {status === 'loading' && (
        <div
          className="rounded-sm overflow-hidden animate-fade-up"
          style={{
            backgroundColor: 'var(--card-bg, #FAFAF8)',
            border:          'var(--card-border, 1px solid rgba(180,166,150,0.28))',
            boxShadow:       '0 1px 8px rgba(0,0,0,0.04)',
          }}
        >
          {/* Loading header */}
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{ backgroundColor: 'var(--charcoal, #1C1C1E)' }}
          >
            <Loader2 size={12} className="text-gold animate-spin" strokeWidth={1.5} />
            <span
              className="text-[0.62rem] font-medium uppercase"
              style={{ letterSpacing: '0.16em', color: 'var(--gold-light, #E8D5B0)' }}
            >
              Generating your {eventType.toLowerCase()}…
            </span>
          </div>

          {/* Steps */}
          <div className="p-6 sm:p-8">
            <div className="space-y-4 mb-6">
              {(loadingSteps.length ? loadingSteps : DEMO_LOADING_STEPS.map((s, i) => ({
                ...s,
                status: i === 0 ? 'active' as const : 'pending' as const,
              }))).map((step: LoadingStep) => (
                <div key={step.id} className="flex items-center gap-3">
                  <StepDot status={step.status} />
                  <span
                    className={cn(
                      'text-[0.85rem] font-light transition-colors duration-300',
                      step.status === 'active'  && 'text-charcoal font-normal',
                      step.status === 'done'    && 'text-muted',
                      step.status === 'pending' && 'text-muted/40',
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <LoadingDots label="" />
            <p
              className="text-[0.7rem] text-muted/40 font-light mt-3 text-center italic"
              style={{ borderTop: '0.5px solid rgba(180,166,150,0.20)', paddingTop: '14px' }}
            >
              Usually takes under a minute
            </p>
          </div>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {status === 'error' && error && (
        <div className="rounded-sm overflow-hidden border border-red-200">
          <div className="bg-red-50 px-5 py-3.5 flex items-center gap-2.5 border-b border-red-100">
            <AlertTriangle size={13} className="text-red-400 shrink-0" />
            <span className="text-[0.65rem] font-medium tracking-[0.12em] uppercase text-red-600">
              Generation failed
            </span>
          </div>
          <div className="p-7 text-center bg-white">
            <p className="text-[0.875rem] text-red-600 font-light mb-6 leading-relaxed">{error}</p>
            <Button
              variant="gold"
              size="sm"
              onClick={() => retry(formData, null)}
            >
              <RefreshCw size={12} className="mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* ── Result ───────────────────────────────────────────────────────── */}
      {status === 'success' && plan && (
        <div className="space-y-6 animate-fade-up">
          <EventPlanResult
            plan={plan}
            formData={formData}
            onSave={handleSave}
            onRegenerate={() => void generate(formData, null)}
            isSaved={planIsSaved}
          />

          {/* ── Property Intelligence conversion callout ─────────────────── */}
          <PropertyIntelCallout />
        </div>
      )}

    </div>
  )
}

// ─── Property Intelligence conversion callout ─────────────────────────────────

function PropertyIntelCallout() {
  const navigate = useNavigate()

  return (
    <div
      className="rounded-sm px-6 py-7"
      style={{
        backgroundColor: 'var(--charcoal, #1C1C1E)',
        border:          '0.5px solid rgba(184,149,90,0.25)',
      }}
    >
      {/* Eyebrow */}
      <p
        className="text-[0.58rem] font-medium uppercase mb-3"
        style={{ letterSpacing: '0.22em', color: 'rgba(184,149,90,0.65)' }}
      >
        Property Intelligence
      </p>

      {/* Headline */}
      <h3
        className="font-serif font-light leading-snug mb-3"
        style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)', color: 'var(--off-white, #FAFAF8)' }}
      >
        Want event plans tailored to<br className="hidden sm:block" /> your community?
      </h3>

      {/* Body */}
      <p
        className="text-[0.82rem] font-light leading-relaxed mb-6"
        style={{ color: 'rgba(255,255,255,0.42)' }}
      >
        Set up your Property Profile and Elevé will generate events based on your
        amenities, resident demographics, community personality, and event spaces —
        producing names, themes, and activations specific to your property.
      </p>

      {/* What changes — three small chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          'Property-specific event names',
          'Amenity-led activations',
          'Demographic-matched communications',
        ].map((label) => (
          <span
            key={label}
            className="text-[0.65rem] font-light px-2.5 py-1 rounded-sm"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border:          '0.5px solid rgba(184,149,90,0.18)',
              color:           'rgba(255,255,255,0.50)',
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => navigate('/property')}
          className={cn(
            'flex items-center justify-center gap-2',
            'text-[0.78rem] font-medium tracking-[0.08em] uppercase',
            'px-6 py-3 rounded-sm transition-all duration-200',
          )}
          style={{
            backgroundColor: 'var(--gold, #B8955A)',
            color:           '#fff',
            border:          '1px solid transparent',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--gold-dark, #9A7A42)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--gold, #B8955A)' }}
        >
          Set Up Property Profile
        </button>

        <button
          type="button"
          onClick={() => navigate('/planner')}
          className={cn(
            'flex items-center justify-center gap-2',
            'text-[0.78rem] font-medium tracking-[0.08em] uppercase',
            'px-6 py-3 rounded-sm transition-all duration-200',
          )}
          style={{
            backgroundColor: 'transparent',
            color:           'rgba(255,255,255,0.40)',
            border:          '1px solid rgba(255,255,255,0.12)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color       = 'rgba(255,255,255,0.70)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color       = 'rgba(255,255,255,0.40)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          }}
        >
          Continue Exploring
        </button>
      </div>
    </div>
  )
}

// ─── Step dot ─────────────────────────────────────────────────────────────────

function StepDot({ status }: { status: LoadingStep['status'] }) {
  if (status === 'done') {
    return <CheckCircle2 size={14} className="text-green-500 shrink-0" strokeWidth={1.5} />
  }
  if (status === 'active') {
    return <Loader2 size={14} className="text-gold animate-spin shrink-0" strokeWidth={1.5} />
  }
  return (
    <span
      className="w-[14px] h-[14px] rounded-full shrink-0 border"
      style={{ borderColor: 'rgba(180,166,150,0.40)' }}
    />
  )
}
