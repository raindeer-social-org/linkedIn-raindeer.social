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
        <label className="block text-small font-medium text-ink mb-1.5 font-sans">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            'w-full bg-card border border-hairline-bold rounded-controls px-4 py-2.5 text-ink placeholder-ink-3 text-small',
            'focus:outline-none focus:border-cobalt-500 focus:ring-4 focus:ring-cobalt-100 transition-all duration-dur-1',
            icon && 'pl-10',
            error && 'border-negative focus:border-negative focus:ring-negative-wash',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-negative font-sans">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-ink-3 font-sans">{hint}</p>}
    </div>
  )
}

export function Textarea({ label, placeholder, value, onChange, className, rows = 4, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-small font-medium text-ink mb-1.5 font-sans">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          'w-full bg-card border border-hairline-bold rounded-controls px-4 py-3 text-ink placeholder-ink-3 text-small resize-none',
          'focus:outline-none focus:border-cobalt-500 focus:ring-4 focus:ring-cobalt-100 transition-all duration-dur-1',
          className
        )}
        {...props}
      />
    </div>
  )
}
