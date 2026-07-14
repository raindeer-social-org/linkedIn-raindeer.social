import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBrandStore } from '@/store'

const steps = [
  { path: '/', label: 'Entry', step: 1 },
  { path: '/setup', label: 'Setup', step: 2 },
  { path: '/strategy', label: 'Strategy', step: 3 },
  { path: '/campaign', label: 'Campaign', step: 4 },
  { path: '/planning', label: 'Planning', step: 5 },
  { path: '/calendar', label: 'Calendar', step: 6 },
  { path: '/review', label: 'Review', step: 7 },
  { path: '/output', label: 'Output', step: 8 },
  { path: '/analytics', label: 'Analytics', step: 9 },
]

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentStep = steps.findIndex(s => s.path === location.pathname) + 1
  const isLanding = location.pathname === '/'

  const handleLogout = () => {
    useBrandStore.getState().reset()
    navigate('/')
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center px-6 border-b border-hairline"
      style={{ background: 'rgba(250,251,253,0.85)', backdropFilter: 'blur(12px)' }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 mr-auto">
        <RaindeerLogo size={28} />
        <span className="font-sans font-bold text-ink text-sm tracking-wide hidden sm:block">
          raindeer<span className="text-cobalt-600">.social</span>
        </span>
      </Link>

      {/* Step Progress — hidden on landing */}
      {!isLanding && (
        <div className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {steps.slice(1).map((step, idx) => {
            const stepNum = idx + 2
            const isDone = stepNum < currentStep
            const isCurrent = stepNum === currentStep
            return (
              <div key={step.path} className="flex items-center gap-1">
                <Link to={isDone ? step.path : '#'}>
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold font-mono transition-all duration-200',
                    isCurrent ? 'bg-cobalt-600 text-white shadow-sm' :
                    isDone ? 'bg-cobalt-100 text-cobalt-700' :
                    'bg-snow-3 text-ink-3'
                  )}>
                    {stepNum - 1}
                  </div>
                </Link>
                {idx < steps.length - 2 && (
                  <div className={cn('w-4 h-px', isDone ? 'bg-cobalt-300' : 'bg-hairline')} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-3 ml-auto">
        {!isLanding && (
          <button 
            onClick={handleLogout}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-3 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        )}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-3 hover:text-ink hover:bg-snow-2 transition-all">
          <Bell size={16} />
        </button>
        <div className="w-8 h-8 rounded-full bg-cobalt-50 text-cobalt-700 border border-cobalt-200 flex items-center justify-center text-xs font-bold font-mono">
          R
        </div>
      </div>
    </motion.header>
  )
}

export function RaindeerLogo({ size = 32, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('node-marker', className)}
    >
      <defs>
        <linearGradient id="deerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#04338A" />
          <stop offset="52%" stopColor="#0053CC" />
          <stop offset="100%" stopColor="#2E7CF0" />
        </linearGradient>
      </defs>

      {/* === ANTLERS === */}
      {/* Left antler main stem */}
      <line x1="32" y1="30" x2="22" y2="10" stroke="url(#deerGrad)" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Left antler branch 1 (inner) */}
      <line x1="26" y1="20" x2="30" y2="8" stroke="url(#deerGrad)" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Left antler branch 2 (outer) */}
      <line x1="24" y1="14" x2="14" y2="6" stroke="url(#deerGrad)" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Left antler tip branch */}
      <line x1="22" y1="10" x2="18" y2="3" stroke="url(#deerGrad)" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Left cross-strut */}
      <line x1="26" y1="18" x2="22" y2="10" stroke="url(#deerGrad)" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Right antler main stem */}
      <line x1="48" y1="30" x2="58" y2="10" stroke="url(#deerGrad)" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Right antler branch 1 (inner) */}
      <line x1="54" y1="20" x2="50" y2="8" stroke="url(#deerGrad)" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Right antler branch 2 (outer) */}
      <line x1="56" y1="14" x2="66" y2="6" stroke="url(#deerGrad)" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Right antler tip branch */}
      <line x1="58" y1="10" x2="62" y2="3" stroke="url(#deerGrad)" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Right cross-strut */}
      <line x1="54" y1="18" x2="58" y2="10" stroke="url(#deerGrad)" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Antler nodes */}
      <circle cx="18" cy="3" r="2.2" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>
      <circle cx="30" cy="8" r="2.2" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>
      <circle cx="14" cy="6" r="2.2" fill="#04338A" stroke="#2E7CF0" strokeWidth="0.8"/>
      <circle cx="22" cy="10" r="1.8" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>
      <circle cx="62" cy="3" r="2.2" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>
      <circle cx="50" cy="8" r="2.2" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>
      <circle cx="66" cy="6" r="2.2" fill="#04338A" stroke="#2E7CF0" strokeWidth="0.8"/>
      <circle cx="58" cy="10" r="1.8" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>

      {/* === DEER FACE — geometric / triangular === */}
      {/* Outer face outline */}
      <path d="M32 30 L25 48 L40 56 L55 48 L48 30 Z" stroke="url(#deerGrad)" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
      {/* Center forehead line */}
      <line x1="40" y1="30" x2="40" y2="56" stroke="url(#deerGrad)" strokeWidth="1.2" opacity="0.5"/>
      {/* Upper face cross */}
      <line x1="32" y1="30" x2="48" y2="30" stroke="url(#deerGrad)" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Mid face lines */}
      <line x1="25" y1="42" x2="55" y2="42" stroke="url(#deerGrad)" strokeWidth="1.2" opacity="0.6"/>
      {/* Inner eye triangles */}
      <path d="M32 30 L36 38 L40 30 Z" stroke="url(#deerGrad)" strokeWidth="1.2" fill="none" opacity="0.7"/>
      <path d="M48 30 L44 38 L40 30 Z" stroke="url(#deerGrad)" strokeWidth="1.2" fill="none" opacity="0.7"/>

      {/* Eyes */}
      <ellipse cx="35" cy="39" rx="2" ry="1.5" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>
      <ellipse cx="45" cy="39" rx="2" ry="1.5" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>

      {/* Nose bridge lines */}
      <line x1="38" y1="44" x2="42" y2="44" stroke="url(#deerGrad)" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Nose */}
      <circle cx="40" cy="48" r="2" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>

      {/* Chin triangle */}
      <path d="M34 50 L40 56 L46 50" stroke="url(#deerGrad)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

      {/* Junction nodes */}
      <circle cx="32" cy="30" r="2" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>
      <circle cx="48" cy="30" r="2" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>
      <circle cx="40" cy="30" r="1.5" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>
      <circle cx="25" cy="48" r="1.5" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>
      <circle cx="55" cy="48" r="1.5" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>
      <circle cx="40" cy="56" r="1.5" fill="#0053CC" stroke="#2E7CF0" strokeWidth="0.8"/>
    </svg>
  )
}
