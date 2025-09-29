'use client'

import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Bell, Settings } from 'lucide-react'

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/': return 'Dashboard'
    case '/contacts': return 'Contacts'
    case '/ministries': return 'Ministries'
    case '/events': return 'Events'
    case '/grace': return 'Grace Assistant'
    case '/reports': return 'Reports'
    case '/profile': return 'Profile Settings'
    default: return 'Fellowship 360'
  }
}

const getBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean)
  
  if (pathname === '/') {
    return [{ label: 'Dashboard', href: '/', isActive: true }]
  }
  
  const breadcrumbs = [{ label: 'Dashboard', href: '/', isActive: false }]
  
  let path = ''
  segments.forEach((segment, index) => {
    path += `/${segment}`
    const isActive = index === segments.length - 1
    
    let label = segment.charAt(0).toUpperCase() + segment.slice(1)
    if (segment === 'grace') label = 'Grace Assistant'
    
    breadcrumbs.push({ label, href: path, isActive })
  })
  
  return breadcrumbs
}

export function SiteHeader() {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)
  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4" data-testid="site-header">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {crumb.isActive ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href} data-testid={`breadcrumb-${crumb.label.toLowerCase()}`}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-[200px] pl-8"
            data-testid="search-input"
          />
        </div>
        
        <Button variant="ghost" size="icon" data-testid="button-notifications">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        <Button variant="ghost" size="icon" data-testid="button-settings">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  )
}