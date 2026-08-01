import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Toast {
  id: string
  title: string
  description?: string
  variant: 'default' | 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface UIState {
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  theme: 'dark' | 'light'
  commandPaletteOpen: boolean
  globalSearch: string
  toasts: Toast[]
  pageLoading: boolean

  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleTheme: () => void
  setTheme: (theme: 'dark' | 'light') => void
  openCommandPalette: () => void
  closeCommandPalette: () => void
  setGlobalSearch: (search: string) => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  setPageLoading: (loading: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      theme: 'dark',
      commandPaletteOpen: false,
      globalSearch: '',
      toasts: [],
      pageLoading: false,

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      toggleMobileSidebar: () =>
        set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),

      closeMobileSidebar: () => set({ mobileSidebarOpen: false }),

      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark'
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
        set({ theme: newTheme })
      },

      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        set({ theme })
      },

      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),

      setGlobalSearch: (globalSearch) => set({ globalSearch }),

      addToast: (toast) => {
        const id = Math.random().toString(36).slice(2)
        const newToast = { ...toast, id }
        set((state) => ({ toasts: [...state.toasts, newToast] }))
        const duration = toast.duration ?? 4000
        if (duration > 0) {
          setTimeout(() => {
            get().removeToast(id)
          }, duration)
        }
        return id
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      setPageLoading: (pageLoading) => set({ pageLoading }),
    }),
    {
      name: 'arcade-ui',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
)
