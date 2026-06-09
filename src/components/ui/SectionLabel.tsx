import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type SectionLabelTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div'

interface SectionLabelProps extends HTMLAttributes<HTMLElement> {
  children: string
  className?: string
  align?: 'left' | 'center'
  /** Rendered HTML element. Default: 'p'.
   *  Use 'h2' / 'h3' when semantic heading is appropriate. */
  as?: SectionLabelTag
  /** Color variant.
   *  'gold'  — existing behaviour (text-gold, high contrast)
   *  'stone' — new default for body/section labels (warmer, quieter)
   *  Default: 'stone' */
  color?: 'gold' | 'stone'
}

export function SectionLabel({
  children,
  className,
  align = 'left',
  as: Tag = 'p',
  color = 'stone',
  ...props
}: SectionLabelProps) {
  return (
    <Tag
      className={cn(
        // Base label-caps class from index.css:
        // 10px, font-medium, tracking-[0.10em], uppercase
        'label-caps',
        // Color — stone is the new default (quieter, more luxury)
        // gold is preserved for callers that explicitly set it
        color === 'gold' ? 'text-gold' : 'text-[var(--stone)]',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
      {...(props as HTMLAttributes<HTMLElement>)}
    >
      {children}
    </Tag>
  )
}

export default SectionLabel
