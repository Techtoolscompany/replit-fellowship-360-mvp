'use client'

import { useAuth } from '@/lib/auth/context'
import { ChurchChartInteractive } from "@/components/dashboard/church-chart-interactive"
import { ChurchSectionCards } from "@/components/dashboard/church-section-cards"
import { ContactsTable } from "@/components/contacts/contacts-table"
import { ActivityFeed } from "@/components/activity/activity-feed"
import { GraceWidget } from "@/components/grace/grace-widget"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HybridDashboard() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user.firstName}!
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening at {user.church?.name || 'your church'} today.
        </p>
      </div>

      {/* Metrics Cards */}
      <ChurchSectionCards />
      
      {/* Chart */}
      <ChurchChartInteractive />
      
      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Contacts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Contacts</CardTitle>
              <CardDescription>
                Latest members and visitors that need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactsTable limit={5} />
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Grace interactions and system updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed limit={10} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grace Widget */}
      <GraceWidget />
    </div>
  )
}
