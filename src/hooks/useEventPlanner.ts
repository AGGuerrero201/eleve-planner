import { useState, useCallback, useRef } from 'react'
import type { EventFormData, EventPlan, GenerationStatus, LoadingStep } from '@/types'
import { generateEventPlan } from '@/lib/api'

const LOADING_STEPS: Omit<LoadingStep, 'status'>[] = [
  { id: 'concept',  label: 'Crafting event concept & theme'         },
  { id: 'ops',      label: 'Planning timeline & catering'           },
  { id: 'vendors',  label: 'Sourcing vendor recommendations'        },
  { id: 'comms',    label: 'Drafting resident email & flyer'        },
  { id: 'finalize', label: 'Finalising budget & staffing plan'      },
]

function initialSteps(): LoadingStep[] {
  return LOADING_STEPS.map((s, i) => ({
    ...s,
    status: i === 0 ? 'active' : 'pending',
  }))
}

export function useEventPlanner() {
  const [status, setStatus]           = useState<GenerationStatus>('idle')
  const [plan, setPlan]               = useState<EventPlan | null>(null)
  const [error, setError]             = useState<string | null>(null)
  const [retryCount, setRetryCount]   = useState(0)
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>(initialSteps())
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Animate through loading steps while the API call is in flight
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
    } catch (err) {
      stopStepAnimation(false)
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(msg)
      setStatus('error')
    }
  }, [startStepAnimation, stopStepAnimation])

  const reset = useCallback(() => {
    setStatus('idle')
    setPlan(null)
    setError(null)
    setRetryCount(0)
    setLoadingSteps(initialSteps())
  }, [])

  const retry = useCallback((data: EventFormData) => {
    setRetryCount((c) => c + 1)
    void generate(data)
  }, [generate])

  return { status, plan, error, retryCount, loadingSteps, generate, retry, reset }
}
