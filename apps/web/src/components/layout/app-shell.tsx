'use client'

import { FellowshipSidebar } from '@/components/layout/fellowship-sidebar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <FellowshipSidebar>
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 space-y-6">
          {children}
        </div>
      </main>
    </FellowshipSidebar>
  )
}