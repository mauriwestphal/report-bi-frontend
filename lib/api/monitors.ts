import { apiFetchServer } from '@/lib/api/server'
import type { MonitorEmbed } from '@/lib/types/monitors'
import { IS_DEV_MODE, MOCK_MONITOR_EMBED } from '@/lib/mock-user'

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
