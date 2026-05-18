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
  // Keep onClose in a ref so the keydown effect never needs it as a dep.
  // Without this, every inline arrow passed as onClose (e.g. from SavedEventsPage)
  // is a new function reference each render, which re-ran the effect and
  // re-registered the keydown listener — the root cause of React error #185.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

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
  }, [open]) // onClose is intentionally excluded — accessed via stable ref above

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-charcoal/70 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative bg-white rounded-sm shadow-2xl w-full flex flex-col max-h-[85vh] animate-fade-up',
          size === 'md' ? 'max-w-lg' : 'max-w-2xl'
        )}
      >
        <div className="flex items-center justify-between bg-charcoal px-6 py-4 rounded-t-sm shrink-0">
          <h2
            id="modal-title"
            className="font-serif text-gold-light font-light text-lg"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1 rounded-sm"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto scrollbar-thin p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
