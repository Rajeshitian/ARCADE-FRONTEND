import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE': return 'text-emerald-400'
    case 'INACTIVE': return 'text-zinc-500'
    case 'ON_LEAVE': return 'text-amber-400'
    case 'REMOTE': return 'text-blue-400'
    default: return 'text-zinc-400'
  }
}

export function getStatusBg(status: string): string {
  switch (status) {
    case 'ACTIVE': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
    case 'INACTIVE': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
    case 'ON_LEAVE': return 'bg-amber-400/10 text-amber-400 border-amber-400/20'
    case 'REMOTE': return 'bg-blue-400/10 text-blue-400 border-blue-400/20'
    default: return 'bg-zinc-400/10 text-zinc-400 border-zinc-400/20'
  }
}

export function getDepartmentColor(department: string): string {
  const colors: Record<string, string> = {
    Engineering: '#6366f1',
    Product: '#8b5cf6',
    Design: '#ec4899',
    Marketing: '#f59e0b',
    Sales: '#10b981',
    Operations: '#3b82f6',
    Finance: '#14b8a6',
    HR: '#f97316',
    Legal: '#ef4444',
    Support: '#a78bfa',
  }
  return colors[department] ?? '#6b7280'
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return `${str.slice(0, length)}...`
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
