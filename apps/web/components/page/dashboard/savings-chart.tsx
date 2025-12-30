"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@workspace/ui/components/chart'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import type { DataState } from './stat-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'

// ============================================================================
// Types - Ready for backend integration
// ============================================================================
export interface SavingsDataPoint {
  month: string
  savings: number
}

export interface SavingsChartData {
  points: SavingsDataPoint[]
  totalSavings?: number
}

export interface SavingsChartProps {
  /** Data can be passed as array or object with points */
  data?: SavingsChartData | SavingsDataPoint[]
  /** Loading/empty/data state */
  state?: DataState
  /** Override total savings calculation */
  totalSavings?: number
  /** Chart title */
  title?: string
  /** Chart subtitle */
  subtitle?: string
  /** Controlled time filter value */
  timeFilter?: string
  /** Callback when time filter changes - use for API refetch */
  onTimeFilterChange?: (filter: string) => void
  className?: string
}

// ============================================================================
// Chart Configuration
// ============================================================================
const chartConfig = {
  savings: { label: 'Savings', color: '#287BFF' } // green-400
}

const TIME_FILTER_OPTIONS = [
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: '12m', label: '12 Months' },
  { value: 'all', label: 'All Time' }
]

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${Math.round(value / 1000)}K`
  return `$${value}`
}

// ============================================================================
// Skeleton State
// ============================================================================
export function SavingsChartSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("border-border/40", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-3.5 w-48" />
          </div>
          <Skeleton className="h-8 w-28" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-[200px] w-full" />
        <div className="mt-3 flex items-center justify-between pt-3 border-t border-border/30">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Empty State
// ============================================================================
export function SavingsChartEmpty({
  title = "Identified Savings",
  className
}: {
  title?: string
  className?: string
}) {
  return (
    <Card className={cn("border-border/40", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Empty className="min-h-[200px]">
          <EmptyMedia variant="icon">
            <TrendingUp className="h-6 w-6" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-sm">No Savings Data</EmptyTitle>
            <EmptyDescription className="text-xs">
              Savings will appear once strategies are applied.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Main Component
// ============================================================================
export function SavingsChart({
  data,
  state = 'data',
  totalSavings: directTotalSavings,
  title = "Identified Savings",
  subtitle = "Monthly tax savings across all clients",
  timeFilter: externalTimeFilter,
  onTimeFilterChange,
  className
}: SavingsChartProps) {
  // Internal state for uncontrolled mode
  const [internalTimeFilter, setInternalTimeFilter] = useState("6m")
  const timeFilter = externalTimeFilter ?? internalTimeFilter

  // Normalize data from array or object format
  const allPoints = useMemo(() => {
    return Array.isArray(data) ? data : data?.points ?? []
  }, [data])

  // Filter data based on time range (client-side filtering for demo)
  // In production, you'd refetch from API with the filter
  const points = useMemo(() => {
    if (allPoints.length === 0) return []

    let monthsToShow = 6
    switch (timeFilter) {
      case '3m': monthsToShow = 3; break
      case '6m': monthsToShow = 6; break
      case '12m': monthsToShow = 12; break
      case 'all': return allPoints
    }

    return allPoints.slice(-monthsToShow)
  }, [allPoints, timeFilter])

  // Calculate totals and trends
  const { totalSavings, percentChange, isPositive } = useMemo(() => {
    const total = directTotalSavings ??
      (!Array.isArray(data) ? data?.totalSavings : undefined) ??
      points.reduce((sum, p) => sum + p.savings, 0)

    let change = 0
    if (points.length >= 2) {
      const first = points[0]?.savings ?? 0
      const last = points[points.length - 1]?.savings ?? 0
      if (first > 0) {
        change = Math.round(((last - first) / first) * 100)
      }
    }

    return {
      totalSavings: total,
      percentChange: change,
      isPositive: change >= 0
    }
  }, [directTotalSavings, data, points])

  const handleTimeFilterChange = (value: string) => {
    if (onTimeFilterChange) {
      // For backend integration: call parent handler to refetch data
      onTimeFilterChange(value)
    } else {
      // Uncontrolled: manage state internally
      setInternalTimeFilter(value)
    }
  }

  // Loading State
  if (state === 'loading') {
    return <SavingsChartSkeleton className={className} />
  }

  // Empty State
  if (state === 'empty' || points.length === 0) {
    return <SavingsChartEmpty title={title} className={className} />
  }

  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <Card className={cn("border-border/40", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-xs">{subtitle}</CardDescription>
          </div>
          <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
            <SelectTrigger className="h-8 w-[100px] text-xs bg-muted/50 border-border/50">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent align="end">
              {TIME_FILTER_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#287BFF" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#287BFF" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-[10px]"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              className="text-[10px]"
              tickFormatter={formatCurrency}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              width={50}
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
            />
            <Area
              type="monotone"
              dataKey="savings"
              stroke="#287BFF"
              strokeWidth={2}
              fill="url(#savingsGradient)"
            />
          </AreaChart>
        </ChartContainer>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs text-muted-foreground">Total Savings</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{formatCurrency(totalSavings)}</span>
            {percentChange !== 0 && (
              <span className={cn(
                "text-xs flex items-center gap-0.5",
                isPositive ? "text-green-400" : "text-red-400"
              )}>
                <TrendIcon className="h-3 w-3" />
                {isPositive ? '+' : ''}{percentChange}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
