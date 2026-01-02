"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { Star, TrendingUp, ChevronRight, Users } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import type { DataState } from './stat-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'

export interface Client {
  id: string
  name: string
  avatar?: string
  entityType: string
  strategiesCount: number
  estimatedSavings: number
  status: 'active' | 'review' | 'pending'
  isVip?: boolean
}

export interface ActiveClientsProps {
  data?: Client[]
  state?: DataState
  title?: string
  subtitle?: string
  filterValue?: string
  onFilterChange?: (value: string) => void
  onViewAll?: () => void
  onClientClick?: (client: Client) => void
  className?: string
  // Legacy prop
  clients?: Client[]
}

const statusConfig = {
  active: { label: 'Active', className: 'bg-green-500/20 text-emerald-400 border-green-500/30' },
  review: { label: 'Review', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  pending: { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' }
}

function formatCurrency(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
  return `$${value}`
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Skeleton State
export function ActiveClientsSkeleton({
  title = "Active Clients",
  subtitle = "CUPO profiles with opportunities",
  className
}: {
  title?: string
  subtitle?: string
  className?: string
}) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
          <Skeleton className="h-8 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-40 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-3" />
                <Skeleton className="h-4 w-14" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Empty State
export function ActiveClientsEmpty({ title = "Active Clients", className }: { title?: string; className?: string }) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <Empty className="min-h-[200px]">
          <EmptyMedia variant="icon"><Users className="h-8 w-8" /></EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No Clients</EmptyTitle>
            <EmptyDescription>Add clients to start tracking opportunities and savings.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}

// Main Component
export function ActiveClients({
  data,
  state = 'data',
  title = "Active Clients",
  subtitle = "CUPO profiles with opportunities",
  filterValue = "all",
  onFilterChange,
  onViewAll,
  onClientClick,
  className,
  clients: legacyClients
}: ActiveClientsProps) {
  const clients = data ?? legacyClients ?? []

  if (state === 'loading') return <ActiveClientsSkeleton title={title} subtitle={subtitle} className={className} />
  if (state === 'empty' || clients.length === 0) return <ActiveClientsEmpty title={title} className={className} />

  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div><CardTitle>{title}</CardTitle><CardDescription>{subtitle}</CardDescription></div>
          <Select value={filterValue} onValueChange={onFilterChange}>
            <SelectTrigger className="w-32"><SelectValue placeholder="All Clients" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="vip">VIP Clients</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="review">Needs Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {clients.map((client) => {
            const config = statusConfig[client.status]
            return (
              <div
                key={client.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-accent/30 transition-colors cursor-pointer group"
                onClick={() => onClientClick?.(client)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={client.avatar} alt={client.name} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-sm">{getInitials(client.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{client.name}</p>
                    {client.isVip && <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{client.entityType} • {client.strategiesCount} strategies</p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                  <span className="font-medium">{formatCurrency(client.estimatedSavings)}</span>
                  <span className="text-xs text-muted-foreground">est. savings</span>
                </div>
                <Badge variant="outline" className={cn("shrink-0", config.className)}>{config.label}</Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )
          })}
        </div>
        {onViewAll && <button onClick={onViewAll} className="mt-4 text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">View All Clients →</button>}
      </CardContent>
    </Card>
  )
}

