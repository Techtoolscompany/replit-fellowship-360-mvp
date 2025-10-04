'use client'

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HotelCard } from "@/components/ui/hotel-card"
import Calendar from "@/components/ui/calendar"
import { Plus, Calendar as CalendarIcon, Users } from "lucide-react"
import { useState, useEffect, useRef } from "react"

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
    status: "Scheduled",
    imageUrl: "https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=2940&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 150
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
    status: "Upcoming",
    imageUrl: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=2940&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 25
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
    status: "Upcoming",
    imageUrl: "https://images.unsplash.com/photo-1596622247990-84877175438a?q=80&w=2864&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 45
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
    status: "Upcoming",
    imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2940&auto=format&fit=crop",
    rating: 4.6,
    reviewCount: 12
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
    status: "Planning",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2940&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 200
  },
  {
    id: 6,
    name: "Prayer Meeting",
    description: "Weekly prayer and meditation session",
    date: "2024-01-24",
    time: "6:30 PM",
    location: "Prayer Room",
    attendees: 30,
    type: "Prayer",
    status: "Upcoming",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2940&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 30
  },
  {
    id: 7,
    name: "Children's Ministry",
    description: "Sunday school and activities for children",
    date: "2024-01-28",
    time: "9:00 AM",
    location: "Children's Wing",
    attendees: 40,
    type: "Children",
    status: "Upcoming",
    imageUrl: "https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=2940&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 40
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <AuthenticatedLayout>
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

        {/* Calendar Left, Events Right Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Card - Left Side */}
          <Card className="lg:col-span-1 p-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </CardTitle>
              <CardDescription>
                Select a date to view events
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full">
                <Calendar
                  initialDate={new Date()}
                  onDateSelect={setSelectedDate}
                  showSelectedDateInfo={false}
                  className="w-full border-0 shadow-none rounded-none bg-transparent p-4"
                  maxWidth="max-w-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Events Card - Right Side */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>
                Events scheduled for your church
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px] overflow-y-auto scrollbar-hide infinite-scroll">
                <div className="p-6">
                  {/* Infinite scrolling events */}
                  <div className="space-y-6">
                    {[...sampleEvents, ...sampleEvents, ...sampleEvents].map((event, index) => (
                      <div key={`${event.id}-${index}`} data-testid={`event-card-${event.id}-${index}`} className="w-full">
                        <HotelCard
                          imageUrl={event.imageUrl}
                          imageAlt={event.name}
                          roomType={event.type}
                          hotelName={event.name}
                          location={`${event.location} • ${new Date(event.date).toLocaleDateString()} • ${event.time}`}
                          rating={event.rating}
                          reviewCount={event.attendees}
                          description={event.description}
                          className="w-full h-[160px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}