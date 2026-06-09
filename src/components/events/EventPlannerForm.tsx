import { useState, type FormEvent } from 'react'
import { Sparkles } from 'lucide-react'
import type { EventFormData, VenueSetting, AlcoholService, ResidentDemo, Season, Budget, Attendance } from '@/types'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { ToggleGroup } from '@/components/ui/ToggleGroup'
import { Button } from '@/components/ui/Button'
import {
  EVENT_TYPES,
  BUDGETS,
  ATTENDANCES,
  SEASONS,
  VENUE_OPTIONS,
  ALCOHOL_OPTIONS,
  DEMOGRAPHIC_OPTIONS,
} from '@/lib/constants'

const NOTES_MAX = 500

const DEFAULT_FORM: EventFormData = {
  eventType:   '',
  budget:      '',
  attendance:  '',
  season:      '',
  venue:       'Indoor',
  alcohol:     'Full bar',
  demographic: 'Young professionals (25–35)',
  notes:       '',
}

interface EventPlannerFormProps {
  onSubmit: (data: EventFormData) => void
  isLoading: boolean
}

export function EventPlannerForm({ onSubmit, isLoading }: EventPlannerFormProps) {
  const [form, setForm] = useState<EventFormData>(DEFAULT_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({})

  const validate = (): boolean => {
    const errs: Partial<Record<keyof EventFormData, string>> = {}
    if (!form.eventType) errs.eventType = 'Please select an event type'
    if (!form.budget)    errs.budget    = 'Please select a budget range'
    if (!form.attendance) errs.attendance = 'Please select expected attendance'
    if (!form.season)    errs.season    = 'Please select a season'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit(form)
  }

  const handleClear = () => {
    setForm(DEFAULT_FORM)
    setErrors({})
  }

  const set = <K extends keyof EventFormData>(key: K, val: EventFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }) as EventFormData)

  const notesLen = form.notes.length
  const notesNearLimit = notesLen >= NOTES_MAX * 0.85  // warn at 85%
  const notesAtLimit   = notesLen >= NOTES_MAX

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card>
        {/* Row 1: type + budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <Select
            id="eventType"
            label="Event Type"
            placeholder="Select type…"
            options={EVENT_TYPES.map((t) => ({ label: t, value: t }))}
            value={form.eventType}
            onChange={(e) => set('eventType', e.target.value)}
            error={errors.eventType}
          />
          <Select
            id="budget"
            label="Estimated Budget"
            placeholder="Select range…"
            options={BUDGETS}
            value={form.budget}
            onChange={(e) => set('budget', e.target.value as Budget)}
            error={errors.budget}
          />
        </div>

        {/* Row 2: attendance + season */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <Select
            id="attendance"
            label="Expected Attendance"
            placeholder="Select range…"
            options={ATTENDANCES}
            value={form.attendance}
            onChange={(e) => set('attendance', e.target.value as Attendance)}
            error={errors.attendance}
          />
          <Select
            id="season"
            label="Season"
            placeholder="Select season…"
            options={SEASONS}
            value={form.season}
            onChange={(e) => set('season', e.target.value as Season)}
            error={errors.season}
          />
        </div>

        <hr className="border-border mb-6" />

        {/* Toggle groups */}
        <div className="space-y-5 mb-6">
          <ToggleGroup
            label="Venue Setting"
            options={VENUE_OPTIONS}
            value={form.venue}
            onChange={(v) => set('venue', v as VenueSetting)}
          />
          <ToggleGroup
            label="Alcohol Service"
            options={ALCOHOL_OPTIONS}
            value={form.alcohol}
            onChange={(v) => set('alcohol', v as AlcoholService)}
          />
          <ToggleGroup
            label="Resident Demographic"
            options={DEMOGRAPHIC_OPTIONS}
            value={form.demographic}
            onChange={(v) => set('demographic', v as ResidentDemo)}
          />
        </div>

        <hr className="border-border mb-6" />

        {/* Notes with character counter */}
        <div className="mb-7">
          <Textarea
            id="notes"
            label="Special Notes"
            hint="Optional"
            placeholder="Any special requests, themes, dietary requirements, or property-specific details…"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value.slice(0, NOTES_MAX))}
            rows={3}
            maxLength={NOTES_MAX}
          />
          {/* Counter — only visible once the user starts typing */}
          {notesLen > 0 && (
            <p className={`text-right text-[0.72rem] mt-1 tabular-nums transition-colors ${
              notesAtLimit   ? 'text-red-500 font-medium' :
              notesNearLimit ? 'text-amber-500' :
              'text-muted'
            }`}>
              {notesLen} / {NOTES_MAX}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" variant="gold" size="md" loading={isLoading}>
            <Sparkles size={14} className="mr-2" />
            {isLoading ? 'Generating plan' : 'Generate Event Plan'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleClear}
            disabled={isLoading}
          >
            Clear
          </Button>
        </div>
      </Card>
    </form>
  )
}
