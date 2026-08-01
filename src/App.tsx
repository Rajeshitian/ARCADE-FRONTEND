import { useEffect } from 'react'
import { AppRoutes } from '@/app/AppRoutes'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'

const INACTIVITY_TIMEOUT = 10 * 60 * 1000

export default function App() {
  const { theme } = useUIStore()
  const { isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    if (!isAuthenticated) return

    let timeoutId: ReturnType<typeof setTimeout>

    const resetTimeout = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(logout, INACTIVITY_TIMEOUT)
    }

    const activityEvents: (keyof WindowEventMap)[] = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
    ]

    activityEvents.forEach((event) => window.addEventListener(event, resetTimeout))
    resetTimeout()

    return () => {
      clearTimeout(timeoutId)
      activityEvents.forEach((event) => window.removeEventListener(event, resetTimeout))
    }
  }, [isAuthenticated, logout])

  return <AppRoutes />
}
