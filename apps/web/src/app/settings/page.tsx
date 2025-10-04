'use client'

export const dynamic = 'force-dynamic';

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export default function SettingsPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6" data-testid="settings-page">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your Fellowship 360 preferences and account configuration.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="text-lg font-semibold">This area is under construction</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The team has not shipped the settings experience yet. Add your modules here when ready.
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
