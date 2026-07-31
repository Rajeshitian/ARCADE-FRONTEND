import * as React from 'react'
import { cn } from '@/utils'
import { motion, HTMLMotionProps } from 'framer-motion'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  hover?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent',
        'shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_8px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.04)]',
        hover && 'transition-all duration-200 hover:border-white/[0.12] hover:shadow-lg cursor-default',
        glow && 'hover:shadow-glow',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1 p-5 pb-3', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-base font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5 pt-2', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-5 pt-0', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

// Motion card variant
interface MotionCardProps extends HTMLMotionProps<'div'> {
  glow?: boolean
}

const MotionCard = ({ className, glow, ...props }: MotionCardProps) => (
  <motion.div
    className={cn(
      'rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent',
      'shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_8px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.04)]',
      glow && 'hover:shadow-glow',
      className
    )}
    {...props}
  />
)

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, MotionCard }
