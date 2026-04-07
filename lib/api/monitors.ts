import type { MonitorEmbed, MonitorList } from '@/lib/types/monitors'
import { IS_DEV_MODE, MOCK_MONITOR_EMBED } from '@/lib/mock-user'
import { apiFetch } from '@/lib/api'
import type { MonitorFormValues } from '@/lib/validations/monitor'

export async function getMonitors(): Promise<MonitorList[]> {
  return apiFetch<MonitorList[]>('/api/monitor', {
    cache: 'no-store'
  })
}

export async function getMonitorEmbed(id: string): Promise<MonitorEmbed> {
  if (IS_DEV_MODE) return MOCK_MONITOR_EMBED
  return apiFetch<MonitorEmbed>(`/api/monitor/${id}`, {
    cache: 'no-store'
  })
}

export async function getMonitorEmbedPublic(uuid: string): Promise<MonitorEmbed> {
  if (IS_DEV_MODE) return MOCK_MONITOR_EMBED
  return apiFetch<MonitorEmbed>(`/api/monitor/identifier/${uuid}`, {
    cache: 'no-store'
  })
}

export async function toggleMonitorActive(id: number): Promise<void> {
  await apiFetch<void>(`/api/monitor/updateEnableDesable/${id}`, {
    method: 'PATCH',
    cache: 'no-store',
  })
}

export async function deleteMonitor(id: number): Promise<void> {
  await apiFetch<void>(`/api/monitor/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  })
}

export async function createMonitor(data: MonitorFormValues): Promise<MonitorList> {
  return apiFetch<MonitorList>('/api/monitor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export async function updateMonitor(id: number, data: Partial<MonitorFormValues>): Promise<MonitorList> {
  return apiFetch<MonitorList>(`/api/monitor/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export async function getMonitor(id: number): Promise<MonitorList> {
  return apiFetch<MonitorList>(`/api/monitor/${id}`)
}

export async function getReportPages(): Promise<any[]> {
  return apiFetch<any[]>('/api/report-page')
}
