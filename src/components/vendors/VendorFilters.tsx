import { Search, Star } from 'lucide-react'
import type { VendorCategory, VendorPriceTier } from '@/types/vendor'
import { VENDOR_CATEGORY_LABELS, ALL_VENDOR_CATEGORIES } from '@/types/vendor'
import { cn } from '@/lib/utils'

export interface VendorFilterState {
  search:        string
  category:      VendorCategory | 'all'
  priceTier:     VendorPriceTier | 'all'
  favoritesOnly: boolean
  usedOnly:      boolean
}

export const DEFAULT_FILTERS: VendorFilterState = {
  search:        '',
  category:      'all',
  priceTier:     'all',
  favoritesOnly: false,
  usedOnly:      false,
}

interface VendorFiltersProps {
  filters:    VendorFilterState
  onChange:   (f: VendorFilterState) => void
  totalCount: number
}

export function VendorFilters({ filters, onChange }: VendorFiltersProps) {
  const set = <K extends keyof VendorFilterState>(key: K, value: VendorFilterState[K]) =>
    onChange({ ...filters, [key]: value })

  return (
    <div className="flex flex-col gap-2 mb-7">

      {/* Row 1: Search — always full width */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/50" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          placeholder="Search vendors…"
          className={cn(
            'w-full pl-8 pr-4 py-2.5 text-[0.82rem] font-light',
            'border border-border rounded-sm bg-white',
            'placeholder:text-muted/40 text-charcoal',
            'focus:outline-none focus:border-gold/50 transition-colors duration-150'
          )}
        />
      </div>

      {/* Row 2: Controls — scroll horizontally on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-thin -mx-5 px-5 sm:mx-0 sm:px-0">

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => set('category', e.target.value as VendorCategory | 'all')}
          className={cn(
            'shrink-0 px-3 py-2.5 text-[0.78rem] font-light border border-border rounded-sm bg-white',
            'text-charcoal focus:outline-none focus:border-gold/50 transition-colors duration-150',
            'w-40 sm:w-44'
          )}
        >
          <option value="all">All Categories</option>
          {ALL_VENDOR_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{VENDOR_CATEGORY_LABELS[cat]}</option>
          ))}
        </select>

        {/* Price tier */}
        <select
          value={filters.priceTier}
          onChange={(e) => set('priceTier', e.target.value as VendorPriceTier | 'all')}
          className={cn(
            'shrink-0 px-3 py-2.5 text-[0.78rem] font-light border border-border rounded-sm bg-white',
            'text-charcoal focus:outline-none focus:border-gold/50 transition-colors duration-150',
            'w-32 sm:w-36'
          )}
        >
          <option value="all">All Prices</option>
          <option value="budget">Budget</option>
          <option value="mid">Mid-Range</option>
          <option value="premium">Premium</option>
          <option value="luxury">Luxury</option>
        </select>

        {/* Favorites toggle */}
        <button
          type="button"
          onClick={() => set('favoritesOnly', !filters.favoritesOnly)}
          className={cn(
            'shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-sm border',
            'text-[0.72rem] font-medium transition-all duration-150 whitespace-nowrap',
            filters.favoritesOnly
              ? 'border-gold/40 bg-gold/8 text-gold'
              : 'border-border bg-white text-muted hover:border-charcoal/20 hover:text-charcoal'
          )}
        >
          <Star size={11} fill={filters.favoritesOnly ? 'currentColor' : 'none'} />
          Favorites
        </button>

      </div>
    </div>
  )
}

// ─── Filter logic ─────────────────────────────────────────────────────────────

import type { Vendor } from '@/types/vendor'

export function applyFilters(vendors: Vendor[], filters: VendorFilterState): Vendor[] {
  return vendors.filter((v) => {
    if (filters.favoritesOnly && !v.favorite) return false
    if (filters.usedOnly && !v.previouslyUsed) return false
    if (filters.category !== 'all' && v.category !== filters.category) return false
    if (filters.priceTier !== 'all' && v.priceTier !== filters.priceTier) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const matches =
        v.name.toLowerCase().includes(q) ||
        v.serviceArea.toLowerCase().includes(q) ||
        v.notes.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q)) ||
        (v.contact.name ?? '').toLowerCase().includes(q)
      if (!matches) return false
    }
    return true
  })
}
