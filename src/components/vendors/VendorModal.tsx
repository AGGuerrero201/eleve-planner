/**
 * src/components/vendors/VendorModal.tsx
 * Add / edit vendor modal. One modal for both modes.
 */

import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { Vendor, VendorCategory, VendorPriceTier, CoiStatus } from '@/types/vendor'
import {
  VENDOR_CATEGORY_LABELS, ALL_VENDOR_CATEGORIES,
  COI_STATUS_LABELS, ALL_PRICE_TIERS, VENDOR_PRICE_TIER_LABELS,
} from '@/types/vendor'
import { cn } from '@/lib/utils'

interface VendorModalProps {
  vendor?:   Vendor | null      // null = add mode, defined = edit mode
  open:      boolean
  onClose:   () => void
  onSave:    (data: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onDelete?: () => void
}

const EMPTY: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'> = {
  name:           '',
  category:       'other',
  serviceArea:    '',
  priceTier:      'mid',
  notes:          '',
  coiStatus:      'unknown',
  tags:           [],
  contact:        {},
  previouslyUsed: false,
  favorite:       false,
}

export function VendorModal({ vendor, open, onClose, onSave, onDelete }: VendorModalProps) {
  const isEdit = !!vendor
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setForm(vendor
        ? { name: vendor.name, category: vendor.category, serviceArea: vendor.serviceArea,
            priceTier: vendor.priceTier, notes: vendor.notes, coiStatus: vendor.coiStatus,
            tags: [...vendor.tags], contact: { ...vendor.contact },
            previouslyUsed: vendor.previouslyUsed, favorite: vendor.favorite }
        : EMPTY
      )
      setError(null)
      setTagInput('')
    }
  }, [open, vendor])

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }))

  const setContact = (key: keyof Vendor['contact'], val: string) =>
    setForm((prev) => ({ ...prev, contact: { ...prev.contact, [key]: val || undefined } }))

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (tag && !form.tags.includes(tag)) {
      set('tags', [...form.tags, tag])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) =>
    set('tags', form.tags.filter((t) => t !== tag))

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Vendor name is required'); return }
    setSaving(true)
    setError(null)
    await onSave(form)
    setSaving(false)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-charcoal/65 backdrop-blur-[3px]" onClick={onClose} />

      <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-fade-up">

        {/* Header */}
        <div className="flex items-center justify-between bg-charcoal px-6 py-5 rounded-t-sm shrink-0">
          <h2 className="font-serif text-[1.05rem] font-light text-gold-light">
            {isEdit ? 'Edit Vendor' : 'Add Vendor'}
          </h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors p-1">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable form */}
        <div className="overflow-y-auto p-6 space-y-5">

          {error && (
            <p className="text-[0.78rem] text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-sm">
              {error}
            </p>
          )}

          {/* Name */}
          <Field label="Vendor Name" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Blue Ribbon Catering"
              className={inputCls}
            />
          </Field>

          {/* Category + Price Tier */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" required>
              <select value={form.category} onChange={(e) => set('category', e.target.value as VendorCategory)} className={inputCls}>
                {ALL_VENDOR_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{VENDOR_CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </Field>
            <Field label="Price Tier">
              <select value={form.priceTier} onChange={(e) => set('priceTier', e.target.value as VendorPriceTier)} className={inputCls}>
                {ALL_PRICE_TIERS.map((t) => (
                  <option key={t} value={t}>{VENDOR_PRICE_TIER_LABELS[t]}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Service area + COI */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Service Area">
              <input
                type="text"
                value={form.serviceArea}
                onChange={(e) => set('serviceArea', e.target.value)}
                placeholder="e.g. NYC Metro"
                className={inputCls}
              />
            </Field>
            <Field label="COI Status">
              <select value={form.coiStatus} onChange={(e) => set('coiStatus', e.target.value as CoiStatus)} className={inputCls}>
                {(Object.keys(COI_STATUS_LABELS) as CoiStatus[]).map((s) => (
                  <option key={s} value={s}>{COI_STATUS_LABELS[s]}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[0.65rem] font-medium tracking-[0.12em] uppercase text-charcoal-light mb-2.5">
              Contact
            </p>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Contact name" value={form.contact.name ?? ''} onChange={(e) => setContact('name', e.target.value)} className={inputCls} />
              <input type="text" placeholder="Phone" value={form.contact.phone ?? ''} onChange={(e) => setContact('phone', e.target.value)} className={inputCls} />
              <input type="email" placeholder="Email" value={form.contact.email ?? ''} onChange={(e) => setContact('email', e.target.value)} className={inputCls} />
              <input type="url" placeholder="Website" value={form.contact.website ?? ''} onChange={(e) => setContact('website', e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Tags */}
          <Field label="Tags">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="e.g. outdoor-capable"
                className={cn(inputCls, 'flex-1')}
              />
              <button type="button" onClick={addTag} className="px-3 border border-border rounded-sm hover:border-charcoal/20 text-muted hover:text-charcoal transition-colors">
                <Plus size={13} />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-[0.65rem] px-2 py-0.5 bg-warm-gray border border-border text-charcoal-light rounded-sm">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors ml-0.5">
                      <X size={9} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          {/* Notes */}
          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={3}
              placeholder="Operational notes, preferences, past performance…"
              className={cn(inputCls, 'resize-none')}
            />
          </Field>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-1">
            <Toggle
              label="Previously Used"
              checked={form.previouslyUsed}
              onChange={(v) => set('previouslyUsed', v)}
            />
            <Toggle
              label="Favorite"
              checked={form.favorite}
              onChange={(v) => set('favorite', v)}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
          {isEdit && onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="text-[0.72rem] text-red-500 hover:text-red-700 transition-colors font-medium"
            >
              Delete vendor
            </button>
          ) : <span />}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-[0.72rem] text-muted hover:text-charcoal transition-colors font-medium px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className={cn(
                'text-[0.72rem] font-medium tracking-[0.08em] uppercase px-5 py-2 rounded-sm',
                'bg-charcoal text-gold-light transition-all duration-150',
                'hover:bg-charcoal/90 disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Vendor'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls = cn(
  'w-full px-3 py-2 text-[0.82rem] font-light border border-border rounded-sm bg-white',
  'text-charcoal placeholder:text-muted/40',
  'focus:outline-none focus:border-gold/50 transition-colors duration-150'
)

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[0.65rem] font-medium tracking-[0.12em] uppercase text-charcoal-light mb-1.5">
        {label}{required && <span className="text-gold ml-0.5">*</span>}
      </p>
      {children}
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          'w-8 h-4 rounded-full transition-colors duration-200 relative',
          checked ? 'bg-gold' : 'bg-border'
        )}
      >
        <div className={cn(
          'absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200',
          checked ? 'translate-x-4' : 'translate-x-0.5'
        )} />
      </div>
      <span className="text-[0.75rem] font-light text-charcoal-light">{label}</span>
    </label>
  )
}
