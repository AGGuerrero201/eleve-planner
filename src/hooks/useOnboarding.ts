/**
 * hooks/useOnboarding.ts
 *
 * Tracks first-visit onboarding state in localStorage.
 * Once dismissed (either CTA), overlay never appears again.
 */

import { useState, useCallback } from 'react'

const STORAGE_KEY = 'eleve_onboarding_complete'

export type OnboardingChoice = 'generate' | 'explore'

export interface OnboardingState {
  /** Whether the onboarding overlay should be shown */
  showOverlay:  boolean
  /** Dismiss and persist — pass the user's choice */
  dismiss:      (choice: OnboardingChoice) => void
  /** True if user previously chose "generate" and we should auto-trigger */
  lastChoice:   OnboardingChoice | null
}

export function useOnboarding(): OnboardingState {
  const [showOverlay, setShowOverlay] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(STORAGE_KEY)
    } catch {
      return false // SSR / private browsing safety
    }
  })

  const [lastChoice, setLastChoice] = useState<OnboardingChoice | null>(null)

  const dismiss = useCallback((choice: OnboardingChoice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      // ignore
    }
    setLastChoice(choice)
    setShowOverlay(false)
  }, [])

  return { showOverlay, dismiss, lastChoice }
}
