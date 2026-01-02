"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { Map, Calendar, CheckCircle2, Clock, AlertCircle, Plus, MoreVertical, Trash2, Edit, Play, Pause } from 'lucide-react'
import { PageHeader, StatCard, type DataState } from '@/components/page/dashboard'
import { cn } from '@workspace/ui/lib/utils'
import { Container } from '@/components/core/container'
import { AddRoadmapDialog, useAddRoadmapDialog, type RoadmapFormData } from '@/components/dialogs'
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
import { PrimaryButton } from '@workspace/ui/components/primary-button'

// ============================================
// Types - Ready for backend integration
// ============================================

interface Milestone {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'completed' | 'in-progress' | 'upcoming' | 'overdue'
  tasks: { completed: number; total: number }
}

interface Roadmap {
  id: string
  name: string
  client: string
  progress: number
  startDate: string
  endDate: string
  status: 'on-track' | 'at-risk' | 'delayed'
  milestones: Milestone[]
}

interface RoadmapStats {
  activeRoadmaps: { value: number; change: number }
  milestonesCompleted: { value: number; change: number }
  onTrackRate: { value: string; change: number }
  overdueTasks: { value: number; change: number }
}

interface RoadmapData {
  stats: RoadmapStats
  roadmaps: Roadmap[]
}

// ============================================
// API Functions - Replace with actual API calls
// ============================================

async function fetchRoadmaps(): Promise<RoadmapData> {
  // TODO: Replace with actual API call
  // return await fetch('/api/roadmaps').then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 1500))
  return {
    stats: { activeRoadmaps: { value: 12, change: 3 }, milestonesCompleted: { value: 47, change: 15 }, onTrackRate: { value: '83%', change: 5 }, overdueTasks: { value: 3, change: -2 } },
    roadmaps: [
      {
        id: '1', name: 'Q4 Tax Optimization', client: 'Johnson Holdings LLC', progress: 65, startDate: 'Oct 1, 2024', endDate: 'Dec 31, 2024', status: 'on-track',
        milestones: [
          { id: '1', title: 'Entity Structure Review', description: 'Complete analysis', dueDate: 'Oct 15', status: 'completed', tasks: { completed: 4, total: 4 } },
          { id: '2', title: 'Strategy Implementation', description: 'Implement strategies', dueDate: 'Nov 15', status: 'in-progress', tasks: { completed: 3, total: 6 } },
          { id: '3', title: 'Documentation', description: 'Prepare docs', dueDate: 'Dec 15', status: 'upcoming', tasks: { completed: 0, total: 5 } },
          { id: '4', title: 'Year-End Review', description: 'Final review', dueDate: 'Dec 31', status: 'upcoming', tasks: { completed: 0, total: 3 } },
        ]
      },
      {
        id: '2', name: 'Estate Planning Timeline', client: 'Rivera Family Trust', progress: 40, startDate: 'Sep 1, 2024', endDate: 'Mar 31, 2025', status: 'at-risk',
        milestones: [
          { id: '1', title: 'Asset Inventory', description: 'Complete inventory', dueDate: 'Sep 30', status: 'completed', tasks: { completed: 5, total: 5 } },
          { id: '2', title: 'Trust Structure Design', description: 'Design structure', dueDate: 'Nov 30', status: 'overdue', tasks: { completed: 2, total: 4 } },
        ]
      },
    ]
  }
}

async function createRoadmap(data: RoadmapFormData): Promise<{ success: boolean; roadmap: Roadmap }> {
  // TODO: Replace with actual API call
  // return await fetch('/api/roadmaps', { method: 'POST', body: JSON.stringify(data) }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 800))
  console.log('Creating roadmap:', data)
  const newRoadmap: Roadmap = {
    id: Math.random().toString(36).substr(2, 9),
    name: data.name,
    client: data.client,
    progress: 0,
    startDate: data.startDate,
    endDate: data.endDate,
    status: 'on-track',
    milestones: []
  }
  return { success: true, roadmap: newRoadmap }
}

async function deleteRoadmap(id: string): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  // return await fetch(`/api/roadmaps/${id}`, { method: 'DELETE' }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('Deleting roadmap:', id)
  return { success: true }
}

async function updateMilestoneStatus(roadmapId: string, milestoneId: string, status: Milestone['status']): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  // return await fetch(`/api/roadmaps/${roadmapId}/milestones/${milestoneId}`, { method: 'PATCH', body: JSON.stringify({ status }) }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('Updating milestone status:', { roadmapId, milestoneId, status })
  return { success: true }
}

// ============================================
// Custom Hook
// ============================================

function useRoadmapData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<RoadmapData | null>(null)

  const refetch = useCallback(async () => {
    setState('loading')
    try {
      const result = await fetchRoadmaps()
      setData(result)
      setState('data')
    } catch (error) {
      console.error('Failed to fetch roadmaps:', error)
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
  'completed': { icon: CheckCircle2, label: 'Completed', className: 'text-emerald-400 bg-green-500/20 border-green-500/30' },
  'in-progress': { icon: Clock, label: 'In Progress', className: 'text-sky-400 bg-sky-500/20 border-sky-500/30' },
  'upcoming': { icon: Calendar, label: 'Upcoming', className: 'text-muted-foreground bg-muted border-border' },
  'overdue': { icon: AlertCircle, label: 'Overdue', className: 'text-red-400 bg-red-500/20 border-red-500/30' },
}

const roadmapStatusConfig = {
  'on-track': { className: 'bg-green-500/20 text-emerald-400 border-green-500/30' },
  'at-risk': { className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  'delayed': { className: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

// ============================================
// Component
// ============================================

export default function Roadmaps() {
  const { state, data, setData } = useRoadmapData()
  const addRoadmapDialog = useAddRoadmapDialog()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roadmapToDelete, setRoadmapToDelete] = useState<Roadmap | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const isLoading = state === 'loading'

  // ============================================
  // Handlers
  // ============================================

  const handleAddRoadmap = async (formData: RoadmapFormData) => {
    try {
      const result = await createRoadmap(formData)
      if (result.success) {
        setData(prev => prev ? {
          ...prev,
          roadmaps: [result.roadmap, ...prev.roadmaps],
          stats: {
            ...prev.stats,
            activeRoadmaps: { ...prev.stats.activeRoadmaps, value: prev.stats.activeRoadmaps.value + 1 }
          }
        } : null)
        toast.success('Roadmap created', {
          description: `"${formData.name}" has been added.`
        })
      }
    } catch (error) {
      toast.error('Failed to create roadmap')
      console.error(error)
    }
  }

  const handleDeleteClick = (roadmap: Roadmap, e: React.MouseEvent) => {
    e.stopPropagation()
    setRoadmapToDelete(roadmap)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!roadmapToDelete) return
    setIsDeleting(true)
    try {
      const result = await deleteRoadmap(roadmapToDelete.id)
      if (result.success) {
        setData(prev => prev ? {
          ...prev,
          roadmaps: prev.roadmaps.filter(r => r.id !== roadmapToDelete.id),
          stats: {
            ...prev.stats,
            activeRoadmaps: { ...prev.stats.activeRoadmaps, value: prev.stats.activeRoadmaps.value - 1 }
          }
        } : null)
        toast.success('Roadmap deleted', {
          description: `"${roadmapToDelete.name}" has been removed.`
        })
      }
    } catch (error) {
      toast.error('Failed to delete roadmap')
      console.error(error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setRoadmapToDelete(null)
    }
  }

  const handleMilestoneClick = async (roadmapId: string, milestone: Milestone, e: React.MouseEvent) => {
    e.stopPropagation()

    // Determine next status
    const nextStatus: Record<Milestone['status'], Milestone['status']> = {
      'upcoming': 'in-progress',
      'in-progress': 'completed',
      'completed': 'completed',
      'overdue': 'in-progress'
    }
    const newStatus = nextStatus[milestone.status]

    if (newStatus === milestone.status) {
      toast.info(`${milestone.title}`, {
        description: `Status: ${statusConfig[milestone.status].label}`
      })
      return
    }

    // Optimistic update
    setData(prev => prev ? {
      ...prev,
      roadmaps: prev.roadmaps.map(r => r.id === roadmapId ? {
        ...r,
        milestones: r.milestones.map(m => m.id === milestone.id ? { ...m, status: newStatus } : m)
      } : r)
    } : null)

    try {
      const result = await updateMilestoneStatus(roadmapId, milestone.id, newStatus)
      if (result.success) {
        toast.success(`Milestone updated`, {
          description: `"${milestone.title}" is now ${statusConfig[newStatus].label.toLowerCase()}.`
        })
      }
    } catch (error) {
      // Revert on error
      setData(prev => prev ? {
        ...prev,
        roadmaps: prev.roadmaps.map(r => r.id === roadmapId ? {
          ...r,
          milestones: r.milestones.map(m => m.id === milestone.id ? { ...m, status: milestone.status } : m)
        } : r)
      } : null)
      toast.error('Failed to update milestone')
      console.error(error)
    }
  }

  const handleRoadmapClick = (roadmap: Roadmap) => {
    toast.info(`Viewing: ${roadmap.name}`, {
      description: 'Roadmap detail page coming soon!'
    })
  }

  const handleEditRoadmap = (roadmap: Roadmap, e: React.MouseEvent) => {
    e.stopPropagation()
    toast.info(`Editing: ${roadmap.name}`, {
      description: 'Edit functionality coming soon!'
    })
  }

  // ============================================
  // Render
  // ============================================

  return (
    <>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Roadmap</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{roadmapToDelete?.name}"? This will also delete all associated milestones and cannot be undone.
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

      <AddRoadmapDialog
        open={addRoadmapDialog.open}
        onOpenChange={addRoadmapDialog.setOpen}
        onSubmit={handleAddRoadmap}
      />

      <PageHeader
        title="Roadmaps"
        subtitle="Tax planning timelines and milestones"
        primaryAction={{ label: 'New Roadmap', onClick: addRoadmapDialog.openDialog, icon: <Plus className="h-4 w-4 mr-2" /> }}
      />

      <Container className="space-y-3 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard state={state} title="Active Roadmaps" value={data?.stats.activeRoadmaps.value} change={data?.stats.activeRoadmaps.change} />
          <StatCard state={state} title="Milestones Completed" value={data?.stats.milestonesCompleted.value} change={data?.stats.milestonesCompleted.change} />
          <StatCard state={state} title="On-Track Rate" value={data?.stats.onTrackRate.value} change={data?.stats.onTrackRate.change} />
          <StatCard state={state} title="Overdue Tasks" value={data?.stats.overdueTasks.value} change={data?.stats.overdueTasks.change} />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="border border-border/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="text-right space-y-1">
                      <Skeleton className="h-8 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="mt-1 h-2 w-full rounded-full" />
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="p-2 rounded-lg border border-border/40">
                        <div className="flex items-start justify-between mb-1">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                        <Skeleton className="h-4 w-32 mb-0.5" />
                        <Skeleton className="h-3 w-24 mb-2" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-4 w-16 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !data?.roadmaps.length ? (
          <Card className="border-border/40">
            <CardContent className="py-12">
              <Empty>
                <EmptyMedia variant="icon"><Map className="h-8 w-8" /></EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No Roadmaps</EmptyTitle>
                  <EmptyDescription>Create a roadmap to start planning tax strategies.</EmptyDescription>
                </EmptyHeader>
                <PrimaryButton onClick={addRoadmapDialog.openDialog} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />New Roadmap
                </PrimaryButton>
              </Empty>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {data.roadmaps.map((roadmap) => (
              <Card
                key={roadmap.id}
                className="border cursor-pointer hover:border-border/60 transition-all group"
                onClick={() => handleRoadmapClick(roadmap)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <CardTitle>{roadmap.name}</CardTitle>
                        <Badge variant="outline" className={roadmapStatusConfig[roadmap.status].className}>
                          {roadmap.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <CardDescription>{roadmap.client} • {roadmap.startDate} - {roadmap.endDate}</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{roadmap.progress}%</p>
                        <p className="text-xs text-muted-foreground">complete</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => handleEditRoadmap(roadmap, e)}>
                            <Edit className="h-4 w-4 mr-2" />Edit Roadmap
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Add milestone coming soon!') }}>
                            <Plus className="h-4 w-4 mr-2" />Add Milestone
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteClick(roadmap, e)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />Delete Roadmap
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${roadmap.progress}%` }} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {roadmap.milestones.map((m) => {
                      const config = statusConfig[m.status]
                      const StatusIcon = config.icon
                      return (
                        <div
                          key={m.id}
                          className="p-3 rounded-lg border border-border/30 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={(e) => handleMilestoneClick(roadmap.id, m, e)}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <StatusIcon className={cn("h-4 w-4", config.className.split(' ')[0])} />
                            <span className="text-xs text-muted-foreground">{m.dueDate}</span>
                          </div>
                          <h4 className="font-medium text-sm mb-0.5">{m.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{m.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{m.tasks.completed}/{m.tasks.total} tasks</span>
                            <Badge variant="outline" className={cn("text-[10px]", config.className)}>{config.label}</Badge>
                          </div>
                        </div>
                      )
                    })}
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
