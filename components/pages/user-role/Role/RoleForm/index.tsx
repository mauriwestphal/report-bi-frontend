import { useEffect, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
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
import PermissionTree, { PermissionGroup } from "../../../../shared/Inputs/PermissionTree";
import PermissionService, { IPermissionGroup } from "../../../../../services/PermissionService";
import { IReportPage } from "../../../../layout/interfaces";
import { PERMISSION_TYPE } from "../../../../../shared/enum/permission.enum";

export interface RoleFormValues {
  name: string;
  keyName: string;
  isActive?: boolean;
  permissions?: number[];
  report?: number[];
  reportPages?: number[];
}

interface RoleFormProps {
  form: UseFormReturn<RoleFormValues, any, any>;
}

const extractNumericPart = (str: string): number => {
  const num = parseInt(str.split(".")[0]);
  return isNaN(num) ? Infinity : num;
};

const RoleForm = ({ form }: RoleFormProps) => {
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [reportPages, setReportPages] = useState<IReportPage[]>([]);
  const [reports, setReports] = useState<IReportPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [canViewReportsId, setCanViewReportsId] = useState<number | null>(null);

  const { register, watch, setValue, formState: { errors } } = form;

  const selectedPermissions = useWatch({ control: form.control, name: "permissions" }) ?? [];
  const selectedReportPages = useWatch({ control: form.control, name: "reportPages" }) ?? [];
  const selectedReports = useWatch({ control: form.control, name: "report" }) ?? [];

  useEffect(() => {
    setLoading(true);
    PermissionService.list()
      .then(({ data }) => {
        // Find CAN_VIEW_REPORTS permission ID
        const allPerms = (data as IPermissionGroup[]).flatMap((g) => g.permissions);
        const canView = allPerms.find((p) => p.keyName === PERMISSION_TYPE.CAN_VIEW_REPORTS);
        setCanViewReportsId(canView?.id ?? null);

        // Build groups for PermissionTree
        const groups: PermissionGroup[] = (data as IPermissionGroup[]).map((g) => ({
          name: g.groupName,
          permissions: g.permissions,
        }));
        setPermissionGroups(groups);
      })
      .finally(() => setLoading(false));

    PermissionService.listReportPage()
      .then(({ data }) => setReportPages(data))
      .catch(() => setReportPages([]));

    PermissionService.listReport()
      .then(({ data }) => setReports(data))
      .catch(() => setReports([]));
  }, []);

  // Watch CAN_VIEW_REPORTS toggle
  useEffect(() => {
    if (canViewReportsId === null) return;
    const hasViewReports = Array.isArray(selectedPermissions) &&
      selectedPermissions.includes(canViewReportsId);

    setShowReports((prev) => {
      if (prev && !hasViewReports) {
        setValue("reportPages", []);
        setValue("report", []);
      }
      return hasViewReports;
    });
  }, [selectedPermissions, canViewReportsId]);

  const filteredReportPages = reportPages.filter(
    (item) => !selectedReportPages.includes(item.value)
  );

  return (
    <div className="space-y-6">
      <p className="font-semibold text-sm">Asignaciones para el rol</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre del rol</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* keyName */}
        <div className="space-y-1.5">
          <Label htmlFor="keyName">Identificador (keyName)</Label>
          <Input id="keyName" placeholder="Ej: ADMIN, VIEWER" {...register("keyName")} />
          {errors.keyName && (
            <p className="text-xs text-destructive">{errors.keyName.message}</p>
          )}
        </div>

        {/* isActive */}
        <div className="flex items-center gap-3">
          <Switch
            checked={watch("isActive")}
            onCheckedChange={(v) => setValue("isActive", v)}
          />
          <Label>Activo: {watch("isActive") ? "Sí" : "No"}</Label>
        </div>
      </div>

      {/* Permissions tree */}
      <div className="space-y-2">
        <Label>Seleccione los permisos del perfil:</Label>
        <PermissionTree
          value={selectedPermissions as number[]}
          onChange={(ids) => setValue("permissions", ids)}
          groups={permissionGroups}
          loading={loading}
        />
      </div>

      {/* Reports section — only shown when CAN_VIEW_REPORTS is selected */}
      {showReports && (
        <div className="space-y-4">
          {/* Report filter */}
          <div className="space-y-1.5">
            <Label>Reportes</Label>
            <Select
              value=""
              onValueChange={(v) => {
                const id = Number(v);
                if (!selectedReports.includes(id)) {
                  setValue("report", [...(selectedReports as number[]), id]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por reporte" />
              </SelectTrigger>
              <SelectContent>
                {reports.map((r) => (
                  <SelectItem key={r.value} value={String(r.value)}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Selected reports chips */}
            {(selectedReports as number[]).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {(selectedReports as number[]).map((id) => {
                  const r = reports.find((x) => x.value === id);
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs"
                    >
                      {r?.label ?? id}
                      <button
                        type="button"
                        onClick={() =>
                          setValue("report", (selectedReports as number[]).filter((x) => x !== id))
                        }
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Report pages */}
          <div className="space-y-1.5">
            <Label>Páginas de reportes</Label>
            <Select
              value=""
              onValueChange={(v) => {
                const id = Number(v);
                if (!selectedReportPages.includes(id)) {
                  setValue("reportPages", [...selectedReportPages, id]);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Agregar páginas de reporte" />
              </SelectTrigger>
              <SelectContent>
                {filteredReportPages
                  .sort((a, b) => {
                    const an = extractNumericPart(a.label);
                    const bn = extractNumericPart(b.label);
                    return an - bn || a.label.localeCompare(b.label);
                  })
                  .map((rp) => (
                    <SelectItem key={rp.value} value={String(rp.value)}>
                      {rp.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {/* Selected report pages chips */}
            {selectedReportPages.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedReportPages.map((id) => {
                  const rp = reportPages.find((x) => x.value === id);
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs"
                    >
                      {rp?.label ?? id}
                      <button
                        type="button"
                        onClick={() =>
                          setValue("reportPages", selectedReportPages.filter((x) => x !== id))
                        }
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleForm;
