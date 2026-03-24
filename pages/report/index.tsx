import Layout from '../../components/layout';
import { PageHeader } from '../../components/shared/PageHeader';
import { ReportGrid } from '../../components/features/reports/ReportGrid';
import { ReportsSkeleton } from '../../components/features/reports/ReportsSkeleton';
import { useAppContext } from '../../context/AppContext';

export default function ReportPage() {
  const { user } = useAppContext();

  return (
    <Layout>
      <div className="space-y-4">
        <PageHeader title="Mis Reportes" />
        {!user ? (
          <ReportsSkeleton />
        ) : (
          <ReportGrid reports={[]} />
        )}
      </div>
    </Layout>
  );
}
