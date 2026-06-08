import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'md' | 'lg'
}

export function Modal({ open, onClose, title, children, size = 'lg' }: ModalProps) {
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose })

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

      {/* Panel
          Mobile:  fixed to bottom, full width, rounded top corners, 92vh max
          Desktop: centered, max-w constrained, rounded-sm all sides        */}
      <div
        className={cn(
          'relative w-full flex flex-col',
          // Mobile — bottom sheet
          'rounded-t-xl max-h-[92vh]',
          // sm+ — centered dialog
          'sm:rounded-sm sm:animate-fade-up',
          size === 'md' ? 'sm:max-w-lg' : 'sm:max-w-2xl',
          'sm:max-h-[88vh]'
        )}
        style={{
          backgroundColor: 'var(--card-bg, #FAFAF8)',
          border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.18)',
        }}
      >
        {/* Mobile drag handle — decorative, shows affordance */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div
            className="w-8 h-1 rounded-full"
            style={{ backgroundColor: 'rgba(180,166,150,0.40)' }}
            aria-hidden
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
          <button
            onClick={onClose}
            className="text-white/25 hover:text-white/60 transition-colors duration-150 p-2 rounded-sm ml-4 shrink-0 -mr-1"
            aria-label="Close"
          >
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
