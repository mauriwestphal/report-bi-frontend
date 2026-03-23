import { getMonitorEmbed, getMonitorEmbedPublic } from '@/lib/api/monitors'
import { PowerBiViewer } from '@/components/features/powerbi/PowerBiViewer'

interface Props {
  params: Promise<{ id: string }>
}

export default async function MonitorReportPage({ params }: Props) {
  const { id } = await params
  const isUuid = /^[0-9a-f-]{36}$/i.test(id)

  try {
    const monitor = isUuid
      ? await getMonitorEmbedPublic(id)
      : await getMonitorEmbed(id)

    return <PowerBiViewer monitor={monitor} isPublic={isUuid} />
  } catch {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 64px)',
          color: 'var(--text-subtle)',
          fontSize: '0.9375rem',
        }}
      >
        No se pudo cargar el reporte.
      </div>
    )
  }
}
