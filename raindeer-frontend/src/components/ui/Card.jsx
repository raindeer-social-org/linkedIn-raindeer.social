import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function Card({ children, className, variant = 'default', onClick, hover = true, ...props }) {
  const variants = {
    default: 'bg-card border border-hairline rounded-containers shadow-sm',
    elevated: 'bg-card border border-hairline-bold rounded-containers shadow-md',
    highlighted: 'bg-cobalt-50 border border-cobalt-200 rounded-containers shadow-xs',
    surface: 'bg-snow-2 border border-hairline rounded-containers',
  }

  const isInteractive = onClick || hover
  const Component = isInteractive ? motion.div : 'div'
  
  const motionProps = isInteractive ? {
    whileHover: { y: -2 },
    transition: { duration: 0.2, ease: 'easeOut' }, // dur-2
  } : {}

  return (
    <Component
      onClick={onClick}
      className={cn(
        variants[variant],
        'p-6',
        onClick && 'cursor-pointer',
        isInteractive && 'hover:border-hairline-bold hover:shadow-md transition-all duration-dur-2',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}
