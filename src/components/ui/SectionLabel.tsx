import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: string
  className?: string
  align?: 'left' | 'center'
}

export function SectionLabel({ children, className, align = 'center' }: SectionLabelProps) {
  return (
    <p
      className={cn(
        'text-[0.68rem] font-medium tracking-[0.2em] uppercase text-gold',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      {children}
    </p>
  )
}
