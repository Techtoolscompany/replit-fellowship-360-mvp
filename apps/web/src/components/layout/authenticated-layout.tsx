'use client'

import { useAuth } from '@/lib/auth/context'
import { AppShell } from '@/components/layout/app-shell'
import { LoginForm } from '@/components/auth/login-form'
import { Loader2 } from 'lucide-react'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  )
}
