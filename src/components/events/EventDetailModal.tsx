import type { SavedEvent, TimelineItem, VendorIdea, StaffingRole } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { PlanSection, PlanList } from '@/components/events/EventPlanResult'
import { formatDate } from '@/lib/utils'
import { Clock, Store, Users, Wine, Package, Mail, Megaphone, Lightbulb } from 'lucide-react'

interface EventDetailModalProps {
  event: SavedEvent | null
  onClose: () => void
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  if (!event) return null

  return (
    <Modal open={!!event} onClose={onClose} title={event.title}>
      <div>
        {/* Tagline + flyer headline */}
        <p className="text-[0.75rem] font-medium tracking-[0.12em] uppercase text-gold mb-2">
          {event.tagline}
        </p>
        {event.flyerHeadline && (
          <div className="inline-flex items-center gap-2 bg-charcoal text-gold-light px-3 py-1.5 rounded-sm mb-4">
            <Megaphone size={12} strokeWidth={1.5} />
            <span className="text-[0.75rem] font-medium">{event.flyerHeadline}</span>
          </div>
        )}

        {/* Meta badges */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          <Badge variant="muted">{event.meta.eventType}</Badge>
          <Badge variant="muted">{event.meta.season}</Badge>
          <Badge variant="muted">{event.meta.venue}</Badge>
          <Badge variant="muted">{event.meta.budget}</Badge>
          <Badge variant="muted">{event.meta.attendance}</Badge>
          <Badge variant="muted">{event.meta.alcohol}</Badge>
        </div>

        {/* Concept + Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <PlanSection title="Event Concept">
            <p className="text-[0.875rem] text-charcoal font-light leading-relaxed">{event.overview}</p>
          </PlanSection>
          <PlanSection title="Ambiance & Theme">
            <p className="text-[0.875rem] text-charcoal font-light leading-relaxed">{event.theme}</p>
          </PlanSection>
        </div>

        {/* Timeline */}
        {event.timeline?.length > 0 && (
          <PlanSection title="Timeline" icon={<Clock size={13} />}>
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

        {/* Catering + Entertainment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <PlanSection title="Catering"><PlanList items={event.catering} /></PlanSection>
          <PlanSection title="Entertainment"><PlanList items={event.entertainment} /></PlanSection>
        </div>

        {/* Vendors */}
        {event.vendorIdeas?.length > 0 && (
          <PlanSection title="Vendor Ideas" icon={<Store size={13} />}>
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

        {/* Staffing */}
        {event.staffing?.length > 0 && (
          <PlanSection title="Staffing" icon={<Users size={13} />}>
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

        {/* Alcohol */}
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
          <PlanSection title="Setup Logistics" icon={<Package size={13} />}>
            <PlanList items={event.setupLogistics?.length ? event.setupLogistics : event.logistics} />
          </PlanSection>
          <PlanSection title="Budget Breakdown">
            <PlanList items={event.budgetBreakdown} />
          </PlanSection>
        </div>

        {/* Resident Email */}
        {event.residentEmail?.subject && (
          <PlanSection title="Resident Email" icon={<Mail size={13} />}>
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="bg-warm-gray px-3 py-2 border-b border-border">
                <span className="text-[0.68rem] text-muted uppercase tracking-wider mr-2">Subject:</span>
                <span className="text-[0.8rem] font-medium text-charcoal">{event.residentEmail.subject}</span>
              </div>
              <p className="px-3 py-3 text-[0.82rem] text-charcoal font-light leading-relaxed whitespace-pre-line">
                {event.residentEmail.body}
              </p>
            </div>
          </PlanSection>
        )}

        {/* Pro Tip */}
        <div className="bg-warm-gray border-l-2 border-gold px-4 py-3 flex gap-3 mt-2 mb-2">
          <Lightbulb size={14} className="text-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-[0.67rem] font-medium tracking-[0.14em] uppercase text-gold mb-1">Pro Tip</p>
            <p className="text-[0.82rem] text-charcoal font-light leading-relaxed">{event.proTip}</p>
          </div>
        </div>

        <p className="text-[0.72rem] text-muted/60 mt-5 pt-4 border-t border-border">
          Saved on {formatDate(event.savedAt)}
        </p>
      </div>
    </Modal>
  )
}
