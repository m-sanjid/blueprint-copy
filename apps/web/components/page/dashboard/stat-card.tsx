"use client"

import React from 'react'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { cn } from '@workspace/ui/lib/utils'
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react'

// Types for API integration
export type DataState = 'loading' | 'empty' | 'data'

export interface StatCardData {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
}

export interface StatCardProps {
  data?: StatCardData
  state?: DataState
  className?: string
  // Direct props for backwards compatibility
  title?: string
  value?: string | number
  change?: number
  changeLabel?: string
  isLoading?: boolean
}

// Skeleton State Component
export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("border-border/40", className)}>
      <CardContent className="px-4 py-2">
        <Skeleton className="h-3.5 w-20 mb-2" />
        <Skeleton className="h-7 w-24 mb-2" />
        <Skeleton className="h-4 w-28" />
      </CardContent>
    </Card>
  )
}

// Empty State Component
export function StatCardEmpty({ title, className }: { title: string; className?: string }) {
  return (
    <Card className={cn("border-border/40", className)}>
      <CardContent className="px-4 py-2">
        <p className="text-xs text-muted-foreground mb-1">{title}</p>
        <div className="text-xl font-semibold text-muted-foreground/50">--</div>
      </CardContent>
    </Card>
  )
}

// Main StatCard Component
export function StatCard({
  data,
  state = 'data',
  className,
  // Direct props
  title,
  value,
  change,
  changeLabel = 'vs last month',
  isLoading
}: StatCardProps) {
  // Handle legacy isLoading prop
  const currentState = isLoading ? 'loading' : state

  // Use direct props or data object
  const cardTitle = data?.title ?? title ?? ''
  const cardValue = data?.value ?? value ?? ''
  const cardChange = data?.change ?? change
  const cardChangeLabel = data?.changeLabel ?? changeLabel

  // Loading State
  if (currentState === 'loading') {
    return <StatCardSkeleton className={className} />
  }

  // Empty State
  if (currentState === 'empty' || (!cardValue && cardValue !== 0)) {
    return <StatCardEmpty title={cardTitle} className={className} />
  }

  // Data State
  const isPositive = cardChange !== undefined && cardChange > 0
  const isNegative = cardChange !== undefined && cardChange < 0
  const isNeutral = cardChange !== undefined && cardChange === 0

  // Get trend icon
  const TrendIcon = isPositive ? IconTrendingUp : isNegative ? IconTrendingDown : IconMinus

  return (
    <Card className={cn("border-border/40", className)}>
      <CardContent className="px-4 py-2">
        {/* Header with title */}
        <p className="text-xs text-muted-foreground mb-1">{cardTitle}</p>

        {/* Value */}
        <div className="text-xl font-semibold mb-1">{cardValue}</div>

        {/* Change indicator */}
        {cardChange !== undefined && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className={cn(
              "flex items-center gap-0.5",
              isPositive && "text-green-500",
              isNegative && "text-red-500",
              !isPositive && !isNegative && "text-muted-foreground"
            )}>
              <TrendIcon className="h-3 w-3" />
              {isPositive ? '+' : ''}{cardChange}%
            </span>
            <span className="text-muted-foreground">{cardChangeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
