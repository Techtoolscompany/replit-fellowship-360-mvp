'use client'

import { useAuth } from '@/lib/auth/context'
import { LoginForm } from '@/components/auth/login-form'
import { Dashboard } from '@/components/dashboard/dashboard'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
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

  return <Dashboard />
}