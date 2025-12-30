// Dashboard Components - Production Ready with Three States
// Each component supports: 'loading' | 'empty' | 'data' states
// Use the `state` prop to control rendering, or pass empty data for automatic empty state

export type { DataState } from './stat-card'

// StatCard
export { StatCard, StatCardSkeleton, StatCardEmpty } from './stat-card'
export type { StatCardProps, StatCardData } from './stat-card'

// StrategyHeatmap
export { StrategyHeatmap, StrategyHeatmapSkeleton, StrategyHeatmapEmpty } from './strategy-heatmap'
export type { StrategyItem, StrategyHeatmapProps } from './strategy-heatmap'

// SavingsChart
export { SavingsChart, SavingsChartSkeleton, SavingsChartEmpty } from './savings-chart'
export type { SavingsDataPoint, SavingsChartData, SavingsChartProps } from './savings-chart'

// AdvisorTasks
export { AdvisorTasks, AdvisorTasksSkeleton, AdvisorTasksEmpty } from './advisor-tasks'
export type { Task, AdvisorTasksProps } from './advisor-tasks'

// DocumentPipeline
export { DocumentPipeline, DocumentPipelineSkeleton, DocumentPipelineEmpty } from './document-pipeline'
export type { PipelineDocument, DocumentPipelineProps } from './document-pipeline'

// ActiveClients
export { ActiveClients, ActiveClientsSkeleton, ActiveClientsEmpty } from './active-clients'
export type { Client, ActiveClientsProps } from './active-clients'

// RecentActivity
export { RecentActivity, RecentActivitySkeleton, RecentActivityEmpty } from './recent-activity'
export type { ActivityItem, RecentActivityProps } from './recent-activity'

// PageHeader
export { PageHeader } from './page-header'
export type { PageHeaderProps } from './page-header'
