/**
 * components/onboarding/SampleEventBanner.tsx
 *
 * Subtle dismissable banner shown on the dashboard after "Explore on my own."
 * Only shown on the dashboard — does not follow users to other pages.
 * Dismissed permanently via localStorage.
 */

import { useState } from 'react'
import { X, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const BANNER_DISMISSED_KEY = 'eleve_sample_banner_dismissed'

interface SampleEventBannerProps {
  onGenerate: () => void
}

export function SampleEventBanner({ onGenerate }: SampleEventBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    try { return !!localStorage.getItem(BANNER_DISMISSED_KEY) } catch { return false }
  })
  const [leaving, setLeaving] = useState(false)

  if (dismissed) return null

  function handleDismiss() {
    setLeaving(true)
    setTimeout(() => {
      try { localStorage.setItem(BANNER_DISMISSED_KEY, '1') } catch { /* */ }
      setDismissed(true)
    }, 220)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-sm px-4 py-3 mb-8',
        'transition-all duration-220',
        leaving ? 'opacity-0 -translate-y-1' : 'opacity-100 translate-y-0'
      )}
      style={{
        backgroundColor: 'var(--gold-ghost, #FBF7F2)',
        border:          '0.5px solid rgba(184,149,90,0.25)',
      }}
    >
      {/* Gold accent dot */}
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: 'rgba(184,149,90,0.55)' }}
        aria-hidden
      />

      {/* Message */}
      <p
        className="text-[0.78rem] font-light flex-1 leading-snug"
        style={{ color: 'var(--charcoal-light, #4A4A50)' }}
      >
        When you're ready:
        <button
          type="button"
          onClick={onGenerate}
          className="inline-flex items-center gap-1 ml-1 font-medium transition-colors duration-150"
          style={{ color: 'var(--gold, #B8955A)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold-dark, #9A7A42)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--gold, #B8955A)' }}
        >
          generate a sample event to see what Elevé can do
          <ArrowRight size={11} strokeWidth={1.5} />
        </button>
      </p>

      {/* Dismiss */}
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 p-1 rounded-sm transition-colors duration-150"
        style={{ color: 'var(--stone, #8C8478)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--charcoal, #1C1C1E)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--stone, #8C8478)' }}
        aria-label="Dismiss"
      >
        <X size={13} strokeWidth={1.5} />
      </button>
    </div>
  )
}
