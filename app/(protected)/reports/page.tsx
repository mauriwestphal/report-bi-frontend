import { getUserReportsServer } from '@/lib/api/reports'
import { ReportGrid } from '@/components/features/reports/ReportGrid'

export default async function ReportsPage() {
  try {
    const reports = await getUserReportsServer()
    return (
      <main style={{ padding: '2rem' }}>
        <h1 style={{ marginBottom: '1.5rem', color: 'var(--text-strong)' }}>Mis Reportes</h1>
        <ReportGrid reports={reports} />
      </main>
    )
  } catch {
    return (
      <main style={{ padding: '2rem' }}>
        <h1 style={{ marginBottom: '1.5rem', color: 'var(--text-strong)' }}>Mis Reportes</h1>
        <div className="uss-alert-message uss-alert-message--error" role="alert">
          <div className="uss-alert-message__content">
            <span className="uss-alert-message--error__title">
              No se pudieron cargar los reportes. Intentá nuevamente.
            </span>
          </div>
        </div>
      </main>
    )
  }
}
