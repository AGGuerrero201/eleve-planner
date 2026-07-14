/**
 * experience/ExperienceBar.tsx
 *
 * The persistent control bar shown beneath the navbar whenever
 * Experience Elevé is active. Provides the always-available controls
 * the walkthrough promises: Restart Experience, Reset Experience Data
 * (with an inline two-tap confirmation), and Exit.
 *
 * Hover and focus states are pure CSS (Tailwind), keeping keyboard
 * and pointer affordances identical.
 */

import { useEffect, useState } from 'react'
import { RotateCcw, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useExperience } from './ExperienceContext'

const QUIET_BTN = cn(
  'text-[0.62rem] font-medium tracking-[0.10em] uppercase px-2.5 py-1.5 rounded-sm',
  'transition-colors duration-150',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
)

export function ExperienceBar() {
  const { active, restart, resetData, exit } = useExperience()
  const [confirmingReset, setConfirmingReset] = useState(false)

  // Auto-cancel the reset confirmation after a few seconds
  useEffect(() => {
    if (!confirmingReset) return
    const t = window.setTimeout(() => setConfirmingReset(false), 4000)
    return () => window.clearTimeout(t)
  }, [confirmingReset])

  if (!active) return null

  const handleReset = () => {
    if (!confirmingReset) {
      setConfirmingReset(true)
      return
    }
    setConfirmingReset(false)
    resetData()
  }

  return (
    <div
      className="sticky top-[60px] z-40 border-b border-gold/25 bg-charcoal-mid"
      role="region"
      aria-label="Experience Elevé controls"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 py-2">
          {/* Label */}
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles size={12} strokeWidth={1.5} className="text-gold shrink-0" aria-hidden="true" />
            <p className="text-[0.62rem] font-medium uppercase tracking-[0.20em] text-gold-light/85 truncate">
              Experience Elevé
              <span className="hidden md:inline font-light normal-case tracking-[0.02em] ml-2 text-white/35">
                · You{'\u2019'}re exploring the live product with sample community data
              </span>
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={restart}
              className={cn(QUIET_BTN, 'flex items-center gap-1.5 text-gold-light/80 hover:text-gold-light')}
            >
              <RotateCcw size={11} strokeWidth={1.5} aria-hidden="true" />
              <span className="hidden sm:inline">Restart Experience</span>
              <span className="inline sm:hidden">Restart</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className={cn(
                QUIET_BTN,
                confirmingReset
                  ? 'bg-gold/85 text-white'
                  : 'text-white/45 hover:text-white/75',
              )}
            >
              {confirmingReset ? 'Confirm reset?' : (
                <>
                  <span className="hidden sm:inline">Reset Experience Data</span>
                  <span className="inline sm:hidden">Reset Data</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={exit}
              className={cn(QUIET_BTN, 'text-white/35 hover:text-white/65')}
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
