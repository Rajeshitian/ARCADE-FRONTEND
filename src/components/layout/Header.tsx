import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronRight, Menu, X,
} from 'lucide-react'
import { cn } from '@/utils'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'

const routeLabels: Record<string, string[]> = {
  '/': ['Dashboard'],
  '/employees': ['People', 'Employees'],
  '/employees/new': ['People', 'Employees', 'New'],
  '/analytics': ['Analytics'],
  '/settings': ['Settings'],
  '/workflows': ['Workflows'],
  '/security': ['Security'],
  '/notifications': ['Notifications'],
}

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme, openCommandPalette, mobileSidebarOpen, toggleMobileSidebar } = useUIStore()
  const { user } = useAuthStore()

  const breadcrumbs = routeLabels[location.pathname] ?? ['Page']

  return (
    <header className="relative h-16 flex items-center justify-between px-4 sm:px-6 border-b border-white/[0.05] bg-zinc-950/60 backdrop-blur-xl flex-shrink-0 z-20">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={toggleMobileSidebar}
        aria-label={mobileSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="md:hidden mr-2 text-muted-foreground hover:text-foreground"
      >
        {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Breadcrumbs */}
      <div className="flex min-w-0 items-center gap-2">
        {breadcrumbs.map((crumb, i) => (
          <div key={crumb} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />}
            <span
              className={cn(
                'text-sm',
                i === breadcrumbs.length - 1
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground cursor-pointer transition-colors'
              )}
            >
              {crumb}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search trigger */}
        <motion.button
          onClick={openCommandPalette}
          className={cn(
            'hidden md:flex items-center gap-2 h-8 px-3 rounded-lg',
            'border border-white/[0.08] bg-white/[0.04] text-muted-foreground',
            'hover:bg-white/[0.08] hover:border-white/[0.12] hover:text-foreground',
            'transition-all duration-200 text-sm'
          )}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">Search...</span>
          <div className="hidden lg:flex items-center gap-0.5 ml-2">
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white/10 rounded font-mono">⌘</kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white/10 rounded font-mono">K</kbd>
          </div>
        </motion.button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
        >
          <motion.div
            key={theme}
            initial={{ rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </motion.div>
        </Button>

        {/* Notifications */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/notifications')}
          aria-label="Open notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-blue-400 rounded-full" />
        </Button>

        {/* Avatar */}
        <div className="flex items-center gap-2 ml-1">
          <button
            type="button"
            aria-label="Open profile settings"
            onClick={() => navigate('/settings')}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <Avatar
              src={user?.avatar}
              username={user?.username}
              firstName={user?.username}
              size="sm"
              status="online"
              className="cursor-pointer hover:ring-2 ring-primary/50 transition-all"
            />
          </button>
        </div>
      </div>
    </header>
  )
}
