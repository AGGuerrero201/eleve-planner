import { useNavigate } from 'react-router-dom'
import { Sunrise, ReceiptText, Building2, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// ─── Feature cards ────────────────────────────────────────────────────────────
// Sparkles / AI removed — language is operations-first, not AI-first

const FEATURES = [
  {
    icon: Sunrise,
    title: 'Seasonal Programming',
    body: 'Every recommendation is calibrated to season, venue, and resident culture — from rooftop summer evenings to intimate winter receptions.',
  },
  {
    icon: ReceiptText,
    title: 'Budget Intelligence',
    body: 'Complete cost breakdowns with realistic vendor estimates, staffing ratios, and allocation guidance built in from the start.',
  },
  {
    icon: Building2,
    title: 'Resident-First Design',
    body: 'Plans are shaped around your community — young professionals, families, mature residents, or a mixed demographic.',
  },
  {
    icon: ClipboardList,
    title: 'Ready to Execute',
    body: 'Every plan includes a resident email draft, flyer headline, setup logistics, and vendor recommendations. Share-ready from day one.',
  },
]

// ─── Social proof line ────────────────────────────────────────────────────────

const PROPERTY_TYPES = [
  'Class A Multifamily',
  'Luxury Condominiums',
  'Branded Residences',
  'Mixed-Use Communities',
]

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-off-white">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-charcoal relative overflow-hidden">

        {/* Subtle warm texture — one radial glow, nothing more */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 70% 40%, rgba(184,149,90,0.06) 0%, transparent 60%)',
          }}
        />

        {/* Thin top rule — gives the hero a framed, editorial quality */}
        <div className="absolute top-0 inset-x-0 h-px bg-gold/20" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-28 pb-32 text-center">

          {/* Eyebrow — replaces "Powered by Claude AI" */}
          <p className="text-[0.65rem] font-medium tracking-[0.3em] uppercase text-gold/80 mb-10 animate-fade-up">
            Built for luxury residential teams
          </p>

          {/* Headline — unchanged per brief */}
          <h1 className="font-serif text-[3.25rem] sm:text-[4.5rem] font-light text-off-white leading-[1.05] mb-7 animate-fade-up animate-delay-100">
            Curate events that
            <br />
            <em className="font-light italic text-gold-light">elevate living</em>
          </h1>

          {/* Sub-copy — operations framing, not AI framing */}
          <p className="text-white/45 font-light text-[1.05rem] leading-[1.8] mb-12 max-w-xl mx-auto animate-fade-up animate-delay-200">
            A complete event planning system for property managers.
            From concept to resident email — in minutes.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-up animate-delay-300">
            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate('/planner')}
            >
              Start Planning
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/saved')}
              className="border-white/15 text-white/55 hover:border-gold/40 hover:text-gold-light"
            >
              View Saved Events
            </Button>
          </div>

          {/* Property type social proof — no logos, just category names */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-14 animate-fade-up animate-delay-400">
            {PROPERTY_TYPES.map((type, i) => (
              <span key={type} className="flex items-center gap-6">
                <span className="text-[0.65rem] tracking-[0.14em] uppercase text-white/25 font-light">
                  {type}
                </span>
                {i < PROPERTY_TYPES.length - 1 && (
                  <span className="w-px h-3 bg-white/10 shrink-0" />
                )}
              </span>
            ))}
          </div>

        </div>

        {/* Bottom rule */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-white/5" />
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section>

        {/* Section header */}
        <div className="text-center pt-20 pb-12 px-6">
          <p className="text-[0.62rem] font-medium tracking-[0.28em] uppercase text-gold/70 mb-4">
            The platform
          </p>
          <h2 className="font-serif text-[2rem] font-light text-charcoal leading-tight">
            Everything a property team needs
          </h2>
        </div>

        {/* 4-column grid with hairline gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border mx-6 sm:mx-10 mb-6">
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className="bg-off-white hover:bg-white transition-colors duration-300 p-9 animate-fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              {/* Icon container — warm gold border, readable weight */}
              <div className="w-10 h-10 border border-gold/25 flex items-center justify-center mb-7">
                <Icon size={17} className="text-gold" strokeWidth={1.5} />
              </div>

              <h3 className="font-serif text-[1.15rem] font-light text-charcoal mb-3 leading-snug">
                {title}
              </h3>
              <p className="text-[0.825rem] text-muted font-light leading-[1.75]">
                {body}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* ── Editorial pull-quote banner ───────────────────────────────────── */}
      <section className="bg-charcoal mt-10 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gold/15" />

        <div className="max-w-2xl mx-auto px-6 py-24 text-center">

          {/* Decorative rule */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-12 bg-gold/30" />
            <div className="w-1 h-1 rounded-full bg-gold/40" />
            <div className="h-px w-12 bg-gold/30" />
          </div>

          <blockquote className="font-serif italic text-[1.6rem] sm:text-[1.85rem] font-light text-gold-light/90 leading-[1.45] mb-6">
            Great events don&rsquo;t happen by accident.
          </blockquote>
          <p className="text-[0.7rem] tracking-[0.18em] uppercase text-white/25 mb-14">
            They&rsquo;re designed with intention.
          </p>

          <Button
            variant="gold"
            size="lg"
            onClick={() => navigate('/planner')}
          >
            Plan Your Next Event
          </Button>

        </div>

        <div className="absolute bottom-0 inset-x-0 h-px bg-white/5" />
      </section>

    </div>
  )
}