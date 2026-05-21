// ─── Database types (v2) ────────────────────────────────────────────────────
// Mirrors supabase/schema.sql v2.
// Regenerate from a live project:
//   npx supabase gen types typescript --project-id <ref> > src/types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      event_plans: {
        Row: {
          id: string
          created_at: string
          title: string
          tagline: string
          overview: string
          theme: string
          pro_tip: string
          catering: string[]
          entertainment: string[]
          logistics: string[]
          budget_breakdown: string[]
          setup_logistics: string[]
          flyer_headline: string
          timeline: Json          // TimelineItem[]
          vendor_ideas: Json      // VendorIdea[]
          staffing: Json          // StaffingRole[]
          alcohol_estimate: Json | null
          resident_email: Json    // ResidentEmail
          meta: Json              // EventFormData
          workflow_status: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          tagline: string
          overview: string
          theme: string
          pro_tip: string
          catering: string[]
          entertainment: string[]
          logistics: string[]
          budget_breakdown: string[]
          setup_logistics?: string[]
          flyer_headline?: string
          timeline?: Json
          vendor_ideas?: Json
          staffing?: Json
          alcohol_estimate?: Json | null
          resident_email?: Json
          meta: Json
          workflow_status?: string
        }
        Update: Partial<Database['public']['Tables']['event_plans']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type EventPlanRow    = Database['public']['Tables']['event_plans']['Row']
export type EventPlanInsert = Database['public']['Tables']['event_plans']['Insert']