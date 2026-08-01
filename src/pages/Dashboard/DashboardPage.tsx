import { motion } from 'framer-motion'
import {
  Users, Activity, UserPlus, DollarSign, Loader2, AlertTriangle
} from 'lucide-react'
import { staggerContainer } from '@/animations/variants'
import { StatCard } from '@/components/charts/StatCard'
import { ActivityFeed } from './components/ActivityFeed'
import { DepartmentChart } from './components/DepartmentChart'
import { HiringChart } from './components/HiringChart'
import { SalaryChart } from './components/SalaryChart'
import { PerformanceWidget } from './components/PerformanceWidget'
import { QuickActions } from './components/QuickActions'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { useAuthStore } from '@/store/authStore'

export function DashboardPage() {
  const { stats, loading, error } = useDashboardStats()
  const { user } = useAuthStore()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full py-24">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Loading live dashboard data…</p>
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
          <p className="text-sm font-medium text-foreground">Couldn't load dashboard data</p>
          <p className="text-xs text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back{user?.name || user?.username ? `, ${user.name ?? user.username}` : ''} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's what's happening with your team today.
          </p>
        </div>
        <QuickActions />
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        <StatCard
          label="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          description="Across all departments"
        />
        <StatCard
          label="Active Members"
          value={stats.activeEmployees}
          icon={Activity}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          description="Currently working"
        />
        <StatCard
          label="New Hires (MTD)"
          value={stats.newHiresThisMonth}
          icon={UserPlus}
          iconColor="text-violet-400"
          iconBg="bg-violet-500/10"
          description="This month"
        />
        <StatCard
          label="Avg. Salary"
          value={stats.avgSalary}
          format="currency"
          icon={DollarSign}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
          description="Annual compensation"
        />
      </motion.div>

      {/* Charts Row 1 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <div className="lg:col-span-2">
          <HiringChart data={stats.monthlyHires} />
        </div>
        <div>
          <DepartmentChart data={stats.departmentBreakdown} />
        </div>
      </motion.div>

      {/* Charts Row 2 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <div className="lg:col-span-2">
          <SalaryChart data={stats.departmentBreakdown} />
        </div>
        <div>
          <PerformanceWidget metrics={stats.performanceMetrics} />
        </div>
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
      >
        <ActivityFeed activities={stats.recentActivity} />
      </motion.div>
    </div>
  )
}
