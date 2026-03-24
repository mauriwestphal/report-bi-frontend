import { ReportsSkeleton } from '@/components/features/reports/ReportsSkeleton'

export default function ReportsLoading() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--text-strong)' }}>Mis Reportes</h1>
      <ReportsSkeleton />
    </main>
  )
}
