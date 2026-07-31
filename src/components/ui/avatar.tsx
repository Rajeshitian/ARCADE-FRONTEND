import * as React from 'react'
import { cn } from '@/utils'

interface AvatarProps {
  src?: string
  firstName?: string
  lastName?: string
  name?: string
  username?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  status?: 'online' | 'away' | 'busy' | 'offline'
}

const sizeMap = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-10 w-10 text-sm',
  xl: 'h-12 w-12 text-base',
}

const statusMap = {
  online:  'bg-emerald-400',
  away:    'bg-amber-400',
  busy:    'bg-red-400',
  offline: 'bg-zinc-500',
}

const statusSizeMap = {
  xs: 'h-1.5 w-1.5 bottom-0 right-0',
  sm: 'h-2 w-2 bottom-0 right-0',
  md: 'h-2.5 w-2.5 bottom-0 right-0',
  lg: 'h-2.5 w-2.5 bottom-0 right-0',
  xl: 'h-3 w-3 bottom-0.5 right-0.5',
}

// Gradient pairs for colorful avatars based on initials
const GRADIENTS = [
  'from-blue-500 to-violet-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-rose-600',
  'from-violet-500 to-purple-600',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-indigo-500 to-blue-600',
]

function getGradient(char: string): string {
  const index = (char.toUpperCase().charCodeAt(0) - 65) % GRADIENTS.length
  return GRADIENTS[Math.max(0, index)] ?? GRADIENTS[0]
}

function resolveInitials(props: AvatarProps): string {
  // Try firstName + lastName first
  if (props.firstName && props.firstName.trim()) {
    const first = props.firstName.trim()[0] ?? ''
    const last  = props.lastName?.trim()?.[0] ?? ''
    return (first + last).toUpperCase() || first.toUpperCase() || 'U'
  }

  // Try full name string
  if (props.name && props.name.trim()) {
    const parts = props.name.trim().split(/\s+/)
    const first = parts[0]?.[0] ?? ''
    const last  = parts[1]?.[0] ?? ''
    return (first + last).toUpperCase() || first.toUpperCase() || 'U'
  }

  // Try username
  if (props.username && props.username.trim()) {
    return props.username.trim().slice(0, 2).toUpperCase()
  }

  return 'U'
}

export function Avatar({
  src,
  firstName,
  lastName,
  name,
  username,
  size = 'md',
  className,
  status,
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  const initials = resolveInitials({ firstName, lastName, name, username })
  const gradient = getGradient(initials[0] ?? 'A')

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <div
        className={cn(
          'relative rounded-full overflow-hidden flex items-center justify-center',
          `bg-gradient-to-br ${gradient} border border-white/10`,
          sizeMap[size]
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={name ?? username ?? `${firstName} ${lastName}`}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="font-semibold text-white select-none leading-none">
            {initials}
          </span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute block rounded-full ring-2 ring-background',
            statusMap[status],
            statusSizeMap[size]
          )}
        />
      )}
    </div>
  )
}
