import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Layout from "../../../components/layout";
import RoleForm, { RoleFormValues } from "../../../components/pages/user-role/Role/RoleForm";
import { PageHeader } from "../../../components/shared/PageHeader";
import { Button } from "../../../components/ui/button";
import { notify } from "../../../utils/toast";
import RoleService from "../../../services/RoleService";

const roleSchema = z.object({
  name: z.string().min(1, "Campo requerido"),
  keyName: z.string().min(1, "Campo requerido"),
  isActive: z.boolean().optional(),
  permissions: z.array(z.number()).optional(),
  report: z.array(z.number()).optional(),
  reportPages: z.array(z.number()).optional(),
});

export default function CreateRolePage() {
  const [loading, setLoading] = useState(false);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { isActive: true, permissions: [], report: [], reportPages: [] },
  });

  const onFinish = async () => {
    const valid = await form.trigger(["name", "keyName"]);
    if (!valid) return;

    try {
      setLoading(true);
      const values = form.getValues();
      await RoleService.create({
        name: values.name,
        keyName: values.keyName,
        isActive: !!values.isActive,
        permissionIds: values.permissions || [],
        reportPageIds: values.reportPages || [],
      });
      notify.success("Rol creado exitosamente.");
      form.reset({ isActive: true, permissions: [], report: [], reportPages: [] });
    } catch (err: any) {
      notify.error(err?.message || "Error al crear el rol");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl space-y-6">
        <PageHeader
          title="Crear nuevo rol"
          showBack
          backRoute="/roles"
        />

        <div className="rounded-lg border border-border bg-card p-6">
          <RoleForm form={form} />

          <div className="flex gap-3 pt-6 mt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => form.reset({ isActive: true, permissions: [], report: [], reportPages: [] })}
            >
              Limpiar
            </Button>
            <Button onClick={onFinish} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear nuevo rol
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
