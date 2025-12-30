"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { FileText, Brain, Bell, Users, Activity } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import type { DataState } from './stat-card'

export interface ActivityItem {
  id: string
  type: 'document' | 'strategy' | 'notification' | 'client'
  title: string
  description: string
  timestamp: string
}

export interface RecentActivityProps {
  data?: ActivityItem[]
  state?: DataState
  title?: string
  subtitle?: string
  className?: string
  // Legacy prop
  activities?: ActivityItem[]
}

const activityIcons = {
  document: { icon: FileText, className: 'bg-sky-500/20 text-sky-400' },
  strategy: { icon: Brain, className: 'bg-purple-500/20 text-purple-400' },
  notification: { icon: Bell, className: 'bg-yellow-500/20 text-yellow-400' },
  client: { icon: Users, className: 'bg-green-500/20 text-emerald-400' }
}

// Skeleton State
export function RecentActivitySkeleton({
  title = "Recent Activity",
  subtitle = "Platform events and notifications",
  className
}: {
  title?: string
  subtitle?: string
  className?: string
}) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-40 mb-1" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Empty State
export function RecentActivityEmpty({ title = "Recent Activity", className }: { title?: string; className?: string }) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <Empty className="min-h-[200px]">
          <EmptyMedia variant="icon"><Activity className="h-8 w-8" /></EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No Recent Activity</EmptyTitle>
            <EmptyDescription>Activity will appear here as you and your team interact with the platform.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}

// Main Component
export function RecentActivity({
  data,
  state = 'data',
  title = "Recent Activity",
  subtitle = "Platform events and notifications",
  className,
  activities: legacyActivities
}: RecentActivityProps) {
  const activities = data ?? legacyActivities ?? []

  if (state === 'loading') return <RecentActivitySkeleton title={title} subtitle={subtitle} className={className} />
  if (state === 'empty' || activities.length === 0) return <RecentActivityEmpty title={title} className={className} />

  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => {
            const config = activityIcons[activity.type]
            const IconComponent = config.icon
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg flex-shrink-0", config.className)}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{activity.timestamp}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
