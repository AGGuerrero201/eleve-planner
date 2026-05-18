// ─── Expanded Event Plan (returned by Edge Function) ───────────────────────

export interface VendorIdea {
  category: string      // e.g. "Catering", "Florals", "AV & Lighting"
  suggestions: string[] // 2-3 vendor type suggestions
  estimatedCost: string // e.g. "$800 – $1,200"
}

export interface StaffingRole {
  role: string          // e.g. "Event Coordinator"
  count: number
  notes: string
}

export interface AlcoholEstimate {
  servingsPerPerson: number
  totalBottles: string
  recommendations: string[]
  estimatedCost: string
}

export interface TimelineItem {
  time: string          // e.g. "5:30 PM"
  activity: string
  responsible: string   // e.g. "Staff", "Vendor", "Property Manager"
}

export interface EventPlan {
  // Identity
  title: string
  tagline: string

  // Narrative
  overview: string
  theme: string

  // Operations
  timeline: TimelineItem[]
  catering: string[]
  entertainment: string[]
  logistics: string[]
  budgetBreakdown: string[]

  // New richer fields
  vendorIdeas: VendorIdea[]
  staffing: StaffingRole[]
  alcoholEstimate: AlcoholEstimate | null   // null when alcohol === 'No alcohol'
  setupLogistics: string[]
  residentEmail: ResidentEmail
  flyerHeadline: string
  proTip: string
}

export interface ResidentEmail {
  subject: string
  body: string          // Plain text, ~150 words
}

export interface SavedEvent extends EventPlan {
  id: string
  meta: EventFormData
  savedAt: string
}

// ─── Form ───────────────────────────────────────────────────────────────────

export type VenueSetting = 'Indoor' | 'Outdoor' | 'Indoor & Outdoor'
export type AlcoholService = 'Full bar' | 'Wine & beer only' | 'No alcohol'
export type ResidentDemo =
  | 'Young professionals (25–35)'
  | 'Mixed ages, family-oriented'
  | 'Mature residents (50+)'
  | 'Mixed demographic'
export type Season = 'Spring' | 'Summer' | 'Fall / Autumn' | 'Winter'
export type Budget =
  | 'Under $1,000'
  | '$1,000 – $2,500'
  | '$2,500 – $5,000'
  | '$5,000 – $10,000'
  | '$10,000 – $25,000'
  | '$25,000+'
export type Attendance =
  | '10 – 25 residents'
  | '25 – 50 residents'
  | '50 – 100 residents'
  | '100 – 200 residents'
  | '200+ residents'

export interface EventFormData {
  eventType: string
  budget: Budget | ''
  attendance: Attendance | ''
  season: Season | ''
  venue: VenueSetting
  alcohol: AlcoholService
  demographic: ResidentDemo
  notes: string
}

// ─── Edge Function request / response ───────────────────────────────────────

export interface GenerateEventRequest {
  formData: EventFormData
}

export interface GenerateEventResponse {
  plan: EventPlan
  generatedAt: string   // ISO timestamp from the Edge Function
  model: string         // e.g. "claude-sonnet-4-20250514"
}

export interface EdgeFunctionError {
  error: string
  code?: string
  retryable: boolean
}

// ─── UI ─────────────────────────────────────────────────────────────────────

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error'
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  status: AsyncStatus
  error: string | null
}

export interface SupabaseErrorShape {
  message: string
  details?: string
  hint?: string
  code?: string
}

// ─── Loading step (for animated progress UI) ────────────────────────────────

export interface LoadingStep {
  id: string
  label: string
  status: 'pending' | 'active' | 'done'
}
