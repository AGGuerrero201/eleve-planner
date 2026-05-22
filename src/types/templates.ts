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

export type TemplateAtmosphere =
  | 'upscale-social'
  | 'relaxed-luxury'
  | 'wellness-focused'
  | 'networking-focused'
  | 'family-focused'

export type BudgetTier =
  | 'accessible'    // Under $1,000 – $2,500
  | 'mid'           // $2,500 – $5,000
  | 'premium'       // $5,000 – $10,000
  | 'luxury'        // $10,000+

export type StaffingComplexity = 'light' | 'moderate' | 'intensive'

export type OperationalDifficulty = 1 | 2 | 3 | 4 | 5

// ─── Core template interface ──────────────────────────────────────────────────

export interface LuxuryTemplate {
  // ── Identity ────────────────────────────────────────────────────────────
  id:          string           // slug: 'the-aperitivo-cart'
  label:       string           // display: 'The Aperitivo Cart'
  tagline:     string           // evocative 6-8 word brand line
  description: string           // 1-2 sentence card description

  // ── Classification ───────────────────────────────────────────────────────
  category:     TemplateCategory
  atmosphere:   TemplateAtmosphere
  demographic:  ResidentDemo[]   // supports multiple fits
  idealSeasons: Season[]
  budgetTier:   BudgetTier
  tags:         string[]         // ['low-staffing', 'no-vendor', 'instagram-worthy']

  // ── Operational profile ──────────────────────────────────────────────────
  venue:                  VenueSetting
  alcohol:                AlcoholService
  staffingComplexity:     StaffingComplexity
  operationalDifficulty:  OperationalDifficulty  // 1=minimal, 5=full production
  setupTimeHours:         number
  cleanupComplexity:      'minimal' | 'moderate' | 'involved'
  vendorTypes:            string[]
  requiresExternalVendor: boolean

  // ── Hospitality guidance ─────────────────────────────────────────────────
  luxuryPresentationNotes: string
  residentExperienceNotes: string
  setupNotes:              string
  staffingNotes:           string
  enhancements:            string[]  // 3 upgrade suggestions

  // ── Communications starters ──────────────────────────────────────────────
  flyerHeadline: string   // 5-7 word punchy headline
  emailIntro:    string   // 2-3 sentence email opening

  // ── UI display (subset of metadata for cards) ────────────────────────────
  previewTags: string[]   // 3 short tags shown on card

  // ── Generation ───────────────────────────────────────────────────────────
  formData:       EventFormData
  promptContext?: string    // injected into Claude prompt when seeding generation
  plan?:          EventPlan // defined = instant; undefined = Claude generates
}

// ─── Category metadata ────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  culinary:     'Culinary',
  social:       'Social',
  wellness:     'Wellness',
  cultural:     'Cultural',
  workshop:     'Workshop',
  networking:   'Networking',
  seasonal:     'Seasonal',
  family:       'Family',
  experiential: 'Experiential',
}

export const BUDGET_TIER_LABELS: Record<BudgetTier, string> = {
  accessible: 'Accessible',
  mid:        'Mid-Range',
  premium:    'Premium',
  luxury:     'Luxury',
}

export const STAFFING_COMPLEXITY_LABELS: Record<StaffingComplexity, string> = {
  light:     'Light',
  moderate:  'Moderate',
  intensive: 'Intensive',
}

export const ALL_TEMPLATE_CATEGORIES: TemplateCategory[] = [
  'culinary', 'social', 'wellness', 'cultural',
  'workshop', 'networking', 'seasonal', 'family', 'experiential',
]
