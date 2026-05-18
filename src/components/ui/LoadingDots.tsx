interface LoadingDotsProps {
  label?: string
}

export function LoadingDots({ label = 'Crafting your event plan…' }: LoadingDotsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-5">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-gold"
            style={{
              animation: 'pulseDot 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <p className="font-serif italic text-charcoal-light text-lg font-light">
        {label}
      </p>
    </div>
  )
}
