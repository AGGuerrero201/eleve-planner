import { useState, useCallback, useRef } from 'react'
import type { EventFormData, EventPlan, GenerationStatus, LoadingStep } from '@/types'
import { generateEventPlan } from '@/lib/api'

const LOADING_STEPS: Omit<LoadingStep, 'status'>[] = [
  { id: 'concept',  label: 'Crafting event concept & theme'     },
  { id: 'ops',      label: 'Planning timeline & catering'       },
  { id: 'vendors',  label: 'Sourcing vendor recommendations'    },
  { id: 'comms',    label: 'Drafting resident email & flyer'    },
  { id: 'finalize', label: 'Finalising budget & staffing plan'  },
]

function initialSteps(): LoadingStep[] {
  return LOADING_STEPS.map((s, i) => ({
    ...s,
    status: i === 0 ? 'active' : 'pending',
  }))
}

export function useEventPlanner() {
  const [status, setStatus]             = useState<GenerationStatus>('idle')
  const [plan, setPlan]                 = useState<EventPlan | null>(null)
  const [error, setError]               = useState<string | null>(null)
  const [retryCount, setRetryCount]     = useState(0)
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>(initialSteps())
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const lastGeneratedHashRef = useRef<string | null>(null)

  const startStepAnimation = useCallback(() => {
    setLoadingSteps(initialSteps())
    let current = 0
    stepTimerRef.current = setInterval(() => {
      current += 1
      if (current >= LOADING_STEPS.length) {
        if (stepTimerRef.current) clearInterval(stepTimerRef.current)
        return
      }
      setLoadingSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i < current ? 'done' : i === current ? 'active' : 'pending',
        }))
      )
    }, 1800)
  }, [])

  const stopStepAnimation = useCallback((allDone: boolean) => {
    if (stepTimerRef.current) clearInterval(stepTimerRef.current)
    if (allDone) {
      setLoadingSteps((prev) => prev.map((s) => ({ ...s, status: 'done' })))
    }
  }, [])

  /**
   * Phase 3: accepts an optional propertyContextBlock.
   * When provided, it is forwarded to the Edge Function for property-aware generation.
   * Passing null/undefined falls back to the original generic generation.
   */
  const generate = useCallback(async (
    data: EventFormData,
    propertyContextBlock?: string | null
  ) => {
    const stableKey = JSON.stringify({
      eventType:   data.eventType,
      budget:      data.budget,
      attendance:  data.attendance,
      season:      data.season,
      venue:       data.venue,
      alcohol:     data.alcohol,
      demographic: data.demographic,
      notes:       data.notes.trim(),
      propertyCtx: propertyContextBlock ?? '',
    })

    if (status === 'success' && lastGeneratedHashRef.current === stableKey) {
      return
    }

    setStatus('loading')
    setPlan(null)
    setError(null)
    startStepAnimation()

    try {
      const result = await generateEventPlan(data, propertyContextBlock)
      stopStepAnimation(true)
      setPlan(result)
      setStatus('success')
      setRetryCount(0)
      lastGeneratedHashRef.current = stableKey
    } catch (err) {
      stopStepAnimation(false)
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(msg)
      setStatus('error')
    }
  }, [status, startStepAnimation, stopStepAnimation])

  const reset = useCallback(() => {
    setStatus('idle')
    setPlan(null)
    setError(null)
    setRetryCount(0)
    setLoadingSteps(initialSteps())
    lastGeneratedHashRef.current = null
  }, [])

  const retry = useCallback((data: EventFormData, propertyContextBlock?: string | null) => {
    setRetryCount((c) => c + 1)
    lastGeneratedHashRef.current = null
    void generate(data, propertyContextBlock)
  }, [generate])

  const loadTemplate = useCallback((templatePlan: EventPlan) => {
    setPlan(templatePlan)
    setStatus('success')
    setError(null)
    setRetryCount(0)
    lastGeneratedHashRef.current = null
  }, [])

  return { status, plan, error, retryCount, loadingSteps, generate, retry, reset, loadTemplate }
}
