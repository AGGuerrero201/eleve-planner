/**
 * components/property/ProfileCompletenessBar.tsx
 */

import { cn } from '@/lib/utils'

interface ProfileCompletenessBarProps {
  score:      number   // 0–100
  className?: string
  showLabel?: boolean
}

export function ProfileCompletenessBar({
  score,
  className,
  showLabel = true,
}: ProfileCompletenessBarProps) {
  const label =
    score < 40  ? 'Getting started' :
    score < 70  ? 'Good foundation' :
    score < 100 ? 'Nearly complete' :
                  'Complete'

  return (
    <div className={cn('space-y-1.5', className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <p
            className="text-[0.68rem] font-medium uppercase"
            style={{ letterSpacing: '0.12em', color: 'var(--stone)' }}
          >
            Profile completeness
          </p>
          <span
            className="text-[0.68rem] font-light"
            style={{ color: score === 100 ? 'var(--gold)' : 'var(--muted)' }}
          >
            {label}
          </span>
        </div>
      )}
      <div
        className="h-0.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--stone-pale)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${score}%`,
            backgroundColor: score === 100 ? 'var(--gold)' : 'rgba(184,149,90,0.55)',
          }}
        />
      </div>
    </div>
  )
}
