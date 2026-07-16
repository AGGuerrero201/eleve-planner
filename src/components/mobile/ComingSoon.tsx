import type { ReactNode } from 'react'

/**
 * Honest, non-interactive placeholder for concepts not yet backed by real
 * data (Live Event Mode, resident check-in, expense logging). Always
 * labeled "Coming Soon" — never fabricates data or implies working
 * functionality.
 */
export function ComingSoonCard({
  icon, title, description, onClick,
}: {
  icon: ReactNode
  title: string
  description: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-sm px-4 py-4 flex items-start gap-3"
      style={{ backgroundColor: 'var(--gold-ghost, #FBF7F2)', border: '0.5px solid rgba(184,149,90,0.20)' }}
    >
      <span className="shrink-0 mt-0.5" style={{ color: 'var(--gold, #B8955A)', opacity: 0.75 }}>{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-2 mb-1">
          <span className="font-serif text-[0.95rem] font-light text-charcoal">{title}</span>
          <span
            className="text-[0.55rem] font-medium tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-sm shrink-0"
            style={{ color: 'var(--gold, #B8955A)', border: '0.5px solid rgba(184,149,90,0.35)' }}
          >
            Coming Soon
          </span>
        </span>
        <span className="block text-[0.75rem] font-light leading-snug" style={{ color: 'var(--charcoal-light, #4A4A50)' }}>
          {description}
        </span>
      </span>
    </button>
  )
}

export function ComingSoonSheet({
  icon, title, description, detail, onClose,
}: {
  icon: ReactNode
  title: string
  description: string
  detail?: string
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-charcoal/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm bg-off-white rounded-t-sm sm:rounded-sm p-6 pb-8">
        <div className="flex items-start justify-between mb-4">
          <span style={{ color: 'var(--gold, #B8955A)' }}>{icon}</span>
          <button type="button" onClick={onClose} className="text-muted text-[0.7rem] uppercase tracking-[0.08em]">
            Close
          </button>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-serif text-[1.3rem] font-light text-charcoal">{title}</h3>
          <span
            className="text-[0.58rem] font-medium tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm"
            style={{ color: 'var(--gold, #B8955A)', border: '0.5px solid rgba(184,149,90,0.35)' }}
          >
            Coming Soon
          </span>
        </div>
        <p className="text-[0.85rem] font-light leading-relaxed text-charcoal-light mb-2">{description}</p>
        {detail && <p className="text-[0.78rem] font-light leading-relaxed text-muted">{detail}</p>}
      </div>
    </div>
  )
}
