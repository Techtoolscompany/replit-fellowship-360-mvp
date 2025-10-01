'use client'

import { useAuth } from '@/lib/auth/context'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
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
  Baby,
  Megaphone,
  ChevronsRight,
  ChevronDownIcon,
  HelpCircle,
  LifeBuoy
} from 'lucide-react'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Contacts', href: '/contacts' },
  { icon: Megaphone, label: 'Ministries', href: '/ministries' },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: MessageCircle, label: 'Grace Assistant', href: '/grace' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
]

// Admin and agency items temporarily disabled until implemented
const adminItems: typeof menuItems = [
  // { icon: UserCog, label: 'Staff Management', href: '/admin/staff' },
  // { icon: Settings, label: 'Church Settings', href: '/admin/settings' },
]

const agencyItems: typeof menuItems = [
  // { icon: Church, label: 'All Churches', href: '/agency/churches' },  
  // { icon: BarChart3, label: 'Agency Reports', href: '/agency/reports' },
]

// Custom sidebar components with better design
const SidebarOption = ({ Icon, title, selected, setSelected, open, notifs }: {
  Icon: any
  title: string
  selected: string
  setSelected: (title: string) => void
  open: boolean
  notifs?: number
}) => {
  const isSelected = selected === title
  
  return (
    <button
      onClick={() => setSelected(title)}
      className={cn(
        "relative flex h-11 w-full items-center transition-all duration-200 rounded-md",
        isSelected 
          ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary shadow-sm border-l-2 border-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary transform -translate-y-px"  
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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

      {notifs && open && (
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600 text-xs text-white font-medium">
          {notifs}
        </span>
      )}
    </button>
  )
}

const TitleSection = ({ open, user }: { open: boolean, user: any }) => {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
            <Church className="h-5 w-5 text-white" />
          </div>
          {open && (
            <div className={cn("transition-opacity duration-200", open ? 'opacity-100' : 'opacity-0')}>
              <div className="flex items-center gap-2">
                <div>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Fellowship 360
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {user.church?.name || 'Church Management'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {open && (
          <ChevronDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        )}
      </div>
    </div>
  )
}

const ToggleClose = ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 place-content-center">
          <ChevronsRight
            className={cn(
              "h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400",
              open ? "rotate-180" : ""
            )}
          />
        </div>
        {open && (
          <span
            className={cn(
              "text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-200",
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

export function AppSidebar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(true)
  const [selected, setSelected] = useState('Dashboard')

  if (!user) return null

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getMenuItems = () => {
    const items = [...menuItems]
    
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
        "sticky top-0 h-screen shrink-0 transition-all duration-300 ease-in-out flex flex-col",
        open ? 'w-64' : 'w-16',
        "bg-white dark:bg-gray-900 shadow-sm"
      )}
    >
      <div className="p-2">
        <TitleSection open={open} user={user} />
      </div>

      {/* Main Navigation */}
      <div className="px-2 space-y-1 mb-64">
        {getMenuItems().map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href as any}>
              <SidebarOption
                Icon={item.icon}
                title={item.label}
                selected={isActive ? item.label : selected}
                setSelected={setSelected}
                open={open}
              />
            </Link>
          )
        })}
      </div>

      {/* Bottom Section - Account, Settings, Help & Support - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
        {open && (
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Account & Support
            </div>
            
            {/* Settings */}
            <button className="relative flex h-11 w-full items-center rounded-md transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <div className="grid h-full w-12 place-content-center">
                <Settings className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Settings</span>
            </button>

            {/* Help & Support */}
            <button className="relative flex h-11 w-full items-center rounded-md transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <div className="grid h-full w-12 place-content-center">
                <HelpCircle className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Help & Support</span>
            </button>
          </div>
        )}

        <ToggleClose open={open} setOpen={setOpen} />
      </div>
    </nav>
  )
}