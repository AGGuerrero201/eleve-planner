import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {(label || hint) && (
          <div className="flex items-baseline justify-between">
            {label && (
              <label
                htmlFor={id}
                className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-charcoal-light"
              >
                {label}
              </label>
            )}
            {hint && (
              <span className="text-[0.72rem] font-light text-muted">
                {hint}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'font-sans text-[0.875rem] font-light text-charcoal bg-warm-gray',
            'border border-border rounded-sm px-3.5 py-2.5 w-full min-h-[90px]',
            'transition-all duration-200 leading-relaxed',
            'focus:border-gold focus:bg-white focus:outline-none',
            'placeholder:text-muted/60',
            error && 'border-red-400',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[0.75rem] text-red-500 font-light">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
