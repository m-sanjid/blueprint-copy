"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { FileText, Filter, Search, Eye, Download, RefreshCw, MoreVertical, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react'
import { PageHeader, StatCard, type DataState } from '@/components/page/dashboard'
import { cn } from '@workspace/ui/lib/utils'
import { DocumentUploadZone } from '@/components/core/document-upload-zone'
import { Container } from '@/components/core/container'
import { toast } from 'sonner'

interface Document {
  id: string
  name: string
  pages: number
  client: string
  type: string
  status: 'Completed' | 'Needs Review' | 'Processing' | 'Error'
  confidence?: number
  ocrProvider: string
  uploadedAt: string
}

interface DocumentsData {
  stats: { totalDocs: { value: string }; processed: { value: string }; needsReview: { value: number }; errorRate: { value: string } }
  documents: Document[]
}

function useDocumentsData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<DocumentsData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setState('loading')
      await new Promise(resolve => setTimeout(resolve, 1500))
      setData({
        stats: { totalDocs: { value: '1,847' }, processed: { value: '1,623' }, needsReview: { value: 89 }, errorRate: { value: '2.3%' } },
        documents: [
          { id: '1', name: '2023_Form_1120S.pdf', pages: 12, client: 'Johnson Holdings LLC', type: '1120S', status: 'Completed', confidence: 98, ocrProvider: 'AWS Textract', uploadedAt: 'Dec 28, 2024' },
          { id: '2', name: 'Schedule_K1_2023.pdf', pages: 4, client: 'Rivera Family Trust', type: 'Schedule K-1', status: 'Needs Review', confidence: 72, ocrProvider: 'AWS Textract', uploadedAt: 'Dec 28, 2024' },
          { id: '3', name: 'W2_Batch_Q4.pdf', pages: 45, client: 'Tech Solutions Inc', type: 'W-2 (Batch)', status: 'Processing', ocrProvider: 'Processing...', uploadedAt: 'Dec 28, 2024' },
          { id: '4', name: 'Depreciation_Schedule.xlsx', pages: 3, client: 'Coastal Properties', type: 'Depreciation Schedule', status: 'Error', ocrProvider: 'Failed', uploadedAt: 'Dec 27, 2024' },
          { id: '5', name: 'Form_1040_2023.pdf', pages: 8, client: 'Dr. Sarah Chen', type: '1040', status: 'Completed', confidence: 95, ocrProvider: 'AWS Textract', uploadedAt: 'Dec 27, 2024' },
        ]
      })
      setState('data')
    }
    fetchData()
  }, [])
  return { state, data }
}

const statusConfig = {
  Completed: { icon: CheckCircle2, className: 'bg-green-500/20 text-emerald-400 border-green-500/30' },
  'Needs Review': { icon: AlertCircle, className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  Processing: { icon: Clock, className: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
  Error: { icon: XCircle, className: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

function ConfidenceBar({ value }: { value?: number }) {
  if (value === undefined) return <span className="text-muted-foreground">—</span>
  const color = value >= 90 ? 'bg-green-500' : value >= 70 ? 'bg-orange-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden"><div className={cn("h-full rounded-full", color)} style={{ width: `${value}%` }} /></div>
      <span className="text-sm">{value}%</span>
    </div>
  )
}

export default function Documents() {
  const { state, data } = useDocumentsData()
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const isLoading = state === 'loading'

  const filteredDocuments = data?.documents.filter(doc => {
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false
    if (typeFilter !== 'all' && doc.type !== typeFilter) return false
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !doc.client.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  }) ?? data?.documents ?? []

  const handleUpload = async (files: File[]) => {
    // TODO: Replace with actual API call
    console.log('Uploading files:', files.map(f => f.name))
    toast(`Uploaded ${files.length} file(s) successfully!`)
  }

  const handleView = (docId: string, docName: string) => {
    console.log('Viewing document:', docId)
    toast(`Viewing: ${docName}`)
  }

  const handleDownload = (docId: string, docName: string) => {
    console.log('Downloading document:', docId)
    toast(`Downloading: ${docName}`)
  }

  const handleRetry = (docId: string, docName: string) => {
    console.log('Retrying document:', docId)
    toast(`Retrying processing for: ${docName}`)
  }
  return (
    <>
      <PageHeader title="Document Pipeline" subtitle="Upload, process, and manage client documents" />
      <Container className="space-y-3 py-8">
        {/* Upload Zone */}
        <DocumentUploadZone onUpload={handleUpload} />

        {/* Search and Filters */}
        <div className="flex items-center gap-4 flex-wrap pb-2">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-9 bg-card/50 border-border/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2 border-border/30"><Filter className="h-4 w-4" />Filters</Button>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Needs Review">Needs Review</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Error">Error</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="1120S">1120S</SelectItem>
              <SelectItem value="1040">1040</SelectItem>
              <SelectItem value="Schedule K-1">Schedule K-1</SelectItem>
              <SelectItem value="W-2">W-2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Documents Table */}
        <Card className="border-border/50 py-0">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="text-left p-2 font-medium">Document</th>
                      <th className="text-left p-2 font-medium">Client</th>
                      <th className="text-left p-2 font-medium">Type</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Confidence</th>
                      <th className="text-left p-2 font-medium">OCR Provider</th>
                      <th className="text-left p-2 font-medium">Uploaded</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="p-2">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-36" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                        </td>
                        <td className="p-2"><Skeleton className="h-4 w-32" /></td>
                        <td className="p-2"><Skeleton className="h-5 w-24 rounded-full" /></td>
                        <td className="p-2"><Skeleton className="h-5 w-20 rounded-full" /></td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-1.5 w-16 rounded-full" />
                            <Skeleton className="h-4 w-8" />
                          </div>
                        </td>
                        <td className="p-2"><Skeleton className="h-4 w-24" /></td>
                        <td className="p-2"><Skeleton className="h-4 w-20" /></td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <Skeleton className="h-7 w-7 rounded" />
                            <Skeleton className="h-7 w-7 rounded" />
                            <Skeleton className="h-7 w-7 rounded" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : !data?.documents.length ? (
              <Empty className="min-h-[300px]"><EmptyMedia variant="icon"><FileText className="h-8 w-8" /></EmptyMedia><EmptyHeader><EmptyTitle>No Documents</EmptyTitle><EmptyDescription>Upload documents to start processing.</EmptyDescription></EmptyHeader></Empty>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="text-left p-2 font-medium">Document</th>
                      <th className="text-left p-2 font-medium">Client</th>
                      <th className="text-left p-2 font-medium">Type</th>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Confidence</th>
                      <th className="text-left p-2 font-medium">OCR Provider</th>
                      <th className="text-left p-2 font-medium">Uploaded</th>
                      <th className="text-left p-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.documents.map((doc) => {
                      const cfg = statusConfig[doc.status]
                      const StatusIcon = cfg.icon
                      return (
                        <tr key={doc.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="p-2">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-muted"><FileText className="h-4 w-4 text-muted-foreground" /></div>
                              <div><p className="font-medium text-sm">{doc.name}</p><p className="text-xs text-muted-foreground">{doc.pages} pages</p></div>
                            </div>
                          </td>
                          <td className="p-2 text-sm">{doc.client}</td>
                          <td className="p-2"><Badge variant="outline" className="bg-muted border-border text-xs">{doc.type}</Badge></td>
                          <td className="p-2"><Badge variant="outline" className={cn("gap-1", cfg.className)}><StatusIcon className="h-3 w-3" />{doc.status}</Badge></td>
                          <td className="p-2"><ConfidenceBar value={doc.confidence} /></td>
                          <td className="p-2 text-sm text-muted-foreground">{doc.ocrProvider}</td>
                          <td className="p-2 text-sm text-muted-foreground">{doc.uploadedAt}</td>
                          <td className="p-2">
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 rounded hover:bg-accent"><Eye className="h-4 w-4" /></button>
                              {doc.status === 'Error' ? <button className="p-1.5 rounded hover:bg-accent"><RefreshCw className="h-4 w-4" /></button> :
                                <button className="p-1.5 rounded hover:bg-accent"><Download className="h-4 w-4" /></button>}
                              <button className="p-1.5 rounded hover:bg-accent"><MoreVertical className="h-4 w-4" /></button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
