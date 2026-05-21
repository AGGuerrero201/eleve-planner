import { useState } from 'react'
import type { SavedEvent, TimelineItem, VendorIdea, StaffingRole, EventWorkflowStatus, RegenerableSection } from '@/types'
import { WORKFLOW_STATUS_LABELS, WORKFLOW_STATUS_ORDER } from '@/lib/workflowStatus'
import { SECTION_LABELS } from '@/lib/sectionRegeneration'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { WorkflowBadge } from '@/components/events/EventCard'
import { PlanSection, PlanList } from '@/components/events/EventPlanResult'
import { EditableText } from '@/components/ui/EditableText'
import { EditableTextarea } from '@/components/ui/EditableTextarea'
import { EditableList } from '@/components/ui/EditableList'
import { formatDate, cn } from '@/lib/utils'
import {
  Clock, Store, Users, Wine, Package, Mail,
  Megaphone, Lightbulb, Loader2, RefreshCw, CheckCircle2,
} from 'lucide-react'

interface EventDetailModalProps {
  event: SavedEvent | null
  onClose: () => void
  onStatusChange?: (id: string, status: EventWorkflowStatus) => Promise<void>
  onFieldSave?: (id: string, patch: Record<string, unknown>) => Promise<string | null>
  onSectionRegenerate?: (id: string, section: RegenerableSection) => Promise<string | null>
}

export function EventDetailModal({
  event,
  onClose,
  onStatusChange,
  onFieldSave,
  onSectionRegenerate,
}: EventDetailModalProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [regeneratingSection, setRegeneratingSection] = useState<RegenerableSection | null>(null)
  const [recentlyRegenerated, setRecentlyRegenerated] = useState<RegenerableSection | null>(null)
  const [regenError, setRegenError] = useState<string | null>(null)

  const handleStatusChange = async (newStatus: EventWorkflowStatus) => {
    if (!event || !onStatusChange || newStatus === event.workflowStatus) return
    setUpdatingStatus(true)
    await onStatusChange(event.id, newStatus)
    setUpdatingStatus(false)
  }

  const saver = (column: string) => async (value: unknown): Promise<string | null> => {
    if (!event || !onFieldSave) return null
    return onFieldSave(event.id, { [column]: value })
  }

  const handleRegenerate = async (section: RegenerableSection) => {
    if (!event || !onSectionRegenerate || regeneratingSection) return
    setRegeneratingSection(section)
    setRegenError(null)
    const err = await onSectionRegenerate(event.id, section)
    setRegeneratingSection(null)
    if (err) {
      setRegenError(err)
    } else {
      setRecentlyRegenerated(section)
      setTimeout(() => setRecentlyRegenerated(null), 3000)
    }
  }

  // Render a ↻ Regenerate button for a given section
  const RegenBtn = ({ section }: { section: RegenerableSection }) => {
    if (!onSectionRegenerate) return null
    const isThis = regeneratingSection === section
    const wasThis = recentlyRegenerated === section
    const anyBusy = regeneratingSection !== null

    return (
      <button
        type="button"
        onClick={() => void handleRegenerate(section)}
        disabled={anyBusy}
        title={`Regenerate ${SECTION_LABELS[section]} with Claude`}
        className={cn(
          'flex items-center gap-1 text-[0.67rem] font-medium px-1.5 py-0.5 rounded-sm border transition-all duration-150',
          'disabled:cursor-not-allowed',
          wasThis
            ? 'border-green-200 bg-green-50 text-green-700'
            : 'border-border bg-white text-muted hover:border-gold hover:text-gold disabled:opacity-40'
        )}
      >
        {isThis
          ? <Loader2 size={10} className="animate-spin" />
          : wasThis
          ? <CheckCircle2 size={10} />
          : <RefreshCw size={10} />}
        {isThis ? 'Regenerating…' : wasThis ? 'Updated' : '↻ AI'}
      </button>
    )
  }

  if (!event) return null

  return (
    <Modal open={!!event} onClose={onClose} title={event.title}>
      <div>

        {/* Tagline */}
        <p className="text-[0.75rem] font-medium tracking-[0.12em] uppercase text-gold mb-3">
          {event.tagline}
        </p>

        {/* Flyer headline — editable + regeneratable */}
        <div className="flex items-center gap-2 bg-charcoal px-3 py-1.5 rounded-sm mb-4">
          <Megaphone size={12} strokeWidth={1.5} className="text-gold shrink-0" />
          <EditableText
            value={event.flyerHeadline}
            onSave={saver('flyer_headline')}
            placeholder="Add a flyer headline…"
            className="flex-1"
            inputClassName="bg-charcoal-mid text-gold-light border-gold/40 text-[0.78rem]"
          />
          <RegenBtn section="flyer_headline" />
        </div>

        {/* Regen error */}
        {regenError && (
          <p className="text-[0.72rem] text-red-500 mb-3 px-1">{regenError}</p>
        )}

        {/* Status selector */}
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border flex-wrap">
          <span className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-charcoal-light shrink-0">Status</span>
          <div className="flex flex-wrap gap-1.5">
            {WORKFLOW_STATUS_ORDER.map((s) => (
              <button
                key={s}
                type="button"
                disabled={updatingStatus}
                onClick={() => void handleStatusChange(s)}
                className={cn(
                  'text-[0.67rem] font-medium tracking-[0.08em] uppercase px-2.5 py-1 rounded-sm border transition-all duration-150',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  event.workflowStatus === s
                    ? 'bg-charcoal text-gold-light border-charcoal'
                    : 'bg-white text-muted border-border hover:border-charcoal-light hover:text-charcoal'
                )}
              >
                {WORKFLOW_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          {updatingStatus && <Loader2 size={13} className="text-gold animate-spin shrink-0" />}
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          <Badge variant="muted">{event.meta.eventType}</Badge>
          <Badge variant="muted">{event.meta.season}</Badge>
          <Badge variant="muted">{event.meta.venue}</Badge>
          <Badge variant="muted">{event.meta.budget}</Badge>
          <Badge variant="muted">{event.meta.attendance}</Badge>
          <Badge variant="muted">{event.meta.alcohol}</Badge>
        </div>

        {/* Concept + Theme — editable only */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <PlanSection title="Event Concept">
            <EditableTextarea value={event.overview} onSave={saver('overview')} rows={4} />
          </PlanSection>
          <PlanSection title="Ambiance & Theme">
            <EditableTextarea value={event.theme} onSave={saver('theme')} rows={4} />
          </PlanSection>
        </div>

        {/* Timeline — regeneratable */}
        {event.timeline?.length > 0 && (
          <PlanSection
            title="Timeline"
            icon={<Clock size={13} />}
            action={<RegenBtn section="timeline" />}
          >
            <div className="space-y-0 border border-border rounded-sm overflow-hidden">
              {event.timeline.map((item: TimelineItem, i: number) => (
                <div key={i} className="flex gap-4 px-3 py-2.5 border-b border-border last:border-0 hover:bg-warm-gray">
                  <span className="text-[0.72rem] font-medium text-gold shrink-0 w-14 tabular-nums pt-0.5">{item.time}</span>
                  <p className="text-[0.82rem] text-charcoal font-light flex-1">{item.activity}</p>
                  <span className="text-[0.68rem] text-muted shrink-0 pt-0.5">{item.responsible}</span>
                </div>
              ))}
            </div>
          </PlanSection>
        )}

        {/* Catering + Entertainment — editable + regeneratable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <PlanSection title="Catering" action={<RegenBtn section="catering" />}>
            <EditableList items={event.catering} onSave={saver('catering')} />
          </PlanSection>
          <PlanSection title="Entertainment" action={<RegenBtn section="entertainment" />}>
            <EditableList items={event.entertainment} onSave={saver('entertainment')} />
          </PlanSection>
        </div>

        {/* Vendors — regeneratable */}
        {event.vendorIdeas?.length > 0 && (
          <PlanSection title="Vendor Ideas" icon={<Store size={13} />} action={<RegenBtn section="vendor_ideas" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {event.vendorIdeas.map((v: VendorIdea, i: number) => (
                <div key={i} className="border border-border rounded-sm p-3 bg-warm-gray">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[0.68rem] font-medium uppercase tracking-wider text-charcoal-light">{v.category}</span>
                    <span className="text-[0.7rem] text-gold font-medium">{v.estimatedCost}</span>
                  </div>
                  {v.suggestions.map((s: string, j: number) => (
                    <p key={j} className="text-[0.78rem] text-charcoal font-light">— {s}</p>
                  ))}
                </div>
              ))}
            </div>
          </PlanSection>
        )}

        {/* Staffing — regeneratable */}
        {event.staffing?.length > 0 && (
          <PlanSection title="Staffing" icon={<Users size={13} />} action={<RegenBtn section="staffing" />}>
            <div className="space-y-2">
              {event.staffing.map((r: StaffingRole, i: number) => (
                <div key={i} className="flex gap-3 py-2 border-b border-border last:border-0">
                  <span className="text-[0.72rem] font-medium bg-charcoal text-gold-light px-2 py-0.5 rounded-sm shrink-0">×{r.count}</span>
                  <div>
                    <p className="text-[0.82rem] font-medium text-charcoal">{r.role}</p>
                    <p className="text-[0.75rem] text-muted font-light">{r.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </PlanSection>
        )}

        {/* Alcohol — read only */}
        {event.alcoholEstimate && (
          <PlanSection title="Alcohol Estimate" icon={<Wine size={13} />}>
            <p className="text-[0.82rem] text-charcoal font-light mb-1">
              <span className="font-medium">Quantity:</span> {event.alcoholEstimate.totalBottles}
            </p>
            <p className="text-[0.82rem] text-charcoal font-light mb-2">
              <span className="font-medium">Est. cost:</span>{' '}
              <span className="text-gold">{event.alcoholEstimate.estimatedCost}</span>
            </p>
            <PlanList items={event.alcoholEstimate.recommendations} />
          </PlanSection>
        )}

        {/* Setup Logistics + Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <PlanSection title="Setup Logistics" icon={<Package size={13} />} action={<RegenBtn section="setup_logistics" />}>
            <EditableList
              items={event.setupLogistics?.length ? event.setupLogistics : event.logistics}
              onSave={saver('setup_logistics')}
            />
          </PlanSection>
          <PlanSection title="Budget Breakdown">
            <EditableList items={event.budgetBreakdown} onSave={saver('budget_breakdown')} />
          </PlanSection>
        </div>

        {/* Resident Email — editable + regeneratable */}
        {event.residentEmail && (
          <PlanSection title="Resident Email" icon={<Mail size={13} />} action={<RegenBtn section="resident_email" />}>
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="bg-warm-gray px-3 py-2 border-b border-border">
                <span className="text-[0.68rem] text-muted uppercase tracking-wider mr-2">Subject:</span>
                <EditableText
                  value={event.residentEmail.subject}
                  onSave={async (val) => saver('resident_email')({ subject: val, body: event.residentEmail.body })}
                  placeholder="Email subject…"
                  inputClassName="text-[0.8rem]"
                />
              </div>
              <div className="px-3 py-3">
                <EditableTextarea
                  value={event.residentEmail.body}
                  onSave={async (val) => saver('resident_email')({ subject: event.residentEmail.subject, body: val })}
                  rows={6}
                  textClassName="text-[0.82rem] whitespace-pre-line"
                />
              </div>
            </div>
          </PlanSection>
        )}

        {/* Pro Tip — editable + regeneratable */}
        <div className="bg-warm-gray border-l-2 border-gold px-4 py-3 flex gap-3 mt-2 mb-2">
          <Lightbulb size={14} className="text-gold shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[0.67rem] font-medium tracking-[0.14em] uppercase text-gold">Pro Tip</p>
              <RegenBtn section="pro_tip" />
            </div>
            <EditableTextarea value={event.proTip} onSave={saver('pro_tip')} rows={3} textClassName="text-[0.82rem]" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
          <p className="text-[0.72rem] text-muted/60">Saved on {formatDate(event.savedAt)}</p>
          <WorkflowBadge status={event.workflowStatus} />
        </div>
      </div>
    </Modal>
  )
}
