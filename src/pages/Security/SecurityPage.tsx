import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Lock, Key, AlertTriangle,
  CheckCircle2, Eye, EyeOff, RefreshCw,
  Smartphone, Globe, Clock,
  ShieldCheck, Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { staggerContainer, staggerItem } from '@/animations/variants'
import { cn, formatRelativeTime } from '@/utils'

const MOCK_SESSIONS = [
  { id: '1', device: 'Chrome on Windows', location: 'Mumbai, India', ip: '192.168.1.1', lastActive: new Date(Date.now() - 1000 * 60 * 2).toISOString(), current: true },
  { id: '2', device: 'Firefox on macOS', location: 'Bangalore, India', ip: '10.0.0.1', lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), current: false },
  { id: '3', device: 'Chrome on Android', location: 'Delhi, India', ip: '172.16.0.1', lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), current: false },
]

const MOCK_AUDIT_LOG = [
  { id: '1', action: 'Employee Created',  user: 'Alex Chen',      time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),          severity: 'info'    },
  { id: '2', action: 'Login',             user: 'Alex Chen',      time: new Date(Date.now() - 1000 * 60 * 35).toISOString(),          severity: 'info'    },
  { id: '3', action: 'Employee Deleted',  user: 'David Kim',      time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),     severity: 'warning' },
  { id: '4', action: 'Role Assigned',     user: 'Aria Foster',    time: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),     severity: 'info'    },
  { id: '5', action: 'Failed Login',      user: 'Unknown',        time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),     severity: 'error'   },
  { id: '6', action: 'Salary Updated',    user: 'Alex Chen',      time: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),    severity: 'warning' },
  { id: '7', action: 'Department Created',user: 'Sarah Mitchell', time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),    severity: 'info'    },
]

const ROLE_PERMISSIONS = [
  { role: 'ADMIN',    permissions: ['Read', 'Write', 'Delete', 'Admin'],  count: 2,  color: 'text-red-400 bg-red-500/10 border-red-500/20'       },
  { role: 'MANAGER',  permissions: ['Read', 'Write'],                     count: 8,  color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'     },
  { role: 'EMPLOYEE', permissions: ['Read'],                              count: 238, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
]

const severityConfig = {
  info:    { color: 'text-blue-400',    bg: 'bg-blue-500/10',    icon: CheckCircle2  },
  warning: { color: 'text-amber-400',   bg: 'bg-amber-500/10',   icon: AlertTriangle },
  error:   { color: 'text-red-400',     bg: 'bg-red-500/10',     icon: AlertTriangle },
}

export function SecurityPage() {
  const [sessions, setSessions] = useState(MOCK_SESSIONS)
  const [showToken, setShowToken] = useState(false)

  const revokeSession = (id: string) =>
    setSessions((prev) => prev.filter((s) => s.id === id || s.current))

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Security</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage access, sessions, and audit logs.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Security score */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 to-zinc-950/40 p-5"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Security Score</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-emerald-400">92</span>
              <span className="text-lg text-emerald-400/60 mb-1">/100</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Good — JWT authentication active</p>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'JWT Auth',      ok: true  },
              { label: 'HTTPS',         ok: false },
              { label: 'Role-based AC', ok: true  },
              { label: '2FA',           ok: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                {item.ok
                  ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  : <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        {/* Active Sessions */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-400" />
                    Active Sessions
                  </CardTitle>
                  <CardDescription>{sessions.length} active session{sessions.length !== 1 ? 's' : ''}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    'flex items-start justify-between p-3 rounded-xl border transition-colors',
                    session.current
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04]'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{session.device}</p>
                        {session.current && (
                          <Badge variant="success" className="text-[10px] py-0">Current</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{session.location} · {session.ip}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {formatRelativeTime(session.lastActive)}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                      onClick={() => revokeSession(session.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Role Permissions */}
        <motion.div variants={staggerItem}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-4 w-4 text-violet-400" />
                Role Permissions
              </CardTitle>
              <CardDescription>Access control by role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ROLE_PERMISSIONS.map((rp) => (
                <div key={rp.role} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={cn('text-xs border', rp.color)}>{rp.role}</Badge>
                      <span className="text-xs text-muted-foreground">{rp.count} users</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Read', 'Write', 'Delete', 'Admin'].map((perm) => (
                      <span
                        key={perm}
                        className={cn(
                          'px-2 py-0.5 rounded text-[11px] font-medium border',
                          rp.permissions.includes(perm)
                            ? 'bg-white/[0.06] border-white/[0.1] text-foreground'
                            : 'bg-transparent border-white/[0.04] text-muted-foreground/30 line-through'
                        )}
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {/* JWT token info */}
              <div className="mt-4 pt-4 border-t border-white/[0.05] space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Token</p>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs font-mono text-muted-foreground flex-1 truncate">
                    {showToken
                      ? (localStorage.getItem('arcade-auth')
                          ? JSON.parse(localStorage.getItem('arcade-auth') || '{}')?.state?.token ?? 'No token'
                          : 'No token')
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

        {/* Audit Log */}
        <motion.div variants={staggerItem} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-amber-400" />
                    Audit Log
                  </CardTitle>
                  <CardDescription>Recent security events and actions</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {MOCK_AUDIT_LOG.map((log, i) => {
                  const cfg = severityConfig[log.severity as keyof typeof severityConfig]
                  const Icon = cfg.icon
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0', cfg.bg)}>
                        <Icon className={cn('h-3.5 w-3.5', cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{log.action}</p>
                        <p className="text-xs text-muted-foreground">by {log.user}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(log.time)}</p>
                        <Badge
                          variant={log.severity === 'error' ? 'error' : log.severity === 'warning' ? 'warning' : 'info'}
                          className="text-[10px] mt-0.5"
                        >
                          {log.severity}
                        </Badge>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
