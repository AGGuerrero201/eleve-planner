/**
 * StepBudget.tsx — Step 4 of the PlannerWizard
 *
 * Collects three fields that define scale and timing:
 *   budget      → EventFormData.budget
 *   attendance  → EventFormData.attendance
 *   season      → EventFormData.season
 *
 * All three are required before Next is enabled.
 * Uses the tile/pill selection pattern consistent with the Elevé design system.
 */

import type { Budget, Attendance, Season } from '@/types'
import { BUDGETS, ATTENDANCES, SEASONS } from '@/lib/constants'
import { cn } from '@/lib/utils'

// ─── Props ────────────────────────────────────────────────────────────────────

interface StepBudgetProps {
  budget:     Budget | ''
  attendance: Attendance | ''
  season:     Season | ''
  onBudget:     (v: Budget)     => void
  onAttendance: (v: Attendance) => void
  onSeason:     (v: Season)     => void
}

// ─── Budget meta — adds a per-person hint beneath each option ─────────────────

const BUDGET_META: Record<Budget, string> = {
  'Under $1,000':       'Approx. $20–80 / person',
  '$1,000 – $2,500':    'Approx. $40–100 / person',
  '$2,500 – $5,000':    'Approx. $50–200 / person',
  '$5,000 – $10,000':   'Approx. $100–400 / person',
  '$10,000 – $25,000':  'Approx. $200–1,000 / person',
  '$25,000+':           'Approx. $500+ / person',
}

// ─── Season icons — single character, no library dependency ──────────────────

const SEASON_GLYPHS: Record<Season, string> = {
  'Spring':       '❧',
  'Summer':       '◎',
  'Fall / Autumn': '◈',
  'Winter':       '❄',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StepBudget({
  budget,
  attendance,
  season,
  onBudget,
  onAttendance,
  onSeason,
}: StepBudgetProps) {
  return (
    <div className="flex flex-col gap-7">

      {/* ── Budget ─────────────────────────────────────────────────────── */}
      <div>
        <FieldLabel required filled={!!budget}>
          Estimated Budget
        </FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BUDGETS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => onBudget(b)}
              className={cn(
                'text-left px-4 py-3 rounded-sm border transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                budget === b
                  ? 'border-gold bg-gold/6 text-charcoal'
                  : 'border-border bg-white text-charcoal hover:border-gold/40 hover:bg-warm-gray'
              )}
            >
              <span className={cn(
                'block text-[0.82rem] font-medium leading-snug mb-0.5',
                budget === b ? 'text-charcoal' : 'text-charcoal'
              )}>
                {b}
              </span>
              <span className="block text-[0.68rem] font-light text-muted leading-none">
                {BUDGET_META[b]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Attendance ─────────────────────────────────────────────────── */}
      <div>
        <FieldLabel required filled={!!attendance}>
          Expected Attendance
        </FieldLabel>
        <div className="flex flex-wrap gap-2">
          {ATTENDANCES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => onAttendance(a)}
              className={cn(
                'px-4 py-2 rounded-sm border text-[0.8rem] font-light transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                attendance === a
                  ? 'border-gold bg-gold/6 text-charcoal font-medium'
                  : 'border-border bg-white text-muted hover:border-gold/40 hover:text-charcoal hover:bg-warm-gray'
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* ── Season ─────────────────────────────────────────────────────── */}
      <div>
        <FieldLabel required filled={!!season}>
          Season
        </FieldLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SEASONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSeason(s)}
              className={cn(
                'flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-sm border transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                season === s
                  ? 'border-gold bg-gold/6 text-charcoal'
                  : 'border-border bg-white text-muted hover:border-gold/40 hover:text-charcoal hover:bg-warm-gray'
              )}
            >
              <span className="text-[1.1rem] leading-none" aria-hidden>
                {SEASON_GLYPHS[s]}
              </span>
              <span className={cn(
                'text-[0.75rem] font-light leading-none',
                season === s ? 'font-medium text-charcoal' : 'text-muted'
              )}>
                {s}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── FieldLabel ───────────────────────────────────────────────────────────────

function FieldLabel({
  children,
  required,
  filled,
}: {
  children: React.ReactNode
  required?: boolean
  filled?: boolean
}) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="text-[0.68rem] font-medium tracking-[0.12em] uppercase text-charcoal-light">
        {children}
      </span>
      {required && !filled && (
        <span className="text-[0.62rem] text-muted/60 font-light normal-case tracking-normal">
          required
        </span>
      )}
      {filled && (
        <span className="text-[0.62rem] text-green-600 font-medium">✓</span>
      )}
    </div>
  )
}
