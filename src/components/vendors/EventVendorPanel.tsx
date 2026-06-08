/**
 * src/components/vendors/EventVendorPanel.tsx
 *
 * Shows vendor recommendations for an event plan.
 * Used in both EventPlanResult (after generation) and EventDetailModal (saved events).
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Store } from 'lucide-react'
import { useVendors } from '@/hooks/useVendors'
import { getVendorRecommendations, getSuggestedCategories } from '@/lib/vendorRecommendations'
import type { CategoryRecommendation, VendorMatch } from '@/lib/vendorRecommendations'
import type { EventFormData } from '@/types'
import { cn } from '@/lib/utils'

interface EventVendorPanelProps {
  formData: EventFormData
  compact?: boolean   // true = modal view (tighter spacing)
}

const MAX_VISIBLE = 2  // vendors shown per category before "show more"

export function EventVendorPanel({ formData, compact = false }: EventVendorPanelProps) {
  const { vendors, status } = useVendors()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const recommendations = useMemo(
    () => getVendorRecommendations(formData, vendors),
    [formData, vendors]
  )

  const suggestedCategories = useMemo(
    () => getSuggestedCategories(formData.eventType),
    [formData.eventType]
  )

  // Don't render while loading or if no vendors in hub at all
  if (status === 'loading') return null
  if (status === 'success' && vendors.length === 0) return null

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      next.has(category) ? next.delete(category) : next.add(category)
      return next
    })
  }

  const hasAnyMatches = recommendations.length > 0

  return (
    <div className={cn('border-t border-border', compact ? 'mt-4 pt-4' : 'mt-6 pt-6')}>

      {/* Section header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between mb-1 group"
      >
        <div className="flex items-center gap-2">
          <Store size={12} className="text-gold/70" />
          <span className="text-[0.62rem] font-medium tracking-[0.16em] uppercase text-charcoal-light">
            Vendor Matches
          </span>
          {hasAnyMatches && (
            <span className="text-[0.58rem] text-muted/50 font-light tabular-nums">
              {recommendations.reduce((sum, r) => sum + r.vendors.length, 0)} vendors
            </span>
          )}
        </div>
        <span className="text-muted/40 group-hover:text-muted transition-colors">
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </span>
      </button>

      {!expanded && (
        <p className="text-[0.72rem] text-muted/50 font-light">
          {hasAnyMatches
            ? `${recommendations.length} categor${recommendations.length === 1 ? 'y' : 'ies'} matched from your vendor directory`
            : 'No vendors in your directory match this event type yet'}
        </p>
      )}

      {expanded && (
        <div className={cn('space-y-5', compact ? 'mt-4' : 'mt-5')}>

          {/* Matched categories */}
          {recommendations.map((rec) => (
            <CategoryBlock
              key={rec.category}
              rec={rec}
              isExpanded={expandedCategories.has(rec.category)}
              onToggleExpand={() => toggleCategory(rec.category)}
              compact={compact}
            />
          ))}

          {/* Suggested categories with no vendors */}
          {suggestedCategories.length > 0 && (
            <div>
              <p className="text-[0.6rem] font-medium tracking-[0.14em] uppercase text-muted/40 mb-2">
                You may also need
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedCategories
                  .filter((label) => !recommendations.find((r) => r.label === label))
                  .map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => navigate('/vendors')}
                      className={cn(
                        'text-[0.62rem] font-medium tracking-[0.06em] uppercase',
                        'px-2.5 py-1 rounded-sm border border-dashed border-border',
                        'text-muted/60 hover:border-gold/30 hover:text-gold transition-colors duration-150'
                      )}
                    >
                      + {label}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* CTA to vendor hub */}
          <div className="pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={() => navigate('/vendors')}
              className="text-[0.68rem] text-muted/60 hover:text-charcoal transition-colors duration-150 font-light"
            >
              Manage your vendor directory →
            </button>
          </div>

        </div>
      )}
    </div>
  )
}

// ─── Category block ───────────────────────────────────────────────────────────

function CategoryBlock({
  rec,
  isExpanded,
  onToggleExpand,
  compact,
}: {
  rec:            CategoryRecommendation
  isExpanded:     boolean
  onToggleExpand: () => void
  compact:        boolean
}) {
  const visible  = isExpanded ? rec.vendors : rec.vendors.slice(0, MAX_VISIBLE)
  const hasMore  = rec.vendors.length > MAX_VISIBLE

  return (
    <div>
      {/* Category label */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[0.6rem] font-medium tracking-[0.14em] uppercase text-muted/50">
          {rec.label}
        </span>
        <span className="text-[0.58rem] text-muted/35 tabular-nums">
          {rec.vendors.length}
        </span>
      </div>

      {/* Vendor rows */}
      <div className="space-y-1.5">
        {visible.map(({ vendor, reason }) => (
          <div
            key={vendor.id}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-sm border border-border bg-white',
              'hover:border-charcoal/15 transition-colors duration-150'
            )}
          >
            {/* Favorite indicator */}
            {vendor.favorite && (
              <Star size={10} className="text-gold shrink-0" fill="currentColor" />
            )}

            {/* Name + reason */}
            <div className="flex-1 min-w-0">
              <p className="text-[0.82rem] font-light text-charcoal truncate">
                {vendor.name}
              </p>
              <p className="text-[0.65rem] text-muted/60 font-light">
                {reason}
              </p>
            </div>

            {/* COI badge */}
            <CoiIndicator status={vendor.coiStatus} />

            {/* Price tier */}
            <span className="text-[0.58rem] font-medium uppercase tracking-wide text-muted/50 shrink-0">
              {vendor.priceTier === 'budget' ? 'Budget' :
               vendor.priceTier === 'mid' ? 'Mid' :
               vendor.priceTier === 'premium' ? 'Premium' : 'Luxury'}
            </span>
          </div>
        ))}
      </div>

      {/* Show more / less */}
      {hasMore && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="mt-1.5 text-[0.65rem] text-muted/50 hover:text-charcoal transition-colors font-light"
        >
          {isExpanded
            ? 'Show less'
            : `+${rec.vendors.length - MAX_VISIBLE} more`}
        </button>
      )}
    </div>
  )
}

// ─── COI indicator ────────────────────────────────────────────────────────────

function CoiIndicator({ status }: { status: string }) {
  if (status === 'on_file') {
    return <CheckCircle2 size={11} className="text-green-500 shrink-0" />
  }
  if (status === 'expired') {
    return <AlertTriangle size={11} className="text-red-400 shrink-0" />
  }
  return null
}
