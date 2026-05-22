import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  open:          boolean
  message:       string
  confirmLabel?: string
  cancelLabel?:  string
  onConfirm:     () => void
  onCancel:      () => void
  variant?:      'danger' | 'warning'
  className?:    string
}

export function ConfirmDialog({
  open,
  message,
  confirmLabel = 'Delete',
  cancelLabel  = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
  className,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => confirmRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  const confirmStyles = {
    danger:  'bg-red-600 text-white hover:bg-red-700',
    warning: 'bg-gold text-white hover:bg-gold-dark',
  }

  return (
    <div
      className={cn(
        'absolute inset-0 z-20 flex items-center justify-center',
        'bg-white/92 backdrop-blur-[2px] animate-fade-up rounded-sm',
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col items-center gap-3 px-4 text-center">
        <p className="text-[0.8rem] font-light text-charcoal leading-snug max-w-[160px]">
          {message}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-[0.7rem] font-medium text-muted border border-border px-3 py-1.5 rounded-sm hover:bg-warm-gray hover:text-charcoal transition-colors duration-150"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={cn('text-[0.7rem] font-medium px-3 py-1.5 rounded-sm transition-colors duration-150', confirmStyles[variant])}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
