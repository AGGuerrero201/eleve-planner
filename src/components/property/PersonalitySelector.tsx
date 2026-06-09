/**
 * components/property/PersonalitySelector.tsx
 *
 * Pill-style multi-select for community personality tags.
 */

import { cn } from '@/lib/utils'
import { type CommunityPersonality, COMMUNITY_PERSONALITY_LABELS } from '@/types/property'

const ALL_PERSONALITIES: CommunityPersonality[] = [
  'social',
  'wellness',
  'luxury',
  'networking',
  'family',
  'cultural',
  'fitness',
  'pet_friendly',
]

interface PersonalitySelectorProps {
  value:    CommunityPersonality[]
  onChange: (personalities: CommunityPersonality[]) => void
  max?:     number
}

export function PersonalitySelector({
  value,
  onChange,
  max = 3,
}: PersonalitySelectorProps) {
  function toggle(p: CommunityPersonality) {
    if (value.includes(p)) {
      onChange(value.filter((v) => v !== p))
    } else if (value.length < max) {
      onChange([...value, p])
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {ALL_PERSONALITIES.map((p) => {
          const selected = value.includes(p)
          const disabled = !selected && value.length >= max
          return (
            <button
              key={p}
              type="button"
              onClick={() => toggle(p)}
              disabled={disabled}
              className={cn(
                'px-3.5 py-1.5 rounded-sm border text-[0.75rem] font-medium tracking-[0.05em]',
                'transition-all duration-150',
                selected
                  ? 'bg-charcoal border-charcoal text-gold'
                  : disabled
                  ? 'border-border bg-warm-gray text-muted/40 cursor-not-allowed'
                  : 'border-border bg-warm-gray text-charcoal-light hover:border-charcoal/40 hover:text-charcoal'
              )}
            >
              {COMMUNITY_PERSONALITY_LABELS[p]}
            </button>
          )
        })}
      </div>
      {max && (
        <p className="text-[0.7rem] font-light text-muted mt-2">
          Select up to {max}
        </p>
      )}
    </div>
  )
}
