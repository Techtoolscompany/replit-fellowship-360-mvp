'use client'

export const dynamic = 'force-dynamic';

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export default function HelpPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6" data-testid="help-page">
        <div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">
            Browse resources and reach out to Fellowship 360 support when you need a hand.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-background p-6 space-y-4">
          <section>
            <h2 className="text-lg font-semibold">Need assistance?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Documentation and live support are coming soon. For now, contact your Fellowship 360 admin for help.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Quick actions</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Review onboarding materials in the Docs section.</li>
              <li>Check the release notes to stay current on features.</li>
              <li>Email support@fellowship360.com for urgent issues.</li>
            </ul>
          </section>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
