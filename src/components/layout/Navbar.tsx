import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Overview', to: '/' },
  { label: 'Plan Event', to: '/planner' },
  { label: 'Saved Events', to: '/saved' },
]

export function Navbar() {
  return (
    <header className="bg-charcoal sticky top-0 z-50 border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-0.5 shrink-0">
          <span className="font-serif text-gold-light text-xl font-light tracking-wide">
            Resident
          </span>
          <span className="font-serif text-gold text-xl font-semibold tracking-wide">
            Event
          </span>
          <span className="font-serif text-gold-light text-xl font-light tracking-wide ml-1">
            AI
          </span>
        </NavLink>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'text-[0.72rem] font-medium tracking-[0.09em] uppercase px-3.5 py-2 rounded-sm transition-all duration-200',
                  isActive
                    ? 'text-gold bg-gold/10'
                    : 'text-white/50 hover:text-gold-light hover:bg-white/5'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
