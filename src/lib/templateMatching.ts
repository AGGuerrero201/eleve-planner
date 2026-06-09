/**
 * templateMatching.ts
 *
 * Scored matching algorithm for the Elevé template library.
 * Replaces the string-equality match previously inside StepRoute.
 *
 * Scoring weights:
 *   eventType exact match   → 4 pts  (highest — user stated preference)
 *   season match            → 3 pts  (wrong season = immediately wrong)
 *   demographic match       → 2 pts  (affects timing, tone, format)
 *   atmosphere match        → 2 pts  (venue + alcohol vibe alignment)
 *   budgetTier match        → 1 pt   (tiebreaker)
 *
 * Templates with a full plan rank above equivalent metadata-only templates
 * (instant delivery is always better UX than a Claude call).
 */

import type { EventFormData } from '@/types'
import type { LuxuryTemplate, TemplateAtmosphere, BudgetTier } from '@/types/templates'

// ─── Atmosphere inference ─────────────────────────────────────────────────────
// Derive the wizard atmosphere selection from formData venue + alcohol fields.
// Mirrors the mapping in StepAtmosphere.tsx.

function inferAtmosphere(formData: EventFormData): TemplateAtmosphere | null {
  const { venue, alcohol } = formData
  if (venue === 'Indoor' && alcohol === 'Full bar')         return 'upscale-social'
  if (venue === 'Indoor & Outdoor' && alcohol === 'Wine & beer only') return 'relaxed-luxury'
  if (venue === 'Indoor' && alcohol === 'No alcohol')       return 'family-focused'
  if (venue === 'Indoor & Outdoor' && alcohol === 'No alcohol') return 'wellness-focused'
  if (venue === 'Indoor' && alcohol === 'Full bar')         return 'networking-focused'
  return null
}

// ─── Budget tier inference ────────────────────────────────────────────────────

function inferBudgetTier(budget: string): BudgetTier | null {
  if (budget === 'Under $1,000' || budget === '$1,000 – $2,500') return 'accessible'
  if (budget === '$2,500 – $5,000')                              return 'mid'
  if (budget === '$5,000 – $10,000')                             return 'premium'
  if (budget === '$10,000 – $25,000' || budget === '$25,000+')   return 'luxury'
  return null
}

// ─── Score a single template ──────────────────────────────────────────────────

function scoreTemplate(template: LuxuryTemplate, formData: EventFormData): number {
  let score = 0

  // Event type exact match (highest weight)
  if (formData.eventType && template.formData?.eventType === formData.eventType) {
    score += 4
  }

  // Season match
  if (formData.season && (template.idealSeasons ?? []).includes(formData.season as any)) {
    score += 3
  }

  // Demographic match (template supports multiple demographics)
  if (formData.demographic && (template.demographic ?? []).includes(formData.demographic)) {
    score += 2
  }

  // Atmosphere match
  const inferredAtmosphere = inferAtmosphere(formData)
  if (inferredAtmosphere && template.atmosphere === inferredAtmosphere) {
    score += 2
  }

  // Budget tier match
  const inferredTier = inferBudgetTier(formData.budget)
  if (inferredTier && template.budgetTier === inferredTier) {
    score += 1
  }

  // Bonus: templates with a pre-written plan rank above metadata-only
  if (template.plan !== undefined) {
    score += 0.5
  }

  return score
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Returns the top N templates scored against the user's form selections.
 * Always returns at least `count` results (falls back to top-scored if
 * no high-confidence matches exist).
 */
export function matchTemplates(
  formData: EventFormData,
  allTemplates: LuxuryTemplate[],
  count = 3
): LuxuryTemplate[] {
  const scored = allTemplates
    .map((t) => ({ template: t, score: scoreTemplate(t, formData) }))
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, count).map((s) => s.template)
}

/**
 * Returns whether any template is a strong match (score ≥ 4).
 * Used in StepRoute to show "Similar templates" vs "Exact match" copy.
 */
export function hasStrongMatch(
  formData: EventFormData,
  allTemplates: LuxuryTemplate[]
): boolean {
  return allTemplates.some((t) => scoreTemplate(t, formData) >= 4)
}
