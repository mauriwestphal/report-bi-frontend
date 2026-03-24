import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import RoleForm, { RoleFormValues } from "../../../components/pages/user-role/Role/RoleForm";
import { PageHeader } from "../../../components/shared/PageHeader";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
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

const EditRolePage = () => {
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { isActive: true, permissions: [], report: [], reportPages: [] },
  });

  useEffect(() => {
    if (!query?.id) return;
    setInitialLoading(true);
    RoleService.findOne(Number(query.id))
      .then(({ data }) => {
        form.reset({
          name: data.name,
          keyName: data.keyName ?? "",
          isActive: data.isActive ?? true,
          permissions: data.permissions?.map((p) => p.id) ?? [],
          report: [],
          reportPages: data.reportPages?.map((rp) => rp.value) ?? [],
        });
      })
      .finally(() => setInitialLoading(false));
  }, [query.id]);

  const onFinish = async () => {
    const valid = await form.trigger(["name", "keyName"]);
    if (!valid) return;

    try {
      setLoading(true);
      const values = form.getValues();
      await RoleService.update({
        id: Number(query.id),
        name: values.name,
        keyName: values.keyName,
        isActive: !!values.isActive,
        permissionIds: values.permissions || [],
        reportPageIds: values.reportPages || [],
      });
      notify.success("Rol actualizado exitosamente.");
    } catch (err: any) {
      notify.error(err?.message || "Error al actualizar el rol");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl space-y-6">
        <PageHeader
          title="Editar rol"
          showBack
          backRoute="/roles"
        />

        <div className="rounded-lg border border-border bg-card p-6">
          {initialLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <RoleForm form={form} />
          )}

          <div className="flex gap-3 pt-6 mt-4 border-t border-border">
            <Button onClick={onFinish} disabled={loading || initialLoading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar cambios
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditRolePage;
