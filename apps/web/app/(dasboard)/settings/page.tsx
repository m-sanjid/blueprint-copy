"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyMedia } from '@workspace/ui/components/empty'
import { User, Bell, Plug, CreditCard, BarChart3, FolderOpen, MessageSquare, Cloud, Check, Loader2 } from 'lucide-react'
import { PageHeader, type DataState } from '@/components/page/dashboard'
import { cn } from '@workspace/ui/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Container } from '@/components/core/container'
import { toast } from 'sonner'

// ============================================
// Types - Ready for backend integration
// ============================================

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  website: string
  avatarUrl?: string
}

interface NotificationSetting {
  id: string
  name: string
  description: string
  enabled: boolean
}

interface Integration {
  id: string
  name: string
  description: string
  status: 'connected' | 'disconnected'
  icon: 'chart' | 'folder' | 'message' | 'cloud'
}

interface BillingInfo {
  plan: string
  price: string
  renewalDate: string
  status: 'active' | 'cancelled' | 'past_due'
}

interface SettingsData {
  profile: ProfileData
  notifications: NotificationSetting[]
  integrations: Integration[]
  billing: BillingInfo
}

// ============================================
// API Functions - Replace with actual API calls
// ============================================

async function fetchSettings(): Promise<SettingsData> {
  // TODO: Replace with actual API call
  // return await fetch('/api/settings').then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 1500))
  return {
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@blueprint.com',
      phone: '+1 (555) 123-4567',
      company: 'Blueprint Tax Advisors',
      website: 'https://blueprint.com',
      avatarUrl: ''
    },
    notifications: [
      { id: 'email', name: 'Email Notifications', description: 'Receive email alerts for important updates', enabled: true },
      { id: 'push', name: 'Push Notifications', description: 'Get browser push notifications', enabled: true },
      { id: 'digest', name: 'Weekly Digest', description: 'Summary email every Monday', enabled: false },
      { id: 'clients', name: 'Client Updates', description: 'Notify when client data changes', enabled: true },
    ],
    integrations: [
      { id: 'quickbooks', name: 'QuickBooks', description: 'Accounting software', status: 'connected', icon: 'chart' },
      { id: 'dropbox', name: 'Dropbox', description: 'Document storage', status: 'connected', icon: 'folder' },
      { id: 'slack', name: 'Slack', description: 'Team communication', status: 'disconnected', icon: 'message' },
      { id: 'gdrive', name: 'Google Drive', description: 'Cloud storage', status: 'disconnected', icon: 'cloud' },
    ],
    billing: { plan: 'Professional Plan', price: '$99/month', renewalDate: 'Jan 15, 2025', status: 'active' }
  }
}

async function updateProfile(data: ProfileData): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  // return await fetch('/api/settings/profile', { method: 'PUT', body: JSON.stringify(data) }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 800))
  console.log('Updating profile:', data)
  return { success: true }
}

async function updateNotification(id: string, enabled: boolean): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  // return await fetch(`/api/settings/notifications/${id}`, { method: 'PATCH', body: JSON.stringify({ enabled }) }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log('Updating notification:', id, enabled)
  return { success: true }
}

async function toggleIntegration(id: string, action: 'connect' | 'disconnect'): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  // return await fetch(`/api/settings/integrations/${id}/${action}`, { method: 'POST' }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('Toggling integration:', id, action)
  return { success: true }
}

async function uploadAvatar(file: File): Promise<{ url: string }> {
  // TODO: Replace with actual API call
  // const formData = new FormData(); formData.append('file', file)
  // return await fetch('/api/settings/avatar', { method: 'POST', body: formData }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('Uploading avatar:', file.name)
  return { url: URL.createObjectURL(file) }
}

// ============================================
// Custom Hook
// ============================================

function useSettingsData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<SettingsData | null>(null)

  const refetch = useCallback(async () => {
    setState('loading')
    try {
      const result = await fetchSettings()
      setData(result)
      setState('data')
    } catch (error) {
      console.error('Failed to fetch settings:', error)
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

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

const integrationIcons = {
  chart: BarChart3,
  folder: FolderOpen,
  message: MessageSquare,
  cloud: Cloud,
}

// ============================================
// Component
// ============================================

export default function SettingsPage() {
  const { state, data, setData, refetch } = useSettingsData()
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [loadingIntegration, setLoadingIntegration] = useState<string | null>(null)

  // Form state for profile
  const [profileForm, setProfileForm] = useState<ProfileData | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize form when data loads
  useEffect(() => {
    if (data?.profile) {
      setProfileForm(data.profile)
      setHasChanges(false)
    }
  }, [data?.profile])

  const isLoading = state === 'loading'

  // ============================================
  // Handlers
  // ============================================

  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    if (!profileForm) return
    setProfileForm(prev => prev ? { ...prev, [field]: value } : null)
    setHasChanges(true)
  }

  const handleSaveProfile = async () => {
    if (!profileForm) return
    setIsSaving(true)
    try {
      const result = await updateProfile(profileForm)
      if (result.success) {
        setData(prev => prev ? { ...prev, profile: profileForm } : null)
        setHasChanges(false)
        toast.success('Profile updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update profile')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (data?.profile) {
      setProfileForm(data.profile)
      setHasChanges(false)
      toast.info('Changes discarded')
    }
  }

  const handleToggleNotification = async (id: string, currentEnabled: boolean) => {
    const newEnabled = !currentEnabled
    // Optimistic update
    setData(prev => prev ? {
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === id ? { ...n, enabled: newEnabled } : n
      )
    } : null)

    try {
      const result = await updateNotification(id, newEnabled)
      if (result.success) {
        toast.success(newEnabled ? 'Notification enabled' : 'Notification disabled')
      }
    } catch (error) {
      // Revert on error
      setData(prev => prev ? {
        ...prev,
        notifications: prev.notifications.map(n =>
          n.id === id ? { ...n, enabled: currentEnabled } : n
        )
      } : null)
      toast.error('Failed to update notification settings')
      console.error(error)
    }
  }

  const handleToggleIntegration = async (id: string, currentStatus: 'connected' | 'disconnected') => {
    const action = currentStatus === 'connected' ? 'disconnect' : 'connect'
    const newStatus = currentStatus === 'connected' ? 'disconnected' : 'connected'

    setLoadingIntegration(id)
    try {
      const result = await toggleIntegration(id, action)
      if (result.success) {
        setData(prev => prev ? {
          ...prev,
          integrations: prev.integrations.map(i =>
            i.id === id ? { ...i, status: newStatus } : i
          )
        } : null)
        toast.success(action === 'connect' ? 'Integration connected' : 'Integration disconnected')
      }
    } catch (error) {
      toast.error(`Failed to ${action} integration`)
      console.error(error)
    } finally {
      setLoadingIntegration(null)
    }
  }

  const handleAvatarChange = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/png,image/gif'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB')
        return
      }

      setIsSaving(true)
      try {
        const result = await uploadAvatar(file)
        setProfileForm(prev => prev ? { ...prev, avatarUrl: result.url } : null)
        setData(prev => prev ? { ...prev, profile: { ...prev.profile, avatarUrl: result.url } } : null)
        toast.success('Photo updated successfully')
      } catch (error) {
        toast.error('Failed to upload photo')
        console.error(error)
      } finally {
        setIsSaving(false)
      }
    }
    input.click()
  }

  const handleManageSubscription = () => {
    // TODO: Integrate with Stripe customer portal or billing provider
    toast.info('Redirecting to billing portal...')
    console.log('Opening billing portal')
  }

  const handleViewInvoices = () => {
    // TODO: Navigate to invoices page or open invoices modal
    toast.info('Loading invoice history...')
    console.log('Opening invoice history')
  }

  // ============================================
  // Render
  // ============================================

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account preferences" showSearch={false} />

      <Container className="space-y-3 py-8">
        {/* Horizontal Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-3">
          {activeTab === 'profile' && (
            <>
              <Card className="border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Profile Information</CardTitle>
                  <CardDescription>Update your personal details and photo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoading ? (
                    <>
                      <div className="flex items-center gap-5">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-9 w-28" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full rounded-md" />
                          </div>
                        ))}
                      </div>
                    </>
                  ) : !profileForm ? (
                    <Empty className="min-h-[200px]"><EmptyMedia variant="icon"><User className="h-8 w-8" /></EmptyMedia><EmptyHeader><EmptyTitle>No Profile</EmptyTitle></EmptyHeader></Empty>
                  ) : (
                    <>
                      <div className="flex items-center gap-5">
                        <Avatar className="h-20 w-20 border-2 border-border/40">
                          <AvatarImage src={profileForm.avatarUrl} />
                          <AvatarFallback className="text-xl bg-muted">{profileForm.firstName[0]}{profileForm.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <Button variant="outline" size="sm" onClick={handleAvatarChange} disabled={isSaving}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Change Photo
                          </Button>
                          <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">First Name</label>
                          <Input
                            value={profileForm.firstName}
                            onChange={(e) => handleProfileChange('firstName', e.target.value)}
                            className="bg-muted/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Last Name</label>
                          <Input
                            value={profileForm.lastName}
                            onChange={(e) => handleProfileChange('lastName', e.target.value)}
                            className="bg-muted/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            value={profileForm.email}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                            type="email"
                            className="bg-muted/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone</label>
                          <Input
                            value={profileForm.phone}
                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                            className="bg-muted/30"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Company Information</CardTitle>
                  <CardDescription>Your organization details</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                      ))}
                    </div>
                  ) : profileForm && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Company Name</label>
                        <Input
                          value={profileForm.company}
                          onChange={(e) => handleProfileChange('company', e.target.value)}
                          className="bg-muted/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Website</label>
                        <Input
                          value={profileForm.website}
                          onChange={(e) => handleProfileChange('website', e.target.value)}
                          className="bg-muted/30"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={handleCancel} disabled={!hasChanges || isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={!hasChanges || isSaving}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-36" />
                          <Skeleton className="h-3 w-56" />
                        </div>
                        <Skeleton className="h-6 w-11 rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : !data?.notifications.length ? (
                  <Empty className="min-h-[200px]"><EmptyMedia variant="icon"><Bell className="h-8 w-8" /></EmptyMedia><EmptyHeader><EmptyTitle>No Settings</EmptyTitle></EmptyHeader></Empty>
                ) : (
                  <div className="space-y-2">
                    {data.notifications.map((n) => (
                      <div key={n.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium">{n.name}</p>
                          <p className="text-xs text-muted-foreground">{n.description}</p>
                        </div>
                        <button
                          onClick={() => handleToggleNotification(n.id, n.enabled)}
                          className={cn(
                            "relative w-11 h-6 rounded-full transition-colors",
                            n.enabled ? "bg-emerald-500" : "bg-muted"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
                            n.enabled && "translate-x-5"
                          )} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'integrations' && (
            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Connected Apps</CardTitle>
                <CardDescription>Manage your third-party integrations</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1 space-y-1.5">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-8 w-24 rounded-md" />
                      </div>
                    ))}
                  </div>
                ) : !data?.integrations.length ? (
                  <Empty className="min-h-[200px]"><EmptyMedia variant="icon"><Plug className="h-8 w-8" /></EmptyMedia><EmptyHeader><EmptyTitle>No Integrations</EmptyTitle></EmptyHeader></Empty>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {data.integrations.map((integration) => {
                      const IconComponent = integrationIcons[integration.icon]
                      const isLoadingThis = loadingIntegration === integration.id
                      return (
                        <div key={integration.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className={cn(
                            "p-2.5 rounded-lg",
                            integration.status === 'connected' ? "bg-emerald-500/20 text-emerald-500" : "bg-muted text-muted-foreground"
                          )}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{integration.name}</p>
                              {integration.status === 'connected' && (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{integration.description}</p>
                          </div>
                          <Button
                            variant={integration.status === 'connected' ? 'outline' : 'default'}
                            size="sm"
                            className={integration.status === 'connected' ? "text-muted-foreground" : ""}
                            onClick={() => handleToggleIntegration(integration.id, integration.status)}
                            disabled={isLoadingThis}
                          >
                            {isLoadingThis ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                              integration.status === 'connected' ? 'Disconnect' : 'Connect'
                            )}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card className="border-border/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Billing & Subscription</CardTitle>
                <CardDescription>Manage your plan and payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1.5">
                          <Skeleton className="h-5 w-36" />
                          <Skeleton className="h-4 w-56" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Skeleton className="h-9 w-40 rounded-md" />
                      <Skeleton className="h-9 w-32 rounded-md" />
                    </div>
                  </>
                ) : !data ? (
                  <Empty className="min-h-[150px]"><EmptyMedia variant="icon"><CreditCard className="h-8 w-8" /></EmptyMedia><EmptyHeader><EmptyTitle>No Billing</EmptyTitle></EmptyHeader></Empty>
                ) : (
                  <>
                    <div className={cn(
                      "p-3 rounded-lg border",
                      data.billing.status === 'active'
                        ? "bg-emerald-500/10 border-emerald-500/20"
                        : data.billing.status === 'past_due'
                          ? "bg-orange-500/10 border-orange-500/20"
                          : "bg-muted/30 border-border/40"
                    )}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-lg">{data.billing.plan}</p>
                          <p className="text-sm text-muted-foreground">
                            {data.billing.price} • Renews {data.billing.renewalDate}
                          </p>
                        </div>
                        <Badge className={cn(
                          "uppercase text-xs",
                          data.billing.status === 'active'
                            ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                            : data.billing.status === 'past_due'
                              ? "bg-orange-500/20 text-orange-500 border-orange-500/30"
                              : "bg-muted text-muted-foreground"
                        )}>
                          {data.billing.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={handleManageSubscription}>
                        Manage Subscription
                      </Button>
                      <Button variant="outline" className="text-muted-foreground" onClick={handleViewInvoices}>
                        View Invoice History
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
    </>
  )
}
