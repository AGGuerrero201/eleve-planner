import { useEffect, useState } from 'react'

interface LoadingDotsProps {
  label?: string
}

export function LoadingDots({ label = 'Crafting your event plan…' }: LoadingDotsProps) {
  // Simulated progress: eases to ~85% over 3s, jumps to 100% when unmounted
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Ease from 0 → 82% over ~3s in steps, mimicking real async work
    const targets = [12, 28, 44, 58, 70, 78, 82]
    const timers: ReturnType<typeof setTimeout>[] = []
    targets.forEach((target, i) => {
      timers.push(setTimeout(() => setProgress(target), (i + 1) * 420))
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-14 gap-6">

      {/* Thin gold progress bar */}
      <div
        className="w-32 h-px bg-gold/15 rounded-full overflow-hidden relative"
        role="progressbar"
        aria-label="Generating plan"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="absolute inset-y-0 left-0 bg-gold rounded-full"
          style={{
            width: `${progress}%`,
            transition: 'width 380ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        />
      </div>

      {/* Label — serif italic, refined */}
      <p
        className="font-serif italic font-light leading-snug text-center"
        style={{
          fontSize: '1rem',
          color: 'var(--charcoal-light, #4A4A50)',
          maxWidth: '220px',
        }}
      >
        {label}
      </p>

    </div>
  )
}
