import { useEffect, useRef, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open:     boolean
  onClose:  () => void
  title?:   string
  children: ReactNode
  size?:    'md' | 'lg'
}

export function Modal({ open, onClose, title, children, size = 'lg' }: ModalProps) {
  const onCloseRef  = useRef(onClose)
  const panelRef    = useRef<HTMLDivElement>(null)

  // Keep ref current
  useEffect(() => { onCloseRef.current = onClose })

  // ── Keyboard dismiss ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open])

  // ── Swipe-to-dismiss on mobile bottom sheet ───────────────────────────────
  const touchStartY = useRef<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const isDragging  = useRef(false)

  function onTouchStart(e: React.TouchEvent) {
    // Only initiate drag from the handle area (first 56px of panel)
    const panel = panelRef.current
    if (!panel) return
    const rect  = panel.getBoundingClientRect()
    const touchY = e.touches[0].clientY
    if (touchY - rect.top > 56) return   // too far down — user is scrolling content
    touchStartY.current = touchY
    isDragging.current  = false
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartY.current === null) return
    const delta = e.touches[0].clientY - touchStartY.current
    if (delta < 0) return       // upward drag — ignore
    isDragging.current = true
    setDragOffset(delta)
  }

  function onTouchEnd() {
    if (dragOffset > 120) {
      onCloseRef.current()
    }
    setDragOffset(0)
    touchStartY.current = null
    isDragging.current  = false
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{ backgroundColor: 'rgba(28, 24, 20, 0.70)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          'relative w-full flex flex-col',
          // Mobile — bottom sheet
          'rounded-t-xl max-h-[92vh]',
          // sm+ — centered dialog
          'sm:rounded-sm sm:animate-fade-up',
          size === 'md' ? 'sm:max-w-lg' : 'sm:max-w-2xl',
          'sm:max-h-[88vh]',
          // smooth drag transition only when NOT actively dragging
          !isDragging.current && dragOffset === 0 ? 'transition-transform duration-200' : ''
        )}
        style={{
          backgroundColor: 'var(--card-bg, #FAFAF8)',
          border:          'var(--card-border, 1px solid rgba(180,166,150,0.28))',
          boxShadow:       '0 8px 40px rgba(0, 0, 0, 0.18)',
          // Only apply drag transform on mobile (sm: screens don't bottom-sheet)
          transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Mobile drag handle — now functional */}
        <div
          className="sm:hidden flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing"
          aria-hidden
        >
          <div
            className="w-10 h-1 rounded-full transition-colors duration-150"
            style={{
              backgroundColor: dragOffset > 60
                ? 'rgba(184,149,90,0.55)'
                : 'rgba(180,166,150,0.40)',
            }}
          />
        </div>

        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 sm:px-7 py-4 sm:py-5 shrink-0"
          style={{ backgroundColor: 'var(--charcoal, #1C1C1E)' }}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="w-px h-5 shrink-0"
              style={{ backgroundColor: 'rgba(184,149,90,0.40)' }}
              aria-hidden
            />
            <h2
              id="modal-title"
              className="font-serif font-light leading-tight truncate"
              style={{ fontSize: '1.05rem', color: 'var(--gold-light, #E8D5B0)' }}
            >
              {title}
            </h2>
          </div>

          {/* Close button — shows text label on mobile for clarity */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 ml-4 shrink-0 px-2 py-1.5 rounded-sm transition-colors duration-150"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.70)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
            aria-label="Close"
          >
            {/* "Close" text — visible on mobile, hidden on sm+ */}
            <span className="sm:hidden text-[0.6rem] font-medium tracking-[0.12em] uppercase">
              Close
            </span>
            <X size={15} strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto scrollbar-thin p-6 sm:p-7 md:p-9">
          {children}
        </div>
      </div>
    </div>
  )
}
