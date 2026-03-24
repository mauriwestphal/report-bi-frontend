import { useEffect, useState } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { Switch } from "../../../ui/switch";
import { Skeleton } from "../../../ui/skeleton";
import ZoneService from "../../../../services/ZoneService";

interface PowerBi {
  value: number;
  label: string;
}

export interface MonitorFormValues {
  name: string;
  identifier?: string;
  alias: string;
  url: string;
  description?: string;
  isActive: boolean;
  report_id?: number | null;
  dashboardId?: number | null;
}

interface MonitorFormProps {
  form: UseFormReturn<MonitorFormValues, any, any>;
  isEdit?: boolean;
}

const MonitorForm = ({ form, isEdit = false }: MonitorFormProps) => {
  const [reportOptions, setReportOptions] = useState<PowerBi[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  const { register, watch, setValue, formState: { errors } } = form;

  useEffect(() => {
    ZoneService.listReportBI()
      .then(({ data }) => setReportOptions(data))
      .catch(() => setReportOptions([]))
      .finally(() => setLoadingReports(false));
  }, []);

  const selectedReportId = watch("report_id");

  return (
    <div className="space-y-6">
      <p className="font-semibold text-sm">Información del Monitor</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" {...register("name")} disabled={isEdit} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* identifier */}
        <div className="space-y-1.5">
          <Label htmlFor="identifier">Identificador</Label>
          <Input
            id="identifier"
            {...register("identifier")}
            disabled
            className="font-mono text-center"
          />
        </div>

        {/* alias */}
        <div className="space-y-1.5">
          <Label htmlFor="alias">Alias</Label>
          <Input id="alias" {...register("alias")} disabled={isEdit} />
          {errors.alias && (
            <p className="text-xs text-destructive">{errors.alias.message}</p>
          )}
        </div>

        {/* url */}
        <div className="space-y-1.5">
          <Label htmlFor="url">URL</Label>
          <Input id="url" {...register("url")} disabled={isEdit} />
          {errors.url && (
            <p className="text-xs text-destructive">{errors.url.message}</p>
          )}
        </div>

        {/* description */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" rows={3} maxLength={550} {...register("description")} />
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

      <p className="font-semibold text-sm mt-6">
        ¿Qué sección quieres visualizar en este monitor?
      </p>

      <div className="space-y-2">
        <Label>Reportes BI</Label>
        {loadingReports ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-48" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {reportOptions
              .sort((a, b) => a.value - b.value)
              .map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="report_id"
                    value={option.value}
                    checked={selectedReportId === option.value}
                    onChange={() => setValue("report_id", option.value)}
                    className="accent-primary"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorForm;
