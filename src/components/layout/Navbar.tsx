import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { EleveWordmark } from '@/components/ui/EleveLogo'

const NAV_ITEMS = [
  { label: 'Overview', to: '/' },
  { label: 'Plan Event', to: '/planner' },
  { label: 'Saved Events', to: '/saved' },
]

export function Navbar() {
  return (
    <header className="bg-charcoal sticky top-0 z-50 border-b border-white/[0.06]">
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-[58px] flex items-center justify-between">

        {/* Wordmark */}
        <NavLink to="/" className="shrink-0 flex items-center" aria-label="Elevé home">
          <EleveWordmark size="md" />
        </NavLink>

        {/* Nav links */}
        <div className="flex items-center gap-0.5">
          {NAV_ITEMS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'text-[0.7rem] font-medium tracking-[0.1em] uppercase px-3.5 py-2 transition-all duration-200',
                  isActive
                    ? 'text-gold'
                    : 'text-white/40 hover:text-white/70'
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