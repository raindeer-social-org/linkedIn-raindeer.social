import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { Button } from '@/components/ui'
import { RaindeerLogo } from '@/components/layout/Navbar'
import { useBrandStore } from '@/store'
import { cn } from '@/lib/utils'

// Platform SVG icons
function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function PlatformIconRow() {
  const platforms = [
    { bg: '#E1306C', icon: <InstagramIcon /> },
    { bg: '#0A66C2', icon: <LinkedInIcon /> },
    { bg: '#FF0000', icon: <YouTubeIcon /> },
    { bg: '#1DA1F2', icon: <TwitterIcon /> },
  ]
  return (
    <div className="flex items-center gap-2">
      {platforms.map((p, i) => (
        <div key={i} className="w-7 h-7 rounded-xl flex items-center justify-center"
          style={{ background: `${p.bg}20`, border: `1px solid ${p.bg}35`, color: p.bg }}>
          <span style={{ display: 'flex' }}>{p.icon}</span>
        </div>
      ))}
    </div>
  )
}



const INDUSTRIES = [
  'Technology & SaaS', 'E-commerce & Retail', 'Health & Wellness',
  'Finance & Fintech', 'Education & EdTech', 'Design & Creative',
  'Food & Beverage', 'Real Estate', 'Fashion & Beauty',
  'Consulting & Professional Services', 'Media & Entertainment', 'Other'
]

const BUSINESS_TYPES = [
  { id: 'individual', label: 'Individual', desc: 'Solo creator or freelancer' },
  { id: 'business', label: 'Business', desc: 'Startup or established company' },
  { id: 'agency', label: 'Agency', desc: 'Marketing or creative agency' },
]

const heroWords = ['Your brand.', 'Your AI.', 'Your content.']

// Floating particle component
function Particle({ x, y, size, delay, duration }) {
  return (
    <motion.div
      className="absolute rounded-full bg-brand-blue pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, opacity: 0 }}
      animate={{
        y: [0, -30, 10, -20, 0],
        x: [0, 15, -10, 20, 0],
        opacity: [0, 0.12, 0.08, 0.15, 0],
        scale: [1, 1.2, 0.8, 1.1, 1],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

const particles = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 8,
  duration: Math.random() * 12 + 12,
}))

export default function Landing() {
  const navigate = useNavigate()
  const { brandName, industry, businessType, setBrand } = useBrandStore()
  const [localBrand, setLocalBrand] = useState(brandName || '')
  const [localIndustry, setLocalIndustry] = useState(industry || '')
  const [localType, setLocalType] = useState(businessType || '')
  const [wordIndex, setWordIndex] = useState(0)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % heroWords.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  function validate() {
    const e = {}
    if (!localBrand.trim()) e.brand = 'Brand name is required'
    if (!localIndustry) e.industry = 'Please select an industry'
    if (!localType) e.type = 'Please select a business type'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleStart() {
    if (!validate()) return
    setBrand({ brandName: localBrand, industry: localIndustry, businessType: localType })
    navigate('/setup')
  }



  return (
    <AnimatedPage>
      <div className="relative min-h-screen flex flex-col overflow-hidden bg-brand-bg">

        {/* Particle background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(p => <Particle key={p.id} {...p} />)}
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #1E6BFF, transparent)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #35A7FF, transparent)', filter: 'blur(80px)' }} />
        </div>

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <RaindeerLogo size={36} />
            <span className="font-display font-bold text-brand-white text-lg tracking-wide">
              raindeer<span className="text-brand-blue">.social</span>
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <PlatformIconRow />
          </motion.div>
        </nav>

        {/* Hero */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">



          {/* Animated headline */}
          <div className="mb-4">
            <AnimatePresence mode="wait">
              <motion.h1
                key={wordIndex}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="font-display font-bold text-brand-white leading-none"
                style={{ fontSize: 'clamp(42px, 7vw, 68px)', letterSpacing: '-0.02em' }}
              >
                {heroWords[wordIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-brand-muted max-w-xl mb-10 leading-relaxed"
            style={{ fontSize: '18px' }}
          >
            Plan, create, and execute social content without needing a full team.
            <br />
            <span className="text-brand-blue-mid">raindeer.social</span> is your AI-powered brand content engine.
          </motion.p>

          {/* Input Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="w-full max-w-lg glass-elevated rounded-3xl p-8 text-left"
          >
            <h2 className="text-sm font-semibold text-brand-white mb-5 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue text-xs">1</span>
              Tell us about your brand
            </h2>

            {/* Brand Name */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-brand-muted mb-1.5">Brand Name *</label>
              <input
                type="text"
                value={localBrand}
                onChange={e => { setLocalBrand(e.target.value); setErrors(er => ({ ...er, brand: '' })) }}
                placeholder="e.g. Luminary Studio"
                className={cn(
                  'w-full bg-brand-surface border rounded-xl px-4 py-3 text-brand-white placeholder-brand-muted text-sm',
                  'focus:outline-none focus:border-brand-blue transition-all duration-200',
                  errors.brand ? 'border-red-500/50' : 'border-white/10 focus:shadow-glow-sm'
                )}
              />
              {errors.brand && <p className="mt-1 text-xs text-red-400">{errors.brand}</p>}
            </div>

            {/* Industry */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-brand-muted mb-1.5">Industry *</label>
              <select
                value={localIndustry}
                onChange={e => { setLocalIndustry(e.target.value); setErrors(er => ({ ...er, industry: '' })) }}
                className={cn(
                  'w-full bg-brand-surface border rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer',
                  'focus:outline-none focus:border-brand-blue transition-all duration-200',
                  localIndustry ? 'text-brand-white' : 'text-brand-muted',
                  errors.industry ? 'border-red-500/50' : 'border-white/10'
                )}
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23A7B0BE' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
              >
                <option value="" className="bg-brand-surface">Select your industry</option>
                {INDUSTRIES.map(ind => (
                  <option key={ind} value={ind} className="bg-brand-surface">{ind}</option>
                ))}
              </select>
              {errors.industry && <p className="mt-1 text-xs text-red-400">{errors.industry}</p>}
            </div>

            {/* Business Type */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-brand-muted mb-2">Business Type *</label>
              <div className="grid grid-cols-3 gap-2">
                {BUSINESS_TYPES.map(bt => (
                  <motion.button
                    key={bt.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setLocalType(bt.id); setErrors(er => ({ ...er, type: '' })) }}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-xl border text-xs transition-all duration-200 cursor-pointer',
                      localType === bt.id
                        ? 'border-brand-blue bg-brand-blue/10 text-brand-white'
                        : 'border-white/8 bg-white/2 text-brand-muted hover:border-white/15'
                    )}
                  >
                    <span className="font-semibold">{bt.label}</span>
                    <span className="text-center opacity-70 text-[10px] leading-tight">{bt.desc}</span>
                  </motion.button>
                ))}
              </div>
              {errors.type && <p className="mt-1 text-xs text-red-400">{errors.type}</p>}
            </div>

            {/* CTA */}
            <Button onClick={handleStart} fullWidth size="lg" className="group">
              Start Building
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Platform row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <p className="text-xs text-brand-muted uppercase tracking-widest">Publish to</p>
            <div className="flex items-center gap-4">
              {[
                { name: 'Instagram', bg: '#E1306C', icon: <InstagramIcon /> },
                { name: 'LinkedIn',  bg: '#0A66C2', icon: <LinkedInIcon /> },
                { name: 'YouTube',   bg: '#FF0000', icon: <YouTubeIcon /> },
                { name: 'Twitter',   bg: '#1DA1F2', icon: <TwitterIcon /> },
              ].map(p => (
                <motion.div
                  key={p.name}
                  whileHover={{ scale: 1.12, y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ background: `${p.bg}22`, border: `1px solid ${p.bg}44` }}
                  >
                    <span style={{ color: p.bg }}>{p.icon}</span>
                  </div>
                  <span className="text-xs text-brand-muted">{p.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-xs text-brand-muted mt-10"
          >
            Powered by AI. Built for modern creators and SMBs.
          </motion.p>
        </main>
      </div>
    </AnimatedPage>
  )
}
