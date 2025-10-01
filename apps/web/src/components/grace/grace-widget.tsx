'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Phone } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export function GraceWidget() {
  const { graceStatus, graceInteractions } = useAppStore()
  
  const isOnline = graceStatus === 'online'

  return (
    <div className="space-y-4">
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
    </div>
  )
}