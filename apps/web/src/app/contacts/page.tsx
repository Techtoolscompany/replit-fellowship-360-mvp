'use client'

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ContactsDataTable } from "@/components/contacts/contacts-data-table"

export default function ContactsPage() {
  return (
    <AuthenticatedLayout>
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

        <ContactsDataTable />
      </div>
    </AuthenticatedLayout>
  )
}