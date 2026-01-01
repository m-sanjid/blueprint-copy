"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyMedia } from '@workspace/ui/components/empty'
import { User, Bell, Plug, CreditCard, BarChart3, FolderOpen, MessageSquare, Cloud, Check } from 'lucide-react'
import { PageHeader, type DataState } from '@/components/page/dashboard'
import { cn } from '@workspace/ui/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Container } from '@/components/core/container'

interface SettingsData {
  profile: { firstName: string; lastName: string; email: string; phone: string; company: string; website: string }
  notifications: Array<{ id: string; name: string; description: string; enabled: boolean }>
  integrations: Array<{ id: string; name: string; description: string; status: 'connected' | 'disconnected'; icon: 'chart' | 'folder' | 'message' | 'cloud' }>
  billing: { plan: string; price: string; renewalDate: string; status: 'active' | 'cancelled' }
}

function useSettingsData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<SettingsData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setState('loading')
      await new Promise(resolve => setTimeout(resolve, 1500))
      setData({
        profile: { firstName: 'John', lastName: 'Doe', email: 'john@blueprint.com', phone: '+1 (555) 123-4567', company: 'Blueprint Tax Advisors', website: 'https://blueprint.com' },
        notifications: [
          { id: '1', name: 'Email Notifications', description: 'Receive email alerts for important updates', enabled: true },
          { id: '2', name: 'Push Notifications', description: 'Get browser push notifications', enabled: true },
          { id: '3', name: 'Weekly Digest', description: 'Summary email every Monday', enabled: false },
          { id: '4', name: 'Client Updates', description: 'Notify when client data changes', enabled: true },
        ],
        integrations: [
          { id: '1', name: 'QuickBooks', description: 'Accounting software', status: 'connected', icon: 'chart' },
          { id: '2', name: 'Dropbox', description: 'Document storage', status: 'connected', icon: 'folder' },
          { id: '3', name: 'Slack', description: 'Team communication', status: 'disconnected', icon: 'message' },
          { id: '4', name: 'Google Drive', description: 'Cloud storage', status: 'disconnected', icon: 'cloud' },
        ],
        billing: { plan: 'Professional Plan', price: '$99/month', renewalDate: 'Jan 15, 2025', status: 'active' }
      })
      setState('data')
    }
    fetchData()
  }, [])
  return { state, data }
}

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

export default function SettingsPage() {
  const { state, data } = useSettingsData()
  const [activeTab, setActiveTab] = useState('profile')
  const isLoading = state === 'loading'

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
                  ) : !data ? (
                    <Empty className="min-h-[200px]"><EmptyMedia variant="icon"><User className="h-8 w-8" /></EmptyMedia><EmptyHeader><EmptyTitle>No Profile</EmptyTitle></EmptyHeader></Empty>
                  ) : (
                    <>
                      <div className="flex items-center gap-5">
                        <Avatar className="h-20 w-20 border-2 border-border/40">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-xl bg-muted">{data.profile.firstName[0]}{data.profile.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <Button variant="outline" size="sm">Change Photo</Button>
                          <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">First Name</label>
                          <Input defaultValue={data.profile.firstName} className="bg-muted/30" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Last Name</label>
                          <Input defaultValue={data.profile.lastName} className="bg-muted/30" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input defaultValue={data.profile.email} type="email" className="bg-muted/30" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone</label>
                          <Input defaultValue={data.profile.phone} className="bg-muted/30" />
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
                  ) : data && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Company Name</label>
                        <Input defaultValue={data.profile.company} className="bg-muted/30" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Website</label>
                        <Input defaultValue={data.profile.website} className="bg-muted/30" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
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
                          >
                            {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
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
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-lg">{data.billing.plan}</p>
                          <p className="text-sm text-muted-foreground">
                            {data.billing.price} • Renews {data.billing.renewalDate}
                          </p>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 uppercase text-xs">
                          {data.billing.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline">Manage Subscription</Button>
                      <Button variant="outline" className="text-muted-foreground">View Invoice History</Button>
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
