import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Modal({ open, onClose, title, children, size = 'md', className }) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose?.()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className={cn(
                  'fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4',
                  sizes[size]
                )}
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 8 }}
                transition={{ duration: 0.24, ease: 'easeOut' }} // dur-2
              >
                <div className={cn('bg-card border border-hairline rounded-stage shadow-lg p-6 max-h-[90vh] overflow-y-auto', className)}>
                  {title && (
                    <div className="flex items-center justify-between mb-5">
                      <Dialog.Title className="text-title font-medium font-serif text-ink">
                        {title}
                      </Dialog.Title>
                      <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-3 hover:text-ink hover:bg-snow-2 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {children}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
