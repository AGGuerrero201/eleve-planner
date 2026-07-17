/**
 * components/onboarding/OnboardingOverlay.tsx
 *
 * Premium first-visit overlay for Elevé.
 *
 * Visual behaviour:
 *   - Dashboard remains visible behind a warm 28% dim + 1.5px blur
 *   - Centered invitation card — not full-screen, not a modal takeover
 *   - On mobile: anchors from the bottom as a bottom sheet
 *   - Dismisses via either CTA; never appears again (localStorage)
 *
 * After "Generate a Sample Event":
 *   - Overlay fades out
 *   - EventTypePicker slides in (same position, no page navigation)
 *   - User taps one tile → generation begins immediately
 *
 * After "Explore on my own":
 *   - Overlay fades out
 *   - A subtle dismissable banner appears on the dashboard
 */

import { useState, useEffect } from 'react'
import { ArrowRight, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OnboardingChoice } from '@/hooks/useOnboarding'

// ─── Event type tiles ─────────────────────────────────────────────────────────

interface EventTile {
  label:    string
  emoji:    string
  formType: string   // maps to EventFormData.eventType
}

const EVENT_TILES: EventTile[] = [
  { label: 'Cocktail Reception', emoji: '🍸', formType: 'Cocktail Reception'    },
  { label: 'Pool Party',         emoji: '🏊', formType: 'Pool Party'            },
  { label: 'Wine Tasting',       emoji: '🍷', formType: 'Wine & Cheese Evening' },
  { label: 'Wellness Event',     emoji: '🧘', formType: 'Wellness & Yoga Morning'},
  { label: 'Family Event',       emoji: '👨‍👩‍👧', formType: 'Family Fun Day'        },
  { label: 'Holiday Celebration',emoji: '🎉', formType: 'Holiday Party'         },
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface OnboardingOverlayProps {
  onDismiss:  (choice: OnboardingChoice) => void
  onGenerate: (eventType: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OnboardingOverlay({ onDismiss, onGenerate }: OnboardingOverlayProps) {
  const [phase, setPhase]     = useState<'intro' | 'picker'>('intro')
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  // Entrance animation — slight delay so dashboard renders first
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120)
    return () => clearTimeout(t)
  }, [])

  function handleGenerate() {
    setPhase('picker')
  }

  function handleExplore() {
    setLeaving(true)
    setTimeout(() => onDismiss('explore'), 280)
  }

  function handleTileSelect(tile: EventTile) {
    setLeaving(true)
    setTimeout(() => {
      onDismiss('generate')
      onGenerate(tile.formType)
    }, 200)
  }

  return (
    <>
      {/* ── Backdrop — dims dashboard, keeps it visible ───────────────── */}
      <div
        className={cn(
          'fixed inset-0 z-40 transition-all duration-300',
          visible && !leaving ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          backgroundColor: 'rgba(28, 24, 20, 0.28)',
          backdropFilter:  'blur(1.5px)',
          WebkitBackdropFilter: 'blur(1.5px)',
        }}
        // Clicking backdrop = explore
        onClick={handleExplore}
      />

      {/* ── Invitation card ───────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed z-50 inset-x-0',
          // Mobile: bottom sheet
          'bottom-0 sm:bottom-auto',
          // Desktop: vertically centered, slightly above middle
          'sm:top-[38%] sm:-translate-y-1/2',
          'flex justify-center items-end sm:items-center px-0 sm:px-6',
          'pointer-events-none',
        )}
      >
        <div
          className={cn(
            'pointer-events-auto w-full sm:max-w-[480px]',
            // Mobile: rounded top, full width
            'rounded-t-2xl sm:rounded-sm',
            // Transition
            'transition-all duration-300 ease-out',
            visible && !leaving
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 sm:translate-y-2'
          )}
          style={{
            backgroundColor: 'var(--off-white, #FAFAF8)',
            border:          '0.5px solid rgba(184,149,90,0.30)',
            boxShadow:       '0 16px 56px rgba(0,0,0,0.22)',
          }}
          // Prevent backdrop click-through
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile drag handle */}
          <div className="sm:hidden flex justify-center pt-3 pb-0 shrink-0" aria-hidden>
            <div
              className="w-10 h-1 rounded-full"
              style={{ backgroundColor: 'rgba(180,166,150,0.40)' }}
            />
          </div>

          {/* Gold top border — desktop only */}
          <div
            className="hidden sm:block h-px"
            style={{ backgroundColor: 'rgba(184,149,90,0.45)' }}
          />

          {/* Card content */}
          <div className="px-8 py-8 sm:py-9">
            {phase === 'intro' ? (
              <IntroPhase
                onGenerate={handleGenerate}
                onExplore={handleExplore}
              />
            ) : (
              <PickerPhase onSelect={handleTileSelect} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Intro phase ──────────────────────────────────────────────────────────────

function IntroPhase({
  onGenerate,
  onExplore,
}: {
  onGenerate: () => void
  onExplore:  () => void
}) {
  return (
    <div>
      {/* Eyebrow */}
      <p
        className="text-[0.58rem] font-medium uppercase mb-5"
        style={{ letterSpacing: '0.26em', color: 'var(--gold, #B8955A)' }}
      >
        Elevé Demo
      </p>

      {/* Headline */}
      <h2
        className="font-serif font-light leading-snug mb-4"
        style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.75rem)', color: 'var(--charcoal, #1C1C1E)' }}
      >
        Your first event plan is<br />60 seconds away.
      </h2>

      {/* Body */}
      <p
        className="font-light leading-relaxed mb-7"
        style={{ fontSize: '0.845rem', color: 'var(--muted, #8A8580)' }}
      >
        Generate a sample event and see how Elevé creates timelines, budgets,
        staffing plans, resident communications, and vendor recommendations.
      </p>

      {/* Thin rule */}
      <div className="flex items-center gap-4 mb-7">
        <div className="h-px flex-1" style={{ backgroundColor: 'rgba(184,149,90,0.20)' }} />
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'rgba(184,149,90,0.35)' }} />
        <div className="h-px flex-1" style={{ backgroundColor: 'rgba(184,149,90,0.20)' }} />
      </div>

      {/* Primary CTA */}
      <button
        type="button"
        onClick={onGenerate}
        className={cn(
          'w-full flex items-center justify-center gap-2.5',
          'text-[0.8rem] font-medium tracking-[0.08em] uppercase',
          'px-8 py-3.5 rounded-sm mb-3',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
        )}
        style={{
          backgroundColor: 'var(--charcoal, #1C1C1E)',
          color:           'var(--gold-light, #E8D5B0)',
          border:          '1px solid rgba(184,149,90,0.30)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(184,149,90,0.60)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(184,149,90,0.30)'
        }}
      >
        <Zap size={14} strokeWidth={1.5} style={{ color: 'var(--gold, #B8955A)' }} />
        Generate a Sample Event
        <ArrowRight size={13} strokeWidth={1.5} />
      </button>

      {/* Secondary CTA */}
      <button
        type="button"
        onClick={onExplore}
        className="w-full text-center text-[0.72rem] font-light py-2 transition-colors duration-150"
        style={{ color: 'var(--stone, #8C8478)', letterSpacing: '0.04em' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--charcoal, #1C1C1E)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--stone, #8C8478)' }}
      >
        Explore on my own
      </button>
    </div>
  )
}

// ─── Picker phase ─────────────────────────────────────────────────────────────

function PickerPhase({ onSelect }: { onSelect: (tile: EventTile) => void }) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleTap(tile: EventTile) {
    if (selected) return   // prevent double-tap
    setSelected(tile.formType)
    // Brief selected-state flash before dismiss
    setTimeout(() => onSelect(tile), 180)
  }

  return (
    <div>
      {/* Eyebrow */}
      <p
        className="text-[0.58rem] font-medium uppercase mb-4"
        style={{ letterSpacing: '0.26em', color: 'var(--gold, #B8955A)' }}
      >
        Choose an event type
      </p>

      {/* Headline */}
      <h2
        className="font-serif font-light leading-snug mb-6"
        style={{ fontSize: 'clamp(1.2rem, 3vw, 1.45rem)', color: 'var(--charcoal, #1C1C1E)' }}
      >
        What would you like to plan?
      </h2>

      {/* Event type tiles — 2×3 grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {EVENT_TILES.map((tile) => {
          const isSelected = selected === tile.formType
          return (
            <button
              key={tile.formType}
              type="button"
              onClick={() => handleTap(tile)}
              disabled={!!selected}
              className={cn(
                'flex flex-col items-center gap-2 px-3 py-4 rounded-sm border',
                'transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                'disabled:cursor-default',
                isSelected
                  ? 'border-gold/60 bg-charcoal text-gold-light'
                  : 'border-border bg-warm-gray text-charcoal hover:border-gold/40 hover:bg-white'
              )}
              style={isSelected ? {
                backgroundColor: 'var(--charcoal)',
                borderColor:     'rgba(184,149,90,0.60)',
              } : undefined}
            >
              <span
                className="text-xl leading-none"
                role="img"
                aria-hidden
              >
                {tile.emoji}
              </span>
              <span
                className="text-[0.7rem] font-light text-center leading-snug"
                style={{ color: isSelected ? 'var(--gold-light)' : 'var(--charcoal-light)' }}
              >
                {tile.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Hint */}
      <p
        className="text-center text-[0.68rem] font-light mt-4"
        style={{ color: 'var(--stone, #8C8478)' }}
      >
        Tap to generate immediately, no other setup required.
      </p>
    </div>
  )
}
