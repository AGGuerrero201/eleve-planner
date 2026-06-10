/**
 * pages/PropertySettingsPage.tsx
 *
 * Property profile setup and edit page.
 * Simple single-form layout — not overbuilt.
 * First-visit shows a welcome header; subsequent visits show the edit form.
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { useProperty } from '@/context/PropertyContext'
import { AmenityPicker } from '@/components/property/AmenityPicker'
import { PersonalitySelector } from '@/components/property/PersonalitySelector'
import { ProfileCompletenessBar } from '@/components/property/ProfileCompletenessBar'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { getUserKey } from '@/services/propertyService'
import type { PropertyProfile, PropertyType, LuxuryLevel, TypicalAttendance, PreferredBudget, CommunityPersonality, Amenity } from '@/types/property'
import {
  PROPERTY_TYPE_LABELS,
  LUXURY_LEVEL_LABELS,
  ATTENDANCE_LABELS,
  BUDGET_LABELS,
  getProfileCompletionScore,
} from '@/types/property'

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  propertyName:         string
  propertyType:         PropertyType | ''
  city:                 string
  state:                string
  unitCount:            string
  residentDemographic:  string
  communityPersonality: CommunityPersonality[]
  luxuryLevel:          string
  amenities:            Amenity[]
  typicalAttendance:    TypicalAttendance | ''
  preferredBudget:      PreferredBudget | ''
  propertyDescription:  string
}

function blankForm(): FormState {
  return {
    propertyName:         '',
    propertyType:         '',
    city:                 '',
    state:                '',
    unitCount:            '',
    residentDemographic:  '',
    communityPersonality: [],
    luxuryLevel:          '',
    amenities:            [],
    typicalAttendance:    '',
    preferredBudget:      '',
    propertyDescription:  '',
  }
}

function profileToForm(p: PropertyProfile): FormState {
  return {
    propertyName:         p.propertyName,
    propertyType:         p.propertyType,
    city:                 p.city,
    state:                p.state,
    unitCount:            p.unitCount ? String(p.unitCount) : '',
    residentDemographic:  p.residentDemographic ?? '',
    communityPersonality: p.communityPersonality ?? [],
    luxuryLevel:          p.luxuryLevel ? String(p.luxuryLevel) : '',
    amenities:            p.amenities ?? [],
    typicalAttendance:    p.typicalAttendance ?? '',
    preferredBudget:      p.preferredBudget ?? '',
    propertyDescription:  p.propertyDescription ?? '',
  }
}

// ─── Options ──────────────────────────────────────────────────────────────────

const PROPERTY_TYPE_OPTIONS = (Object.keys(PROPERTY_TYPE_LABELS) as PropertyType[]).map((v) => ({
  value: v,
  label: PROPERTY_TYPE_LABELS[v],
}))

const LUXURY_OPTIONS = ([1, 2, 3, 4, 5] as LuxuryLevel[]).map((v) => ({
  value: String(v),
  label: `${v} — ${LUXURY_LEVEL_LABELS[v]}`,
}))

const ATTENDANCE_OPTIONS = (Object.keys(ATTENDANCE_LABELS) as TypicalAttendance[]).map((v) => ({
  value: v,
  label: ATTENDANCE_LABELS[v],
}))

const BUDGET_OPTIONS = (Object.keys(BUDGET_LABELS) as PreferredBudget[]).map((v) => ({
  value: v,
  label: BUDGET_LABELS[v],
}))

const DEMOGRAPHIC_OPTIONS = [
  'Young Professionals (25–35)',
  'Young Professionals (25–40)',
  'Families with Children',
  'Mixed Ages',
  'Mature Residents (50+)',
  'Active Adults (55+)',
  'Graduate Students',
  'Undergrad Students',
]

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

// ─── Component ────────────────────────────────────────────────────────────────

export function PropertySettingsPage() {
  const navigate = useNavigate()
  const { profile, saveProfile } = useProperty()

  const [form, setForm]       = useState<FormState>(blankForm())
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string | null>(null)

  // Populate form from existing profile
  useEffect(() => {
    if (profile) setForm(profileToForm(profile))
  }, [profile])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setSaved(false)
    setForm((f) => ({ ...f, [key]: value }))
  }

  // Live preview score
  const previewProfile: Partial<PropertyProfile> = {
    propertyName:         form.propertyName,
    propertyType:         form.propertyType || undefined,
    city:                 form.city,
    state:                form.state,
    residentDemographic:  form.residentDemographic || undefined,
    communityPersonality: form.communityPersonality.length ? form.communityPersonality : undefined,
    luxuryLevel:          form.luxuryLevel ? (Number(form.luxuryLevel) as LuxuryLevel) : undefined,
    amenities:            form.amenities.length ? form.amenities : undefined,
    typicalAttendance:    form.typicalAttendance || undefined,
    preferredBudget:      form.preferredBudget || undefined,
  }
  const liveScore = getProfileCompletionScore(previewProfile)

  const requiredFilled =
    form.propertyName.trim() &&
    form.propertyType &&
    form.city.trim() &&
    form.state

  async function handleSave() {
    if (!requiredFilled) return
    setSaving(true)
    setError(null)
    setSaved(false)

    const updated: PropertyProfile = {
      id:                   profile?.id,
      userKey:              getUserKey(),
      propertyName:         form.propertyName.trim(),
      propertyType:         form.propertyType as PropertyType,
      city:                 form.city.trim(),
      state:                form.state,
      unitCount:            form.unitCount ? Number(form.unitCount) : undefined,
      residentDemographic:  form.residentDemographic || undefined,
      communityPersonality: form.communityPersonality.length ? form.communityPersonality : undefined,
      luxuryLevel:          form.luxuryLevel ? (Number(form.luxuryLevel) as LuxuryLevel) : undefined,
      amenities:            form.amenities.length ? form.amenities : undefined,
      typicalAttendance:    form.typicalAttendance || undefined,
      preferredBudget:      form.preferredBudget || undefined,
      propertyDescription:  form.propertyDescription.trim() || undefined,
    }

    const err = await saveProfile(updated)
    setSaving(false)
    if (err) {
      setError(err)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const isNewProfile = !profile

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10">

      {/* Back nav */}
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1.5 mb-8 py-2 -my-2 transition-colors duration-150"
        style={{ color: 'var(--stone)', fontSize: '0.75rem' }}
      >
        <ArrowLeft size={13} strokeWidth={1.5} />
        Dashboard
      </button>

      {/* Header */}
      <div className="mb-8">
        <p
          className="text-[0.6rem] font-medium uppercase mb-2"
          style={{ letterSpacing: '0.18em', color: 'var(--gold)' }}
        >
          Property Intelligence
        </p>
        <h1
          className="font-serif font-light leading-tight mb-2"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--charcoal)' }}
        >
          {isNewProfile ? 'Set up your property' : profile.propertyName}
        </h1>
        <p
          className="text-[0.82rem] font-light leading-relaxed"
          style={{ color: 'var(--charcoal-light)' }}
        >
          {isNewProfile
            ? 'Tell Elevé about your community so every generated event feels purpose-built for your residents.'
            : 'Update your property profile to refine AI-generated events.'}
        </p>
      </div>

      {/* Completeness bar */}
      <div
        className="rounded-sm px-5 py-4 mb-8"
        style={{
          backgroundColor: 'var(--gold-ghost)',
          border: '0.5px solid rgba(184,149,90,0.18)',
        }}
      >
        <ProfileCompletenessBar score={liveScore} />
        {liveScore >= 70 && (
          <p className="text-[0.7rem] font-light mt-2" style={{ color: 'var(--gold)' }}>
            ✦ Profile is rich enough for property-aware AI generation
          </p>
        )}
      </div>

      {/* ── SECTION 1: Required ─────────────────────────────────────── */}
      <FormSection label="Property details" required>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <FieldLabel required>Property name</FieldLabel>
            <input
              type="text"
              value={form.propertyName}
              onChange={(e) => set('propertyName', e.target.value)}
              placeholder="e.g. 99 Hudson, The Ashton, Avalon Tower"
              className="w-full font-sans text-[0.875rem] font-light text-charcoal bg-warm-gray border border-border rounded-sm px-3.5 py-2.5 transition-all duration-200 focus:border-gold focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <Select
              label="Property type"
              value={form.propertyType}
              onChange={(e) => set('propertyType', e.target.value as PropertyType)}
              options={PROPERTY_TYPE_OPTIONS}
              placeholder="Select type"
            />
          </div>

          <div>
            <Select
              label="State"
              value={form.state}
              onChange={(e) => set('state', e.target.value)}
              options={US_STATES}
              placeholder="Select state"
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel required>City</FieldLabel>
            <input
              type="text"
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              placeholder="e.g. Jersey City"
              className="w-full font-sans text-[0.875rem] font-light text-charcoal bg-warm-gray border border-border rounded-sm px-3.5 py-2.5 transition-all duration-200 focus:border-gold focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <FieldLabel>Unit count</FieldLabel>
            <input
              type="number"
              value={form.unitCount}
              onChange={(e) => set('unitCount', e.target.value)}
              placeholder="e.g. 400"
              min={1}
              className="w-full font-sans text-[0.875rem] font-light text-charcoal bg-warm-gray border border-border rounded-sm px-3.5 py-2.5 transition-all duration-200 focus:border-gold focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <Select
              label="Luxury level"
              value={form.luxuryLevel}
              onChange={(e) => set('luxuryLevel', e.target.value)}
              options={LUXURY_OPTIONS}
              placeholder="Select level"
            />
          </div>
        </div>
      </FormSection>

      {/* ── SECTION 2: Community identity ──────────────────────────── */}
      <FormSection label="Community identity">
        <div className="space-y-5">
          <div>
            <Select
              label="Resident demographic"
              value={form.residentDemographic}
              onChange={(e) => set('residentDemographic', e.target.value)}
              options={DEMOGRAPHIC_OPTIONS}
              placeholder="Select demographic"
            />
          </div>

          <div>
            <FieldLabel>Community personality</FieldLabel>
            <p className="text-[0.72rem] font-light text-muted mb-2">
              Choose up to 3 traits that best describe your community.
            </p>
            <PersonalitySelector
              value={form.communityPersonality}
              onChange={(v) => set('communityPersonality', v)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Typical attendance"
              value={form.typicalAttendance}
              onChange={(e) => set('typicalAttendance', e.target.value as TypicalAttendance)}
              options={ATTENDANCE_OPTIONS}
              placeholder="Select size"
            />
            <Select
              label="Preferred budget"
              value={form.preferredBudget}
              onChange={(e) => set('preferredBudget', e.target.value as PreferredBudget)}
              options={BUDGET_OPTIONS}
              placeholder="Select range"
            />
          </div>
        </div>
      </FormSection>

      {/* ── SECTION 3: Spaces & amenities ──────────────────────────── */}
      <FormSection label="Spaces & amenities">
        <div className="space-y-5">
          <div>
            <FieldLabel>Available amenities</FieldLabel>
            <p className="text-[0.72rem] font-light text-muted mb-3">
              Select all amenity spaces available at your property.
            </p>
            <AmenityPicker
              value={form.amenities}
              onChange={(v) => set('amenities', v)}
            />
          </div>
        </div>
      </FormSection>

      {/* ── SECTION 4: Description ──────────────────────────────────── */}
      <FormSection label="Property description">
        <Textarea
          value={form.propertyDescription}
          onChange={(e) => set('propertyDescription', e.target.value)}
          placeholder="Describe your property's character, architecture, location, or anything that makes it distinctive. This context helps the AI generate more specific event concepts."
          rows={4}
          hint={`${form.propertyDescription.length}/500`}
          maxLength={500}
        />
      </FormSection>

      {/* ── Error banner (shown above sticky bar when error occurs) ── */}
      {error && (
        <div
          className="rounded-sm px-4 py-3 mb-4 flex items-start gap-3"
          style={{
            backgroundColor: '#FEF2F2',
            border: '0.5px solid #FCA5A5',
          }}
        >
          <span className="text-red-500 text-[0.7rem] shrink-0 mt-0.5">✕</span>
          <div>
            <p className="text-[0.78rem] font-medium text-red-700 mb-0.5">Save failed</p>
            <p className="text-[0.72rem] font-light text-red-600 leading-relaxed">{error}</p>
            {error.toLowerCase().includes('relation') || error.toLowerCase().includes('does not exist') ? (
              <p className="text-[0.68rem] text-red-500 mt-1.5 font-light">
                The property_profiles table may not exist yet. Run the migration SQL in your Supabase dashboard.
              </p>
            ) : error.toLowerCase().includes('row-level') || error.toLowerCase().includes('rls') || error.toLowerCase().includes('policy') ? (
              <p className="text-[0.68rem] text-red-500 mt-1.5 font-light">
                Row-level security is blocking this write. Check your Supabase RLS policies for property_profiles.
              </p>
            ) : null}
          </div>
        </div>
      )}

      {/* ── Save bar — sticky on mobile so it's always reachable ─── */}
      <div
        className="sticky bottom-0 -mx-5 sm:mx-0 px-5 sm:px-0 py-4 sm:py-2 flex items-center justify-between gap-4 sm:pt-2 sm:bg-transparent sm:border-0"
        style={{
          backgroundColor: 'var(--off-white, #FAFAF8)',
          borderTop: '0.5px solid rgba(180,166,150,0.28)',
        }}
      >
        {!error && saved && (
          <span className="flex items-center gap-1.5 text-[0.78rem] font-light" style={{ color: 'var(--gold)' }}>
            <Check size={13} strokeWidth={1.5} />
            Saved
          </span>
        )}
        {(!saved || error) && <span />}

        <Button
          variant="gold"
          size="md"
          loading={saving}
          disabled={!requiredFilled}
          onClick={handleSave}
        >
          {isNewProfile ? 'Save property' : 'Update property'}
        </Button>
      </div>

    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormSection({
  label,
  required,
  children,
}: {
  label:     string
  required?: boolean
  children:  import('react').ReactNode
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <p
          className="text-[0.62rem] font-medium uppercase"
          style={{ letterSpacing: '0.18em', color: 'var(--stone)' }}
        >
          {label}
        </p>
        {required && (
          <span
            className="text-[0.6rem] font-medium uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm"
            style={{
              backgroundColor: 'var(--warm-gray)',
              color: 'var(--stone)',
              border: '0.5px solid var(--stone-pale)',
            }}
          >
            Required
          </span>
        )}
      </div>
      <div
        className="rounded-sm px-5 py-5"
        style={{
          backgroundColor: 'var(--card-bg)',
          border: 'var(--card-border)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function FieldLabel({
  children,
  required,
}: {
  children: import('react').ReactNode
  required?: boolean
}) {
  return (
    <label className="block text-[0.7rem] font-medium tracking-[0.1em] uppercase text-charcoal-light mb-1.5">
      {children}
      {required && <span className="text-gold ml-1">*</span>}
    </label>
  )
}
