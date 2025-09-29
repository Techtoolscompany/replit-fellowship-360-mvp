'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, Calendar, MapPin } from "lucide-react"

const sampleMinistries = [
  {
    id: 1,
    name: "Worship Team",
    description: "Leading the congregation in worship through music and song",
    leader: "Sarah Johnson",
    members: 12,
    nextMeeting: "Sunday 9:00 AM",
    location: "Main Sanctuary",
    status: "Active"
  },
  {
    id: 2,
    name: "Youth Ministry",
    description: "Serving teenagers and young adults in their faith journey",
    leader: "Michael Chen",
    members: 25,
    nextMeeting: "Friday 7:00 PM",
    location: "Youth Center",
    status: "Active"
  },
  {
    id: 3,
    name: "Children's Ministry",
    description: "Nurturing children in faith through age-appropriate activities",
    leader: "Emily Davis",
    members: 18,
    nextMeeting: "Sunday 10:30 AM",
    location: "Children's Wing",
    status: "Active"
  },
  {
    id: 4,
    name: "Outreach Ministry",
    description: "Serving the community and spreading God's love beyond our walls",
    leader: "Robert Martinez",
    members: 8,
    nextMeeting: "Saturday 9:00 AM",
    location: "Community Center",
    status: "Planning"
  }
]

export default function MinistriesPage() {
  return (
    <div className="space-y-6" data-testid="ministries-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="page-title">Ministries</h1>
          <p className="text-muted-foreground">Manage church ministries and teams</p>
        </div>
        <Button data-testid="button-add-ministry">
          <Plus className="h-4 w-4 mr-2" />
          Add Ministry
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sampleMinistries.map((ministry) => (
          <Card key={ministry.id} data-testid={`ministry-card-${ministry.id}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle data-testid={`ministry-name-${ministry.id}`}>
                  {ministry.name}
                </CardTitle>
                <Badge 
                  variant={ministry.status === 'Active' ? 'default' : 'secondary'}
                  data-testid={`ministry-status-${ministry.id}`}
                >
                  {ministry.status}
                </Badge>
              </div>
              <CardDescription>{ministry.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>{ministry.leader.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Led by {ministry.leader}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {ministry.members} members
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {ministry.nextMeeting}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {ministry.location}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" data-testid={`button-edit-${ministry.id}`}>
                  Edit
                </Button>
                <Button size="sm" variant="outline" data-testid={`button-members-${ministry.id}`}>
                  View Members
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}