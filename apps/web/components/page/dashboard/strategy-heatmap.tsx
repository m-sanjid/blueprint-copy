"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { LayoutGrid } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import type { DataState } from './stat-card'

export interface StrategyItem {
  id: string
  category: string
  categoryColor?: string
  title: string
  savings: number
  clients: number
  confidence: 'high' | 'medium' | 'low'
}

export interface StrategyHeatmapProps {
  data?: StrategyItem[]
  state?: DataState
  title?: string
  subtitle?: string
  className?: string
  // Legacy prop
  strategies?: StrategyItem[]
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  'Rental Income': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  'Employment': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  'Depreciation': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  'Compensation': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Real Estate': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  'Retirement': { bg: 'bg-sky-500/20', text: 'text-sky-400', border: 'border-sky-500/30' },
  'Reimbursement': { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
  'Deductions': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
}

const confidenceColors = {
  high: 'bg-green-500',
  medium: 'bg-yellow-500',
  low: 'bg-red-500',
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
  if (value >= 1000) return `$${Math.round(value / 1000)}K`
  return `$${value}`
}

// Skeleton State
export function StrategyHeatmapSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader>
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 rounded-lg border border-border/50">
              <Skeleton className="h-5 w-20 mb-3" />
              <Skeleton className="h-4 w-28 mb-4" />
              <Skeleton className="h-6 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Empty State
export function StrategyHeatmapEmpty({
  title = "Strategy Heatmap",
  className
}: {
  title?: string
  className?: string
}) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Empty className="min-h-[200px]">
          <EmptyMedia variant="icon">
            <LayoutGrid className="h-8 w-8" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No Strategies Found</EmptyTitle>
            <EmptyDescription>
              No tax strategies have been identified yet. Strategies will appear here once client data is analyzed.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}

// Main Component
export function StrategyHeatmap({
  data,
  state = 'data',
  title = "Strategy Heatmap",
  subtitle = "Tier-1 tax strategies by potential impact",
  className,
  strategies: legacyStrategies
}: StrategyHeatmapProps) {
  const strategies = data ?? legacyStrategies ?? []

  // Loading State
  if (state === 'loading') {
    return <StrategyHeatmapSkeleton className={className} />
  }

  // Empty State
  if (state === 'empty' || strategies.length === 0) {
    return <StrategyHeatmapEmpty title={title} className={className} />
  }

  // Data State
  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", confidenceColors.high)} />
              <span className="text-muted-foreground">High Confidence</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", confidenceColors.medium)} />
              <span className="text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", confidenceColors.low)} />
              <span className="text-muted-foreground">Low</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {strategies.map((strategy) => {
            const colors = categoryColors[strategy.category] || { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' }
            return (
              <div
                key={strategy.id}
                className="p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/30 transition-colors cursor-pointer"
              >
                <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 mb-3", colors.bg, colors.text, colors.border)}>
                  {strategy.category}
                </Badge>
                <h4 className="font-medium text-sm mb-3">{strategy.title}</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold">{formatCurrency(strategy.savings)}</p>
                    <p className="text-xs text-muted-foreground">potential savings</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{strategy.clients}</p>
                    <p className="text-xs text-muted-foreground">clients</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
