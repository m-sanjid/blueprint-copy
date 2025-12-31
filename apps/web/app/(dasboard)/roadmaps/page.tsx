"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { Map, Target, Calendar, CheckCircle2, Clock, AlertCircle, Plus } from 'lucide-react'
import { PageHeader, StatCard, type DataState } from '@/components/page/dashboard'
import { cn } from '@workspace/ui/lib/utils'
import { Container } from '@/components/core/container'
import { AddRoadmapDialog, useAddRoadmapDialog, type RoadmapFormData } from '@/components/dialogs'

interface Milestone {
  id: string; title: string; description: string; dueDate: string
  status: 'completed' | 'in-progress' | 'upcoming' | 'overdue'
  tasks: { completed: number; total: number }
}

interface Roadmap {
  id: string; name: string; client: string; progress: number
  startDate: string; endDate: string; status: 'on-track' | 'at-risk' | 'delayed'
  milestones: Milestone[]
}

interface RoadmapData {
  stats: { activeRoadmaps: { value: number; change: number }; milestonesCompleted: { value: number; change: number }; onTrackRate: { value: string; change: number }; overdueTasks: { value: number; change: number } }
  roadmaps: Roadmap[]
}

function useRoadmapData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<RoadmapData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setState('loading')
      await new Promise(resolve => setTimeout(resolve, 1500))
      setData({
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
      })
      setState('data')
    }
    fetchData()
  }, [])
  return { state, data }
}

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

export default function Roadmaps() {
  const { state, data } = useRoadmapData()
  const addRoadmapDialog = useAddRoadmapDialog()
  const isLoading = state === 'loading'

  const handleAddRoadmap = async (formData: RoadmapFormData) => {
    console.log('Creating roadmap:', formData)
    alert(`Roadmap "${formData.name}" created successfully!`)
  }

  const handleMilestoneClick = (roadmapId: string, milestoneId: string, title: string) => {
    console.log('Milestone clicked:', { roadmapId, milestoneId, title })
    alert(`Milestone: ${title}`)
  }

  const handleRoadmapClick = (roadmapId: string, name: string) => {
    console.log('Viewing roadmap:', roadmapId)
    alert(`Viewing roadmap: ${name}`)
  }

  return (
    <>
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
          <Card className="border-border/30">
            <CardContent>
              <Empty className="min-h-[300px]">
                <EmptyMedia variant="icon"><Map className="h-8 w-8" /></EmptyMedia>
                <EmptyHeader><EmptyTitle>No Roadmaps</EmptyTitle><EmptyDescription>Create a roadmap to start planning tax strategies.</EmptyDescription></EmptyHeader>
              </Empty>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {data.roadmaps.map((roadmap) => (
              <Card
                key={roadmap.id}
                className="border cursor-pointer hover:border-border/60 transition-all"
                onClick={() => handleRoadmapClick(roadmap.id, roadmap.name)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3"><CardTitle>{roadmap.name}</CardTitle><Badge variant="outline" className={roadmapStatusConfig[roadmap.status].className}>{roadmap.status.replace('-', ' ')}</Badge></div>
                      <CardDescription>{roadmap.client} • {roadmap.startDate} - {roadmap.endDate}</CardDescription>
                    </div>
                    <div className="text-right"><p className="text-2xl font-bold">{roadmap.progress}%</p><p className="text-xs text-muted-foreground">complete</p></div>
                  </div>
                  <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${roadmap.progress}%` }} /></div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {roadmap.milestones.map((m) => {
                      const config = statusConfig[m.status]
                      const StatusIcon = config.icon
                      return (
                        <div
                          key={m.id}
                          className="p-2 rounded-lg border border-border/30 bg-neutral-100 dark:bg-neutral-950 backdrop-blur-md hover:bg-accent/30 transition-colors cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); handleMilestoneClick(roadmap.id, m.id, m.title) }}
                        >
                          <div className="flex items-start justify-between mb-1"><StatusIcon className={cn("h-4 w-4", config.className.split(' ')[0])} /><span className="text-xs text-muted-foreground">{m.dueDate}</span></div>
                          <h4 className="font-medium text-sm mb-0.5">{m.title}</h4>
                          <p className="text-xs text-muted-foreground mb-0.5">{m.description}</p>
                          <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{m.tasks.completed}/{m.tasks.total} tasks</span><Badge variant="outline" className={cn("text-[10px]", config.className)}>{config.label}</Badge></div>
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
