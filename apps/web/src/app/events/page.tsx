'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Clock, MapPin, Users } from "lucide-react"

const sampleEvents = [
  {
    id: 1,
    name: "Sunday Worship Service",
    description: "Weekly worship service with praise, prayer, and preaching",
    date: "2024-01-21",
    time: "10:30 AM",
    location: "Main Sanctuary",
    attendees: 150,
    type: "Worship",
    status: "Scheduled"
  },
  {
    id: 2,
    name: "Youth Game Night",
    description: "Fun games, snacks, and fellowship for teens",
    date: "2024-01-19",
    time: "7:00 PM",
    location: "Youth Center",
    attendees: 25,
    type: "Youth",
    status: "Upcoming"
  },
  {
    id: 3,
    name: "Bible Study",
    description: "Midweek Bible study and discussion",
    date: "2024-01-17",
    time: "7:00 PM",
    location: "Fellowship Hall",
    attendees: 45,
    type: "Study",
    status: "Upcoming"
  },
  {
    id: 4,
    name: "Community Outreach",
    description: "Serving meals at the local shelter",
    date: "2024-01-20",
    time: "5:00 PM",
    location: "Community Shelter",
    attendees: 12,
    type: "Outreach",
    status: "Upcoming"
  },
  {
    id: 5,
    name: "Church Picnic",
    description: "Annual church picnic with food, games, and fellowship",
    date: "2024-02-10",
    time: "12:00 PM",
    location: "City Park",
    attendees: 200,
    type: "Fellowship",
    status: "Planning"
  }
]

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'Worship': return 'default'
    case 'Youth': return 'secondary'
    case 'Study': return 'outline'
    case 'Outreach': return 'destructive'
    case 'Fellowship': return 'secondary'
    default: return 'outline'
  }
}

export default function EventsPage() {
  return (
    <div className="space-y-6" data-testid="events-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="page-title">Events</h1>
          <p className="text-muted-foreground">Manage church events and activities</p>
        </div>
        <Button data-testid="button-add-event">
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid gap-4">
        {sampleEvents.map((event) => (
          <Card key={event.id} data-testid={`event-card-${event.id}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold" data-testid={`event-name-${event.id}`}>
                      {event.name}
                    </h3>
                    <Badge variant={getEventTypeColor(event.type)} data-testid={`event-type-${event.id}`}>
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {event.attendees} expected
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={event.status === 'Scheduled' ? 'default' : 'outline'}
                    data-testid={`event-status-${event.id}`}
                  >
                    {event.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" data-testid={`button-edit-${event.id}`}>
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" data-testid={`button-attendees-${event.id}`}>
                      Attendees
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}