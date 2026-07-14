/**
 * experience/seedData.ts
 *
 * Realistic seed content for Experience Elevé, modeled on a luxury
 * multifamily high-rise: "The Meridian" in Austin, TX.
 *
 * Seed events are composed by the same plan engine that powers live
 * generation in the experience, so every seeded event is a complete,
 * fully editable EventPlan — statuses span the whole workflow
 * (upcoming work-in-progress, drafts, and delivered history) so the
 * library, dashboard, and filters all feel alive on first open.
 */

import type { SavedEvent, EventFormData, EventWorkflowStatus } from '@/types'
import type { Vendor } from '@/types/vendor'
import type { PropertyProfile } from '@/types/property'
import { composeExperiencePlan } from './localPlanEngine'
import type { ActivityEntry } from './experienceStore'

// ─── Time helpers ───────────────────────────────────────────────────────────────

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()
}

function hoursAgo(n: number): string {
  return new Date(Date.now() - n * 60 * 60 * 1000).toISOString()
}

// ─── Property profile ───────────────────────────────────────────────────────────

function buildProfile(): PropertyProfile {
  return {
    id:                   'exp_profile',
    userKey:              'experience',
    propertyName:         'The Meridian',
    propertyType:         'luxury_highrise',
    city:                 'Austin',
    state:                'TX',
    unitCount:            312,
    residentDemographic:  'Young Professionals (25–35)',
    communityPersonality: ['social', 'luxury', 'wellness'],
    luxuryLevel:          4,
    amenities: [
      'rooftop_terrace',
      'pool_deck',
      'resident_lounge',
      'fitness_center',
      'screening_room',
      'outdoor_kitchen',
      'private_dining',
      'coworking_space',
    ],
    typicalAttendance:    'medium',
    preferredBudget:      'premium',
    propertyDescription:
      'A 32-story glass tower in the Rainey Street district with sweeping views of Lady Bird Lake. ' +
      'Residents skew toward founders, designers, and healthcare professionals who expect hotel-grade ' +
      'service. The rooftop terrace at sunset is the property\u2019s signature moment, and events that use ' +
      'it well consistently outperform everything else on the calendar.',
    createdAt: daysAgo(94),
    updatedAt: daysAgo(6),
  }
}

// ─── Seed events ────────────────────────────────────────────────────────────────

interface SeedEventSpec {
  id:        string
  form:      EventFormData
  status:    EventWorkflowStatus
  savedAt:   string
  title?:    string   // optional override for named variety
  tagline?:  string
}

const SEED_EVENT_SPECS: SeedEventSpec[] = [
  {
    id:      'exp_evt_terrace',
    status:  'in_progress',
    savedAt: daysAgo(2),
    form: {
      eventType:   'Cocktail Reception',
      budget:      '$5,000 – $10,000',
      attendance:  '50 – 100 residents',
      season:      'Summer',
      venue:       'Rooftop',
      alcohol:     'Full bar',
      demographic: 'Young professionals (25–35)',
      notes:       'Anchor event for the summer calendar — use the west terrace for sunset.',
    },
    title:   'Golden Hour on the Terrace',
    tagline: 'An evening of signature pours and skyline views',
  },
  {
    id:      'exp_evt_wine',
    status:  'finalized',
    savedAt: daysAgo(5),
    form: {
      eventType:   'Wine & Cheese Evening',
      budget:      '$2,500 – $5,000',
      attendance:  '25 – 50 residents',
      season:      'Summer',
      venue:       'Indoor',
      alcohol:     'Wine & beer only',
      demographic: 'Mixed',
      notes:       'Private dining room; sommelier confirmed.',
    },
    title:   'Vines & Vintages',
    tagline: 'Five pours, five pairings, one perfect evening',
  },
  {
    id:      'exp_evt_yoga',
    status:  'draft',
    savedAt: daysAgo(1),
    form: {
      eventType:   'Wellness & Yoga Morning',
      budget:      '$1,000 – $2,500',
      attendance:  '10 – 25 residents',
      season:      'Summer',
      venue:       'Outdoor',
      alcohol:     'No alcohol',
      demographic: 'Young professionals (25–35)',
      notes:       'Pool deck at sunrise, wellness caf\u00e9 after.',
    },
    title:   'Sunrise Flow on the Deck',
    tagline: 'Begin the weekend restored',
  },
  {
    id:      'exp_evt_supper',
    status:  'draft',
    savedAt: hoursAgo(9),
    form: {
      eventType:   'Cooking Class',
      budget:      '$2,500 – $5,000',
      attendance:  '10 – 25 residents',
      season:      'Fall / Autumn',
      venue:       'Indoor',
      alcohol:     'Wine & beer only',
      demographic: 'Mixed',
      notes:       'First session of a possible monthly supper-club series.',
    },
    title:   'The Supper Club: Session One',
    tagline: 'Cook together, eat together',
  },
  {
    id:      'exp_evt_pool',
    status:  'archived',
    savedAt: daysAgo(38),
    form: {
      eventType:   'Pool Party',
      budget:      '$5,000 – $10,000',
      attendance:  '100 – 200 residents',
      season:      'Summer',
      venue:       'Pool deck',
      alcohol:     'Full bar',
      demographic: 'Mixed',
      notes:       'Delivered June 6 — highest attendance of the year so far.',
    },
    title:   'Midsummer Splash',
    tagline: 'The deck event of the season',
  },
  {
    id:      'exp_evt_gala',
    status:  'archived',
    savedAt: daysAgo(205),
    form: {
      eventType:   'Holiday Party',
      budget:      '$10,000 – $25,000',
      attendance:  '100 – 200 residents',
      season:      'Winter',
      venue:       'Indoor',
      alcohol:     'Full bar',
      demographic: 'Mixed',
      notes:       'Annual signature event. Resident survey rated it 4.9 / 5.',
    },
    title:   'The Meridian Winter Gala',
    tagline: 'The season\u2019s most anticipated evening',
  },
]

function buildEvents(profile: PropertyProfile): SavedEvent[] {
  return SEED_EVENT_SPECS.map((spec) => {
    const plan = composeExperiencePlan(spec.form, profile)
    return {
      ...plan,
      title:          spec.title ?? plan.title,
      tagline:        spec.tagline ?? plan.tagline,
      id:             spec.id,
      savedAt:        spec.savedAt,
      created_at:     spec.savedAt,
      workflowStatus: spec.status,
      meta: {
        eventType:   spec.form.eventType,
        budget:      spec.form.budget,
        attendance:  spec.form.attendance,
        season:      spec.form.season,
        venue:       spec.form.venue,
        alcohol:     spec.form.alcohol,
        demographic: spec.form.demographic,
      },
    }
  })
}

// ─── Vendors ────────────────────────────────────────────────────────────────────

function buildVendors(): Vendor[] {
  const specs: Array<Omit<Vendor, 'createdAt' | 'updatedAt'>> = [
    {
      id: 'exp_v_terroir', name: 'Terroir Catering Co.', category: 'catering',
      serviceArea: 'Greater Austin', priceTier: 'premium', coiStatus: 'on_file',
      notes: 'Go-to for passed-service evenings. Ask for Danielle — she knows the terrace layout.',
      tags: ['passed service', 'seasonal menus', 'reliable'],
      contact: { name: 'Danielle Reyes', email: 'events@terroircatering.com', phone: '(512) 555-0134' },
      previouslyUsed: true, favorite: true, rating: 5,
    },
    {
      id: 'exp_v_larder', name: 'The Larder Group', category: 'catering',
      serviceArea: 'Austin & Hill Country', priceTier: 'luxury', coiStatus: 'on_file',
      notes: 'Reserved for signature events — carving stations and plated dinners.',
      tags: ['plated dinners', 'carving station', 'gala-grade'],
      contact: { name: 'Marcus Hale', email: 'marcus@thelardergroup.com' },
      previouslyUsed: true, favorite: false, rating: 5,
    },
    {
      id: 'exp_v_gilded', name: 'Gilded Pour Bar Co.', category: 'bar_service',
      serviceArea: 'Greater Austin', priceTier: 'premium', coiStatus: 'on_file',
      notes: 'Certified bartenders, beautiful mobile bar. Signature-cocktail design included.',
      tags: ['mobile bar', 'TABC certified', 'signature cocktails'],
      contact: { name: 'Priya Natarajan', email: 'book@gildedpour.com', phone: '(512) 555-0186' },
      previouslyUsed: true, favorite: true, rating: 5,
    },
    {
      id: 'exp_v_stem', name: 'Stem & Thorn Florals', category: 'florals',
      serviceArea: 'Austin', priceTier: 'premium', coiStatus: 'requested',
      notes: 'Stunning installations; COI requested for the fall calendar.',
      tags: ['installations', 'seasonal', 'photo moments'],
      contact: { email: 'studio@stemandthorn.com' },
      previouslyUsed: false, favorite: false, rating: 4,
    },
    {
      id: 'exp_v_duet', name: 'Duet & Co. Strings', category: 'entertainment',
      serviceArea: 'Central Texas', priceTier: 'mid', coiStatus: 'on_file',
      notes: 'Acoustic duo through jazz quartet configurations. Residents request them by name.',
      tags: ['jazz', 'acoustic', 'resident favorite'],
      contact: { name: 'Sofia Marchetti', phone: '(512) 555-0119' },
      previouslyUsed: true, favorite: true, rating: 5,
    },
    {
      id: 'exp_v_beacon', name: 'Beacon AV Productions', category: 'av_production',
      serviceArea: 'Greater Austin', priceTier: 'premium', coiStatus: 'on_file',
      notes: 'Outdoor cinema packages and uplighting. Handled the 20-foot screen flawlessly.',
      tags: ['outdoor cinema', 'uplighting', 'audio'],
      contact: { email: 'hello@beaconav.com', website: 'beaconav.com' },
      previouslyUsed: true, favorite: false, rating: 4,
    },
    {
      id: 'exp_v_polished', name: 'Polished Staffing Collective', category: 'staffing',
      serviceArea: 'Austin', priceTier: 'mid', coiStatus: 'on_file',
      notes: 'Event staff, coat check, and certified lifeguards for deck events.',
      tags: ['event staff', 'lifeguards', 'coat check'],
      contact: { name: 'Jordan Wills', phone: '(512) 555-0172' },
      previouslyUsed: true, favorite: false, rating: 4,
    },
    {
      id: 'exp_v_lumen', name: 'Lumen Photography', category: 'photography',
      serviceArea: 'Austin', priceTier: 'mid', coiStatus: 'requested',
      notes: 'Great with golden-hour terrace shots; portrait corner setup available.',
      tags: ['event coverage', 'portraits', 'instant prints'],
      contact: { email: 'shoot@lumenphoto.co' },
      previouslyUsed: false, favorite: false, rating: 4,
    },
    {
      id: 'exp_v_solstice', name: 'Solstice Wellness Studio', category: 'wellness',
      serviceArea: 'Downtown Austin', priceTier: 'mid', coiStatus: 'on_file',
      notes: 'Certified instructors for yoga, sound baths, and breathwork. Brings mats for 30.',
      tags: ['yoga', 'sound bath', 'insured instructors'],
      contact: { name: 'Amara Chen', email: 'amara@solsticewellness.co' },
      previouslyUsed: true, favorite: false, rating: 5,
    },
    {
      id: 'exp_v_copper', name: 'Copper Kettle Coffee Cart', category: 'specialty',
      serviceArea: 'Austin metro', priceTier: 'budget', coiStatus: 'expired',
      notes: 'Charming espresso cart for morning events. COI expired — request renewal before booking.',
      tags: ['espresso cart', 'mornings', 'COI renewal needed'],
      contact: { phone: '(512) 555-0148' },
      previouslyUsed: true, favorite: false, rating: 4,
    },
  ]

  return specs.map((s, i) => ({
    ...s,
    createdAt: daysAgo(90 - i * 4),
    updatedAt: daysAgo(20 - i),
  }))
}

// ─── Activity feed ──────────────────────────────────────────────────────────────

function buildActivity(): ActivityEntry[] {
  return [
    { id: 'act_seed_1', ts: hoursAgo(9),  kind: 'generated', text: 'Generated “The Supper Club: Session One” with AI planning' },
    { id: 'act_seed_2', ts: daysAgo(1),   kind: 'saved',     text: 'Saved “Sunrise Flow on the Deck” to the event library' },
    { id: 'act_seed_3', ts: daysAgo(2),   kind: 'status',    text: 'Moved “Golden Hour on the Terrace” to In Progress' },
    { id: 'act_seed_4', ts: daysAgo(4),   kind: 'vendor',    text: 'Requested COI renewal from Stem & Thorn Florals' },
    { id: 'act_seed_5', ts: daysAgo(5),   kind: 'status',    text: 'Moved “Vines & Vintages” to Finalized' },
    { id: 'act_seed_6', ts: daysAgo(6),   kind: 'profile',   text: 'Updated The Meridian property profile' },
  ]
}

// ─── Public builder ─────────────────────────────────────────────────────────────

export interface SeedData {
  profile:  PropertyProfile
  events:   SavedEvent[]
  vendors:  Vendor[]
  activity: ActivityEntry[]
}

export function buildSeedData(): SeedData {
  const profile = buildProfile()
  return {
    profile,
    events:   buildEvents(profile),
    vendors:  buildVendors(),
    activity: buildActivity(),
  }
}
