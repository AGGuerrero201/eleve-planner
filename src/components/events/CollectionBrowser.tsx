/**
 * src/components/events/CollectionBrowser.tsx
 *
 * Curated template discovery — editorial, collection-first browsing.
 *
 * Three-layer flow:
 *   1. Browse view  — featured seasonal card + all collection groups
 *   2. Detail view  — templates within a chosen collection
 *   3. Selection    — fires onSelect callback to parent
 */

import { useState, useMemo } from 'react'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import type { LuxuryTemplate } from '@/lib/templates'
import type { ResolvedCollection } from '@/types/collections'
import { CATEGORY_LABELS } from '@/types/templates'
import {
  getFeaturedCollection,
  getCollectionsByTier,
  getSeasonalCollections,
} from '@/lib/collections'
import { cn } from '@/lib/utils'

interface CollectionBrowserProps {
  onSelect:  (template: LuxuryTemplate) => void
  onBack:    () => void
  disabled?: boolean
}

export function CollectionBrowser({
  onSelect,
  onBack,
  disabled = false,
}: CollectionBrowserProps) {
  const [activeCollection, setActiveCollection] = useState<ResolvedCollection | null>(null)

  const featured      = useMemo(() => getFeaturedCollection(), [])
  const allSeasonal   = useMemo(() => getSeasonalCollections(), [])
  const hospitality   = useMemo(() => getCollectionsByTier('hospitality'), [])
  const operational   = useMemo(() => getCollectionsByTier('operational'), [])

  // Other seasonal collections (not the featured one)
  const otherSeasonal = useMemo(
    () => allSeasonal.filter((c) => c.id !== featured.id),
    [allSeasonal, featured]
  )

  if (activeCollection) {
    return (
      <CollectionDetail
        collection={activeCollection}
        onBack={() => setActiveCollection(null)}
        onSelect={onSelect}
        disabled={disabled}
      />
    )
  }

  return (
    <div className="animate-fade-up">

      {/* Back to entry */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[0.7rem] text-muted hover:text-charcoal transition-colors duration-150 mb-7"
      >
        <ArrowLeft size={12} />
        Back
      </button>

      {/* ── Featured seasonal collection ─────────────────────────────── */}
      <div className="mb-8">
        <SectionLabel>Featured This Season</SectionLabel>
        <FeaturedCard
          collection={featured}
          onClick={() => setActiveCollection(featured)}
          disabled={disabled}
        />
      </div>

      {/* ── Other seasonal collections ───────────────────────────────── */}
      {otherSeasonal.length > 0 && (
        <div className="mb-8">
          <SectionLabel>Seasonal Programming</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {otherSeasonal.map((c) => (
              <CollectionCard
                key={c.id}
                collection={c}
                onClick={() => setActiveCollection(c)}
                disabled={disabled}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Hospitality collections ──────────────────────────────────── */}
      <div className="mb-8">
        <SectionLabel>Hospitality Collections</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {hospitality.map((c) => (
            <CollectionCard
              key={c.id}
              collection={c}
              onClick={() => setActiveCollection(c)}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      {/* ── Operational collections ──────────────────────────────────── */}
      <div>
        <SectionLabel>By Operational Need</SectionLabel>
        <div className="flex flex-col gap-2">
          {operational.map((c) => (
            <OperationalRow
              key={c.id}
              collection={c}
              onClick={() => setActiveCollection(c)}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── Featured seasonal card ───────────────────────────────────────────────────

function FeaturedCard({
  collection,
  onClick,
  disabled,
}: {
  collection: ResolvedCollection
  onClick:    () => void
  disabled:   boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full text-left rounded-sm overflow-hidden border border-gold/30',
        'transition-all duration-200 hover:border-gold/60 hover:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
        'disabled:opacity-40 disabled:cursor-not-allowed',
      )}
    >
      {/* Dark header */}
      <div className="bg-charcoal px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-gold text-[1.1rem] leading-none shrink-0" aria-hidden>
            {collection.glyph}
          </span>
          <div>
            <p className="text-[0.58rem] font-medium tracking-[0.18em] uppercase text-gold/60 mb-1">
              Featured this season
            </p>
            <p className="font-serif text-[1.15rem] font-light text-gold-light leading-tight">
              {collection.label}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[0.68rem] text-white/30 font-light">
            {collection.templates.length} experiences
          </span>
          <ChevronRight size={14} className="text-gold/40" />
        </div>
      </div>

      {/* Body */}
      <div className="bg-white px-6 py-4">
        <p className="text-[0.8rem] text-muted font-light leading-relaxed mb-3">
          {collection.description}
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {collection.tags.map((tag) => (
            <span
              key={tag}
              className="text-[0.6rem] font-medium tracking-[0.08em] uppercase px-2 py-0.5 border border-gold/20 bg-gold/5 text-gold/80 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

// ─── Standard collection card ─────────────────────────────────────────────────

function CollectionCard({
  collection,
  onClick,
  disabled,
  compact = false,
}: {
  collection: ResolvedCollection
  onClick:    () => void
  disabled:   boolean
  compact?:   boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full text-left rounded-sm border border-border bg-white',
        'transition-all duration-200 hover:border-charcoal/25 hover:bg-warm-gray/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        compact ? 'px-4 py-4' : 'px-5 py-5'
      )}
    >
      {/* Glyph + label */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="text-muted/35 text-[0.85rem] leading-none shrink-0" aria-hidden>
            {collection.glyph}
          </span>
          <span className={cn(
            'font-serif font-light text-charcoal leading-snug',
            compact ? 'text-[0.88rem]' : 'text-[0.95rem]'
          )}>
            {collection.label}
          </span>
        </div>
        <ChevronRight size={11} className="text-muted/25 shrink-0 mt-0.5" />
      </div>

      {/* Description — full cards only */}
      {!compact && (
        <p className="text-[0.72rem] text-muted font-light leading-relaxed mb-3">
          {collection.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {collection.tags.slice(0, compact ? 1 : 2).map((tag) => (
            <span
              key={tag}
              className="text-[0.58rem] font-medium tracking-[0.08em] uppercase px-1.5 py-px border border-border bg-warm-gray text-muted/70 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-[0.62rem] text-muted/45 font-light shrink-0 ml-2 tabular-nums">
          {collection.templates.length} {collection.templates.length === 1 ? 'experience' : 'experiences'}
        </span>
      </div>
    </button>
  )
}

// ─── Operational row (horizontal list format) ─────────────────────────────────

function OperationalRow({
  collection,
  onClick,
  disabled,
}: {
  collection: ResolvedCollection
  onClick:    () => void
  disabled:   boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full text-left rounded-sm border border-border bg-white px-5 py-3.5',
        'transition-all duration-200 hover:border-charcoal/20 hover:bg-warm-gray/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'flex items-center gap-4'
      )}
    >
      <span className="text-muted/30 text-[0.8rem] shrink-0" aria-hidden>
        {collection.glyph}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-[0.85rem] font-light text-charcoal leading-snug mb-0.5">
          {collection.label}
        </p>
        <p className="text-[0.7rem] text-muted font-light leading-snug truncate">
          {collection.description}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[0.62rem] text-muted/45 font-light tabular-nums">
          {collection.templates.length}
        </span>
        <ChevronRight size={12} className="text-muted/25" />
      </div>
    </button>
  )
}

// ─── Collection detail view ───────────────────────────────────────────────────

function CollectionDetail({
  collection,
  onBack,
  onSelect,
  disabled,
}: {
  collection: ResolvedCollection
  onBack:     () => void
  onSelect:   (t: LuxuryTemplate) => void
  disabled:   boolean
}) {
  return (
    <div className="animate-fade-up">

      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-[0.7rem] text-muted hover:text-charcoal transition-colors duration-150 mb-6"
      >
        <ArrowLeft size={12} />
        All collections
      </button>

      {/* Collection header */}
      <div className="mb-6 pb-5 border-b border-border">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-muted/35 text-[0.9rem]" aria-hidden>
            {collection.glyph}
          </span>
          <h3 className="font-serif text-[1.3rem] font-light text-charcoal leading-tight">
            {collection.label}
          </h3>
          <span className="text-[0.62rem] text-muted/50 font-light ml-auto tabular-nums">
            {collection.templates.length} {collection.templates.length === 1 ? 'experience' : 'experiences'}
          </span>
        </div>
        <p className="text-[0.8rem] text-muted font-light leading-relaxed">
          {collection.description}
        </p>
      </div>

      {/* Template list */}
      <div className="flex flex-col gap-2.5">
        {collection.templates.map((template) => (
          <TemplateRow
            key={template.id}
            template={template}
            onSelect={() => onSelect(template)}
            disabled={disabled}
          />
        ))}
      </div>

    </div>
  )
}

// ─── Template row ─────────────────────────────────────────────────────────────

function TemplateRow({
  template,
  onSelect,
  disabled,
}: {
  template: LuxuryTemplate
  onSelect: () => void
  disabled: boolean
}) {
  const isInstant = template.plan !== undefined

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'w-full text-left rounded-sm border border-border bg-white px-5 py-4',
        'transition-all duration-200 group',
        'hover:border-gold/35 hover:bg-gold/[0.015]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
        'disabled:opacity-40 disabled:cursor-not-allowed'
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">

          {/* Category + instant badge */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[0.58rem] font-medium tracking-[0.14em] uppercase text-gold/75">
              {CATEGORY_LABELS[template.category]}
            </span>
            {isInstant && (
              <span className="text-[0.55rem] font-semibold tracking-[0.08em] uppercase text-green-600 bg-green-50 border border-green-200 px-1.5 py-px rounded-sm">
                Instant
              </span>
            )}
          </div>

          {/* Template name */}
          <p className="font-serif text-[1rem] font-light text-charcoal leading-snug mb-1">
            {template.label}
          </p>

          {/* Description */}
          <p className="text-[0.75rem] text-muted font-light leading-relaxed">
            {template.description}
          </p>

        </div>

        {/* Right: tags + arrow */}
        <div className="flex flex-col items-end gap-2 shrink-0 mt-0.5">
          <ChevronRight
            size={13}
            className="text-muted/25 group-hover:text-gold/50 transition-colors duration-150"
          />
          <div className="flex flex-col items-end gap-1">
            {template.previewTags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[0.58rem] font-medium tracking-[0.06em] uppercase px-1.5 py-px border border-border bg-warm-gray text-muted/70 rounded-sm whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </button>
  )
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.58rem] font-medium tracking-[0.2em] uppercase text-muted/45 mb-3">
      {children}
    </p>
  )
}
