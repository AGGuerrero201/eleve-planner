import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EleveWordmark } from '@/components/ui/EleveLogo'

const NAV_ITEMS = [
  { label: 'Overview',     to: '/' },
  { label: 'Dashboard',    to: '/dashboard' },
  { label: 'Plan Event',   to: '/planner' },
  { label: 'Saved Events', to: '/saved' },
  { label: 'Vendors',      to: '/vendors' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-charcoal sticky top-0 z-50 border-b border-white/[0.05]">

      {/* ── Main bar ─────────────────────────────────────────────────── */}
      <nav className="max-w-7xl mx-auto px-6 sm:px-10 h-[60px] flex items-center justify-between">

        {/* Wordmark — links to / */}
        <NavLink
          to="/"
          className="shrink-0 flex items-center"
          aria-label="Elevé home"
          onClick={() => setOpen(false)}
        >
          <EleveWordmark size="md" />
        </NavLink>

        {/* Desktop nav links */}
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
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="sm:hidden flex items-center justify-center w-10 h-10 text-white/50 hover:text-white/80 transition-colors duration-150"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
        </button>

      </nav>

      {/* ── Mobile slide-down menu ─────────────────────────────────── */}
      <div
        className={cn(
          'sm:hidden overflow-hidden transition-all duration-250 ease-out',
          open ? 'max-h-[320px] opacity-100' : 'max-h-0 opacity-0'
        )}
        style={{ transitionProperty: 'max-height, opacity' }}
        aria-hidden={!open}
      >
        <div className="border-t border-white/[0.06]">
          {NAV_ITEMS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-6 py-4 min-h-[52px]',
                  'text-[0.72rem] font-medium tracking-[0.14em] uppercase',
                  'border-b border-white/[0.04] transition-colors duration-150',
                  isActive
                    ? 'text-gold border-l-2 border-gold pl-5'
                    : 'text-white/45 hover:text-white/75 hover:bg-white/[0.03]'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>

    </header>
  )
}
