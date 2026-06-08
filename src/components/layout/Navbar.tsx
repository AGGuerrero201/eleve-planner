import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { EleveWordmark } from '@/components/ui/EleveLogo'

const NAV_ITEMS = [
  { label: 'Overview',     to: '/' },
  { label: 'Plan Event',   to: '/planner' },
  { label: 'Saved Events', to: '/saved' },
  { label: 'Vendors',      to: '/vendors' },
]

export function Navbar() {
  return (
    <header className="bg-charcoal sticky top-0 z-50 border-b border-white/[0.05]">
      <nav className="max-w-7xl mx-auto px-6 sm:px-10 h-[60px] flex items-center justify-between">

        {/* Wordmark */}
        <NavLink to="/" className="shrink-0 flex items-center" aria-label="Elevé home">
          <EleveWordmark size="md" />
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
                  'text-[0.68rem] font-medium tracking-[0.12em] uppercase px-4 py-2 transition-all duration-200',
                  isActive
                    ? 'text-gold'
                    : 'text-white/35 hover:text-white/65'
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
