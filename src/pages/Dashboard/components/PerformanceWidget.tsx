import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { cn } from '@/utils'
import type { PerformanceMetric } from '@/constants/types'

interface PerformanceWidgetProps {
  metrics: PerformanceMetric[]
}

export function PerformanceWidget({ metrics }: PerformanceWidgetProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Performance KPIs</CardTitle>
        <CardDescription>Key metrics at a glance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((m, i) => {
          const isUp = m.trend === 'UP'
          const isDown = m.trend === 'DOWN'
          const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus
          const trendColor = isUp ? 'text-emerald-400' : isDown ? 'text-red-400' : 'text-zinc-500'

          // Normalize value for bar display
          const barPct = m.label === 'Time to Hire'
            ? Math.max(0, 100 - (m.value / 30) * 100)
            : m.label === 'Engagement Score'
            ? (m.value / 10) * 100
            : m.value

          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{m.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground">
                    {m.label === 'Engagement Score'
                      ? `${m.value}/10`
                      : m.label === 'Time to Hire'
                      ? `${m.value}d`
                      : `${m.value}%`}
                  </span>
                  <div className={cn('flex items-center gap-0.5 text-xs', trendColor)}>
                    <TrendIcon className="h-3 w-3" />
                    <span>{Math.abs(m.change)}{m.label === 'Time to Hire' ? 'd' : '%'}</span>
                  </div>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className={cn(
                    'h-full rounded-full',
                    isUp ? 'bg-emerald-400' : isDown ? 'bg-red-400' : 'bg-blue-400'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${barPct}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                />
              </div>
            </motion.div>
          )
        })}
      </CardContent>
    </Card>
  )
}
