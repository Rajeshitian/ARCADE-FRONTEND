import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Zap,
  Shield,
  Plus,
  ArrowRight,
} from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/utils'

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  category: string
  shortcut?: string
}

export function CommandPalette() {
  const { commandPaletteOpen, closeCommandPalette, openCommandPalette } = useUIStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  const allCommands: CommandItem[] = [
    {
      id: 'dashboard',
      label: 'Go to Dashboard',
      icon: LayoutDashboard,
      category: 'Navigation',
      shortcut: 'G D',
      action: () => { navigate('/'); closeCommandPalette() },
    },
    {
      id: 'employees',
      label: 'View Employees',
      description: 'Browse all team members',
      icon: Users,
      category: 'Navigation',
      shortcut: 'G E',
      action: () => { navigate('/employees'); closeCommandPalette() },
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      category: 'Navigation',
      action: () => { navigate('/analytics'); closeCommandPalette() },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      category: 'Navigation',
      action: () => { navigate('/settings'); closeCommandPalette() },
    },
    {
      id: 'new-employee',
      label: 'Add New Employee',
      description: 'Create a new team member',
      icon: Plus,
      category: 'Actions',
      action: () => { navigate('/employees?new=true'); closeCommandPalette() },
    },
  ]

  const filtered = query
    ? allCommands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          cmd.description?.toLowerCase().includes(query.toLowerCase()) ||
          cmd.category.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands

  const categories = Array.from(new Set(filtered.map((c) => c.category)))

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        commandPaletteOpen ? closeCommandPalette() : openCommandPalette()
      }
      if (!commandPaletteOpen) return

      if (e.key === 'Escape') closeCommandPalette()
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && filtered[selectedIndex]) {
        filtered[selectedIndex].action()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, filtered, selectedIndex])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCommandPalette}
          />

          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-[560px] rounded-2xl border border-white/[0.1] bg-zinc-950/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
                />
                <kbd className="hidden sm:block px-1.5 py-0.5 text-[10px] bg-white/10 rounded font-mono text-muted-foreground">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[380px] overflow-y-auto custom-scroll py-2">
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No results found for "{query}"
                  </div>
                ) : (
                  categories.map((category) => {
                    const items = filtered.filter((c) => c.category === category)
                    return (
                      <div key={category} className="mb-1">
                        <p className="px-4 py-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
                          {category}
                        </p>
                        {items.map((item) => {
                          const Icon = item.icon
                          const globalIndex = filtered.indexOf(item)
                          const isSelected = globalIndex === selectedIndex
                          return (
                            <button
                              key={item.id}
                              onClick={item.action}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={cn(
                                'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                                isSelected ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
                              )}
                            >
                              <div className={cn(
                                'h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0',
                                isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-white/[0.06] text-muted-foreground'
                              )}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{item.label}</p>
                                {item.description && (
                                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                                )}
                              </div>
                              {item.shortcut && (
                                <div className="flex gap-1 ml-auto">
                                  {item.shortcut.split(' ').map((key) => (
                                    <kbd key={key} className="px-1.5 py-0.5 text-[10px] bg-white/10 rounded font-mono text-muted-foreground">
                                      {key}
                                    </kbd>
                                  ))}
                                </div>
                              )}
                              {isSelected && (
                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-1" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-white/[0.06] flex items-center gap-3 text-[11px] text-muted-foreground/60">
                <span className="flex items-center gap-1"><kbd className="px-1 bg-white/10 rounded font-mono">↑</kbd><kbd className="px-1 bg-white/10 rounded font-mono">↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1 bg-white/10 rounded font-mono">↵</kbd> Open</span>
                <span className="flex items-center gap-1"><kbd className="px-1 bg-white/10 rounded font-mono">Esc</kbd> Close</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
