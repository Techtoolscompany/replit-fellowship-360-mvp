'use client'

import { useAuth } from '@/lib/auth/context'
import HybridDashboard from './hybrid-dashboard'

export function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  return <HybridDashboard />
}