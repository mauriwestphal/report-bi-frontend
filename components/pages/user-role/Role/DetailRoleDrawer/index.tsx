import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../../../../ui/sheet";
import { ScrollArea } from "../../../../ui/scroll-area";
import { Skeleton } from "../../../../ui/skeleton";
import { Button } from "../../../../ui/button";
import { cn } from "@/lib/utils";
import RoleService from "../../../../../services/RoleService";
import { IPermission, IReportPage, RoleInterface } from "../../../../layout/interfaces";

interface IPermissionGroup {
  groupName: string;
  permissions: IPermission[];
}

const groupPermissions = (permissions: IPermission[]): IPermissionGroup[] => {
  const map: Record<string, IPermission[]> = {};
  permissions.forEach((p) => {
    const group = p.groupName || "General";
    if (!map[group]) map[group] = [];
    map[group].push(p);
  });
  return Object.entries(map).map(([groupName, perms]) => ({ groupName, permissions: perms }));
};

interface IDetailRoleDrawerProps {
  id: number | null;
  onClose: () => void;
}

const DetailRoleDrawer = ({ id, onClose }: IDetailRoleDrawerProps) => {
  const [role, setRole] = useState<RoleInterface | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setRole(null);
      return;
    }
    setLoading(true);
    RoleService.findOne(id)
      .then(({ data }) => setRole(data))
      .finally(() => setLoading(false));
  }, [id]);

  const permissionGroups = role?.permissions ? groupPermissions(role.permissions) : [];

  return (
    <Sheet open={!!id} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>{loading ? "Cargando..." : role?.name ?? "Detalle de rol"}</SheetTitle>
          {role && (
            <SheetDescription>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  role.isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {role.isActive ? "Activo" : "Inactivo"}
              </span>
            </SheetDescription>
          )}
        </SheetHeader>

        <ScrollArea className="flex-1 mt-4 pr-2">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Permisos asignados</p>

              {permissionGroups.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin permisos asignados.</p>
              ) : (
                permissionGroups.map((group) => (
                  <div
                    key={group.groupName}
                    className="rounded-md border border-border p-3"
                  >
                    <p className="font-semibold text-sm mb-2 capitalize">{group.groupName}</p>
                    <ul className="space-y-1">
                      {group.permissions.map((perm) => (
                        <li key={perm.id} className="text-sm text-muted-foreground">
                          • {perm.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}

              {role?.reportPages && role.reportPages.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Páginas de reporte
                  </p>
                  <div className="rounded-md border border-border p-3">
                    <ul className="space-y-1">
                      {role.reportPages.map((rp: IReportPage) => (
                        <li key={rp.value ?? rp.id} className="text-sm text-muted-foreground">
                          • {rp.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="pt-4 border-t border-border">
          <Button onClick={onClose} className="w-full">
            Cerrar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DetailRoleDrawer;
