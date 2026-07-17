/**
 * services/propertyService.ts
 *
 * Supabase CRUD for property_profiles.
 * One profile per user (identified by a stable userKey from localStorage).
 */

import { supabase } from '@/lib/supabase'
import type { PropertyProfile } from '@/types/property'
import { isExperienceActive, expGetProfile, expSaveProfile } from '@/experience/experienceStore'

// ─── User key ─────────────────────────────────────────────────────────────────
// No auth yet — use a stable random key persisted in localStorage.
// Replace with supabase.auth.getUser() once auth is enabled.

const USER_KEY_STORAGE = 'eleve_user_key'

export function getUserKey(): string {
  let key = localStorage.getItem(USER_KEY_STORAGE)
  if (!key) {
    key = `user_${Math.random().toString(36).slice(2)}_${Date.now()}`
    localStorage.setItem(USER_KEY_STORAGE, key)
  }
  return key
}

// ─── Row ↔ domain mappers ─────────────────────────────────────────────────────

type ProfileRow = Record<string, unknown>

function rowToProfile(row: ProfileRow): PropertyProfile {
  return {
    id:                    row.id as string,
    userKey:               row.user_key as string,
    propertyName:          row.property_name as string,
    propertyType:          row.property_type as PropertyProfile['propertyType'],
    city:                  row.city as string,
    state:                 row.state as string,
    unitCount:             row.unit_count as number | undefined,
    residentDemographic:   row.resident_demographic as string | undefined,
    communityPersonality:  row.community_personality as PropertyProfile['communityPersonality'],
    luxuryLevel:           row.luxury_level as PropertyProfile['luxuryLevel'],
    indoorSpaces:          row.indoor_spaces as string[] | undefined,
    outdoorSpaces:         row.outdoor_spaces as string[] | undefined,
    amenities:             row.amenities as PropertyProfile['amenities'],
    typicalAttendance:     row.typical_attendance as PropertyProfile['typicalAttendance'],
    preferredBudget:       row.preferred_budget as PropertyProfile['preferredBudget'],
    propertyDescription:   row.property_description as string | undefined,
    createdAt:             row.created_at as string | undefined,
    updatedAt:             row.updated_at as string | undefined,
  }
}

function profileToRow(p: PropertyProfile): ProfileRow {
  return {
    user_key:              p.userKey,
    property_name:         p.propertyName,
    property_type:         p.propertyType,
    city:                  p.city,
    state:                 p.state,
    unit_count:            p.unitCount ?? null,
    resident_demographic:  p.residentDemographic ?? null,
    community_personality: p.communityPersonality ?? null,
    luxury_level:          p.luxuryLevel ?? null,
    indoor_spaces:         p.indoorSpaces ?? null,
    outdoor_spaces:        p.outdoorSpaces ?? null,
    amenities:             p.amenities ?? null,
    typical_attendance:    p.typicalAttendance ?? null,
    preferred_budget:      p.preferredBudget ?? null,
    property_description:  p.propertyDescription ?? null,
  }
}

// ─── Service interface ────────────────────────────────────────────────────────

export interface ServiceResult<T> {
  data: T | null
  error: string | null
}

export async function fetchPropertyProfile(
  userKey: string
): Promise<ServiceResult<PropertyProfile>> {
  // Experience Elevé: serve the isolated experience profile
  if (isExperienceActive()) {
    return { data: expGetProfile(), error: null }
  }
  try {
    const { data, error } = await (supabase as any)
      .from('property_profiles')
      .select('*')
      .eq('user_key', userKey)
      .maybeSingle()

    if (error) return { data: null, error: error.message }
    if (!data)  return { data: null, error: null }
    return { data: rowToProfile(data as ProfileRow), error: null }
  } catch (err) {
    return { data: null, error: extractMessage(err) }
  }
}

export async function upsertPropertyProfile(
  profile: PropertyProfile
): Promise<ServiceResult<PropertyProfile>> {
  // Experience Elevé: persist to the isolated experience store
  if (isExperienceActive()) {
    return { data: expSaveProfile(profile), error: null }
  }
  try {
    const row = profileToRow(profile)

    // If we have an id, update; otherwise insert.
    if (profile.id) {
      const { data, error } = await (supabase as any)
        .from('property_profiles')
        .update(row)
        .eq('id', profile.id)
        .select()
        .single()

      if (error) return { data: null, error: error.message }
      return { data: rowToProfile(data as ProfileRow), error: null }
    } else {
      const { data, error } = await (supabase as any)
        .from('property_profiles')
        .insert(row)
        .select()
        .single()

      if (error) return { data: null, error: error.message }
      return { data: rowToProfile(data as ProfileRow), error: null }
    }
  } catch (err) {
    return { data: null, error: extractMessage(err) }
  }
}

function extractMessage(err: unknown): string {
  if (!err) return 'An unexpected error occurred'

  // Supabase error objects
  if (typeof err === 'object') {
    const e = err as Record<string, unknown>

    // Postgres error code surfaced by Supabase JS
    if (e.code === '42P01' || String(e.message ?? '').includes('does not exist')) {
      return 'Table not found: property_profiles does not exist. Run the Phase 3 migration SQL in your Supabase dashboard.'
    }
    if (e.code === '42501' || String(e.message ?? '').includes('row-level security')) {
      return 'Row-level security policy rejected this write. Check RLS policies on property_profiles in Supabase.'
    }
    if (e.code === 'PGRST301') {
      return 'Supabase returned no data after insert. Check that the table exists and RLS allows INSERT.'
    }
    if ('message' in e && typeof e.message === 'string') {
      return e.message
    }
  }

  if (typeof err === 'string') return err
  return 'An unexpected error occurred'
}
