/**
 * components/property/PropertyProfileCard.tsx
 *
 * Compact display card for the active property profile.
 * Used on the Dashboard and as a sidebar read view.
 */

import { useNavigate } from 'react-router-dom'
import { Settings, MapPin, Users, Sparkles } from 'lucide-react'
import { useProperty } from '@/context/PropertyContext'
import { ProfileCompletenessBar } from './ProfileCompletenessBar'
import {
  PROPERTY_TYPE_LABELS,
  COMMUNITY_PERSONALITY_LABELS,
  AMENITY_LABELS,
  LUXURY_LEVEL_LABELS,
} from '@/types/property'

export function PropertyProfileCard() {
  const navigate = useNavigate()
  const { profile, completionScore, isSufficient, loading } = useProperty()

  if (loading) {
    return (
      <div
        className="rounded-sm px-5 py-4 animate-pulse"
        style={{
          backgroundColor: 'var(--card-bg)',
          border: 'var(--card-border)',
          height: '96px',
        }}
      />
    )
  }

  // No profile yet — prompt to set up
  if (!profile) {
    return (
      <div
        className="rounded-sm px-5 py-5"
        style={{
          backgroundColor: 'var(--gold-ghost)',
          border: '0.5px solid rgba(184,149,90,0.25)',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className="text-[0.6rem] font-medium uppercase mb-1.5"
              style={{ letterSpacing: '0.18em', color: 'var(--gold)' }}
            >
              Property Intelligence
            </p>
            <p
              className="text-[0.82rem] font-light leading-relaxed"
              style={{ color: 'var(--charcoal-light)' }}
            >
              Set up your property profile to unlock event plans personalized
              to your community.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/property')}
          className="mt-4 text-[0.72rem] font-medium tracking-[0.08em] uppercase transition-colors duration-150"
          style={{ color: 'var(--gold)' }}
        >
          Set up profile →
        </button>
      </div>
    )
  }

  return (
    <div
      className="rounded-sm px-5 py-4"
      style={{
        backgroundColor: 'var(--card-bg)',
        border: 'var(--card-border)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p
            className="text-[0.6rem] font-medium uppercase mb-1"
            style={{ letterSpacing: '0.18em', color: 'var(--stone)' }}
          >
            Active property
          </p>
          <p
            className="font-serif font-light text-[1.05rem] leading-snug text-charcoal truncate"
          >
            {profile.propertyName}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/property')}
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-sm transition-colors duration-150 hover:bg-warm-gray"
          style={{ color: 'var(--stone)' }}
          title="Edit property profile"
        >
          <Settings size={13} strokeWidth={1.5} />
        </button>
      </div>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Chip icon={<MapPin size={10} strokeWidth={1.5} />}>
          {profile.city}, {profile.state}
        </Chip>
        {profile.propertyType && (
          <Chip>{PROPERTY_TYPE_LABELS[profile.propertyType] ?? profile.propertyType}</Chip>
        )}
        {profile.luxuryLevel && (
          <Chip icon={<Sparkles size={10} strokeWidth={1.5} />}>
            {LUXURY_LEVEL_LABELS[profile.luxuryLevel]}
          </Chip>
        )}
        {profile.residentDemographic && (
          <Chip icon={<Users size={10} strokeWidth={1.5} />}>
            {profile.residentDemographic}
          </Chip>
        )}
      </div>

      {/* Personality tags */}
      {profile.communityPersonality?.length ? (
        <div className="flex flex-wrap gap-1 mb-3">
          {profile.communityPersonality.slice(0, 3).map((p) => (
            <span
              key={p}
              className="text-[0.62rem] font-medium tracking-[0.06em] uppercase px-2 py-0.5 rounded-sm"
              style={{
                backgroundColor: 'var(--charcoal)',
                color: 'var(--gold-light)',
              }}
            >
              {COMMUNITY_PERSONALITY_LABELS[p]}
            </span>
          ))}
        </div>
      ) : null}

      {/* Amenities preview */}
      {profile.amenities?.length ? (
        <p
          className="text-[0.72rem] font-light mb-3 leading-snug"
          style={{ color: 'var(--muted)' }}
        >
          {profile.amenities
            .slice(0, 4)
            .map((a) => AMENITY_LABELS[a] ?? a)
            .join(' · ')}
          {profile.amenities.length > 4 && (
            <span> +{profile.amenities.length - 4} more</span>
          )}
        </p>
      ) : null}

      {/* Completeness bar */}
      <ProfileCompletenessBar score={completionScore} />

      {/* AI ready indicator */}
      {isSufficient && (
        <p
          className="text-[0.65rem] font-medium mt-2"
          style={{ color: 'rgba(184,149,90,0.70)' }}
        >
          ✦ Personalized planning active for this property
        </p>
      )}
    </div>
  )
}

function Chip({
  children,
  icon,
}: {
  children: import('react').ReactNode
  icon?: import('react').ReactNode
}) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[0.65rem] font-light px-2 py-0.5 rounded-sm"
      style={{
        backgroundColor: 'var(--warm-gray)',
        border: '0.5px solid rgba(180,166,150,0.28)',
        color: 'var(--charcoal-light)',
      }}
    >
      {icon && <span style={{ color: 'var(--stone)' }}>{icon}</span>}
      {children}
    </span>
  )
}
