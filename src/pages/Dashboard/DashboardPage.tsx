import { motion } from 'framer-motion'
import {
  Users, Activity, UserPlus, DollarSign
} from 'lucide-react'
import { staggerContainer } from '@/animations/variants'
import { StatCard } from '@/components/charts/StatCard'
import { ActivityFeed } from './components/ActivityFeed'
import { DepartmentChart } from './components/DepartmentChart'
import { HiringChart } from './components/HiringChart'
import { SalaryChart } from './components/SalaryChart'
import { PerformanceWidget } from './components/PerformanceWidget'
import { QuickActions } from './components/QuickActions'
import { MOCK_DASHBOARD_STATS } from '@/constants/mockData'
import { useAllEmployees } from '@/hooks/useEmployees'

export function DashboardPage() {
  // Fetch real employee count from backend
  const { data: empData } = useAllEmployees(0, 1) // page 0, size 1 — we only need totalElements
  const totalEmployees = empData?.getAllEmployees?.pageInfo?.totalElements ?? MOCK_DASHBOARD_STATS.totalEmployees
  const activeEmployees = MOCK_DASHBOARD_STATS.activeEmployees
  const stats = { ...MOCK_DASHBOARD_STATS, totalEmployees }

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
            Good morning, Alex 👋
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
          value={totalEmployees}
          change={4.2}
          trend="UP"
          icon={Users}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          description="Across all departments"
        />
        <StatCard
          label="Active Members"
          value={activeEmployees}
          change={2.1}
          trend="UP"
          icon={Activity}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          description="Currently working"
        />
        <StatCard
          label="New Hires (MTD)"
          value={stats.newHires}
          change={12.5}
          trend="UP"
          icon={UserPlus}
          iconColor="text-violet-400"
          iconBg="bg-violet-500/10"
          description="This month"
        />
        <StatCard
          label="Avg. Salary"
          value={stats.avgSalary}
          format="currency"
          change={3.8}
          trend="UP"
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
          <SalaryChart />
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
