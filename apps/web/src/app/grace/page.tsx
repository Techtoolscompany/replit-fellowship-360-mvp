'use client'

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone, Clock, Send, Settings, BarChart3 } from "lucide-react"

const recentInteractions = [
  {
    id: 1,
    contact: "Sarah Johnson",
    type: "Voice Call",
    timestamp: "2 hours ago",
    duration: "5:23",
    status: "Completed",
    summary: "Prayer request for family situation"
  },
  {
    id: 2,
    contact: "Michael Chen",
    type: "SMS",
    timestamp: "4 hours ago",
    duration: "-",
    status: "Completed",
    summary: "Event reminder confirmation"
  },
  {
    id: 3,
    contact: "Emily Davis",
    type: "Chat",
    timestamp: "1 day ago",
    duration: "12:15",
    status: "Completed",
    summary: "Questions about children's ministry"
  }
]

export default function GraceAssistantPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-6" data-testid="grace-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="page-title">Grace Assistant</h1>
          <p className="text-muted-foreground">AI-powered church member support and interaction management</p>
        </div>
        <Button data-testid="button-settings">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Grace AI Status */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card data-testid="card-voice-calls">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice Calls Today</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card data-testid="card-sms-conversations">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>

        <Card data-testid="card-avg-response-time">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3s</div>
            <p className="text-xs text-muted-foreground">Faster than 95% of AI assistants</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card data-testid="card-quick-actions">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common Grace AI operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-2">
            <Button variant="outline" className="justify-start" data-testid="button-test-voice">
              <Phone className="h-4 w-4 mr-2" />
              Test Voice Call
            </Button>
            <Button variant="outline" className="justify-start" data-testid="button-send-sms">
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Test SMS
            </Button>
            <Button variant="outline" className="justify-start" data-testid="button-view-analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="justify-start" data-testid="button-configure-ai">
              <Settings className="h-4 w-4 mr-2" />
              Configure AI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Interactions */}
      <Card data-testid="card-recent-interactions">
        <CardHeader>
          <CardTitle>Recent Interactions</CardTitle>
          <CardDescription>Latest Grace AI conversations and calls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInteractions.map((interaction) => (
              <div key={interaction.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`interaction-${interaction.id}`}>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {interaction.type === 'Voice Call' ? (
                      <Phone className="h-4 w-4" />
                    ) : interaction.type === 'SMS' ? (
                      <MessageCircle className="h-4 w-4" />
                    ) : (
                      <MessageCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{interaction.contact}</p>
                    <p className="text-sm text-muted-foreground">{interaction.summary}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{interaction.timestamp}</span>
                      {interaction.duration !== '-' && (
                        <>
                          <span>•</span>
                          <span>{interaction.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" data-testid={`interaction-status-${interaction.id}`}>
                  {interaction.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grace AI Setup Notice */}
      <Card className="border-dashed border-2" data-testid="card-setup-notice">
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Grace AI Ready for Setup</h3>
          <p className="text-muted-foreground mb-4">
            Connect Grace AI with Twilio, ElevenLabs, and OpenAI to enable voice calls, SMS messaging, and intelligent responses.
          </p>
          <Button data-testid="button-setup-grace">
            <Settings className="h-4 w-4 mr-2" />
            Set Up Grace AI
          </Button>
        </CardContent>
      </Card>
      </div>
    </AuthenticatedLayout>
  )
}