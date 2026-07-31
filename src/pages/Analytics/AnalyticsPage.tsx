import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, Radar
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { MOCK_DASHBOARD_STATS, SALARY_CHART_DATA } from '@/constants/mockData'
import { staggerContainer, staggerItem } from '@/animations/variants'
import { formatCompact, getDepartmentColor } from '@/utils'

const radarData = [
  { subject: 'Engineering', A: 95 },
  { subject: 'Product', A: 82 },
  { subject: 'Design', A: 78 },
  { subject: 'Marketing', A: 68 },
  { subject: 'Sales', A: 74 },
  { subject: 'Operations', A: 71 },
]

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
  const stats = MOCK_DASHBOARD_STATS

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Deep insights into your workforce.</p>
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
                        <rect key={entry.department} fill={getDepartmentColor(entry.department)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Salary budget */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Payroll Budget vs Actual</CardTitle>
              <CardDescription>Annual comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SALARY_CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${formatCompact(v)}`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="budget" fill="rgba(99,102,241,0.4)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="actual" fill="rgba(139,92,246,0.7)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Radar */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Team Performance Index</CardTitle>
              <CardDescription>Department productivity scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} />
                    <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
