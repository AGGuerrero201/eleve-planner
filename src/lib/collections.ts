/**
 * src/lib/collections.ts
 *
 * Curated collection definitions for the Elevé template library.
 * All templateIds verified against actual template IDs in templates.ts.
 * Uses correct TemplateCategory values from types/templates.ts.
 */

import { LUXURY_TEMPLATES } from '@/lib/templates'
import type { Collection, ResolvedCollection } from '@/types/collections'
import { getCurrentSeasonalCollectionId } from '@/types/collections'

const SEASONAL_COLLECTIONS: Collection[] = [
  {
    id: 'spring-experiences',
    label: 'Spring Experiences',
    description: 'Outdoor-forward programming as the season opens: terraces, rooftops, and fresh social energy.',
    tier: 'seasonal',
    glyph: '❧',
    activeMonths: [3, 4, 5],
    tags: ['Outdoor', 'Morning', 'Social'],
    templateIds: ['rooftop-yoga-at-dawn', 'terrace-aperitivo-social', 'resident-art-opening', 'open-exchange-forum', 'craft-cocktail-brunch', 'cocktail-craft-session'],
  },
  {
    id: 'summer-rooftop-series',
    label: 'Summer Rooftop Series',
    description: 'The building\'s rooftop at its best: golden hour receptions, poolside socials, and cinema evenings.',
    tier: 'seasonal',
    glyph: '◎',
    activeMonths: [6, 7, 8],
    tags: ['Rooftop', 'Evening', 'Full Bar'],
    templateIds: ['golden-hour-reception', 'grand-pool-opening', 'rooftop-cinema-evening', 'the-rooftop-residency', 'poolside-family-social', 'terrace-aperitivo-social'],
  },
  {
    id: 'fall-entertaining',
    label: 'Fall Entertaining',
    description: 'The season\'s richest programming: harvest suppers, wine tastings, and curated social evenings.',
    tier: 'seasonal',
    glyph: '◈',
    activeMonths: [9, 10, 11],
    tags: ['Culinary', 'Evening', 'Wine'],
    templateIds: ['harvest-supper-series', 'sommelier-social', 'bourbon-and-provisions', 'the-founders-collective', 'garden-harvest-table', 'ceramic-studio-evening'],
  },
  {
    id: 'winter-holiday',
    label: 'Winter & Holiday',
    description: 'From intimate chef\'s dinners to the building\'s signature year-end celebration.',
    tier: 'seasonal',
    glyph: '❄',
    activeMonths: [12, 1, 2],
    tags: ['Celebratory', 'Evening', 'Full Bar'],
    templateIds: ['grand-winter-salon', 'new-year-champagne-social', 'the-champagne-residency', 'chefs-counter-evening', 'reserve-cellar-tasting', 'private-spa-morning'],
  },
]

const HOSPITALITY_COLLECTIONS: Collection[] = [
  {
    id: 'culinary-evenings',
    label: 'Culinary Evenings',
    description: 'Chef-led dinners, guided tastings, and artisan food experiences for food-literate residents.',
    tier: 'hospitality',
    glyph: '◆',
    tags: ['Chef-Led', 'Evening', 'Wine'],
    templateIds: ['sommelier-social', 'chefs-counter-evening', 'garden-harvest-table', 'reserve-cellar-tasting', 'bourbon-and-provisions', 'craft-cocktail-brunch'],
  },
  {
    id: 'wellness-weekends',
    label: 'Wellness Weekends',
    description: 'Restorative programming for residents who value stillness, movement, and intentional recovery.',
    tier: 'hospitality',
    glyph: '◇',
    tags: ['Morning', 'Non-Alcoholic', 'Restorative'],
    templateIds: ['sound-stillness-session', 'rooftop-yoga-at-dawn', 'early-morning-restore', 'private-spa-morning'],
  },
  {
    id: 'elevated-networking',
    label: 'Elevated Networking',
    description: 'Professional socials designed to create real connections, not generic happy hours.',
    tier: 'hospitality',
    glyph: '◉',
    tags: ['Professional', 'Evening', 'Social'],
    templateIds: ['the-founders-collective', 'industry-salon', 'open-exchange-forum'],
  },
  {
    id: 'craft-workshops',
    label: 'Craft Workshops',
    description: 'Skill-based evenings where residents make something real. And take it home.',
    tier: 'hospitality',
    glyph: '◁',
    tags: ['Hands-On', 'Evening', 'Take-Home'],
    templateIds: ['modern-needle-atelier', 'cocktail-craft-session', 'ceramic-studio-evening'],
  },
  {
    id: 'luxury-popups',
    label: 'Luxury Pop-Ups',
    description: 'One-night experiences that transform the building into a genuine cultural venue.',
    tier: 'hospitality',
    glyph: '◈',
    tags: ['Exclusive', 'Evening', 'Premium'],
    templateIds: ['the-champagne-residency', 'signature-chef-debut', 'resident-art-opening'],
  },
  {
    id: 'family-programming',
    label: 'Family Programming',
    description: 'All-ages events that make residents with families feel genuinely considered.',
    tier: 'hospitality',
    glyph: '○',
    tags: ['All Ages', 'Daytime', 'Non-Alcoholic'],
    templateIds: ['garden-cinema-evening', 'poolside-family-social'],
  },
]

const OPERATIONAL_COLLECTIONS: Collection[] = [
  {
    id: 'low-lift-programming',
    label: 'Low-Lift Programming',
    description: 'High-impact events with easy operations and entry-level budgets. Great starting points.',
    tier: 'operational',
    glyph: '◁',
    tags: ['Easy Ops', 'Entry Budget'],
    templateIds: ['sound-stillness-session', 'rooftop-yoga-at-dawn', 'early-morning-restore', 'terrace-aperitivo-social', 'open-exchange-forum', 'industry-salon', 'modern-needle-atelier', 'resident-art-opening'],
  },
  {
    id: 'signature-resident-events',
    label: 'Signature Resident Events',
    description: 'Premium productions that define the building\'s identity and become annual anchors.',
    tier: 'operational',
    glyph: '▷',
    tags: ['Premium', 'High Impact', 'Annual'],
    templateIds: ['grand-winter-salon', 'grand-pool-opening', 'signature-chef-debut', 'the-champagne-residency', 'harvest-supper-series', 'new-year-champagne-social'],
  },
  {
    id: 'social-calendar-highlights',
    label: 'Social Calendar Highlights',
    description: 'The events residents look forward to and talk about. Building community one gathering at a time.',
    tier: 'operational',
    glyph: '◀',
    tags: ['Community', 'Social', 'Recurring'],
    templateIds: ['golden-hour-reception', 'the-rooftop-residency', 'sommelier-social', 'terrace-aperitivo-social', 'midnight-cocktail-service', 'the-founders-collective'],
  },
]

export const ALL_COLLECTIONS: Collection[] = [
  ...SEASONAL_COLLECTIONS,
  ...HOSPITALITY_COLLECTIONS,
  ...OPERATIONAL_COLLECTIONS,
]

export function resolveCollection(collection: Collection): ResolvedCollection {
  const templates = collection.templateIds
    .map((id) => LUXURY_TEMPLATES.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => t !== undefined)
  return { ...collection, templates }
}

export function getFeaturedCollection(): ResolvedCollection {
  const id = getCurrentSeasonalCollectionId()
  const collection = ALL_COLLECTIONS.find((c) => c.id === id) ?? SEASONAL_COLLECTIONS[0]
  return resolveCollection(collection)
}

export function getSeasonalCollections(): ResolvedCollection[] {
  return SEASONAL_COLLECTIONS.map(resolveCollection).filter((c) => c.templates.length > 0)
}

export function getCollectionsByTier(tier: Collection['tier']): ResolvedCollection[] {
  return ALL_COLLECTIONS.filter((c) => c.tier === tier).map(resolveCollection).filter((c) => c.templates.length > 0)
}

export function getCollectionById(id: string): ResolvedCollection | null {
  const collection = ALL_COLLECTIONS.find((c) => c.id === id)
  if (!collection) return null
  return resolveCollection(collection)
}
