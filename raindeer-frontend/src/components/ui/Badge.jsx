import { cn } from '@/lib/utils'

const variantStyles = {
  // New names
  draft: 'bg-snow-3 text-ink-2 border border-hairline',
  scheduled: 'bg-cobalt-50 text-cobalt-700 border border-cobalt-200/50',
  published: 'bg-positive-wash text-positive border border-positive/10',
  failed: 'bg-negative-wash text-negative border border-negative/10',
  caution: 'bg-caution-wash text-caution border border-caution/10',
  review: 'bg-caution-wash text-caution border border-caution/10',
  tag: 'bg-snow-2 text-ink-2 border border-hairline',
  pro: 'bg-card text-brass-700 border border-brass-300',

  // Old mappings compatibility
  blue: 'bg-cobalt-50 text-cobalt-700 border border-cobalt-200/50',
  green: 'bg-positive-wash text-positive border border-positive/10',
  amber: 'bg-caution-wash text-caution border border-caution/10',
  red: 'bg-negative-wash text-negative border border-negative/10',
  gray: 'bg-snow-3 text-ink-2 border border-hairline',
  purple: 'bg-cobalt-50 text-cobalt-700 border border-cobalt-200/50',
  teal: 'bg-cobalt-50 text-glacier-700 border border-glacier-300/50',
}

export function Badge({ children, variant = 'blue', className, dot, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 h-[24px] rounded-identity text-micro font-mono uppercase tracking-widest',
        variantStyles[variant] || variantStyles.draft,
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          variant === 'published' || variant === 'green' ? 'bg-positive' :
          variant === 'failed' || variant === 'red' ? 'bg-negative' :
          variant === 'caution' || variant === 'review' || variant === 'amber' ? 'bg-caution' :
          'bg-cobalt-600'
        )} />
      )}
      {children}
    </span>
  )
}
