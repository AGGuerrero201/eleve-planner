/**
 * context/PropertyContext.tsx
 *
 * Provides the active property profile to the whole app.
 * Loads on mount, persists changes to Supabase.
 * Safe if no profile exists — all consumers must handle null profile.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { PropertyProfile } from '@/types/property'
import {
  getProfileCompletionScore,
  isProfileSufficient,
  buildPropertyContextBlock,
} from '@/types/property'
import {
  fetchPropertyProfile,
  upsertPropertyProfile,
  getUserKey,
} from '@/services/propertyService'

// ─── Context shape ────────────────────────────────────────────────────────────

interface PropertyContextValue {
  /** The active property profile, or null if none exists yet. */
  profile:          PropertyProfile | null
  /** Whether the initial load is still in flight. */
  loading:          boolean
  /** 0–100 completion score. */
  completionScore:  number
  /** True if the profile has enough data for AI generation. */
  isSufficient:     boolean
  /** The formatted string injected into AI prompts, or null if insufficient. */
  contextBlock:     string | null
  /** Save a new or updated profile. Returns error string on failure, null on success. */
  saveProfile:      (profile: PropertyProfile) => Promise<string | null>
  /** Clear the in-memory profile (does not delete from DB). */
  clearProfile:     () => void
  /** Force a refetch from Supabase. */
  refetch:          () => Promise<void>
}

const PropertyContext = createContext<PropertyContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile]   = useState<PropertyProfile | null>(null)
  const [loading, setLoading]   = useState(true)

  const userKey = getUserKey()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await fetchPropertyProfile(userKey)
      if (result.data) setProfile(result.data)
    } finally {
      setLoading(false)
    }
  }, [userKey])

  useEffect(() => {
    void load()
  }, [load])

  const saveProfile = useCallback(
    async (updated: PropertyProfile): Promise<string | null> => {
      const result = await upsertPropertyProfile({ ...updated, userKey })
      if (result.error) return result.error
      if (result.data)  setProfile(result.data)
      return null
    },
    [userKey]
  )

  const clearProfile = useCallback(() => setProfile(null), [])
  const refetch      = useCallback(() => load(), [load])

  const completionScore = profile ? getProfileCompletionScore(profile) : 0
  const isSufficient    = profile ? isProfileSufficient(profile) : false
  const contextBlock    = profile ? buildPropertyContextBlock(profile) : null

  return (
    <PropertyContext.Provider
      value={{
        profile,
        loading,
        completionScore,
        isSufficient,
        contextBlock,
        saveProfile,
        clearProfile,
        refetch,
      }}
    >
      {children}
    </PropertyContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProperty(): PropertyContextValue {
  const ctx = useContext(PropertyContext)
  if (!ctx) {
    throw new Error('useProperty must be used inside <PropertyProvider>')
  }
  return ctx
}
