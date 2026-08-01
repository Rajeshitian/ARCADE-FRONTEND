import { Link, useLocation } from 'react-router-dom'
import { BarChart3, LayoutDashboard, Menu, Users } from 'lucide-react'
import { cn } from '@/utils'
import { useUIStore } from '@/store/uiStore'

const navItems = [
  { label: 'Home', href: '/', icon: LayoutDashboard },
  { label: 'People', href: '/employees', icon: Users },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
]

export function MobileNav() {
  const location = useLocation()
  const { mobileSidebarOpen, toggleMobileSidebar } = useUIStore()

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 flex h-16 items-center justify-around border-t border-white/[0.08] bg-zinc-950/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      {navItems.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          to={href}
          className={cn(
            'flex min-w-[68px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-medium transition-colors',
            isActive(href)
              ? 'text-blue-400'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </Link>
      ))}
      <button
        type="button"
        onClick={toggleMobileSidebar}
        aria-label={mobileSidebarOpen ? 'Close navigation menu' : 'Open more navigation options'}
        className={cn(
          'flex min-w-[68px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-medium transition-colors',
          mobileSidebarOpen ? 'text-blue-400' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Menu className="h-5 w-5" />
        <span>More</span>
      </button>
    </nav>
  )
}
