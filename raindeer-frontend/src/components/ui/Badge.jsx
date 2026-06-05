import { cn } from '@/lib/utils'

const variantStyles = {
  blue:   'bg-brand-blue/20 text-brand-blue border border-brand-blue/30',
  green:  'bg-green-500/15 text-green-400 border border-green-500/30',
  amber:  'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  red:    'bg-red-500/15 text-red-400 border border-red-500/30',
  gray:   'bg-white/6 text-brand-muted border border-white/10',
  purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  teal:   'bg-teal-500/15 text-teal-400 border border-teal-500/30',
}

export function Badge({ children, variant = 'blue', className, dot, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          variant === 'blue' ? 'bg-brand-blue' :
          variant === 'green' ? 'bg-green-400' :
          variant === 'amber' ? 'bg-amber-400' :
          variant === 'red' ? 'bg-red-400' :
          variant === 'teal' ? 'bg-teal-400' :
          'bg-brand-muted'
        )} />
      )}
      {children}
    </span>
  )
}
