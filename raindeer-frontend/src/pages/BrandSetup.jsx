import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { AnimatedPage, PageWrapper } from '@/components/layout/AnimatedPage'
import { Navbar } from '@/components/layout/Navbar'
import { Button, Badge } from '@/components/ui'
import { useBrandStore } from '@/store'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const STEPS = [
  { id: 1, label: 'Brand Basics', desc: 'Core identity' },
  { id: 2, label: 'Business Details', desc: 'Product & USP' },
  { id: 3, label: 'Target Audience', desc: 'Who you serve' },
  { id: 4, label: 'Campaign Goal', desc: 'Your objective' },
  { id: 5, label: 'Tone & Style', desc: 'Voice calibration' },
  { id: 6, label: 'Social Profiles', desc: 'Connect channels' },
]

const OBJECTIVES = [
  { id: 'Awareness', label: 'Awareness', desc: 'Grow brand recognition', icon: '📢' },
  { id: 'Conversion', label: 'Conversion', desc: 'Drive sales and signups', icon: '🎯' },
  { id: 'Engagement', label: 'Engagement', desc: 'Build community', icon: '💬' },
  { id: 'Launch', label: 'Launch', desc: 'Announce something new', icon: '🚀' },
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
    linkedInConnected: store.linkedInConnected || false,
  })

  function update(field, value) {
    setLocal(prev => ({ ...prev, [field]: value }))
  }

  function updateTone(key, value) {
    setLocal(prev => ({ ...prev, tone: { ...prev.tone, [key]: value } }))
  }

  const [isLoading, setIsLoading] = useState(false)

  async function handleNext() {
    if (step < 6) {
      setStep(s => s + 1)
    } else {
      setIsLoading(true)
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/brand/${store.brandId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(local)
        })
        const data = await res.json()
        if (data.success) {
          toast.success('Brand setup completed successfully!')
          setStep(1)
          navigate('/dashboard')
        } else {
          console.error('Failed to save brand', data.error)
          toast.error('Failed to save brand: ' + data.error)
        }
      } catch (err) {
        console.error('Error saving brand', err)
        toast.error('Error connecting to backend')
      } finally {
        setIsLoading(false)
      }
    }
  }

  function handleBack() {
    if (step > 1) setStep(s => s - 1)
    else navigate('/')
  }

  const inputCls = 'w-full bg-card border border-hairline-bold rounded-controls px-4 py-2.5 text-ink placeholder-ink-3 text-small focus:outline-none focus:border-cobalt-500 focus:ring-4 focus:ring-cobalt-100 transition-all duration-dur-1'

  const stepContent = {
    1: (
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Brand Name *</label>
          <input className={inputCls} value={local.brandName} onChange={e => update('brandName', e.target.value)} placeholder="e.g. Luminary Studio" required />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Brand Category</label>
          <input className={inputCls} value={local.category} onChange={e => update('category', e.target.value)} placeholder="e.g. SaaS, D2C, Consulting" />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Website URL</label>
          <input className={inputCls} value={local.website} onChange={e => update('website', e.target.value)} placeholder="https://yourbrand.com" type="url" />
        </div>
      </div>
    ),
    2: (
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Product / Service Description *</label>
          <textarea className={cn(inputCls, 'resize-none')} rows={4} value={local.product} onChange={e => update('product', e.target.value)}
            placeholder="What do you sell or provide? Be specific about your offering, how it works, and who it's for." required />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Unique Selling Point (USP)</label>
          <textarea className={cn(inputCls, 'resize-none')} rows={3} value={local.usp} onChange={e => update('usp', e.target.value)}
            placeholder="What makes your brand different from competitors? Why should customers choose you?" />
        </div>
      </div>
    ),
    3: (
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Target Audience</label>
          <input className={inputCls} value={local.audience} onChange={e => update('audience', e.target.value)}
            placeholder="e.g. Startup founders aged 25–40, DTC brands, SMB owners" />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Their Pain Points</label>
          <textarea className={cn(inputCls, 'resize-none')} rows={3} value={local.audiencePainPoints} onChange={e => update('audiencePainPoints', e.target.value)}
            placeholder="What problems does your audience face that your product solves?" />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Their Interests</label>
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
            whileTap={{ scale: 0.98 }}
            onClick={() => update('campaignObjective', obj.id)}
            className={cn(
              'flex flex-col items-center gap-2 p-5 rounded-containers border text-center transition-all duration-dur-2 cursor-pointer',
              local.campaignObjective === obj.id
                ? 'border-cobalt-600 bg-cobalt-50/50 shadow-xs'
                : 'border-hairline bg-card hover:border-hairline-bold'
            )}
          >
            <span className="text-2xl">{obj.icon}</span>
            <span className="text-sm font-semibold text-ink">{obj.label}</span>
            <span className="text-xs text-ink-3">{obj.desc}</span>
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
              <span className="text-sm font-semibold text-ink-2">{leftLabel}</span>
              <span className="text-xs text-cobalt-600 font-mono">{local.tone[key]}</span>
              <span className="text-sm font-semibold text-ink-2">{rightLabel}</span>
            </div>
            <input
              type="range" min={0} max={100} step={5}
              value={local.tone[key]}
              onChange={e => updateTone(key, Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] font-semibold text-ink-3 font-mono">0</span>
              <span className="text-[10px] font-semibold text-ink-3 font-mono">100</span>
            </div>
          </div>
        ))}
      </div>
    ),
    6: (
      <div className="space-y-4">
        <p className="text-small text-ink-2 mb-4 font-sans">Connect your social accounts to enable auto-publishing.</p>
        
        {/* LinkedIn - Interactive */}
        <div className="bg-card border border-hairline rounded-containers p-5 flex items-center justify-between shadow-xs hover:border-hairline-bold transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#0A66C2]/10 rounded-full flex items-center justify-center text-[#0A66C2]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </div>
            <div>
              <div className="font-semibold text-ink text-sm">LinkedIn</div>
              <div className="text-xs text-ink-3">Publish to personal or company pages</div>
            </div>
          </div>
          <Button 
            variant={(store.linkedinPersonalConnected || store.linkedinCompanyConnected) ? "secondary" : "primary"}
            onClick={async () => {
              if (store.linkedinPersonalConnected || store.linkedinCompanyConnected) return;
              try {
                // Save progress first so it's not lost
                await fetch(`${import.meta.env.VITE_API_URL}/api/brand/${store.brandId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(local)
                });
                window.location.href = `${import.meta.env.VITE_API_URL}/api/linkedin/auth/company?brandId=${store.brandId}`;
              } catch(e) {
                console.error('Failed to save before redirect', e);
              }
            }}
          >
            {(store.linkedinPersonalConnected || store.linkedinCompanyConnected) ? "Connected" : "Save & Connect"}
          </Button>
        </div>

        {/* Other Platforms - Coming Soon */}
        {['Instagram', 'X (Twitter)', 'TikTok'].map(platform => (
          <div key={platform} className="bg-snow-2 border border-hairline rounded-containers p-5 flex items-center justify-between opacity-60">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-snow-3 rounded-full flex items-center justify-center text-ink-3">
                <span className="text-xs font-semibold font-mono">{platform[0]}</span>
              </div>
              <div>
                <div className="font-semibold text-ink text-sm">{platform}</div>
                <div className="text-xs text-ink-3">Coming soon</div>
              </div>
            </div>
            <Badge variant="draft">SOON</Badge>
          </div>
        ))}
      </div>
    ),
  }

  return (
    <>
      <Navbar />
      <PageWrapper>
        <div className="max-w-5xl mx-auto py-12 px-4 mt-16">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Step sidebar */}
            <div className="w-full md:w-56 flex-shrink-0">
              <div className="sticky top-24 space-y-1">
                {STEPS.map((s, i) => {
                  const isDone = s.id < step
                  const isCurrent = s.id === step
                  return (
                    <div key={s.id} className="flex items-stretch gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold font-mono flex-shrink-0 transition-all duration-dur-2 border',
                          isCurrent ? 'bg-cobalt-600 text-white border-cobalt-600 shadow-sm' :
                          isDone ? 'bg-cobalt-50 text-cobalt-700 border-cobalt-200/50' :
                          'bg-snow-3 text-ink-3 border-hairline'
                        )}>
                          {isDone ? <Check size={12} /> : s.id}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={cn('w-px flex-1 my-1 min-h-8', isDone ? 'bg-cobalt-300' : 'bg-hairline')} />
                        )}
                      </div>
                      <div className="pb-6">
                        <div className={cn('text-sm font-semibold transition-colors', isCurrent ? 'text-ink' : isDone ? 'text-cobalt-600' : 'text-ink-3')}>
                          {s.label}
                        </div>
                        <div className="text-xs text-ink-3 mt-0.5">{s.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Content area */}
            <div className="flex-1">
              <div className="bg-card border border-hairline rounded-stage p-8 shadow-md">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-hairline">
                  <div>
                    <div className="text-[10px] font-semibold text-ink-3 uppercase tracking-wider font-mono mb-1">Step {step} of {STEPS.length}</div>
                    <h1 className="text-2xl font-serif font-medium text-ink">{STEPS[step - 1].label}</h1>
                    <p className="text-xs text-ink-2 mt-1">{STEPS[step - 1].desc}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-cobalt-600">{step}<span className="text-ink-3 text-base">/{STEPS.length}</span></div>
                  </div>
                </div>

                {/* Step content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.24, ease: 'easeOut' }}
                    className="min-h-60"
                  >
                    {stepContent[step]}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-hairline">
                  <Button variant="ghost" onClick={handleBack} icon={<ChevronLeft size={16} />}>
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={isLoading} icon={step === 6 && !isLoading ? undefined : <ChevronRight size={16} />}>
                    {step === 6 ? (isLoading ? 'Saving...' : 'Complete Setup') : 'Continue'}
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
