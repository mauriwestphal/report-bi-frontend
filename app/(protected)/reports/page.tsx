import { getUserReportsServer } from '@/lib/api/reports'
import { ReportGrid } from '@/components/features/reports/ReportGrid'

export default async function ReportsPage() {
  try {
    const reports = await getUserReportsServer()
    return (
      <main className="p-8">
        <h1 className="mb-6 text-foreground text-xl font-semibold">Mis Reportes</h1>
        <ReportGrid reports={reports} />
      </main>
    )
  } catch {
    return (
      <main className="p-8">
        <h1 className="mb-6 text-foreground text-xl font-semibold">Mis Reportes</h1>
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
