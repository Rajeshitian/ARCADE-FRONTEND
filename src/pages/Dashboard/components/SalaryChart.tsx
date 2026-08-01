import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { formatCompact } from '@/utils'
import type { DepartmentBreakdown } from '@/constants/types'

interface SalaryChartProps {
  data: DepartmentBreakdown[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-bold text-white">${formatCompact(payload[0].value)}</p>
        <p className="text-xs text-muted-foreground">avg. salary</p>
      </div>
    )
  }
  return null
}

export function SalaryChart({ data }: SalaryChartProps) {
  const top8 = [...data].sort((a, b) => b.avgSalary - a.avgSalary).slice(0, 8)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Average Salary by Department</CardTitle>
        <CardDescription>Live figures from current employee records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={top8} margin={{ top: 4, right: 4, bottom: 0, left: -10 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="department"
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
              <Bar dataKey="avgSalary" fill="rgba(139,92,246,0.7)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
