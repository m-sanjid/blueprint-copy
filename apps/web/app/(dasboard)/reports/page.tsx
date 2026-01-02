"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@workspace/ui/components/card'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from '@workspace/ui/components/empty'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@workspace/ui/components/chart'
import { BarChart, Bar, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid } from 'recharts'
import { FileText, Download, Calendar, Loader2, Eye, Trash2, RefreshCw } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Container } from '@/components/core/container'
import { PageHeader, StatCard, type DataState } from '@/components/page/dashboard'
import { IconPlus } from '@tabler/icons-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { Label } from '@workspace/ui/components/label'
import { Input } from '@workspace/ui/components/input'
import { PrimaryButton } from '@workspace/ui/components/primary-button'

// ============================================
// Types
// ============================================

interface Report {
  id: string
  name: string
  type: string
  generatedAt: string
  status: 'ready' | 'generating' | 'failed'
  size: string
  downloads: number
}

interface ReportData {
  totalReports: number
  generatedThisMonth: { value: number; change: number }
  totalRevenue: { value: number; change: number }
  reportTypes: Array<{ type: string; count: number; color: string }>
  revenueByCategory: Array<{ category: string; revenue: number; color: string }>
  monthlyReports: Array<{ month: string; generated: number; downloaded: number }>
  reportTrends: Array<{ month: string; value: number }>
  recentReports: Report[]
}

// ============================================
// API Functions - Replace with actual API calls
// ============================================

async function fetchReportData(): Promise<ReportData> {
  // TODO: Replace with actual API call
  // return await fetch('/api/reports').then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 1500))
  return generateMockData()
}

async function generateReport(type: string, dateRange: string, client?: string): Promise<{ success: boolean; report: Report }> {
  // TODO: Replace with actual API call
  // return await fetch('/api/reports/generate', { method: 'POST', body: JSON.stringify({ type, dateRange, client }) }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 2000))
  console.log('Generating report:', { type, dateRange, client })
  const newReport: Report = {
    id: Math.random().toString(36).substr(2, 9),
    name: `${type} - ${new Date().toLocaleDateString()}`,
    type,
    generatedAt: 'Just now',
    status: 'ready',
    size: '1.2 MB',
    downloads: 0
  }
  return { success: true, report: newReport }
}

async function downloadReport(id: string, name: string): Promise<void> {
  // TODO: Replace with actual API call
  // const blob = await fetch(`/api/reports/${id}/download`).then(res => res.blob())
  // const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click()
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('Downloading report:', id, name)
}

async function deleteReport(id: string): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  // return await fetch(`/api/reports/${id}`, { method: 'DELETE' }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('Deleting report:', id)
  return { success: true }
}

async function retryReport(id: string): Promise<{ success: boolean }> {
  // TODO: Replace with actual API call
  // return await fetch(`/api/reports/${id}/retry`, { method: 'POST' }).then(res => res.json())
  await new Promise(resolve => setTimeout(resolve, 1000))
  console.log('Retrying report:', id)
  return { success: true }
}

// ============================================
// Mock Data Generator
// ============================================

const generateMockData = (): ReportData => ({
  totalReports: 1247,
  generatedThisMonth: { value: 89, change: 12.5 },
  totalRevenue: { value: 3450000, change: 18.3 },
  reportTypes: [
    { type: 'Financial Summary', count: 456, color: '#10b981' },
    { type: 'Tax Reports', count: 342, color: '#0ea5e9' },
    { type: 'Revenue Analysis', count: 289, color: '#a855f7' },
    { type: 'Expense Reports', count: 160, color: '#f97316' }
  ],
  revenueByCategory: [
    { category: 'Services', revenue: 1850000, color: '#10b981' },
    { category: 'Products', revenue: 980000, color: '#0ea5e9' },
    { category: 'Consulting', revenue: 420000, color: '#a855f7' },
    { category: 'Other', revenue: 200000, color: '#eab308' }
  ],
  monthlyReports: (() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return Array.from({ length: 12 }, (_, i) => ({
      month: months[i]!,
      generated: Math.floor(Math.random() * 50 + 20),
      downloaded: Math.floor(Math.random() * 45 + 15)
    }))
  })(),
  reportTrends: (() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return Array.from({ length: 12 }, (_, i) => ({
      month: months[i]!,
      value: Math.random() * 100 + 50
    }))
  })(),
  recentReports: [
    { id: '1', name: 'Q4 Financial Summary 2024', type: 'Financial Summary', generatedAt: '2 hours ago', status: 'ready', size: '2.4 MB', downloads: 12 },
    { id: '2', name: 'Annual Tax Report 2024', type: 'Tax Reports', generatedAt: '1 day ago', status: 'ready', size: '5.8 MB', downloads: 8 },
    { id: '3', name: 'Monthly Revenue Analysis - November', type: 'Revenue Analysis', generatedAt: '2 days ago', status: 'ready', size: '1.2 MB', downloads: 15 },
    { id: '4', name: 'Expense Report Q3 2024', type: 'Expense Reports', generatedAt: '3 days ago', status: 'ready', size: '3.1 MB', downloads: 6 },
    { id: '5', name: 'Client Revenue Breakdown', type: 'Revenue Analysis', generatedAt: '5 days ago', status: 'ready', size: '892 KB', downloads: 9 }
  ]
})

// ============================================
// Custom Hook
// ============================================

function useReportData() {
  const [state, setState] = useState<DataState>('loading')
  const [data, setData] = useState<ReportData | null>(null)

  const refetch = useCallback(async () => {
    setState('loading')
    try {
      const result = await fetchReportData()
      setData(result)
      setState('data')
    } catch (error) {
      console.error('Failed to fetch reports:', error)
      setState('empty')
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { state, data, setData, refetch }
}

// ============================================
// Component
// ============================================

const Reports = () => {
  const { state, data, setData, refetch } = useReportData()
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportType, setReportType] = useState('')
  const [dateRange, setDateRange] = useState('this-month')
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set())

  const isLoading = state === 'loading'

  // ============================================
  // Handlers
  // ============================================

  const handleGenerateReport = async () => {
    if (!reportType) {
      toast.error('Please select a report type')
      return
    }
    setIsGenerating(true)
    try {
      const result = await generateReport(reportType, dateRange)
      if (result.success) {
        setData(prev => prev ? {
          ...prev,
          recentReports: [result.report, ...prev.recentReports],
          generatedThisMonth: { ...prev.generatedThisMonth, value: prev.generatedThisMonth.value + 1 },
          totalReports: prev.totalReports + 1
        } : null)
        toast.success('Report generated successfully!', {
          description: `${reportType} report is ready for download.`
        })
        setGenerateDialogOpen(false)
        setReportType('')
      }
    } catch (error) {
      toast.error('Failed to generate report')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async (report: Report) => {
    setDownloadingIds(prev => new Set(prev).add(report.id))
    try {
      await downloadReport(report.id, report.name)
      setData(prev => prev ? {
        ...prev,
        recentReports: prev.recentReports.map(r =>
          r.id === report.id ? { ...r, downloads: r.downloads + 1 } : r
        )
      } : null)
      toast.success(`Downloaded: ${report.name}`)
    } catch (error) {
      toast.error('Download failed')
      console.error(error)
    } finally {
      setDownloadingIds(prev => {
        const next = new Set(prev)
        next.delete(report.id)
        return next
      })
    }
  }

  const handleDelete = async (report: Report) => {
    try {
      const result = await deleteReport(report.id)
      if (result.success) {
        setData(prev => prev ? {
          ...prev,
          recentReports: prev.recentReports.filter(r => r.id !== report.id),
          totalReports: prev.totalReports - 1
        } : null)
        toast.success(`Deleted: ${report.name}`)
      }
    } catch (error) {
      toast.error('Failed to delete report')
      console.error(error)
    }
  }

  const handleRetry = async (report: Report) => {
    setData(prev => prev ? {
      ...prev,
      recentReports: prev.recentReports.map(r =>
        r.id === report.id ? { ...r, status: 'generating' as const } : r
      )
    } : null)

    try {
      const result = await retryReport(report.id)
      if (result.success) {
        setData(prev => prev ? {
          ...prev,
          recentReports: prev.recentReports.map(r =>
            r.id === report.id ? { ...r, status: 'ready' as const } : r
          )
        } : null)
        toast.success('Report regenerated successfully!')
      }
    } catch (error) {
      setData(prev => prev ? {
        ...prev,
        recentReports: prev.recentReports.map(r =>
          r.id === report.id ? { ...r, status: 'failed' as const } : r
        )
      } : null)
      toast.error('Failed to regenerate report')
      console.error(error)
    }
  }

  const handleView = (report: Report) => {
    toast.info(`Viewing: ${report.name}`, {
      description: 'Report viewer coming soon!'
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ready': return 'default'
      case 'generating': return 'secondary'
      case 'failed': return 'destructive'
      default: return 'outline'
    }
  }

  // Chart config
  const chartConfig = {
    generated: { label: 'Generated', color: 'hsl(var(--chart-1))' },
    downloaded: { label: 'Downloaded', color: 'hsl(var(--chart-3))' },
    value: { label: 'Value', color: 'hsl(var(--chart-4))' }
  }

  return (
    <>
      {/* Generate Report Dialog */}
      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
            <DialogDescription>Select the type and date range for your report.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Financial Summary">Financial Summary</SelectItem>
                  <SelectItem value="Tax Reports">Tax Reports</SelectItem>
                  <SelectItem value="Revenue Analysis">Revenue Analysis</SelectItem>
                  <SelectItem value="Expense Reports">Expense Reports</SelectItem>
                  <SelectItem value="Client Portfolio">Client Portfolio</SelectItem>
                  <SelectItem value="Strategy Performance">Strategy Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateDialogOpen(false)} disabled={isGenerating}>
              Cancel
            </Button>
            <PrimaryButton onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</>
              ) : (
                <><IconPlus className="h-4 w-4 mr-2" />Generate Report</>
              )}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PageHeader
        title="Reports"
        subtitle="Generate and manage your financial reports"
        primaryAction={{ label: 'Generate Report', onClick: () => setGenerateDialogOpen(true), icon: <IconPlus className="h-4 w-4 mr-2" /> }}
      />
      <Container className="space-y-3 py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard state={state} title="Generated This Month" value={data?.generatedThisMonth.value} change={data?.generatedThisMonth.change} />
          <StatCard state={state} title="Total Revenue" value={data ? `$${data.totalRevenue.value.toLocaleString()}` : undefined} change={data?.totalRevenue.change} />
          <StatCard state={state} title="Total Reports" value={data?.totalReports} change={8.5} />
        </div>

        {/* Charts Row */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/40">
              <CardHeader><CardTitle>Reports by Type</CardTitle><CardDescription>Distribution of report types</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between"><Skeleton className="h-4 w-28" /><Skeleton className="h-4 w-8" /></div>
                    <Skeleton className="h-3 w-full rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-border/40">
              <CardHeader><CardTitle>Revenue by Category</CardTitle><CardDescription>Revenue breakdown</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></div>
                    <Skeleton className="h-3 w-full rounded-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : data ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/40">
              <CardHeader><CardTitle>Reports by Type</CardTitle><CardDescription>Distribution of report types</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.reportTypes.map((type, index) => {
                    const maxTypeCount = Math.max(...data.reportTypes.map(t => t.count))
                    const percentage = (type.count / maxTypeCount) * 100
                    return (
                      <div key={index} className="space-y-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => toast.info(`${type.type}: ${type.count} reports`)}>
                        <div className="flex items-center justify-between text-sm"><span>{type.type}</span><span className="font-medium">{type.count}</span></div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: type.color }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/40">
              <CardHeader><CardTitle>Revenue by Category</CardTitle><CardDescription>Revenue breakdown</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.revenueByCategory.map((category, index) => {
                    const totalRevenue = data.revenueByCategory.reduce((sum, cat) => sum + cat.revenue, 0)
                    const percentage = (category.revenue / totalRevenue) * 100
                    return (
                      <div key={index} className="space-y-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => toast.info(`${category.category}: $${category.revenue.toLocaleString()}`)}>
                        <div className="flex items-center justify-between text-sm"><span>{category.category}</span><span className="font-medium">${category.revenue.toLocaleString()}</span></div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: category.color }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Activity Charts */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/40"><CardHeader><CardTitle>Monthly Reports</CardTitle><CardDescription>Generated vs downloaded</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
            <Card className="border-border/40"><CardHeader><CardTitle>Report Trends</CardTitle><CardDescription>Monthly report generation trends</CardDescription></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
          </div>
        ) : data ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/40">
              <CardHeader><CardTitle>Monthly Reports</CardTitle><CardDescription>Generated vs downloaded</CardDescription></CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart data={data.monthlyReports}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="generated" radius={[4, 4, 0, 0]}>
                      {data.monthlyReports.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === data.monthlyReports.length - 5 ? 'hsl(var(--chart-1))' : 'hsl(var(--muted))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="border-border/40">
              <CardHeader><CardTitle>Report Trends</CardTitle><CardDescription>Monthly report generation trends</CardDescription></CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <LineChart data={data.reportTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Recent Reports */}
        {isLoading ? (
          <Card className="border-border/40">
            <CardHeader><CardTitle>Recent Reports</CardTitle><CardDescription>Latest generated reports</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2"><Skeleton className="h-4 w-48" /><Skeleton className="h-5 w-14 rounded-full" /></div>
                      <div className="flex items-center gap-4"><Skeleton className="h-3 w-24" /><Skeleton className="h-3 w-20" /><Skeleton className="h-3 w-16" /></div>
                    </div>
                  </div>
                  <Skeleton className="h-8 w-24 rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : data ? (
          <Card className="border-border/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Recent Reports</CardTitle><CardDescription>Latest generated reports</CardDescription></div>
                <Button variant="outline" size="sm" onClick={refetch}><RefreshCw className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-muted rounded-lg"><FileText className="h-4 w-4" /></div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{report.name}</p>
                          <Badge variant={getStatusBadgeVariant(report.status)} className="text-xs">
                            {report.status === 'generating' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                            {report.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{report.type}</span><span>•</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{report.generatedAt}</span>
                          <span>•</span><span>{report.size}</span><span>•</span><span>{report.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.status === 'ready' && (
                        <Button variant="outline" size="sm" onClick={() => handleDownload(report)} disabled={downloadingIds.has(report.id)}>
                          {downloadingIds.has(report.id) ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Download className="h-4 w-4 mr-2" />Download</>}
                        </Button>
                      )}
                      {report.status === 'failed' && (
                        <Button variant="outline" size="sm" onClick={() => handleRetry(report)}>
                          <RefreshCw className="h-4 w-4 mr-2" />Retry
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(report)}><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                          {report.status === 'ready' && <DropdownMenuItem onClick={() => handleDownload(report)}><Download className="h-4 w-4 mr-2" />Download</DropdownMenuItem>}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(report)} className="text-red-500 focus:text-red-500"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </Container>
    </>
  )
}

export default Reports
