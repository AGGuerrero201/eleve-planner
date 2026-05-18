import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'dark'
  padding?: 'sm' | 'md' | 'lg'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', className, children, ...props }, ref) => {
    const paddings = {
      sm: 'p-4',
      md: 'p-6 sm:p-8',
      lg: 'p-8 sm:p-10',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-sm border',
          variant === 'default'
            ? 'bg-white border-border'
            : 'bg-charcoal border-white/10',
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardSection({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-5', className)} {...props}>
      {children}
    </div>
  )
}
