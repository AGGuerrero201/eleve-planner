/**
 * types/templates.ts
 *
 * Template type system for the Elevé template library.
 * Kept separate from types/index.ts to avoid bloating the main type file.
 *
 * Architecture decision:
 *   plan?: EventPlan  — optional. Templates without a plan seed Claude
 *   generation using formData + promptContext. Templates with a plan
 *   load instantly with no API call.
 */

import type {
  EventFormData,
  EventPlan,
  VenueSetting,
  AlcoholService,
  ResidentDemo,
  Season,
} from '@/types'

// ─── Classification types ─────────────────────────────────────────────────────

export type TemplateCategory =
  | 'culinary'        // food, drink, chef experiences
  | 'social'          // cocktail, rooftop, soirée formats
  | 'wellness'        // movement, mindfulness, recovery
  | 'cultural'        // art, film, music, talks
  | 'workshop'        // hands-on, skill-based, creative
  | 'networking'      // professional, career, introductions
  | 'seasonal'        // calendar-anchored marquee events
  | 'family'          // all-ages, inclusive programming
  | 'experiential'    // immersive, pop-up, activation
  | 'luxury_popup'    // one-night-only premium activations

// Widened to string so data files can use descriptive free-form atmospheres
export type TemplateAtmosphere = string

export type BudgetTier =
  | 'entry'       // budget-conscious entry tier
  | 'accessible'  // Under $1,000 – $2,500
  | 'mid'         // $2,500 – $5,000
  | 'premium'     // $5,000 – $10,000
  | 'luxury'      // $10,000+
  | 'ultra'       // top-tier bespoke

// Widened to string so data files can use 'low' | 'medium' | 'high' etc.
export type StaffingComplexity = string

// Widened to string so data files can use 'easy' | 'moderate' | 'complex' etc.
export type OperationalDifficulty = string | number

// ─── Core template interface ──────────────────────────────────────────────────

export type LuxuryTemplate = {
  id?:                     string
  label?:                  string
  tagline?:                string
  description?:            string
  category?:               TemplateCategory
  atmosphere?:             TemplateAtmosphere
  demographic?:            ResidentDemo[]
  idealSeasons?:           Season[]
  budgetTier?:             BudgetTier
  budgetRange?:            string
  attendanceRange?:        string
  tags?:                   string[]
  venue?:                  VenueSetting
  alcohol?:                AlcoholService
  alcoholIncluded?:        boolean | string
  staffingComplexity?:     StaffingComplexity
  operationalDifficulty?:  OperationalDifficulty
  setupTimeHours?:         number
  cleanupComplexity?:      string
  vendorTypes?:            string[]
  requiresExternalVendor?: boolean
  luxuryPresentationNotes?: string
  residentExperienceNotes?: string | string[]
  setupNotes?:             string | string[]
  staffingNotes?:          string | string[]
  enhancements?:           string[]
  flyerHeadline?:          string
  emailIntro?:             string
  previewTags?:            string[]
  formData?:               EventFormData
  promptContext?:          string
  plan?:                   EventPlan
  recommendedVenue?:       string
  [key: string]:           unknown
}

// ─── Category metadata ────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  culinary:     'Culinary',
  social:       'Social',
  wellness:     'Wellness',
  cultural:     'Cultural',
  workshop:     'Workshop',
  networking:   'Networking',
  seasonal:     'Seasonal',
  family:       'Family',
  experiential: 'Experiential',
  luxury_popup: 'Luxury Pop-Up',
}

export const BUDGET_TIER_LABELS: Record<string, string> = {
  entry:      'Entry',
  accessible: 'Accessible',
  mid:        'Mid-Range',
  premium:    'Premium',
  luxury:     'Luxury',
  ultra:      'Ultra',
}

export const STAFFING_COMPLEXITY_LABELS: Record<string, string> = {
  low:       'Low',
  medium:    'Medium',
  high:      'High',
  light:     'Light',
  moderate:  'Moderate',
  intensive: 'Intensive',
}

export const ALL_TEMPLATE_CATEGORIES: TemplateCategory[] = [
  'culinary', 'social', 'wellness', 'cultural',
  'workshop', 'networking', 'seasonal', 'family', 'experiential',
]
