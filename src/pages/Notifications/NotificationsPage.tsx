import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, UserPlus, TrendingUp, LogOut, Edit,
  Star, FileText, CheckCheck, Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { MOCK_DASHBOARD_STATS } from '@/constants/mockData'
import { formatRelativeTime, cn } from '@/utils'
import { staggerContainer, staggerItem } from '@/animations/variants'
import type { ActivityItem } from '@/constants/types'

type FilterType = 'all' | 'unread' | 'HIRE' | 'PROMOTION' | 'REVIEW' | 'UPDATE'

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  HIRE:      { icon: UserPlus,  color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'New Hire'   },
  PROMOTION: { icon: TrendingUp, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',        label: 'Promotion'  },
  DEPARTURE: { icon: LogOut,    color: 'bg-red-500/10 text-red-400 border-red-500/20',             label: 'Departure'  },
  UPDATE:    { icon: Edit,      color: 'bg-violet-500/10 text-violet-400 border-violet-500/20',    label: 'Update'     },
  REVIEW:    { icon: Star,      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',       label: 'Review'     },
  NOTE:      { icon: FileText,  color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',          label: 'Note'       },
}

// Extend mock data to have more notifications
const MOCK_NOTIFICATIONS: ActivityItem[] = [
  ...MOCK_DASHBOARD_STATS.recentActivity,
  {
    id: '6',
    type: 'PROMOTION' as const,
    message: 'Lucas Oliveira promoted to Principal Engineer',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    user: { id: '5', name: 'David Kim', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=david' },
  },
  {
    id: '7',
    type: 'REVIEW' as const,
    message: 'Annual performance reviews due for Engineering team',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    user: { id: '10', name: 'Aria Foster', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=aria' },
  },
  {
    id: '8',
    type: 'UPDATE' as const,
    message: 'Salary bands updated for all departments',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    user: { id: '1', name: 'Alex Chen', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=alex' },
  },
  {
    id: '9',
    type: 'HIRE' as const,
    message: 'Omar Hassan joined the Finance team',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    user: { id: '10', name: 'Aria Foster', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=aria' },
  },
  {
    id: '10',
    type: 'NOTE' as const,
    message: 'Q1 hiring plan submitted for board approval',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    user: { id: '2', name: 'Sarah Mitchell', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=sarah' },
  },
]

export function NotificationsPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !readIds.has(n.id)
    if (filter === 'all') return true
    return n.type === filter
  })

  const markAllRead = () => setReadIds(new Set(notifications.map((n) => n.id)))
  const markRead = (id: string) => setReadIds((prev) => new Set([...prev, id]))
  const dismiss = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id))

  const filterBtns: { key: FilterType; label: string }[] = [
    { key: 'all',       label: 'All' },
    { key: 'unread',    label: `Unread (${unreadCount})` },
    { key: 'HIRE',      label: 'Hires' },
    { key: 'PROMOTION', label: 'Promotions' },
    { key: 'REVIEW',    label: 'Reviews' },
    { key: 'UPDATE',    label: 'Updates' },
  ]

  return (
    <div className="p-6 space-y-5 min-h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Bell className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {unreadCount > 0
                ? <span className="text-blue-400 font-medium">{unreadCount} unread</span>
                : 'All caught up'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              onClick={markAllRead}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {filterBtns.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200',
              filter === btn.key
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                : 'bg-white/[0.04] border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-white/20'
            )}
          >
            {btn.label}
          </button>
        ))}
      </motion.div>

      {/* Notifications list */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="h-14 w-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No notifications</p>
              <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
            </motion.div>
          ) : (
            filtered.map((notif) => {
              const cfg = typeConfig[notif.type] ?? typeConfig.NOTE
              const Icon = cfg.icon
              const isRead = readIds.has(notif.id)

              return (
                <motion.div
                  key={notif.id}
                  variants={staggerItem}
                  layout
                  exit={{ opacity: 0, x: 60, scale: 0.95 }}
                  className={cn(
                    'relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 group',
                    isRead
                      ? 'border-white/[0.05] bg-white/[0.02]'
                      : 'border-white/[0.08] bg-white/[0.04]'
                  )}
                >
                  {/* Unread dot */}
                  {!isRead && (
                    <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-400" />
                  )}

                  {/* Icon */}
                  <div className={cn(
                    'h-9 w-9 rounded-lg border flex items-center justify-center flex-shrink-0',
                    cfg.color
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm leading-snug',
                      isRead ? 'text-foreground/70' : 'text-foreground font-medium'
                    )}>
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Avatar
                        firstName={notif.user.name.split(' ')[0]}
                        lastName={notif.user.name.split(' ')[1]}
                        src={notif.user.avatar}
                        size="xs"
                      />
                      <span className="text-xs text-muted-foreground">{notif.user.name}</span>
                      <span className="text-muted-foreground/40 text-xs">·</span>
                      <span className="text-xs text-muted-foreground">{formatRelativeTime(notif.timestamp)}</span>
                      <Badge variant="secondary" className="text-[10px] py-0 ml-1">{cfg.label}</Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
                    {!isRead && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-7 w-7 text-muted-foreground hover:text-blue-400"
                        title="Mark as read"
                        onClick={() => markRead(notif.id)}
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-7 w-7 text-muted-foreground hover:text-red-400"
                      title="Dismiss"
                      onClick={() => dismiss(notif.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
