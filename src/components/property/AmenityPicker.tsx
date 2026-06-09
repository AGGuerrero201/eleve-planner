/**
 * components/property/AmenityPicker.tsx
 *
 * Multi-select grid for property amenities.
 * Luxury SaaS aesthetic — warm checkbox tiles.
 */

import { cn } from '@/lib/utils'
import { type Amenity, AMENITY_LABELS } from '@/types/property'

const ALL_AMENITIES: Amenity[] = [
  'rooftop_terrace',
  'pool_deck',
  'resident_lounge',
  'fitness_center',
  'coworking_space',
  'yoga_studio',
  'private_dining',
  'screening_room',
  'spa',
  'golf_simulator',
  'game_room',
  'outdoor_kitchen',
  'childrens_playroom',
  'dog_run',
  'bocce_court',
  'wine_cellar',
]

interface AmenityPickerProps {
  value:    Amenity[]
  onChange: (amenities: Amenity[]) => void
}

export function AmenityPicker({ value, onChange }: AmenityPickerProps) {
  function toggle(amenity: Amenity) {
    if (value.includes(amenity)) {
      onChange(value.filter((a) => a !== amenity))
    } else {
      onChange([...value, amenity])
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {ALL_AMENITIES.map((amenity) => {
        const selected = value.includes(amenity)
        return (
          <button
            key={amenity}
            type="button"
            onClick={() => toggle(amenity)}
            className={cn(
              'text-left px-3.5 py-2.5 rounded-sm border transition-all duration-150',
              'text-[0.78rem] font-light leading-snug',
              selected
                ? 'border-gold/50 bg-gold-ghost text-charcoal'
                : 'border-border bg-warm-gray text-charcoal-light hover:border-gold/30 hover:bg-gold-ghost/50'
            )}
          >
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  'w-3.5 h-3.5 rounded-sm border flex-shrink-0 flex items-center justify-center',
                  selected ? 'bg-gold border-gold' : 'border-stone-light bg-white'
                )}
              >
                {selected && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {AMENITY_LABELS[amenity]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
