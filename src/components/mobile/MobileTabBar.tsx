import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Zap, BookOpen, Store, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProperty } from '@/context/PropertyContext'

const TABS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Plan',      to: '/planner',   icon: Zap },
  { label: 'Saved',     to: '/saved',     icon: BookOpen },
  { label: 'Vendors',   to: '/vendors',   icon: Store },
  { label: 'Property',  to: '/property',  icon: Building2 },
]

/**
 * Fixed bottom tab bar shown only at phone breakpoints (`sm:hidden`).
 * Mirrors the Navbar's exact real destinations — no invented routes.
 */
export function MobileTabBar() {
  const { profile, completionScore, loading } = useProperty()
  const showSetupDot = !loading && (!profile || completionScore < 70)

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-charcoal border-t border-white/[0.06] flex justify-around"
      style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))', paddingTop: '10px' }}
    >
      {TABS.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className="relative flex flex-col items-center gap-1 px-3 py-1 min-w-[44px] min-h-[44px] justify-center"
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute top-0 left-2 right-2 h-px bg-gold/60" aria-hidden />
              )}
              <span className="relative">
                <Icon size={19} strokeWidth={1.5} className={isActive ? 'text-gold' : 'text-white/35'} />
                {label === 'Property' && showSetupDot && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </span>
              <span
                className={cn(
                  'text-[8.5px] font-medium tracking-[0.1em] uppercase',
                  isActive ? 'text-gold' : 'text-white/35'
                )}
              >
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
