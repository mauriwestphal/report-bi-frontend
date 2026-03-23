import { getMonitorEmbed } from '@/lib/api/monitors'
import { PowerBiViewer } from '@/components/features/powerbi/PowerBiViewer'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ReportViewerPage({ params }: Props) {
  const { id } = await params

  try {
    const monitor = await getMonitorEmbed(id)
    return <PowerBiViewer monitor={monitor} isPublic={false} />
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
