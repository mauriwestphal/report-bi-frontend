import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Pencil, Trash2, MoreHorizontal, Copy, Eye } from "lucide-react";
import { Button } from "../../ui/button";
import { Skeleton } from "../../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { ConfirmDialog } from "../../shared/ConfirmDialog";
import { cn } from "@/lib/utils";
import { notify } from "../../../utils/toast";
import MonitorService from "../../../services/MonitorService/monitor";
import { useAppContext } from "../../../context/AppContext";
import { PERMISSION_TYPE } from "../../../shared/enum/permission.enum";
import { MonitorInterface, MonitorInterfaceItem } from "../../layout/interfaces";
import { ListMonitor } from "../../../services/interfaces/List.interface";
import { getValidatedItems } from "../../../utils/validatedItems";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";

interface Props {
  search?: string;
}

const PAGE_SIZE = 10;

const Monitor = ({ search }: Props) => {
  const router = useRouter();
  const { user } = useAppContext();
  const [monitors, setMonitors] = useState<MonitorInterface[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: MonitorInterface | null }>({ open: false, item: null });
  const [enableDialog, setEnableDialog] = useState<{ open: boolean; item: MonitorInterface | null }>({ open: false, item: null });
  const [urlDialog, setUrlDialog] = useState<{ open: boolean; url: string }>({ open: false, url: "" });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchMonitors = (params: ListMonitor) => {
    setLoading(true);
    MonitorService.listMonitor(params)
      .then(({ data }) => {
        setMonitors(data.monitors.sort((a: any, b: any) => b?.id - a?.id));
        setTotal(data.total ?? data.monitors.length);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setPage(1);
    fetchMonitors({ search, limit: PAGE_SIZE, offset: 0 });
  }, [search]);

  const changePage = (newPage: number) => {
    setPage(newPage);
    fetchMonitors({ search, limit: PAGE_SIZE, offset: (newPage - 1) * PAGE_SIZE });
  };

  const onEnableDisable = async () => {
    if (!enableDialog.item) return;
    try {
      setLoading(true);
      await MonitorService.updateEnableDesable(enableDialog.item.id!);
      notify.success(
        `Monitor ${!enableDialog.item.isActive ? "activado" : "desactivado"} exitosamente!`
      );
      fetchMonitors({ search, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
    } catch {
      setLoading(false);
      notify.error("Ocurrió un error al actualizar el monitor.");
    } finally {
      setEnableDialog({ open: false, item: null });
    }
  };

  const onDeleteMonitor = async () => {
    if (!deleteDialog.item) return;
    try {
      setLoading(true);
      await MonitorService.deleteMonitor(deleteDialog.item.id!);
      notify.success("Monitor eliminado exitosamente!");
      const newPage = monitors.length === 1 && page > 1 ? page - 1 : page;
      setPage(newPage);
      fetchMonitors({ search, limit: PAGE_SIZE, offset: (newPage - 1) * PAGE_SIZE });
    } catch {
      setLoading(false);
      notify.error("Ocurrió un error al eliminar el monitor.");
    } finally {
      setDeleteDialog({ open: false, item: null });
    }
  };

  const getAssignedSection = (item: MonitorInterfaceItem) => {
    if (item.report) return `Reporte BI - ${item.report.name}`;
    if (item.dashboard) return `Dashboard 360 - ${item.dashboard.nameScreen}`;
    return "Sin asignar";
  };

  const getRowActions = (item: MonitorInterface) => {
    const all = [
      {
        label: item.isActive ? "Desactivar" : "Activar",
        permissions: [PERMISSION_TYPE.CAN_ENABLE_MONITOR],
        onClick: () => setEnableDialog({ open: true, item }),
      },
      {
        label: "Editar",
        permissions: [PERMISSION_TYPE.CAN_EDIT_MONITOR],
        onClick: () => router.push(`monitor/editar/${item.id}`),
        icon: <Pencil className="mr-2 h-4 w-4" />,
      },
      {
        label: "Eliminar",
        permissions: [PERMISSION_TYPE.CAN_DELETE_MONITOR],
        onClick: () => setDeleteDialog({ open: true, item }),
        icon: <Trash2 className="mr-2 h-4 w-4" />,
        destructive: true,
      },
      {
        label: "Ver URL",
        onClick: () => {
          const base = typeof window !== "undefined" ? window.location.origin : "";
          setUrlDialog({ open: true, url: `${base}/monitor/report/${item.identifier}` });
        },
        icon: <Eye className="mr-2 h-4 w-4" />,
      },
    ];
    return getValidatedItems(all, user?.activePermissions);
  };

  return (
    <>
      {/* Enable/Disable dialog */}
      <ConfirmDialog
        open={enableDialog.open}
        onOpenChange={(o) => !o && setEnableDialog({ open: false, item: null })}
        title={enableDialog.item?.isActive ? "Desactivar monitor" : "Activar monitor"}
        description={
          enableDialog.item?.isActive
            ? "¿Estás seguro de desactivar este monitor?"
            : "¿Estás seguro de activar este monitor?"
        }
        onConfirm={onEnableDisable}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
      />

      {/* Delete dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(o) => !o && setDeleteDialog({ open: false, item: null })}
        title="Eliminar monitor"
        description="¿Estás seguro de eliminar este monitor? Esta acción no se puede deshacer."
        onConfirm={onDeleteMonitor}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="destructive"
      />

      {/* URL dialog */}
      <Dialog open={urlDialog.open} onOpenChange={(o) => !o && setUrlDialog({ open: false, url: "" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>URL pública del monitor</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            <Input readOnly value={urlDialog.url} className="flex-1" />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(urlDialog.url);
                notify.success("URL copiada al portapapeles");
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded" />
          ))}
        </div>
      ) : (
        <>
          <div className="rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Nombre</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Alias</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Sección asignada</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Estado</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {monitors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No se encontraron monitores
                    </td>
                  </tr>
                ) : (
                  monitors.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border transition-colors hover:bg-muted/50 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.alias}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {getAssignedSection(item as MonitorInterfaceItem)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            item.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          )}
                        >
                          {item.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {getRowActions(item).map((action, idx) => (
                              <DropdownMenuItem
                                key={idx}
                                onClick={action.onClick}
                                className={cn(
                                  action.destructive &&
                                    "text-destructive focus:text-destructive"
                                )}
                              >
                                {action.icon}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                ← Prev
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Monitor;
