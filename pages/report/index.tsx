import { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import { PageHeader } from '../../components/shared/PageHeader';
import { ReportGrid } from '../../components/features/reports/ReportGrid';
import { ReportsSkeleton } from '../../components/features/reports/ReportsSkeleton';
import { getUserReports } from '../../lib/api/reports';
import type { ReportSummary } from '../../lib/types/reports';

export default function ReportPage() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getUserReports()
      .then(setReports)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="space-y-4">
        <PageHeader title="Mis Reportes" />
        {loading ? (
          <ReportsSkeleton />
        ) : error ? (
          <p className="text-sm text-destructive">
            No se pudieron cargar los reportes. Intentá nuevamente.
          </p>
        ) : (
          <ReportGrid reports={reports} />
        )}
      </div>
    </Layout>
  );
}
