import { type SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  placeholder?: string
  options: { label: string; value: string }[] | string[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, placeholder, options, className, id, ...props }, ref) => {
    const normalizedOptions = options.map((opt) =>
      typeof opt === 'string' ? { label: opt, value: opt } : opt
    )

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-charcoal-light"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'font-sans text-[0.875rem] font-light text-charcoal bg-warm-gray',
            'border border-border rounded-sm px-3.5 py-2.5 w-full',
            'transition-all duration-200 cursor-pointer',
            'focus:border-gold focus:bg-white focus:outline-none',
            error && 'border-red-400',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-[0.75rem] text-red-500 font-light">{error}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'
