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
        <div className="flex items-center">
          {NAV_ITEMS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  // Base: tracked caps, consistent sizing
                  'relative text-[0.65rem] font-medium tracking-[0.14em] uppercase',
                  'px-4 py-2 transition-colors duration-200',
                  // Active: gold text + bottom dot indicator
                  isActive
                    ? 'text-gold'
                    : 'text-white/35 hover:text-white/65'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {/* Thin gold underline for active item — more refined than text alone */}
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
        </div>

      </nav>
    </header>
  )
}
