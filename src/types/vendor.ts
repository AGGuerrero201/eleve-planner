/**
 * src/types/vendor.ts
 * Type definitions for the Elevé Vendor Hub.
 */

export type VendorCategory =
  | 'catering'
  | 'bar_service'
  | 'florals'
  | 'entertainment'
  | 'av_production'
  | 'staffing'
  | 'photography'
  | 'wellness'
  | 'specialty'
  | 'other'

export type VendorPriceTier = 'budget' | 'mid' | 'premium' | 'luxury'

export type CoiStatus =
  | 'on_file'
  | 'requested'
  | 'expired'
  | 'not_required'
  | 'unknown'

export interface VendorContact {
  name?:    string
  email?:   string
  phone?:   string
  website?: string
}

export interface Vendor {
  id:             string
  name:           string
  category:       VendorCategory
  serviceArea:    string
  priceTier:      VendorPriceTier
  notes:          string
  coiStatus:      CoiStatus
  tags:           string[]
  contact:        VendorContact
  previouslyUsed: boolean
  favorite:       boolean
  rating?:        1 | 2 | 3 | 4 | 5
  createdAt:      string
  updatedAt:      string
}

// ─── Display labels ───────────────────────────────────────────────────────────

export const VENDOR_CATEGORY_LABELS: Record<VendorCategory, string> = {
  catering:      'Catering',
  bar_service:   'Bar Service',
  florals:       'Florals',
  entertainment: 'Entertainment',
  av_production: 'AV & Production',
  staffing:      'Staffing',
  photography:   'Photography',
  wellness:      'Wellness',
  specialty:     'Specialty',
  other:         'Other',
}

export const VENDOR_PRICE_TIER_LABELS: Record<VendorPriceTier, string> = {
  budget:  'Budget',
  mid:     'Mid-Range',
  premium: 'Premium',
  luxury:  'Luxury',
}

export const COI_STATUS_LABELS: Record<CoiStatus, string> = {
  on_file:      'COI on File',
  requested:    'COI Requested',
  expired:      'COI Expired',
  not_required: 'Not Required',
  unknown:      'Unknown',
}

export const ALL_VENDOR_CATEGORIES: VendorCategory[] = [
  'catering', 'bar_service', 'florals', 'entertainment',
  'av_production', 'staffing', 'photography', 'wellness', 'specialty', 'other',
]

export const ALL_PRICE_TIERS: VendorPriceTier[] = ['budget', 'mid', 'premium', 'luxury']

// ─── Supabase row → Vendor ────────────────────────────────────────────────────

export function rowToVendor(row: Record<string, unknown>): Vendor {
  return {
    id:             row.id as string,
    name:           row.name as string,
    category:       (row.category as VendorCategory) ?? 'other',
    serviceArea:    (row.service_area as string) ?? '',
    priceTier:      (row.price_tier as VendorPriceTier) ?? 'mid',
    notes:          (row.notes as string) ?? '',
    coiStatus:      (row.coi_status as CoiStatus) ?? 'unknown',
    tags:           (row.tags as string[]) ?? [],
    contact:        (row.contact as VendorContact) ?? {},
    previouslyUsed: (row.previously_used as boolean) ?? false,
    favorite:       (row.favorite as boolean) ?? false,
    rating:         row.rating as Vendor['rating'],
    createdAt:      row.created_at as string,
    updatedAt:      row.updated_at as string,
  }
}

// ─── Vendor → Supabase patch ──────────────────────────────────────────────────

export function vendorToRow(v: Partial<Vendor>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (v.name           !== undefined) row.name            = v.name
  if (v.category       !== undefined) row.category        = v.category
  if (v.serviceArea    !== undefined) row.service_area    = v.serviceArea
  if (v.priceTier      !== undefined) row.price_tier      = v.priceTier
  if (v.notes          !== undefined) row.notes           = v.notes
  if (v.coiStatus      !== undefined) row.coi_status      = v.coiStatus
  if (v.tags           !== undefined) row.tags            = v.tags
  if (v.contact        !== undefined) row.contact         = v.contact
  if (v.previouslyUsed !== undefined) row.previously_used = v.previouslyUsed
  if (v.favorite       !== undefined) row.favorite        = v.favorite
  if (v.rating         !== undefined) row.rating          = v.rating
  row.updated_at = new Date().toISOString()
  return row
}
