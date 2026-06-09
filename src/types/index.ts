/**
 * types/index.ts
 *
 * Shared TypeScript types for the Elevé frontend.
 *
 * NOTE: The Supabase Edge Function source (generate-event-plan) previously
 * lived here by mistake. It has been moved to
 *   supabase/functions/generate-event-plan/index.ts
 * This file now exports only browser-safe types used by the React app.
 */

// ─── Form types ───────────────────────────────────────────────────────────────

export type VenueSetting  = 'Indoor' | 'Outdoor' | 'Rooftop' | 'Pool deck' | 'Flexible' | 'Indoor & Outdoor'
export type AlcoholService = 'Full bar' | 'Beer & wine' | 'Wine & beer only' | 'No alcohol'
export type ResidentDemo  =
  | 'Young professionals'
  | 'Young professionals (25–35)'
  | 'Families'
  | 'Mature residents'
  | 'Mature residents (50+)'
  | 'Mixed'
  | 'Mixed demographic'
  | 'Mixed ages, family-oriented'
export type Season     = 'Spring' | 'Summer' | 'Fall' | 'Winter' | 'Fall / Autumn'
export type Budget     =
  | 'Under $1,000'
  | '$1,000 – $2,500'
  | '$2,500 – $5,000'
  | '$5,000 – $10,000'
  | '$10,000+'
export type Attendance =
  | 'Under 20'
  | '20 – 40'
  | '40 – 75'
  | '75 – 150'
  | '150+'

export interface EventFormData {
  eventType:   string
  budget:      string
  attendance:  string
  season:      string
  venue:       string
  alcohol:     string
  demographic: ResidentDemo | ''
  notes:       string
}

// ─── Event plan types ─────────────────────────────────────────────────────────

export interface TimelineItem {
  time:        string
  activity:    string
  responsible: string
}

export interface VendorIdea {
  category:      string
  suggestions:   string[]
  estimatedCost: string
}

export interface StaffingRole {
  role:  string
  count: number
  notes: string
}

export interface ResidentEmail {
  subject: string
  body:    string
}

export interface AlcoholEstimate {
  servingsPerPerson: number
  totalBottles:      string
  recommendations:   string[]
  estimatedCost:     string
}

export interface EventPlan {
  title:           string
  tagline:         string
  overview:        string
  theme:           string
  timeline:        TimelineItem[]
  catering:        string[]
  entertainment:   string[]
  logistics:       string[]
  budgetBreakdown: string[]
  vendorIdeas:     VendorIdea[]
  staffing:        StaffingRole[]
  alcoholEstimate: AlcoholEstimate | null
  setupLogistics:  string[]
  residentEmail:   ResidentEmail
  flyerHeadline:   string
  proTip:          string
}

// ─── API response types ───────────────────────────────────────────────────────

export interface GenerateEventResponse {
  plan:        EventPlan
  generatedAt: string
  model:       string
}

export interface EdgeFunctionError {
  error:     string
  code:      string
  retryable: boolean
}

// ─── Section regeneration ─────────────────────────────────────────────────────

export type RegenerableSection =
  | 'catering' | 'entertainment' | 'setup_logistics' | 'timeline'
  | 'staffing' | 'vendor_ideas' | 'resident_email' | 'flyer_headline' | 'pro_tip'

export interface SectionRegenerationRequest {
  formData:     EventFormData
  section:      RegenerableSection
  eventContext: {
    title:       string
    eventType:   string
    budget:      string
    attendance:  string
    venue:       string
    alcohol:     string
    demographic: string
    season:      string
  }
}

export interface SectionRegenerationResponse {
  section: RegenerableSection
  value:   unknown
}

// ─── Saved events ─────────────────────────────────────────────────────────────

export type EventWorkflowStatus =
  | 'draft'
  | 'in_progress'
  | 'finalized'
  | 'archived'

export interface SavedEvent extends EventPlan {
  id:              string
  created_at:      string
  savedAt:         string
  workflowStatus?: EventWorkflowStatus
  meta?: {
    eventType:   string
    budget:      string
    attendance:  string
    season:      string
    venue:       string
    alcohol:     string
    demographic: string
  }
}

// ─── UI state types ───────────────────────────────────────────────────────────

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error'
export type AsyncStatus      = 'idle' | 'loading' | 'success' | 'error'

export interface LoadingStep {
  id:     string
  label:  string
  done:   boolean
  status: 'pending' | 'active' | 'done'
}
