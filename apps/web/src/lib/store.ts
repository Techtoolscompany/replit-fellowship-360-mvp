import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'STAFF' | 'ADMIN' | 'AGENCY'
  churchId?: string
  phone?: string
  isActive: boolean
}

interface Church {
  id: string
  name: string
  email: string
  phone?: string
  address?: any
  website?: string
  timezone: string
  settings: any
  gracePhone?: string
  isActive: boolean
}

interface AppState {
  // User state
  user: User | null
  church: Church | null
  isAuthenticated: boolean
  
  // Grace state
  graceStatus: 'online' | 'offline' | 'busy'
  graceInteractions: number
  
  // UI state
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  
  // Actions
  setUser: (user: User | null) => void
  setChurch: (church: Church | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setGraceStatus: (status: 'online' | 'offline' | 'busy') => void
  setGraceInteractions: (count: number) => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial state
      user: null,
      church: null,
      isAuthenticated: false,
      graceStatus: 'offline',
      graceInteractions: 0,
      sidebarOpen: true,
      theme: 'system',
      
      // Actions
      setUser: (user) => set({ user }),
      setChurch: (church) => set({ church }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setGraceStatus: (graceStatus) => set({ graceStatus }),
      setGraceInteractions: (graceInteractions) => set({ graceInteractions }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setTheme: (theme) => set({ theme }),
      logout: () => set({ 
        user: null, 
        church: null, 
        isAuthenticated: false,
        graceStatus: 'offline',
        graceInteractions: 0
      }),
    }),
    {
      name: 'fellowship-360-store',
    }
  )
)
