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
} from '@/lib/eventService'

interface UseSavedEventsReturn {
  events: SavedEvent[]
  status: AsyncStatus
  error: string | null
  fetch: () => Promise<void>
  save: (event: SavedEvent) => Promise<SavedEvent | null>
  remove: (id: string) => Promise<void>
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

  return { events, status, error, fetch, save, remove, isSaved }
}
