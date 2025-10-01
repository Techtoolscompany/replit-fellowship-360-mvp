'use client'

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Calendar, Download, Filter } from "lucide-react"

const reportData = [
  {
    id: 1,
    title: "Weekly Attendance Report",
    description: "Attendance trends for the past 4 weeks",
    type: "Attendance",
    period: "Weekly",
    lastUpdated: "2 hours ago",
    status: "Ready"
  },
  {
    id: 2,
    title: "Ministry Engagement",
    description: "Member participation across all ministries",
    type: "Engagement",
    period: "Monthly",
    lastUpdated: "1 day ago",
    status: "Ready"
  },
  {
    id: 3,
    title: "Grace AI Interactions",
    description: "Voice calls, SMS, and chat statistics",
    type: "AI Analytics",
    period: "Weekly",
    lastUpdated: "3 hours ago",
    status: "Ready"
  },
  {
    id: 4,
    title: "Visitor Follow-up",
    description: "First-time visitor tracking and conversion",
    type: "Visitors",
    period: "Monthly",
    lastUpdated: "12 hours ago",
    status: "Processing"
  }
]

const quickStats = [
  {
    title: "Total Members",
    value: "342",
    change: "+12",
    trend: "up",
    period: "This month"
  },
  {
    title: "Avg Attendance",
    value: "287",
    change: "+5.2%",
    trend: "up",
    period: "Last 4 weeks"
  },
  {
    title: "Active Ministries",
    value: "8",
    change: "+1",
    trend: "up",
    period: "This quarter"
  },
  {
    title: "Grace AI Calls",
    value: "156",
    change: "+23%",
    trend: "up",
    period: "This week"
  }
]

export default function ReportsPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6" data-testid="reports-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="page-title">Reports</h1>
          <p className="text-muted-foreground">Church analytics and performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" data-testid="button-filter">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index} data-testid={`stat-card-${index}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">{stat.change}</span>
                <span className="ml-1">{stat.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Reports */}
      <Card data-testid="card-available-reports">
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Generate and download detailed analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`report-${report.id}`}>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium" data-testid={`report-title-${report.id}`}>
                      {report.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                      <Badge variant="outline">{report.type}</Badge>
                      <span>•</span>
                      <span>{report.period}</span>
                      <span>•</span>
                      <span>Updated {report.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={report.status === 'Ready' ? 'default' : 'secondary'}
                    data-testid={`report-status-${report.id}`}
                  >
                    {report.status}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={report.status !== 'Ready'}
                    data-testid={`button-download-${report.id}`}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Placeholder */}
      <Card data-testid="card-attendance-chart">
        <CardHeader>
          <CardTitle>Attendance Trends</CardTitle>
          <CardDescription>Weekly attendance over the past 12 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Interactive chart will be displayed here</p>
              <p className="text-sm">Showing attendance data visualization</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </AuthenticatedLayout>
  )
}