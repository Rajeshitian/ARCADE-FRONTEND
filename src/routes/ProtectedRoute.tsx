import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { SecurityRole } from '@/constants/types'

interface ProtectedRouteProps {
  requiredRole?: SecurityRole
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && !user?.roles?.includes(requiredRole) && !user?.roles?.includes('ADMIN')) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
