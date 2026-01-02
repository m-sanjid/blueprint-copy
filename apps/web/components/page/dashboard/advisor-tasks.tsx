"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { Flag, ChevronRight, ListTodo } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import type { DataState } from './stat-card'

export interface Task {
  id: string
  title: string
  client?: string
  dueDate: string
  priority: boolean
  completed?: boolean
}

export interface AdvisorTasksProps {
  data?: Task[]
  state?: DataState
  pendingCount?: number
  title?: string
  subtitle?: string
  onViewAll?: () => void
  onTaskToggle?: (taskId: string, completed: boolean) => void
  className?: string
  // Legacy prop
  tasks?: Task[]
}

// Skeleton State
export function AdvisorTasksSkeleton({
  title = "Advisor Tasks",
  subtitle = "Pending reviews and actions",
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
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-48 mb-1" />
                <Skeleton className="h-3 w-32" />
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
export function AdvisorTasksEmpty({
  title = "Advisor Tasks",
  className
}: {
  title?: string
  className?: string
}) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Empty className="min-h-[200px]">
          <EmptyMedia variant="icon">
            <ListTodo className="h-8 w-8" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No Tasks</EmptyTitle>
            <EmptyDescription>
              You&apos;re all caught up! New tasks will appear here when actions are needed.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}

// Main Component
export function AdvisorTasks({
  data,
  state = 'data',
  pendingCount,
  title = "Advisor Tasks",
  subtitle = "Pending reviews and actions",
  onViewAll,
  onTaskToggle,
  className,
  tasks: legacyTasks
}: AdvisorTasksProps) {
  const tasks = data ?? legacyTasks ?? []

  // Loading State
  if (state === 'loading') {
    return <AdvisorTasksSkeleton title={title} subtitle={subtitle} className={className} />
  }

  // Empty State
  if (state === 'empty' || tasks.length === 0) {
    return <AdvisorTasksEmpty title={title} className={className} />
  }

  // Calculate pending count if not provided
  const displayPendingCount = pendingCount ?? tasks.filter(t => !t.completed).length

  // Data State
  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
          {displayPendingCount > 0 && (
            <Badge variant="default" className="bg-green-500/20 text-emerald-400 border-green-500/30">
              {displayPendingCount} pending
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 group cursor-pointer">
              <div
                className={cn(
                  "h-4 w-4 rounded-full border-2 shrink-0",
                  task.completed ? "bg-green-500 border-green-500" : "border-muted-foreground/40"
                )}
                onClick={() => onTaskToggle?.(task.id, !task.completed)}
              />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate",
                  task.completed && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </p>
                {task.client && (
                  <p className="text-xs text-muted-foreground truncate">{task.client}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                {task.priority && <Flag className="h-3 w-3 text-red-400" />}
              </div>
            </div>
          ))}
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="mt-4 text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            View All Tasks
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </CardContent>
    </Card>
  )
}
