"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { PrimaryButton } from '@workspace/ui/components/primary-button'
import { IconUsers, IconBuilding, IconStar, IconDots, IconChevronRight, IconFilter, IconPlus, IconSearch, IconBriefcase, IconUser } from '@tabler/icons-react'
import { PageHeader, StatCard, type DataState } from '@/components/page/dashboard'
import { cn } from '@workspace/ui/lib/utils'
import { Container } from '@/components/core/container'
import { AddClientDialog, useAddClientDialog, type ClientFormData } from '@/components/dialogs'
import { toast } from 'sonner'

interface Client {
  id: string
  name: string
  entityType: 'S-Corp' | 'Individual' | 'Partnership' | 'C-Corp' | 'LLC'
  savings: number
  strategies: number
  documents: number
  status: 'Active' | 'Review' | 'Pending'
  lastActivity: string
  isVip?: boolean
}

interface ClientsData {
  stats: {
    totalClients: { value: number; change: number }
    totalSavings: { value: string; change: number }
    totalStrategies: { value: number; change: number }
    pendingReview: { value: number; change: number }
  }
  clients: Client[]
}

function useClientsData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<ClientsData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setState('loading')
      await new Promise(resolve => setTimeout(resolve, 1500))
      setData({
        stats: {
          totalClients: { value: 127, change: 12.5 },
          totalSavings: { value: '$9.26M', change: 25 },
          totalStrategies: { value: 342, change: -8.2 },
          pendingReview: { value: 12, change: 15 }
        },
        clients: [
          { id: '1', name: 'Johnson Holdings LLC', entityType: 'S-Corp', savings: 128000, strategies: 5, documents: 24, status: 'Active', lastActivity: '2 hours ago', isVip: true },
          { id: '2', name: 'Dr. Sarah Chen', entityType: 'Individual', savings: 89000, strategies: 4, documents: 12, status: 'Active', lastActivity: '1 day ago' },
          { id: '3', name: 'Apex Medical Group', entityType: 'Partnership', savings: 234000, strategies: 7, documents: 56, status: 'Review', lastActivity: '4 hours ago', isVip: true },
          { id: '4', name: 'Marcus Rivera', entityType: 'Individual', savings: 46000, strategies: 3, documents: 8, status: 'Active', lastActivity: '3 days ago' },
          { id: '5', name: 'Coastal Properties Inc', entityType: 'C-Corp', savings: 567000, strategies: 8, documents: 89, status: 'Pending', lastActivity: '6 hours ago', isVip: true },
          { id: '6', name: 'Summit Consulting', entityType: 'LLC', savings: 156000, strategies: 6, documents: 34, status: 'Active', lastActivity: '12 hours ago' },
        ]
      })
      setState('data')
    }
    fetchData()
  }, [])
  return { state, data }
}

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

export default function Clients() {
  const router = useRouter()
  const { state, data } = useClientsData()
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const addClientDialog = useAddClientDialog()
  const isLoading = state === 'loading'

  const filteredClients = data?.clients.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (typeFilter !== 'all' && c.entityType !== typeFilter) return false
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  }) ?? []

  const handleAddClient = async (formData: ClientFormData) => {
    // TODO: Replace with actual API call
    console.log('Adding client:', formData)
    toast.success('Client added successfully!', {
      description: `${formData.name} has been added as a ${formData.entityType}.`
    })
  }

  const handleClientClick = (clientId: string) => {
    // TODO: Navigate to client detail page
    console.log('Navigating to client:', clientId)
    toast.info('Client detail page coming soon!')
  }

  const handleViewMore = (clientId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('View more options for client:', clientId)
  }

  return (
    <>
      <AddClientDialog
        open={addClientDialog.open}
        onOpenChange={addClientDialog.setOpen}
        onSubmit={handleAddClient}
      />

      <PageHeader
        title="Clients"
        subtitle="CUPO profiles and client management"
        primaryAction={{ label: 'New Client', onClick: addClientDialog.openDialog, icon: <IconPlus className="h-4 w-4 mr-2" /> }}
      />
      <Container className="space-y-3 py-8">

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            state={state}
            title="Total Clients"
            value={data?.stats.totalClients.value}
            change={data?.stats.totalClients.change}
          />
          <StatCard
            state={state}
            title="Total Savings"
            value={data?.stats.totalSavings.value}
            change={data?.stats.totalSavings.change}
          />
          <StatCard
            state={state}
            title="Active Strategies"
            value={data?.stats.totalStrategies.value}
            change={data?.stats.totalStrategies.change}
          />
          <StatCard
            state={state}
            title="Pending Review"
            value={data?.stats.pendingReview.value}
            change={data?.stats.pendingReview.change}
          />
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
              <Card
                key={i}
                className={cn(
                  "group relative overflow-hidden rounded-lg pt-4 pb-2",
                  "border border-border/40 bg-card/60 backdrop-blur"
                )}
              >
                <CardContent className="px-3 space-y-2">
                  {/* Header Skeleton */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="mt-1 h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>

                  {/* Metrics Skeleton */}
                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="rounded-md flex flex-col items-center justify-center bg-muted/40 px-1 py-1 text-center"
                      >
                        <Skeleton className="h-4 w-10 mb-1" />
                        <Skeleton className="h-2.5 w-12" />
                      </div>
                    ))}
                  </div>

                  {/* Footer Skeleton */}
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className={cn(
                  "group relative overflow-hidden rounded-lg pt-4 pb-2",
                  "border border-border/40 bg-card/60 backdrop-blur"
                )}
              >
                <CardContent className="px-3 space-y-2">
                  {/* Header Empty */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="h-5 w-32 rounded bg-muted/20" />
                        <div className="mt-1 h-5 w-16 rounded bg-muted/20" />
                      </div>
                    </div>
                    <div className="h-5 w-14 rounded-full bg-muted/20" />
                  </div>

                  {/* Metrics Empty */}
                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="rounded-md flex flex-col items-center justify-center bg-muted/20 px-1 py-1 text-center h-10"
                      />
                    ))}
                  </div>

                  {/* Footer Empty */}
                  <div className="flex items-center justify-between border-t border-border/30 pt-1">
                    <div className="h-3 w-16 rounded bg-muted/20" />
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 rounded bg-muted/20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {/* Empty message overlay */}
            <div className="absolute inset-0 flex items-center justify-center col-span-full">
              <Empty className="bg-background/80 backdrop-blur-sm rounded-lg p-8">
                <EmptyMedia variant="icon">
                  <IconUsers className="h-8 w-8" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No Clients Found</EmptyTitle>
                  <EmptyDescription>Try adjusting your filters or add a new client.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <Card
                key={client.id}
                onClick={() => handleClientClick(client.id)}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-lg pt-4 pb-2",
                  "border border-border/40 bg-card/60 backdrop-blur",
                  "transition-all duration-200",
                  "hover:-translate-y-0.5 hover:border-border/70 hover:shadow-lg hover:shadow-black/5"
                )}
              >
                <CardContent className="px-3 space-y-2">
                  {/* ================= Header ================= */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">

                      {/* Name + Meta */}
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

                    {/* Status */}
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[11px] font-medium",
                        statusConfig[client.status].className
                      )}
                    >
                      {client.status}
                    </Badge>
                  </div>

                  {/* ================= Metrics ================= */}
                  <div className="grid grid-cols-3 gap-1">
                    {/* Savings */}
                    <div className="rounded-md flex flex-col items-center justify-center bg-muted/40 px-1 py-1 text-center">
                      <p className="text-sm font-semibold text-emerald-500">
                        {formatCurrency(client.savings)}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Savings
                      </p>
                    </div>

                    {/* Strategies */}
                    <div className="rounded-md flex flex-col items-center justify-center bg-muted/40 px-1 py-1 text-center">
                      <p className="text-sm font-semibold">{client.strategies}</p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Strategies
                      </p>
                    </div>

                    {/* Documents */}
                    <div className="rounded-md flex flex-col items-center justify-center bg-muted/40 px-1 py-1 text-center">
                      <p className="text-sm font-semibold">{client.documents}</p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Docs
                      </p>
                    </div>
                  </div>

                  {/* ================= Footer ================= */}
                  <div className="flex items-center justify-between border-t border-border/30 pt-1">
                    <span className="text-xs text-muted-foreground">
                      {client.lastActivity}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Actions */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 opacity-0 transition-all group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info(`Actions for ${client.name}`);
                        }}
                      >
                        <IconDots className="h-4 w-4" />
                      </Button>

                      {/* Navigate */}
                      <IconChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

            ))}
          </div>
        )}

        <AddClientDialog open={addClientDialog.open} onOpenChange={addClientDialog.setOpen} onSubmit={handleAddClient} />
      </Container>
    </>
  )
}
