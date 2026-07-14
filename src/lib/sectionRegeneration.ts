/**
 * sectionRegeneration.ts
 *
 * Calls the existing generate-event-plan Edge Function with a `section`
 * parameter to regenerate one section of a saved event plan.
 *
 * Token cost: ~400 input + ~200 output vs ~1,650 + ~2,000 for full generation.
 * The system prompt is still served from cache (Phase 1 caching).
 */

import { supabase } from '@/lib/supabase'
import { isExperienceActive } from '@/experience/experienceStore'
import { composeSectionVariant } from '@/experience/localPlanEngine'
import type {
  RegenerableSection,
  SectionRegenerationRequest,
  SectionRegenerationResponse,
  SavedEvent,
  EventFormData,
  TimelineItem,
  VendorIdea,
  StaffingRole,
  ResidentEmail,
} from '@/types'

// ─── Section labels shown in the loading UI ───────────────────────────────────

export const SECTION_LABELS: Record<RegenerableSection, string> = {
  catering:        'Catering',
  entertainment:   'Entertainment',
  setup_logistics: 'Setup Logistics',
  timeline:        'Timeline',
  staffing:        'Staffing',
  vendor_ideas:    'Vendor Ideas',
  resident_email:  'Resident Email',
  flyer_headline:  'Flyer Headline',
  pro_tip:         'Pro Tip',
}

// ─── Result types per section ─────────────────────────────────────────────────

export type SectionValue =
  | string          // flyer_headline, pro_tip
  | string[]        // catering, entertainment, setup_logistics
  | TimelineItem[]  // timeline
  | StaffingRole[]  // staffing
  | VendorIdea[]    // vendor_ideas
  | ResidentEmail   // resident_email

// ─── Main function ────────────────────────────────────────────────────────────

export async function regenerateSection(
  event: SavedEvent,
  section: RegenerableSection
): Promise<{ value: SectionValue; error: null } | { value: null; error: string }> {
  // Experience Elevé: regenerate from the local content engine — real
  // alternative content, no network dependency, brief pause for pacing.
  if (isExperienceActive()) {
    await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 700))
    const value = composeSectionVariant(event, section) as SectionValue
    return { value, error: null }
  }

  const request: SectionRegenerationRequest = {
    formData: event.meta as EventFormData,
    section,
    eventContext: {
      title:       event.title,
      eventType:   event.meta?.eventType ?? '',
      budget:      event.meta?.budget ?? '',
      attendance:  event.meta?.attendance ?? '',
      venue:       event.meta?.venue ?? '',
      alcohol:     event.meta?.alcohol ?? '',
      demographic: event.meta?.demographic ?? '',
      season:      event.meta?.season ?? '',
    },
  }

  try {
    const { data, error } = await supabase.functions.invoke<SectionRegenerationResponse>(
      'generate-event-plan',
      { body: request }
    )

    if (error) {
      const msg = error instanceof Error ? error.message : 'Section regeneration failed'
      return { value: null, error: msg }
    }

    if (!data?.value) {
      return { value: null, error: 'Edge Function returned an empty response' }
    }

    return { value: data.value as SectionValue, error: null }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return { value: null, error: msg }
  }
}

// ─── Maps section → Supabase column patch object ─────────────────────────────
// Used by handleFieldSave in SavedEventsPage to persist the regenerated value.

export function sectionToPatch(
  section: RegenerableSection,
  value: SectionValue
): Record<string, unknown> {
  return { [section]: value }
}