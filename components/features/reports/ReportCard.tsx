import Link from 'next/link'
import type { ReportSummary } from '@/lib/types/reports'

export function ReportCard({ report }: { report: ReportSummary }) {
  return (
    <div
      className={`border border-border rounded-lg bg-card p-4 h-full flex flex-col ${report.isActive ? '' : 'opacity-50'}`}
    >
      <div className="flex flex-col gap-3 h-full">
        <div className="flex justify-between items-start gap-2">
          <h3 className="m-0 text-base font-semibold text-foreground">
            {report.name}
          </h3>
          <span
            className={`flex-shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${
              report.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {report.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <p
          className="m-0 text-sm text-muted-foreground line-clamp-2 flex-1"
        >
          {report.description}
        </p>

        {report.isActive ? (
          <Link
            href={`/reports/${report.id}`}
            className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors self-start mt-1"
          >
            Ver reporte
          </Link>
        ) : (
          <button
            disabled
            className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md opacity-50 cursor-not-allowed self-start mt-1"
          >
            Ver reporte
          </button>
        )}
      </div>
    </div>
  )
}
