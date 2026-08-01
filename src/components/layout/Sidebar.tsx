import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Settings, ChevronLeft, ChevronRight,
  BarChart3, Shield, Zap, Bell, LogOut, Layers,
} from 'lucide-react'
import { cn } from '@/utils'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'
import { Avatar } from '@/components/ui/avatar'
import { useAllEmployees } from '@/hooks/useEmployees'

export function Sidebar() {
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Fetch real employee count from backend
  const { data: empData } = useAllEmployees(0, 1)
  const employeeCount = empData?.getAllEmployees?.pageInfo?.totalElements ?? null

  const navItems = [
    { label: 'Dashboard',     href: '/',              icon: LayoutDashboard, section: 'main' },
    { label: 'Employees',     href: '/employees',     icon: Users,           section: 'main', badge: employeeCount },
    { label: 'Analytics',     href: '/analytics',     icon: BarChart3,       section: 'main' },
    { label: 'Workflows',     href: '/workflows',     icon: Zap,             section: 'main' },
    { label: 'Security',      href: '/security',      icon: Shield,          section: 'main' },
    { label: 'Notifications', href: '/notifications', icon: Bell,            section: 'secondary' },
    { label: 'Settings',      href: '/settings',      icon: Settings,        section: 'secondary' },
  ]

  const mainItems      = navItems.filter((i) => i.section === 'main')
  const secondaryItems = navItems.filter((i) => i.section === 'secondary')

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 260 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="relative hidden md:flex flex-col h-full bg-zinc-950/80 backdrop-blur-xl border-r border-white/[0.05] overflow-visible z-30"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-transparent to-violet-950/20" />
      </div>

      {/* Logo */}
      <div className="relative flex items-center h-16 px-4 border-b border-white/[0.05] flex-shrink-0">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <motion.div
            className="relative flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            <Layers className="h-4 w-4 text-white" />
            <motion.div
              className="absolute inset-0 rounded-lg bg-white/20"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                className="min-w-0"
              >
                <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  ARCADE
                </span>
                <span className="block text-[10px] text-muted-foreground/70 font-medium tracking-widest uppercase">
                  Enterprise
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 custom-scroll">
        {mainItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            collapsed={sidebarCollapsed}
            hovered={hoveredItem === item.href}
            onHover={setHoveredItem}
          />
        ))}
        <div className="my-3 mx-2 border-t border-white/[0.05]" />
        {secondaryItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={isActive(item.href)}
            collapsed={sidebarCollapsed}
            hovered={hoveredItem === item.href}
            onHover={setHoveredItem}
          />
        ))}
      </nav>

      {/* User */}
      <div className="relative flex-shrink-0 border-t border-white/[0.05] p-3">
        <div
          className={cn(
            'flex items-center gap-3 rounded-xl p-2 cursor-pointer hover:bg-white/5 transition-all duration-200',
            sidebarCollapsed && 'justify-center'
          )}
          onClick={logout}
          title="Logout"
        >
          <Avatar
            firstName={user?.username?.split(' ')[0]}
            lastName={user?.username?.split(' ')[1]}
            username={user?.username}
            size="sm"
            status="online"
          />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.username ?? user?.email ?? 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate capitalize">
                  {(user?.roles?.[0] ?? 'EMPLOYEE').toLowerCase()}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LogOut className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle */}
      <motion.button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border border-white/[0.1] bg-zinc-900 flex items-center justify-center shadow-lg hover:bg-zinc-800 transition-colors text-muted-foreground hover:text-foreground"
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
      >
        {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </motion.button>
    </motion.aside>
  )
}

interface NavItemProps {
  item: { label: string; href: string; icon: React.ComponentType<{ className?: string }>; badge?: number | null }
  isActive: boolean
  collapsed: boolean
  hovered: boolean
  onHover: (href: string | null) => void
}

function NavItem({ item, isActive, collapsed, hovered, onHover }: NavItemProps) {
  const Icon = item.icon
  return (
    <Link
      to={item.href}
      onMouseEnter={() => onHover(item.href)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        'relative flex items-center gap-3 rounded-xl px-3 h-9 transition-all duration-200 group overflow-hidden',
        isActive ? 'text-white bg-white/[0.08]' : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]',
        collapsed && 'justify-center px-0'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute inset-0 rounded-xl bg-white/[0.06] border border-white/[0.1]"
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        />
      )}
      {isActive && (
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-full"
          layoutId="activeBar"
        />
      )}

      <Icon className={cn('h-4 w-4 flex-shrink-0 relative z-10', isActive && 'text-blue-400')} />

      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }}
            className="text-sm font-medium relative z-10 flex-1"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Live badge — only show when not collapsed and count is available */}
      {!collapsed && item.badge != null && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/10 text-muted-foreground"
        >
          {item.badge}
        </motion.span>
      )}

      {/* Tooltip in collapsed mode */}
      {collapsed && hovered && (
        <motion.div
          initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
          className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-800 rounded-lg text-xs font-medium text-white whitespace-nowrap shadow-xl border border-white/10 z-50"
        >
          {item.label}
          {item.badge != null && (
            <span className="ml-1.5 text-muted-foreground">({item.badge})</span>
          )}
        </motion.div>
      )}
    </Link>
  )
}
