/**
 * src/pages/VendorHubPage.tsx
 * Main Vendor Hub page — browse, search, add, and manage vendors.
 */

import { useState, useMemo } from 'react'
import { Plus, RefreshCw, AlertCircle, Store } from 'lucide-react'
import { useVendors } from '@/hooks/useVendors'
import { VendorCard } from '@/components/vendors/VendorCard'
import { VendorModal } from '@/components/vendors/VendorModal'
import { VendorFilters, DEFAULT_FILTERS, applyFilters } from '@/components/vendors/VendorFilters'
import type { VendorFilterState } from '@/components/vendors/VendorFilters'
import type { Vendor, VendorCategory } from '@/types/vendor'
import { VENDOR_CATEGORY_LABELS, ALL_VENDOR_CATEGORIES } from '@/types/vendor'
import { cn } from '@/lib/utils'

export function VendorHubPage() {
  const { vendors, status, error, fetch, add, update, remove, toggle } = useVendors()
  const [filters, setFilters]         = useState<VendorFilterState>(DEFAULT_FILTERS)
  const [selectedVendor, setSelected] = useState<Vendor | null>(null)
  const [modalOpen, setModalOpen]     = useState(false)
  const [addMode, setAddMode]         = useState(false)

  // ── Filtered + grouped vendors ───────────────────────────────────────────

  const filtered = useMemo(() => applyFilters(vendors, filters), [vendors, filters])

  const grouped = useMemo(() => {
    const map = new Map<VendorCategory, Vendor[]>()
    for (const cat of ALL_VENDOR_CATEGORIES) {
      const inCat = filtered.filter((v) => v.category === cat)
      if (inCat.length > 0) map.set(cat, inCat)
    }
    return map
  }, [filtered])

  // ── Handlers ─────────────────────────────────────────────────────────────

  const openAdd = () => { setSelected(null); setAddMode(true); setModalOpen(true) }
  const openEdit = (vendor: Vendor) => { setSelected(vendor); setAddMode(false); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setSelected(null) }

  const handleSave = async (data: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (addMode) {
      await add(data)
    } else if (selectedVendor) {
      await update(selectedVendor.id, data)
    }
  }

  const handleDelete = async () => {
    if (!selectedVendor) return
    if (!window.confirm(`Delete "${selectedVendor.name}"?`)) return
    closeModal()
    await remove(selectedVendor.id)
  }

  const isLoading = status === 'loading'

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-serif text-[2.25rem] font-light text-charcoal mb-1.5 leading-tight">
            Vendor Hub
          </h1>
          {status === 'success' && vendors.length > 0 && (
            <p className="text-muted font-light text-[0.875rem]">
              {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} in your directory
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={() => void fetch()}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-[0.72rem] text-muted/70 hover:text-charcoal transition-colors duration-200 disabled:opacity-40"
          >
            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={openAdd}
            className={cn(
              'flex items-center gap-1.5 text-[0.72rem] font-medium tracking-[0.08em] uppercase',
              'bg-charcoal text-gold-light px-4 py-2.5 rounded-sm',
              'hover:bg-charcoal/90 transition-colors duration-150'
            )}
          >
            <Plus size={12} />
            Add Vendor
          </button>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      {status === 'success' && vendors.length > 0 && (
        <VendorFilters
          filters={filters}
          onChange={setFilters}
          totalCount={filtered.length}
        />
      )}

      {/* ── Loading skeleton ────────────────────────────────────────────── */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-border rounded-sm p-5 animate-pulse">
              <div className="h-2.5 w-16 bg-warm-gray rounded mb-3" />
              <div className="h-5 w-3/4 bg-warm-gray rounded mb-2" />
              <div className="h-3 w-1/2 bg-warm-gray rounded mb-4" />
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-warm-gray rounded" />
                <div className="h-5 w-14 bg-warm-gray rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────────────────── */}
      {status === 'error' && error && (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <div className="w-12 h-12 border border-red-100 bg-red-50 flex items-center justify-center rounded-sm">
            <AlertCircle size={18} className="text-red-400" />
          </div>
          <div>
            <p className="text-[0.875rem] text-charcoal-light font-light mb-1">Could not load vendors</p>
            <p className="text-[0.78rem] text-muted font-light">{error}</p>
          </div>
          <button
            onClick={() => void fetch()}
            className="text-[0.72rem] font-medium text-charcoal-light underline underline-offset-2 hover:text-charcoal transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* ── Empty — no vendors yet ──────────────────────────────────────── */}
      {status === 'success' && vendors.length === 0 && (
        <div className="text-center py-28 px-6">
          <div className="w-14 h-14 border border-border bg-warm-gray flex items-center justify-center mx-auto mb-7 rounded-sm">
            <Store size={20} className="text-muted/40" strokeWidth={1.25} />
          </div>
          <h3 className="font-serif text-[1.6rem] font-light text-charcoal-light mb-3">
            No vendors yet
          </h3>
          <p className="text-muted font-light text-[0.875rem] mb-9 max-w-xs mx-auto leading-relaxed">
            Build your vendor directory by adding caterers, bar services, entertainers, and more.
          </p>
          <button
            onClick={openAdd}
            className={cn(
              'text-[0.72rem] font-medium tracking-[0.08em] uppercase',
              'bg-charcoal text-gold-light px-6 py-3 rounded-sm',
              'hover:bg-charcoal/90 transition-colors duration-150'
            )}
          >
            Add Your First Vendor
          </button>
        </div>
      )}

      {/* ── Empty — filters return nothing ─────────────────────────────── */}
      {status === 'success' && vendors.length > 0 && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="font-serif text-[1.3rem] font-light text-charcoal-light mb-2">
            No vendors match your filters
          </p>
          <p className="text-muted font-light text-[0.875rem] mb-6">
            Try adjusting your search or filters.
          </p>
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="text-[0.72rem] font-medium tracking-[0.08em] uppercase text-muted hover:text-charcoal underline underline-offset-2 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ── Vendor groups ───────────────────────────────────────────────── */}
      {status === 'success' && filtered.length > 0 && (
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([category, categoryVendors]) => (
            <div key={category}>
              {/* Group header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[0.6rem] font-medium tracking-[0.18em] uppercase text-muted/50">
                  {VENDOR_CATEGORY_LABELS[category]}
                </span>
                <span className="text-[0.6rem] text-muted/35 font-light tabular-nums">
                  {categoryVendors.length}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoryVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    onClick={() => openEdit(vendor)}
                    onToggleFavorite={() => void toggle(vendor.id, 'favorite')}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ──────────────────────────────────────────────────────── */}
      <VendorModal
        open={modalOpen}
        vendor={addMode ? null : selectedVendor}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={addMode ? undefined : handleDelete}
      />

    </div>
  )
}
