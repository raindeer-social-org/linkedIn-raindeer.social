import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function Card({ children, className, variant = 'default', onClick, hover = true, ...props }) {
  const variants = {
    default: 'glass rounded-2xl',
    elevated: 'glass-elevated rounded-2xl',
    highlighted: 'glass-blue rounded-2xl',
    surface: 'bg-brand-surface border border-white/8 rounded-2xl',
  }

  const Component = onClick || hover ? motion.div : 'div'
  const motionProps = (onClick || hover) ? {
    whileHover: { y: -2, scale: 1.005 },
    transition: { duration: 0.2 },
  } : {}

  return (
    <Component
      onClick={onClick}
      className={cn(variants[variant], 'p-6', onClick && 'cursor-pointer', className)}
      {...(onClick || hover ? motionProps : {})}
      {...props}
    >
      {children}
    </Component>
  )
}
