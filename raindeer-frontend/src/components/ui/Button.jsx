import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-brand-blue text-white hover:bg-blue-600 glow-blue hover:shadow-glow border border-transparent',
  secondary: 'bg-transparent text-brand-white border border-white/10 hover:border-brand-blue hover:text-brand-blue',
  ghost: 'bg-transparent text-brand-muted hover:text-brand-white hover:bg-white/5 border border-transparent',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
  'blue-outline': 'bg-transparent text-brand-blue border border-brand-blue/40 hover:bg-brand-blue/10 hover:border-brand-blue',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl font-medium',
  xl: 'px-9 py-4 text-lg rounded-2xl font-semibold',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  onClick,
  type = 'button',
  fullWidth,
  icon,
  ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { y: -2, scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer select-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  )
}
