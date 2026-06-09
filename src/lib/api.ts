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

      const { data: responseData, error } = await supabase.functions.invoke<GenerateEventResponse>(
        'generate-event-plan',
        { body }
      )

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
