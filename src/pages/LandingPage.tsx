import { useNavigate } from 'react-router-dom'
import { Sparkles, CalendarDays, DollarSign, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/SectionLabel'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-Powered Planning',
    body: "Generate complete event concepts tailored to your residents' demographics, season, and budget \u2014 in seconds.",
  },
  {
    icon: CalendarDays,
    title: 'Seasonal Intelligence',
    body: 'Recommendations shift with the seasons \u2014 rooftop summer gatherings to cozy holiday cocktail evenings.',
  },
  {
    icon: DollarSign,
    title: 'Budget Optimized',
    body: 'Every plan respects your budget with itemized cost breakdowns and smart allocation suggestions.',
  },
  {
    icon: Users,
    title: 'Resident-Centric',
    body: 'Tailored for your specific community \u2014 young professionals, families, retirees, or mixed demographics.',
  },
]

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero */}
      <section className="bg-charcoal relative overflow-hidden py-28 px-6 text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 65% 30%, rgba(184,149,90,0.07) 0%, transparent 65%)',
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-gold mb-6 animate-fade-up">
            Powered by Claude AI
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light text-off-white leading-[1.08] mb-6 animate-fade-up animate-delay-100">
            Curate events that
            <br />
            <em className="font-light text-gold-light">elevate living</em>
          </h1>
          <p className="text-white/50 font-light text-base leading-relaxed mb-10 animate-fade-up animate-delay-200">
            An intelligent planning assistant for luxury residential properties.
            Design memorable resident experiences in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-3 animate-fade-up animate-delay-300">
            <Button variant="gold" size="lg" onClick={() => navigate('/planner')}>
              Start Planning
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/saved')}
              className="border-white/20 text-gold-light hover:border-gold/50 hover:text-gold"
            >
              View Saved Events
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-4">
        <SectionLabel className="pt-14 pb-8">Why Resident Event AI</SectionLabel>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.5px] bg-border mx-6 sm:mx-8">
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className="bg-off-white hover:bg-white transition-colors duration-200 p-8 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-10 h-10 bg-charcoal rounded-sm flex items-center justify-center mb-6">
                <Icon size={17} className="text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl font-normal text-charcoal mb-3">
                {title}
              </h3>
              <p className="text-[0.85rem] text-muted font-light leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-charcoal mt-16 py-20 px-6 text-center">
        <p className="font-serif italic text-2xl text-gold-light font-light mb-2">
          &ldquo;Great events don&rsquo;t happen by accident.&rdquo;
        </p>
        <p className="text-[0.75rem] text-white/35 tracking-[0.1em] uppercase mb-10">
          They&rsquo;re crafted with intention.
        </p>
        <Button variant="gold" size="lg" onClick={() => navigate('/planner')}>
          Create Your First Event
        </Button>
      </section>
    </div>
  )
}
