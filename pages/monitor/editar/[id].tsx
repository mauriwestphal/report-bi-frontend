import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import MonitorForm, { MonitorFormValues } from "../../../components/pages/monitor/MonitorForm";
import { PageHeader } from "../../../components/shared/PageHeader";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { notify } from "../../../utils/toast";
import MonitorService from "../../../services/MonitorService/monitor";

const monitorSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  identifier: z.string().optional(),
  alias: z.string().min(1, "El alias es obligatorio"),
  url: z.string().min(1, "La URL es obligatoria"),
  description: z.string().max(550).optional(),
  isActive: z.boolean(),
  report_id: z.number().optional().nullable(),
  dashboardId: z.number().optional().nullable(),
});

const UpdateMonitorPage = () => {
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<MonitorFormValues>({
    resolver: zodResolver(monitorSchema),
    defaultValues: { isActive: true },
  });

  useEffect(() => {
    if (!query.id) return;
    setInitialLoading(true);
    MonitorService.getOneMonitor(Number(query.id))
      .then(({ data }) => {
        form.reset({
          ...data,
          report_id: isNaN(Number(data.report?.id)) ? null : Number(data.report?.id),
          dashboardId: isNaN(Number(data.dashboard?.id)) ? null : Number(data.dashboard?.id),
        });
      })
      .finally(() => setInitialLoading(false));
  }, [query.id]);

  const onFinish = async () => {
    const valid = await form.trigger();
    if (!valid) return;

    const values = form.getValues();
    const payload = {
      ...values,
      report_id: values.report_id ? parseInt(String(values.report_id)) : undefined,
      dashboardId: values.dashboardId ? parseInt(String(values.dashboardId)) : undefined,
    };

    setLoading(true);
    MonitorService.updateMonitor(payload as any)
      .then(() => notify.success("Monitor editado correctamente"))
      .catch((reason: any) => {
        if (reason?.status === 409) {
          notify.error("Ya existe un monitor con ese nombre, alias o URL.");
        } else {
          notify.error(reason?.message || "Error al editar el monitor");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Layout>
      <div className="max-w-2xl space-y-6">
        <PageHeader
          title="Editar Monitor"
          showBack
          backRoute="/monitor"
        />

        <div className="rounded-lg border border-border bg-card p-6">
          {initialLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <MonitorForm form={form} isEdit />
          )}

          <div className="flex gap-3 pt-6 mt-4 border-t border-border">
            <Button onClick={onFinish} disabled={loading || initialLoading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar Monitor
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateMonitorPage;
