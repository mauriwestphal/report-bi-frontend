import { apiFetchServer } from '@/lib/api/server'
import type { MonitorEmbed, MonitorList } from '@/lib/types/monitors'
import { IS_DEV_MODE, MOCK_MONITOR_EMBED } from '@/lib/mock-user'

export async function getMonitors(): Promise<MonitorList[]> {
  return apiFetchServer<MonitorList[]>('/api/monitor')
}

export async function getMonitorEmbed(id: string): Promise<MonitorEmbed> {
  if (IS_DEV_MODE) return MOCK_MONITOR_EMBED
  return apiFetchServer<MonitorEmbed>(`/api/monitor/${id}`)
}

export async function getMonitorEmbedPublic(uuid: string): Promise<MonitorEmbed> {
  if (IS_DEV_MODE) return MOCK_MONITOR_EMBED
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/api/monitor/identifier/${uuid}`,
    { cache: 'no-store' }
  )
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function toggleMonitorActive(id: number): Promise<void> {
  return apiFetchServer<void>(`/api/monitor/updateEnableDesable/${id}`, {
    method: 'PATCH',
  })
}

export async function deleteMonitor(id: number): Promise<void> {
  return apiFetchServer<void>(`/api/monitor/${id}`, {
    method: 'DELETE',
  })
}
