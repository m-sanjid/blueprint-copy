"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyMedia } from '@workspace/ui/components/empty'
import { Shield, Lock, Key, Users, CheckCircle2, LogIn, Eye, Plus, Trash2, RefreshCw } from 'lucide-react'
import { PageHeader, StatCard, type DataState } from '@/components/page/dashboard'
import { cn } from '@workspace/ui/lib/utils'
import { Container } from '@/components/core/container'
import { toast } from 'sonner'
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

interface SecuritySetting {
  id: string
  name: string
  description: string
  enabled: boolean
}

interface AccessLog {
  id: string
  user: string
  action: string
  resource: string
  ip: string
  timestamp: string
  status: 'success' | 'failed'
}

interface RolePermission {
  role: string
  users: number
  permissions: string[]
}

interface SecurityStats {
  securityScore: { value: string; change: number }
  activeSessions: number
  failedLogins: { value: number; change: number }
  apiKeys: number
}

interface SecurityData {
  stats: SecurityStats
  settings: SecuritySetting[]
  accessLogs: AccessLog[]
  permissions: RolePermission[]
}

// ============================================
// API Functions - Replace with actual API calls
// ============================================

async function fetchSecurityData(): Promise<SecurityData> {
  // TODO: Replace with actual API call
  // return await fetch('/api/security').then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 1500))
  return {
    stats: { securityScore: { value: '94/100', change: 3 }, activeSessions: 23, failedLogins: { value: 3, change: -5 }, apiKeys: 8 },
    settings: [
      { id: 'mfa', name: 'Two-Factor Authentication', description: 'Require MFA for all users', enabled: true },
      { id: 'timeout', name: 'Session Timeout', description: 'Auto-logout after 30 minutes', enabled: true },
      { id: 'ip-whitelist', name: 'IP Whitelisting', description: 'Restrict access to approved IPs', enabled: false },
      { id: 'audit', name: 'Audit Logging', description: 'Log all user actions', enabled: true },
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
  }
}

async function updateSecuritySetting(id: string, enabled: boolean): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  // return await fetch(`/api/security/settings/${id}`, { method: 'PATCH', body: JSON.stringify({ enabled }) }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('Updating security setting:', id, enabled)
  return { success: true }
}

async function terminateSessions(): Promise<{ success: boolean; count: number }> {
  // TODO: Replace with actual API call
  // return await fetch('/api/security/sessions/terminate-all', { method: 'POST' }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 800))
  return { success: true, count: 22 }
}

async function generateApiKey(): Promise<{ success: boolean; key: string }> {
  // TODO: Replace with actual API call
  // return await fetch('/api/security/api-keys', { method: 'POST' }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 600))
  return { success: true, key: 'bp_sk_' + Math.random().toString(36).substr(2, 32) }
}

async function runSecurityAudit(): Promise<{ success: boolean; score: number; issues: number }> {
  // TODO: Replace with actual API call
  // return await fetch('/api/security/audit', { method: 'POST' }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 2000))
  return { success: true, score: 96, issues: 2 }
}

async function blockIp(ip: string): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  // return await fetch('/api/security/blocked-ips', { method: 'POST', body: JSON.stringify({ ip }) }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('Blocking IP:', ip)
  return { success: true }
}

// ============================================
// Custom Hook
// ============================================

function useSecurityData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<SecurityData | null>(null)

  const refetch = useCallback(async () => {
    setState('loading')
    try {
      const result = await fetchSecurityData()
      setData(result)
      setState('data')
    } catch (error) {
      console.error('Failed to fetch security data:', error)
      setState('empty')
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { state, data, setData, refetch }
}

// ============================================
// Component
// ============================================

export default function Security() {
  const { state, data, setData, refetch } = useSecurityData()
  const [isAuditing, setIsAuditing] = useState(false)
  const [terminateDialogOpen, setTerminateDialogOpen] = useState(false)
  const [isTerminating, setIsTerminating] = useState(false)

  const isLoading = state === 'loading'

  // ============================================
  // Handlers
  // ============================================

  const handleToggleSetting = async (id: string, currentEnabled: boolean) => {
    const newEnabled = !currentEnabled

    // Optimistic update
    setData(prev => prev ? {
      ...prev,
      settings: prev.settings.map(s =>
        s.id === id ? { ...s, enabled: newEnabled } : s
      )
    } : null)

    try {
      const result = await updateSecuritySetting(id, newEnabled)
      if (result.success) {
        const setting = data?.settings.find(s => s.id === id)
        toast.success(`${setting?.name} ${newEnabled ? 'enabled' : 'disabled'}`)
      }
    } catch (error) {
      // Revert on error
      setData(prev => prev ? {
        ...prev,
        settings: prev.settings.map(s =>
          s.id === id ? { ...s, enabled: currentEnabled } : s
        )
      } : null)
      toast.error('Failed to update setting')
      console.error(error)
    }
  }

  const handleRunAudit = async () => {
    setIsAuditing(true)
    toast.info('Running security audit...', { duration: 2000 })

    try {
      const result = await runSecurityAudit()
      if (result.success) {
        setData(prev => prev ? {
          ...prev,
          stats: {
            ...prev.stats,
            securityScore: { value: `${result.score}/100`, change: result.score - 94 }
          }
        } : null)
        toast.success(`Security audit complete`, {
          description: `Score: ${result.score}/100. ${result.issues} issues found.`
        })
      }
    } catch (error) {
      toast.error('Security audit failed')
      console.error(error)
    } finally {
      setIsAuditing(false)
    }
  }

  const handleTerminateSessions = async () => {
    setIsTerminating(true)
    try {
      const result = await terminateSessions()
      if (result.success) {
        setData(prev => prev ? {
          ...prev,
          stats: { ...prev.stats, activeSessions: 1 }
        } : null)
        toast.success(`${result.count} sessions terminated`, {
          description: 'Only your current session remains active.'
        })
      }
    } catch (error) {
      toast.error('Failed to terminate sessions')
      console.error(error)
    } finally {
      setIsTerminating(false)
      setTerminateDialogOpen(false)
    }
  }

  const handleGenerateApiKey = async () => {
    try {
      const result = await generateApiKey()
      if (result.success) {
        setData(prev => prev ? {
          ...prev,
          stats: { ...prev.stats, apiKeys: prev.stats.apiKeys + 1 }
        } : null)
        toast.success('API Key generated', {
          description: 'Key copied to clipboard.',
          action: {
            label: 'View',
            onClick: () => toast.info(`Key: ${result.key.substring(0, 20)}...`)
          }
        })
        navigator.clipboard.writeText(result.key)
      }
    } catch (error) {
      toast.error('Failed to generate API key')
      console.error(error)
    }
  }

  const handleBlockIp = async (log: AccessLog) => {
    try {
      const result = await blockIp(log.ip)
      if (result.success) {
        setData(prev => prev ? {
          ...prev,
          accessLogs: prev.accessLogs.filter(l => l.id !== log.id)
        } : null)
        toast.success(`IP ${log.ip} blocked`, {
          description: 'This IP will no longer be able to access the system.'
        })
      }
    } catch (error) {
      toast.error('Failed to block IP')
      console.error(error)
    }
  }

  const handleViewRole = (role: string) => {
    toast.info(`Managing ${role} role`, {
      description: 'Role management page coming soon!'
    })
  }

  // ============================================
  // Render
  // ============================================

  return (
    <>
      <AlertDialog open={terminateDialogOpen} onOpenChange={setTerminateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate All Sessions</AlertDialogTitle>
            <AlertDialogDescription>
              This will log out all users except your current session. Users will need to sign in again to access the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isTerminating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTerminateSessions}
              disabled={isTerminating}
              className="bg-red-500 hover:bg-red-600"
            >
              {isTerminating ? 'Terminating...' : 'Terminate All'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PageHeader
        title="Security"
        subtitle="Access control and audit logs"
        primaryAction={{
          label: isAuditing ? 'Running...' : 'Security Audit',
          onClick: handleRunAudit,
          icon: isAuditing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />
        }}
      />

      <Container className="space-y-3 py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard state={state} title="Security Score" value={data?.stats.securityScore.value} change={data?.stats.securityScore.change} changeLabel="improved" />
          <div onClick={() => setTerminateDialogOpen(true)} className="cursor-pointer">
            <StatCard state={state} title="Active Sessions" value={data?.stats.activeSessions} />
          </div>
          <StatCard state={state} title="Failed Logins" value={data?.stats.failedLogins.value} change={data?.stats.failedLogins.change} changeLabel="reduced" />
          <div onClick={handleGenerateApiKey} className="cursor-pointer">
            <StatCard state={state} title="API Keys" value={data?.stats.apiKeys} />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Security Settings */}
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Security Settings</CardTitle>
              <CardDescription>Configure security policies</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-56" />
                      </div>
                      <Skeleton className="h-6 w-11 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : !data?.settings.length ? (
                <Empty className="min-h-[200px]"><EmptyMedia variant="icon"><Lock className="h-8 w-8" /></EmptyMedia><EmptyHeader><EmptyTitle>No Settings</EmptyTitle></EmptyHeader></Empty>
              ) : (
                <div className="space-y-2">
                  {data.settings.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.description}</p>
                      </div>
                      <button
                        onClick={() => handleToggleSetting(s.id, s.enabled)}
                        className={cn(
                          "relative w-11 h-6 rounded-full transition-colors",
                          s.enabled ? "bg-emerald-500" : "bg-muted"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
                          s.enabled && "translate-x-5"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Access Logs */}
          <Card className="border-border/40">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Access Logs</CardTitle>
                  <CardDescription>Recent activity</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={refetch}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
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
                <div className="space-y-2">
                  {data.accessLogs.map((log) => (
                    <div key={log.id} className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group">
                      <div className={cn("p-2 rounded-lg", log.status === 'success' ? "bg-emerald-500/20" : "bg-red-500/20")}>
                        <LogIn className={cn("h-4 w-4", log.status === 'success' ? "text-emerald-400" : "text-red-400")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{log.user}</p>
                        <p className="text-xs text-muted-foreground truncate">{log.action}: {log.resource}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                        {log.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500"
                            onClick={() => handleBlockIp(log)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Role Permissions */}
        <Card className="border-border/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Role Permissions</CardTitle>
                <CardDescription>User roles and access levels</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />Add Role
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid gap-3 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/30">
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
              <div className="grid gap-3 md:grid-cols-4">
                {data.permissions.map((role) => (
                  <div
                    key={role.role}
                    className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewRole(role.role)}
                  >
                    <div className="flex justify-between mb-3">
                      <h4 className="font-medium">{role.role}</h4>
                      <Badge variant="outline">{role.users}</Badge>
                    </div>
                    <div className="space-y-1">
                      {role.permissions.map((p) => (
                        <div key={p} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span className="text-muted-foreground">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
