import Link from 'next/link'
import type { ReportSummary } from '@/lib/types/reports'

export function ReportCard({ report }: { report: ReportSummary }) {
  return (
    <div
      className="uss-card"
      style={{ opacity: report.isActive ? 1 : 0.5, height: '100%' }}
    >
      <div
        className="uss-card__body"
        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-strong)', fontWeight: 600 }}>
            {report.name}
          </h3>
          <span
            style={{
              flexShrink: 0,
              fontSize: '0.75rem',
              fontWeight: 500,
              padding: '0.2rem 0.65rem',
              borderRadius: '999px',
              backgroundColor: report.isActive ? '#dcfce7' : 'var(--surface-subtle)',
              color: report.isActive ? '#15803d' : 'var(--text-subtle)',
            }}
          >
            {report.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: 'var(--text-subtle)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {report.description}
        </p>

        {report.isActive ? (
          <Link
            href={`/reports/${report.id}`}
            className="uss-btn uss-btn--primary"
            style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}
          >
            Ver reporte
          </Link>
        ) : (
          <button
            disabled
            className="uss-btn uss-btn--primary"
            style={{ alignSelf: 'flex-start', marginTop: '0.25rem', cursor: 'not-allowed' }}
          >
            Ver reporte
          </button>
        )}
      </div>
    </div>
  )
}
