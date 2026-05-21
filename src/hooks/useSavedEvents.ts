/**
 * useSavedEvents — Supabase-backed hook
 *
 * Replaces the old localStorage version. Provides:
 *   events       - current list
 *   status       - 'idle' | 'loading' | 'success' | 'error'
 *   error        - last error message or null
 *   fetch()      - (re)load all events from Supabase
 *   save(event)  - insert a new event, returns the persisted row
 *   remove(id)   - delete by id
 */

import { useState, useCallback, useEffect } from 'react'
import type { SavedEvent, AsyncStatus } from '@/types'
import {
  fetchEventPlans,
  createEventPlan,
  deleteEventPlan,
  updateEventPlanStatus,
  updateEventPlanField,
} from '@/lib/eventService'
import type { EventWorkflowStatus } from '@/types'

interface UseSavedEventsReturn {
  events: SavedEvent[]
  status: AsyncStatus
  error: string | null
  fetch: () => Promise<void>
  save: (event: SavedEvent) => Promise<SavedEvent | null>
  remove: (id: string) => Promise<void>
  updateStatus: (id: string, status: EventWorkflowStatus) => Promise<void>
  updateField: (id: string, patch: Record<string, unknown>) => Promise<string | null>
  isSaved: (title: string, tagline: string) => boolean
}

export function useSavedEvents(): UseSavedEventsReturn {
  const [events, setEvents] = useState<SavedEvent[]>([])
  const [status, setStatus] = useState<AsyncStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setStatus('loading')
    setError(null)
    const result = await fetchEventPlans()
    if (result.error) {
      setError(result.error)
      setStatus('error')
      return
    }
    setEvents(result.data ?? [])
    setStatus('success')
  }, [])

  useEffect(() => {
    void fetch()
  }, [fetch])

  const save = useCallback(async (event: SavedEvent): Promise<SavedEvent | null> => {
    const result = await createEventPlan(event)
    if (result.error || !result.data) {
      setError(result.error ?? 'Failed to save event')
      return null
    }
    setEvents((prev) => [result.data!, ...prev])
    return result.data
  }, [])

  const remove = useCallback(async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    const result = await deleteEventPlan(id)
    if (result.error) {
      setError(result.error)
      void fetch()
    }
  }, [fetch])

  const isSaved = useCallback(
    (title: string, tagline: string) =>
      events.some((e) => e.title === title && e.tagline === tagline),
    [events]
  )

  const updateStatus = useCallback(async (id: string, status: EventWorkflowStatus) => {
    // Optimistic update
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, workflowStatus: status } : e))
    )
    const result = await updateEventPlanStatus(id, status)
    if (result.error) {
      setError(result.error)
      // Roll back on failure
      void fetch()
    }
  }, [fetch])

  const updateField = useCallback(async (
    id: string,
    patch: Record<string, unknown>
  ): Promise<string | null> => {
    // Optimistically patch the events list so cards stay current
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e
        // Map snake_case patch keys back to camelCase for local state
        const updates: Partial<SavedEvent> = {}
        if ('flyer_headline'   in patch) updates.flyerHeadline   = patch.flyer_headline as string
        if ('resident_email'   in patch) updates.residentEmail   = patch.resident_email as SavedEvent['residentEmail']
        if ('catering'         in patch) updates.catering        = patch.catering as string[]
        if ('entertainment'    in patch) updates.entertainment   = patch.entertainment as string[]
        if ('logistics'        in patch) updates.logistics       = patch.logistics as string[]
        if ('budget_breakdown' in patch) updates.budgetBreakdown = patch.budget_breakdown as string[]
        if ('setup_logistics'  in patch) updates.setupLogistics  = patch.setup_logistics as string[]
        if ('timeline'         in patch) updates.timeline        = patch.timeline as SavedEvent['timeline']
        if ('vendor_ideas'     in patch) updates.vendorIdeas     = patch.vendor_ideas as SavedEvent['vendorIdeas']
        if ('staffing'         in patch) updates.staffing        = patch.staffing as SavedEvent['staffing']
        if ('alcohol_estimate' in patch) updates.alcoholEstimate = patch.alcohol_estimate as SavedEvent['alcoholEstimate']
        if ('overview'         in patch) updates.overview        = patch.overview as string
        if ('theme'            in patch) updates.theme           = patch.theme as string
        if ('pro_tip'          in patch) updates.proTip          = patch.pro_tip as string
        return { ...e, ...updates }
      })
    )
    const result = await updateEventPlanField(id, patch)
    if (result.error) {
      setError(result.error)
      void fetch() // roll back on failure
      return result.error
    }
    return null
  }, [fetch])

  return { events, status, error, fetch, save, remove, updateStatus, updateField, isSaved }
}