import { getUserReportsServer } from '@/lib/api/reports'
import { ReportGrid } from '@/components/features/reports/ReportGrid'
import { PageHeader } from '@/components/layout/PageHeader'

export default async function ReportsPage() {
  try {
    const reports = await getUserReportsServer()
    return (
      <main className="p-8">
        <PageHeader title="Mis Reportes" />
        <ReportGrid reports={reports} />
      </main>
    )
  } catch {
    return (
      <main className="p-8">
        <PageHeader title="Mis Reportes" />
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200" role="alert">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              No se pudieron cargar los reportes. Intentá nuevamente.
            </span>
          </div>
        </div>
      </main>
    )
  }
}
