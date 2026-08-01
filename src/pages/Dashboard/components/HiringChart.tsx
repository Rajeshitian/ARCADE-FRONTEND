import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface HiringChartProps {
  data: { month: string; count: number }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-bold text-white">{payload[0].value}</p>
        <p className="text-xs text-muted-foreground">new hires</p>
      </div>
    )
  }
  return null
}

export function HiringChart({ data }: HiringChartProps) {
  const total = data.reduce((s, d) => s + d.count, 0)
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Monthly Hiring</CardTitle>
            <CardDescription>New hires per month this year</CardDescription>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            <span>{total} total</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="hiringGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#hiringGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
