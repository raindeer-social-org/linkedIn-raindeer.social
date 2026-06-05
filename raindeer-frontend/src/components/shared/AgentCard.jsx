import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader, Clock, Brain, TrendingUp, Search, Users, Target, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui'

const iconMap = {
  TrendingUp: TrendingUp,
  Search: Search,
  Users: Users,
  Target: Target,
  Brain: Brain,
  Sparkles: Sparkles,
}

const statusConfig = {
  queued:   { label: 'Queued',   color: 'text-brand-muted',   bgColor: 'bg-white/6',           icon: Clock },
  working:  { label: 'Working',  color: 'text-brand-blue-mid', bgColor: 'bg-brand-blue/15',     icon: Loader },
  complete: { label: 'Complete', color: 'text-green-400',       bgColor: 'bg-green-500/10',       icon: CheckCircle },
}

export function AgentCard({ agent, status = 'queued', output = '', progress = 0 }) {
  const cfg = statusConfig[status] || statusConfig.queued
  const IconComponent = iconMap[agent.icon] || Brain
  const StatusIcon = cfg.icon
  const isWorking = status === 'working'
  const isComplete = status === 'complete'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'glass rounded-2xl p-5 flex flex-col gap-4 transition-all duration-500',
        isWorking && 'pulse-border',
        isComplete && 'border-green-500/20'
      )}
      style={isWorking ? { borderColor: 'rgba(30,107,255,0.5)' } : {}}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${agent.color}1A`, border: `1px solid ${agent.color}33` }}
          >
            <IconComponent size={18} style={{ color: agent.color }} />
          </div>
          <div>
            <div className="text-sm font-semibold text-brand-white leading-tight">{agent.name}</div>
            <div className="text-xs text-brand-muted mt-0.5">{agent.role}</div>
          </div>
        </div>

        {/* Status chip */}
        <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0', cfg.bgColor, cfg.color)}>
          {isWorking ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <StatusIcon size={11} />
            </motion.div>
          ) : (
            <StatusIcon size={11} />
          )}
          {cfg.label}
        </div>
      </div>

      {/* Progress bar */}
      {(isWorking || isComplete) && (
        <Progress value={isComplete ? 100 : progress} animated />
      )}

      {/* Output text */}
      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'rounded-xl p-3 text-xs leading-relaxed font-mono text-brand-muted whitespace-pre-line overflow-hidden',
              'bg-black/30 border border-white/5',
              isWorking && 'cursor-blink'
            )}
            style={{ maxHeight: '140px', overflowY: 'auto' }}
          >
            {output}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle placeholder */}
      {status === 'queued' && (
        <div className="rounded-xl p-3 bg-white/2 border border-white/5">
          <div className="flex gap-2 flex-col">
            {[80, 60, 40].map((w, i) => (
              <div key={i} className="h-2 rounded-full bg-white/6" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
