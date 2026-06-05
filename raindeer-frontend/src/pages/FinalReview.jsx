import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown, ChevronUp, Film, AlignLeft, User, Palette, Flag, Cpu, Save } from 'lucide-react'
import { AnimatedPage, PageWrapper } from '@/components/layout/AnimatedPage'
import { Navbar } from '@/components/layout/Navbar'
import { Button, Badge, Card } from '@/components/ui'
import { CostEstimator } from '@/components/shared/CostEstimator'
import { PlatformBadge } from '@/components/shared/PlatformBadge'
import { useCampaignStore, useBrandStore } from '@/store'
import avatarsData from '@/data/avatars.json'
import modelsData from '@/data/models.json'
import { cn } from '@/lib/utils'

const SCENES = [
  { id: 1, title: 'Hook', desc: 'Bold statement card: "Most brands waste 80% of their content budget"', duration: '3s', note: 'B-roll: chaotic desk setup' },
  { id: 2, title: 'Problem', desc: 'Avatar speaks to camera: "You\'re creating content the hard way..."', duration: '8s', note: 'Avatar: full frame, neutral background' },
  { id: 3, title: 'Solution', desc: 'Screen record of raindeer.social generating content in real time', duration: '10s', note: 'UI animation overlay' },
  { id: 4, title: 'CTA', desc: 'Avatar CTA: "Link in bio — start for free today."', duration: '5s', note: 'Lower-third text animation' },
]

const SCRIPT = `[HOOK — 0:00–0:03]
[TEXT ON SCREEN] "Most brands waste 80% of their content budget."

[AVATAR — 0:03–0:11]
"You're probably creating content the hard way — spending hours on ideas, captions, and scheduling, only to see mediocre results."

[SCREEN RECORD — 0:11–0:21]
[NARRATION] "raindeer.social changes that completely. In under 2 minutes, AI plans your entire campaign — trends, scripts, calendar — everything."

[CTA — 0:21–0:26]
[AVATAR] "If you're ready to let AI do the heavy lifting, link's in the bio. Start free."
[TEXT] "raindeer.social ↗"`

function AccordionSection({ title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/2 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-blue/10 flex items-center justify-center">
            <Icon size={16} className="text-brand-blue" />
          </div>
          <span className="text-sm font-semibold text-brand-white">{title}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-brand-muted" /> : <ChevronDown size={16} className="text-brand-muted" />}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="px-5 pb-5"
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

export default function FinalReview() {
  const navigate = useNavigate()
  const brandStore = useBrandStore()
  const campaignStore = useCampaignStore()
  const [selectedModel, setSelectedModel] = useState(campaignStore.selectedModel || 'balanced')

  const avatar = avatarsData.find(a => a.id === campaignStore.avatar) || avatarsData[0]
  const model = modelsData.find(m => m.key === selectedModel)
  const totalCost = (model?.costPerVideo || 2.4) * 5 // 5 sample videos

  const handleCreate = () => {
    campaignStore.setModel(selectedModel)
    navigate('/output')
  }

  return (
    <>
      <Navbar />
      <PageWrapper>
        <AnimatedPage>
          <div className="max-w-7xl mx-auto py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <Badge variant="blue" dot className="mb-3">Step 7 of 9</Badge>
              <h1 className="font-display text-3xl font-bold text-brand-white" style={{ letterSpacing: '-0.02em' }}>Final Review</h1>
              <p className="text-brand-muted text-sm mt-1">Review everything before creation. Choose your model tier.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Review sections — 2 cols */}
              <div className="lg:col-span-2 space-y-4">

                <AccordionSection title="Video Concept" icon={Film} defaultOpen>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <PlatformBadge platform={campaignStore.platforms?.[0] || 'Instagram'} size="md" />
                      <Badge variant="blue">Reel · 26s</Badge>
                      <Badge variant="gray">AI Generated</Badge>
                    </div>
                    <p className="text-sm text-brand-white font-medium">Brand Intro Reel — Campaign Hero Asset</p>
                    <p className="text-sm text-brand-muted leading-relaxed">
                      A fast-paced, hook-driven Instagram Reel introducing {brandStore.brandName || 'your brand'} as an AI-powered content platform. Opens with a bold challenge statement, demonstrates the product in action, and closes with a clear CTA.
                    </p>
                  </div>
                </AccordionSection>

                <AccordionSection title="Dynamic Storyboard" icon={Film} defaultOpen>
                  <div className="grid grid-cols-2 gap-3">
                    {SCENES.map(scene => (
                      <div key={scene.id} className="glass-elevated rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-brand-blue">Scene {scene.id}</span>
                          <span className="text-xs font-mono text-brand-muted">{scene.duration}</span>
                        </div>
                        <div className="w-full h-20 rounded-xl bg-brand-blue/5 border border-white/6 flex items-center justify-center mb-3">
                          <div className="text-2xl">🎬</div>
                        </div>
                        <p className="text-xs font-semibold text-brand-white mb-1">{scene.title}</p>
                        <p className="text-xs text-brand-muted leading-relaxed">{scene.desc}</p>
                        <p className="text-xs text-brand-blue/70 mt-2 italic">{scene.note}</p>
                      </div>
                    ))}
                  </div>
                </AccordionSection>

                <AccordionSection title="Script" icon={AlignLeft}>
                  <pre className="text-xs text-brand-muted leading-relaxed font-mono whitespace-pre-wrap bg-black/30 rounded-xl p-4 border border-white/5">
                    {SCRIPT}
                  </pre>
                </AccordionSection>

                <AccordionSection title="Selected Avatar" icon={User}>
                  <div className="flex items-center gap-4">
                    <img src={avatar.placeholder} alt={avatar.name} className="w-16 h-16 rounded-full bg-brand-surface" />
                    <div>
                      <div className="text-sm font-semibold text-brand-white">{avatar.name}</div>
                      <div className="text-xs text-brand-muted">{avatar.style}</div>
                      <div className="text-xs text-brand-muted mt-0.5">{avatar.description}</div>
                      <div className="text-xs text-brand-blue mt-1">Voice: {avatar.voiceType}</div>
                    </div>
                  </div>
                </AccordionSection>

                <AccordionSection title="Brand Style" icon={Palette}>
                  <div className="flex items-center gap-6 flex-wrap">
                    <div>
                      <div className="text-xs text-brand-muted mb-2">Color Theme</div>
                      <div className="flex gap-2">
                        {['#07111F', '#0B1320', '#1E6BFF', '#35A7FF'].map(c => (
                          <div key={c} className="w-8 h-8 rounded-lg border border-white/10" style={{ background: c }} title={c} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-brand-muted mb-1">Tone</div>
                      <Badge variant="blue">Premium / Intelligence</Badge>
                    </div>
                    <div>
                      <div className="text-xs text-brand-muted mb-1">Visual Mood</div>
                      <Badge variant="gray">{campaignStore.mood || 'Dark/Premium'}</Badge>
                    </div>
                  </div>
                </AccordionSection>

                <AccordionSection title="Campaign Goal" icon={Flag}>
                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge variant="blue" className="text-sm px-4 py-1.5">{campaignStore.goal || 'Awareness'}</Badge>
                    {[
                      { label: 'Target Reach', value: '80K–120K' },
                      { label: 'Target Eng. Rate', value: '4.5%+' },
                      { label: 'Content Pieces', value: '28' },
                    ].map(kpi => (
                      <div key={kpi.label} className="glass rounded-xl px-4 py-2.5">
                        <div className="font-mono text-sm font-bold text-brand-blue">{kpi.value}</div>
                        <div className="text-xs text-brand-muted">{kpi.label}</div>
                      </div>
                    ))}
                  </div>
                </AccordionSection>

                <AccordionSection title="AI Model Selection" icon={Cpu} defaultOpen>
                  <CostEstimator selected={selectedModel} onSelect={setSelectedModel} />
                </AccordionSection>
              </div>

              {/* Right: Sticky cost summary — 1 col */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="glass-elevated rounded-3xl p-6"
                  >
                    <h3 className="text-sm font-semibold text-brand-white mb-5">Order Summary</h3>

                    <div className="space-y-3 mb-5">
                      {[
                        { label: 'Campaign Reels', value: '5 videos' },
                        { label: 'Platform', value: campaignStore.platforms?.join(', ') || 'Instagram' },
                        { label: 'Model', value: model?.name || 'Balanced' },
                        { label: 'Cost per video', value: `$${model?.costPerVideo?.toFixed(2) || '2.40'}` },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-xs">
                          <span className="text-brand-muted">{label}</span>
                          <span className="text-brand-white font-medium">{value}</span>
                        </div>
                      ))}
                      <div className="border-t border-white/8 pt-3 flex justify-between">
                        <span className="text-sm font-semibold text-brand-white">Total Estimate</span>
                        <motion.span
                          key={totalCost}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="font-mono text-lg font-bold text-brand-blue"
                        >
                          ${totalCost.toFixed(2)}
                        </motion.span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-green-500/8 border border-green-500/20 mb-5">
                      <p className="text-xs text-green-400 leading-relaxed">
                        <span className="font-semibold">✓ No subscription required.</span> Pay only for what you generate. All content delivered within 2–4 minutes.
                      </p>
                    </div>

                    <Button onClick={handleCreate} fullWidth size="lg" className="mb-3 group">
                      Create Content
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="ghost" fullWidth size="sm" icon={<Save size={14} />}>
                      Save Draft
                    </Button>
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
