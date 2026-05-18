import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// ─── Environment validation ─────────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || supabaseUrl === 'https://your-project-ref.supabase.co') {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL is not set. ' +
      'Copy .env.example → .env.local and fill in your project URL.'
  )
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-public-key-here') {
  console.warn(
    '[Supabase] VITE_SUPABASE_ANON_KEY is not set. ' +
      'Copy .env.example → .env.local and fill in your anon key.'
  )
}

// ─── Client ─────────────────────────────────────────────────────────────────

export const supabase = createClient<Database>(
  supabaseUrl ?? '',
  supabaseAnonKey ?? '',
  {
    auth: {
      persistSession: false, // No auth in this version; remove when you add Supabase Auth
    },
  }
)

// ─── Health check helper (call from App.tsx if needed) ──────────────────────

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('event_plans').select('id').limit(1)
    return error === null
  } catch {
    return false
  }
}
