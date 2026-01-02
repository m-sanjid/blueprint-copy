"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Brain, TrendingUp, DollarSign, ChevronRight, Filter, Plus, Search, Play, Pause, MoreVertical, Eye, Settings, Users } from 'lucide-react'
import { PageHeader, StatCard, type DataState } from '@/components/page/dashboard'
import { cn } from '@workspace/ui/lib/utils'
import { Container } from '@/components/core/container'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { PrimaryButton } from '@workspace/ui/components/primary-button'

// ============================================
// Types
// ============================================

interface Strategy {
  id: string
  title: string
  description: string
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3'
  status: 'Active' | 'Review' | 'Inactive'
  eligibleClients: number
  totalClients: number
  totalPotential: number
  perClient: number
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk'
}

interface StrategyEngineData {
  stats: { tier1Strategies: number; totalPotential: string; activeImplementations: number; pendingReview: number }
  strategies: Strategy[]
}

// ============================================
// API Functions - Replace with actual API calls
// ============================================

async function fetchStrategies(): Promise<StrategyEngineData> {
  // TODO: Replace with actual API call
  // return await fetch('/api/strategies').then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 1500))
  return {
    stats: { tier1Strategies: 8, totalPotential: '$9.26M', activeImplementations: 342, pendingReview: 12 },
    strategies: [
      { id: '1', title: 'Augusta Rule (Section 280A)', description: 'Rent personal residence to business for up to 14 days tax-free', tier: 'Tier 1', status: 'Active', eligibleClients: 45, totalClients: 127, totalPotential: 892000, perClient: 19822, riskLevel: 'Low Risk' },
      { id: '2', title: 'Hire Your Kids', description: 'Employ children under 18 in legitimate business roles for tax savings', tier: 'Tier 1', status: 'Active', eligibleClients: 32, totalClients: 127, totalPotential: 456000, perClient: 14250, riskLevel: 'Low Risk' },
      { id: '3', title: 'Section 179 Deduction', description: 'Immediate expensing of business equipment and property purchases', tier: 'Tier 1', status: 'Active', eligibleClients: 58, totalClients: 127, totalPotential: 1240000, perClient: 21379, riskLevel: 'Low Risk' },
      { id: '4', title: 'Officer Salary Optimization', description: 'Optimize S-Corp officer compensation for FICA tax savings', tier: 'Tier 1', status: 'Active', eligibleClients: 41, totalClients: 127, totalPotential: 678000, perClient: 16537, riskLevel: 'Medium Risk' },
      { id: '5', title: 'Cost Segregation', description: 'Accelerate depreciation on commercial property components', tier: 'Tier 2', status: 'Active', eligibleClients: 23, totalClients: 127, totalPotential: 2100000, perClient: 91304, riskLevel: 'Low Risk' },
      { id: '6', title: 'Retirement Plan Stacking', description: 'Maximize retirement contributions through multiple plan types', tier: 'Tier 2', status: 'Review', eligibleClients: 67, totalClients: 127, totalPotential: 1890000, perClient: 28209, riskLevel: 'Low Risk' },
    ]
  }
}

async function updateStrategyStatus(id: string, status: Strategy['status']): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  // return await fetch(`/api/strategies/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('Updating strategy status:', id, status)
  return { success: true }
}

async function runStrategyAnalysis(id: string): Promise<{ success: boolean; newClients: number }> {
  // TODO: Replace with actual API call
  // return await fetch(`/api/strategies/${id}/analyze`, { method: 'POST' }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 1500))
  console.log('Running strategy analysis:', id)
  return { success: true, newClients: Math.floor(Math.random() * 5) + 1 }
}

// ============================================
// Custom Hook
// ============================================

function useStrategyData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<StrategyEngineData | null>(null)

  const refetch = useCallback(async () => {
    setState('loading')
    try {
      const result = await fetchStrategies()
      setData(result)
      setState('data')
    } catch (error) {
      console.error('Failed to fetch strategies:', error)
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

const tierConfig = { 'Tier 1': 'bg-green-500/20 text-emerald-400 border-green-500/30', 'Tier 2': 'bg-sky-500/20 text-sky-400 border-sky-500/30', 'Tier 3': 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
const statusConfig = { Active: 'bg-green-500/20 text-emerald-400 border-green-500/30', Review: 'bg-orange-500/20 text-orange-400 border-orange-500/30', Inactive: 'bg-muted text-muted-foreground border-border' }
const riskConfig = { 'Low Risk': 'text-emerald-400', 'Medium Risk': 'text-orange-400', 'High Risk': 'text-red-400' }

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
  if (value >= 1000) return `$${Math.round(value / 1000)}K`
  return `$${value.toLocaleString()}`
}

// ============================================
// Component
// ============================================

export default function StrategyEngine() {
  const { state, data, setData, refetch } = useStrategyData()
  const [tierFilter, setTierFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set())

  const isLoading = state === 'loading'

  const filteredStrategies = data?.strategies.filter(s => {
    if (tierFilter !== 'all' && s.tier !== tierFilter) return false
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  }) ?? []

  // ============================================
  // Handlers
  // ============================================

  const handleToggleStatus = async (strategy: Strategy) => {
    const nextStatus: Strategy['status'] = strategy.status === 'Active' ? 'Inactive' : 'Active'

    // Optimistic update
    setData(prev => prev ? {
      ...prev,
      strategies: prev.strategies.map(s =>
        s.id === strategy.id ? { ...s, status: nextStatus } : s
      ),
      stats: {
        ...prev.stats,
        activeImplementations: nextStatus === 'Active'
          ? prev.stats.activeImplementations + strategy.eligibleClients
          : prev.stats.activeImplementations - strategy.eligibleClients
      }
    } : null)

    try {
      await updateStrategyStatus(strategy.id, nextStatus)
      toast.success(`Strategy ${nextStatus === 'Active' ? 'activated' : 'deactivated'}`, {
        description: strategy.title
      })
    } catch (error) {
      // Revert on error
      setData(prev => prev ? {
        ...prev,
        strategies: prev.strategies.map(s =>
          s.id === strategy.id ? { ...s, status: strategy.status } : s
        )
      } : null)
      toast.error('Failed to update strategy')
    }
  }

  const handleAnalyze = async (strategy: Strategy) => {
    setAnalyzingIds(prev => new Set(prev).add(strategy.id))
    toast.info(`Analyzing: ${strategy.title}`, { duration: 1500 })

    try {
      const result = await runStrategyAnalysis(strategy.id)
      if (result.success) {
        setData(prev => prev ? {
          ...prev,
          strategies: prev.strategies.map(s =>
            s.id === strategy.id ? { ...s, eligibleClients: s.eligibleClients + result.newClients } : s
          )
        } : null)
        toast.success('Analysis complete', {
          description: `Found ${result.newClients} new eligible client${result.newClients !== 1 ? 's' : ''} for ${strategy.title}`
        })
      }
    } catch (error) {
      toast.error('Analysis failed')
    } finally {
      setAnalyzingIds(prev => {
        const next = new Set(prev)
        next.delete(strategy.id)
        return next
      })
    }
  }

  const handleViewDetails = (strategy: Strategy) => {
    toast.info(strategy.title, {
      description: `${strategy.eligibleClients} eligible clients • ${formatCurrency(strategy.totalPotential)} potential savings`
    })
  }

  const handleViewClients = (strategy: Strategy) => {
    toast.info(`Viewing clients for: ${strategy.title}`, {
      description: `${strategy.eligibleClients} eligible out of ${strategy.totalClients} total clients`
    })
  }

  const handleConfigureRules = (strategy: Strategy) => {
    toast.info(`Configure: ${strategy.title}`, {
      description: 'Strategy rule configuration coming soon!'
    })
  }

  const handleStrategyClick = (strategy: Strategy) => {
    handleViewDetails(strategy)
  }

  return (
    <>
      <PageHeader
        title="Strategy Engine"
        subtitle="Tax strategy rules, eligibility, and AI orchestration"
        primaryAction={{ label: 'Run Analysis', onClick: () => toast.info('Running full strategy analysis...'), icon: <Brain className="h-4 w-4 mr-2" /> }}
      />

      <Container className="space-y-6 py-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard state={state} title="Tier-1 Strategies" value={data?.stats.tier1Strategies} />
          <StatCard state={state} title="Total Potential" value={data?.stats.totalPotential} />
          <StatCard state={state} title="Active Implementations" value={data?.stats.activeImplementations} />
          <StatCard state={state} title="Pending Review" value={data?.stats.pendingReview} />
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 pb-2 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search strategies..."
              className="pl-9 bg-card border-border/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-28"><SelectValue placeholder="All Tiers" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="Tier 1">Tier 1</SelectItem>
              <SelectItem value="Tier 2">Tier 2</SelectItem>
              <SelectItem value="Tier 3">Tier 3</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-28"><SelectValue placeholder="All Statuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Strategy List */}
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        ) : filteredStrategies.length === 0 ? (
          <Card className="border-border/40">
            <CardContent className="py-12">
              <Empty>
                <EmptyMedia variant="icon"><Brain className="h-8 w-8" /></EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No Strategies Found</EmptyTitle>
                  <EmptyDescription>Try adjusting your filters or search query.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredStrategies.map(strategy => {
              const isAnalyzing = analyzingIds.has(strategy.id)
              return (
                <Card
                  key={strategy.id}
                  className="border-border/50 hover:border-border transition-colors cursor-pointer group"
                  onClick={() => handleStrategyClick(strategy)}
                >
                  <CardContent className="px-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{strategy.title}</h3>
                            <Badge variant="outline" className={tierConfig[strategy.tier]}>{strategy.tier}</Badge>
                            <Badge variant="outline" className={statusConfig[strategy.status]}>{strategy.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{strategy.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-8 w-8 p-0",
                            strategy.status === 'Active' ? "text-emerald-400" : "text-muted-foreground"
                          )}
                          onClick={(e) => { e.stopPropagation(); handleToggleStatus(strategy) }}
                        >
                          {strategy.status === 'Active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
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
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDetails(strategy) }}>
                              <Eye className="h-4 w-4 mr-2" />View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewClients(strategy) }}>
                              <Users className="h-4 w-4 mr-2" />View Eligible Clients
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => { e.stopPropagation(); handleAnalyze(strategy) }}
                              disabled={isAnalyzing}
                            >
                              <Brain className={cn("h-4 w-4 mr-2", isAnalyzing && "animate-pulse")} />
                              {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleConfigureRules(strategy) }}>
                              <Settings className="h-4 w-4 mr-2" />Configure Rules
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    <div className="flex items-center gap-8 mt-2 pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{strategy.eligibleClients}/{strategy.totalClients} eligible</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        <span className="font-medium text-emerald-400">{formatCurrency(strategy.totalPotential)}</span>
                        <span className="text-muted-foreground">total potential</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">~${strategy.perClient.toLocaleString()}/client</span>
                      </div>
                      <div className={cn("flex items-center gap-2 text-sm", riskConfig[strategy.riskLevel])}>
                        <span className="h-2 w-2 rounded-full bg-current" />
                        <span>{strategy.riskLevel}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </Container>
    </>
  )
}
