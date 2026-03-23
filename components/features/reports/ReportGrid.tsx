import { ReportCard } from './ReportCard'
import type { ReportSummary } from '@/lib/types/reports'

export function ReportGrid({ reports }: { reports: ReportSummary[] }) {
  if (reports.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p style={{ fontSize: '1rem', color: 'var(--text-strong)', marginBottom: '0.5rem' }}>
          No tenés reportes asignados.
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-subtle)', margin: 0 }}>
          Contactá al administrador para solicitar acceso.
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
        alignItems: 'stretch',
      }}
    >
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  )
}
