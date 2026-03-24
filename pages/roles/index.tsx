import { Badge, Button, message } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue } from "antd/es/table/interface";
import Router from "next/router";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  Direction,
  List,
} from "../../services/interfaces/List.interface";
import RoleService from "../../services/RoleService";
import { PERMISSION_TYPE } from "../../shared/enum/permission.enum";
import { getValidatedItems } from "../../utils/validatedItems";
import { RoleInterface } from "../../components/layout/interfaces";
import ActionMenu from "../../components/shared/ActionMenu";
import ActionMenuModal from "../../components/shared/ActionMenuModal";
import Layout from "../../components/layout";
import Table from "../../components/shared/Table";
import TopTitle from "../../components/shared/TopTitle";
import TopSearch from "../../components/shared/TopSearch";
import DetailRoleDrawer from "../../components/pages/user-role/Role/DetailRoleDrawer";
import { TableTabsStyled } from "../../components/shared/TableTabs/style";

const RolesPage = () => {
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleInterface[]>([]);
  const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);
  const [isEnableModalActive, setIsEnableModalActive] = useState(false);
  const [activeElementModal, setActiveElementModal] = useState({
    id: 0,
    body: { isActive: false },
  });
  const [page, setPage] = useState({ pageSize: 10, limit: 10, skip: 0 });
  const [activeDrawerId, setActiveDrawerId] = useState<number | null>(null);

  const fetchRoles = (params: List) => {
    setLoading(true);
    RoleService.list(params)
      .then(({ data }) => setRoles(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRoles({ take: page.limit, skip: page.skip });
  }, []);

  const onTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: any
  ) => {
    const temporal = {
      pageSize: pagination.pageSize as number,
      limit: page.limit,
      skip:
        ((pagination.current as number) - 1) * (pagination.pageSize as number),
    };
    setPage(temporal);
    fetchRoles({
      take: temporal.limit,
      skip: temporal.skip,
      sortField: sorter.field,
      sortOrder:
        sorter.order === "ascend" ? Direction.ASCENDANT : Direction.DESCENDANT,
    });
  };

  const onSearch = (search: string) => {
    fetchRoles({ take: page.limit, skip: 0, search });
  };

  const onEnableDisable = async (id: number) => {
    try {
      setLoading(true);
      await RoleService.update({
        id,
        isActive: !activeElementModal.body.isActive,
      });
      message.success(
        `Rol ${!activeElementModal.body.isActive ? "activado" : "desactivado"} exitosamente!`
      );
      fetchRoles({ take: page.pageSize, skip: page.skip });
    } catch {
      setLoading(false);
      message.error("Ocurrió un error al actualizar el estado del rol.");
    }
  };

  const onDelete = async (id: number) => {
    try {
      setLoading(true);
      await RoleService.deleteRole(id);
      message.success("Rol eliminado exitosamente!");
      fetchRoles({ take: page.pageSize, skip: page.skip });
    } catch {
      setLoading(false);
      message.error("Ocurrió un error al eliminar el rol.");
    }
  };

  const onCancelModal = () => {
    setActiveElementModal({ id: 0, body: { isActive: false } });
    setIsDeleteModalActive(false);
    setIsEnableModalActive(false);
  };

  const actionOptions = (item: RoleInterface) => [
    {
      label: item.isActive ? "Desactivar" : "Activar",
      key: 0,
      onClick: () => {
        setActiveElementModal({
          id: item.id,
          body: { isActive: item.isActive as boolean },
        });
        setIsEnableModalActive(true);
      },
      permissions: [PERMISSION_TYPE.CAN_EDIT_ROLE],
    },
    {
      label: "Editar",
      key: 1,
      onClick: () => Router.push(`/roles/${item.id}/editar`),
      permissions: [PERMISSION_TYPE.CAN_EDIT_ROLE],
    },
    {
      label: "Eliminar",
      key: 2,
      onClick: () => {
        setActiveElementModal({
          id: item.id,
          body: { isActive: item.isActive as boolean },
        });
        setIsDeleteModalActive(true);
      },
      permissions: [PERMISSION_TYPE.CAN_DELETE_ROLE],
    },
  ];

  const columns: ColumnsType<RoleInterface> = [
    {
      title: "Nombre del rol",
      dataIndex: "name",
      sorter: true,
      showSorterTooltip: false,
    },
    {
      title: "Usuarios asociados",
      dataIndex: "totalUsers",
      sorter: true,
      showSorterTooltip: false,
    },
    {
      title: "Detalle",
      dataIndex: "detail",
      render: (_, item: RoleInterface) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => setActiveDrawerId(item.id)}
        >
          Ver detalle
        </Button>
      ),
    },
    {
      title: "Estado",
      dataIndex: "isActive",
      render: (isActive: boolean) =>
        isActive ? (
          <Badge color="#79BB61" text="Activo" />
        ) : (
          <Badge color="#DF545C" text="Inactivo" />
        ),
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      className: "action-column",
      render: (_, item: RoleInterface) => {
        const validated = getValidatedItems(
          actionOptions(item),
          user?.activePermissions
        );
        return <ActionMenu options={validated} />;
      },
    },
  ];

  const canCreate = user?.activePermissions?.includes(
    PERMISSION_TYPE.CAN_CREATE_ROLE
  );

  return (
    <Layout>
      <TopTitle
        title={{ strong: "Gestión de Roles" }}
        action={{
          buttonText: "Nuevo rol",
          icon: <PlusCircleOutlined />,
          onClick: () => Router.push("/roles/crear"),
          disabled: !canCreate,
        }}
      />

      <ActionMenuModal
        open={isEnableModalActive}
        actionalId={activeElementModal.id}
        onConfirm={onEnableDisable}
        onCancel={onCancelModal}
        width={380}
        content={
          <p>
            {activeElementModal.body.isActive
              ? "¿Estás seguro de desactivar este rol?"
              : "¿Estás seguro de activar este rol?"}
          </p>
        }
      />

      <ActionMenuModal
        open={isDeleteModalActive}
        actionalId={activeElementModal.id}
        onConfirm={onDelete}
        onCancel={onCancelModal}
        width={380}
        content={<p>¿Estás seguro de eliminar este rol?</p>}
      />

      <DetailRoleDrawer
        id={activeDrawerId as number}
        onClose={() => setActiveDrawerId(null)}
      />

      <TableTabsStyled>
        <div className="table-tab-container">
          <TopSearch
            search={{
              placeholder: "Buscar rol",
              onClick: onSearch,
            }}
          />
          <Table
            columns={columns}
            dataSource={roles}
            onChange={onTableChange}
            loading={loading}
            rowClassName={(record: RoleInterface) =>
              !record.isActive ? "row-disabled-element" : "row-active-element"
            }
          />
        </div>
      </TableTabsStyled>
    </Layout>
  );
};

export default RolesPage;
