import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Eye, EyeOff, Layers, ArrowRight, Sparkles,
  Code2, Shield, Zap, GitBranch, Terminal, Lock, User
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const schema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

const floatingIcons = [
  { Icon: Code2,    x: '8%',  y: '12%', delay: 0,   size: 24 },
  { Icon: Shield,   x: '82%', y: '18%', delay: 0.5, size: 20 },
  { Icon: Zap,      x: '12%', y: '72%', delay: 1,   size: 22 },
  { Icon: GitBranch,x: '86%', y: '68%', delay: 1.5, size: 20 },
  { Icon: Terminal, x: '50%', y: '6%',  delay: 0.8, size: 18 },
  { Icon: Sparkles, x: '62%', y: '82%', delay: 0.3, size: 18 },
]

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 4,
}))

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated, navigate])

  const onSubmit = async (data: FormData) => {
    setError('')
    try {
      await login(data)
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
      {/* Animated gradient */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse 120% 80% at 20% -10%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(ellipse 80% 80% at 80% 100%, rgba(139,92,246,0.12) 0%, transparent 60%)',
              'radial-gradient(ellipse 120% 80% at 80% -10%, rgba(139,92,246,0.15) 0%, transparent 60%), radial-gradient(ellipse 80% 80% at 20% 100%, rgba(59,130,246,0.12) 0%, transparent 60%)',
              'radial-gradient(ellipse 120% 80% at 20% -10%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(ellipse 80% 80% at 80% 100%, rgba(139,92,246,0.12) 0%, transparent 60%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [-20, 20], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Floating icons */}
      {floatingIcons.map(({ Icon, x, y, delay, size }) => (
        <motion.div
          key={`${x}-${y}`}
          className="absolute text-white/[0.06] pointer-events-none"
          style={{ left: x, top: y }}
          animate={{ y: [0, -16, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 5, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      {/* Glow orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', left: '-10%', top: '-10%' }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', right: '-10%', bottom: '-10%' }}
        animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-md mx-4 z-10"
      >
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 to-violet-500/20 blur-xl opacity-60" />

        <div className="relative rounded-2xl border border-white/[0.1] bg-zinc-950/90 backdrop-blur-2xl p-8 shadow-2xl">

          {/* Logo */}
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Layers className="h-5 w-5 text-white" />
              <motion.div
                className="absolute inset-0 rounded-xl bg-white/20"
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">ARCADE</h1>
              <p className="text-xs text-muted-foreground font-medium tracking-widest uppercase">Enterprise Platform</p>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div className="mb-7" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your enterprise workspace</p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Username or Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Username or Email
              </label>
              <Input
                {...register('usernameOrEmail')}
                placeholder="admin or admin@company.com"
                leftIcon={<User className="h-3.5 w-3.5" />}
                error={errors.usernameOrEmail?.message}
                autoComplete="username"
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock className="h-3.5 w-3.5" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                error={errors.password?.message}
                autoComplete="current-password"
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3"
                >
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 mt-2"
              loading={isSubmitting}
            >
              {!isSubmitting && (<>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>)}
            </Button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  )
}
