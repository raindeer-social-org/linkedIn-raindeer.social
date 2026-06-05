import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function AnimatedPage({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn('min-h-screen', className)}
    >
      {children}
    </motion.div>
  )
}

export function PageWrapper({ children, className, noPadding }) {
  return (
    <div className={cn('pt-16 min-h-screen bg-brand-bg', !noPadding && 'px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}

export function Section({ children, className, title, subtitle, action }) {
  return (
    <section className={cn('mb-8', className)}>
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between mb-5">
          <div>
            {title && <h2 className="text-xl font-semibold text-brand-white">{title}</h2>}
            {subtitle && <p className="text-sm text-brand-muted mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  )
}
