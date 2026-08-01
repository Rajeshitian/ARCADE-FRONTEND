import { useMemo } from 'react'
import { useAllEmployees } from './useEmployees'
import type {
  Employee,
  DashboardStats,
  DepartmentBreakdown,
  MonthlyHireCount,
  PerformanceMetric,
  ActivityItem,
  ActivityType,
} from '@/constants/types'

// Pull a large page so client-side aggregation reflects the whole live dataset.
// (There's no dedicated stats endpoint on the backend, so everything below is
// computed from real Employee records — nothing here is fabricated.)
const STATS_PAGE_SIZE = 1000
const MONTHS_TO_SHOW = 6
const RECENT_ACTIVITY_LIMIT = 8

function buildDepartmentBreakdown(employees: Employee[]): DepartmentBreakdown[] {
  const byDept = new Map<string, { count: number; salarySum: number }>()

  for (const emp of employees) {
    const name = emp.department?.departmentName ?? 'Unassigned'
    const entry = byDept.get(name) ?? { count: 0, salarySum: 0 }
    entry.count += 1
    entry.salarySum += emp.salary ?? 0
    byDept.set(name, entry)
  }

  return Array.from(byDept.entries())
    .map(([department, v]) => ({
      department,
      count: v.count,
      avgSalary: v.count ? Math.round(v.salarySum / v.count) : 0,
    }))
    .sort((a, b) => b.count - a.count)
}

function buildMonthlyHires(employees: Employee[]): MonthlyHireCount[] {
  const now = new Date()
  const buckets: { key: string; label: string }[] = []

  for (let i = MONTHS_TO_SHOW - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString('en-US', { month: 'short' }),
    })
  }

  const counts = new Map(buckets.map((b) => [b.key, 0]))

  for (const emp of employees) {
    if (!emp.joiningDate) continue
    const d = new Date(emp.joiningDate)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return buckets.map((b) => ({ month: b.label, count: counts.get(b.key) ?? 0 }))
}

function buildRecentActivity(employees: Employee[]): ActivityItem[] {
  return employees
    .filter((e) => e.createdDate || e.updatedDate)
    .map((e) => {
      const isNew = !e.updatedDate || e.updatedDate === e.createdDate
      const timestamp = (e.updatedDate ?? e.createdDate) as string
      const type: ActivityType = isNew ? 'HIRE' : 'UPDATE'
      const actor = (isNew ? e.createdBy : e.updatedBy) ?? 'System'

      return {
        id: e.id,
        type,
        message: isNew
          ? `${e.fullName} joined ${e.department?.departmentName ?? 'the company'}`
          : `${e.fullName}'s record was updated`,
        timestamp,
        user: { id: e.id, name: actor },
      }
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, RECENT_ACTIVITY_LIMIT)
}

function buildPerformanceMetrics(employees: Employee[], departmentCount: number): PerformanceMetric[] {
  const total = employees.length
  const active = employees.filter((e) => e.status === 'ACTIVE').length
  const activeRate = total ? Math.round((active / total) * 100) : 0

  const now = Date.now()
  const avgTenureYears = total
    ? employees.reduce((sum, e) => {
        if (!e.joiningDate) return sum
        const years = (now - new Date(e.joiningDate).getTime()) / (1000 * 60 * 60 * 24 * 365)
        return sum + years
      }, 0) / total
    : 0

  const avgProjects = total
    ? employees.reduce((sum, e) => sum + (e.projects?.length ?? 0), 0) / total
    : 0

  const tenureRounded = Math.round(avgTenureYears * 10) / 10
  const projectsRounded = Math.round(avgProjects * 10) / 10

  return [
    {
      label: 'Active Rate',
      value: activeRate,
      displayValue: `${activeRate}%`,
      barPercent: activeRate,
    },
    {
      label: 'Avg. Tenure',
      value: tenureRounded,
      displayValue: `${tenureRounded}yr`,
      barPercent: Math.min(100, (tenureRounded / 10) * 100),
    },
    {
      label: 'Avg. Projects',
      value: projectsRounded,
      displayValue: `${projectsRounded}`,
      barPercent: Math.min(100, (projectsRounded / 5) * 100),
    },
    {
      label: 'Departments',
      value: departmentCount,
      displayValue: `${departmentCount}`,
      barPercent: Math.min(100, (departmentCount / 10) * 100),
    },
  ]
}

export function useDashboardStats() {
  const { data, loading, error, refetch } = useAllEmployees(0, STATS_PAGE_SIZE)

  const employees: Employee[] = data?.getAllEmployees?.content ?? []
  const totalElements = data?.getAllEmployees?.pageInfo?.totalElements ?? employees.length

  const stats: DashboardStats = useMemo(() => {
    const activeEmployees = employees.filter((e) => e.status === 'ACTIVE').length

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const newHiresThisMonth = employees.filter(
      (e) => e.joiningDate && new Date(e.joiningDate) >= startOfMonth
    ).length

    const avgSalary = employees.length
      ? Math.round(employees.reduce((sum, e) => sum + (e.salary ?? 0), 0) / employees.length)
      : 0

    const departmentBreakdown = buildDepartmentBreakdown(employees)

    return {
      totalEmployees: totalElements,
      activeEmployees,
      newHiresThisMonth,
      avgSalary,
      departmentBreakdown,
      monthlyHires: buildMonthlyHires(employees),
      recentActivity: buildRecentActivity(employees),
      performanceMetrics: buildPerformanceMetrics(employees, departmentBreakdown.length),
    }
  }, [employees, totalElements])

  return { stats, employees, loading, error, refetch }
}
