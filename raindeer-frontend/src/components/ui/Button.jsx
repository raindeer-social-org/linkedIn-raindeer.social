import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-cobalt-600 text-white hover:bg-cobalt-700 hover:shadow-cta border border-transparent shadow-xs',
  secondary: 'bg-card text-ink border border-hairline-bold hover:bg-snow-2 hover:border-ink-4 shadow-xs',
  ghost: 'bg-transparent text-ink-2 hover:bg-snow-2 hover:text-ink border border-transparent',
  danger: 'bg-negative text-white hover:bg-negative/90 border border-transparent shadow-xs',
  'blue-outline': 'bg-transparent text-cobalt-600 border border-cobalt-300 hover:bg-cobalt-50',
  'on-midnight': 'bg-transparent text-midnight-ink border border-midnight-line hover:bg-midnight-card',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-controls h-[36px]',
  md: 'px-5 py-2.5 text-sm rounded-controls h-[40px]',
  lg: 'px-7 py-3.5 text-base rounded-controls font-medium h-[44px]',
  xl: 'px-9 py-4 text-lg rounded-containers font-semibold h-[52px]',
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
      whileHover={disabled ? {} : { y: -1 }}
      whileTap={disabled ? {} : { y: 0 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-dur-1 cursor-pointer select-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        disabled && 'opacity-40 bg-snow-3 text-ink-4 border-hairline cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  )
}
