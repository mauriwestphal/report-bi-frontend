import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import Layout from "../../../../components/layout";
import UserForm, { UserFormValues } from "../../../../components/pages/user-role/User/UserForm";
import { PageHeader } from "../../../../components/shared/PageHeader";
import { Button } from "../../../../components/ui/button";
import { notify } from "../../../../utils/toast";
import UserService from "../../../../services/UserService/services";

const userSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Ingresa un email válido"),
  isActive: z.boolean().optional(),
  roleId: z.number().optional(),
});

const CreateUserPage = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { isActive: true },
  });

  const onFinish = async () => {
    const valid = await form.trigger();
    if (!valid) return;

    const values = form.getValues();
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      roleId: values.roleId!,
      isActive: values.isActive ?? true,
    };

    setLoading(true);
    UserService.create(payload)
      .then(() => {
        notify.success("Usuario creado correctamente!");
        form.reset({ isActive: true });
      })
      .catch((reason: any) => {
        if (reason?.statusCode === 409 || reason?.status === 409) {
          notify.error(
            "Ya existe un usuario con ese correo electrónico. Por favor verifica los datos."
          );
        } else {
          notify.error(reason?.message || "Error al crear el usuario");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Layout>
      <div className="max-w-2xl space-y-6">
        <PageHeader
          title="Crear nuevo usuario"
          showBack
          backRoute="/user-role"
        />

        <div className="rounded-lg border border-border bg-card p-6">
          <UserForm form={form} />

          <div className="flex gap-3 pt-6 mt-4 border-t border-border">
            <Button variant="outline" onClick={() => form.reset({ isActive: true })}>
              Limpiar
            </Button>
            <Button onClick={onFinish} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear nuevo usuario
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateUserPage;
