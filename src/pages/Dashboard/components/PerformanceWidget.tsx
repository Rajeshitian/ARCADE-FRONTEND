import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
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
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{m.label}</span>
              <span className="text-sm font-semibold text-foreground">{m.displayValue}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-blue-400"
                initial={{ width: 0 }}
                animate={{ width: `${m.barPercent}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              />
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
