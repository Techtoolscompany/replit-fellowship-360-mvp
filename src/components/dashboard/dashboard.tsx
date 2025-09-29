'use client'

import { useAuth } from '@/lib/auth/context'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, MessageCircle, TrendingUp, Phone, UserPlus } from 'lucide-react'
import { ContactsTable } from '@/components/contacts/contacts-table'
import { ActivityFeed } from '@/components/activity/activity-feed'
import { GraceWidget } from '@/components/grace/grace-widget'

export function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {user.church?.name || 'Fellowship 360'}
                </p>
              </div>
              <Badge variant="outline" className="hidden sm:flex">
                {user.role}
              </Badge>
            </div>
          </header>

          <div className="flex-1 p-6 space-y-6">
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">234</div>
                  <p className="text-xs text-muted-foreground">
                    +12 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Week's Visitors</CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Grace Interactions</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-muted-foreground">
                    +15 from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Follow-ups Pending</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    3 due today
                  </p>
                </CardContent>
              </Card>
            </div>

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
          </div>
        </main>

        {/* Grace AI Widget */}
        <GraceWidget />
      </div>
    </SidebarProvider>
  )
}