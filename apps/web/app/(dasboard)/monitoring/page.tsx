"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@workspace/ui/components/chart'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { CheckCircle2, AlertTriangle, Cpu, HardDrive, Activity, Server, X } from 'lucide-react'
import { PageHeader, StatCard, type DataState } from '@/components/page/dashboard'
import { cn } from '@workspace/ui/lib/utils'
import { Container } from '@/components/core/container'
import { Button } from '@workspace/ui/components/button'

interface MonitoringData {
  stats: { systemsOperational: number; degraded: number; cpuUsage: string; storageUsed: string }
  performance: Array<{ time: string; success: number; memory: number }>
  documentsByType: Array<{ type: string; success: number; failed: number }>
  services: Array<{ id: string; name: string; status: 'operational' | 'degraded' | 'down'; uptime: string; latency: string }>
  alerts: Array<{ id: string; severity: 'warning' | 'error' | 'resolved'; title: string; timestamp: string; isResolved?: boolean }>
}

function useMonitoringData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<MonitoringData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setState('loading')
      await new Promise(resolve => setTimeout(resolve, 1500))
      setData({
        stats: { systemsOperational: 7, degraded: 1, cpuUsage: '23%', storageUsed: '1.2TB' },
        performance: [
          { time: '00:00', success: 96, memory: 92 }, { time: '04:00', success: 97, memory: 93 },
          { time: '08:00', success: 98, memory: 96 }, { time: '12:00', success: 97, memory: 94 },
          { time: '16:00', success: 95, memory: 93 }, { time: '20:00', success: 96, memory: 95 },
          { time: 'Now', success: 97, memory: 94 }
        ],
        documentsByType: [
          { type: '1120S', success: 245, failed: 12 }, { type: '1040', success: 189, failed: 8 },
          { type: 'K-1', success: 156, failed: 23 }, { type: 'W-2', success: 478, failed: 15 },
          { type: 'P&L', success: 134, failed: 9 }, { type: 'Other', success: 98, failed: 6 }
        ],
        services: [
          { id: '1', name: 'Document Pipeline', status: 'operational', uptime: '99.98%', latency: '245ms' },
          { id: '2', name: 'OCR Engine (Textract)', status: 'operational', uptime: '99.95%', latency: '1.2s' },
          { id: '3', name: 'OCR Engine (Vision)', status: 'operational', uptime: '99.92%', latency: '1.4s' },
          { id: '4', name: 'Strategy Engine', status: 'operational', uptime: '99.99%', latency: '89ms' },
          { id: '5', name: 'Quant Engine', status: 'operational', uptime: '99.99%', latency: '12ms' },
          { id: '6', name: 'Database (RDS)', status: 'operational', uptime: '99.99%', latency: '8ms' },
          { id: '7', name: 'Storage (S3)', status: 'operational', uptime: '99.99%', latency: '45ms' },
          { id: '8', name: 'AI Agents (OpenAI)', status: 'degraded', uptime: '99.85%', latency: '2.1s' },
        ],
        alerts: [
          { id: '1', severity: 'warning', title: 'OpenAI API latency elevated (>2s avg)', timestamp: '15 min ago' },
          { id: '2', severity: 'error', title: 'Failed OCR extraction for 3 documents', timestamp: '1 hour ago' },
          { id: '3', severity: 'resolved', title: 'Strategy Engine rules updated (v2.4.1)', timestamp: '3 hours ago', isResolved: true },
          { id: '4', severity: 'resolved', title: 'Low confidence batch: 12 K-1 documents', timestamp: '5 hours ago', isResolved: true },
        ]
      })
      setState('data')
    }
    fetchData()
  }, [])
  return { state, data }
}

const chartConfig = { success: { label: 'Success Rate', color: 'hsl(var(--chart-2))' }, memory: { label: 'Memory', color: 'hsl(var(--chart-1))' } }

export default function Monitoring() {
  const { state, data } = useMonitoringData()
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])
  const isLoading = state === 'loading'

  const handleServiceClick = (serviceId: string, serviceName: string) => {
    console.log('Service clicked:', serviceId)
    alert(`Service: ${serviceName}`)
  }

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId])
    console.log('Alert dismissed:', alertId)
  }

  const filteredAlerts = data?.alerts.filter(a => !dismissedAlerts.includes(a.id)) ?? []

  return (
    <>
      <PageHeader title="System Monitoring" subtitle="Platform health, performance, and alerts" />
      <Container className="space-y-3 py-8">

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard state={state} title="Systems Operational" value={data?.stats.systemsOperational} />
          <StatCard state={state} title="Degraded" value={data?.stats.degraded} />
          <StatCard state={state} title="CPU Usage" value={data?.stats.cpuUsage} />
          <StatCard state={state} title="Storage Used" value={data?.stats.storageUsed} />
        </div>

        {/* Charts Row */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader><CardTitle>System Performance</CardTitle><CardDescription>Success rate over last 24 hours</CardDescription></CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-[250px]" /> : (
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <AreaChart data={data?.performance}>
                    <defs>
                      <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} /></linearGradient>
                      <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                    <XAxis dataKey="time" tickLine={false} axisLine={false} className="text-xs" />
                    <YAxis tickLine={false} axisLine={false} className="text-xs" domain={[88, 100]} tickFormatter={(v) => `${v}%`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="success" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="url(#successGradient)" />
                    <Area type="monotone" dataKey="memory" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#memGradient)" />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader><CardTitle>Processing by Document Type</CardTitle><CardDescription>Success vs failed extractions</CardDescription></CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-[250px]" /> : (
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <BarChart data={data?.documentsByType}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                    <XAxis dataKey="type" tickLine={false} axisLine={false} className="text-xs" />
                    <YAxis tickLine={false} axisLine={false} className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="success" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="failed" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status and Alerts Row */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader><CardTitle>System Status</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div> : (
                <div className="space-y-2">
                  {data?.services.map((s) => (
                    <div key={s.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-2 w-2 rounded-full", s.status === 'operational' ? 'bg-green-500' : s.status === 'degraded' ? 'bg-orange-500' : 'bg-red-500')} />
                        <span className="text-sm">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{s.uptime} uptime</span>
                        <span className="w-16 text-right">{s.latency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader><CardTitle>Recent Alerts</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div> : (
                <div className="space-y-3">
                  {data?.alerts.map((a) => (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className={cn("p-1.5 rounded-full mt-0.5", a.severity === 'warning' ? 'bg-orange-500/20' : a.severity === 'error' ? 'bg-red-500/20' : 'bg-green-500/20')}>
                        <AlertTriangle className={cn("h-3 w-3", a.severity === 'warning' ? 'text-orange-400' : a.severity === 'error' ? 'text-red-400' : 'text-emerald-400')} />
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-sm", a.isResolved && "line-through text-muted-foreground")}>{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.timestamp}</p>
                      </div>
                      {a.isResolved && <span className="text-xs text-emerald-400">Resolved</span>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </>
  )
}
