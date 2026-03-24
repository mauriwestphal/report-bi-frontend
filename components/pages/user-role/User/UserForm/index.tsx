import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Label } from "../../../../ui/label";
import { Input } from "../../../../ui/input";
import { Switch } from "../../../../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import { Skeleton } from "../../../../ui/skeleton";
import RoleService from "../../../../../services/RoleService";
import RoleInterface from "../../../../../shared/interfaces/Role.interface";

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  isActive?: boolean;
  roleId?: number;
}

interface UserFormProps {
  form: UseFormReturn<UserFormValues, any, any>;
}

const UserForm = ({ form }: UserFormProps) => {
  const [roles, setRoles] = useState<RoleInterface[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  const { register, watch, setValue, formState: { errors } } = form;

  useEffect(() => {
    setRolesLoading(true);
    RoleService.list({})
      .then(({ data }) => setRoles(data as RoleInterface[]))
      .finally(() => setRolesLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <p className="font-semibold text-sm">Información del usuario</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* firstName */}
        <div className="space-y-1.5">
          <Label htmlFor="firstName">Nombre</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        {/* lastName */}
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Apellido</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName.message}</p>
          )}
        </div>

        {/* email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* isActive */}
        <div className="flex items-center gap-3">
          <Switch
            checked={watch("isActive")}
            onCheckedChange={(v) => setValue("isActive", v)}
          />
          <Label>Estado: {watch("isActive") ? "Activo" : "Inactivo"}</Label>
        </div>
      </div>

      <p className="font-semibold text-sm mt-4">Asignación de perfil</p>

      <div className="space-y-1.5">
        <Label>Perfil</Label>
        {rolesLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select
            value={watch("roleId") ? String(watch("roleId")) : ""}
            onValueChange={(v) => setValue("roleId", Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar perfil" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={String(role.id)}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.roleId && (
          <p className="text-xs text-destructive">{errors.roleId.message}</p>
        )}
      </div>
    </div>
  );
};

export default UserForm;
