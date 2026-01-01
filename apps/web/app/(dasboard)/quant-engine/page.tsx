"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@workspace/ui/components/chart'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Calculator, TrendingUp, Target, Zap, BarChart3 } from 'lucide-react'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { PageHeader, StatCard, type DataState } from '@/components/page/dashboard'
import { Container } from '@/components/core/container'

// ============================================================================
// Types
// ============================================================================
interface QuantData {
  stats: {
    projectedLiability: { value: string; change: number }
    potentialSavings: { value: string; change: number }
    effectiveTaxRate: { value: string; change: number }
    scenariosAnalyzed: { value: number; change: number }
  }
  projections: Array<{ month: string; projected: number; actual: number | null }>
  scenarios: Array<{ name: string; taxLiability: number; savings: number }>
  metrics: Array<{ metric: string; current: number; target: number; unit: string }>
}

// ============================================================================
// Data Hook
// ============================================================================
function useQuantData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<QuantData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setState('loading')
      await new Promise(resolve => setTimeout(resolve, 1500))
      setData({
        stats: {
          projectedLiability: { value: '$245,000', change: -12 },
          potentialSavings: { value: '$111,000', change: 23 },
          effectiveTaxRate: { value: '28.5%', change: -2.5 },
          scenariosAnalyzed: { value: 24, change: 8 }
        },
        projections: Array.from({ length: 12 }, (_, i) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]!,
          projected: Math.round(150000 + Math.random() * 50000 + i * 10000),
          actual: i < 6 ? Math.round(140000 + Math.random() * 40000 + i * 12000) : null,
        })),
        scenarios: [
          { name: 'Base Case', taxLiability: 245000, savings: 0 },
          { name: 'Conservative', taxLiability: 198000, savings: 47000 },
          { name: 'Aggressive', taxLiability: 156000, savings: 89000 },
          { name: 'Optimal', taxLiability: 134000, savings: 111000 },
        ],
        metrics: [
          { metric: 'Effective Tax Rate', current: 28.5, target: 22.0, unit: '%' },
          { metric: 'Tax Efficiency Score', current: 72, target: 90, unit: '' },
          { metric: 'Deduction Utilization', current: 68, target: 85, unit: '%' },
          { metric: 'Credit Optimization', current: 45, target: 75, unit: '%' },
        ]
      })
      setState('data')
    }
    fetchData()
  }, [])

  return { state, data }
}

const chartConfig = {
  projected: { label: 'Projected', color: 'hsl(var(--chart-3))' },
  actual: { label: 'Actual', color: 'hsl(var(--chart-1))' },
  taxLiability: { label: 'Tax Liability', color: 'hsl(var(--chart-2))' },
}

export default function QuantEngine() {
  const { state, data } = useQuantData()
  const isLoading = state === 'loading'

  return (
    <>
      <PageHeader
        title="Quant Engine"
        subtitle="Financial calculations and tax projections"
        primaryAction={{ label: 'Run Simulation', onClick: () => { }, icon: <Zap className="h-4 w-4 mr-2" /> }}
      />

      <Container className="space-y-6 py-6">
        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard state={state} title="Projected Tax Liability" value={data?.stats.projectedLiability.value} change={data?.stats.projectedLiability.change} changeLabel="vs last year" />
          <StatCard state={state} title="Potential Savings" value={data?.stats.potentialSavings.value} change={data?.stats.potentialSavings.change} changeLabel="identified" />
          <StatCard state={state} title="Effective Tax Rate" value={data?.stats.effectiveTaxRate.value} change={data?.stats.effectiveTaxRate.change} changeLabel="optimized" />
          <StatCard state={state} title="Scenarios Analyzed" value={data?.stats.scenariosAnalyzed.value} change={data?.stats.scenariosAnalyzed.change} changeLabel="this month" />
        </div>

        {/* Projection Chart */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div><CardTitle>Tax Liability Projections</CardTitle><CardDescription>Projected vs actual tax liability over time</CardDescription></div>
              <Badge variant="outline" className="bg-green-500/20 text-emerald-400 border-green-500/30">On Track</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[300px] w-full" /> : !data ? (
              <Empty className="min-h-[300px]"><EmptyMedia variant="icon"><BarChart3 className="h-8 w-8" /></EmptyMedia><EmptyHeader><EmptyTitle>No Projections</EmptyTitle><EmptyDescription>Run a simulation to see projections.</EmptyDescription></EmptyHeader></Empty>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={data.projections}>
                  <defs><linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="projected" stroke="hsl(var(--chart-3))" strokeWidth={2} fill="url(#projectedGradient)" />
                  <Line type="monotone" dataKey="actual" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Scenario Analysis & Metrics */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader><CardTitle>Scenario Analysis</CardTitle><CardDescription>Compare tax optimization scenarios</CardDescription></CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-[250px] w-full" /> : !data ? (
                <Empty className="min-h-[250px]"><EmptyMedia variant="icon"><Calculator className="h-8 w-8" /></EmptyMedia><EmptyHeader><EmptyTitle>No Scenarios</EmptyTitle></EmptyHeader></Empty>
              ) : (
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <BarChart data={data.scenarios} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
                    <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="taxLiability" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader><CardTitle>Optimization Metrics</CardTitle><CardDescription>Current vs target performance</CardDescription></CardHeader>
            <CardContent>
              {isLoading ? <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-2 w-full" /></div>)}</div> : !data ? (
                <Empty className="min-h-[200px]"><EmptyMedia variant="icon"><Target className="h-8 w-8" /></EmptyMedia><EmptyHeader><EmptyTitle>No Metrics</EmptyTitle></EmptyHeader></Empty>
              ) : (
                <div className="space-y-3">
                  {data.metrics.map((m, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-sm"><span>{m.metric}</span><span className="font-medium">{m.current}{m.unit} / {m.target}{m.unit}</span></div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${(m.current / m.target) * 100}%` }} /></div>
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
