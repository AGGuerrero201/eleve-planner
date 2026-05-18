import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle2, X } from 'lucide-react'
import { checkSupabaseConnection } from '@/lib/supabase'
import { cn } from '@/lib/utils'

/**
 * Renders a subtle banner if the Supabase connection check fails.
 * Useful during development to catch misconfigured env vars early.
 * Renders nothing once dismissed or if the connection is healthy.
 */
export function SupabaseStatus() {
  const [state, setState] = useState<'checking' | 'ok' | 'error'>('checking')
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let mounted = true
    checkSupabaseConnection().then((ok) => {
      if (mounted) setState(ok ? 'ok' : 'error')
    })
    return () => { mounted = false }
  }, [])

  if (state !== 'error' || dismissed) return null

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 text-[0.78rem] font-light',
        'bg-amber-50 border-b border-amber-200 text-amber-800'
      )}
      role="alert"
    >
      <AlertTriangle size={14} className="shrink-0 text-amber-500" />
      <span className="flex-1">
        Supabase is not connected. Check your{' '}
        <code className="font-mono bg-amber-100 px-1 rounded text-[0.75rem]">
          .env.local
        </code>{' '}
        environment variables (
        <code className="font-mono bg-amber-100 px-1 rounded text-[0.75rem]">
          VITE_SUPABASE_URL
        </code>{' '}
        and{' '}
        <code className="font-mono bg-amber-100 px-1 rounded text-[0.75rem]">
          VITE_SUPABASE_ANON_KEY
        </code>
        ).
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded hover:bg-amber-100 transition-colors"
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  )
}

/**
 * Small inline indicator used in footers / dev toolbars.
 */
export function SupabasePill({ connected }: { connected: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[0.7rem] px-2 py-0.5 rounded-sm border font-medium',
        connected
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-red-50 border-red-200 text-red-600'
      )}
    >
      {connected ? (
        <CheckCircle2 size={10} />
      ) : (
        <AlertTriangle size={10} />
      )}
      Supabase {connected ? 'connected' : 'disconnected'}
    </span>
  )
}
