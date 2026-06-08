/**
 * src/components/vendors/VendorCard.tsx
 */

import { Star, AlertTriangle, CheckCircle2, HelpCircle, Shield } from 'lucide-react'
import type { Vendor, CoiStatus } from '@/types/vendor'
import { VENDOR_CATEGORY_LABELS, VENDOR_PRICE_TIER_LABELS } from '@/types/vendor'
import { cn } from '@/lib/utils'

interface VendorCardProps {
  vendor:   Vendor
  onClick:  () => void
  onToggleFavorite: () => void
}

export function VendorCard({ vendor, onClick, onToggleFavorite }: VendorCardProps) {
  return (
    <article
      className={cn(
        'relative bg-white border border-border rounded-sm p-5 cursor-pointer',
        'transition-all duration-200 hover:border-charcoal/20 hover:shadow-sm group',
      )}
      onClick={onClick}
    >
      {/* Favorite star */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite() }}
        className={cn(
          'absolute top-4 right-4 p-1 rounded-sm transition-colors duration-150',
          vendor.favorite
            ? 'text-gold'
            : 'text-border group-hover:text-muted/50 hover:!text-gold'
        )}
        aria-label={vendor.favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star size={13} fill={vendor.favorite ? 'currentColor' : 'none'} />
      </button>

      {/* Category label */}
      <p className="text-[0.58rem] font-medium tracking-[0.16em] uppercase text-gold/80 mb-2">
        {VENDOR_CATEGORY_LABELS[vendor.category]}
      </p>

      {/* Name */}
      <h3 className="font-serif text-[1rem] font-light text-charcoal leading-snug mb-1 pr-6">
        {vendor.name}
      </h3>

      {/* Service area */}
      {vendor.serviceArea && (
        <p className="text-[0.72rem] text-muted font-light mb-3">
          {vendor.serviceArea}
        </p>
      )}

      {/* Price tier + COI */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[0.62rem] font-medium tracking-[0.06em] uppercase px-2 py-0.5 border border-border bg-warm-gray text-charcoal-light rounded-sm">
          {VENDOR_PRICE_TIER_LABELS[vendor.priceTier]}
        </span>
        <CoiBadge status={vendor.coiStatus} />
        {vendor.previouslyUsed && (
          <span className="text-[0.6rem] font-medium tracking-[0.06em] uppercase px-2 py-0.5 border border-gold/20 bg-gold/5 text-gold/80 rounded-sm">
            Used Before
          </span>
        )}
      </div>

      {/* Tags */}
      {vendor.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {vendor.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[0.58rem] text-muted/70 px-1.5 py-px border border-border/60 rounded-sm bg-warm-gray/50"
            >
              {tag}
            </span>
          ))}
          {vendor.tags.length > 3 && (
            <span className="text-[0.58rem] text-muted/50">
              +{vendor.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </article>
  )
}

// ─── COI Badge ────────────────────────────────────────────────────────────────

function CoiBadge({ status }: { status: CoiStatus }) {
  const config: Record<CoiStatus, { icon: React.ReactNode; label: string; className: string }> = {
    on_file:      { icon: <CheckCircle2 size={9} />, label: 'COI ✓',       className: 'border-green-200 bg-green-50 text-green-700' },
    requested:    { icon: <Shield size={9} />,       label: 'COI Pending', className: 'border-blue-200 bg-blue-50 text-blue-600' },
    expired:      { icon: <AlertTriangle size={9} />, label: 'COI Expired', className: 'border-red-200 bg-red-50 text-red-600' },
    not_required: { icon: <Shield size={9} />,       label: 'No COI',      className: 'border-border bg-warm-gray text-muted' },
    unknown:      { icon: <HelpCircle size={9} />,   label: 'COI ?',       className: 'border-border bg-warm-gray text-muted/60' },
  }

  const { icon, label, className } = config[status]

  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-[0.6rem] font-medium px-2 py-0.5 border rounded-sm',
      className
    )}>
      {icon}
      {label}
    </span>
  )
}

export { CoiBadge }
