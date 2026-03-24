import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { Loader2, AlertTriangle } from "lucide-react";
import Layout from "../../../components/layout";
import MonitorForm, { MonitorFormValues } from "../../../components/pages/monitor/MonitorForm";
import { PageHeader } from "../../../components/shared/PageHeader";
import { Button } from "../../../components/ui/button";
import { ConfirmDialog } from "../../../components/shared/ConfirmDialog";
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

const CreateMonitorPage = () => {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const form = useForm<MonitorFormValues>({
    resolver: zodResolver(monitorSchema),
    defaultValues: { isActive: true, identifier: uuidv4() },
  });

  const onSubmit = async () => {
    const valid = await form.trigger();
    if (!valid) return;
    setConfirmOpen(true);
  };

  const onSaveMonitor = async () => {
    setConfirmOpen(false);
    const values = form.getValues();
    const payload = {
      ...values,
      report_id: values.report_id ? parseInt(String(values.report_id)) : undefined,
      dashboardId: values.dashboardId ? parseInt(String(values.dashboardId)) : undefined,
    };

    setLoading(true);
    MonitorService.createMonitor(payload)
      .then(() => {
        notify.success("Monitor creado correctamente");
        form.reset({ isActive: true, identifier: uuidv4() });
      })
      .catch((reason: any) => {
        if (reason?.status === 409) {
          notify.error("Ya existe un monitor con ese nombre, alias o URL.");
        } else {
          notify.error(reason?.message || "Error al crear el monitor");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Layout>
      <div className="max-w-2xl space-y-6">
        <PageHeader
          title="Crear nuevo Monitor"
          showBack
          backRoute="/monitor"
        />

        <div className="rounded-lg border border-border bg-card p-6">
          <MonitorForm form={form} />

          <div className="flex gap-3 pt-6 mt-4 border-t border-border">
            <Button variant="outline" onClick={() => form.reset()}>
              Limpiar
            </Button>
            <Button onClick={onSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear nuevo Monitor
            </Button>
          </div>
        </div>
      </div>

      {/* Warning confirm dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirmar publicación de monitor"
        description="Está a punto de crear un vínculo público. Cualquier persona en Internet con este vínculo podrá acceder al informe y sus datos. Asegúrese de que tiene derecho a compartir esta información públicamente."
        onConfirm={onSaveMonitor}
        confirmLabel="Crear monitor"
        cancelLabel="Cancelar"
      />
    </Layout>
  );
};

export default CreateMonitorPage;
