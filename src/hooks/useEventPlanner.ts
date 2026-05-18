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

  // Tracks the hash of the last successfully completed generation.
  // If generate() is called with identical inputs, we skip the API call
  // and return the already-displayed plan immediately.
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

  const generate = useCallback(async (data: EventFormData) => {
    // Deduplication: build the same stable hash that api.ts uses.
    // If status is already 'success' and inputs haven't changed, do nothing —
    // the plan already on screen is the correct result for these inputs.
    const stableKey = JSON.stringify({
      eventType:   data.eventType,
      budget:      data.budget,
      attendance:  data.attendance,
      season:      data.season,
      venue:       data.venue,
      alcohol:     data.alcohol,
      demographic: data.demographic,
      notes:       data.notes.trim(),
    })

    if (status === 'success' && lastGeneratedHashRef.current === stableKey) {
      return // already showing result for these exact inputs
    }

    setStatus('loading')
    setPlan(null)
    setError(null)
    startStepAnimation()

    try {
      const result = await generateEventPlan(data)
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

  const retry = useCallback((data: EventFormData) => {
    setRetryCount((c) => c + 1)
    // Clear the hash so retry always fires even with same inputs
    lastGeneratedHashRef.current = null
    void generate(data)
  }, [generate])

  return { status, plan, error, retryCount, loadingSteps, generate, retry, reset }
}