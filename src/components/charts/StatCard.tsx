import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn, formatCompact } from '@/utils'
import { staggerItem } from '@/animations/variants'

interface StatCardProps {
  label: string
  value: number
  prefix?: string
  suffix?: string
  change?: number
  trend?: 'UP' | 'DOWN' | 'NEUTRAL'
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
  iconBg?: string
  format?: 'number' | 'currency' | 'percent'
  description?: string
}

function useCountUp(target: number, duration = 1.5) {
  const [current, setCurrent] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    const start = performance.now()
    const animate = (time: number) => {
      const elapsed = (time - start) / (duration * 1000)
      const progress = Math.min(elapsed, 1)
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) {
        frame.current = requestAnimationFrame(animate)
      }
    }
    frame.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame.current)
  }, [target, duration])

  return current
}

export function StatCard({
  label,
  value,
  prefix = '',
  suffix = '',
  change,
  trend,
  icon: Icon,
  iconColor = 'text-blue-400',
  iconBg = 'bg-blue-500/10',
  format = 'number',
  description,
}: StatCardProps) {
  const animatedValue = useCountUp(value)

  const formatValue = (v: number) => {
    if (format === 'currency') return `$${formatCompact(v)}`
    if (format === 'percent') return `${v.toFixed(1)}%`
    return formatCompact(v)
  }

  const trendColor = trend === 'UP' ? 'text-emerald-400' : trend === 'DOWN' ? 'text-red-400' : 'text-zinc-500'
  const TrendIcon = trend === 'UP' ? TrendingUp : trend === 'DOWN' ? TrendingDown : Minus

  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        'relative rounded-xl border border-white/[0.06] overflow-hidden',
        'bg-gradient-to-b from-white/[0.04] to-transparent',
        'shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_8px_rgba(0,0,0,0.1)]',
        'hover:border-white/[0.1] transition-all duration-300 group'
      )}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/[0.04] to-violet-500/[0.04]" />

      <div className="relative p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center', iconBg)}>
            <Icon className={cn('h-4 w-4', iconColor)} />
          </div>
        </div>

        {/* Value */}
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {prefix}{formatValue(animatedValue)}{suffix}
          </span>
        </div>

        {/* Change indicator */}
        {change !== undefined && trend && (
          <div className={cn('flex items-center gap-1.5 mt-2', trendColor)}>
            <TrendIcon className="h-3.5 w-3.5" />
            <span className="text-sm font-medium">
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-muted-foreground font-normal">vs last month</span>
          </div>
        )}

        {description && (
          <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </motion.div>
  )
}
