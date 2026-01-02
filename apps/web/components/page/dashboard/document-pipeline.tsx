"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { FileText, CheckCircle2, Loader2, AlertCircle, Clock, FolderOpen } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import type { DataState } from './stat-card'

export interface PipelineDocument {
  id: string
  name: string
  type: string
  confidence?: number
  status: 'complete' | 'processing' | 'needs-review' | 'error'
  timestamp: string
}

export interface DocumentPipelineProps {
  data?: PipelineDocument[]
  state?: DataState
  isActive?: boolean
  title?: string
  subtitle?: string
  onViewAll?: () => void
  onDocumentClick?: (doc: PipelineDocument) => void
  className?: string
  // Legacy prop
  documents?: PipelineDocument[]
}

const statusConfig = {
  complete: { icon: CheckCircle2, label: 'Complete', className: 'text-emerald-400 bg-green-500/20 border-green-500/30' },
  processing: { icon: Loader2, label: 'Processing', className: 'text-sky-400 bg-sky-500/20 border-sky-500/30' },
  'needs-review': { icon: AlertCircle, label: 'Needs Review', className: 'text-orange-400 bg-orange-500/20 border-orange-500/30' },
  error: { icon: AlertCircle, label: 'Error', className: 'text-red-400 bg-red-500/20 border-red-500/30' }
}

// Skeleton State
export function DocumentPipelineSkeleton({
  title = "Document Pipeline",
  subtitle = "Real-time OCR & extraction status",
  className
}: {
  title?: string
  subtitle?: string
  className?: string
}) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </div>
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-40 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-10 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Empty State
export function DocumentPipelineEmpty({
  title = "Document Pipeline",
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
            <FolderOpen className="h-8 w-8" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No Documents in Pipeline</EmptyTitle>
            <EmptyDescription>
              Upload documents to start processing. Documents will appear here as they are extracted and analyzed.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </Card>
  )
}

// Main Component
export function DocumentPipeline({
  data,
  state = 'data',
  isActive = true,
  title = "Document Pipeline",
  subtitle = "Real-time OCR & extraction status",
  onViewAll,
  onDocumentClick,
  className,
  documents: legacyDocuments
}: DocumentPipelineProps) {
  const documents = data ?? legacyDocuments ?? []

  // Loading State
  if (state === 'loading') {
    return <DocumentPipelineSkeleton title={title} subtitle={subtitle} className={className} />
  }

  // Empty State
  if (state === 'empty' || documents.length === 0) {
    return <DocumentPipelineEmpty title={title} className={className} />
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
          {isActive && (
            <Badge variant="outline" className="text-emerald-400 bg-green-500/20 border-green-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              Pipeline Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => {
            const config = statusConfig[doc.status]
            const StatusIcon = config.icon
            return (
              <div
                key={doc.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-accent/30 transition-colors",
                  onDocumentClick && "cursor-pointer"
                )}
                onClick={() => onDocumentClick?.(doc)}
              >
                <div className="p-2 rounded-lg bg-muted">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.type}</p>
                </div>
                {
                  doc.confidence !== undefined && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium">{doc.confidence}%</p>
                      <p className="text-xs text-muted-foreground">confidence</p>
                    </div>
                  )
                }
                <Badge variant="outline" className={cn("flex-shrink-0", config.className)}>
                  <StatusIcon className={cn("h-3 w-3 mr-1", doc.status === 'processing' && "animate-spin")} />
                  {config.label}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  {doc.timestamp}
                </div>
              </div>
            )
          })}
        </div>
        {onViewAll && (
          <button onClick={onViewAll} className="mt-4 text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            View All Documents →
          </button>
        )}
      </CardContent>
    </Card >
  )
}
