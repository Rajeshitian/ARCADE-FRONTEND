import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/utils'

const icons = {
  default: Info,
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles = {
  default: 'border-white/10 bg-zinc-900/90',
  success: 'border-emerald-500/30 bg-emerald-950/80',
  error: 'border-red-500/30 bg-red-950/80',
  warning: 'border-amber-500/30 bg-amber-950/80',
  info: 'border-blue-500/30 bg-blue-950/80',
}

const iconStyles = {
  default: 'text-zinc-400',
  success: 'text-emerald-400',
  error: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-blue-400',
}

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = icons[toast.variant]
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className={cn(
                'relative flex items-start gap-3 rounded-xl border p-4',
                'backdrop-blur-xl shadow-2xl',
                styles[toast.variant]
              )}
            >
              <Icon className={cn('h-4 w-4 flex-shrink-0 mt-0.5', iconStyles[toast.variant])} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 rounded-md p-0.5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export function useToast() {
  const { addToast } = useUIStore()
  return {
    toast: addToast,
    success: (title: string, description?: string) =>
      addToast({ variant: 'success', title, description }),
    error: (title: string, description?: string) =>
      addToast({ variant: 'error', title, description }),
    warning: (title: string, description?: string) =>
      addToast({ variant: 'warning', title, description }),
    info: (title: string, description?: string) =>
      addToast({ variant: 'info', title, description }),
  }
}
