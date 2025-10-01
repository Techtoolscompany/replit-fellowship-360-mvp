'use client'

import { Example as DashboardLayout } from '@/components/ui/dashboard-with-collapsible-sidebar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}