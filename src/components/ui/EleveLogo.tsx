/**
 * EleveLogo — SVG wordmark for Elevé.
 *
 * Design direction:
 * - Pure serif wordmark, no icon or mark
 * - The accent on the final é is the sole distinctive element
 * - Tracked-out letterspacing gives it editorial weight
 * - Two-weight treatment: "ELEV" light / "É" in gold-light
 * - Scales cleanly from navbar (24px) to hero display sizes
 */

interface EleveLogoProps {
  /** Height of the rendered SVG. Width scales proportionally. */
  height?: number
  /** Color for "ELEV" — defaults to ivory/off-white for dark backgrounds */
  primaryColor?: string
  /** Color for the final "É" — defaults to muted gold */
  accentColor?: string
  className?: string
}

export function EleveLogo({
  height = 28,
  primaryColor = '#E8D5B0',
  accentColor = '#B8955A',
  className,
}: EleveLogoProps) {
  // Viewbox is wide to accommodate tracked-out serif letterforms
  return (
    <svg
      viewBox="0 0 180 36"
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Elevé"
      role="img"
      className={className}
      style={{ display: 'block' }}
    >
      <text
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="32"
        fontWeight="300"
        letterSpacing="6"
        fill={primaryColor}
        x="2"
        y="28"
        textAnchor="start"
      >
        ELEV
      </text>
      {/* É — gold accent, slightly different weight to create tension */}
      <text
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="32"
        fontWeight="400"
        letterSpacing="6"
        fill={accentColor}
        x="119"
        y="28"
        textAnchor="start"
      >
        É
      </text>
    </svg>
  )
}

/**
 * EleveWordmark — text-only version using Tailwind classes.
 * Use this when SVG font loading feels unreliable (e.g. in testing).
 * Identical visual result when Cormorant Garamond is loaded.
 */
export function EleveWordmark({
  className,
  size = 'md',
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  }

  return (
    <span
      className={`font-serif tracking-[0.25em] font-light ${sizes[size]} ${className ?? ''}`}
      aria-label="Elevé"
    >
      <span className="text-gold-light">ELEV</span>
      <span className="text-gold">É</span>
    </span>
  )
}