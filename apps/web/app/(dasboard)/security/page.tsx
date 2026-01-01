"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { Shield, Lock, Key, Users, AlertTriangle, CheckCircle2, LogIn, Eye } from 'lucide-react'
import { PageHeader, StatCard, type DataState } from '@/components/page/dashboard'
import { cn } from '@workspace/ui/lib/utils'
import { Container } from '@/components/core/container'

interface SecurityData {
  stats: { securityScore: { value: string; change: number }; activeSessions: number; failedLogins: { value: number; change: number }; apiKeys: number }
  settings: Array<{ id: string; name: string; description: string; enabled: boolean }>
  accessLogs: Array<{ id: string; user: string; action: string; resource: string; ip: string; timestamp: string; status: 'success' | 'failed' }>
  permissions: Array<{ role: string; users: number; permissions: string[] }>
}

function useSecurityData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<SecurityData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setState('loading')
      await new Promise(resolve => setTimeout(resolve, 1500))
      setData({
        stats: { securityScore: { value: '94/100', change: 3 }, activeSessions: 23, failedLogins: { value: 3, change: -5 }, apiKeys: 8 },
        settings: [
          { id: '1', name: 'Two-Factor Authentication', description: 'Require MFA for all users', enabled: true },
          { id: '2', name: 'Session Timeout', description: 'Auto-logout after 30 minutes', enabled: true },
          { id: '3', name: 'IP Whitelisting', description: 'Restrict access to approved IPs', enabled: false },
          { id: '4', name: 'Audit Logging', description: 'Log all user actions', enabled: true },
        ],
        accessLogs: [
          { id: '1', user: 'John Smith', action: 'login', resource: 'Dashboard', ip: '192.168.1.45', timestamp: '2 min ago', status: 'success' },
          { id: '2', user: 'Sarah Chen', action: 'view', resource: 'Client: Johnson Holdings', ip: '192.168.1.102', timestamp: '5 min ago', status: 'success' },
          { id: '3', user: 'Unknown', action: 'login', resource: 'Dashboard', ip: '45.33.32.156', timestamp: '15 min ago', status: 'failed' },
        ],
        permissions: [
          { role: 'Admin', users: 3, permissions: ['Full Access', 'User Management', 'Billing'] },
          { role: 'Tax Advisor', users: 12, permissions: ['View Clients', 'Manage Documents', 'Reports'] },
          { role: 'Analyst', users: 8, permissions: ['View Clients', 'View Documents'] },
          { role: 'Viewer', users: 15, permissions: ['View Dashboard'] },
        ]
      })
      setState('data')
    }
    fetchData()
  }, [])
  return { state, data }
}

export default function Security() {
  const { state, data } = useSecurityData()
  const isLoading = state === 'loading'

  return (
    <>
      <PageHeader title="Security" subtitle="Access control and audit logs" primaryAction={{ label: 'Security Audit', onClick: () => { }, icon: <Shield className="h-4 w-4 mr-2" /> }} />

      <Container className="space-y-3 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard state={state} title="Security Score" value={data?.stats.securityScore.value} change={data?.stats.securityScore.change} changeLabel="improved" />
          <StatCard state={state} title="Active Sessions" value={data?.stats.activeSessions} />
          <StatCard state={state} title="Failed Logins" value={data?.stats.failedLogins.value} change={data?.stats.failedLogins.change} changeLabel="reduced" />
          <StatCard state={state} title="API Keys" value={data?.stats.apiKeys} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/40">
            <CardHeader><CardTitle>Security Settings</CardTitle><CardDescription>Configure security policies</CardDescription></CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/40">
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-56" />
                      </div>
                      <Skeleton className="h-5 w-10 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : !data?.settings.length ? (
                <Empty className="min-h-[200px]"><EmptyMedia variant="icon"><Lock className="h-8 w-8" /></EmptyMedia><EmptyHeader><EmptyTitle>No Settings</EmptyTitle></EmptyHeader></Empty>
              ) : (
                <div className="space-y-3">{data.settings.map((s) => <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40"><div><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.description}</p></div><div className={cn("w-10 h-5 rounded-full p-0.5 cursor-pointer", s.enabled ? "bg-green-500" : "bg-muted")}><div className={cn("h-4 w-4 rounded-full bg-white transition-transform", s.enabled && "translate-x-5")} /></div></div>)}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader><CardTitle>Access Logs</CardTitle><CardDescription>Recent activity</CardDescription></CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/40">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </div>
              ) : !data?.accessLogs.length ? (
                <Empty className="min-h-[200px]"><EmptyMedia variant="icon"><Eye className="h-8 w-8" /></EmptyMedia><EmptyHeader><EmptyTitle>No Logs</EmptyTitle></EmptyHeader></Empty>
              ) : (
                <div className="space-y-3">{data.accessLogs.map((log) => <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/40"><div className={cn("p-2 rounded-lg", log.status === 'success' ? "bg-green-500/20" : "bg-red-500/20")}><LogIn className={cn("h-4 w-4", log.status === 'success' ? "text-emerald-400" : "text-red-400")} /></div><div className="flex-1"><p className="text-sm font-medium">{log.user}</p><p className="text-xs text-muted-foreground">{log.action}: {log.resource}</p></div><span className="text-xs text-muted-foreground">{log.timestamp}</span></div>)}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/40">
          <CardHeader><CardTitle>Role Permissions</CardTitle><CardDescription>User roles and access levels</CardDescription></CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border border-border/40">
                    <div className="flex justify-between mb-3">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-8 rounded-full" />
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="flex items-center gap-2">
                          <Skeleton className="h-3 w-3 rounded" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : !data?.permissions.length ? (
              <Empty className="min-h-[150px]"><EmptyMedia variant="icon"><Users className="h-8 w-8" /></EmptyMedia><EmptyHeader><EmptyTitle>No Roles</EmptyTitle></EmptyHeader></Empty>
            ) : (
              <div className="grid gap-4 md:grid-cols-4">{data.permissions.map((role) => <div key={role.role} className="p-4 rounded-lg border border-border/40"><div className="flex justify-between mb-3"><h4 className="font-medium">{role.role}</h4><Badge variant="outline">{role.users}</Badge></div><div className="space-y-1">{role.permissions.map((p) => <div key={p} className="flex items-center gap-2 text-xs"><CheckCircle2 className="h-3 w-3 text-emerald-400" /><span className="text-muted-foreground">{p}</span></div>)}</div></div>)}</div>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
