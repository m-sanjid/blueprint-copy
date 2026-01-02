"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { PrimaryButton } from '@workspace/ui/components/primary-button'
import { IconUsers, IconBuilding, IconStar, IconDots, IconChevronRight, IconFilter, IconPlus, IconSearch, IconBriefcase, IconUser, IconTrash, IconPencil } from '@tabler/icons-react'
import { PageHeader, StatCard, type DataState } from '@/components/page/dashboard'
import { cn } from '@workspace/ui/lib/utils'
import { Container } from '@/components/core/container'
import { AddClientDialog, useAddClientDialog, type ClientFormData } from '@/components/dialogs'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog'

// ============================================
// Types - Ready for backend integration
// ============================================

interface Client {
  id: string
  name: string
  email: string
  phone: string
  entityType: 'S-Corp' | 'Individual' | 'Partnership' | 'C-Corp' | 'LLC'
  savings: number
  strategies: number
  documents: number
  status: 'Active' | 'Review' | 'Pending'
  lastActivity: string
  isVip: boolean
  address?: string
  city?: string
  state?: string
  zipCode?: string
  taxId?: string
  industry?: string
}

interface ClientsStats {
  totalClients: { value: number; change: number }
  totalSavings: { value: string; change: number }
  totalStrategies: { value: number; change: number }
  pendingReview: { value: number; change: number }
}

interface ClientsData {
  stats: ClientsStats
  clients: Client[]
}

// ============================================
// API Functions - Replace with actual API calls
// ============================================

async function fetchClients(): Promise<ClientsData> {
  // TODO: Replace with actual API call
  // return await fetch('/api/clients').then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 1500))
  return {
    stats: {
      totalClients: { value: 127, change: 12.5 },
      totalSavings: { value: '$9.26M', change: 25 },
      totalStrategies: { value: 342, change: -8.2 },
      pendingReview: { value: 12, change: 15 }
    },
    clients: [
      { id: '1', name: 'Johnson Holdings LLC', email: 'contact@johnsonholdings.com', phone: '(555) 123-4567', entityType: 'S-Corp', savings: 128000, strategies: 5, documents: 24, status: 'Active', lastActivity: '2 hours ago', isVip: true, city: 'New York', state: 'NY' },
      { id: '2', name: 'Dr. Sarah Chen', email: 'sarah.chen@email.com', phone: '(555) 234-5678', entityType: 'Individual', savings: 89000, strategies: 4, documents: 12, status: 'Active', lastActivity: '1 day ago', isVip: false, city: 'Los Angeles', state: 'CA' },
      { id: '3', name: 'Apex Medical Group', email: 'admin@apexmedical.com', phone: '(555) 345-6789', entityType: 'Partnership', savings: 234000, strategies: 7, documents: 56, status: 'Review', lastActivity: '4 hours ago', isVip: true, city: 'Chicago', state: 'IL' },
      { id: '4', name: 'Marcus Rivera', email: 'marcus.rivera@email.com', phone: '(555) 456-7890', entityType: 'Individual', savings: 46000, strategies: 3, documents: 8, status: 'Active', lastActivity: '3 days ago', isVip: false, city: 'Miami', state: 'FL' },
      { id: '5', name: 'Coastal Properties Inc', email: 'info@coastalproperties.com', phone: '(555) 567-8901', entityType: 'C-Corp', savings: 567000, strategies: 8, documents: 89, status: 'Pending', lastActivity: '6 hours ago', isVip: true, city: 'Seattle', state: 'WA' },
      { id: '6', name: 'Summit Consulting', email: 'hello@summitconsulting.com', phone: '(555) 678-9012', entityType: 'LLC', savings: 156000, strategies: 6, documents: 34, status: 'Active', lastActivity: '12 hours ago', isVip: false, city: 'Denver', state: 'CO' },
    ]
  }
}

async function createClient(data: ClientFormData): Promise<{ success: boolean; client: Client }> {
  // TODO: Replace with actual API call
  // return await fetch('/api/clients', { method: 'POST', body: JSON.stringify(data) }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 800))
  console.log('Creating client:', data)
  const newClient: Client = {
    id: Math.random().toString(36).substr(2, 9),
    name: data.name,
    email: data.email,
    phone: data.phone,
    entityType: data.entityType,
    savings: 0,
    strategies: 0,
    documents: 0,
    status: data.status,
    lastActivity: 'Just now',
    isVip: data.isVip,
    city: data.city,
    state: data.state,
  }
  return { success: true, client: newClient }
}

async function updateClient(id: string, data: Partial<ClientFormData>): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  // return await fetch(`/api/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 800))
  console.log('Updating client:', id, data)
  return { success: true }
}

async function deleteClient(id: string): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  // return await fetch(`/api/clients/${id}`, { method: 'DELETE' }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('Deleting client:', id)
  return { success: true }
}

// ============================================
// Custom Hook
// ============================================

function useClientsData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<ClientsData | null>(null)

  const refetch = useCallback(async () => {
    setState('loading')
    try {
      const result = await fetchClients()
      setData(result)
      setState('data')
    } catch (error) {
      console.error('Failed to fetch clients:', error)
      setState('empty')
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { state, data, setData, refetch }
}

// ============================================
// Constants
// ============================================

const statusConfig = {
  Active: { className: 'bg-green-500/10 text-emerald-400 border-green-500/20' },
  Review: { className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  Pending: { className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
}

const entityIcons: Record<string, React.ReactNode> = {
  'S-Corp': <IconBuilding className="h-5 w-5 text-emerald-400" />,
  'Individual': <IconUser className="h-5 w-5 text-sky-400" />,
  'Partnership': <IconUsers className="h-5 w-5 text-purple-400" />,
  'C-Corp': <IconBuilding className="h-5 w-5 text-yellow-400" />,
  'LLC': <IconBriefcase className="h-5 w-5 text-orange-400" />,
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
  if (value >= 1000) return `$${Math.round(value / 1000)}K`
  return `$${value}`
}

// ============================================
// Component
// ============================================

export default function Clients() {
  const { state, data, setData } = useClientsData()
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const addClientDialog = useAddClientDialog()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isLoading = state === 'loading'

  const filteredClients = data?.clients.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (typeFilter !== 'all' && c.entityType !== typeFilter) return false
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  }) ?? []

  // ============================================
  // Handlers
  // ============================================

  const handleAddClient = async (formData: ClientFormData) => {
    try {
      const result = await createClient(formData)
      if (result.success) {
        // Optimistically add to list
        setData(prev => prev ? {
          ...prev,
          clients: [result.client, ...prev.clients],
          stats: {
            ...prev.stats,
            totalClients: { ...prev.stats.totalClients, value: prev.stats.totalClients.value + 1 }
          }
        } : null)
        toast.success('Client created successfully!', {
          description: `${formData.name} has been added as a ${formData.entityType}.`
        })
      }
    } catch (error) {
      toast.error('Failed to create client')
      console.error(error)
    }
  }

  const handleEditClient = (client: Client) => {
    addClientDialog.openEditDialog({
      name: client.name,
      email: client.email,
      phone: client.phone,
      entityType: client.entityType,
      status: client.status,
      isVip: client.isVip,
      city: client.city,
      state: client.state,
    })
  }

  const handleUpdateClient = async (formData: ClientFormData) => {
    if (!addClientDialog.editData) return
    // Find the client being edited (would need to track the ID)
    toast.success('Client updated successfully!')
  }

  const handleDeleteClick = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation()
    setClientToDelete(client)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return
    setIsDeleting(true)
    try {
      const result = await deleteClient(clientToDelete.id)
      if (result.success) {
        setData(prev => prev ? {
          ...prev,
          clients: prev.clients.filter(c => c.id !== clientToDelete.id),
          stats: {
            ...prev.stats,
            totalClients: { ...prev.stats.totalClients, value: prev.stats.totalClients.value - 1 }
          }
        } : null)
        toast.success('Client deleted', {
          description: `${clientToDelete.name} has been removed.`
        })
      }
    } catch (error) {
      toast.error('Failed to delete client')
      console.error(error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setClientToDelete(null)
    }
  }

  const handleClientClick = (client: Client) => {
    // TODO: Navigate to client detail page
    toast.info(`Viewing ${client.name}`, {
      description: 'Client detail page coming soon!'
    })
  }

  const handleToggleVip = async (client: Client, e: React.MouseEvent) => {
    e.stopPropagation()
    const newVipStatus = !client.isVip

    // Optimistic update
    setData(prev => prev ? {
      ...prev,
      clients: prev.clients.map(c =>
        c.id === client.id ? { ...c, isVip: newVipStatus } : c
      )
    } : null)

    try {
      await updateClient(client.id, { isVip: newVipStatus })
      toast.success(newVipStatus ? 'Marked as VIP' : 'Removed VIP status')
    } catch (error) {
      // Revert on error
      setData(prev => prev ? {
        ...prev,
        clients: prev.clients.map(c =>
          c.id === client.id ? { ...c, isVip: !newVipStatus } : c
        )
      } : null)
      toast.error('Failed to update VIP status')
    }
  }

  // ============================================
  // Render
  // ============================================

  return (
    <>
      <AddClientDialog
        open={addClientDialog.open}
        onOpenChange={addClientDialog.setOpen}
        onSubmit={addClientDialog.editData ? handleUpdateClient : handleAddClient}
        mode={addClientDialog.editData ? 'edit' : 'create'}
        initialData={addClientDialog.editData}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {clientToDelete?.name}? This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PageHeader
        title="Clients"
        subtitle="CUPO profiles and client management"
        primaryAction={{ label: 'New Client', onClick: addClientDialog.openDialog, icon: <IconPlus className="h-4 w-4 mr-2" /> }}
      />

      <Container className="space-y-3 py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard state={state} title="Total Clients" value={data?.stats.totalClients.value} change={data?.stats.totalClients.change} />
          <StatCard state={state} title="Total Savings" value={data?.stats.totalSavings.value} change={data?.stats.totalSavings.change} />
          <StatCard state={state} title="Active Strategies" value={data?.stats.totalStrategies.value} change={data?.stats.totalStrategies.change} />
          <StatCard state={state} title="Pending Review" value={data?.stats.pendingReview.value} change={data?.stats.pendingReview.change} />
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 flex-wrap pb-2">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-9 bg-card/50 border-border/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2 border-border/30">
            <IconFilter className="h-4 w-4" />Filters
          </Button>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 border-border/30 bg-card/50">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32 border-border/30 bg-card/50">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="S-Corp">S-Corp</SelectItem>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Partnership">Partnership</SelectItem>
              <SelectItem value="C-Corp">C-Corp</SelectItem>
              <SelectItem value="LLC">LLC</SelectItem>
            </SelectContent>
          </Select>
          <PrimaryButton className="gap-2" onClick={addClientDialog.openDialog}>
            <IconPlus className="h-4 w-4" />Add Client
          </PrimaryButton>
        </div>

        {/* Client Cards */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="group relative overflow-hidden rounded-lg pt-4 pb-2 border border-border/40 bg-card/60 backdrop-blur">
                <CardContent className="px-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="mt-1 h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="rounded-md flex flex-col items-center justify-center bg-muted/40 px-1 py-1 text-center">
                        <Skeleton className="h-4 w-10 mb-1" />
                        <Skeleton className="h-2.5 w-12" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-border/30 pt-1">
                    <Skeleton className="h-3 w-16" />
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-4 w-4 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredClients.length === 0 ? (
          <Card className="border-border/40">
            <CardContent className="py-12">
              <Empty>
                <EmptyMedia variant="icon">
                  <IconUsers className="h-8 w-8" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No Clients Found</EmptyTitle>
                  <EmptyDescription>
                    {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                      ? 'Try adjusting your filters or search query.'
                      : 'Get started by adding your first client.'}
                  </EmptyDescription>
                </EmptyHeader>
                <PrimaryButton onClick={addClientDialog.openDialog} className="mt-4">
                  <IconPlus className="h-4 w-4 mr-2" />Add Client
                </PrimaryButton>
              </Empty>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <Card
                key={client.id}
                onClick={() => handleClientClick(client)}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-lg pt-4 pb-2",
                  "border border-border/40 bg-card/60 backdrop-blur",
                  "transition-all duration-200",
                  "hover:-translate-y-0.5 hover:border-border/70 hover:shadow-lg hover:shadow-black/5"
                )}
              >
                <CardContent className="px-3 space-y-2">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="flex items-center gap-1.5 text-sm font-semibold leading-none">
                          {client.name}
                          {client.isVip && (
                            <IconStar className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                          )}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {client.entityType}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-[11px] font-medium", statusConfig[client.status].className)}>
                      {client.status}
                    </Badge>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-1">
                    <div className="rounded-md flex flex-col items-center justify-center bg-muted/40 px-1 py-1 text-center">
                      <p className="text-sm font-semibold text-emerald-500">{formatCurrency(client.savings)}</p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Savings</p>
                    </div>
                    <div className="rounded-md flex flex-col items-center justify-center bg-muted/40 px-1 py-1 text-center">
                      <p className="text-sm font-semibold">{client.strategies}</p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Strategies</p>
                    </div>
                    <div className="rounded-md flex flex-col items-center justify-center bg-muted/40 px-1 py-1 text-center">
                      <p className="text-sm font-semibold">{client.documents}</p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Docs</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-border/30 pt-1">
                    <span className="text-xs text-muted-foreground">{client.lastActivity}</span>
                    <div className="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 opacity-0 transition-all group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <IconDots className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditClient(client) }}>
                            <IconPencil className="h-4 w-4 mr-2" />Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleToggleVip(client, e)}>
                            <IconStar className="h-4 w-4 mr-2" />
                            {client.isVip ? 'Remove VIP' : 'Mark as VIP'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteClick(client, e)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <IconTrash className="h-4 w-4 mr-2" />Delete Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <IconChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
