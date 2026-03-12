import { apiFetch } from '@/lib/api'
import { apiFetchServer } from '@/lib/api/server'
import { IS_DEV_MODE, MOCK_REPORTS } from '@/lib/mock-user'
import type { ReportSummary } from '@/lib/types/reports'

export async function getUserReports(): Promise<ReportSummary[]> {
  return apiFetch<ReportSummary[]>('/api/monitor/report/user')
}

export async function getUserReportsServer(): Promise<ReportSummary[]> {
  if (IS_DEV_MODE) return MOCK_REPORTS
  return apiFetchServer<ReportSummary[]>('/api/monitor/report/user')
}
