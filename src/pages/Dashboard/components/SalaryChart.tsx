import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { SALARY_CHART_DATA } from '@/constants/mockData'
import { formatCompact } from '@/utils'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
        <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-xs text-muted-foreground capitalize">{p.dataKey}:</span>
            <span className="text-xs font-semibold text-white">${formatCompact(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function SalaryChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Salary Budget vs Actual</CardTitle>
            <CardDescription>Monthly payroll comparison</CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-sm bg-blue-500/60" />
              <span className="text-muted-foreground">Budget</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-sm bg-violet-500/80" />
              <span className="text-muted-foreground">Actual</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SALARY_CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -10 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
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
                tickFormatter={(v) => `$${formatCompact(v)}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="budget" fill="rgba(99,102,241,0.4)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="actual" fill="rgba(139,92,246,0.7)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
