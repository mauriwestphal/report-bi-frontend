import type { MonitorEmbed, MonitorList } from '@/lib/types/monitors'
import { IS_DEV_MODE, MOCK_MONITOR_EMBED } from '@/lib/mock-user'

export async function getMonitors(): Promise<MonitorList[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/api/monitor`,
    { cache: 'no-store' }
  )
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function getMonitorEmbed(id: string): Promise<MonitorEmbed> {
  if (IS_DEV_MODE) return MOCK_MONITOR_EMBED
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/api/monitor/${id}`,
    { cache: 'no-store' }
  )
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/api/monitor/updateEnableDesable/${id}`,
    {
      method: 'PATCH',
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error(`API error: ${res.status}`)
}

export async function deleteMonitor(id: number): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/api/monitor/${id}`,
    {
      method: 'DELETE',
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error(`API error: ${res.status}`)
}
