'use client'

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Dashboard } from '@/components/dashboard/dashboard'

export default function HomePage() {
  return (
    <AuthenticatedLayout>
      <Dashboard />
    </AuthenticatedLayout>
  )
}