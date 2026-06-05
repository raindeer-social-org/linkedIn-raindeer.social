import { cn } from '@/lib/utils'

export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  className,
  error,
  hint,
  icon,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-brand-muted mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            'w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-brand-white placeholder-brand-muted text-sm',
            'focus:outline-none focus:border-brand-blue focus:shadow-glow-sm transition-all duration-200',
            icon && 'pl-10',
            error && 'border-red-500/50 focus:border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-brand-muted">{hint}</p>}
    </div>
  )
}

export function Textarea({ label, placeholder, value, onChange, className, rows = 4, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-brand-muted mb-1.5">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          'w-full bg-brand-surface border border-white/10 rounded-xl px-4 py-3 text-brand-white placeholder-brand-muted text-sm resize-none',
          'focus:outline-none focus:border-brand-blue focus:shadow-glow-sm transition-all duration-200',
          className
        )}
        {...props}
      />
    </div>
  )
}
