/**
 * src/pages/LandingPage.tsx — Elevé marketing page
 * Polish pass: consistent section rhythm, stronger dark/light contrast,
 * unified card treatment, tighter visual hierarchy.
 */

import { useNavigate } from 'react-router-dom'
import { useExperience } from '@/experience/ExperienceContext'
import {
  Building2, ClipboardList,
  Zap, Store, CheckCircle2,
  Wine, Heart, Dumbbell, Music, Briefcase, Leaf, UtensilsCrossed,
  BookOpen, Gift, PartyPopper, Waves, Users,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// ─── Design tokens (kept in one place for easy global edits) ──────────────────
const C = {
  gold:       'var(--gold, #B8955A)',
  goldLight:  'var(--gold-light, #E8D5B0)',
  charcoal:   'var(--charcoal, #1C1C1E)',
  offWhite:   'var(--off-white, #FAFAF8)',
  warmGray:   'var(--warm-gray, #F5F3EF)',
  muted:      'var(--muted, #8A8580)',
  charLight:  'var(--charcoal-light, #4A4A50)',
  // border alphas
  bdrLight:   'rgba(180,166,150,0.25)',
  bdrLighter: 'rgba(180,166,150,0.18)',
  bdrDark:    'rgba(255,255,255,0.06)',
  // gold alphas
  goldDim:    'rgba(184,149,90,0.60)',
  goldFaint:  'rgba(184,149,90,0.18)',
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = [
  'Class A Multifamily', 'Luxury Condominiums',
  'Branded Residences',  'Mixed-Use Communities', 'Lifestyle-Led Rentals',
]

const FEATURES = [
  { icon: Zap,           title: 'Tailored Event Plans', body: 'Describe your event parameters and receive a complete plan in under 60 seconds: timeline, catering, staffing, budget breakdown, and a resident email draft.' },
  { icon: Building2,     title: 'Property Intelligence', body: 'Create a property profile once. Elevé learns your amenities, resident demographics, community personality, and event spaces to generate events tailored specifically to your community.' },
  { icon: Store,         title: 'Vendor Hub',             body: 'Maintain a curated directory with COI tracking, price tiers, and category tags. Vendor recommendations surface automatically for every event.' },
  { icon: ClipboardList, title: 'Template Library',      body: '30 curated event templates organised by season, occasion, and resident profile. Launch a complete plan instantly, then refine it to match your property.' },
]

const PERSONAS = [
  { role: 'Property Manager',           glyph: '◆', pain: 'Spends 4–6 hours planning each event from scratch. No system, no history, no vendor directory.',           gain: 'Plans a complete event in 10 minutes. Saves every plan. Reuses vendor relationships. Builds a library.' },
  { role: 'Lifestyle Director',         glyph: '◇', pain: 'Manages 12+ events per quarter across multiple properties. Tracking everything in spreadsheets.',           gain: 'One platform for all events. Status tracking across the calendar. Templates for recurring formats.' },
  { role: 'Resident Experience Manager',glyph: '○', pain: 'Resident feedback says events feel generic. No way to calibrate programming to the actual community.',       gain: 'Every plan is shaped around demographic, season, and tone. Resident email drafts included by default.' },
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
  'COI status tracking: on file, requested, expired, or not required',
  'Price tier filtering: budget through luxury',
  'Automatic vendor matching for every generated event',
  'Favorite vendors surfaced first in recommendations',
  'Previously used vendors flagged for easy re-booking',
]

const WORKFLOW_POINTS = [
  { status: 'In Planning', desc: 'Draft generated, details being refined',           dot: '#CEB48E' },
  { status: 'Confirmed',   desc: 'Vendors confirmed, logistics finalised',           dot: '#3D7FCC' },
  { status: 'Underway',    desc: 'Event is live and being delivered',                dot: '#B8955A' },
  { status: 'Delivered',   desc: 'Complete, archived for reference and reuse',      dot: '#5A8A5A' },
]

const IMPACT_STATS = [
  { stat: '80%',  label: 'Faster Planning',        desc: 'Reduce event planning from hours to minutes.', glyph: '◆' },
  { stat: '30+',  label: 'Curated Templates',       desc: 'Launch proven event formats instantly.',       glyph: '◇' },
  { stat: '100%', label: 'Reusable Event Library',  desc: 'Every event saved and ready to use again.',   glyph: '○' },
]

const EVENT_CATEGORIES = [
  { label: 'Resident Socials',       icon: Users },
  { label: 'Holiday Celebrations',   icon: PartyPopper },
  { label: 'Pool Events',            icon: Waves },
  { label: 'Wine Tastings',          icon: Wine },
  { label: 'Family Programming',     icon: Heart },
  { label: 'Educational Workshops',  icon: BookOpen },
  { label: 'Wellness Events',        icon: Dumbbell },
  { label: 'Cultural Celebrations',  icon: Music },
  { label: 'Networking Mixers',      icon: Briefcase },
  { label: 'Seasonal Events',        icon: Leaf },
  { label: 'Cooking Demonstrations', icon: UtensilsCrossed },
  { label: 'Resident Appreciation',  icon: Gift },
]

const COMPARISON_ROWS = [
  { traditional: 'Manages registrations',    eleve: 'Creates the event' },
  { traditional: 'Tracks attendees',         eleve: 'Generates complete plans' },
  { traditional: 'Stores event data',        eleve: 'Builds timelines and budgets' },
  { traditional: 'Requires manual planning', eleve: 'Intelligent, guided planning' },
  { traditional: 'Generic event tools',      eleve: 'Built for multifamily' },
]

const PRICING_TIERS = [
  { name: 'Starter',      price: '$99',   period: '/month', featured: false, cta: 'Start Free Trial', desc: 'For single-property teams getting started with structured event planning.', features: ['Unlimited event generation', '30 curated templates', 'Vendor directory up to 25', 'Saved event library', 'Email support'] },
  { name: 'Professional', price: '$249',  period: '/month', featured: true,  cta: 'Book a Demo',      desc: 'For lifestyle teams managing active event programmes across a property.',    features: ['Everything in Starter', 'Unlimited vendor directory', 'COI tracking', 'Section-level regeneration', 'Workflow status management', 'Priority support'] },
  { name: 'Portfolio',    price: 'Custom',period: '',        featured: false, cta: 'Contact Sales',    desc: 'For operators managing multiple properties or branded residential portfolios.', features: ['Everything in Professional', 'Multi-property workspace', 'Custom template library', 'Dedicated onboarding', 'SLA support'] },
]

// ─── Shared sub-components ────────────────────────────────────────────────────

// Eyebrow label used in every section header
function Eyebrow({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <p className="text-[0.6rem] font-medium uppercase mb-4"
       style={{ letterSpacing: '0.24em', color: dark ? C.goldDim : C.gold, opacity: dark ? 1 : 0.75 }}>
      {children}
    </p>
  )
}

// Section heading — consistent size and weight
function SectionHeading({ children, dark = false, className = '', style: _style }: { children: React.ReactNode; dark?: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <h2 className={cn('font-serif font-light leading-snug', className)}
        style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: dark ? C.offWhite : C.charcoal }}>
      {children}
    </h2>
  )
}

// Thin decorative rule used in dark sections
function GoldRule() {
  return (
    <div className="flex items-center justify-center gap-4 mb-10">
      <div className="h-px w-14" style={{ backgroundColor: 'rgba(184,149,90,0.30)' }} />
      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'rgba(184,149,90,0.45)' }} />
      <div className="h-px w-14" style={{ backgroundColor: 'rgba(184,149,90,0.30)' }} />
    </div>
  )
}

// PreviewCard — dark glass container for the platform section
function PreviewCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm overflow-hidden flex flex-col"
         style={{ border: `0.5px solid ${C.goldFaint}` }}>
      <div className="px-4 py-2.5 flex items-center gap-2 shrink-0"
           style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderBottom: `0.5px solid rgba(184,149,90,0.10)` }}>
        <div className="flex gap-1.5">
          {[0,1,2].map(i => <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }} />)}
        </div>
        <span className="text-[0.58rem] font-light ml-1" style={{ color: 'rgba(255,255,255,0.22)', letterSpacing: '0.10em' }}>{label}</span>
      </div>
      <div className="p-5 flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>{children}</div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LandingPage() {
  const navigate = useNavigate()
  const { start: startExperience } = useExperience()

  return (
    <div style={{ backgroundColor: C.offWhite }}>

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at 68% 42%, rgba(184,149,90,0.08) 0%, transparent 62%)' }} />
        <div className="absolute top-0 inset-x-0 h-px" style={{ backgroundColor: 'rgba(184,149,90,0.25)' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-24 sm:pt-32 sm:pb-36 text-center">
          <p className="text-[0.6rem] font-medium uppercase mb-10 animate-fade-up"
             style={{ letterSpacing: '0.32em', color: C.goldDim }}>
            Luxury residential event planning
          </p>

          <h1 className="font-serif font-light leading-[1.06] mb-7 animate-fade-up animate-delay-100"
              style={{ fontSize: 'clamp(2.5rem, 6.5vw, 4.5rem)', color: C.offWhite }}>
            From blank calendar
            <br />
            to{' '}
            <em className="italic" style={{ color: C.goldLight }}>resident-ready plan</em>
            <br />
            in minutes.
          </h1>

          <p className="font-light leading-[1.9] mb-12 max-w-lg mx-auto animate-fade-up animate-delay-200"
             style={{ fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', color: 'rgba(255,255,255,0.42)' }}>
            Elevé gives property managers and lifestyle teams an intelligent platform
            to plan, manage, and deliver exceptional resident events, with vendor
            tracking, status workflows, and ready-to-send communications built in.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 animate-fade-up animate-delay-300">
            <Button variant="gold" size="lg" className="w-full sm:w-auto" onClick={startExperience}>
              Experience Elevé
            </Button>
            <button type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center text-[0.78rem] font-medium tracking-[0.10em] uppercase px-9 py-3.5 rounded-sm border transition-all duration-200"
              style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.45)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(184,149,90,0.40)'; (e.currentTarget as HTMLButtonElement).style.color = C.goldLight }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)' }}
              onClick={() => window.open('mailto:demo@eleve.app?subject=Demo Request', '_blank')}>
              Book a Demo
            </button>
          </div>

          <p className="text-[0.68rem] font-light mt-6 animate-fade-up animate-delay-400"
             style={{ color: 'rgba(255,255,255,0.18)' }}>
            No account required to explore the demo
          </p>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-px bg-white/5" />
      </section>

      {/* ── 2. SOCIAL PROOF STRIP ───────────────────────────────────────────── */}
      <section style={{ borderBottom: `0.5px solid ${C.bdrLight}`, backgroundColor: C.offWhite }}>
        <div className="max-w-5xl mx-auto px-6 py-4 overflow-x-auto">
          <div className="flex items-center justify-start sm:justify-center gap-x-7 flex-nowrap sm:flex-wrap">
            {PROPERTY_TYPES.map((type, i) => (
              <span key={type} className="flex items-center gap-7 shrink-0">
                <span className="text-[0.58rem] font-medium uppercase whitespace-nowrap"
                      style={{ letterSpacing: '0.16em', color: C.muted }}>
                  {type}
                </span>
                {i < PROPERTY_TYPES.length - 1 && (
                  <span className="w-px h-3 shrink-0" style={{ backgroundColor: C.bdrLight }} />
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PROBLEM STATEMENT ────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-6 py-20 sm:py-28 text-center">
        <Eyebrow>The problem</Eyebrow>
        <SectionHeading className="mb-6" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)' } as React.CSSProperties}>
          Planning great resident events<br />takes hours you don't have.
        </SectionHeading>
        <p className="font-light leading-[1.9] max-w-xl mx-auto"
           style={{ fontSize: '0.9rem', color: C.muted }}>
          Most property teams are building event plans from scratch every time: searching vendor
          contacts across emails, copying budgets from last year's spreadsheet, writing invitation
          copy at 10pm. Elevé replaces that entire process with a single, structured workflow.
        </p>
      </section>

      {/* ── 4. PLATFORM PREVIEW ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.charcoal, borderTop: `0.5px solid rgba(184,149,90,0.12)`, borderBottom: `0.5px solid rgba(184,149,90,0.12)` }}>
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center mb-14">
            <Eyebrow dark>The platform</Eyebrow>
            <SectionHeading dark>Everything in one place, from brief to resident email.</SectionHeading>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <PreviewCard label="Generated event plan">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.goldDim }} />
                  <span className="text-[0.58rem] uppercase font-medium" style={{ letterSpacing: '0.14em', color: C.goldDim }}>
                    Cocktail Reception · Summer
                  </span>
                </div>
                <p className="font-serif font-light leading-snug" style={{ fontSize: '1rem', color: C.offWhite }}>
                  Rooftop Social at Dusk
                </p>
                <p className="font-light leading-[1.7]" style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.32)' }}>
                  A curated evening of passed appetisers and signature cocktails as the city lights come up.
                </p>
                <div className="pt-1 space-y-1.5">
                  {['6:45 PM  Staff arrival', '7:00 PM  Doors open', '7:30 PM  Appetisers begin', '9:30 PM  Last call', '10:00 PM Close'].map((line) => (
                    <div key={line} className="flex gap-3 text-[0.63rem]">
                      <span style={{ color: C.goldDim, minWidth: 52 }}>{line.split('  ')[0]}</span>
                      <span style={{ color: 'rgba(255,255,255,0.40)' }}>{line.split('  ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </PreviewCard>

            <PreviewCard label="Vendor directory">
              <div className="space-y-2">
                <p className="text-[0.58rem] uppercase font-medium mb-3" style={{ letterSpacing: '0.14em', color: C.goldDim }}>
                  Catering · 3 vendors
                </p>
                {[
                  { name: 'Terroir Catering Co.', tier: 'Premium', coi: 'COI ✓',  ok: true },
                  { name: 'The Larder Group',     tier: 'Luxury',  coi: 'COI ✓',  ok: true },
                  { name: 'Provision & Co.',      tier: 'Mid',     coi: 'Pending', ok: false },
                ].map((v) => (
                  <div key={v.name} className="flex items-center gap-2 px-3 py-2 rounded-sm"
                       style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `0.5px solid rgba(180,166,150,0.10)` }}>
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: C.goldDim }} />
                    <span className="flex-1 text-[0.72rem] font-light truncate" style={{ color: 'rgba(255,255,255,0.70)' }}>{v.name}</span>
                    <span className="text-[0.57rem] font-medium uppercase" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>{v.tier}</span>
                    <span className={cn('text-[0.55rem] font-medium', v.ok ? 'text-green-400' : 'text-amber-400/70')}>{v.coi}</span>
                  </div>
                ))}
              </div>
            </PreviewCard>

            <PreviewCard label="Saved event library">
              <div className="space-y-1.5">
                {[
                  { title: 'Rooftop Social at Dusk', status: 'Confirmed',   type: 'Cocktail Reception', s: 0 },
                  { title: 'Summer Pool Party',       status: 'In Planning', type: 'Pool Party',          s: 1 },
                  { title: 'Wine & Cheese Evening',   status: 'Delivered',   type: 'Wine Tasting',        s: 2 },
                  { title: 'Wellness Morning',        status: 'In Planning', type: 'Yoga & Wellness',     s: 1 },
                  { title: 'Holiday Resident Gala',   status: 'Confirmed',   type: 'Holiday Party',       s: 0 },
                ].map((e) => (
                  <div key={e.title} className="px-3 py-2.5 rounded-sm"
                       style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `0.5px solid rgba(180,166,150,0.10)` }}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn('text-[0.53rem] font-medium px-1.5 py-px rounded-sm border', [
                        'text-green-400 border-green-900/50 bg-green-900/20',
                        'text-blue-400/80 border-blue-900/50 bg-blue-900/20',
                        'text-white/30 border-white/10 bg-white/5',
                      ][e.s])}>
                        {e.status}
                      </span>
                      <span className="text-[0.58rem] font-light" style={{ color: 'rgba(184,149,90,0.50)' }}>{e.type}</span>
                    </div>
                    <p className="font-serif font-light leading-snug" style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.65)' }}>{e.title}</p>
                  </div>
                ))}
              </div>
            </PreviewCard>
          </div>
        </div>
      </section>

      {/* ── 5. CORE FEATURES ────────────────────────────────────────────────── */}
      <section>
        <div className="text-center pt-18 pb-12 px-6" style={{ paddingTop: '4.5rem' }}>
          <Eyebrow>What Elevé does</Eyebrow>
          <SectionHeading>Built for the full event lifecycle</SectionHeading>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] mx-6 lg:mx-10 mb-0"
             style={{ backgroundColor: C.bdrLight }}>
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <div key={title}
                 className="p-8 sm:p-10 transition-colors duration-300 animate-fade-up"
                 style={{ backgroundColor: C.offWhite, animationDelay: `${i * 60}ms` }}
                 onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fff')}
                 onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.offWhite)}>
              <div className="w-10 h-10 border flex items-center justify-center mb-7"
                   style={{ borderColor: 'rgba(184,149,90,0.22)' }}>
                <Icon size={16} className="text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-light mb-3 leading-snug"
                  style={{ fontSize: '1.08rem', color: C.charcoal }}>{title}</h3>
              <p className="font-light leading-[1.8]"
                 style={{ fontSize: '0.82rem', color: C.muted }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. PLANNING IMPACT ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.charcoal, borderTop: `0.5px solid rgba(184,149,90,0.12)` }}>
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center mb-14">
            <Eyebrow dark>The impact</Eyebrow>
            <SectionHeading dark>Built to save time at every step.</SectionHeading>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {IMPACT_STATS.map(({ stat, label, desc, glyph }) => (
              <div key={label}
                   className="px-8 py-8 rounded-sm transition-colors duration-200"
                   style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `0.5px solid ${C.goldFaint}` }}
                   onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)')}
                   onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')}>
                <div className="flex items-center gap-3 mb-5">
                  <span style={{ fontSize: '0.82rem', color: 'rgba(184,149,90,0.38)' }} aria-hidden>{glyph}</span>
                  <span className="font-serif font-light" style={{ fontSize: '2.25rem', color: C.goldLight }}>{stat}</span>
                </div>
                <p className="font-serif font-light mb-2" style={{ fontSize: '1rem', color: C.offWhite }}>{label}</p>
                <p className="font-light leading-relaxed" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. WHO IT'S FOR ────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
        <div className="text-center mb-14">
          <Eyebrow>Who it's for</Eyebrow>
          <SectionHeading>Designed for the people who run the programme</SectionHeading>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PERSONAS.map(({ role, glyph, pain, gain }) => (
            <div key={role} className="rounded-sm overflow-hidden"
                 style={{ border: `1px solid ${C.bdrLight}` }}>
              {/* Card header */}
              <div className="px-6 py-4 flex items-center gap-2.5"
                   style={{ backgroundColor: C.warmGray, borderBottom: `0.5px solid ${C.bdrLight}` }}>
                <span style={{ fontSize: '0.82rem', color: C.gold }} aria-hidden>{glyph}</span>
                <h3 className="font-serif font-light" style={{ fontSize: '0.95rem', color: C.charcoal }}>{role}</h3>
              </div>
              {/* Card body */}
              <div className="px-6 py-5 space-y-4" style={{ backgroundColor: C.offWhite }}>
                <div>
                  <p className="text-[0.58rem] font-medium uppercase mb-1.5"
                     style={{ letterSpacing: '0.12em', color: C.muted }}>Before Elevé</p>
                  <p className="font-light leading-relaxed" style={{ fontSize: '0.78rem', color: C.charLight }}>{pain}</p>
                </div>
                <div style={{ borderTop: `0.5px solid ${C.bdrLight}`, paddingTop: '1rem' }}>
                  <p className="text-[0.58rem] font-medium uppercase mb-1.5"
                     style={{ letterSpacing: '0.12em', color: C.gold, opacity: 0.85 }}>With Elevé</p>
                  <p className="font-light leading-relaxed" style={{ fontSize: '0.78rem', color: C.charcoal }}>{gain}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. AI PLANNING ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.warmGray, borderTop: `0.5px solid ${C.bdrLight}`, borderBottom: `0.5px solid ${C.bdrLight}` }}>
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-14 items-start">
            <div>
              <Eyebrow>Intelligent planning</Eyebrow>
              <SectionHeading className="mb-5">
                From idea to resident-ready event plan in under 60 seconds.
              </SectionHeading>
              <p className="font-light leading-[1.9] mb-8" style={{ fontSize: '0.875rem', color: C.muted }}>
                Elevé combines your event requirements with your property's profile, amenities,
                resident demographics, and community personality to generate event plans designed
                specifically for your community: not a generic template, but a structured document
                ready to act on.
              </p>
              <ul className="space-y-2.5">
                {AI_POINTS.map((pt) => (
                  <li key={pt} className="flex items-start gap-3">
                    <CheckCircle2 size={13} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: 'rgba(184,149,90,0.55)' }} />
                    <span className="font-light" style={{ fontSize: '0.82rem', color: C.charLight }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI plan preview card */}
            <div className="rounded-sm overflow-hidden" style={{ border: `1px solid rgba(184,149,90,0.22)`, backgroundColor: C.charcoal }}>
              <div className="px-6 py-4" style={{ borderBottom: `0.5px solid rgba(184,149,90,0.12)`, backgroundColor: 'rgba(184,149,90,0.06)' }}>
                <div className="flex items-center gap-2">
                  <Zap size={12} style={{ color: C.gold }} strokeWidth={1.5} />
                  <span className="text-[0.6rem] font-medium uppercase" style={{ letterSpacing: '0.16em', color: C.goldLight }}>
                    Tailored plan
                  </span>
                </div>
              </div>
              <div className="px-6 py-6">
                <p className="font-serif font-light mb-1" style={{ fontSize: '1.15rem', color: C.offWhite }}>Summer Rooftop Social</p>
                <p className="text-[0.68rem] font-medium uppercase mb-6" style={{ letterSpacing: '0.12em', color: C.gold }}>
                  Cocktails & skyline views
                </p>
                {[
                  { label: 'Budget',      value: '$3,500 – $5,000' },
                  { label: 'Attendance',  value: '40–60 residents' },
                  { label: 'Bar service', value: 'Full bar, 2 signature cocktails' },
                  { label: 'Staffing',    value: '1 event lead, 2 bar, 2 service' },
                  { label: 'Est. cost',   value: '$4,200 all-in' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2"
                       style={{ borderBottom: `0.5px solid rgba(255,255,255,0.05)` }}>
                    <span className="font-light" style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.32)' }}>{label}</span>
                    <span className="font-light" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.72)' }}>{value}</span>
                  </div>
                ))}
                <div className="mt-5 pt-4" style={{ borderTop: `0.5px solid rgba(255,255,255,0.05)` }}>
                  <p className="text-[0.58rem] font-medium uppercase mb-2" style={{ letterSpacing: '0.12em', color: 'rgba(184,149,90,0.50)' }}>
                    Resident email subject
                  </p>
                  <p className="font-serif font-light italic" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>
                    "Join us on the rooftop this Saturday for cocktails as the city lights up."
                  </p>
                </div>
                {/* Property Intelligence callout */}
                <div className="mt-5 pt-4" style={{ borderTop: `0.5px solid rgba(255,255,255,0.05)` }}>
                  <p className="text-[0.58rem] font-medium uppercase mb-3" style={{ letterSpacing: '0.12em', color: 'rgba(184,149,90,0.50)' }}>
                    Property Intelligence
                  </p>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 rounded-sm px-3 py-2.5" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(184,149,90,0.12)' }}>
                      <p className="text-[0.55rem] font-medium uppercase mb-1.5" style={{ letterSpacing: '0.10em', color: 'rgba(184,149,90,0.45)' }}>Profile</p>
                      <p className="font-serif font-light mb-1" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.70)' }}>99 Hudson</p>
                      <p className="font-light" style={{ fontSize: '0.60rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.6 }}>Luxury Waterfront · Rooftop Terrace · Pool Deck · Resident Lounge</p>
                    </div>
                    <div className="flex items-center self-center shrink-0 px-1" style={{ color: 'rgba(184,149,90,0.35)' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="flex-1 rounded-sm px-3 py-2.5" style={{ backgroundColor: 'rgba(184,149,90,0.06)', border: '0.5px solid rgba(184,149,90,0.18)' }}>
                      <p className="text-[0.55rem] font-medium uppercase mb-1.5" style={{ letterSpacing: '0.10em', color: 'rgba(184,149,90,0.55)' }}>Generated</p>
                      <p className="font-serif font-light mb-1" style={{ fontSize: '0.72rem', color: 'rgba(232,213,176,0.85)' }}>Hudson Golden Hour</p>
                      <p className="font-light" style={{ fontSize: '0.60rem', color: 'rgba(255,255,255,0.28)', lineHeight: 1.6 }}>Waterfront Cocktail Experience · Sunset Networking Lounge</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. VENDOR HUB ──────────────────────────────────────────────────── */}
      <section>
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-14 items-start">

            {/* Vendor directory visual */}
            <div className="rounded-sm overflow-hidden order-2 sm:order-1"
                 style={{ border: `1px solid ${C.bdrLight}` }}>
              <div className="px-6 py-4 flex items-center justify-between"
                   style={{ backgroundColor: C.warmGray, borderBottom: `0.5px solid ${C.bdrLight}` }}>
                <p className="text-[0.6rem] font-medium uppercase" style={{ letterSpacing: '0.16em', color: C.muted }}>
                  Vendor directory
                </p>
                <span className="font-serif font-light" style={{ fontSize: '1.5rem', color: C.charcoal }}>12</span>
              </div>
              <div style={{ backgroundColor: C.offWhite }}>
                {[
                  { cat: 'Catering',        n: 3, coi: 2 },
                  { cat: 'Bar & Beverage',  n: 2, coi: 2 },
                  { cat: 'Entertainment',   n: 2, coi: 1 },
                  { cat: 'Staffing',        n: 2, coi: 2 },
                  { cat: 'Décor & Floral',  n: 2, coi: 1 },
                  { cat: 'AV & Production', n: 1, coi: 1 },
                ].map(({ cat, n, coi }) => (
                  <div key={cat} className="flex items-center gap-3 px-6 py-3"
                       style={{ borderBottom: `0.5px solid ${C.bdrLighter}` }}>
                    <span className="flex-1 font-light" style={{ fontSize: '0.78rem', color: C.charLight }}>{cat}</span>
                    <span className="font-medium tabular-nums" style={{ fontSize: '0.72rem', color: C.gold }}>{n}</span>
                    <span className="font-light" style={{ fontSize: '0.62rem', color: C.muted, minWidth: 44, textAlign: 'right' }}>
                      {coi}/{n} COI
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 sm:order-2">
              <Eyebrow>Vendor hub</Eyebrow>
              <SectionHeading className="mb-5">Your vendor directory, always ready.</SectionHeading>
              <p className="font-light leading-[1.9] mb-8" style={{ fontSize: '0.875rem', color: C.muted }}>
                Stop searching your inbox for the caterer's contact. Elevé maintains your entire
                vendor directory, with COI tracking, price tiers, and automatic matching to every
                event you generate.
              </p>
              <ul className="space-y-2.5">
                {VENDOR_POINTS.map((pt) => (
                  <li key={pt} className="flex items-start gap-3">
                    <CheckCircle2 size={13} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: 'rgba(184,149,90,0.55)' }} />
                    <span className="font-light" style={{ fontSize: '0.82rem', color: C.charLight }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── 10. WORKFLOW ───────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.warmGray, borderTop: `0.5px solid ${C.bdrLight}`, borderBottom: `0.5px solid ${C.bdrLight}` }}>
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center mb-14">
            <Eyebrow>Workflow management</Eyebrow>
            <SectionHeading>From draft to delivered, tracked every step.</SectionHeading>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {WORKFLOW_POINTS.map(({ status, desc, dot }) => (
              <div key={status} className="rounded-sm px-5 py-6"
                   style={{ backgroundColor: C.offWhite, border: `1px solid ${C.bdrLight}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dot }} />
                  <span className="text-[0.6rem] font-medium uppercase" style={{ letterSpacing: '0.10em', color: C.muted }}>
                    {status}
                  </span>
                </div>
                <p className="font-light leading-relaxed" style={{ fontSize: '0.78rem', color: C.charLight }}>{desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 font-light" style={{ fontSize: '0.78rem', color: C.muted }}>
            Every section of every plan is editable and regeneratable in place: timeline, catering, budget, email, and more.
          </p>
        </div>
      </section>

      {/* ── 11. BUILT FOR MULTIFAMILY ──────────────────────────────────────── */}
      <section style={{ backgroundColor: C.charcoal, borderTop: `0.5px solid rgba(184,149,90,0.12)` }}>
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center mb-14">
            <Eyebrow dark>Event programming</Eyebrow>
            <SectionHeading dark className="mb-4">Every event format, covered.</SectionHeading>
            <p className="font-light max-w-xl mx-auto leading-[1.85]"
               style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.38)' }}>
              Designed specifically for luxury condominiums, multifamily communities,
              branded residences, and mixed-use developments.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[1px]"
               style={{ backgroundColor: 'rgba(184,149,90,0.10)' }}>
            {EVENT_CATEGORIES.map(({ label, icon: Icon }) => (
              <div key={label}
                   className="flex flex-col items-center justify-center gap-3 py-8 px-4 text-center transition-colors duration-200"
                   style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                   onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
                   onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}>
                <div className="w-9 h-9 border flex items-center justify-center"
                     style={{ borderColor: 'rgba(184,149,90,0.20)' }}>
                  <Icon size={15} style={{ color: C.gold }} strokeWidth={1.25} />
                </div>
                <span className="font-light leading-snug" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.58)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. WHY ELEVÉ IS DIFFERENT ─────────────────────────────────────── */}
      <section style={{ backgroundColor: C.warmGray, borderTop: `0.5px solid ${C.bdrLight}`, borderBottom: `0.5px solid ${C.bdrLight}` }}>
        <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center mb-14">
            <Eyebrow>The difference</Eyebrow>
            <SectionHeading className="mb-3">Why Elevé Is Different</SectionHeading>
            <p className="font-light max-w-md mx-auto leading-[1.85]"
               style={{ fontSize: '0.875rem', color: C.muted }}>
              Most event software helps manage events after they're planned.
              <br />Elevé helps create the event itself.
            </p>
          </div>

          <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${C.bdrLight}` }}>
            {/* Header row */}
            <div className="grid grid-cols-2" style={{ backgroundColor: C.charcoal }}>
              <div className="px-7 py-4" style={{ borderRight: `0.5px solid rgba(255,255,255,0.06)` }}>
                <p className="text-[0.58rem] font-medium uppercase"
                   style={{ letterSpacing: '0.16em', color: 'rgba(255,255,255,0.28)' }}>
                  Traditional Event Software
                </p>
              </div>
              <div className="px-7 py-4">
                <p className="text-[0.58rem] font-medium uppercase"
                   style={{ letterSpacing: '0.16em', color: C.gold }}>
                  Elevé
                </p>
              </div>
            </div>
            {/* Data rows */}
            {COMPARISON_ROWS.map(({ traditional, eleve }, i) => (
              <div key={traditional} className="grid grid-cols-2"
                   style={{ backgroundColor: i % 2 === 0 ? C.offWhite : '#fff', borderTop: `0.5px solid ${C.bdrLighter}` }}>
                <div className="px-7 py-4 flex items-center gap-3"
                     style={{ borderRight: `0.5px solid ${C.bdrLighter}` }}>
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: 'rgba(180,166,150,0.45)' }} />
                  <span className="font-light" style={{ fontSize: '0.82rem', color: C.muted }}>{traditional}</span>
                </div>
                <div className="px-7 py-4 flex items-center gap-3">
                  <CheckCircle2 size={13} strokeWidth={1.5} style={{ color: 'rgba(184,149,90,0.55)', flexShrink: 0 }} />
                  <span className="font-light" style={{ fontSize: '0.82rem', color: C.charcoal }}>{eleve}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. PULL-QUOTE ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.charcoal, borderTop: `0.5px solid rgba(184,149,90,0.12)` }}>
        <div className="max-w-2xl mx-auto px-6 py-22 sm:py-28 text-center" style={{ paddingTop: '5.5rem', paddingBottom: '5.5rem' }}>
          <GoldRule />
          <blockquote className="font-serif italic font-light leading-[1.5] mb-5"
                      style={{ fontSize: 'clamp(1.45rem, 3.2vw, 1.9rem)', color: 'rgba(232,213,176,0.88)' }}>
            The best resident events feel effortless.
            <br />
            The planning behind them never was.
          </blockquote>
          <p className="uppercase font-light mb-14"
             style={{ fontSize: '0.68rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.18)' }}>
            Until now.
          </p>
          <Button variant="gold" size="lg" onClick={startExperience}>
            Experience Elevé
          </Button>
        </div>
      </section>

      {/* ── 14. PRICING ────────────────────────────────────────────────────── */}
      <section>
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
          <div className="text-center mb-14">
            <Eyebrow>Pricing</Eyebrow>
            <SectionHeading className="mb-2">Simple, transparent pricing.</SectionHeading>
            <p className="font-light" style={{ fontSize: '0.875rem', color: C.muted }}>
              No contracts. Cancel any time. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PRICING_TIERS.map(({ name, price, period, desc, features, cta, featured }) => (
              <div key={name} className="rounded-sm overflow-hidden flex flex-col"
                   style={{ border: featured ? `1px solid rgba(184,149,90,0.35)` : `1px solid ${C.bdrLight}` }}>
                {/* Card header */}
                <div className="px-6 py-5"
                     style={{ backgroundColor: featured ? C.charcoal : C.warmGray, borderBottom: featured ? `0.5px solid rgba(184,149,90,0.15)` : `0.5px solid ${C.bdrLight}` }}>
                  {featured && (
                    <span className="inline-block text-[0.53rem] font-medium uppercase px-2 py-0.5 rounded-sm mb-3"
                          style={{ letterSpacing: '0.12em', backgroundColor: 'rgba(184,149,90,0.14)', color: C.gold, border: `0.5px solid rgba(184,149,90,0.22)` }}>
                      Most popular
                    </span>
                  )}
                  <p className="text-[0.6rem] font-medium uppercase mb-1.5"
                     style={{ letterSpacing: '0.14em', color: featured ? 'rgba(184,149,90,0.70)' : C.muted }}>
                    {name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif font-light" style={{ fontSize: '2rem', color: featured ? C.offWhite : C.charcoal }}>{price}</span>
                    {period && <span className="font-light" style={{ fontSize: '0.78rem', color: featured ? 'rgba(255,255,255,0.32)' : C.muted }}>{period}</span>}
                  </div>
                </div>
                {/* Card body */}
                <div className="px-6 py-6 flex flex-col flex-1"
                     style={{ backgroundColor: featured ? 'rgba(28,28,30,0.96)' : C.offWhite }}>
                  <p className="font-light mb-6 leading-relaxed"
                     style={{ fontSize: '0.78rem', color: featured ? 'rgba(255,255,255,0.42)' : C.muted }}>
                    {desc}
                  </p>
                  <ul className="space-y-2 mb-8 flex-1">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle2 size={12} strokeWidth={1.5} className="shrink-0 mt-0.5"
                                      style={{ color: featured ? 'rgba(184,149,90,0.55)' : 'rgba(184,149,90,0.45)' }} />
                        <span className="font-light" style={{ fontSize: '0.78rem', color: featured ? 'rgba(255,255,255,0.62)' : C.charLight }}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button type="button"
                    className="w-full text-[0.7rem] font-medium uppercase py-2.5 rounded-sm border transition-all duration-200"
                    style={featured ? {
                      letterSpacing: '0.10em', backgroundColor: C.gold, borderColor: C.gold, color: '#fff',
                    } : {
                      letterSpacing: '0.10em', backgroundColor: 'transparent', borderColor: 'rgba(180,166,150,0.38)', color: C.charLight,
                    }}
                    onClick={() => window.open(`mailto:demo@eleve.app?subject=${encodeURIComponent(cta + ': ' + name)}`, '_blank')}>
                    {cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 font-light" style={{ fontSize: '0.72rem', color: C.muted }}>
            Pricing is indicative. Contact us for enterprise or multi-property arrangements.
          </p>
        </div>
      </section>

      {/* ── 15. FINAL CTA ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.charcoal, borderTop: `0.5px solid rgba(184,149,90,0.12)` }}>
        <div className="max-w-xl mx-auto px-6 py-20 sm:py-28 text-center">
          <Eyebrow dark>Get started</Eyebrow>
          <SectionHeading dark className="mb-5" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.25rem)' } as React.CSSProperties}>
            Ready to see Elevé in action?
          </SectionHeading>
          <p className="font-light mb-12 leading-[1.9]"
             style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.38)' }}>
            Step inside the live platform with a fully planned luxury community,
            guided, interactive, and no account required. Or book a 20-minute
            walkthrough with the team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button variant="gold" size="lg" className="w-full sm:w-auto" onClick={startExperience}>
              Experience Elevé
            </Button>
            <button type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center text-[0.78rem] font-medium tracking-[0.10em] uppercase px-9 py-3.5 rounded-sm border transition-all duration-200"
              style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.42)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(184,149,90,0.38)'; (e.currentTarget as HTMLButtonElement).style.color = C.goldLight }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.42)' }}
              onClick={() => window.open('mailto:demo@eleve.app?subject=Book a Demo', '_blank')}>
              Book a Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── 16. FOOTER ─────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `0.5px solid ${C.bdrLight}`, backgroundColor: C.offWhite }}>
        <div className="max-w-5xl mx-auto px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif font-light" style={{ fontSize: '1rem', letterSpacing: '0.05em', color: C.charcoal }}>Elevé</p>
          <div className="flex items-center gap-7">
            {[
              { label: 'Dashboard', fn: () => navigate('/dashboard') },
              { label: 'Plan Event', fn: () => navigate('/planner') },
              { label: 'Contact',    fn: () => window.open('mailto:demo@eleve.app', '_blank') },
            ].map(({ label, fn }) => (
              <button key={label} type="button" onClick={fn}
                className="text-[0.63rem] font-light transition-colors duration-150 hover:text-charcoal"
                style={{ color: C.muted, letterSpacing: '0.10em' }}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-[0.6rem] font-light" style={{ color: 'rgba(138,133,128,0.45)', letterSpacing: '0.06em' }}>
            © {new Date().getFullYear()} Elevé Event Operations
          </p>
        </div>
      </footer>

    </div>
  )
}
