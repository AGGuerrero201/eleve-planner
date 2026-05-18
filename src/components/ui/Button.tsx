import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'gold',
      size = 'md',
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center font-sans font-medium tracking-[0.08em] uppercase transition-all duration-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2'

    const variants = {
      gold: 'bg-gold text-white hover:bg-gold-dark active:scale-[0.98]',
      outline:
        'bg-transparent text-charcoal-light border border-border hover:border-charcoal-light hover:text-charcoal active:scale-[0.98]',
      ghost:
        'bg-transparent text-charcoal-light hover:bg-warm-gray active:scale-[0.98]',
      danger:
        'bg-transparent text-red-600 border border-red-200 hover:bg-red-50 active:scale-[0.98]',
    }

    const sizes = {
      sm: 'text-[0.72rem] px-5 py-2',
      md: 'text-[0.8rem] px-8 py-3',
      lg: 'text-[0.85rem] px-10 py-3.5',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <LoadingDots />
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

function LoadingDots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-current"
          style={{
            animation: 'pulseDot 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  )
}
