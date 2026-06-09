import { type ReactNode, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  children:   ReactNode
  dark?:      boolean
  className?: string
  style?:     CSSProperties
}

export function SectionHeading({ children, dark = false, className, style }: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        'font-serif font-light leading-tight tracking-tight',
        dark ? 'text-white' : 'text-charcoal',
        className
      )}
      style={style}
    >
      {children}
    </h2>
  )
}

export default SectionHeading
