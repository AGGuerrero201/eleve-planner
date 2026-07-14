/**
 * experience/ExperienceContext.tsx
 *
 * State machine for Experience Elevé.
 *
 * Owns: whether the experience is active, the current walkthrough step,
 * and the lifecycle actions (start, restart, reset data, exit, skip).
 * Listens to the experience signal bus so the tour advances automatically
 * when the user performs the real action a step asked for.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  isExperienceActive,
  activateExperience,
  deactivateExperience,
  seedExperienceData,
  getTourState,
  setTourState,
  onExperienceSignal,
  type ExperienceSignal,
} from './experienceStore'
import { TOUR_STEPS, type TourStep } from './tourSteps'

// ─── Context shape ──────────────────────────────────────────────────────────────

interface ExperienceContextValue {
  /** Whether Experience Elevé is currently active. */
  active:        boolean
  /** The current walkthrough step, or null when the tour is dismissed/complete. */
  step:          TourStep | null
  stepIndex:     number
  stepCount:     number
  tourDismissed: boolean
  /** Begin the experience (seeds data on first run) and navigate to the dashboard. */
  start:         () => void
  /** Restart the walkthrough from the beginning (data untouched). */
  restart:       () => void
  /** Wipe and reseed all experience data, then restart the walkthrough. */
  resetData:     () => void
  /** Leave the experience entirely and return to the landing page. */
  exit:          () => void
  /** Hide the walkthrough guide; the experience itself stays active. */
  skipTour:      () => void
  /** Advance to the next step (also used by step CTAs). */
  next:          () => void
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null)

// ─── Provider ───────────────────────────────────────────────────────────────────

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  const [active, setActive]       = useState<boolean>(() => isExperienceActive())
  const [stepIndex, setStepIndex] = useState<number>(() => getTourState().stepIndex)
  const [dismissed, setDismissed] = useState<boolean>(() => {
    const t = getTourState()
    return t.dismissed || t.completed
  })

  const persist = useCallback((index: number, isDismissed: boolean, completed = false) => {
    setTourState({ stepIndex: index, dismissed: isDismissed, completed })
  }, [])

  const next = useCallback(() => {
    setStepIndex((current) => {
      const nextIndex = current + 1
      if (nextIndex >= TOUR_STEPS.length) {
        setDismissed(true)
        persist(current, true, true)
        return current
      }
      persist(nextIndex, false)
      return nextIndex
    })
  }, [persist])

  // Auto-advance on real user actions
  useEffect(() => {
    if (!active || dismissed) return
    return onExperienceSignal((signal: ExperienceSignal) => {
      const step = TOUR_STEPS[stepIndex]
      if (step?.advanceOn === signal) next()
    })
  }, [active, dismissed, stepIndex, next])

  const start = useCallback(() => {
    activateExperience()
    setActive(true)
    setStepIndex(0)
    setDismissed(false)
    persist(0, false)
    navigate('/dashboard')
    window.scrollTo({ top: 0 })
  }, [navigate, persist])

  const restart = useCallback(() => {
    setStepIndex(0)
    setDismissed(false)
    persist(0, false)
    navigate('/dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [navigate, persist])

  const resetData = useCallback(() => {
    seedExperienceData()
    setStepIndex(0)
    setDismissed(false)
    persist(0, false)
    navigate('/dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [navigate, persist])

  const exit = useCallback(() => {
    deactivateExperience()
    setActive(false)
    navigate('/')
    window.scrollTo({ top: 0 })
  }, [navigate])

  const skipTour = useCallback(() => {
    setDismissed(true)
    persist(stepIndex, true)
  }, [persist, stepIndex])

  const value: ExperienceContextValue = {
    active,
    step: active && !dismissed ? TOUR_STEPS[stepIndex] ?? null : null,
    stepIndex,
    stepCount: TOUR_STEPS.length,
    tourDismissed: dismissed,
    start,
    restart,
    resetData,
    exit,
    skipTour,
    next,
  }

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  )
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

export function useExperience(): ExperienceContextValue {
  const ctx = useContext(ExperienceContext)
  if (!ctx) {
    throw new Error('useExperience must be used inside <ExperienceProvider>')
  }
  return ctx
}
