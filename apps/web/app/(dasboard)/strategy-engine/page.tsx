"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Brain, TrendingUp, Target, AlertCircle, Users, DollarSign, ChevronRight, Filter, Plus, Search } from 'lucide-react'
import { PageHeader, StatCard, type DataState } from '@/components/page/dashboard'
import { cn } from '@workspace/ui/lib/utils'
import { Container } from '@/components/core/container'

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

function useStrategyData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<StrategyEngineData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setState('loading')
      await new Promise(resolve => setTimeout(resolve, 1500))
      setData({
        stats: { tier1Strategies: 8, totalPotential: '$9.26M', activeImplementations: 342, pendingReview: 12 },
        strategies: [
          { id: '1', title: 'Augusta Rule (Section 280A)', description: 'Rent personal residence to business for up to 14 days tax-free', tier: 'Tier 1', status: 'Active', eligibleClients: 45, totalClients: 127, totalPotential: 892000, perClient: 19822, riskLevel: 'Low Risk' },
          { id: '2', title: 'Hire Your Kids', description: 'Employ children under 18 in legitimate business roles for tax savings', tier: 'Tier 1', status: 'Active', eligibleClients: 32, totalClients: 127, totalPotential: 456000, perClient: 14250, riskLevel: 'Low Risk' },
          { id: '3', title: 'Section 179 Deduction', description: 'Immediate expensing of business equipment and property purchases', tier: 'Tier 1', status: 'Active', eligibleClients: 58, totalClients: 127, totalPotential: 1240000, perClient: 21379, riskLevel: 'Low Risk' },
          { id: '4', title: 'Officer Salary Optimization', description: 'Optimize S-Corp officer compensation for FICA tax savings', tier: 'Tier 1', status: 'Active', eligibleClients: 41, totalClients: 127, totalPotential: 678000, perClient: 16537, riskLevel: 'Medium Risk' },
          { id: '5', title: 'Cost Segregation', description: 'Accelerate depreciation on commercial property components', tier: 'Tier 2', status: 'Active', eligibleClients: 23, totalClients: 127, totalPotential: 2100000, perClient: 91304, riskLevel: 'Low Risk' },
          { id: '6', title: 'Retirement Plan Stacking', description: 'Maximize retirement contributions through multiple plan types', tier: 'Tier 2', status: 'Review', eligibleClients: 67, totalClients: 127, totalPotential: 1890000, perClient: 28209, riskLevel: 'Low Risk' },
        ]
      })
      setState('data')
    }
    fetchData()
  }, [])
  return { state, data }
}

const tierConfig = { 'Tier 1': 'bg-green-500/20 text-emerald-400 border-green-500/30', 'Tier 2': 'bg-sky-500/20 text-sky-400 border-sky-500/30', 'Tier 3': 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
const statusConfig = { Active: 'bg-green-500/20 text-emerald-400 border-green-500/30', Review: 'bg-orange-500/20 text-orange-400 border-orange-500/30', Inactive: 'bg-muted text-muted-foreground border-border' }
const riskConfig = { 'Low Risk': 'text-emerald-400', 'Medium Risk': 'text-orange-400', 'High Risk': 'text-red-400' }

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
  if (value >= 1000) return `$${Math.round(value / 1000)}K`
  return `$${value.toLocaleString()}`
}

export default function StrategyEngine() {
  const { state, data } = useStrategyData()
  const [tierFilter, setTierFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const isLoading = state === 'loading'

  const filteredStrategies = data?.strategies.filter(s => {
    if (tierFilter !== 'all' && s.tier !== tierFilter) return false
    return true
  }) ?? []

  return (
    <>
      <PageHeader
        title="Strategy Engine"
        subtitle="Tax strategy rules, eligibility, and AI orchestration"
        primaryAction={{ label: 'New Client', onClick: () => { }, icon: <Plus className="h-4 w-4 mr-2" /> }}
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
        <div className="flex items-center gap-4 pb-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search strategies..." className="pl-9 bg-card border-border/50" />
          </div>
          <Button variant="outline" size="sm" className="gap-2"><Filter className="h-4 w-4" />Filters</Button>
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-28"><SelectValue placeholder="All Tiers" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="Tier 1">Tier 1</SelectItem>
              <SelectItem value="Tier 2">Tier 2</SelectItem>
              <SelectItem value="Tier 3">Tier 3</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="All Categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="income">Rental Income</SelectItem>
              <SelectItem value="employment">Employment</SelectItem>
              <SelectItem value="depreciation">Depreciation</SelectItem>
              <SelectItem value="compensation">Compensation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Strategy List */}
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        ) : filteredStrategies.length === 0 ? (
          <Empty className="min-h-[300px]"><EmptyMedia variant="icon"><Brain className="h-8 w-8" /></EmptyMedia><EmptyHeader><EmptyTitle>No Strategies Found</EmptyTitle><EmptyDescription>Try adjusting your filters.</EmptyDescription></EmptyHeader></Empty>
        ) : (
          <div className="space-y-3">
            {filteredStrategies.map(strategy => (
              <Card key={strategy.id} className="border-border/50 hover:border-border transition-colors cursor-pointer group">
                <CardContent className="px-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{strategy.title}</h3>
                          <Badge variant="outline" className={tierConfig[strategy.tier]}>{strategy.tier}</Badge>
                          <Badge variant="outline" className={statusConfig[strategy.status]}>{strategy.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{strategy.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
