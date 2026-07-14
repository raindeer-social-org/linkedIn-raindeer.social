import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'
import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { Button } from '@/components/ui'
import { RaindeerLogo } from '@/components/layout/Navbar'
import { useBrandStore } from '@/store'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

// Platform SVG icons
function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
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
        <div key={i} className="w-7 h-7 rounded-[8px] flex items-center justify-center bg-card border border-hairline hover:border-hairline-bold text-ink-2 hover:text-ink transition-all">
          <span style={{ display: 'flex' }}>{p.icon}</span>
        </div>
      ))}
    </div>
  )
}

const heroWords = ['Your brand.', 'Your AI.', 'Your content.']

export default function Landing() {
  const navigate = useNavigate()
  const setBrandStore = useBrandStore(state => state.setBrand)
  const { isAuthenticated } = useBrandStore()

  const [wordIndex, setWordIndex] = useState(0)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % heroWords.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      const { category } = useBrandStore.getState()
      navigate(category ? '/dashboard' : '/setup')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Please fill in all fields')

    setIsLoading(true)
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Authentication failed')
      }

      // 1. Completely reset the frontend state to wipe any previous user data
      useBrandStore.getState().reset()

      // 2. If logging in, fetch their specific brand data from the DB
      if (isLogin) {
        try {
          const brandRes = await fetch(`${import.meta.env.VITE_API_URL}/api/brand/${data.brandId}`)
          const brandData = await brandRes.json()
          if (brandData.success && brandData.brand) {
            setBrandStore(brandData.brand)
          }
        } catch (e) {
          console.error("Failed to fetch brand data on login", e)
        }
      }

      // 3. Set the auth state
      setBrandStore({ 
        brandId: data.brandId, 
        token: data.token,
        isAuthenticated: true 
      })
      
      toast.success(isLogin ? 'Welcome back!' : 'Account created!')
      navigate(isLogin ? '/dashboard' : '/setup')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatedPage>
      <div className="relative min-h-screen flex flex-col overflow-hidden bg-canvas text-ink">
        {/* Dawn atmosphere background layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#EAF1FD] via-[#FAFBFD] to-[#FBF5E9]">
          <div className="bloom bloom-a"></div>
          <div className="bloom bloom-b"></div>
          <div className="grain"></div>
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
            <span className="font-sans font-bold text-ink text-lg tracking-wide">
              raindeer<span className="text-cobalt-600">.social</span>
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
                initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // dur-4 / ease-cinema
                className="font-serif font-normal text-ink leading-none text-wrap-balance"
                style={{ fontSize: 'clamp(42px, 7vw, 68px)', letterSpacing: '-0.015em' }}
              >
                {heroWords[wordIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-ink-2 max-w-xl mb-10 leading-relaxed font-sans text-lede"
          >
            Plan, write and schedule a week of posts in one sitting — with an AI editor that knows your voice.
            <br />
            <span className="text-cobalt-600 font-semibold">raindeer.social</span> is your AI-powered brand content engine.
          </motion.p>

          {/* Login/Signup Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="w-full max-w-sm bg-card border border-hairline rounded-stage p-8 text-left shadow-lg"
          >
            <div className="flex gap-4 mb-6 border-b border-hairline pb-2">
              <button 
                onClick={() => setIsLogin(true)}
                className={cn(
                  "text-sm font-semibold transition-colors pb-2", 
                  isLogin ? "text-ink border-b-2 border-cobalt-600" : "text-ink-3 hover:text-ink"
                )}
              >
                Log In
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={cn(
                  "text-sm font-semibold transition-colors pb-2", 
                  !isLogin ? "text-ink border-b-2 border-cobalt-600" : "text-ink-3 hover:text-ink"
                )}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@brand.com"
                  className="w-full bg-card border border-hairline-bold rounded-controls px-4 py-2.5 text-ink placeholder-ink-3 text-small focus:outline-none focus:border-cobalt-500 focus:ring-4 focus:ring-cobalt-100 transition-all duration-dur-1"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-card border border-hairline-bold rounded-controls px-4 py-2.5 text-ink placeholder-ink-3 text-small focus:outline-none focus:border-cobalt-500 focus:ring-4 focus:ring-cobalt-100 transition-all duration-dur-1"
                  required
                />
              </div>

              <Button type="submit" fullWidth size="lg" className="group" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Log In' : 'Create Account')}
                {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-[10px] font-semibold text-ink-3 mt-10 uppercase tracking-widest font-mono"
          >
            Powered by AI ✦ Everywhere
          </motion.p>
        </main>
      </div>
    </AnimatedPage>
  )
}
