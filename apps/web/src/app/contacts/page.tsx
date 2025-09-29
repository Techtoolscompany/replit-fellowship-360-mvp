'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Phone, Mail, MessageSquare } from "lucide-react"

// Sample contacts for Grace Community Church
const sampleContacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@gracechurch.com",
    phone: "(555) 123-4567",
    role: "Worship Leader",
    lastContact: "2024-01-15",
    status: "Active",
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "(555) 234-5678",
    role: "Youth Pastor",
    lastContact: "2024-01-10",
    status: "Active",
    avatar: "MC"
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.d@outlook.com",
    phone: "(555) 345-6789",
    role: "Children's Ministry",
    lastContact: "2024-01-08",
    status: "Follow-up Needed",
    avatar: "ED"
  },
  {
    id: 4,
    name: "Robert Martinez",
    email: "rob.martinez@gmail.com",
    phone: "(555) 456-7890",
    role: "Elder",
    lastContact: "2024-01-12",
    status: "Active",
    avatar: "RM"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    email: "lisa.t@church.com",
    phone: "(555) 567-8901",
    role: "Visitor",
    lastContact: "2024-01-05",
    status: "New Member",
    avatar: "LT"
  }
]

export default function ContactsPage() {
  return (
    <div className="space-y-6" data-testid="contacts-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="page-title">Contacts</h1>
          <p className="text-muted-foreground">Manage your church members and visitors</p>
        </div>
        <Button data-testid="button-add-contact">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search contacts..." 
            className="pl-8" 
            data-testid="input-search-contacts"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {sampleContacts.map((contact) => (
          <Card key={contact.id} data-testid={`contact-card-${contact.id}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>{contact.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold" data-testid={`contact-name-${contact.id}`}>
                      {contact.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{contact.role}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {contact.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {contact.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={contact.status === 'Active' ? 'default' : contact.status === 'New Member' ? 'secondary' : 'outline'}
                    data-testid={`contact-status-${contact.id}`}
                  >
                    {contact.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" data-testid={`button-call-${contact.id}`}>
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" data-testid={`button-message-${contact.id}`}>
                      <MessageSquare className="h-4 w-4" />
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