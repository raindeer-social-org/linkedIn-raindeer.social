import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import modelsData from '@/data/models.json'

export function CostEstimator({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {modelsData.map((model) => {
        const isSelected = selected === model.key
        return (
          <motion.button
            key={model.key}
            onClick={() => onSelect(model.key)}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative text-left rounded-2xl p-5 border transition-all duration-200 cursor-pointer',
              isSelected
                ? 'border-brand-blue bg-brand-blue/10 shadow-glow-sm'
                : 'border-white/8 bg-white/2 hover:border-white/15'
            )}
          >
            {model.recommended && (
              <div className="absolute -top-2.5 left-4">
                <span className="bg-brand-blue text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-brand-white">{model.name}</div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-white" />
                </div>
              )}
            </div>

            <div className="font-mono text-2xl font-bold mb-1" style={{ color: model.color }}>
              ${model.costPerVideo.toFixed(2)}
            </div>
            <div className="text-xs text-brand-muted mb-3">per video</div>

            <div className="text-xs text-brand-muted mb-3">{model.description}</div>

            {/* Quality bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-brand-muted mb-1">
                <span>Quality</span>
                <span style={{ color: model.color }}>{model.quality}</span>
              </div>
              <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: model.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${model.qualityScore}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>

            {/* Features */}
            <ul className="mt-3 space-y-1">
              {model.features.map((f, i) => (
                <li key={i} className="text-xs text-brand-muted flex items-center gap-1.5">
                  <span style={{ color: model.color }}>·</span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.button>
        )
      })}
    </div>
  )
}
