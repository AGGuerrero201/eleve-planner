/**
 * api.ts — calls the Supabase Edge Function generate-event-plan.
 *
 * Phase 1 additions:
 * - Session cache: identical form inputs return instantly without a Claude call
 * - Notes truncation: enforced at 500 chars before sending to the Edge Function
 *
 * Phase 3 addition:
 * - Accepts an optional propertyContextBlock string.
 *   When provided, it is forwarded to the Edge Function and injected into
 *   the system prompt before event parameters.
 *   Falls back gracefully to the original behaviour when null/undefined.
 */

import { supabase } from '@/lib/supabase'
import type {
  EventFormData,
  EventPlan,
  GenerateEventResponse,
  EdgeFunctionError,
} from '@/types'
import { isExperienceActive, expGetProfile, logActivity } from '@/experience/experienceStore'
import { composeExperiencePlan } from '@/experience/localPlanEngine'

// ─── Retry config ─────────────────────────────────────────────────────────────

const MAX_RETRIES = 2
const RETRY_DELAY_MS = 1200

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── Session cache ────────────────────────────────────────────────────────────
// Keyed by a stable JSON hash of EventFormData + propertyContextBlock.
// Lives only for the browser session — cleared on page refresh.

const sessionCache = new Map<string, EventPlan>()

function hashFormData(data: EventFormData, propertyContextBlock?: string | null): string {
  const stable = {
    eventType:   data.eventType,
    budget:      data.budget,
    attendance:  data.attendance,
    season:      data.season,
    venue:       data.venue,
    alcohol:     data.alcohol,
    demographic: data.demographic,
    notes:       data.notes.trim(),
    // Include property context in cache key so changing the profile busts the cache
    propertyCtx: propertyContextBlock ?? '',
  }
  return JSON.stringify(stable)
}

// ─── Main function ────────────────────────────────────────────────────────────

export async function generateEventPlan(
  data: EventFormData,
  propertyContextBlock?: string | null
): Promise<EventPlan> {
  // 1. Truncate notes
  const safeData: EventFormData = {
    ...data,
    notes: data.notes.slice(0, 500),
  }

  // Experience Elevé: compose the plan locally so the guided walkthrough
  // never depends on network access or API keys. The pause lets the
  // generation sequence play naturally; the session cache is bypassed so
  // "Regenerate" always produces a visibly fresh take.
  if (isExperienceActive()) {
    await sleep(4200 + Math.random() * 1400)
    const plan = composeExperiencePlan(safeData, expGetProfile())
    logActivity('generated', `Generated \u201C${plan.title}\u201D`)
    return plan
  }

  // 2. Return cached result if available
  const cacheKey = hashFormData(safeData, propertyContextBlock)
  const cached = sessionCache.get(cacheKey)
  if (cached) return cached

  // 3. Call the Edge Function
  let lastError: Error = new Error('Unknown error')

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      const body: Record<string, unknown> = { formData: safeData }

      // Phase 3: attach property context if available
      if (propertyContextBlock) {
        body.propertyContext = propertyContextBlock
      }

      let responseData: GenerateEventResponse | null = null
      let invokeError: unknown = null

      try {
        const result = await supabase.functions.invoke<GenerateEventResponse>(
          'generate-event-plan',
          { body }
        )
        responseData = result.data
        invokeError  = result.error
      } catch (rawErr) {
        // supabase-js throws when it can't parse the response as JSON.
        // Attempt to recover the raw text and repair it ourselves.
        const msg = rawErr instanceof Error ? rawErr.message : String(rawErr)
        const isJsonError = msg.includes('JSON') || msg.includes('Unexpected token') || msg.includes('position')

        if (!isJsonError) throw rawErr

        // Re-fetch the Edge Function directly to get the raw text
        try {
          const supabaseUrl = (supabase as any).supabaseUrl as string
          const supabaseKey = (supabase as any).supabaseKey as string
          const res = await fetch(
            `${supabaseUrl}/functions/v1/generate-event-plan`,
            {
              method:  'POST',
              headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey':        supabaseKey,
              },
              body: JSON.stringify(body),
            }
          )
          const rawText  = await res.text()
          const repaired = repairJson(rawText)
          const parsed   = JSON.parse(repaired) as GenerateEventResponse
          responseData   = parsed
        } catch {
          // Repair failed — surface the original error
          throw new Error(`JSON parse error from Edge Function: ${msg}`)
        }
      }

      const error = invokeError

      if (error) {
        const edgeError = await parseEdgeFunctionError(error)
        if (!edgeError.retryable || attempt > MAX_RETRIES) {
          throw new Error(edgeError.error)
        }
        lastError = new Error(edgeError.error)
        await sleep(RETRY_DELAY_MS * attempt)
        continue
      }

      if (!responseData?.plan) {
        throw new Error('Edge Function returned an empty response. Check function logs.')
      }

      sessionCache.set(cacheKey, responseData.plan)
      return responseData.plan
    } catch (err) {
      if (err instanceof Error) lastError = err

      const msg = lastError.message.toLowerCase()
      const isRetryable =
        msg.includes('overloaded') ||
        msg.includes('timeout') ||
        msg.includes('503') ||
        msg.includes('529')

      if (!isRetryable || attempt > MAX_RETRIES) throw lastError
      await sleep(RETRY_DELAY_MS * attempt)
    }
  }

  throw lastError
}

// ─── JSON repair ──────────────────────────────────────────────────────────────
// The Edge Function occasionally returns truncated or trailing-comma JSON
// when the AI response is cut off. This attempts lightweight fixes before
// passing the error back to the user.

function repairJson(raw: string): string {
  let s = raw.trim()

  // Strip markdown code fences if the AI wrapped the response
  s = s.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

  // Remove trailing commas before } or ]
  s = s.replace(/,\s*([}\]])/g, '$1')

  // If the string is truncated mid-object, attempt to close open structures
  // Count unmatched braces/brackets
  let braces   = 0
  let brackets = 0
  let inString = false
  let escape   = false

  for (const ch of s) {
    if (escape)          { escape = false; continue }
    if (ch === '\\' && inString) { escape = true; continue }
    if (ch === '"')      { inString = !inString; continue }
    if (inString)        continue
    if (ch === '{')      braces++
    if (ch === '}')      braces--
    if (ch === '[')      brackets++
    if (ch === ']')      brackets--
  }

  // Close any unclosed strings, then close structures
  if (inString) s += '"'
  while (brackets > 0) { s += ']'; brackets-- }
  while (braces > 0)   { s += '}'; braces-- }

  return s
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function parseEdgeFunctionError(error: unknown): Promise<EdgeFunctionError> {
  if (
    error &&
    typeof error === 'object' &&
    'context' in error &&
    error.context instanceof Response
  ) {
    try {
      const body = await (error.context as Response).json() as EdgeFunctionError
      return {
        error: body.error ?? 'Edge Function error',
        code: body.code,
        retryable: body.retryable ?? false,
      }
    } catch {
      // fall through
    }
  }

  const msg =
    error instanceof Error ? error.message :
    typeof error === 'string' ? error :
    'Edge Function call failed'

  return {
    error: msg,
    retryable: msg.includes('overloaded') || msg.includes('timeout'),
  }
}
