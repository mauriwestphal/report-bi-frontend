import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout";
import UserForm, { UserFormValues } from "../../../../components/pages/user-role/User/UserForm";
import { PageHeader } from "../../../../components/shared/PageHeader";
import { Button } from "../../../../components/ui/button";
import { Skeleton } from "../../../../components/ui/skeleton";
import { notify } from "../../../../utils/toast";
import UserService from "../../../../services/UserService/services";

const userSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Ingresa un email válido"),
  isActive: z.boolean().optional(),
  roleId: z.number().optional(),
});

const UpdateUserPage = () => {
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { isActive: true },
  });

  useEffect(() => {
    if (!query.id) return;
    setInitialLoading(true);
    UserService.get(Number(query.id))
      .then(({ data }) => {
        setUserId(data.id!);
        form.reset({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          isActive: data.isActive,
          roleId: data.role?.id,
        });
      })
      .finally(() => setInitialLoading(false));
  }, [query.id]);

  const onFinish = async () => {
    const valid = await form.trigger();
    if (!valid) return;

    const values = form.getValues();
    const payload = {
      id: userId!,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      roleId: values.roleId,
      isActive: values.isActive,
    };

    setLoading(true);
    UserService.update(payload)
      .then(() => notify.success("Usuario editado correctamente"))
      .catch((reason: any) => {
        if (reason?.statusCode === 409 || reason?.status === 409) {
          notify.error("Ya existe un usuario con ese correo electrónico.");
        } else {
          notify.error(reason?.message || "Error al editar el usuario");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Layout>
      <div className="max-w-2xl space-y-6">
        <PageHeader
          title="Editar usuario"
          showBack
          backRoute="/user-role"
        />

        <div className="rounded-lg border border-border bg-card p-6">
          {initialLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <UserForm form={form} />
          )}

          <div className="flex gap-3 pt-6 mt-4 border-t border-border">
            <Button onClick={onFinish} disabled={loading || initialLoading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Editar usuario
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateUserPage;
