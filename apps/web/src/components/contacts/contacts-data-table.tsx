'use client'

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Phone, Mail, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export type Contact = {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  status: 'LEAD' | 'ACTIVE' | 'INACTIVE'
  created_at: string
  role?: string
  avatar?: string
}

// Sample data for demo
const sampleContacts: Contact[] = [
  {
    id: "1",
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.johnson@gracechurch.com",
    phone: "(555) 123-4567",
    status: "ACTIVE",
    created_at: "2024-01-15",
    role: "Worship Leader",
    avatar: "SJ"
  },
  {
    id: "2",
    first_name: "Michael",
    last_name: "Chen",
    email: "m.chen@email.com",
    phone: "(555) 234-5678",
    status: "ACTIVE",
    created_at: "2024-01-10",
    role: "Youth Pastor",
    avatar: "MC"
  },
  {
    id: "3",
    first_name: "Emily",
    last_name: "Davis",
    email: "emily.d@outlook.com",
    phone: "(555) 345-6789",
    status: "LEAD",
    created_at: "2024-01-08",
    role: "Children's Ministry",
    avatar: "ED"
  },
  {
    id: "4",
    first_name: "Robert",
    last_name: "Martinez",
    email: "rob.martinez@gmail.com",
    phone: "(555) 456-7890",
    status: "ACTIVE",
    created_at: "2024-01-12",
    role: "Elder",
    avatar: "RM"
  },
  {
    id: "5",
    first_name: "Lisa",
    last_name: "Thompson",
    email: "lisa.t@church.com",
    phone: "(555) 567-8901",
    status: "INACTIVE",
    created_at: "2024-01-05",
    role: "Visitor",
    avatar: "LT"
  }
]

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

export const columns: ColumnDef<Contact>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const contact = row.original
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="text-xs">{contact.avatar || `${contact.first_name[0]}${contact.last_name[0]}`}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{contact.first_name} {contact.last_name}</div>
            {contact.role && (
              <div className="text-sm text-muted-foreground">{contact.role}</div>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "contact",
    header: "Contact Info",
    cell: ({ row }) => {
      const contact = row.original
      return (
        <div className="space-y-1">
          {contact.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span>{contact.phone}</span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge className={getStatusColor(status)}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Added
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"))
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const contact = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(contact.id)}
            >
              Copy contact ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View contact
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Phone className="mr-2 h-4 w-4" />
              Call contact
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface ContactsDataTableProps {
  data?: Contact[]
}

export function ContactsDataTable({ data = sampleContacts }: ContactsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full bg-background rounded-md">
      <div className="flex items-center py-4 px-4">
        <Input
          placeholder="Search contacts..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-background shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 transition-shadow duration-300">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-11">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 px-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
