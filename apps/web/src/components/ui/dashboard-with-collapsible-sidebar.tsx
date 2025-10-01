'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/context'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  Home,
  Users,
  Calendar,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut,
  Church,
  UserCog,
  Megaphone,
  ChevronsRight,
  ChevronDown,
  HelpCircle
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { BackgroundGradient } from '@/components/ui/background-gradient'
import type { LucideIcon } from 'lucide-react'

// Types
interface NavigationItem {
  icon: LucideIcon
  label: string
  href: string
  badge?: number
  roles?: ('STAFF' | 'ADMIN' | 'AGENCY')[]
}

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

// Navigation configuration
const navigationItems: NavigationItem[] = [
  { icon: Home, label: 'Dashboard', href: '/', roles: ['STAFF', 'ADMIN', 'AGENCY'] },
  { icon: Users, label: 'Contacts', href: '/contacts', roles: ['STAFF', 'ADMIN', 'AGENCY'] },
  { icon: Megaphone, label: 'Ministries', href: '/ministries', roles: ['STAFF', 'ADMIN', 'AGENCY'] },
  { icon: Calendar, label: 'Events', href: '/events', roles: ['STAFF', 'ADMIN', 'AGENCY'] },
  { icon: MessageCircle, label: 'Grace Assistant', href: '/grace', roles: ['STAFF', 'ADMIN', 'AGENCY'] },
  { icon: BarChart3, label: 'Reports', href: '/reports', roles: ['STAFF', 'ADMIN', 'AGENCY'] },
]

const adminItems: NavigationItem[] = [
  // { icon: UserCog, label: 'Staff Management', href: '/admin/staff', roles: ['ADMIN'] },
  // { icon: Settings, label: 'Church Settings', href: '/admin/settings', roles: ['ADMIN'] },
]

const agencyItems: NavigationItem[] = [
  // { icon: Church, label: 'All Churches', href: '/agency/churches', roles: ['AGENCY'] },
  // { icon: BarChart3, label: 'Agency Reports', href: '/agency/reports', roles: ['AGENCY'] },
]

// Sidebar Option Component
const SidebarOption = ({ 
  Icon, 
  title, 
  href,
  isActive, 
  open, 
  badge 
}: {
  Icon: LucideIcon
  title: string
  href: string
  isActive: boolean
  open: boolean
  badge?: number
}) => {
  return (
    <BackgroundGradient containerClassName="mb-1" borderOnly={true}>
      <Link href={href as any}>
        <button
          className={cn(
            "relative flex h-11 w-full items-center rounded-md transition-all duration-300 ease-out",
            isActive 
              ? "text-primary shadow-sm border-l-2 border-primary font-semibold transform -translate-y-px" 
              : "text-foreground hover:text-accent-foreground"
          )}
        >
          <div className="grid h-full w-12 place-content-center">
            <Icon className="h-4 w-4" />
          </div>
          
          {open && (
            <span
              className={cn(
                "text-sm font-medium transition-opacity duration-200",
                open ? 'opacity-100' : 'opacity-0'
              )}
            >
              {title}
            </span>
          )}

          {badge && open && (
            <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {badge}
            </span>
          )}
        </button>
      </Link>
    </BackgroundGradient>
  )
}

// Title Section Component
const TitleSection = ({ open, user }: { open: boolean; user: any }) => {
  return (
    <div className="mb-6 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-accent">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
            <Church className="h-5 w-5 text-primary-foreground" />
          </div>
          {open && (
            <div className={cn("transition-opacity duration-200", open ? 'opacity-100' : 'opacity-0')}>
              <div className="flex items-center gap-2">
                <div>
                  <span className="block text-sm font-semibold text-foreground">
                    Fellowship 360
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {user?.church?.name || 'Church Management'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {open && (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </div>
  )
}

// Toggle Close Component
const ToggleClose = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-border transition-colors hover:bg-accent"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 place-content-center">
          <ChevronsRight
            className={cn(
              "h-4 w-4 transition-transform duration-300 text-muted-foreground",
              open ? "rotate-180" : ""
            )}
          />
        </div>
        {open && (
          <span
            className={cn(
              "text-sm font-medium text-foreground transition-opacity duration-200",
              open ? 'opacity-100' : 'opacity-0'
            )}
          >
            Hide
          </span>
        )}
      </div>
    </button>
  )
}

// Main Sidebar Component
function Sidebar({ open, setOpen }: SidebarProps) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const getMenuItems = () => {
    const items = [...navigationItems]
    
    if (user.role === 'ADMIN') {
      items.push(...adminItems)
    }
    
    if (user.role === 'AGENCY') {
      items.unshift(...agencyItems)
    }
    
    return items
  }

  return (
    <nav
      className={cn(
        "sticky top-0 h-screen shrink-0 transition-all duration-300 ease-in-out",
        open ? 'w-64' : 'w-16',
        "border-border bg-background p-2 shadow-sm"
      )}
    >
      <TitleSection open={open} user={user} />

      <div className="space-y-1 mb-8">
        {getMenuItems().map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <SidebarOption
              key={item.href}
              Icon={item.icon}
              title={item.label}
              href={item.href}
              isActive={isActive}
              open={open}
              badge={item.badge}
            />
          )
        })}
      </div>

      {open && (
        <div className="pt-4 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Account
          </div>

          <BackgroundGradient containerClassName="mb-1" borderOnly={true}>
            <button className="relative flex h-11 w-full items-center rounded-md transition-all duration-300 ease-out text-foreground hover:text-accent-foreground">
              <div className="grid h-full w-12 place-content-center">
                <Settings className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Settings</span>
            </button>
          </BackgroundGradient>

          <BackgroundGradient containerClassName="mb-1" borderOnly={true}>
            <Link href={"/help" as any}>
              <button className="relative flex h-11 w-full items-center rounded-md transition-all duration-300 ease-out text-foreground hover:text-accent-foreground">
                <div className="grid h-full w-12 place-content-center">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Help & Support</span>
              </button>
            </Link>
          </BackgroundGradient>
        </div>
      )}

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  )
}

// Main Layout Component
export function DashboardWithCollapsibleSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)

  // Persist sidebar state
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('fellowship-sidebar-open')
    if (savedSidebarState !== null) {
      setOpen(savedSidebarState === 'true')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('fellowship-sidebar-open', open.toString())
  }, [open])

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar open={open} setOpen={setOpen} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 sm:p-6 space-y-6">
          {children}
        </div>
      </main>
    </div>
  )
}

// Export as Example for easy import
export function Example({ children }: { children: React.ReactNode }) {
  return <DashboardWithCollapsibleSidebar>{children}</DashboardWithCollapsibleSidebar>
}

// Default export
export default Example