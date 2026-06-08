/**
 * src/hooks/useVendors.ts
 * CRUD hook for the Vendor Hub. Mirrors useSavedEvents pattern.
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Vendor } from '@/types/vendor'
import { rowToVendor, vendorToRow } from '@/types/vendor'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface UseVendorsReturn {
  vendors:  Vendor[]
  status:   Status
  error:    string | null
  fetch:    () => Promise<void>
  add:      (v: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Vendor | null>
  update:   (id: string, patch: Partial<Vendor>) => Promise<string | null>
  remove:   (id: string) => Promise<void>
  toggle:   (id: string, field: 'favorite' | 'previouslyUsed') => Promise<void>
}

export function useVendors(): UseVendorsReturn {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [status, setStatus]   = useState<Status>('idle')
  const [error, setError]     = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('vendors')
        .select('*')
        .order('name', { ascending: true })

      if (err) throw new Error(err.message)
      setVendors((data ?? []).map(rowToVendor))
      setStatus('success')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load vendors')
      setStatus('error')
    }
  }, [])

  useEffect(() => { void fetch() }, [fetch])

  const add = useCallback(async (
    v: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Vendor | null> => {
    try {
      const { data, error: err } = await supabase
        .from('vendors')
        .insert([vendorToRow(v)])
        .select()
        .single()

      if (err) throw new Error(err.message)
      const vendor = rowToVendor(data)
      setVendors((prev) => [...prev, vendor].sort((a, b) => a.name.localeCompare(b.name)))
      return vendor
    } catch (e) {
      console.error('Failed to add vendor:', e)
      return null
    }
  }, [])

  const update = useCallback(async (
    id: string,
    patch: Partial<Vendor>
  ): Promise<string | null> => {
    try {
      const { error: err } = await supabase
        .from('vendors')
        .update(vendorToRow(patch))
        .eq('id', id)

      if (err) throw new Error(err.message)
      setVendors((prev) =>
        prev.map((v) => v.id === id ? { ...v, ...patch } : v)
      )
      return null
    } catch (e) {
      return e instanceof Error ? e.message : 'Failed to update vendor'
    }
  }, [])

  const remove = useCallback(async (id: string): Promise<void> => {
    try {
      await supabase.from('vendors').delete().eq('id', id)
      setVendors((prev) => prev.filter((v) => v.id !== id))
    } catch (e) {
      console.error('Failed to delete vendor:', e)
    }
  }, [])

  const toggle = useCallback(async (
    id: string,
    field: 'favorite' | 'previouslyUsed'
  ): Promise<void> => {
    const vendor = vendors.find((v) => v.id === id)
    if (!vendor) return
    const newValue = !vendor[field]
    await update(id, { [field]: newValue })
  }, [vendors, update])

  return { vendors, status, error, fetch, add, update, remove, toggle }
}
