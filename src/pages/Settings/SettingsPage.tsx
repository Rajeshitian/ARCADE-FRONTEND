import { motion } from 'framer-motion'
import { User, Bell, Shield, Palette, Database, Key, Save } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { useAllDepartments } from '@/hooks/useEmployees'
import { cn } from '@/utils'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Database },
  { id: 'api', label: 'API Keys', icon: Key },
]

const GRAPHQL_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8080'}/graphql`

export function SettingsPage() {
  const { user } = useAuthStore()
  const { theme, toggleTheme } = useUIStore()
  const { error: connectionError, loading: connectionLoading } = useAllDepartments()
  const connectionOk = !connectionLoading && !connectionError

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and platform preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <motion.nav
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-1"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = tab.id === 'profile'
            return (
              <button
                key={tab.id}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-left',
                  active
                    ? 'bg-white/[0.08] text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {tab.label}
              </button>
            )
          })}
        </motion.nav>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3 space-y-5"
        >
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-white/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-white/80">
                    {(user?.name ?? user?.username)?.charAt(0)?.toUpperCase() ?? 'A'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{user?.name ?? user?.username}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Button variant="outline" size="sm" className="mt-2 text-xs">Change Avatar</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <Input defaultValue={user?.name ?? user?.username ?? ''} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
                  <Input defaultValue={user?.email ?? ''} type="email" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</label>
                  <Input defaultValue={user?.department ?? 'Engineering'} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</label>
                  <Input defaultValue={user?.roles?.[0] ?? 'ADMIN'} disabled />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button className="bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm">
                  <Save className="h-3.5 w-3.5 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how ARCADE looks on your device</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Toggle between light and dark themes</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={cn(
                    'relative h-6 w-11 rounded-full border transition-all duration-200',
                    theme === 'dark'
                      ? 'bg-blue-500 border-blue-400'
                      : 'bg-white/10 border-white/20'
                  )}
                >
                  <motion.div
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
                    animate={{ left: theme === 'dark' ? '22px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Backend URL */}
          <Card>
            <CardHeader>
              <CardTitle>Backend Integration</CardTitle>
              <CardDescription>Live GraphQL endpoint configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">GraphQL Endpoint</label>
                <Input defaultValue={GRAPHQL_URL} disabled />
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  'h-2 w-2 rounded-full',
                  connectionLoading ? 'bg-amber-400 animate-pulse' : connectionOk ? 'bg-emerald-400' : 'bg-red-400'
                )} />
                <span className="text-xs text-muted-foreground">
                  {connectionLoading
                    ? 'Checking connection…'
                    : connectionOk
                    ? 'Connected to live backend'
                    : "Couldn't reach the backend — check your connection"}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
