/**
 * experience/ExperienceGuide.tsx
 *
 * The floating concierge card that narrates the Experience Elevé
 * walkthrough. Fixed to the lower-right on desktop and the bottom edge
 * on mobile; sits above modals (z-60) so guidance remains visible while
 * the user edits an event.
 *
 * Behaviours:
 *   - Steps with a CTA advance (and navigate) on click.
 *   - Steps waiting on a real user action show a hint plus a quiet
 *     "skip this step" escape hatch — the tour can never dead-end.
 *   - If the user wanders off the step's route, the card offers
 *     "Take me there" instead of the step CTA.
 *
 * Hover and focus states are pure CSS (Tailwind), keeping keyboard
 * and pointer affordances identical.
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useExperience } from './ExperienceContext'

const CTA_CLASSES = cn(
  'w-full flex items-center justify-center gap-2',
  'text-[0.7rem] font-medium tracking-[0.10em] uppercase',
  'px-5 py-2.5 rounded-sm transition-colors duration-200',
  'bg-gold hover:bg-gold-dark text-white',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/60',
)

export function ExperienceGuide() {
  const { active, step, stepIndex, stepCount, next, skipTour } = useExperience()
  const location = useLocation()
  const navigate = useNavigate()

  if (!active || !step) return null

  const onRoute  = location.pathname === step.route
  const progress = ((stepIndex + 1) / stepCount) * 100
  const isLast   = stepIndex === stepCount - 1

  const ctaLabel =
    step.cta?.to && location.pathname === step.cta.to
      ? 'Continue'
      : step.cta?.label ?? (isLast ? 'Finish' : 'Continue')

  const handleCta = () => {
    if (step.cta?.to && location.pathname !== step.cta.to) {
      navigate(step.cta.to)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    next()
  }

  const handleReturn = () => {
    navigate(step.route)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <aside
      className={cn(
        'fixed z-[60] animate-fade-up',
        'inset-x-3 bottom-3',
        'sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[360px]',
      )}
      role="complementary"
      aria-label="Experience Elevé walkthrough"
    >
      <div
        className="bg-charcoal rounded-sm overflow-hidden border border-gold/35"
        style={{ boxShadow: '0 12px 44px rgba(0,0,0,0.30)' }}
      >
        {/* Progress hairline */}
        <div className="h-[2px] bg-white/10">
          <div
            className="h-full bg-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-5 pt-4 pb-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[0.58rem] font-medium uppercase tracking-[0.22em] text-gold/75 mb-0.5">
                {step.eyebrow}
              </p>
              <p className="text-[0.6rem] font-light tabular-nums tracking-[0.08em] text-white/30">
                Step {stepIndex + 1} of {stepCount}
              </p>
            </div>
            <button
              type="button"
              onClick={skipTour}
              aria-label="Skip the walkthrough"
              className={cn(
                'p-1.5 -m-1 rounded-sm text-white/30 hover:text-white/65',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
              )}
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* Title */}
          <h3 className="font-serif text-[1.15rem] font-light leading-snug text-gold-light mb-2">
            {step.title}
          </h3>

          {/* Body */}
          <p className="text-[0.78rem] font-light leading-[1.75] text-white/55 mb-4">
            {step.body}
          </p>

          {/* Actions */}
          {!onRoute ? (
            <button type="button" onClick={handleReturn} className={CTA_CLASSES}>
              Take me there
              <ArrowRight size={12} strokeWidth={1.5} />
            </button>
          ) : step.advanceOn ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.68rem] font-light italic text-gold/65">
                {step.hint}
              </p>
              <button
                type="button"
                onClick={next}
                className={cn(
                  'shrink-0 px-1.5 py-1 rounded-sm text-[0.62rem] font-light tracking-[0.04em]',
                  'text-white/30 hover:text-white/60 transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                )}
              >
                Skip this step
              </button>
            </div>
          ) : (
            <button type="button" onClick={handleCta} className={CTA_CLASSES}>
              {ctaLabel}
              <ArrowRight size={12} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
