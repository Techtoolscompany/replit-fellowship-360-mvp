'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/lib/auth/context'
import { User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  
  if (!user) return null

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="space-y-6" data-testid="profile-page">
      <div>
        <h1 className="text-3xl font-bold" data-testid="page-title">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card data-testid="profile-info-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Your basic account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge variant="outline">
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role.toLowerCase()}
                </Badge>
              </div>
            </div>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={user.firstName} data-testid="input-first-name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={user.lastName} data-testid="input-last-name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} data-testid="input-email" />
              </div>
            </div>
            
            <Button data-testid="button-save-profile">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Church Information */}
        <Card data-testid="church-info-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Church Information
            </CardTitle>
            <CardDescription>Your church details and membership</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Church Name</Label>
              <Input defaultValue={user.church?.name || 'Grace Community Church'} disabled />
            </div>
            
            <div className="space-y-2">
              <Label>Member Since</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                January 2024
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Role & Permissions</Label>
              <div className="space-y-2">
                <Badge variant="outline" className="w-fit">
                  {user.role === 'ADMIN' ? 'Church Administrator' : 'Church Member'}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {user.role === 'ADMIN' 
                    ? 'Full access to church management features'
                    : 'Access to member features and information'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Preferences */}
        <Card data-testid="contact-preferences-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Preferences
            </CardTitle>
            <CardDescription>How you'd like to receive communications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" data-testid="input-phone" />
            </div>
            
            <div className="space-y-3">
              <Label>Communication Preferences</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Email notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">SMS reminders</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Marketing communications</span>
                </label>
              </div>
            </div>
            
            <Button variant="outline" data-testid="button-save-preferences">Save Preferences</Button>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card data-testid="security-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Security
            </CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="flex gap-2">
                <Input type="password" value="••••••••" disabled className="flex-1" />
                <Button variant="outline" data-testid="button-change-password">Change</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Two-Factor Authentication</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Not enabled</span>
                <Button variant="outline" size="sm" data-testid="button-enable-2fa">Enable</Button>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="destructive" data-testid="button-delete-account">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}