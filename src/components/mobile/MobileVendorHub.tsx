import { useMemo, useState } from 'react'
import { Plus, Search, RefreshCw, AlertCircle, Store, Phone, Mail } from 'lucide-react'
import type { Vendor, VendorCategory } from '@/types/vendor'
import { VENDOR_CATEGORY_LABELS, ALL_VENDOR_CATEGORIES, VENDOR_PRICE_TIER_LABELS } from '@/types/vendor'
import { CoiBadge } from '@/components/vendors/VendorCard'

interface MobileVendorHubProps {
  vendors: Vendor[]
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  fetch: () => Promise<void>
  openAdd: () => void
  openEdit: (vendor: Vendor) => void
}

/**
 * Phone-only Vendor Hub. Reuses the exact vendors/status/error/fetch/
 * openAdd/openEdit already computed in VendorHubPage — no new data layer.
 */
export function MobileVendorHub({ vendors, status, error, fetch, openAdd, openEdit }: MobileVendorHubProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return vendors
    return vendors.filter((v) => v.name.toLowerCase().includes(q) || v.serviceArea.toLowerCase().includes(q))
  }, [vendors, search])

  const grouped = useMemo(() => {
    const map = new Map<VendorCategory, Vendor[]>()
    for (const cat of ALL_VENDOR_CATEGORIES) {
      const inCat = filtered.filter((v) => v.category === cat)
      if (inCat.length > 0) map.set(cat, inCat)
    }
    return map
  }, [filtered])

  const isLoading = status === 'loading'

  return (
    <div className="px-5 pt-6 pb-24">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h1 className="font-serif text-[1.7rem] font-light text-charcoal leading-tight">Vendors</h1>
        <button onClick={() => void fetch()} disabled={isLoading} className="p-2 text-muted/70 disabled:opacity-40" aria-label="Refresh">
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>
      {status === 'success' && (
        <p className="text-muted font-light text-[0.8rem] mb-4">
          {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} in your directory
        </p>
      )}

      <div className="flex items-center gap-2 rounded-sm px-3 py-2.5 mb-5" style={{ backgroundColor: 'var(--warm-gray, #F5F3EF)', border: '1px solid #E2DDD5' }}>
        <Search size={15} strokeWidth={1.5} className="text-muted shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vendors"
          className="flex-1 bg-transparent text-[0.85rem] font-light text-charcoal placeholder:text-muted outline-none"
        />
      </div>

      {isLoading && (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-sm animate-pulse" style={{ backgroundColor: 'var(--warm-gray)', border: 'var(--card-border)' }} />
          ))}
        </div>
      )}

      {status === 'error' && error && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <AlertCircle size={20} className="text-red-400" />
          <p className="text-[0.82rem] text-charcoal-light font-light">{error}</p>
          <button onClick={() => void fetch()} className="text-[0.75rem] font-medium underline underline-offset-2">Try again</button>
        </div>
      )}

      {status === 'success' && vendors.length === 0 && (
        <div className="text-center py-16 px-4">
          <Store size={20} strokeWidth={1.25} style={{ color: 'var(--gold, #B8955A)', opacity: 0.5 }} className="mx-auto mb-4" />
          <p className="text-muted font-light text-[0.85rem] mb-5">No vendors yet. Add your preferred partners to build your directory.</p>
          <button onClick={openAdd} className="text-[0.68rem] font-medium tracking-[0.1em] uppercase bg-charcoal text-gold-light px-5 py-3 rounded-sm">
            Add Your First Vendor
          </button>
        </div>
      )}

      {status === 'success' && filtered.length > 0 && (
        <div className="space-y-7">
          {Array.from(grouped.entries()).map(([category, list]) => (
            <div key={category}>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="label-caps shrink-0">{VENDOR_CATEGORY_LABELS[category]}</span>
                <span className="text-[0.6rem] font-light tabular-nums" style={{ color: 'var(--stone-light, #B8B0A8)' }}>{list.length}</span>
                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(180,166,150,0.25)' }} />
              </div>
              <div className="space-y-2">
                {list.map((vendor) => (
                  <div
                    key={vendor.id}
                    onClick={() => openEdit(vendor)}
                    className="rounded-sm px-4 py-3.5"
                    style={{ backgroundColor: 'var(--card-bg, #FAFAF8)', border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))' }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="font-serif text-[1rem] font-light text-charcoal truncate">{vendor.name}</p>
                        {vendor.serviceArea && <p className="text-[0.72rem] text-muted font-light mt-0.5">{vendor.serviceArea}</p>}
                      </div>
                      <span className="text-[0.62rem] font-medium tracking-[0.06em] uppercase px-2 py-0.5 border border-border bg-warm-gray text-charcoal-light rounded-sm shrink-0">
                        {VENDOR_PRICE_TIER_LABELS[vendor.priceTier]}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <CoiBadge status={vendor.coiStatus} />
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {vendor.contact.phone && (
                          <a href={`tel:${vendor.contact.phone}`} className="w-9 h-9 flex items-center justify-center rounded-sm" style={{ border: '1px solid rgba(180,166,150,0.4)' }} aria-label="Call vendor">
                            <Phone size={14} strokeWidth={1.5} className="text-charcoal-light" />
                          </a>
                        )}
                        {vendor.contact.email && (
                          <a href={`mailto:${vendor.contact.email}`} className="w-9 h-9 flex items-center justify-center rounded-sm" style={{ border: '1px solid rgba(180,166,150,0.4)' }} aria-label="Email vendor">
                            <Mail size={14} strokeWidth={1.5} className="text-charcoal-light" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={openAdd}
        className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-sm bg-charcoal flex items-center justify-center"
        style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.25)' }}
        aria-label="Add vendor"
      >
        <Plus size={22} strokeWidth={1.75} className="text-gold-light" />
      </button>
    </div>
  )
}
