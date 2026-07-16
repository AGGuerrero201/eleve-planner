import { NavLink } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EleveWordmark } from '@/components/ui/EleveLogo'
import { useProperty } from '@/context/PropertyContext'

const NAV_ITEMS = [
  { label: 'Overview',     to: '/' },
  { label: 'Dashboard',    to: '/dashboard' },
  { label: 'Plan Event',   to: '/planner' },
  { label: 'Saved Events', to: '/saved' },
  { label: 'Vendors',      to: '/vendors' },
]

export function Navbar() {
  const { profile, completionScore, loading } = useProperty()

  // Show amber dot if profile is missing or incomplete (<70%)
  const showSetupDot = !loading && (!profile || completionScore < 70)

  return (
    <header className="bg-charcoal sticky top-0 z-50 border-b border-white/[0.05]">

      {/* ── Main bar ─────────────────────────────────────────────────── */}
      <nav className="max-w-7xl mx-auto px-6 sm:px-10 h-[60px] flex items-center justify-between">

        {/* Wordmark */}
        <NavLink
          to="/"
          className="shrink-0 flex items-center"
          aria-label="Elevé home"
        >
          <EleveWordmark size="md" />
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center">
          {NAV_ITEMS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative text-[0.65rem] font-medium tracking-[0.14em] uppercase',
                  'px-4 py-2 transition-colors duration-200',
                  isActive ? 'text-gold' : 'text-white/35 hover:text-white/65'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-px bg-gold/50"
                      aria-hidden
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Property settings link */}
          <NavLink
            to="/property"
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-1.5 text-[0.65rem] font-medium tracking-[0.14em] uppercase',
                'px-4 py-2 transition-colors duration-200',
                isActive ? 'text-gold' : 'text-white/35 hover:text-white/65'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Building2 size={11} strokeWidth={1.5} />
                Property
                {showSetupDot && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" aria-label="Property profile incomplete" />
                )}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-4 right-4 h-px bg-gold/50"
                    aria-hidden
                  />
                )}
              </>
            )}
          </NavLink>
        </div>

      </nav>

    </header>
  )
}
