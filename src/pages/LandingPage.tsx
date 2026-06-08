/**
 * src/pages/LandingPage.tsx
 *
 * Elevé public marketing page — /
 * Designed for: property managers, lifestyle teams,
 * resident experience managers, luxury residential operators.
 *
 * Sections:
 *   1.  Nav-level hero         — headline, sub, dual CTA
 *   2.  Social proof strip     — property types
 *   3.  Problem statement      — what event planning costs today
 *   4.  Product preview        — styled UI preview cards
 *   5.  Core features (4-up)   — what it does
 *   6.  Who it's for           — 3 personas
 *   7.  AI planning benefits   — deep dive on generation
 *   8.  Vendor hub benefits    — directory + recommendations
 *   9.  Workflow benefits      — status, editing, saving
 *  10.  Pull-quote             — editorial moment
 *  11.  Pricing teaser         — no Stripe, placeholder only
 *  12.  Final CTA              — Enter Demo + Book Demo
 *  13.  Footer                 — minimal
 */

import { useNavigate } from 'react-router-dom'
import {
  Sunrise, ReceiptText, Building2, ClipboardList,
  Zap, Store, CheckCircle2, Users, ArrowRight, Star,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = [
  'Class A Multifamily',
  'Luxury Condominiums',
  'Branded Residences',
  'Mixed-Use Communities',
  'Lifestyle-Led Rentals',
]

const FEATURES = [
  {
    icon: Zap,
    title: 'AI-Generated Plans',
    body: 'Describe your event parameters and receive a complete plan in under 60 seconds — timeline, catering, entertainment, staffing, budget breakdown, and a resident email draft.',
  },
  {
    icon: Store,
    title: 'Vendor Hub',
    body: 'Maintain a curated directory of your preferred vendors with COI tracking, price tiers, and category tags. Vendor recommendations surface automatically for every event.',
  },
  {
    icon: ClipboardList,
    title: 'Template Library',
    body: '30 curated event templates organised by season, occasion, and resident profile. Launch a complete plan instantly, then refine it to match your property.',
  },
  {
    icon: Building2,
    title: 'Workflow Management',
    body: 'Move events from In Planning through Confirmed, Underway, and Delivered. Edit every section in place. Regenerate any element with one click.',
  },
]

const PERSONAS = [
  {
    role:    'Property Manager',
    glyph:   '◆',
    pain:    'Spends 4–6 hours planning each event from scratch. No system, no history, no vendor directory.',
    gain:    'Plans a complete event in 10 minutes. Saves every plan. Reuses vendor relationships. Builds a library.',
  },
  {
    role:    'Lifestyle Director',
    glyph:   '◇',
    pain:    'Manages 12+ events per quarter across multiple properties. Tracking everything in spreadsheets.',
    gain:    'One platform for all events. Status tracking across the calendar. Templates for recurring formats.',
  },
  {
    role:    'Resident Experience Manager',
    glyph:   '○',
    pain:    'Resident feedback says events feel generic. No way to calibrate programming to the actual community.',
    gain:    'Every plan is shaped around demographic, season, and tone. Resident email drafts included by default.',
  },
]

const AI_POINTS = [
  'Full event timeline with 15-minute intervals',
  'Catering and bar service recommendations',
  'Entertainment and activation suggestions',
  'Staffing plan with roles and counts',
  'Alcohol estimate with quantity and cost',
  'Budget breakdown by category',
  'Setup logistics checklist',
  'Resident invitation email, ready to send',
]

const VENDOR_POINTS = [
  'Categorised directory: catering, bar, entertainment, staffing, décor, and more',
  'COI status tracking — on file, requested, expired, or not required',
  'Price tier filtering — budget through luxury',
  'Automatic vendor matching for every generated event',
  'Favorite vendors surfaced first in recommendations',
  'Previously used vendors flagged for easy re-booking',
]

const WORKFLOW_POINTS = [
  { status: 'In Planning',  desc: 'Draft generated, details being refined' },
  { status: 'Confirmed',    desc: 'Vendors confirmed, logistics finalised' },
  { status: 'Underway',     desc: 'Event is live and being delivered' },
  { status: 'Delivered',    desc: 'Complete — archived for reference and reuse' },
]

const PRICING_TIERS = [
  {
    name:     'Starter',
    price:    '$99',
    period:   '/month',
    desc:     'For single-property teams getting started with structured event planning.',
    features: ['Unlimited event generation', '30 curated templates', 'Vendor directory up to 25', 'Saved event library', 'Email support'],
    cta:      'Start Free Trial',
    featured: false,
  },
  {
    name:     'Professional',
    price:    '$249',
    period:   '/month',
    desc:     'For lifestyle teams managing active event programmes across a property.',
    features: ['Everything in Starter', 'Unlimited vendor directory', 'COI tracking', 'Section-level AI regeneration', 'Workflow status management', 'Priority support'],
    cta:      'Book a Demo',
    featured: true,
  },
  {
    name:     'Portfolio',
    price:    'Custom',
    period:   '',
    desc:     'For operators managing multiple properties or branded residential portfolios.',
    features: ['Everything in Professional', 'Multi-property workspace', 'Custom template library', 'Dedicated onboarding', 'SLA support'],
    cta:      'Contact Sales',
    featured: false,
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ backgroundColor: 'var(--off-white, #FAFAF8)' }}>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — Hero
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-charcoal relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 65% 45%, rgba(184,149,90,0.07) 0%, transparent 65%)' }}
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gold/20" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-20 sm:pt-28 sm:pb-32 text-center">

          <p className="text-[0.62rem] font-medium uppercase text-gold/70 mb-8 sm:mb-10 animate-fade-up"
             style={{ letterSpacing: '0.28em' }}>
            Luxury residential event planning
          </p>

          <h1 className="font-serif font-light text-off-white leading-[1.06] mb-6 animate-fade-up animate-delay-100"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4.25rem)' }}>
            From blank calendar
            <br />
            to{' '}
            <em className="italic text-gold-light">resident-ready plan</em>
            <br />
            in minutes.
          </h1>

          <p className="text-white/45 font-light leading-[1.85] mb-10 sm:mb-12 max-w-lg mx-auto animate-fade-up animate-delay-200"
             style={{ fontSize: 'clamp(0.95rem, 2vw, 1.05rem)' }}>
            Elevé gives property managers and lifestyle teams an AI-powered platform
            to plan, manage, and deliver exceptional resident events — with vendor
            tracking, status workflows, and ready-to-send communications built in.
          </p>

          {/* Dual CTA */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 animate-fade-up animate-delay-300">
            <Button
              variant="gold"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate('/dashboard')}
            >
              Enter Demo
            </Button>
            <button
              type="button"
              className={cn(
                'w-full sm:w-auto inline-flex items-center justify-center',
                'text-[0.8rem] font-medium tracking-[0.08em] uppercase',
                'px-8 py-3.5 rounded-sm border transition-all duration-200',
                'border-white/15 text-white/55 hover:border-gold/40 hover:text-gold-light',
              )}
              onClick={() => {
                // Book Demo — placeholder for calendar/Calendly integration
                window.open('mailto:demo@eleve.app?subject=Demo Request', '_blank')
              }}
            >
              Book a Demo
            </button>
          </div>

          <p className="text-white/20 text-[0.7rem] font-light mt-5 animate-fade-up animate-delay-400">
            No account required to explore the demo
          </p>

        </div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-white/5" />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — Social proof strip
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="border-b"
        style={{ borderColor: 'rgba(180,166,150,0.25)' }}
      >
        <div className="max-w-5xl mx-auto px-6 py-5 overflow-x-auto">
          <div className="flex items-center justify-start sm:justify-center gap-x-8 gap-y-2 flex-nowrap sm:flex-wrap">
            {PROPERTY_TYPES.map((type, i) => (
              <span key={type} className="flex items-center gap-8 shrink-0">
                <span className="text-[0.6rem] font-medium uppercase whitespace-nowrap"
                      style={{ letterSpacing: '0.14em', color: 'var(--muted, #8A8580)' }}>
                  {type}
                </span>
                {i < PROPERTY_TYPES.length - 1 && (
                  <span className="w-px h-3 shrink-0" style={{ backgroundColor: 'rgba(180,166,150,0.35)' }} />
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — Problem statement
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-3xl mx-auto px-6 py-20 sm:py-24 text-center">
        <p className="text-[0.6rem] font-medium uppercase mb-5"
           style={{ letterSpacing: '0.22em', color: 'var(--gold, #B8955A)', opacity: 0.7 }}>
          The problem
        </p>
        <h2 className="font-serif font-light text-charcoal leading-snug mb-6"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}>
          Planning great resident events takes hours you don't have.
        </h2>
        <p className="font-light leading-[1.85] max-w-xl mx-auto"
           style={{ fontSize: '0.9rem', color: 'var(--muted, #8A8580)' }}>
          Most property teams are building event plans from scratch every time —
          searching vendor contacts across emails, copying budgets from last year's
          spreadsheet, writing invitation copy at 10pm. Elevé replaces that entire
          process with a single, structured workflow.
        </p>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — Product preview (styled UI cards)
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-20"
        style={{ backgroundColor: 'var(--charcoal, #1C1C1E)' }}
      >
        <div className="absolute top-0 inset-x-0 h-px" style={{ backgroundColor: 'rgba(184,149,90,0.12)' }} />

        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[0.6rem] font-medium uppercase mb-4"
               style={{ letterSpacing: '0.22em', color: 'rgba(184,149,90,0.65)' }}>
              The platform
            </p>
            <h2 className="font-serif font-light text-off-white leading-snug"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              Everything in one place — from brief to resident email.
            </h2>
          </div>

          {/* Preview cards — 3 styled UI mockups */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Card 1: Generated plan preview */}
            <PreviewCard label="Generated event plan">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
                  <span className="text-[0.6rem] uppercase font-medium text-gold/70" style={{ letterSpacing: '0.12em' }}>
                    Cocktail Reception · Summer
                  </span>
                </div>
                <p className="font-serif text-[1rem] font-light text-off-white leading-snug">
                  Rooftop Social at Dusk
                </p>
                <p className="text-[0.68rem] font-light" style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
                  A curated evening of passed appetisers and signature cocktails as the city lights come up. Full bar service, live ambient set, 7–10 PM.
                </p>
                <div className="pt-2 space-y-1.5">
                  {['6:45 PM  Vendor & staff arrival', '7:00 PM  Doors open, welcome drinks', '7:30 PM  Passed appetisers begin', '9:30 PM  Last call', '10:00 PM Close'].map((line) => (
                    <div key={line} className="flex gap-3 text-[0.65rem]">
                      <span style={{ color: 'var(--gold, #B8955A)', opacity: 0.7, fontVariantNumeric: 'tabular-nums', minWidth: 52 }}>
                        {line.split('  ')[0]}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.45)' }}>{line.split('  ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </PreviewCard>

            {/* Card 2: Vendor hub preview */}
            <PreviewCard label="Vendor directory">
              <div className="space-y-2">
                <p className="text-[0.6rem] uppercase font-medium mb-3" style={{ letterSpacing: '0.12em', color: 'rgba(184,149,90,0.65)' }}>
                  Catering · 3 vendors
                </p>
                {[
                  { name: 'Terroir Catering Co.', tier: 'Premium', coi: 'COI ✓' },
                  { name: 'The Larder Group',     tier: 'Luxury',  coi: 'COI ✓' },
                  { name: 'Provision & Co.',      tier: 'Mid',     coi: 'Pending' },
                ].map((v) => (
                  <div key={v.name} className="flex items-center gap-2 px-3 py-2 rounded-sm"
                       style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(180,166,150,0.12)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/40 shrink-0" />
                    <span className="flex-1 text-[0.72rem] font-light text-white/75 truncate">{v.name}</span>
                    <span className="text-[0.58rem] font-medium uppercase text-white/30" style={{ letterSpacing: '0.06em' }}>{v.tier}</span>
                    <span className={cn(
                      'text-[0.55rem] font-medium px-1.5 py-0.5 rounded-sm',
                      v.coi === 'COI ✓'
                        ? 'text-green-400' : 'text-amber-400/70'
                    )}>
                      {v.coi}
                    </span>
                  </div>
                ))}
                <div className="pt-1">
                  <p className="text-[0.6rem] uppercase font-medium mt-3 mb-2" style={{ letterSpacing: '0.12em', color: 'rgba(184,149,90,0.65)' }}>
                    Bar Service · 2 vendors
                  </p>
                  {[
                    { name: 'Craft Bar Events',  tier: 'Premium', coi: 'COI ✓' },
                    { name: 'Pour Society',       tier: 'Luxury',  coi: 'COI ✓' },
                  ].map((v) => (
                    <div key={v.name} className="flex items-center gap-2 px-3 py-2 rounded-sm mb-1.5"
                         style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(180,166,150,0.12)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/40 shrink-0" />
                      <span className="flex-1 text-[0.72rem] font-light text-white/75 truncate">{v.name}</span>
                      <span className="text-[0.55rem] font-medium text-green-400">{v.coi}</span>
                    </div>
                  ))}
                </div>
              </div>
            </PreviewCard>

            {/* Card 3: Saved events preview */}
            <PreviewCard label="Saved event library">
              <div className="space-y-2">
                {[
                  { title: 'Rooftop Social at Dusk',    status: 'Confirmed',   type: 'Cocktail Reception' },
                  { title: 'Summer Pool Party',          status: 'In Planning', type: 'Pool Party' },
                  { title: 'Wine & Cheese Evening',      status: 'Delivered',   type: 'Wine Tasting' },
                  { title: 'Wellness Morning',           status: 'In Planning', type: 'Yoga & Wellness' },
                  { title: 'Holiday Resident Gala',      status: 'Confirmed',   type: 'Holiday Party' },
                ].map((e) => (
                  <div key={e.title} className="px-3 py-2.5 rounded-sm"
                       style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(180,166,150,0.12)' }}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn(
                        'text-[0.55rem] font-medium px-1.5 py-0.5 rounded-sm border',
                        e.status === 'Confirmed'   ? 'text-green-400 border-green-900/50 bg-green-900/20' :
                        e.status === 'Delivered'   ? 'text-white/30 border-white/10 bg-white/5' :
                                                     'text-blue-400/80 border-blue-900/50 bg-blue-900/20'
                      )}>
                        {e.status}
                      </span>
                      <span className="text-[0.6rem] font-light" style={{ color: 'rgba(184,149,90,0.55)', letterSpacing: '0.08em' }}>
                        {e.type}
                      </span>
                    </div>
                    <p className="font-serif text-[0.85rem] font-light text-white/70 leading-snug">{e.title}</p>
                  </div>
                ))}
              </div>
            </PreviewCard>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 5 — Core features (4-up grid)
      ══════════════════════════════════════════════════════════════ */}
      <section>
        <div className="text-center pt-16 sm:pt-20 pb-10 sm:pb-12 px-6">
          <p className="text-[0.6rem] font-medium uppercase mb-4"
             style={{ letterSpacing: '0.24em', color: 'var(--gold, #B8955A)', opacity: 0.7 }}>
            What Elevé does
          </p>
          <h2 className="font-serif font-light text-charcoal leading-tight"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Built for the full event lifecycle
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] mx-4 sm:mx-6 lg:mx-10 mb-6"
             style={{ backgroundColor: 'rgba(180,166,150,0.25)' }}>
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className="hover:bg-white transition-colors duration-300 p-7 sm:p-9 animate-fade-up"
              style={{ backgroundColor: 'var(--off-white, #FAFAF8)', animationDelay: `${i * 70}ms` }}
            >
              <div className="w-10 h-10 border flex items-center justify-center mb-6 sm:mb-7"
                   style={{ borderColor: 'rgba(184,149,90,0.25)' }}>
                <Icon size={17} className="text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-light text-charcoal mb-3 leading-snug"
                  style={{ fontSize: '1.1rem' }}>
                {title}
              </h3>
              <p className="font-light leading-[1.75]"
                 style={{ fontSize: '0.825rem', color: 'var(--muted, #8A8580)' }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 6 — Who it's for
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <p className="text-[0.6rem] font-medium uppercase mb-4"
             style={{ letterSpacing: '0.22em', color: 'var(--gold, #B8955A)', opacity: 0.7 }}>
            Who it's for
          </p>
          <h2 className="font-serif font-light text-charcoal"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Designed for the people who run the programme
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PERSONAS.map(({ role, glyph, pain, gain }) => (
            <div
              key={role}
              className="rounded-sm px-6 py-6"
              style={{
                backgroundColor: 'var(--card-bg, #FAFAF8)',
                border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
              }}
            >
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-[0.9rem]" style={{ color: 'var(--gold, #B8955A)' }} aria-hidden>{glyph}</span>
                <h3 className="font-serif font-light text-charcoal" style={{ fontSize: '1rem' }}>{role}</h3>
              </div>
              <div
                className="mb-4 px-3 py-3 rounded-sm"
                style={{ backgroundColor: 'var(--warm-gray, #F5F3EF)', border: '0.5px solid rgba(180,166,150,0.20)' }}
              >
                <p className="text-[0.62rem] font-medium uppercase mb-1.5"
                   style={{ letterSpacing: '0.10em', color: 'var(--muted, #8A8580)' }}>
                  Before Elevé
                </p>
                <p className="font-light leading-relaxed"
                   style={{ fontSize: '0.78rem', color: 'var(--charcoal-light, #4A4A50)' }}>
                  {pain}
                </p>
              </div>
              <div>
                <p className="text-[0.62rem] font-medium uppercase mb-1.5"
                   style={{ letterSpacing: '0.10em', color: 'var(--gold, #B8955A)', opacity: 0.8 }}>
                  With Elevé
                </p>
                <p className="font-light leading-relaxed"
                   style={{ fontSize: '0.78rem', color: 'var(--charcoal, #1C1C1E)' }}>
                  {gain}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 7 — AI planning benefits
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-20"
        style={{ backgroundColor: 'var(--warm-gray, #F5F3EF)', borderTop: '0.5px solid rgba(180,166,150,0.25)', borderBottom: '0.5px solid rgba(180,166,150,0.25)' }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[0.6rem] font-medium uppercase mb-4"
                 style={{ letterSpacing: '0.22em', color: 'var(--gold, #B8955A)', opacity: 0.7 }}>
                AI generation
              </p>
              <h2 className="font-serif font-light text-charcoal mb-5 leading-snug"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                A complete event plan in under 60 seconds.
              </h2>
              <p className="font-light leading-[1.85] mb-8"
                 style={{ fontSize: '0.875rem', color: 'var(--muted, #8A8580)' }}>
                Tell Elevé your event type, resident demographic, budget, and season.
                The AI generates a plan calibrated to your brief — not a generic template,
                but a structured document ready to act on.
              </p>
              <ul className="space-y-2.5">
                {AI_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 size={14} strokeWidth={1.5} className="shrink-0 mt-0.5 text-gold/60" />
                    <span className="font-light" style={{ fontSize: '0.82rem', color: 'var(--charcoal-light, #4A4A50)' }}>
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI feature detail card */}
            <div
              className="rounded-sm p-5 sm:p-7"
              style={{
                backgroundColor: 'var(--charcoal, #1C1C1E)',
                border: '1px solid rgba(184,149,90,0.20)',
              }}
            >
              <div className="flex items-center gap-2.5 mb-5">
                <Zap size={13} className="text-gold" strokeWidth={1.5} />
                <span className="text-[0.62rem] font-medium uppercase"
                      style={{ letterSpacing: '0.14em', color: 'var(--gold-light, #E8D5B0)' }}>
                  AI-generated plan
                </span>
              </div>
              <p className="font-serif font-light text-off-white mb-1" style={{ fontSize: '1.15rem' }}>
                Summer Rooftop Social
              </p>
              <p className="text-[0.7rem] font-medium uppercase mb-5"
                 style={{ letterSpacing: '0.10em', color: 'var(--gold, #B8955A)' }}>
                Cocktails & skyline views
              </p>
              {[
                { label: 'Budget',      value: '$3,500 – $5,000' },
                { label: 'Attendance',  value: '40–60 residents' },
                { label: 'Bar service', value: 'Full bar, 2 signature cocktails' },
                { label: 'Staffing',    value: '1 event lead, 2 bar, 2 service' },
                { label: 'Est. cost',   value: '$4,200 all-in' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5"
                     style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-[0.68rem] font-light" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
                  <span className="text-[0.72rem] font-light" style={{ color: 'rgba(255,255,255,0.75)' }}>{value}</span>
                </div>
              ))}
              <div className="mt-4 pt-3" style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[0.62rem] font-medium uppercase mb-1.5"
                   style={{ letterSpacing: '0.10em', color: 'rgba(184,149,90,0.55)' }}>
                  Resident email subject
                </p>
                <p className="font-serif font-light text-white/50 italic" style={{ fontSize: '0.85rem' }}>
                  "Join us on the rooftop this Saturday — cocktails as the city lights up."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 8 — Vendor hub benefits
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">

          {/* Vendor category breakdown visual */}
          <div
            className="rounded-sm p-5 sm:p-7 order-2 sm:order-1"
            style={{
              backgroundColor: 'var(--card-bg, #FAFAF8)',
              border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-[0.62rem] font-medium uppercase"
                 style={{ letterSpacing: '0.14em', color: 'var(--stone, #8C8478)' }}>
                Vendor directory
              </p>
              <span className="font-serif font-light text-charcoal" style={{ fontSize: '1.4rem' }}>12</span>
            </div>
            {[
              { cat: 'Catering',       n: 3, coi: 2 },
              { cat: 'Bar & Beverage', n: 2, coi: 2 },
              { cat: 'Entertainment',  n: 2, coi: 1 },
              { cat: 'Staffing',       n: 2, coi: 2 },
              { cat: 'Décor & Floral', n: 2, coi: 1 },
              { cat: 'AV & Production',n: 1, coi: 1 },
            ].map(({ cat, n, coi }) => (
              <div key={cat} className="flex items-center gap-3 py-2.5"
                   style={{ borderBottom: '0.5px solid rgba(180,166,150,0.18)' }}>
                <span className="flex-1 text-[0.75rem] font-light text-charcoal-light">{cat}</span>
                <span className="text-[0.68rem] font-medium tabular-nums"
                      style={{ color: 'var(--gold, #B8955A)' }}>
                  {n}
                </span>
                <span className="text-[0.6rem] font-light"
                      style={{ color: 'var(--muted, #8A8580)', minWidth: 48, textAlign: 'right' }}>
                  {coi}/{n} COI
                </span>
              </div>
            ))}
          </div>

          <div className="order-1 sm:order-2">
            <p className="text-[0.6rem] font-medium uppercase mb-4"
               style={{ letterSpacing: '0.22em', color: 'var(--gold, #B8955A)', opacity: 0.7 }}>
              Vendor hub
            </p>
            <h2 className="font-serif font-light text-charcoal mb-5 leading-snug"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              Your vendor directory, always ready.
            </h2>
            <p className="font-light leading-[1.85] mb-8"
               style={{ fontSize: '0.875rem', color: 'var(--muted, #8A8580)' }}>
              Stop searching your inbox for the caterer's contact. Elevé maintains
              your entire vendor directory — with COI tracking, price tiers, and
              automatic matching to every event you generate.
            </p>
            <ul className="space-y-2.5">
              {VENDOR_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 size={14} strokeWidth={1.5} className="shrink-0 mt-0.5 text-gold/60" />
                  <span className="font-light" style={{ fontSize: '0.82rem', color: 'var(--charcoal-light, #4A4A50)' }}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 9 — Workflow benefits
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="py-16 sm:py-20"
        style={{ backgroundColor: 'var(--warm-gray, #F5F3EF)', borderTop: '0.5px solid rgba(180,166,150,0.25)', borderBottom: '0.5px solid rgba(180,166,150,0.25)' }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[0.6rem] font-medium uppercase mb-4"
               style={{ letterSpacing: '0.22em', color: 'var(--gold, #B8955A)', opacity: 0.7 }}>
              Workflow management
            </p>
            <h2 className="font-serif font-light text-charcoal"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              From draft to delivered — tracked every step.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {WORKFLOW_POINTS.map(({ status, desc }, i) => (
              <div
                key={status}
                className="rounded-sm px-5 py-5"
                style={{
                  backgroundColor: 'var(--card-bg, #FAFAF8)',
                  border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: ['#CEB48E', '#3D7FCC', '#B8955A', '#5A8A5A'][i] }}
                  />
                  <span className="text-[0.6rem] font-medium uppercase"
                        style={{ letterSpacing: '0.10em', color: 'var(--stone, #8C8478)' }}>
                    {status}
                  </span>
                </div>
                <p className="font-light leading-relaxed"
                   style={{ fontSize: '0.78rem', color: 'var(--charcoal-light, #4A4A50)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 font-light"
             style={{ fontSize: '0.8rem', color: 'var(--muted, #8A8580)' }}>
            Every section of every plan is editable and regeneratable in place — timeline, catering, budget, email, and more.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 10 — Pull-quote
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-charcoal relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px" style={{ backgroundColor: 'rgba(184,149,90,0.15)' }} />
        <div className="max-w-2xl mx-auto px-6 py-20 sm:py-24 text-center">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-12 bg-gold/30" />
            <div className="w-1 h-1 rounded-full bg-gold/40" />
            <div className="h-px w-12 bg-gold/30" />
          </div>
          <blockquote className="font-serif italic font-light leading-[1.45] mb-6"
                      style={{ fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', color: 'rgba(232,213,176,0.90)' }}>
            The best resident events feel effortless.
            <br />
            The planning behind them never was.
          </blockquote>
          <p className="uppercase font-light mb-14"
             style={{ fontSize: '0.7rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.22)' }}>
            Until now.
          </p>
          <Button variant="gold" size="lg" onClick={() => navigate('/dashboard')}>
            Enter Demo
          </Button>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-white/5" />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 11 — Pricing teaser
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <p className="text-[0.6rem] font-medium uppercase mb-4"
             style={{ letterSpacing: '0.22em', color: 'var(--gold, #B8955A)', opacity: 0.7 }}>
            Pricing
          </p>
          <h2 className="font-serif font-light text-charcoal mb-3"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Simple, transparent pricing.
          </h2>
          <p className="font-light" style={{ fontSize: '0.875rem', color: 'var(--muted, #8A8580)' }}>
            No contracts. Cancel any time. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PRICING_TIERS.map(({ name, price, period, desc, features, cta, featured }) => (
            <div
              key={name}
              className="rounded-sm px-6 py-7 flex flex-col"
              style={featured ? {
                backgroundColor: 'var(--charcoal, #1C1C1E)',
                border: '1px solid rgba(184,149,90,0.35)',
              } : {
                backgroundColor: 'var(--card-bg, #FAFAF8)',
                border: 'var(--card-border, 1px solid rgba(180,166,150,0.28))',
              }}
            >
              {featured && (
                <span className="text-[0.55rem] font-medium uppercase px-2 py-0.5 rounded-sm self-start mb-4"
                      style={{ letterSpacing: '0.10em', backgroundColor: 'rgba(184,149,90,0.15)', color: 'var(--gold, #B8955A)', border: '0.5px solid rgba(184,149,90,0.25)' }}>
                  Most popular
                </span>
              )}

              <p className="text-[0.62rem] font-medium uppercase mb-2"
                 style={{ letterSpacing: '0.12em', color: featured ? 'rgba(184,149,90,0.70)' : 'var(--stone, #8C8478)' }}>
                {name}
              </p>

              <div className="flex items-baseline gap-1 mb-3">
                <span className="font-serif font-light"
                      style={{ fontSize: '2rem', color: featured ? 'var(--off-white, #FAFAF8)' : 'var(--charcoal, #1C1C1E)' }}>
                  {price}
                </span>
                {period && (
                  <span className="font-light" style={{ fontSize: '0.78rem', color: featured ? 'rgba(255,255,255,0.35)' : 'var(--muted, #8A8580)' }}>
                    {period}
                  </span>
                )}
              </div>

              <p className="font-light mb-6 leading-relaxed"
                 style={{ fontSize: '0.78rem', color: featured ? 'rgba(255,255,255,0.45)' : 'var(--muted, #8A8580)' }}>
                {desc}
              </p>

              <ul className="space-y-2 mb-8 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle2 size={13} strokeWidth={1.5} className="shrink-0 mt-0.5"
                                  style={{ color: featured ? 'rgba(184,149,90,0.60)' : 'rgba(184,149,90,0.50)' }} />
                    <span className="font-light"
                          style={{ fontSize: '0.78rem', color: featured ? 'rgba(255,255,255,0.65)' : 'var(--charcoal-light, #4A4A50)' }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Pricing CTA — placeholder, no Stripe yet */}
              <button
                type="button"
                className={cn(
                  'w-full text-[0.72rem] font-medium uppercase py-2.5 rounded-sm border transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                )}
                style={featured ? {
                  letterSpacing: '0.08em',
                  backgroundColor: 'var(--gold, #B8955A)',
                  borderColor: 'var(--gold, #B8955A)',
                  color: '#fff',
                } : {
                  letterSpacing: '0.08em',
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(180,166,150,0.40)',
                  color: 'var(--charcoal-light, #4A4A50)',
                }}
                onClick={() => {
                  // Placeholder — connect Stripe or Calendly here
                  window.open('mailto:demo@eleve.app?subject=' + encodeURIComponent(cta + ' — ' + name), '_blank')
                }}
              >
                {cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 font-light"
           style={{ fontSize: '0.72rem', color: 'var(--muted, #8A8580)' }}>
          Pricing is indicative. Contact us for enterprise or multi-property arrangements.
        </p>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 12 — Final CTA
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 sm:py-28 text-center"
        style={{ backgroundColor: 'var(--charcoal, #1C1C1E)', borderTop: '0.5px solid rgba(184,149,90,0.12)' }}
      >
        <div className="max-w-xl mx-auto px-6">
          <p className="text-[0.62rem] font-medium uppercase mb-5"
             style={{ letterSpacing: '0.22em', color: 'rgba(184,149,90,0.60)' }}>
            Get started
          </p>
          <h2 className="font-serif font-light text-off-white mb-5 leading-snug"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)' }}>
            Ready to see Elevé in action?
          </h2>
          <p className="font-light mb-10 leading-[1.85]"
             style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.40)' }}>
            Explore the full platform with seeded demo data — no account required.
            Or book a 20-minute walkthrough with the team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              variant="gold"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate('/dashboard')}
            >
              Enter Demo
            </Button>
            <button
              type="button"
              className={cn(
                'w-full sm:w-auto inline-flex items-center justify-center',
                'text-[0.8rem] font-medium tracking-[0.08em] uppercase',
                'px-8 py-3.5 rounded-sm border transition-all duration-200',
                'border-white/15 text-white/50 hover:border-gold/35 hover:text-gold-light',
              )}
              onClick={() => window.open('mailto:demo@eleve.app?subject=Book a Demo', '_blank')}
            >
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 13 — Footer
      ══════════════════════════════════════════════════════════════ */}
      <footer
        className="py-8 px-6"
        style={{ borderTop: '0.5px solid rgba(180,166,150,0.20)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif font-light text-charcoal" style={{ fontSize: '1rem', letterSpacing: '0.04em' }}>
            Elevé
          </p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-[0.65rem] font-light transition-colors duration-150 hover:text-charcoal"
              style={{ color: 'var(--muted, #8A8580)', letterSpacing: '0.08em' }}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate('/planner')}
              className="text-[0.65rem] font-light transition-colors duration-150 hover:text-charcoal"
              style={{ color: 'var(--muted, #8A8580)', letterSpacing: '0.08em' }}
            >
              Plan Event
            </button>
            <button
              type="button"
              onClick={() => window.open('mailto:demo@eleve.app', '_blank')}
              className="text-[0.65rem] font-light transition-colors duration-150 hover:text-charcoal"
              style={{ color: 'var(--muted, #8A8580)', letterSpacing: '0.08em' }}
            >
              Contact
            </button>
          </div>
          <p className="text-[0.62rem] font-light"
             style={{ color: 'rgba(138,133,128,0.50)', letterSpacing: '0.04em' }}>
            © {new Date().getFullYear()} Elevé Event Operations
          </p>
        </div>
      </footer>

    </div>
  )
}

// ─── PreviewCard ──────────────────────────────────────────────────────────────

function PreviewCard({
  label,
  children,
}: {
  label:    string
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{ border: '0.5px solid rgba(184,149,90,0.18)' }}
    >
      {/* Card header bar */}
      <div
        className="px-4 py-2.5 flex items-center gap-2"
        style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderBottom: '0.5px solid rgba(184,149,90,0.12)' }}
      >
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
        </div>
        <span className="text-[0.58rem] font-light ml-1"
              style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>
          {label}
        </span>
      </div>
      {/* Card content */}
      <div className="p-4 sm:p-5"
           style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
        {children}
      </div>
    </div>
  )
}
