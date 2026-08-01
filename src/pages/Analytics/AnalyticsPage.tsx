import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { Loader2, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { staggerContainer, staggerItem } from '@/animations/variants'
import { formatCompact, getDepartmentColor } from '@/utils'
import type { EmployeeStatus } from '@/constants/types'

const STATUS_COLORS: Record<EmployeeStatus, string> = {
  ACTIVE: '#34d399',
  INACTIVE: '#71717a',
  ON_LEAVE: '#fbbf24',
  TERMINATED: '#f87171',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="text-sm font-bold text-white">
            {typeof p.value === 'number' && p.value > 1000
              ? `$${formatCompact(p.value)}`
              : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function AnalyticsPage() {
  const { stats, employees, loading, error } = useDashboardStats()

  const statusBreakdown = useMemo(() => {
    const counts = new Map<EmployeeStatus, number>()
    for (const e of employees) {
      counts.set(e.status, (counts.get(e.status) ?? 0) + 1)
    }
    return Array.from(counts.entries()).map(([status, count]) => ({ status, count }))
  }, [employees])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full py-24">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Loading live analytics…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-full py-24">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <p className="text-sm font-medium text-foreground">Couldn't load analytics data</p>
          <p className="text-xs text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Deep insights into your workforce, live from the database.</p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        {/* Headcount growth */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Headcount Growth</CardTitle>
              <CardDescription>Monthly new hire trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.monthlyHires} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)' }} />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#grad1)" dot={false} activeDot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dept distribution */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Department Headcount</CardTitle>
              <CardDescription>People per department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.departmentBreakdown.slice(0, 7)} layout="vertical" margin={{ top: 4, right: 4, bottom: 0, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="department" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} width={55} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {stats.departmentBreakdown.slice(0, 7).map((entry) => (
                        <Cell key={entry.department} fill={getDepartmentColor(entry.department)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Avg salary by department */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Average Salary by Department</CardTitle>
              <CardDescription>Live figures from current records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.departmentBreakdown.slice(0, 8)} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="department" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${formatCompact(v)}`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="avgSalary" fill="rgba(139,92,246,0.7)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status distribution */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Employee Status Distribution</CardTitle>
              <CardDescription>Live breakdown by employment status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {statusBreakdown.map((entry) => (
                        <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap gap-3 justify-center">
                {statusBreakdown.map((s) => (
                  <div key={s.status} className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ background: STATUS_COLORS[s.status] }} />
                    <span className="text-xs text-muted-foreground">{s.status} ({s.count})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
