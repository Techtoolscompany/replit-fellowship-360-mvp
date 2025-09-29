'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Phone, Minimize2, Maximize2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'

export function GraceWidget() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { graceStatus, graceInteractions } = useAppStore()
  
  const isOnline = graceStatus === 'online'

  if (!isExpanded) {
    return (
      <div className="fellowship-grace-widget">
        <Button
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          data-testid="button-grace-widget"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fellowship-grace-widget">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Grace Assistant</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  )} />
                  {isOnline ? 'Online' : 'Offline'}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Grace Status */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Today's Activity</span>
              <Badge variant="outline">{graceInteractions} interactions</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                23 calls
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                24 messages
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="h-auto p-2 text-xs">
                <Phone className="w-3 h-3 mr-1" />
                Make Call
              </Button>
              <Button variant="outline" size="sm" className="h-auto p-2 text-xs">
                <MessageCircle className="w-3 h-3 mr-1" />
                Send SMS
              </Button>
            </div>
          </div>

          {/* Recent Grace Activities */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Activities</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <span className="text-muted-foreground">Answered FAQ about service times</span>
                <span className="text-muted-foreground">2m ago</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <span className="text-muted-foreground">Scheduled appointment for John Doe</span>
                <span className="text-muted-foreground">15m ago</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <span className="text-muted-foreground">Sent prayer request to pastoral team</span>
                <span className="text-muted-foreground">1h ago</span>
              </div>
            </div>
          </div>

          {/* View Full Grace Dashboard */}
          <Button asChild className="w-full">
            <a href="/grace">Open Grace Dashboard</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}