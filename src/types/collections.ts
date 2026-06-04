/**
 * src/types/collections.ts
 *
 * Type definitions for the Elevé curated collection system.
 * Collections are editorial groupings of templates — separate from
 * the category taxonomy in types/templates.ts.
 */

import type { LuxuryTemplate } from '@/lib/templates'

// ─── Collection tiers ─────────────────────────────────────────────────────────

export type CollectionTier =
  | 'seasonal'       // rotate by current month
  | 'hospitality'    // evergreen, editorially named
  | 'operational'    // practical groupings for busy property teams

// ─── Collection definition ────────────────────────────────────────────────────

export interface Collection {
  id:          string           // kebab-case, stable
  label:       string           // "Summer Rooftop Series"
  description: string           // one-line editorial description
  tier:        CollectionTier
  glyph:       string           // decorative character for card display
  activeMonths?: number[]       // 1–12; seasonal only — undefined = evergreen
  templateIds: string[]         // ordered list of template IDs in this collection
  tags:        string[]         // 2–3 preview tags shown on collection card
}

// ─── Resolved collection (with hydrated templates) ────────────────────────────

export interface ResolvedCollection extends Omit<Collection, 'templateIds'> {
  templates: LuxuryTemplate[]
}

// ─── Helper: get current season number (1=spring 2=summer 3=fall 4=winter) ───

export function getCurrentSeason(): 1 | 2 | 3 | 4 {
  const month = new Date().getMonth() + 1 // 1–12
  if (month >= 3 && month <= 5)  return 1 // Spring
  if (month >= 6 && month <= 8)  return 2 // Summer
  if (month >= 9 && month <= 11) return 3 // Fall
  return 4                                 // Winter
}

// ─── Helper: get current seasonal collection ID ───────────────────────────────

export function getCurrentSeasonalCollectionId(): string {
  const season = getCurrentSeason()
  const ids = ['spring-experiences', 'summer-rooftop-series', 'fall-entertaining', 'winter-holiday']
  return ids[season - 1]
}
