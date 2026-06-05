import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Calendar, Rocket, ArrowRight, Check } from 'lucide-react'
import { AnimatedPage, PageWrapper } from '@/components/layout/AnimatedPage'
import { Navbar } from '@/components/layout/Navbar'
import { Button, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

const STRATEGIES = [
  {
    id: 'single',
    icon: FileText,
    label: 'Single Content Piece',
    desc: 'Create one high-quality, platform-specific content asset. Perfect for product launches, announcements, or testing a new format.',
    tags: ['Quick', 'Focused'],
    color: '#A7B0BE',
    disabled: false,
  },
  {
    id: 'campaign',
    icon: Calendar,
    label: 'Campaign Planning',
    desc: 'Build a full multi-platform content campaign with AI strategy, content calendar, and coordinated execution across 30 days.',
    tags: ['Most Popular', 'AI-Powered'],
    color: '#1E6BFF',
    recommended: true,
    disabled: false,
  },
  {
    id: 'engine',
    icon: Rocket,
    label: 'Full Content Engine',
    desc: 'Autonomous, always-on content system that continuously generates, schedules, and publishes content for your brand.',
    tags: ['Coming Soon'],
    color: '#A7B0BE',
    disabled: true,
  },
]

const pathDescriptions = {
  single: 'You\'ll define a single content piece, choose your platform and format, then AI will generate a complete script, storyboard, and publish-ready content.',
  campaign: 'AI subagents will analyze trends, competitors, and your brand — then build a complete 30-day content calendar with scripts, formats, and platform strategy.',
  engine: 'A fully autonomous content engine that learns your brand and publishes consistently. This feature is coming in Q1 2025.',
}

export default function Strategy() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('campaign')

  return (
    <>
      <Navbar />
      <PageWrapper>
        <AnimatedPage>
          <div className="max-w-5xl mx-auto py-16 px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-14"
            >
              <Badge variant="blue" dot className="mb-4">Step 3 of 9</Badge>
              <h1 className="font-display text-4xl font-bold text-brand-white mb-3" style={{ letterSpacing: '-0.02em' }}>
                Choose your workflow
              </h1>
              <p className="text-brand-muted text-base max-w-md mx-auto">
                Select the path that best fits your goal. You can always upgrade later.
              </p>
            </motion.div>

            {/* Strategy Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {STRATEGIES.map((strat, i) => {
                const Icon = strat.icon
                const isSelected = selected === strat.id
                return (
                  <motion.div
                    key={strat.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
                    whileHover={strat.disabled ? {} : { y: -4, scale: 1.01 }}
                    transition2={{ duration: 0.2 }}
                    onClick={() => !strat.disabled && setSelected(strat.id)}
                    className={cn(
                      'relative rounded-3xl p-7 border flex flex-col gap-5 transition-all duration-300',
                      strat.disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer',
                      isSelected && !strat.disabled
                        ? 'border-brand-blue bg-brand-blue/8 shadow-glow'
                        : strat.recommended
                        ? 'border-brand-blue/40 bg-white/3 hover:border-brand-blue/70'
                        : 'border-white/8 bg-white/2 hover:border-white/15',
                    )}
                  >
                    {/* Recommended badge */}
                    {strat.recommended && (
                      <div className="absolute -top-3 left-6">
                        <span className="bg-brand-blue text-white text-xs font-semibold px-3 py-1 rounded-full shadow-glow-sm">
                          ★ Recommended
                        </span>
                      </div>
                    )}

                    {/* Selected check */}
                    {isSelected && !strat.disabled && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-5 right-5 w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center"
                      >
                        <Check size={12} className="text-white" />
                      </motion.div>
                    )}

                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: `${strat.color}18`, border: `1px solid ${strat.color}30` }}
                    >
                      <Icon size={22} style={{ color: strat.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-brand-white mb-2">{strat.label}</h3>
                      <p className="text-sm text-brand-muted leading-relaxed">{strat.desc}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {strat.tags.map(tag => (
                        <span key={tag} className={cn(
                          'text-xs px-2.5 py-1 rounded-full border',
                          tag === 'Coming Soon'
                            ? 'border-white/10 text-brand-muted bg-white/4'
                            : tag === 'Most Popular' || tag === 'AI-Powered'
                            ? 'border-brand-blue/30 text-brand-blue bg-brand-blue/10'
                            : 'border-white/10 text-brand-muted bg-white/4'
                        )}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Select button */}
                    {!strat.disabled && (
                      <button
                        onClick={() => setSelected(strat.id)}
                        className={cn(
                          'w-full py-2.5 rounded-xl text-sm font-medium border transition-all duration-200',
                          isSelected
                            ? 'bg-brand-blue border-brand-blue text-white'
                            : 'border-white/10 text-brand-muted hover:border-white/20 hover:text-brand-white'
                        )}
                      >
                        {isSelected ? '✓ Selected' : 'Select'}
                      </button>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Description of selected path */}
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-2xl p-5 mb-8 flex items-start gap-4"
            >
              <div className="w-1 h-full min-h-10 rounded-full bg-brand-blue flex-shrink-0" />
              <p className="text-sm text-brand-muted leading-relaxed">{pathDescriptions[selected]}</p>
            </motion.div>

            {/* CTA */}
            <div className="flex justify-center">
              <Button
                onClick={() => navigate('/campaign')}
                size="lg"
                disabled={!selected || STRATEGIES.find(s => s.id === selected)?.disabled}
                className="group"
              >
                Continue with {STRATEGIES.find(s => s.id === selected)?.label}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </AnimatedPage>
      </PageWrapper>
    </>
  )
}
