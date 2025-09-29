'use client'

import { useAuth } from '@/lib/auth/context'
import Link from 'next/link'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar'
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
  Megaphone
} from 'lucide-react'

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Contacts', href: '/contacts' },
  { icon: Megaphone, label: 'Ministries', href: '/ministries' },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: Baby, label: 'Child Check-in', href: '/check-in' },
  { icon: MessageCircle, label: 'Grace Assistant', href: '/grace' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
]

const adminItems = [
  { icon: UserCog, label: 'Staff Management', href: '/admin/staff' },
  { icon: Settings, label: 'Church Settings', href: '/admin/settings' },
]

const agencyItems = [
  { icon: Church, label: 'All Churches', href: '/agency/churches' },
  { icon: BarChart3, label: 'Agency Reports', href: '/agency/reports' },
]

export function AppSidebar() {
  const { user, signOut } = useAuth()

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
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Church className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Fellowship 360</span>
            <span className="text-xs text-muted-foreground">
              {user.church?.name || 'Church Management'}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {getMenuItems().map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild>
                <Link href={item.href} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0 h-auto">
              <div className="flex items-center gap-3 w-full">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.role.toLowerCase()}
                  </span>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={signOut}
              className="flex items-center gap-2 text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}