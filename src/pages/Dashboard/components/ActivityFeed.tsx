import { motion } from 'framer-motion'
import { UserPlus, TrendingUp, LogOut, Edit, Star, FileText } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/utils'
import type { ActivityItem } from '@/constants/types'
import { cn } from '@/utils'

interface ActivityFeedProps {
  activities: ActivityItem[]
}

const activityConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; badge: string }> = {
  HIRE: { icon: UserPlus, color: 'text-emerald-400 bg-emerald-500/10', badge: 'success' },
  PROMOTION: { icon: TrendingUp, color: 'text-blue-400 bg-blue-500/10', badge: 'info' },
  DEPARTURE: { icon: LogOut, color: 'text-red-400 bg-red-500/10', badge: 'error' },
  UPDATE: { icon: Edit, color: 'text-violet-400 bg-violet-500/10', badge: 'purple' },
  REVIEW: { icon: Star, color: 'text-amber-400 bg-amber-500/10', badge: 'warning' },
  NOTE: { icon: FileText, color: 'text-zinc-400 bg-zinc-500/10', badge: 'secondary' },
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest team events and updates</CardDescription>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Live
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">No recent activity yet.</p>
          </div>
        ) : (
        <div className="space-y-1">
          {activities.map((activity, i) => {
            const config = activityConfig[activity.type] ?? activityConfig.NOTE
            const Icon = config.icon
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
              >
                <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0', config.color)}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar
                      firstName={activity.user.name.split(' ')[0]}
                      lastName={activity.user.name.split(' ')[1]}
                      src={activity.user.avatar}
                      size="xs"
                    />
                    <span className="text-xs text-muted-foreground">{activity.user.name}</span>
                    <span className="text-xs text-muted-foreground/50">·</span>
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                </div>
                <Badge variant={config.badge as any} className="text-[10px] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {activity.type.toLowerCase()}
                </Badge>
              </motion.div>
            )
          })}
        </div>
        )}
      </CardContent>
    </Card>
  )
}
