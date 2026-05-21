import { useState } from 'react'
import {
  CheckCircle2, RefreshCw, BookmarkPlus, Loader2,
  Mail, Megaphone, Users, Wine, Package, Clock, Lightbulb, Store,
  Copy, Check,
} from 'lucide-react'
import type { EventPlan, EventFormData, SavedEvent, VendorIdea, StaffingRole, TimelineItem } from '@/types'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { generateTempId } from '@/lib/utils'

interface EventPlanResultProps {
  plan: EventPlan
  formData: EventFormData
  onSave: (event: SavedEvent) => Promise<SavedEvent | null>
  onRegenerate: () => void
  isSaved: boolean
}

export function EventPlanResult({ plan, formData, onSave, onRegenerate, isSaved }: EventPlanResultProps) {
  const [saving, setSaving]       = useState(false)
  const [savedOk, setSavedOk]     = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    const event: SavedEvent = {
      ...plan,
      id: generateTempId(),
      meta: formData,
      savedAt: new Date().toISOString(),
    }
    const result = await onSave(event)
    setSaving(false)
    if (result) {
      setSavedOk(true)
      setTimeout(() => setSavedOk(false), 4000)
    } else {
      setSaveError('Could not save — please try again.')
    }
  }

  return (
    <div className="bg-white border border-border rounded-sm overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="bg-charcoal px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          <span className="text-[0.72rem] font-medium tracking-[0.14em] uppercase text-gold-light">
            Your curated event plan
          </span>
        </div>
        <Badge variant="gold">{formData.eventType}</Badge>
      </div>

      <div className="p-6 sm:p-8">
        {/* Title block */}
        <div className="mb-7">
          <h2 className="font-serif text-4xl font-light text-charcoal leading-tight mb-1">
            {plan.title}
          </h2>
          <p className="text-[0.78rem] font-medium tracking-[0.12em] uppercase text-gold mb-3">
            {plan.tagline}
          </p>
          {/* Flyer headline pill */}
          <div className="inline-flex items-center gap-2 bg-charcoal text-gold-light px-4 py-2 rounded-sm">
            <Megaphone size={13} strokeWidth={1.5} />
            <span className="text-[0.78rem] font-medium tracking-[0.06em]">{plan.flyerHeadline}</span>
          </div>
        </div>

        {/* Concept + Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <PlanSection title="Event Concept">
            <p className="text-[0.875rem] text-charcoal font-light leading-relaxed">{plan.overview}</p>
          </PlanSection>
          <PlanSection title="Ambiance & Theme">
            <p className="text-[0.875rem] text-charcoal font-light leading-relaxed">{plan.theme}</p>
          </PlanSection>
        </div>

        {/* Timeline */}
        <PlanSection title="Event Timeline" icon={<Clock size={13} />}>
          <div className="space-y-0 border border-border rounded-sm overflow-hidden">
            {plan.timeline.map((item: TimelineItem, i: number) => (
              <div
                key={i}
                className="flex gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-warm-gray transition-colors"
              >
                <span className="text-[0.75rem] font-medium text-gold shrink-0 w-16 pt-0.5 tabular-nums">
                  {item.time}
                </span>
                <div className="flex-1">
                  <p className="text-[0.875rem] text-charcoal font-light">{item.activity}</p>
                </div>
                <span className="text-[0.7rem] text-muted shrink-0 pt-0.5">{item.responsible}</span>
              </div>
            ))}
          </div>
        </PlanSection>

        {/* Catering + Entertainment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <PlanSection title="Catering Highlights">
            <PlanList items={plan.catering} />
          </PlanSection>
          <PlanSection title="Entertainment">
            <PlanList items={plan.entertainment} />
          </PlanSection>
        </div>

        {/* Vendor Ideas */}
        <PlanSection title="Vendor Recommendations" icon={<Store size={13} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plan.vendorIdeas.map((vendor: VendorIdea, i: number) => (
              <div key={i} className="border border-border rounded-sm p-4 bg-warm-gray">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-charcoal-light">
                    {vendor.category}
                  </span>
                  <span className="text-[0.72rem] text-gold font-medium">{vendor.estimatedCost}</span>
                </div>
                <ul className="space-y-1">
                  {vendor.suggestions.map((s: string, j: number) => (
                    <li key={j} className="flex gap-2 text-[0.82rem] text-charcoal font-light">
                      <span className="text-gold shrink-0">—</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </PlanSection>

        {/* Staffing + Alcohol side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <PlanSection title="Staffing Plan" icon={<Users size={13} />}>
            <div className="space-y-2">
              {plan.staffing.map((role: StaffingRole, i: number) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <span className="text-[0.72rem] font-medium bg-charcoal text-gold-light px-2 py-0.5 rounded-sm shrink-0 tabular-nums">
                    ×{role.count}
                  </span>
                  <div>
                    <p className="text-[0.82rem] font-medium text-charcoal">{role.role}</p>
                    <p className="text-[0.78rem] text-muted font-light">{role.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </PlanSection>

          {plan.alcoholEstimate ? (
            <PlanSection title="Alcohol Estimate" icon={<Wine size={13} />}>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1 border-b border-border">
                  <span className="text-[0.78rem] text-muted font-light">Servings / person</span>
                  <span className="text-[0.82rem] font-medium text-charcoal">{plan.alcoholEstimate.servingsPerPerson}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border">
                  <span className="text-[0.78rem] text-muted font-light">Est. quantity</span>
                  <span className="text-[0.82rem] font-medium text-charcoal text-right max-w-[55%]">{plan.alcoholEstimate.totalBottles}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border">
                  <span className="text-[0.78rem] text-muted font-light">Est. cost</span>
                  <span className="text-[0.82rem] font-medium text-gold">{plan.alcoholEstimate.estimatedCost}</span>
                </div>
                <ul className="space-y-1 pt-1">
                  {plan.alcoholEstimate.recommendations.map((r: string, i: number) => (
                    <li key={i} className="flex gap-2 text-[0.8rem] text-charcoal font-light">
                      <span className="text-gold shrink-0">—</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            </PlanSection>
          ) : (
            <PlanSection title="Beverage Service" icon={<Wine size={13} />}>
              <p className="text-[0.875rem] text-muted font-light italic">Non-alcoholic event</p>
              <PlanList items={plan.catering.filter((_, i) => i < 3)} />
            </PlanSection>
          )}
        </div>

        {/* Setup Logistics + Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <PlanSection title="Setup Logistics" icon={<Package size={13} />}>
            <PlanList items={plan.setupLogistics?.length ? plan.setupLogistics : plan.logistics} />
          </PlanSection>
          <PlanSection title="Budget Breakdown">
            <PlanList items={plan.budgetBreakdown} />
          </PlanSection>
        </div>

        {/* Resident Email */}
        <ResidentEmailCard email={plan.residentEmail} />

        {/* Pro Tip */}
        <div className="bg-warm-gray border-l-2 border-gold px-5 py-4 mt-5 mb-7 flex gap-3">
          <Lightbulb size={15} className="text-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-[0.67rem] font-medium tracking-[0.14em] uppercase text-gold mb-1">Pro Tip</p>
            <p className="text-[0.875rem] text-charcoal font-light leading-relaxed">{plan.proTip}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-border">
          <Button variant="gold" size="sm" onClick={() => void handleSave()} disabled={isSaved || savedOk || saving}>
            {saving ? <Loader2 size={13} className="mr-2 animate-spin" /> : <BookmarkPlus size={14} className="mr-2" />}
            {saving ? 'Saving...' : savedOk ? 'Saved!' : 'Save Event'}
          </Button>
          <Button variant="outline" size="sm" onClick={onRegenerate}>
            <RefreshCw size={13} className="mr-2" />
            Regenerate
          </Button>
          {savedOk && (
            <span className="flex items-center gap-1.5 text-[0.75rem] font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-sm">
              <CheckCircle2 size={13} />
              Saved to Supabase
            </span>
          )}
          {saveError && (
            <span className="text-[0.75rem] text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-sm">
              {saveError}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Resident Email Card ──────────────────────────────────────────────────────

function ResidentEmailCard({ email }: { email: EventPlan['residentEmail'] }) {
  const [copied, setCopied] = useState(false)
  const full = `Subject: ${email.subject}\n\n${email.body}`

  const copy = async () => {
    await navigator.clipboard.writeText(full)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <PlanSection title="Resident Invitation Email" icon={<Mail size={13} />}>
      <div className="border border-border rounded-sm overflow-hidden">
        <div className="bg-warm-gray px-4 py-2.5 flex items-center justify-between border-b border-border">
          <div>
            <span className="text-[0.68rem] text-muted font-light uppercase tracking-widest mr-2">Subject:</span>
            <span className="text-[0.82rem] font-medium text-charcoal">{email.subject}</span>
          </div>
          <button
            onClick={() => void copy()}
            className="flex items-center gap-1.5 text-[0.72rem] text-muted hover:text-charcoal transition-colors px-2 py-1 rounded hover:bg-border"
          >
            {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="px-4 py-4">
          <p className="text-[0.85rem] text-charcoal font-light leading-relaxed whitespace-pre-line">
            {email.body}
          </p>
        </div>
      </div>
    </PlanSection>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

export function PlanSection({
  title,
  icon,
  action,
  children,
}: {
  title: string
  icon?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="mb-5">
      <h4 className="flex items-center gap-1.5 text-[0.67rem] font-medium tracking-[0.15em] uppercase text-charcoal-light pb-2 mb-3 border-b border-border">
        {icon && <span className="text-gold">{icon}</span>}
        <span className="flex-1">{title}</span>
        {action && <span className="ml-auto">{action}</span>}
      </h4>
      {children}
    </div>
  )
}

export function PlanList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[0.875rem] text-charcoal font-light leading-relaxed">
          <span className="text-gold shrink-0 mt-0.5">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
