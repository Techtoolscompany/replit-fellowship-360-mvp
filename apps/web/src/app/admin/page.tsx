'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth/context'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import {
  ArrowUpRight,
  CalendarClock,
  DollarSign,
  MapPin,
  NotebookPen,
  Shield,
  Sparkles,
  Target,
  UserPlus,
  Users
} from 'lucide-react'

type Role = 'STAFF' | 'ADMIN' | 'AGENCY'
type UserStatus = 'ACTIVE' | 'INACTIVE'
type RoleFilter = Role | 'ALL'
type StatusFilter = UserStatus | 'ALL'

type SalesStage = 'Prospect' | 'Discovery' | 'Pilot' | 'Expansion' | 'Renewal'
type ClientStatus = 'Active' | 'Pending' | 'Dormant'

interface SalesClient {
  id: string
  name: string
  ministry: string
  stage: SalesStage
  pipelineValue: number
  probability: number
  leadSource: string
  nextStep: string
  nextMeeting: string
  status: ClientStatus
  location: string
  tags: string[]
  notes: string
}

interface Appointment {
  id: string
  clientId: string
  userId: string
  title: string
  type: 'Strategy Call' | 'Demo' | 'Training' | 'Review'
  owner: string
  method: 'Video' | 'Phone' | 'On-site'
  scheduledFor: string
  status: 'Scheduled' | 'Completed' | 'Pending'
}

interface UserRecord {
  id: string
  firstName: string
  lastName: string
  title?: string
  email: string
  phone?: string
  role: Role
  status: UserStatus
  churchId: string
  churchName: string
  joined: string
  lastActivity: string
}

const clientsSeed: SalesClient[] = [
  {
    id: 'grace-worship',
    name: 'Grace Community Church',
    ministry: 'Worship Team',
    stage: 'Expansion',
    pipelineValue: 18000,
    probability: 0.75,
    leadSource: 'Referral',
    nextStep: 'Finalize automation proposal',
    nextMeeting: '2025-02-06T15:00:00-05:00',
    status: 'Active',
    location: 'Atlanta, GA',
    tags: ['Premium', 'High priority'],
    notes: 'Needs AI-powered follow up sequences for new musicians.'
  },
  {
    id: 'new-hope-youth',
    name: 'New Hope Fellowship',
    ministry: 'Youth Ministry',
    stage: 'Pilot',
    pipelineValue: 12600,
    probability: 0.6,
    leadSource: 'Conference',
    nextStep: 'Launch onboarding workshop',
    nextMeeting: '2025-02-03T18:30:00-05:00',
    status: 'Active',
    location: 'Birmingham, AL',
    tags: ['Growth plan'],
    notes: 'Pilot program testing visitor follow-up workflow.'
  },
  {
    id: 'citylight-outreach',
    name: 'CityLight Church',
    ministry: 'Community Outreach',
    stage: 'Discovery',
    pipelineValue: 9200,
    probability: 0.45,
    leadSource: 'Inbound',
    nextStep: 'Share success case studies',
    nextMeeting: '2025-02-10T11:00:00-05:00',
    status: 'Pending',
    location: 'Charlotte, NC',
    tags: ['High impact'],
    notes: 'Interested in SMS campaigns for volunteer mobilization.'
  },
  {
    id: 'harvest-kids',
    name: 'Harvest Life Church',
    ministry: "Children's Ministry",
    stage: 'Prospect',
    pipelineValue: 7400,
    probability: 0.3,
    leadSource: 'LinkedIn',
    nextStep: 'Schedule discovery call',
    nextMeeting: '2025-02-12T13:00:00-05:00',
    status: 'Pending',
    location: 'Nashville, TN',
    tags: ['New lead'],
    notes: 'Needs check-in flows and parent follow-up templates.'
  }
]

const appointmentsSeed: Appointment[] = [
  {
    id: 'appt-001',
    clientId: 'grace-worship',
    userId: 'user-sarah',
    title: 'Automation blueprint review',
    type: 'Strategy Call',
    owner: 'Alex Rivera',
    method: 'Video',
    scheduledFor: '2025-02-06T15:00:00-05:00',
    status: 'Scheduled'
  },
  {
    id: 'appt-002',
    clientId: 'new-hope-youth',
    userId: 'user-michael',
    title: 'Pilot training session',
    type: 'Training',
    owner: 'Jordan Lee',
    method: 'On-site',
    scheduledFor: '2025-02-03T18:30:00-05:00',
    status: 'Scheduled'
  },
  {
    id: 'appt-003',
    clientId: 'citylight-outreach',
    userId: 'user-robert',
    title: 'Discovery recap & next steps',
    type: 'Review',
    owner: 'Alex Rivera',
    method: 'Video',
    scheduledFor: '2025-02-10T11:00:00-05:00',
    status: 'Pending'
  },
  {
    id: 'appt-004',
    clientId: 'harvest-kids',
    userId: 'user-emily',
    title: 'Grace demo for kids check-in',
    type: 'Demo',
    owner: 'Jordan Lee',
    method: 'Video',
    scheduledFor: '2025-02-12T13:00:00-05:00',
    status: 'Pending'
  }
]

const usersSeed: Omit<UserRecord, 'churchName'>[] = [
  {
    id: 'user-sarah',
    firstName: 'Sarah',
    lastName: 'Johnson',
    title: 'Worship Director',
    email: 'sarah.johnson@gracechurch.com',
    phone: '(555) 123-4567',
    role: 'ADMIN',
    status: 'ACTIVE',
    churchId: 'grace-worship',
    joined: '2024-01-15',
    lastActivity: '2025-02-04T14:30:00-05:00'
  },
  {
    id: 'user-michael',
    firstName: 'Michael',
    lastName: 'Chen',
    title: 'Youth Pastor',
    email: 'michael.chen@newhope.org',
    phone: '(555) 234-5678',
    role: 'ADMIN',
    status: 'ACTIVE',
    churchId: 'new-hope-youth',
    joined: '2024-02-01',
    lastActivity: '2025-02-04T09:15:00-05:00'
  },
  {
    id: 'user-emily',
    firstName: 'Emily',
    lastName: 'Davis',
    title: 'Kids Director',
    email: 'emily.davis@harvestlife.org',
    phone: '(555) 345-6789',
    role: 'STAFF',
    status: 'ACTIVE',
    churchId: 'harvest-kids',
    joined: '2024-03-12',
    lastActivity: '2025-02-03T16:05:00-05:00'
  },
  {
    id: 'user-robert',
    firstName: 'Robert',
    lastName: 'Martinez',
    title: 'Outreach Coordinator',
    email: 'robert.martinez@citylight.org',
    phone: '(555) 456-7890',
    role: 'STAFF',
    status: 'ACTIVE',
    churchId: 'citylight-outreach',
    joined: '2024-06-21',
    lastActivity: '2025-02-02T11:42:00-05:00'
  },
  {
    id: 'user-lisa',
    firstName: 'Lisa',
    lastName: 'Thompson',
    title: 'Grace Liaison',
    email: 'lisa.thompson@gracechurch.com',
    phone: '(555) 567-8901',
    role: 'STAFF',
    status: 'ACTIVE',
    churchId: 'grace-worship',
    joined: '2024-05-09',
    lastActivity: '2025-02-01T18:20:00-05:00'
  },
  {
    id: 'user-avery',
    firstName: 'Avery',
    lastName: 'Nguyen',
    title: 'Agency Success Manager',
    email: 'avery.nguyen@fellowship360.com',
    phone: '(555) 678-9012',
    role: 'AGENCY',
    status: 'ACTIVE',
    churchId: 'grace-worship',
    joined: '2023-11-02',
    lastActivity: '2025-02-04T07:50:00-05:00'
  }
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value)

const formatPercent = (value: number) => `${Math.round(value * 100)}%`

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })

const toSearchString = (user: UserRecord) =>
  `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase()

export default function AdminDashboard() {
  const { user } = useAuth()

  const [clients] = useState<SalesClient[]>(clientsSeed)
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsSeed)
  const [users, setUsers] = useState<UserRecord[]>(() =>
    usersSeed.map((item) => ({
      ...item,
      churchName: clientsSeed.find((client) => client.id === item.churchId)?.ministry ?? 'Unassigned'
    }))
  )

  const [activeTab, setActiveTab] = useState<'sales' | 'users'>('sales')
  const [selectedClientId, setSelectedClientId] = useState<string>(clientsSeed[0]?.id ?? '')

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [churchFilter, setChurchFilter] = useState<string>('ALL')

  if (user?.role !== 'ADMIN' && user?.role !== 'AGENCY') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <Shield className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <CardTitle>Access denied</CardTitle>
            <CardDescription>
              You need admin or agency privileges to view the hybrid dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) ?? clients[0] ?? null,
    [clients, selectedClientId]
  )

  const clientUsers = useMemo(
    () => users.filter((record) => record.churchId === selectedClient?.id),
    [users, selectedClient?.id]
  )

  const salesMetrics = useMemo(() => {
    const totalPipeline = clients.reduce((sum, client) => sum + client.pipelineValue, 0)
    const activeClients = clients.filter((client) => client.status === 'Active').length
    const now = new Date()
    const upcomingAppointments = appointments.filter((appt) => new Date(appt.scheduledFor) > now).length
    const openLeads = clients.filter((client) => client.stage === 'Prospect' || client.stage === 'Discovery').length

    return [
      {
        id: 'pipeline',
        label: 'Pipeline value',
        value: formatCurrency(totalPipeline),
        caption: 'Across all open opportunities',
        delta: '+12% vs last month',
        icon: DollarSign
      },
      {
        id: 'clients',
        label: 'Active ministries',
        value: activeClients.toString(),
        caption: `${users.length} total users across clients`,
        delta: '+3 new onboardings',
        icon: Users
      },
      {
        id: 'appointments',
        label: 'Upcoming appointments',
        value: upcomingAppointments.toString(),
        caption: 'Calls, demos and trainings scheduled',
        delta: '4 this week',
        icon: CalendarClock
      },
      {
        id: 'leads',
        label: 'Open leads',
        value: openLeads.toString(),
        caption: 'Prospects in discovery & pilot',
        delta: '2 new inquiries',
        icon: Sparkles
      }
    ]
  }, [appointments, clients, users.length])

  const filteredUsers = useMemo(() => {
    const lowered = searchTerm.toLowerCase().trim()

    return users.filter((record) => {
      const matchesSearch = lowered.length === 0 || toSearchString(record).includes(lowered)
      const matchesRole = roleFilter === 'ALL' || record.role === roleFilter
      const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter
      const matchesChurch = churchFilter === 'ALL' || record.churchId === churchFilter

      return matchesSearch && matchesRole && matchesStatus && matchesChurch
    })
  }, [churchFilter, roleFilter, searchTerm, statusFilter, users])

  const upcomingAppointments = useMemo(
    () =>
      [...appointments]
        .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
        .slice(0, 5),
    [appointments]
  )

  const handleUserRoleChange = (userId: string, nextRole: Role) => {
    setUsers((prev) =>
      prev.map((record) => (record.id === userId ? { ...record, role: nextRole } : record))
    )
  }

  const handleUserStatusToggle = (userId: string, nextStatus: boolean) => {
    setUsers((prev) =>
      prev.map((record) =>
        record.id === userId ? { ...record, status: nextStatus ? 'ACTIVE' : 'INACTIVE' } : record
      )
    )
  }

  const handleUserChurchChange = (userId: string, nextChurchId: string) => {
    const targetClient = clients.find((client) => client.id === nextChurchId)
    if (!targetClient) return

    setUsers((prev) =>
      prev.map((record) =>
        record.id === userId
          ? { ...record, churchId: nextChurchId, churchName: targetClient.ministry }
          : record
      )
    )

    setAppointments((prev) =>
      prev.map((appt) => (appt.userId === userId ? { ...appt, clientId: nextChurchId } : appt))
    )
  }

  const salesContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={salesContainerVariants}
        className="mx-auto flex w-full max-w-7xl flex-col gap-6"
      >
        <motion.div variants={cardVariants} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hybrid Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Monitor the sales pipeline for ministries and manage every user from a single command center.
            </p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setActiveTab('users')}>
            <UserPlus className="mr-2 h-4 w-4" /> Quick add user
          </Button>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'sales' | 'users')}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              {activeTab === 'users' && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    placeholder="Search name or email"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="sm:w-64"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as RoleFilter)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All roles</SelectItem>
                        <SelectItem value="STAFF">Staff</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="AGENCY">Agency</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value as StatusFilter)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All statuses</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={churchFilter} onValueChange={setChurchFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All ministries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All ministries</SelectItem>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.ministry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <TabsContent value="sales" className="mt-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {salesMetrics.map((metric) => {
                  const Icon = metric.icon
                  return (
                    <Card key={metric.id} className="border-border/60">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-semibold">{metric.value}</div>
                        <p className="text-xs text-muted-foreground">{metric.caption}</p>
                        <p className="text-xs font-medium text-primary mt-2">{metric.delta}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {clients.map((client) => {
                      const assignedUsers = users.filter((record) => record.churchId === client.id)
                      const activeUsers = assignedUsers.filter((record) => record.status === 'ACTIVE')
                      const isSelected = client.id === selectedClient?.id

                      return (
                        <motion.button
                          key={client.id}
                          type="button"
                          onClick={() => setSelectedClientId(client.id)}
                          whileHover={{ scale: 1.01 }}
                          className={cn(
                            'flex h-full flex-col rounded-2xl border p-5 text-left transition-all',
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-lg'
                              : 'border-border hover:border-primary/40 hover:shadow-md'
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">{client.stage}</p>
                              <h3 className="text-xl font-semibold text-foreground">
                                {client.ministry}
                              </h3>
                              <p className="text-sm text-muted-foreground">{client.name}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {client.status}
                            </Badge>
                          </div>

                          <Separator className="my-4" />

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Pipeline</span>
                              <span className="font-medium">{formatCurrency(client.pipelineValue)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Close probability</span>
                              <span className="font-medium">{formatPercent(client.probability)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Users onboarded</span>
                              <span className="font-medium">{activeUsers.length} / {assignedUsers.length}</span>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {client.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <Card className="border-border/60">
                    <CardHeader>
                      <CardTitle>Client spotlight</CardTitle>
                      <CardDescription>
                        {selectedClient
                          ? `${selectedClient.ministry} • ${selectedClient.name}`
                          : 'Select a client to view details'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedClient ? (
                        <>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Pipeline value</p>
                              <p className="text-lg font-semibold">{formatCurrency(selectedClient.pipelineValue)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Close probability</p>
                              <p className="text-lg font-semibold">{formatPercent(selectedClient.probability)}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-muted-foreground">Next step</p>
                              <p className="font-medium text-foreground">{selectedClient.nextStep}</p>
                              <p className="text-sm text-muted-foreground">
                                Meeting: {formatDateTime(selectedClient.nextMeeting)} via Grace team
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" /> {selectedClient.location}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Target className="h-4 w-4" /> {selectedClient.leadSource}
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold">Team members</h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setChurchFilter(selectedClient.id)
                                  setActiveTab('users')
                                }}
                              >
                                Manage users
                                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                              </Button>
                            </div>
                            {clientUsers.length > 0 ? (
                              <div className="space-y-3">
                                {clientUsers.map((teamMember) => (
                                  <div
                                    key={teamMember.id}
                                    className="flex items-center justify-between rounded-lg border border-border/60 p-3"
                                  >
                                    <div>
                                      <p className="font-medium text-foreground">
                                        {teamMember.firstName} {teamMember.lastName}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {teamMember.title}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {teamMember.role}
                                      </Badge>
                                      <Badge variant={teamMember.status === 'ACTIVE' ? 'default' : 'outline'} className="text-xs">
                                        {teamMember.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                                No assigned users yet. Move a user into this ministry from the Users tab.
                              </div>
                            )}
                          </div>

                          <Separator />

                          <div className="text-sm">
                            <p className="text-muted-foreground">Notes</p>
                            <p>{selectedClient.notes}</p>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Choose a ministry to inspect pipeline details and assigned team members.
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-border/60">
                    <CardHeader>
                      <CardTitle>Upcoming appointments</CardTitle>
                      <CardDescription>Sales and success touch points</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {upcomingAppointments.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          There are no upcoming appointments.
                        </p>
                      ) : (
                        upcomingAppointments.map((appt) => {
                          const client = clients.find((item) => item.id === appt.clientId)
                          const owner = users.find((record) => record.id === appt.userId)

                          return (
                            <div
                              key={appt.id}
                              className="rounded-lg border border-border/60 p-3 text-sm"
                            >
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-foreground">{appt.title}</p>
                                <Badge variant="outline" className="text-xs">
                                  {appt.type}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground mt-1">
                                {client?.ministry ?? 'Unassigned'} • {formatDateTime(appt.scheduledFor)}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <span>Owner: {appt.owner}</span>
                                <span>•</span>
                                <span>With: {owner ? `${owner.firstName} ${owner.lastName}` : 'TBD'}</span>
                                <span>•</span>
                                <span>{appt.method}</span>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle>User directory</CardTitle>
                  <CardDescription>
                    Manage roles, permissions and ministry placement for every user
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Ministry</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last activity</TableHead>
                        <TableHead className="w-[140px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            No users match the current filters.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((record) => {
                          const currentClient = clients.find((client) => client.id === record.churchId)

                          return (
                            <TableRow key={record.id} className="hover:bg-muted/40">
                              <TableCell>
                                <div>
                                  <p className="font-medium text-foreground">
                                    {record.firstName} {record.lastName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{record.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={record.role}
                                  onValueChange={(value) => handleUserRoleChange(record.id, value as Role)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="STAFF">Staff</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="AGENCY">Agency</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={record.churchId}
                                  onValueChange={(value) => handleUserChurchChange(record.id, value)}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Select ministry" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {clients.map((client) => (
                                      <SelectItem key={client.id} value={client.id}>
                                        {client.ministry}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {currentClient ? currentClient.name : 'No ministry assigned'}
                                </p>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={record.status === 'ACTIVE'}
                                    onCheckedChange={(checked) => handleUserStatusToggle(record.id, checked)}
                                  />
                                  <Badge variant={record.status === 'ACTIVE' ? 'default' : 'outline'}>
                                    {record.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm text-muted-foreground">{formatDate(record.lastActivity)}</p>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedClientId(record.churchId)
                                      setActiveTab('sales')
                                    }}
                                  >
                                    View client
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <NotebookPen className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}
