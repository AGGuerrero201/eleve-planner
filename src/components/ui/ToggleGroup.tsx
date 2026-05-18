import { cn } from '@/lib/utils'

interface ToggleOption<T extends string> {
  label: string
  value: T
}

interface ToggleGroupProps<T extends string> {
  label: string
  options: ToggleOption<T>[]
  value: T
  onChange: (val: T) => void
  className?: string
}

export function ToggleGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: ToggleGroupProps<T>) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-charcoal-light">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'text-[0.78rem] tracking-[0.04em] px-4 py-2 rounded-sm border transition-all duration-200 font-sans',
              value === opt.value
                ? 'border-gold bg-gold/8 text-charcoal font-medium'
                : 'border-border bg-warm-gray text-muted hover:border-charcoal-light/40 hover:text-charcoal-light'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
