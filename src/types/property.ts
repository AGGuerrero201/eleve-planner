/**
 * types/property.ts
 *
 * Property Intelligence System — Phase 3 types.
 * One property profile per user (single-property model for v1).
 */

// ─── Enums ────────────────────────────────────────────────────────────────────

export type PropertyType =
  | 'luxury_highrise'
  | 'multifamily_family'
  | 'multifamily_student'
  | 'active_adult'
  | 'branded_residence'
  | 'mixed_use'
  | 'midrise'
  | 'garden_style'

export type CommunityPersonality =
  | 'social'
  | 'wellness'
  | 'luxury'
  | 'networking'
  | 'family'
  | 'cultural'
  | 'fitness'
  | 'pet_friendly'

export type Amenity =
  | 'rooftop_terrace'
  | 'pool_deck'
  | 'golf_simulator'
  | 'resident_lounge'
  | 'fitness_center'
  | 'coworking_space'
  | 'childrens_playroom'
  | 'screening_room'
  | 'spa'
  | 'dog_run'
  | 'bocce_court'
  | 'outdoor_kitchen'
  | 'game_room'
  | 'yoga_studio'
  | 'private_dining'
  | 'wine_cellar'

export type TypicalAttendance = 'small' | 'medium' | 'large' | 'varies'
export type PreferredBudget   = 'budget' | 'moderate' | 'premium' | 'ultra'
export type LuxuryLevel       = 1 | 2 | 3 | 4 | 5

// ─── Display labels ───────────────────────────────────────────────────────────

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  luxury_highrise:     'Luxury High-Rise',
  multifamily_family:  'Multifamily — Family',
  multifamily_student: 'Multifamily — Student',
  active_adult:        'Active Adult (55+)',
  branded_residence:   'Branded Residence',
  mixed_use:           'Mixed-Use',
  midrise:             'Mid-Rise',
  garden_style:        'Garden Style',
}

export const COMMUNITY_PERSONALITY_LABELS: Record<CommunityPersonality, string> = {
  social:       'Social',
  wellness:     'Wellness-Focused',
  luxury:       'Luxury',
  networking:   'Networking-Focused',
  family:       'Family-Focused',
  cultural:     'Cultural',
  fitness:      'Fitness-Oriented',
  pet_friendly: 'Pet-Friendly',
}

export const AMENITY_LABELS: Record<Amenity, string> = {
  rooftop_terrace:   'Rooftop Terrace',
  pool_deck:         'Pool Deck',
  golf_simulator:    'Golf Simulator',
  resident_lounge:   'Resident Lounge',
  fitness_center:    'Fitness Center',
  coworking_space:   'Co-working Space',
  childrens_playroom:'Children\'s Playroom',
  screening_room:    'Screening Room',
  spa:               'Spa',
  dog_run:           'Dog Run',
  bocce_court:       'Bocce Court',
  outdoor_kitchen:   'Outdoor Kitchen',
  game_room:         'Game Room',
  yoga_studio:       'Yoga Studio',
  private_dining:    'Private Dining Room',
  wine_cellar:       'Wine Cellar',
}

export const ATTENDANCE_LABELS: Record<TypicalAttendance, string> = {
  small:  'Small (under 30)',
  medium: 'Medium (30–75)',
  large:  'Large (75–150)',
  varies: 'Varies',
}

export const BUDGET_LABELS: Record<PreferredBudget, string> = {
  budget:   'Budget (under $1,000)',
  moderate: 'Moderate ($1,000–$3,000)',
  premium:  'Premium ($3,000–$8,000)',
  ultra:    'Ultra-Premium ($8,000+)',
}

export const LUXURY_LEVEL_LABELS: Record<LuxuryLevel, string> = {
  1: 'Entry',
  2: 'Standard',
  3: 'Elevated',
  4: 'Premium',
  5: 'Ultra-Luxury',
}

// ─── Core interface ───────────────────────────────────────────────────────────

export interface PropertyProfile {
  id?:                   string
  userKey:               string

  // Required
  propertyName:          string
  propertyType:          PropertyType
  city:                  string
  state:                 string

  // Optional enrichment
  unitCount?:            number
  residentDemographic?:  string
  communityPersonality?: CommunityPersonality[]
  luxuryLevel?:          LuxuryLevel
  indoorSpaces?:         string[]
  outdoorSpaces?:        string[]
  amenities?:            Amenity[]
  typicalAttendance?:    TypicalAttendance
  preferredBudget?:      PreferredBudget
  propertyDescription?:  string

  createdAt?:            string
  updatedAt?:            string
}

// ─── Completion scoring ───────────────────────────────────────────────────────

/** Returns 0–100 completion score for a profile. */
export function getProfileCompletionScore(p: Partial<PropertyProfile>): number {
  const checks: boolean[] = [
    // Required (40 pts total, 10 each)
    Boolean(p.propertyName),
    Boolean(p.propertyType),
    Boolean(p.city),
    Boolean(p.state),
    // Optional enrichment (60 pts total)
    Boolean(p.residentDemographic),       // 10
    Boolean(p.communityPersonality?.length),  // 10
    Boolean(p.luxuryLevel),               // 10
    Boolean(p.amenities?.length),         // 10
    Boolean(p.typicalAttendance),         // 10
    Boolean(p.preferredBudget),           // 10
  ]
  const weights = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
  return checks.reduce((sum, ok, i) => sum + (ok ? weights[i] : 0), 0)
}

export function isProfileSufficient(p: Partial<PropertyProfile>): boolean {
  // Minimum bar for AI to use the profile: all 4 required + at least 2 optional
  const required = Boolean(p.propertyName && p.propertyType && p.city && p.state)
  const optionals = [
    p.residentDemographic,
    p.communityPersonality?.length,
    p.luxuryLevel,
    p.amenities?.length,
    p.typicalAttendance,
    p.preferredBudget,
  ].filter(Boolean).length
  return required && optionals >= 2
}

// ─── AI context block ─────────────────────────────────────────────────────────

/**
 * Serializes a PropertyProfile into a plain-text block injected into the
 * AI system prompt. Returns null if the profile is insufficient.
 */
export function buildPropertyContextBlock(
  profile: PropertyProfile | null | undefined
): string | null {
  if (!profile) return null
  if (!isProfileSufficient(profile)) return null

  const lines: string[] = []

  lines.push('=== PROPERTY CONTEXT ===')
  lines.push(`Property: ${profile.propertyName}`)
  lines.push(`Type: ${PROPERTY_TYPE_LABELS[profile.propertyType] ?? profile.propertyType}`)
  lines.push(`Location: ${profile.city}, ${profile.state}`)

  if (profile.unitCount) {
    lines.push(`Unit count: ${profile.unitCount}`)
  }

  if (profile.residentDemographic) {
    lines.push(`Resident profile: ${profile.residentDemographic}`)
  }

  if (profile.communityPersonality?.length) {
    const labels = profile.communityPersonality
      .map((p) => COMMUNITY_PERSONALITY_LABELS[p] ?? p)
      .join(', ')
    lines.push(`Community personality: ${labels}`)
  }

  if (profile.luxuryLevel) {
    lines.push(`Luxury level: ${profile.luxuryLevel}/5 (${LUXURY_LEVEL_LABELS[profile.luxuryLevel]})`)
  }

  const allSpaces = [
    ...(profile.indoorSpaces ?? []),
    ...(profile.outdoorSpaces ?? []),
  ]
  if (allSpaces.length) {
    lines.push(`Event spaces: ${allSpaces.join(', ')}`)
  }

  if (profile.amenities?.length) {
    const labels = profile.amenities
      .map((a) => AMENITY_LABELS[a] ?? a)
      .join(', ')
    lines.push(`Amenities: ${labels}`)
  }

  if (profile.typicalAttendance) {
    lines.push(`Typical event attendance: ${ATTENDANCE_LABELS[profile.typicalAttendance] ?? profile.typicalAttendance}`)
  }

  if (profile.preferredBudget) {
    lines.push(`Preferred budget range: ${BUDGET_LABELS[profile.preferredBudget] ?? profile.preferredBudget}`)
  }

  if (profile.propertyDescription) {
    lines.push(`Property description: ${profile.propertyDescription}`)
  }

  lines.push('')
  lines.push('=== GENERATION RULES ===')
  lines.push('- Create event names and themes specific to this property, its location, and its resident profile.')
  lines.push('- Reference available amenity spaces by name when planning activations.')
  lines.push('- Never use generic names such as: "Summer Soiree", "Resident Mixer", "Holiday Gathering", "Community Social".')
  lines.push('- Match the luxury level in all vendor, catering, and décor recommendations.')
  lines.push('- Tailor resident email messaging and flyer copy to the stated demographic and personality.')
  lines.push(`- Preferred naming style: incorporate the property name, city, or a distinctive local reference (e.g. "${profile.propertyName} Garden Social", "${profile.city} Rooftop Series").`)
  lines.push('=== END PROPERTY CONTEXT ===')

  return lines.join('\n')
}
