import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { CommandPalette } from '@/components/common/CommandPalette'
import { ToastContainer } from '@/components/ui/toast'

export function AppLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />

        <main className="flex-1 overflow-auto custom-scroll">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <CommandPalette />
      <ToastContainer />
    </div>
  )
}
