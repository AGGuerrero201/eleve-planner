/**
 * src/lib/vendorRecommendations.ts
 *
 * Rule-based vendor recommendation engine.
 * Takes EventFormData + Vendor[] → returns ranked vendor matches by category.
 * No AI, no API calls, no new infrastructure.
 */

import type { Vendor, VendorCategory } from '@/types/vendor'
import type { EventFormData } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VendorMatch {
  vendor:   Vendor
  score:    number    // 0–100
  reason:   string    // short human-readable reason
}

export interface CategoryRecommendation {
  category:  VendorCategory
  label:     string
  vendors:   VendorMatch[]
  priority:  number   // lower = more important for this event type
}

// ─── Event type → category priority map ──────────────────────────────────────
// priority: 1 = essential, 2 = recommended, 3 = optional

type CategoryPriority = { category: VendorCategory; priority: number }

const EVENT_CATEGORY_MAP: Record<string, CategoryPriority[]> = {
  'Cocktail Reception': [
    { category: 'catering',      priority: 1 },
    { category: 'bar_service',   priority: 1 },
    { category: 'staffing',      priority: 2 },
    { category: 'entertainment', priority: 3 },
    { category: 'photography',   priority: 3 },
  ],
  'Rooftop Social': [
    { category: 'catering',      priority: 1 },
    { category: 'bar_service',   priority: 1 },
    { category: 'entertainment', priority: 2 },
    { category: 'staffing',      priority: 2 },
    { category: 'photography',   priority: 3 },
  ],
  'Wine & Cheese Evening': [
    { category: 'catering',    priority: 1 },
    { category: 'bar_service', priority: 1 },
    { category: 'staffing',    priority: 2 },
    { category: 'specialty',   priority: 2 },
  ],
  'Bourbon & Cigar Evening': [
    { category: 'catering',    priority: 1 },
    { category: 'bar_service', priority: 1 },
    { category: 'specialty',   priority: 2 },
    { category: 'staffing',    priority: 3 },
  ],
  'Brunch Gathering': [
    { category: 'catering',      priority: 1 },
    { category: 'bar_service',   priority: 2 },
    { category: 'staffing',      priority: 2 },
    { category: 'entertainment', priority: 3 },
  ],
  'Cooking Class': [
    { category: 'catering',    priority: 1 },
    { category: 'specialty',   priority: 1 },
    { category: 'staffing',    priority: 2 },
  ],
  'Holiday Party': [
    { category: 'catering',      priority: 1 },
    { category: 'bar_service',   priority: 1 },
    { category: 'entertainment', priority: 1 },
    { category: 'florals',       priority: 2 },
    { category: 'av_production', priority: 2 },
    { category: 'staffing',      priority: 2 },
    { category: 'photography',   priority: 3 },
  ],
  'Pool Party': [
    { category: 'catering',      priority: 1 },
    { category: 'bar_service',   priority: 2 },
    { category: 'entertainment', priority: 2 },
    { category: 'staffing',      priority: 2 },
  ],
  'Movie Night': [
    { category: 'catering',      priority: 1 },
    { category: 'av_production', priority: 1 },
    { category: 'staffing',      priority: 3 },
  ],
  'Wellness & Yoga Morning': [
    { category: 'wellness',   priority: 1 },
    { category: 'catering',   priority: 2 },
    { category: 'staffing',   priority: 3 },
  ],
  'Networking Mixer': [
    { category: 'catering',      priority: 1 },
    { category: 'bar_service',   priority: 2 },
    { category: 'staffing',      priority: 2 },
    { category: 'av_production', priority: 3 },
    { category: 'photography',   priority: 3 },
  ],
  'Farmers Market Pop-up': [
    { category: 'catering',    priority: 1 },
    { category: 'specialty',   priority: 2 },
    { category: 'staffing',    priority: 2 },
  ],
  'Art Exhibition & Gallery Walk': [
    { category: 'catering',      priority: 2 },
    { category: 'bar_service',   priority: 2 },
    { category: 'specialty',     priority: 1 },
    { category: 'photography',   priority: 2 },
    { category: 'staffing',      priority: 3 },
  ],
  'Family Fun Day': [
    { category: 'catering',      priority: 1 },
    { category: 'entertainment', priority: 1 },
    { category: 'staffing',      priority: 2 },
    { category: 'photography',   priority: 3 },
  ],
  'Pet Social': [
    { category: 'catering',    priority: 1 },
    { category: 'staffing',    priority: 2 },
    { category: 'photography', priority: 3 },
  ],
}

// Default categories if event type not in map
const DEFAULT_CATEGORIES: CategoryPriority[] = [
  { category: 'catering',    priority: 1 },
  { category: 'bar_service', priority: 2 },
  { category: 'staffing',    priority: 2 },
]

// ─── Category display labels ──────────────────────────────────────────────────

const CATEGORY_LABELS: Partial<Record<VendorCategory, string>> = {
  catering:      'Catering',
  bar_service:   'Bar Service',
  florals:       'Florals & Décor',
  entertainment: 'Entertainment',
  av_production: 'AV & Production',
  staffing:      'Staffing',
  photography:   'Photography',
  wellness:      'Wellness',
  specialty:     'Specialty',
  other:         'Other',
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function scoreVendor(vendor: Vendor, formData: EventFormData, priority: number): number {
  let score = 0

  // Base score from priority (priority 1 = 40pts, 2 = 25pts, 3 = 10pts)
  score += priority === 1 ? 40 : priority === 2 ? 25 : 10

  // Favorite bonus
  if (vendor.favorite) score += 20

  // Previously used bonus
  if (vendor.previouslyUsed) score += 15

  // COI on file bonus
  if (vendor.coiStatus === 'on_file') score += 10

  // Tag matching bonuses
  const tags = vendor.tags.map((t) => t.toLowerCase())

  if (formData.venue === 'Indoor & Outdoor' || formData.venue === 'Outdoor') {
    if (tags.some((t) => t.includes('outdoor'))) score += 8
  }

  if (formData.attendance === '100 – 200 residents' || formData.attendance === '200+ residents') {
    if (tags.some((t) => t.includes('large') || t.includes('high-volume'))) score += 5
  }

  const season = formData.season?.toLowerCase() ?? ''
  if (tags.some((t) => t.includes(season))) score += 5

  // Deductions
  if (formData.alcohol === 'No alcohol' && vendor.category === 'bar_service') score -= 30

  return Math.max(0, Math.min(100, score))
}

function reasonText(vendor: Vendor, formData: EventFormData): string {
  if (vendor.favorite && vendor.previouslyUsed) return 'Favorite · Used before'
  if (vendor.favorite) return 'In your favorites'
  if (vendor.previouslyUsed) return 'Used for a previous event'
  if (vendor.coiStatus === 'on_file') return 'COI on file'
  return vendor.serviceArea || 'In your directory'
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Given an event's form data and all vendors, return ranked category recommendations.
 * Only includes categories where at least one vendor exists.
 * Sorted by priority, then by score within each category.
 */
export function getVendorRecommendations(
  formData: EventFormData,
  vendors: Vendor[]
): CategoryRecommendation[] {
  if (!vendors.length) return []

  const categoryPriorities =
    EVENT_CATEGORY_MAP[formData.eventType] ?? DEFAULT_CATEGORIES

  const results: CategoryRecommendation[] = []

  for (const { category, priority } of categoryPriorities) {
    // Skip bar service if no alcohol
    if (category === 'bar_service' && formData.alcohol === 'No alcohol') continue

    const inCategory = vendors.filter((v) => v.category === category)
    if (inCategory.length === 0) continue

    const matches: VendorMatch[] = inCategory
      .map((vendor) => ({
        vendor,
        score: scoreVendor(vendor, formData, priority),
        reason: reasonText(vendor, formData),
      }))
      .sort((a, b) => b.score - a.score)

    results.push({
      category,
      label: CATEGORY_LABELS[category] ?? category,
      vendors: matches,
      priority,
    })
  }

  // Sort by priority
  return results.sort((a, b) => a.priority - b.priority)
}

/**
 * Returns just the suggested category labels for an event type.
 * Used to show "you might need these" even when no vendors exist.
 */
export function getSuggestedCategories(eventType: string): string[] {
  const cats = EVENT_CATEGORY_MAP[eventType] ?? DEFAULT_CATEGORIES
  return cats
    .filter((c) => c.priority <= 2)
    .map((c) => CATEGORY_LABELS[c.category] ?? c.category)
}
