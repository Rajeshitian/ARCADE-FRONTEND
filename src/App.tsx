import { useEffect } from 'react'
import { AppRoutes } from '@/app/AppRoutes'
import { useUIStore } from '@/store/uiStore'

export default function App() {
  const { theme } = useUIStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return <AppRoutes />
}
