/**
 * api.ts — calls the Supabase Edge Function generate-event-plan.
 *
 * The Edge Function runs server-side in Deno, holds the Anthropic API key
 * as a secret, and returns a fully-structured EventPlan JSON. The browser
 * never touches the Anthropic API directly.
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

// ─── Main function ────────────────────────────────────────────────────────────

export async function generateEventPlan(data: EventFormData): Promise<EventPlan> {
  let lastError: Error = new Error('Unknown error')

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      const { data: responseData, error } = await supabase.functions.invoke<GenerateEventResponse>(
        'generate-event-plan',
        {
          body: { formData: data },
        }
      )

      // Supabase SDK wraps HTTP errors in `error`
      if (error) {
        // Try to extract the structured error from the function's JSON body
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

      return responseData.plan
    } catch (err) {
      if (err instanceof Error) {
        lastError = err
      }

      // Don't retry on non-retryable errors
      const msg = lastError.message.toLowerCase()
      const isRetryable =
        msg.includes('overloaded') ||
        msg.includes('timeout') ||
        msg.includes('503') ||
        msg.includes('529')

      if (!isRetryable || attempt > MAX_RETRIES) {
        throw lastError
      }

      await sleep(RETRY_DELAY_MS * attempt)
    }
  }

  throw lastError
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function parseEdgeFunctionError(error: unknown): Promise<EdgeFunctionError> {
  // The Supabase SDK FunctionsHttpError has a `context` with the response
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
    error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : 'Edge Function call failed'

  return {
    error: msg,
    retryable: msg.includes('overloaded') || msg.includes('timeout'),
  }
}
