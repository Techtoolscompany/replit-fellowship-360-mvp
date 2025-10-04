'use client'

import { useAuth } from '@/lib/auth/context'
import { FellowshipDashboard } from './fellowship-dashboard'

export function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  return <FellowshipDashboard />
}