"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Users, DollarSign, FileText, Brain, RefreshCw } from 'lucide-react'
import {
  PageHeader,
  StatCard,
  StrategyHeatmap,
  SavingsChart,
  AdvisorTasks,
  DocumentPipeline,
  ActiveClients,
  RecentActivity,
  type DataState,
  type StrategyItem,
  type SavingsDataPoint,
  type Task,
  type PipelineDocument,
  type Client,
  type ActivityItem
} from '@/components/page/dashboard'
import { Container } from '@/components/core/container'
import { IconPlus } from '@tabler/icons-react'
import { AddClientDialog, useAddClientDialog, type ClientFormData } from '@/components/dialogs'
import { toast } from 'sonner'

// ============================================================================
// API Types - Ready for backend integration
// ============================================================================
interface DashboardData {
  stats: {
    activeClients: { value: number; change: number }
    totalSavings: { value: string; change: number }
    documentsProcessed: { value: string; change: number }
    strategiesActive: { value: number; change: number }
  }
  strategies: StrategyItem[]
  savingsChart: { points: SavingsDataPoint[]; totalSavings: number }
  tasks: Task[]
  documents: PipelineDocument[]
  clients: Client[]
  activities: ActivityItem[]
}

// ============================================================================
// API Functions - Replace with actual API calls
// ============================================================================
async function fetchDashboardData(): Promise<DashboardData> {
  // TODO: Replace with actual API call
  // return await fetch('/api/dashboard').then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 1500))
  return generateMockData()
}

async function updateTaskStatus(taskId: string, completed: boolean): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  // return await fetch(`/api/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify({ completed }) }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log('Updating task:', taskId, completed)
  return { success: true }
}

async function createClient(data: ClientFormData): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 800))
  console.log('Creating client from dashboard:', data)
  return { success: true }
}

// ============================================================================
// Custom Hook for Data Fetching
// ============================================================================
function useDashboardData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setState('loading')
    try {
      const result = await fetchDashboardData()
      setData(result)
      setState('data')
    } catch (err) {
      setError(err as Error)
      setState('empty')
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { state, data, setData, error, refetch }
}

// ============================================================================
// Mock Data Generator - Remove when connecting to backend
// ============================================================================
function generateMockData(): DashboardData {
  return {
    stats: {
      activeClients: { value: 127, change: 12 },
      totalSavings: { value: '$3.08M', change: 23 },
      documentsProcessed: { value: '1,847', change: 8 },
      strategiesActive: { value: 342, change: 15 }
    },
    strategies: [
      { id: '1', category: 'Rental Income', title: 'Augusta Rule', savings: 892000, clients: 45, confidence: 'high' },
      { id: '2', category: 'Employment', title: 'Hire Your Kids', savings: 456000, clients: 32, confidence: 'high' },
      { id: '3', category: 'Depreciation', title: 'Section 179', savings: 1240000, clients: 58, confidence: 'medium' },
      { id: '4', category: 'Compensation', title: 'Officer Salary Optimization', savings: 678000, clients: 41, confidence: 'high' },
      { id: '5', category: 'Real Estate', title: 'Cost Segregation', savings: 2100000, clients: 23, confidence: 'high' },
      { id: '6', category: 'Retirement', title: 'Retirement Plan Stacking', savings: 1890000, clients: 67, confidence: 'medium' },
      { id: '7', category: 'Reimbursement', title: 'Accountable Plan', savings: 445000, clients: 89, confidence: 'high' },
      { id: '8', category: 'Deductions', title: 'Home Office Deduction', savings: 336000, clients: 112, confidence: 'low' },
    ],
    savingsChart: {
      points: [
        { month: 'Jul', savings: 250000 },
        { month: 'Aug', savings: 320000 },
        { month: 'Sep', savings: 450000 },
        { month: 'Oct', savings: 520000 },
        { month: 'Nov', savings: 680000 },
        { month: 'Dec', savings: 860000 },
      ],
      totalSavings: 3080000
    },
    tasks: [
      { id: '1', title: 'Review Augusta Rule implementation', client: 'Johnson Holdings LLC', dueDate: 'Today', priority: true },
      { id: '2', title: 'Verify K-1 extraction accuracy', client: 'Rivera Family Trust', dueDate: 'Today', priority: true },
      { id: '3', title: 'Generate Q4 tax report', client: 'Apex Medical Group', dueDate: 'Tomorrow', priority: true },
      { id: '4', title: 'Update entity structure', client: 'Coastal Properties', dueDate: 'Dec 30', priority: true },
      { id: '5', title: 'Complete onboarding docs', client: 'Summit Consulting', dueDate: 'Dec 28', priority: true, completed: true },
    ],
    documents: [
      { id: '1', name: 'Johnson Holdings LLC', type: '1120S', confidence: 98, status: 'complete', timestamp: '2 min ago' },
      { id: '2', name: 'Apex Medical Group', type: 'Schedule K-1', status: 'processing', timestamp: 'Just now' },
      { id: '3', name: 'Rivera Family Trust', type: '1040', confidence: 72, status: 'needs-review', timestamp: '5 min ago' },
      { id: '4', name: 'Coastal Properties', type: 'Depreciation Schedule', status: 'error', timestamp: '12 min ago' },
      { id: '5', name: 'Summit Consulting', type: 'Profit & Loss', confidence: 91, status: 'complete', timestamp: '15 min ago' },
    ],
    clients: [
      { id: '1', name: 'Johnson Holdings LLC', entityType: 'S-Corp', strategiesCount: 5, estimatedSavings: 127500, status: 'active', isVip: true },
      { id: '2', name: 'Dr. Sarah Chen', entityType: 'Individual', strategiesCount: 4, estimatedSavings: 89200, status: 'active' },
      { id: '3', name: 'Apex Medical Group', entityType: 'Partnership', strategiesCount: 7, estimatedSavings: 234000, status: 'review', isVip: true },
      { id: '4', name: 'Marcus Rivera', entityType: 'Individual', strategiesCount: 3, estimatedSavings: 45600, status: 'active' },
      { id: '5', name: 'Coastal Properties Inc', entityType: 'C-Corp', strategiesCount: 8, estimatedSavings: 567000, status: 'pending', isVip: true },
    ],
    activities: [
      { id: '1', type: 'document', title: 'Document Processed', description: 'Johnson Holdings LLC - 1120S extracted...', timestamp: '2 min ago' },
      { id: '2', type: 'strategy', title: 'New Strategy Identified', description: 'Augusta Rule opportunity found for...', timestamp: '15 min ago' },
      { id: '3', type: 'client', title: 'New Client Added', description: 'Summit Consulting onboarded with 8 d...', timestamp: '1 hour ago' },
      { id: '4', type: 'document', title: 'Report Generated', description: 'Q4 Tax Strategy Report for Coastal Pr...', timestamp: '2 hours ago' },
      { id: '5', type: 'strategy', title: 'Strategy Engine Updated', description: 'Section 179 thresholds updated for 2...', timestamp: '4 hours ago' },
    ]
  }
}

// ============================================================================
// Dashboard Page Component
// ============================================================================
export default function Dashboard() {
  const router = useRouter()
  const { state, data, setData, refetch } = useDashboardData()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const addClientDialog = useAddClientDialog()

  // ============================================================================
  // Handlers
  // ============================================================================
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
    toast.success('Dashboard refreshed')
  }

  const handleViewClients = () => router.push('/clients')
  const handleViewDocuments = () => router.push('/documents')
  const handleViewRoadmaps = () => router.push('/roadmaps')

  const handleViewTasks = () => {
    toast.info('Tasks page coming soon!', {
      description: 'You can manage tasks from the dashboard for now.'
    })
  }

  const handleStatClick = (stat: string) => {
    switch (stat) {
      case 'clients':
        router.push('/clients')
        break
      case 'savings':
        router.push('/reports')
        break
      case 'documents':
        router.push('/documents')
        break
      case 'strategies':
        router.push('/strategy-engine')
        break
    }
  }

  const handleStrategyClick = (strategy: StrategyItem) => {
    toast.info(`Strategy: ${strategy.title}`, {
      description: `${strategy.clients} clients using this strategy with $${(strategy.savings / 1000).toFixed(0)}K savings`
    })
    router.push('/strategy-engine')
  }

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    // Optimistic update
    setData(prev => prev ? {
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed } : t)
    } : null)

    try {
      await updateTaskStatus(taskId, completed)
      toast.success(completed ? 'Task completed' : 'Task reopened')
    } catch (error) {
      // Revert on error
      setData(prev => prev ? {
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: !completed } : t)
      } : null)
      toast.error('Failed to update task')
    }
  }

  const handleDocumentClick = (doc: PipelineDocument) => {
    if (doc.status === 'needs-review') {
      toast.warning(`Review needed: ${doc.name}`, {
        description: `Confidence: ${doc.confidence}%`,
        action: { label: 'Review', onClick: () => router.push('/documents') }
      })
    } else if (doc.status === 'error') {
      toast.error(`Processing failed: ${doc.name}`, {
        action: { label: 'Retry', onClick: () => router.push('/documents') }
      })
    } else {
      router.push('/documents')
    }
  }

  const handleClientClick = (client: Client) => {
    toast.info(`${client.name}`, {
      description: `${client.entityType} • ${client.strategiesCount} strategies • $${(client.estimatedSavings / 1000).toFixed(0)}K savings`
    })
    router.push('/clients')
  }

  const handleActivityClick = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'document':
        router.push('/documents')
        break
      case 'strategy':
        router.push('/strategy-engine')
        break
      case 'client':
        router.push('/clients')
        break
    }
  }

  const handleAddClient = async (formData: ClientFormData) => {
    try {
      await createClient(formData)
      toast.success('Client created!', {
        description: `${formData.name} has been added.`
      })
      refetch()
    } catch (error) {
      toast.error('Failed to create client')
    }
  }

  return (
    <>
      <AddClientDialog
        open={addClientDialog.open}
        onOpenChange={addClientDialog.setOpen}
        onSubmit={handleAddClient}
      />

      <PageHeader
        title="Dashboard"
        subtitle="Blueprint Core Platform Overview"
        primaryAction={{
          label: isRefreshing ? 'Refreshing...' : 'Refresh',
          onClick: handleRefresh,
          icon: <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        }}
      />
      <Container className='py-8 space-y-3'>

        {/* Stat Cards - Now clickable */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div onClick={() => handleStatClick('clients')} className="cursor-pointer">
            <StatCard
              state={state}
              title="Active Clients"
              value={data?.stats.activeClients.value}
              change={data?.stats.activeClients.change}
              changeLabel="vs last month"
            />
          </div>
          <div onClick={() => handleStatClick('savings')} className="cursor-pointer">
            <StatCard
              state={state}
              title="Total Savings"
              value={data?.stats.totalSavings.value}
              change={data?.stats.totalSavings.change}
              changeLabel="vs last month"
            />
          </div>
          <div onClick={() => handleStatClick('documents')} className="cursor-pointer">
            <StatCard
              state={state}
              title="Documents Processed"
              value={data?.stats.documentsProcessed.value}
              change={data?.stats.documentsProcessed.change}
              changeLabel="this week"
            />
          </div>
          <div onClick={() => handleStatClick('strategies')} className="cursor-pointer">
            <StatCard
              state={state}
              title="Active Strategies"
              value={data?.stats.strategiesActive.value}
              change={data?.stats.strategiesActive.change}
              changeLabel="new this month"
            />
          </div>
        </div>

        {/* Strategy Heatmap */}
        <StrategyHeatmap
          state={state}
          data={data?.strategies}
          onStrategyClick={handleStrategyClick}
        />

        {/* Charts and Tasks Row */}
        <div className="grid gap-5 lg:grid-cols-3">
          <SavingsChart
            state={state}
            data={data?.savingsChart.points}
            totalSavings={data?.savingsChart.totalSavings}
            className="lg:col-span-2"
          />
          <AdvisorTasks
            state={state}
            data={data?.tasks}
            onViewAll={handleViewTasks}
            onTaskToggle={handleTaskToggle}
          />
        </div>

        {/* Document Pipeline and Recent Activity */}
        <div className="grid gap-5 lg:grid-cols-3">
          <DocumentPipeline
            state={state}
            data={data?.documents}
            className="lg:col-span-2"
            onViewAll={handleViewDocuments}
            onDocumentClick={handleDocumentClick}
          />
          <RecentActivity
            state={state}
            data={data?.activities}
            onActivityClick={handleActivityClick}
          />
        </div>

        {/* Active Clients */}
        <ActiveClients
          state={state}
          data={data?.clients}
          onViewAll={handleViewClients}
          onClientClick={handleClientClick}
        />
      </Container>
    </>
  )
}
