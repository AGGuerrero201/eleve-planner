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
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/65 backdrop-blur-[3px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'relative bg-white rounded-sm shadow-2xl w-full flex flex-col max-h-[88vh] animate-fade-up',
          size === 'md' ? 'max-w-lg' : 'max-w-2xl'
        )}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between bg-charcoal px-7 py-5 rounded-t-sm shrink-0">
          <h2
            id="modal-title"
            className="font-serif text-gold-light font-light text-[1.1rem] leading-tight"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 transition-colors duration-150 p-1 rounded-sm ml-4"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto scrollbar-thin p-7 sm:p-9">
          {children}
        </div>
      </div>
    </div>
  )
}
