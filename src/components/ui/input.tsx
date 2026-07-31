import * as React from 'react'
import { cn } from '@/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground shadow-sm transition-all duration-200',
            'placeholder:text-muted-foreground/60',
            'focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50',
            'hover:border-white/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500/50 focus:ring-red-500/30',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
