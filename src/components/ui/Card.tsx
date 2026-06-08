import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'dark'
  padding?: 'sm' | 'md' | 'lg'
  /** Apply the luxury hover treatment (warm border + soft shadow lift).
   *  Defaults to true for default variant, false for dark. */
  interactive?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', interactive, className, children, ...props }, ref) => {
    const paddings = {
      sm: 'p-4',
      md: 'p-6 sm:p-8',
      lg: 'p-8 sm:p-10',
    }

    // Default interactive to true for light cards, false for dark
    const isInteractive = interactive ?? (variant === 'default')

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-sm border',
          // Light variant gets the luxury card treatment
          variant === 'default'
            ? cn(
                'border-[rgba(180,166,150,0.28)]',
                'bg-[#FAFAF8]',
                isInteractive && [
                  'transition-[border-color,box-shadow] duration-200 ease-out',
                  'hover:border-[rgba(184,154,106,0.50)]',
                  'hover:shadow-card-hover',
                ]
              )
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

/** A thin ornamental rule between card sections */
export function CardDivider({ className, ...props }: HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={cn('border-0 my-4', className)}
      style={{ borderTop: '0.5px solid rgba(180, 166, 150, 0.30)' }}
      {...props}
    />
  )
}
