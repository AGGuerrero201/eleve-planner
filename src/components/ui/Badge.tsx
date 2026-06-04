import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'muted' | 'success'
}

export function Badge({ variant = 'muted', className, children, ...props }: BadgeProps) {
  const variants = {
    gold:    'bg-gold/8 text-gold border-gold/15',
    muted:   'bg-warm-gray text-charcoal-light/80 border-border',
    success: 'bg-green-50 text-green-600 border-green-100',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center text-[0.65rem] font-medium tracking-[0.08em] uppercase',
        'px-2.5 py-[3px] rounded-sm border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
