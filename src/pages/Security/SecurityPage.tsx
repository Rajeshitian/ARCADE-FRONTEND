import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Lock, Key, AlertTriangle,
  CheckCircle2, Eye, EyeOff,
  Globe, Clock,
  ShieldCheck, Activity, Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { staggerContainer, staggerItem } from '@/animations/variants'
import { cn, formatRelativeTime } from '@/utils'
import { useAuthStore } from '@/store/authStore'
import { useDashboardStats } from '@/hooks/useDashboardStats'

export function SecurityPage() {
  const { user, token, loginAt } = useAuthStore()
  const { stats, loading, error } = useDashboardStats()
  const [showToken, setShowToken] = useState(false)

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Security</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your session, access, and recent record changes.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        {/* Current Session — real data from the active auth session */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-400" />
                Current Session
              </CardTitle>
              <CardDescription>This is the only session this app can see</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{user?.name ?? user?.username ?? 'Signed in'}</p>
                    <Badge variant="success" className="text-[10px] py-0">Active</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Role{user?.roles && user.roles.length > 1 ? 's' : ''}: {user?.roles?.join(', ') ?? 'Unknown'}
                  </p>
                  {loginAt && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Signed in {formatRelativeTime(loginAt)}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Access Token</p>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs font-mono text-muted-foreground flex-1 truncate">
                    {showToken
                      ? (token ?? 'No token')
                      : '••••••••••••••••••••••••••••••'}
                  </span>
                  <button
                    onClick={() => setShowToken(!showToken)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Access Summary — real counts derived from live employee data */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-4 w-4 text-violet-400" />
                Access Summary
              </CardTitle>
              <CardDescription>Live workforce headcount, by department</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm py-6 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-red-400 text-sm py-6 justify-center">
                  <AlertTriangle className="h-4 w-4" /> Couldn't load data
                </div>
              ) : stats.departmentBreakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No employee records yet</p>
              ) : (
                stats.departmentBreakdown.slice(0, 6).map((d) => (
                  <div key={d.department} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{d.department}</span>
                    <span className="text-xs font-medium text-foreground">{d.count} people</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Record Changes — real audit trail from Employee createdDate/updatedDate */}
        <motion.div variants={staggerItem} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-amber-400" />
                    Recent Record Changes
                  </CardTitle>
                  <CardDescription>Live activity from actual employee records</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm py-10 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </div>
              ) : stats.recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">No recent changes yet</p>
              ) : (
                <div className="space-y-1">
                  {stats.recentActivity.map((activity, i) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className={cn(
                        'h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0',
                        activity.type === 'HIRE' ? 'bg-emerald-500/10' : 'bg-violet-500/10'
                      )}>
                        <CheckCircle2 className={cn(
                          'h-3.5 w-3.5',
                          activity.type === 'HIRE' ? 'text-emerald-400' : 'text-violet-400'
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">by {activity.user.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground flex-shrink-0">{formatRelativeTime(activity.timestamp)}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
