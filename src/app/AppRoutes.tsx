import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { AppLayout } from '@/layouts/AppLayout'
import { LoginPage } from '@/pages/Login/LoginPage'

const DashboardPage     = lazy(() => import('@/pages/Dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const EmployeesPage     = lazy(() => import('@/pages/Employees/EmployeesPage').then((m) => ({ default: m.EmployeesPage })))
const AnalyticsPage     = lazy(() => import('@/pages/Analytics/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })))
const SettingsPage      = lazy(() => import('@/pages/Settings/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const NotificationsPage = lazy(() => import('@/pages/Notifications/NotificationsPage').then((m) => ({ default: m.NotificationsPage })))
const SecurityPage      = lazy(() => import('@/pages/Security/SecurityPage').then((m) => ({ default: m.SecurityPage })))
const NotFoundPage      = lazy(() => import('@/pages/NotFound/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    </div>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
      <div className="h-14 w-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
        <span className="text-2xl">🚧</span>
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">Coming soon.</p>
      </div>
    </div>
  )
}

const W = (C: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}><C /></Suspense>
)

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index                 element={W(DashboardPage)} />
          <Route path="employees"      element={W(EmployeesPage)} />
          <Route path="analytics"      element={W(AnalyticsPage)} />
          <Route path="settings"       element={W(SettingsPage)} />
          <Route path="notifications"  element={W(NotificationsPage)} />
          <Route path="security"       element={W(SecurityPage)} />
          <Route path="workflows"      element={<Suspense fallback={<PageLoader />}><PlaceholderPage title="Workflows" /></Suspense>} />
          <Route path="*"              element={W(NotFoundPage)} />
        </Route>
      </Route>
    </Routes>
  )
}
