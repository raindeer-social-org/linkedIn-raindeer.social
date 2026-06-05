import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Download, Share2, ArrowRight, Hash, Link2, Loader2, X, BarChart3 } from 'lucide-react'
import { AnimatedPage, PageWrapper } from '@/components/layout/AnimatedPage'
import { Navbar } from '@/components/layout/Navbar'
import { Button, Badge } from '@/components/ui'
import { PlatformBadge } from '@/components/shared/PlatformBadge'
import { useCampaignStore, useBrandStore } from '@/store'
import { cn } from '@/lib/utils'

const PUBLISH_OPTIONS = ['Post Now', 'Schedule', 'Save to Drafts']
const HASHTAGS = ['#AIContent', '#BrandGrowth', '#ContentStrategy', '#SocialMediaMarketing', '#InstagramReels', '#raindeer']

const GENERATED_CAPTION = `Your brand deserves more than random posts. Here's how AI is rewriting the content playbook. 🧠

We used raindeer.social to plan, script, and generate this entire Reel in under 2 minutes. No team needed. No agency required.

Save this if you're ready to scale your content with AI. ⬇️

👉 Link in bio to get started — free trial, no credit card.`

export default function GeneratedOutput() {
  const navigate = useNavigate()
  const brandStore = useBrandStore()
  const campaignStore = useCampaignStore()
  const [caption, setCaption] = useState(GENERATED_CAPTION)
  const [hashtags, setHashtags] = useState(HASHTAGS)
  const [publishMode, setPublishMode] = useState('Post Now')
  const [publishPlatforms, setPublishPlatforms] = useState(['Instagram', 'Twitter', 'LinkedIn', 'YouTube'])
  const [isPlaying, setIsPlaying] = useState(false)

  function removeTag(tag) {
    setHashtags(prev => prev.filter(t => t !== tag))
  }

  function togglePlatform(p) {
    setPublishPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  return (
    <>
      <Navbar />
      <PageWrapper>
        <AnimatedPage>
          <div className="max-w-5xl mx-auto py-12">
            {/* Success state */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 180 }}
                className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                >
                  {/* Animated checkmark */}
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <motion.path
                      d="M8 18L15 25L28 11"
                      stroke="#22c55e"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Glow burst */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="absolute inset-0 flex items-start justify-center pointer-events-none"
                style={{ top: 160 }}
              >
                <div className="w-40 h-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.12), transparent)', filter: 'blur(20px)' }} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Badge variant="blue" dot className="mb-3">Step 8 of 9</Badge>
                <h1 className="font-display text-4xl font-bold text-brand-white mb-2" style={{ letterSpacing: '-0.02em' }}>
                  Your content is ready
                </h1>
                <p className="text-brand-muted">Generated in 1m 42s · Brand Intro Reel · Instagram</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left: Video preview + metadata — 2 cols */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="lg:col-span-2 flex flex-col gap-5"
              >
                {/* Mock video player */}
                <div className="glass-elevated rounded-3xl overflow-hidden" style={{ aspectRatio: '9/16', maxHeight: 480, position: 'relative' }}>
                  {/* Poster */}
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-surface to-brand-bg flex flex-col items-center justify-center">
                    <div className="w-full h-full relative">
                      {/* Simulated video thumbnail */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
                        <div className="text-center">
                          <p className="font-display text-2xl font-bold text-brand-white leading-tight mb-2">
                            "Most brands waste<br />80% of their<br />content budget."
                          </p>
                          <p className="text-brand-blue-mid text-sm">raindeer.social</p>
                        </div>
                        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-1">
                          <div className="flex items-center gap-2 text-xs text-brand-muted">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                            AI Generated · Reel
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 rounded-full bg-brand-blue/90 flex items-center justify-center shadow-glow backdrop-blur-sm"
                    >
                      <Play size={22} className="text-white ml-1" fill="white" />
                    </motion.button>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute top-4 right-4">
                    <span className="text-xs text-white bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">0:26</span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="glass rounded-2xl p-4 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Platform', value: 'Instagram' },
                    { label: 'Format', value: 'Reel / 9:16' },
                    { label: 'Duration', value: '26 seconds' },
                    { label: 'File Size', value: '18.4 MB' },
                    { label: 'Resolution', value: '1080 × 1920' },
                    { label: 'Model Used', value: 'Balanced' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-xs text-brand-muted">{label}</div>
                      <div className="text-sm font-medium text-brand-white">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" fullWidth icon={<Download size={14} />}>Download</Button>
                  <Button variant="secondary" fullWidth icon={<Share2 size={14} />}>Share</Button>
                </div>
              </motion.div>

              {/* Right: Caption + publish — 3 cols */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="lg:col-span-3 flex flex-col gap-5"
              >
                {/* Caption */}
                <div className="glass rounded-2xl p-5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-brand-white mb-3">
                    <AlignLeftIcon /> Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    rows={8}
                    className="w-full bg-black/20 border border-white/6 rounded-xl px-4 py-3 text-sm text-brand-white placeholder-brand-muted resize-none focus:outline-none focus:border-brand-blue/40 transition-all"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-brand-muted">{caption.length} characters</span>
                    <span className={cn('text-xs', caption.length > 2200 ? 'text-red-400' : 'text-brand-muted')}>
                      Limit: 2,200
                    </span>
                  </div>
                </div>

                {/* Hashtags */}
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-white mb-3">
                    <Hash size={14} className="text-brand-blue" /> Hashtags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map(tag => (
                      <motion.span
                        key={tag}
                        layout
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="inline-flex items-center gap-1.5 text-xs text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-3 py-1.5 rounded-full"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
                          <X size={11} />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Publish options */}
                <div className="glass rounded-2xl p-5">
                  <div className="text-xs font-semibold text-brand-white mb-3">Publish Options</div>
                  <div className="flex bg-white/4 rounded-xl p-1 border border-white/8 mb-4">
                    {PUBLISH_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => setPublishMode(opt)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                          publishMode === opt ? 'bg-brand-blue text-white shadow-glow-sm' : 'text-brand-muted hover:text-brand-white'
                        }`}>
                        {opt}
                      </button>
                    ))}
                  </div>

                  {/* Platform selector */}
                  <div className="text-xs text-brand-muted mb-2">Publish to</div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Instagram', 'Twitter', 'LinkedIn', 'YouTube'].map(p => (
                      <motion.button key={p} whileTap={{ scale: 0.96 }}
                        onClick={() => togglePlatform(p)}
                        className={cn('transition-all', publishPlatforms.includes(p) ? 'opacity-100' : 'opacity-40 hover:opacity-65')}>
                        <PlatformBadge platform={p} size="md" />
                      </motion.button>
                    ))}
                  </div>

                  {/* Per-platform post buttons */}
                  <AnimatePresence>
                    {publishPlatforms.map(p => (
                      <PlatformPostButton key={p} platform={p} publishMode={publishMode} />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Action links */}
                <div className="flex gap-4 justify-center">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/campaign')}>
                    + Generate Another
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/analytics')} icon={<BarChart3 size={14} />}>
                    View Analytics
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedPage>
      </PageWrapper>
    </>
  )
}

function AlignLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-blue">
      <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
    </svg>
  )
}

const platformActionLabel = {
  'Post Now':       (p) => `Post on ${p}`,
  'Schedule':       (p) => `Schedule on ${p}`,
  'Save to Drafts': ()  => 'Save to Drafts',
}

const platformPostColors = {
  Instagram: { from: '#E1306C', to: '#F77737' },
  Twitter:   { from: '#1D9BF0', to: '#0d7ec7' },
  LinkedIn:  { from: '#0A66C2', to: '#0050a0' },
  YouTube:   { from: '#FF0000', to: '#cc0000' },
}

// phase: 'disconnected' | 'connecting' | 'connected' | 'posted'
function PlatformPostButton({ platform, publishMode }) {
  const [phase, setPhase] = useState('disconnected')
  const colors = platformPostColors[platform] || { from: '#4f6ef7', to: '#3451d1' }
  const label = platformActionLabel[publishMode]?.(platform) ?? `Post on ${platform}`

  function handleClick() {
    if (phase === 'disconnected') {
      // Simulate OAuth connect flow
      setPhase('connecting')
      setTimeout(() => setPhase('connected'), 1600)
    } else if (phase === 'connected') {
      setPhase('posted')
      setTimeout(() => setPhase('connected'), 2800)
    }
  }

  const isDisconnected = phase === 'disconnected'
  const isConnecting   = phase === 'connecting'
  const isPosted       = phase === 'posted'

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      whileHover={!isConnecting ? { scale: 1.015 } : {}}
      whileTap={!isConnecting ? { scale: 0.97 } : {}}
      onClick={handleClick}
      disabled={isConnecting}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all relative overflow-hidden mb-2"
      style={isDisconnected || isConnecting ? {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: isConnecting ? '#a0aec0' : '#64748b',
        cursor: isConnecting ? 'wait' : 'pointer',
      } : {
        background: isPosted
          ? 'linear-gradient(90deg,#22c55e,#16a34a)'
          : `linear-gradient(90deg,${colors.from},${colors.to})`,
        boxShadow: isPosted
          ? '0 0 16px rgba(34,197,94,0.35)'
          : `0 0 14px ${colors.from}44`,
        color: 'white',
      }}
    >
      <span className="flex items-center gap-2">
        {/* Icon */}
        {isConnecting && (
          <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
            <Loader2 size={14} />
          </motion.span>
        )}
        {isDisconnected && <Link2 size={14} className="opacity-50" />}
        {!isDisconnected && !isConnecting && !isPosted && <ArrowRight size={14} />}
        {isPosted && (
          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
          </motion.svg>
        )}

        {/* Label */}
        {isDisconnected && `Connect ${platform} Account`}
        {isConnecting   && `Connecting to ${platform}…`}
        {!isDisconnected && !isConnecting && !isPosted && label}
        {isPosted       && `Posted to ${platform}!`}
      </span>

      {/* Right side chip */}
      {isDisconnected && (
        <span className="text-xs font-normal px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}>
          Not connected
        </span>
      )}
      {!isDisconnected && !isConnecting && !isPosted && (
        <span className="text-white/60 text-xs font-normal">{platform}</span>
      )}
    </motion.button>
  )
}
