import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { AnimatedPage, PageWrapper } from '@/components/layout/AnimatedPage'
import { Navbar } from '@/components/layout/Navbar'
import { Button, Card } from '@/components/ui'
import { useBrandStore } from '@/store'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 1, label: 'Brand Basics', desc: 'Core identity' },
  { id: 2, label: 'Business Details', desc: 'Product & USP' },
  { id: 3, label: 'Target Audience', desc: 'Who you serve' },
  { id: 4, label: 'Campaign Goal', desc: 'Your objective' },
  { id: 5, label: 'Tone & Style', desc: 'Voice calibration' },
  { id: 6, label: 'Brand Theme', desc: 'Visual identity' },
]

const OBJECTIVES = [
  { id: 'Awareness', label: 'Awareness', desc: 'Grow brand recognition', icon: '📢' },
  { id: 'Conversion', label: 'Conversion', desc: 'Drive sales and signups', icon: '🎯' },
  { id: 'Engagement', label: 'Engagement', desc: 'Build community', icon: '💬' },
  { id: 'Launch', label: 'Launch', desc: 'Announce something new', icon: '🚀' },
]

const THEMES = [
  { id: 'dark', label: 'Dark / Premium', desc: 'Luxury, tech-forward, sophisticated', color: '#07111F', border: '#1E6BFF' },
  { id: 'bright', label: 'Bright / Bold', desc: 'Energetic, youthful, expressive', color: '#FFF9F0', border: '#FF6B35' },
  { id: 'warm', label: 'Warm / Human', desc: 'Approachable, authentic, community', color: '#FDF4EC', border: '#E8A87C' },
  { id: 'tech', label: 'Tech / Clean', desc: 'Minimal, precise, data-driven', color: '#0F1923', border: '#00E5CC' },
]

export default function BrandSetup() {
  const navigate = useNavigate()
  const store = useBrandStore()
  const [step, setStep] = useState(1)
  const [local, setLocal] = useState({
    brandName: store.brandName || '',
    category: store.category || '',
    website: store.website || '',
    product: store.product || '',
    usp: store.usp || '',
    audience: store.audience || '',
    audiencePainPoints: store.audiencePainPoints || '',
    audienceInterests: store.audienceInterests || '',
    campaignObjective: store.campaignObjective || 'Awareness',
    tone: store.tone || { formal: 50, serious: 50, minimal: 50 },
    theme: store.theme || 'dark',
  })

  function update(field, value) {
    setLocal(prev => ({ ...prev, [field]: value }))
  }

  function updateTone(key, value) {
    setLocal(prev => ({ ...prev, tone: { ...prev.tone, [key]: value } }))
  }

  function handleNext() {
    if (step < 6) {
      setStep(s => s + 1)
    } else {
      store.setBrand(local)
      navigate('/strategy')
    }
  }

  function handleBack() {
    if (step > 1) setStep(s => s - 1)
    else navigate('/')
  }

  const inputCls = 'w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-brand-white placeholder-brand-muted text-sm focus:outline-none focus:border-brand-blue focus:shadow-glow-sm transition-all duration-200'

  const stepContent = {
    1: (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">Brand Name *</label>
          <input className={inputCls} value={local.brandName} onChange={e => update('brandName', e.target.value)} placeholder="e.g. Luminary Studio" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">Brand Category</label>
          <input className={inputCls} value={local.category} onChange={e => update('category', e.target.value)} placeholder="e.g. SaaS, D2C, Consulting" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">Website URL</label>
          <input className={inputCls} value={local.website} onChange={e => update('website', e.target.value)} placeholder="https://yourbrand.com" type="url" />
        </div>
      </div>
    ),
    2: (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">Product / Service Description *</label>
          <textarea className={cn(inputCls, 'resize-none')} rows={4} value={local.product} onChange={e => update('product', e.target.value)}
            placeholder="What do you sell or provide? Be specific about your offering, how it works, and who it's for." />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">Unique Selling Point (USP)</label>
          <textarea className={cn(inputCls, 'resize-none')} rows={3} value={local.usp} onChange={e => update('usp', e.target.value)}
            placeholder="What makes your brand different from competitors? Why should customers choose you?" />
        </div>
      </div>
    ),
    3: (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">Target Audience</label>
          <input className={inputCls} value={local.audience} onChange={e => update('audience', e.target.value)}
            placeholder="e.g. Startup founders aged 25–40, DTC brands, SMB owners" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">Their Pain Points</label>
          <textarea className={cn(inputCls, 'resize-none')} rows={3} value={local.audiencePainPoints} onChange={e => update('audiencePainPoints', e.target.value)}
            placeholder="What problems does your audience face that your product solves?" />
        </div>
        <div>
          <label className="block text-xs font-medium text-brand-muted mb-1.5">Their Interests</label>
          <input className={inputCls} value={local.audienceInterests} onChange={e => update('audienceInterests', e.target.value)}
            placeholder="e.g. Growth hacking, design tools, productivity, AI, sustainability" />
        </div>
      </div>
    ),
    4: (
      <div className="grid grid-cols-2 gap-3">
        {OBJECTIVES.map(obj => (
          <motion.button
            key={obj.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => update('campaignObjective', obj.id)}
            className={cn(
              'flex flex-col items-center gap-2 p-5 rounded-2xl border text-center transition-all duration-200 cursor-pointer',
              local.campaignObjective === obj.id
                ? 'border-brand-blue bg-brand-blue/10 shadow-glow-sm'
                : 'border-white/8 bg-white/2 hover:border-white/15'
            )}
          >
            <span className="text-2xl">{obj.icon}</span>
            <span className="text-sm font-semibold text-brand-white">{obj.label}</span>
            <span className="text-xs text-brand-muted">{obj.desc}</span>
          </motion.button>
        ))}
      </div>
    ),
    5: (
      <div className="space-y-8">
        {[
          { key: 'formal', leftLabel: 'Formal', rightLabel: 'Casual' },
          { key: 'serious', leftLabel: 'Serious', rightLabel: 'Playful' },
          { key: 'minimal', leftLabel: 'Minimal', rightLabel: 'Bold' },
        ].map(({ key, leftLabel, rightLabel }) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-brand-muted">{leftLabel}</span>
              <span className="text-xs text-brand-blue font-mono">{local.tone[key]}</span>
              <span className="text-sm font-medium text-brand-muted">{rightLabel}</span>
            </div>
            <input
              type="range" min={0} max={100} step={5}
              value={local.tone[key]}
              onChange={e => updateTone(key, Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-brand-muted">0</span>
              <span className="text-xs text-brand-muted">100</span>
            </div>
          </div>
        ))}
      </div>
    ),
    6: (
      <div className="grid grid-cols-2 gap-3">
        {THEMES.map(theme => (
          <motion.button
            key={theme.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => update('theme', theme.id)}
            className={cn(
              'flex flex-col gap-3 p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer',
              local.theme === theme.id
                ? 'border-brand-blue shadow-glow-sm'
                : 'border-white/8 hover:border-white/15'
            )}
          >
            {/* Color preview */}
            <div className="w-full h-12 rounded-xl border border-white/10" style={{ background: theme.color, borderColor: theme.border }} />
            <div>
              <div className="text-sm font-semibold text-brand-white">{theme.label}</div>
              <div className="text-xs text-brand-muted mt-0.5">{theme.desc}</div>
            </div>
            {local.theme === theme.id && (
              <div className="flex items-center gap-1 text-xs text-brand-blue">
                <Check size={12} /> Selected
              </div>
            )}
          </motion.button>
        ))}
      </div>
    ),
  }

  return (
    <>
      <Navbar />
      <PageWrapper>
        <div className="max-w-5xl mx-auto py-12">
          <div className="flex gap-8">
            {/* Left: Step sidebar */}
            <div className="hidden md:block w-56 flex-shrink-0">
              <div className="sticky top-24 space-y-1">
                {STEPS.map((s, i) => {
                  const isDone = s.id < step
                  const isCurrent = s.id === step
                  return (
                    <div key={s.id} className="flex items-stretch gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all duration-300',
                          isCurrent ? 'bg-brand-blue text-white shadow-glow-sm' :
                          isDone ? 'bg-brand-blue/30 text-brand-blue-glow' :
                          'bg-white/6 text-brand-muted'
                        )}>
                          {isDone ? <Check size={12} /> : s.id}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={cn('w-px flex-1 my-1 min-h-8', isDone ? 'bg-brand-blue/30' : 'bg-white/8')} />
                        )}
                      </div>
                      <div className="pb-6">
                        <div className={cn('text-sm font-medium transition-colors', isCurrent ? 'text-brand-white' : isDone ? 'text-brand-blue-mid' : 'text-brand-muted')}>
                          {s.label}
                        </div>
                        <div className="text-xs text-brand-muted">{s.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Content area */}
            <div className="flex-1">
              <div className="glass-elevated rounded-3xl p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-xs text-brand-muted mb-1">Step {step} of {STEPS.length}</div>
                    <h1 className="text-2xl font-semibold text-brand-white">{STEPS[step - 1].label}</h1>
                    <p className="text-sm text-brand-muted mt-1">{STEPS[step - 1].desc}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-brand-blue">{step}<span className="text-brand-muted text-base">/{STEPS.length}</span></div>
                  </div>
                </div>

                {/* Step content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="min-h-60"
                  >
                    {stepContent[step]}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/6">
                  <Button variant="ghost" onClick={handleBack} icon={<ChevronLeft size={16} />}>
                    Back
                  </Button>
                  <Button onClick={handleNext} icon={step === 6 ? undefined : <ChevronRight size={16} />}>
                    {step === 6 ? 'Complete Setup →' : 'Continue'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}
