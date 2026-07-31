import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { getDepartmentColor } from '@/utils'
import type { DepartmentBreakdown } from '@/constants/types'

interface DepartmentChartProps {
  data: DepartmentBreakdown[]
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl px-3 py-2.5 shadow-2xl">
        <p className="text-xs font-semibold text-white">{d.department}</p>
        <p className="text-xs text-muted-foreground">{d.count} employees</p>
      </div>
    )
  }
  return null
}

export function DepartmentChart({ data }: DepartmentChartProps) {
  const top6 = [...data].sort((a, b) => b.count - a.count).slice(0, 6)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>By Department</CardTitle>
        <CardDescription>Headcount distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={top6}
                dataKey="count"
                nameKey="department"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={70}
                paddingAngle={3}
                strokeWidth={0}
              >
                {top6.map((entry) => (
                  <Cell key={entry.department} fill={getDepartmentColor(entry.department)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 space-y-1.5">
          {top6.slice(0, 4).map((d) => (
            <div key={d.department} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ background: getDepartmentColor(d.department) }}
                />
                <span className="text-xs text-muted-foreground">{d.department}</span>
              </div>
              <span className="text-xs font-medium text-foreground">{d.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
