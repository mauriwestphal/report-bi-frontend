import { useEffect, useState } from "react";
import Router from "next/router";
import { Pencil, Trash2, MoreHorizontal, Eye } from "lucide-react";
import { Button } from "../../../ui/button";
import { Skeleton } from "../../../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { ConfirmDialog } from "../../../shared/ConfirmDialog";
import { SearchBar } from "../../../shared/SearchBar";
import DetailRoleDrawer from "./DetailRoleDrawer";
import { cn } from "@/lib/utils";
import { notify } from "../../../../utils/toast";
import { getValidatedItems } from "../../../../utils/validatedItems";
import RoleService from "../../../../services/RoleService";
import { RoleInterface } from "../../../layout/interfaces";
import { useAppContext } from "../../../../context/AppContext";
import { PERMISSION_TYPE } from "../../../../shared/enum/permission.enum";
import { List } from "../../../../services/interfaces/List.interface";

const PAGE_SIZE = 10;

const RoleTab = () => {
  const { user } = useAppContext();
  const [roles, setRoles] = useState<RoleInterface[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [drawerRoleId, setDrawerRoleId] = useState<number | null>(null);

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: RoleInterface | null }>({ open: false, item: null });
  const [enableDialog, setEnableDialog] = useState<{ open: boolean; item: RoleInterface | null }>({ open: false, item: null });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchRoles = (params: List) => {
    setLoading(true);
    RoleService.list(params)
      .then(({ data }) => {
        const items = Array.isArray(data) ? data : [];
        setRoles(items);
        setTotal(items.length);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRoles({ take: PAGE_SIZE, skip: 0 });
  }, []);

  const changePage = (newPage: number) => {
    setPage(newPage);
    fetchRoles({ take: PAGE_SIZE, skip: (newPage - 1) * PAGE_SIZE, search: search || undefined });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    fetchRoles({ take: PAGE_SIZE, skip: 0, search: value || undefined });
  };

  const onEnableDisable = async () => {
    if (!enableDialog.item) return;
    try {
      setLoading(true);
      await RoleService.update({
        id: enableDialog.item.id,
        isActive: !enableDialog.item.isActive,
      });
      notify.success(
        `Rol ${!enableDialog.item.isActive ? "activado" : "desactivado"} exitosamente!`
      );
      fetchRoles({ take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE, search: search || undefined });
    } catch {
      setLoading(false);
      notify.error("Ocurrió un error al actualizar el estado del rol.");
    } finally {
      setEnableDialog({ open: false, item: null });
    }
  };

  const onDeleteRole = async () => {
    if (!deleteDialog.item) return;
    try {
      setLoading(true);
      await RoleService.deleteRole(deleteDialog.item.id);
      notify.success("Rol eliminado exitosamente!");
      fetchRoles({ take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE, search: search || undefined });
    } catch {
      setLoading(false);
      notify.error("Ocurrió un error al eliminar el rol.");
    } finally {
      setDeleteDialog({ open: false, item: null });
    }
  };

  const getRowActions = (item: RoleInterface) => {
    const all = [
      {
        label: "Ver detalle",
        onClick: () => setDrawerRoleId(item.id),
        icon: <Eye className="mr-2 h-4 w-4" />,
      },
      {
        label: item.isActive ? "Desactivar" : "Activar",
        permissions: [PERMISSION_TYPE.CAN_EDIT_ROLE],
        onClick: () => setEnableDialog({ open: true, item }),
      },
      {
        label: "Editar",
        permissions: [PERMISSION_TYPE.CAN_EDIT_ROLE],
        onClick: () => Router.push(`user-role/rol/editar/${item.id}`),
        icon: <Pencil className="mr-2 h-4 w-4" />,
      },
      {
        label: "Eliminar",
        permissions: [PERMISSION_TYPE.CAN_DELETE_ROLE],
        onClick: () => setDeleteDialog({ open: true, item }),
        icon: <Trash2 className="mr-2 h-4 w-4" />,
        destructive: true,
      },
    ];
    return getValidatedItems(all, user?.activePermissions);
  };

  return (
    <>
      <ConfirmDialog
        open={enableDialog.open}
        onOpenChange={(o) => !o && setEnableDialog({ open: false, item: null })}
        title={enableDialog.item?.isActive ? "Desactivar rol" : "Activar rol"}
        description={
          enableDialog.item?.isActive
            ? "¿Estás seguro de desactivar este rol?"
            : "¿Estás seguro de activar este rol?"
        }
        onConfirm={onEnableDisable}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(o) => !o && setDeleteDialog({ open: false, item: null })}
        title="Eliminar rol"
        description="¿Estás seguro de eliminar este rol?"
        onConfirm={onDeleteRole}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="destructive"
      />

      <DetailRoleDrawer id={drawerRoleId} onClose={() => setDrawerRoleId(null)} />

      <div className="space-y-4">
        <SearchBar
          placeholder="Buscar rol"
          value={search}
          onChange={handleSearch}
        />

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
                    <th className="h-10 px-4 text-left font-medium text-muted-foreground">Key</th>
                    <th className="h-10 px-4 text-left font-medium text-muted-foreground">Usuarios</th>
                    <th className="h-10 px-4 text-left font-medium text-muted-foreground">Estado</th>
                    <th className="h-10 px-4 text-left font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No se encontraron roles
                      </td>
                    </tr>
                  ) : (
                    roles.map((item) => (
                      <tr
                        key={item.id}
                        className={cn(
                          "border-b border-border transition-colors hover:bg-muted/50 last:border-0",
                          !item.isActive && "opacity-60"
                        )}
                      >
                        <td className="px-4 py-3 font-medium">{item.name}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.keyName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.totalUsers ?? 0}</td>
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
      </div>
    </>
  );
};

export default RoleTab;
