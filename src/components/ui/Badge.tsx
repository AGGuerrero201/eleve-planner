import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'muted' | 'success'
}

export function Badge({ variant = 'muted', className, children, ...props }: BadgeProps) {
  const variants = {
    gold: 'bg-gold/10 text-gold border-gold/20',
    muted: 'bg-warm-gray text-charcoal-light border-border',
    success: 'bg-green-50 text-green-700 border-green-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center text-[0.7rem] font-medium tracking-[0.06em] uppercase',
        'px-2.5 py-1 rounded-sm border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
