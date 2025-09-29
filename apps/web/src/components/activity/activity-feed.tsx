'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/context'
import { supabase } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Calendar, 
  Settings, 
  User,
  Clock
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'VOICE' | 'SMS' | 'EMAIL' | 'VISIT' | 'CALENDAR' | 'WORKFLOW' | 'MANUAL'
  title: string
  description: string | null
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  occurred_at: string
  contact_id?: string | null
  contacts?: {
    first_name: string
    last_name: string
  } | null
}

interface ActivityFeedProps {
  limit?: number
}

export function ActivityFeed({ limit = 10 }: ActivityFeedProps) {
  const { user } = useAuth()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.churchId || !user.churchId) {
      // Demo mode - show sample data
      setActivities([
        {
          id: '1',
          type: 'VOICE',
          title: 'Answered service time inquiry',
          description: 'Grace provided Sunday service schedule information',
          status: 'COMPLETED',
          occurred_at: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
          contacts: { first_name: 'John', last_name: 'Smith' }
        },
        {
          id: '2',
          type: 'SMS',
          title: 'Prayer request received',
          description: 'Forwarded prayer request to pastoral team',
          status: 'COMPLETED',
          occurred_at: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
          contacts: { first_name: 'Mary', last_name: 'Johnson' }
        },
        {
          id: '3',
          type: 'CALENDAR',
          title: 'Appointment scheduled',
          description: 'Counseling session booked for next Tuesday',
          status: 'PENDING',
          occurred_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          contacts: { first_name: 'David', last_name: 'Williams' }
        }
      ])
      setLoading(false)
      return
    }

    const fetchActivities = async () => {
      try {
        let query = supabase
          .from('activity_log')
          .select(`
            id,
            type,
            title,
            description,
            status,
            occurred_at,
            contact_id,
            contacts!contact_id(first_name, last_name)
          `)
          .eq('church_id', user.churchId)
          .order('occurred_at', { ascending: false })

        if (limit) {
          query = query.limit(limit)
        }

        const { data, error } = await query

        if (error) {
          console.error('Error fetching activities:', error)
        } else {
          setActivities(data || [])
        }
      } catch (error) {
        console.error('Error in fetchActivities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [user?.churchId, limit])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'VOICE':
        return Phone
      case 'SMS':
        return MessageSquare
      case 'EMAIL':
        return Mail
      case 'CALENDAR':
        return Calendar
      case 'WORKFLOW':
        return Settings
      case 'VISIT':
        return User
      default:
        return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60)
      return `${minutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: limit || 5 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No activity yet</h3>
        <p className="text-sm">Grace interactions and system events will appear here.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type)
          
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <Badge className={getStatusColor(activity.status)} variant="outline">
                    {activity.status}
                  </Badge>
                </div>
                
                {activity.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {activity.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {activity.contacts && (
                    <span>
                      {activity.contacts.first_name} {activity.contacts.last_name}
                    </span>
                  )}
                  <span>•</span>
                  <span>{formatTime(activity.occurred_at)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}