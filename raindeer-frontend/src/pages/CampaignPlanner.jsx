import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Calendar } from 'lucide-react'
import { AnimatedPage, PageWrapper } from '@/components/layout/AnimatedPage'
import { Navbar } from '@/components/layout/Navbar'
import { Button, Badge } from '@/components/ui'
import { PlatformBadge } from '@/components/shared/PlatformBadge'
import { useCampaignStore, useBrandStore } from '@/store'
import { cn } from '@/lib/utils'
import avatarsData from '@/data/avatars.json'

const GOALS = ['Awareness', 'Conversion', 'Engagement', 'Launch']
const PLATFORMS = ['Instagram', 'LinkedIn', 'YouTube', 'X', 'TikTok']
const MOODS = [
  { id: 'Dark/Premium', label: 'Dark / Premium', desc: 'Luxury, sophisticated tone' },
  { id: 'Upbeat/Energetic', label: 'Upbeat / Energetic', desc: 'High energy, viral vibes' },
  { id: 'Professional/Calm', label: 'Professional / Calm', desc: 'Measured, trustworthy' },
  { id: 'Bold/Disruptive', label: 'Bold / Disruptive', desc: 'Challenging, provocative' },
]

export default function CampaignPlanner() {
  const navigate = useNavigate()
  const brandStore = useBrandStore()
  const campaignStore = useCampaignStore()

  const [product, setProduct] = useState(campaignStore.productToPromote || '')
  const [message, setMessage] = useState(campaignStore.coreMessage || '')
  const [goal, setGoal] = useState(campaignStore.goal || 'Awareness')
  const [platforms, setPlatforms] = useState(campaignStore.platforms || ['Instagram'])
  const [startDate, setStartDate] = useState(campaignStore.startDate || '')
  const [endDate, setEndDate] = useState(campaignStore.endDate || '')
  const [avatar, setAvatar] = useState(campaignStore.avatar || null)
  const [mood, setMood] = useState(campaignStore.mood || 'Dark/Premium')

  function togglePlatform(p) {
    setPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  function handleLaunch() {
    campaignStore.setCampaign({
      productToPromote: product,
      coreMessage: message,
      goal, platforms, startDate, endDate, avatar, mood
    })
    navigate('/planning')
  }

  const inputCls = 'w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-brand-white placeholder-brand-muted text-sm focus:outline-none focus:border-brand-blue focus:shadow-glow-sm transition-all duration-200'

  // Live brief preview
  const brief = {
    brand: brandStore.brandName || 'Your Brand',
    product: product || '—',
    message: message || '—',
    goal,
    platforms: platforms.join(', ') || 'None selected',
    duration: startDate && endDate ? `${startDate} → ${endDate}` : 'Not set',
    avatar: avatar ? avatarsData.find(a => a.id === avatar)?.name : '—',
    mood,
  }

  return (
    <>
      <Navbar />
      <PageWrapper>
        <AnimatedPage>
          <div className="max-w-7xl mx-auto py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <Badge variant="blue" dot className="mb-3">Step 4 of 9</Badge>
              <h1 className="font-display text-3xl font-bold text-brand-white" style={{ letterSpacing: '-0.02em' }}>Campaign Planner</h1>
              <p className="text-brand-muted text-sm mt-1">Define your campaign. AI will handle the strategy.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left: Form — 3 cols */}
              <div className="lg:col-span-3 space-y-6">

                {/* Product to promote */}
                <div className="glass rounded-2xl p-6 space-y-4">
                  <h2 className="text-sm font-semibold text-brand-white">What are you promoting?</h2>
                  <div>
                    <label className="block text-xs text-brand-muted mb-1.5">Product / Service to Promote</label>
                    <textarea className={cn(inputCls, 'resize-none')} rows={3} value={product} onChange={e => setProduct(e.target.value)}
                      placeholder="Describe the specific product, feature, or service you're promoting in this campaign..." />
                  </div>
                  <div>
                    <label className="block text-xs text-brand-muted mb-1.5">Core Message / Tagline</label>
                    <input className={inputCls} value={message} onChange={e => setMessage(e.target.value)}
                      placeholder="e.g. 'Create more. Stress less. Let AI do the heavy lifting.'" />
                  </div>
                </div>

                {/* Campaign goal */}
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-sm font-semibold text-brand-white mb-4">Campaign Goal</h2>
                  <div className="flex flex-wrap gap-2">
                    {GOALS.map(g => (
                      <motion.button key={g} whileTap={{ scale: 0.96 }} onClick={() => setGoal(g)}
                        className={cn(
                          'px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer',
                          goal === g ? 'bg-brand-blue border-brand-blue text-white shadow-glow-sm' : 'border-white/10 text-brand-muted hover:border-white/20'
                        )}>
                        {g}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Target platforms */}
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-sm font-semibold text-brand-white mb-4">Target Platforms</h2>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map(p => {
                      const isOn = platforms.includes(p)
                      return (
                        <motion.button key={p} whileTap={{ scale: 0.96 }} onClick={() => togglePlatform(p)}
                          className={cn('transition-all duration-200 cursor-pointer', isOn ? 'opacity-100' : 'opacity-50 hover:opacity-75')}>
                          <PlatformBadge platform={p} size="md" />
                        </motion.button>
                      )
                    })}
                  </div>
                  {platforms.length === 0 && <p className="text-xs text-red-400 mt-2">Select at least one platform</p>}
                </div>

                {/* Date range */}
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-sm font-semibold text-brand-white mb-4 flex items-center gap-2">
                    <Calendar size={16} className="text-brand-blue" /> Campaign Duration
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-brand-muted mb-1.5">Start Date</label>
                      <input type="date" className={inputCls} value={startDate} onChange={e => setStartDate(e.target.value)}
                        style={{ colorScheme: 'dark' }} />
                    </div>
                    <div>
                      <label className="block text-xs text-brand-muted mb-1.5">End Date</label>
                      <input type="date" className={inputCls} value={endDate} onChange={e => setEndDate(e.target.value)}
                        style={{ colorScheme: 'dark' }} />
                    </div>
                  </div>
                </div>

                {/* Avatar selection */}
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-sm font-semibold text-brand-white mb-4">Select Avatar / Actor</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {avatarsData.map(av => (
                      <motion.button key={av.id} whileTap={{ scale: 0.97 }} onClick={() => setAvatar(av.id)}
                        className={cn(
                          'flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 cursor-pointer',
                          avatar === av.id ? 'border-brand-blue bg-brand-blue/10 shadow-glow-sm' : 'border-white/8 hover:border-white/15'
                        )}>
                        <div className="relative">
                          <img src={av.placeholder} alt={av.name} className="w-14 h-14 rounded-full bg-brand-surface" />
                          {avatar === av.id && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center">
                              <Check size={10} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-brand-white">{av.name}</div>
                        <div className="text-xs text-brand-muted text-center leading-tight">{av.style}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Campaign mood */}
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-sm font-semibold text-brand-white mb-4">Campaign Mood</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {MOODS.map(m => (
                      <motion.button key={m.id} whileTap={{ scale: 0.97 }} onClick={() => setMood(m.id)}
                        className={cn(
                          'flex flex-col gap-1 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                          mood === m.id ? 'border-brand-blue bg-brand-blue/10' : 'border-white/8 hover:border-white/15'
                        )}>
                        <span className="text-sm font-semibold text-brand-white">{m.label}</span>
                        <span className="text-xs text-brand-muted">{m.desc}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleLaunch} fullWidth size="lg" className="group">
                  Launch AI Planning
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Right: Live brief preview — 2 cols */}
              <div className="lg:col-span-2">
                <div className="sticky top-24">
                  <motion.div
                    className="glass-elevated rounded-3xl p-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                      <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider">Live Campaign Brief</span>
                    </div>

                    <div className="space-y-4">
                      {[
                        { label: 'Brand', value: brief.brand },
                        { label: 'Promoting', value: brief.product },
                        { label: 'Core Message', value: brief.message },
                        { label: 'Goal', value: brief.goal },
                        { label: 'Platforms', value: brief.platforms },
                        { label: 'Duration', value: brief.duration },
                        { label: 'Avatar', value: brief.avatar },
                        { label: 'Mood', value: brief.mood },
                      ].map(({ label, value }) => (
                        <motion.div key={label} layout className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                          <div className="text-xs text-brand-muted mb-1">{label}</div>
                          <motion.div
                            key={value}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={cn('text-sm font-medium', value === '—' || value === 'None selected' || value === 'Not set' ? 'text-brand-muted' : 'text-brand-white')}
                          >
                            {value}
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-brand-blue/8 border border-brand-blue/20">
                      <p className="text-xs text-brand-blue-mid leading-relaxed">
                        <span className="font-semibold">AI is ready.</span> Once you click "Launch AI Planning", 6 specialized agents will analyze your brand, research trends, and build your complete campaign strategy.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedPage>
      </PageWrapper>
    </>
  )
}
