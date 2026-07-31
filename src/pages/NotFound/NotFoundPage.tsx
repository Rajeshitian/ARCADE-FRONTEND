import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Ghost } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="space-y-6"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl font-black text-white/5 select-none"
        >
          404
        </motion.div>
        <div className="h-16 w-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto">
          <Ghost className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            The page you're looking for doesn't exist or was moved.
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-violet-600 text-white">
          <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Link>
        </Button>
      </motion.div>
    </div>
  )
}
