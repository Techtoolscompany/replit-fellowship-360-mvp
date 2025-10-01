'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/context'
import { supabase } from '@/lib/supabase/client'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Phone, Mail, Eye, Users } from 'lucide-react'

interface Contact {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  status: 'LEAD' | 'ACTIVE' | 'INACTIVE'
  created_at: string
}

interface ContactsTableProps {
  limit?: number
}

export function ContactsTable({ limit = 10 }: ContactsTableProps) {
  const { user } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.churchId || !user.churchId) {
      // Demo mode - show sample data with static timestamps
      const now = new Date()
      setContacts([
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone: '(555) 123-4567',
          status: 'ACTIVE',
          created_at: now.toISOString()
        },
        {
          id: '2',
          first_name: 'Sarah',
          last_name: 'Wilson',
          email: 'sarah@example.com',
          phone: '(555) 987-6543',
          status: 'LEAD',
          created_at: new Date(now.getTime() - 86400000).toISOString()
        }
      ])
      setLoading(false)
      return
    }

    const fetchContacts = async () => {
      try {
        let query = supabase
          .from('contacts')
          .select('id, first_name, last_name, email, phone, status, created_at')
          .eq('church_id', user.churchId)
          .order('created_at', { ascending: false })

        if (limit) {
          query = query.limit(limit)
        }

        const { data, error } = await query

        if (error) {
          console.error('Error fetching contacts:', error)
        } else {
          setContacts(data || [])
        }
      } catch (error) {
        console.error('Error in fetchContacts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [user?.churchId, limit])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LEAD':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: limit || 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[60px]" />
          </div>
        ))}
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No contacts yet</h3>
        <p className="text-sm">Start adding members and visitors to see them here.</p>
        <Button className="mt-4" asChild>
          <a href="/contacts/new">Add First Contact</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">
                {contact.first_name} {contact.last_name}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {contact.email && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(contact.status)}>
                  {contact.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(contact.created_at)}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" asChild>
                  <a href={`/contacts/${contact.id}`}>
                    <Eye className="h-4 w-4" />
                  </a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {limit && contacts.length >= limit && (
        <div className="text-center">
          <Button variant="outline" asChild>
            <a href="/contacts">View All Contacts</a>
          </Button>
        </div>
      )}
    </div>
  )
}