import { Badge, Button, message } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue } from "antd/es/table/interface";
import Router from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../../../context/AppContext";
import {
  Direction,
  List,
} from "../../../../services/interfaces/List.interface";
import RoleService from "../../../../services/RoleService";
import { PERMISSION_TYPE } from "../../../../shared/enum/permission.enum";
import { getValidatedItems } from "../../../../utils/validatedItems";
import { RoleInterface } from "../../../layout/interfaces";
import ActionMenu from "../../../shared/ActionMenu";
import ActionMenuModal from "../../../shared/ActionMenuModal";
import Table from "../../../shared/Table";
import { TableTabsStyled } from "../../../shared/TableTabs/style";
import TopSearch from "../../../shared/TopSearch";
import DetailRoleDrawer from "./DetailRoleDrawer";

const RoleTab = () => {
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleInterface[]>();
  const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);
  const [isEnableModalActive, setIsEnableModalActive] = useState(false);
  const [activeElementModal, setActiveElementModal] = useState({
    id: 0,
    body: {
      isActive: false,
    },
  });
  const [page, setPage] = useState({
    pageSize: 10,
    limit: 10,
    skip: 0,
  });
  const [activeDrawerId, setActiveDrawerId] = useState<number | null>(null);

  const onEnableDisableRole = async (id: number) => {
    try {
      const { pageSize, skip } = page;
      setLoading(true);
      await RoleService.update({
        id,
        isActive: !activeElementModal.body.isActive,
      });
      message.success(
        `Rol ${
          !activeElementModal.body.isActive ? "activado" : "desactivado"
        } exitosamente!`
      );
      fetch({ take: pageSize, skip });
    } catch {
      setLoading(false);
      message.error("Ocurrio un error al intentar actualizar la información.");
    }
  };

  const onDeleteRole = async (id: number) => {
    try {
      const { pageSize, skip } = page;
      setLoading(true);
      await RoleService.deleteRole(id);
      message.success("Rol eliminado exitosamente!");
      fetch({ take: pageSize, skip });
    } catch {
      setLoading(false);
      message.error("Ocurrio un error al intentar actualizar la información.");
    }
  };

  const actionOptions = (item: RoleInterface) => [
    {
      label: item.isActive ? "Desactivar Rol" : "Activar Rol",
      key: 0,
      onClick: async () => {
        setActiveElementModal({
          id: item.id || 0,
          body: {
            isActive: item.isActive as boolean,
          },
        });
        setIsEnableModalActive(true);
      },
      permissions: [PERMISSION_TYPE.CAN_EDIT_ROLE],
    },

    {
      label: "Eliminar",
      key: 1,
      onClick: async () => {
        setActiveElementModal({
          id: item.id || 0,
          body: {
            isActive: item.isActive as boolean,
          },
        });
        setIsDeleteModalActive(true);
      },
      permissions: [PERMISSION_TYPE.CAN_DELETE_ROLE],
    },
    {
      label: "Editar",
      key: 2,
      onClick: () => Router.push(`user-role/rol/editar/${item.id}`),
      permissions: [PERMISSION_TYPE.CAN_EDIT_ROLE],
    },
  ];
  const columns: ColumnsType<RoleInterface> = [
    {
      title: "Nombre del perfil",
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
        <Button type="link" onClick={() => setActiveDrawerId(item.id)} style={{padding: '0px !importan'}}>
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
      render: (_, item: RoleInterface) => {
        const validatedItems = getValidatedItems(
          actionOptions(item),
          user?.activePermissions
        );

        return <ActionMenu options={validatedItems} />;
      },
      className: "action-column",
    },
  ];

  useEffect(() => {
    const { limit, skip } = page;
    fetch({ take: limit, skip });
  }, []);

  const fetch = (params: List): void => {
    setLoading(true);
    RoleService.list(params).then(({ data }) => {
      setRoles(data);
      setLoading(false);
    });
  };

  const onTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: any
  ) => {
    const temporalPage = {
      pageSize: pagination.pageSize as number,
      limit: page.limit,
      skip:
        ((pagination.current as number) - 1) * (pagination.pageSize as number),
    };
    setPage(temporalPage);

    fetch({
      take: temporalPage.limit,
      skip: temporalPage.skip,

      sortField: sorter.field,
      sortOrder:
        sorter.order === "ascend" ? Direction.ASCENDANT : Direction.DESCENDANT,
    });
  };

  const onSearch = (search: string) => {
    const { limit, skip } = page;
    fetch({ take: limit, skip, search });
  };

  const onCancelModal = () => {
    setActiveElementModal({ id: 0, body: { isActive: false } });
    setIsDeleteModalActive(false);
    setIsEnableModalActive(false);
  };

  return (
    <>
      <ActionMenuModal
        open={isEnableModalActive}
        actionalId={activeElementModal.id}
        onConfirm={onEnableDisableRole}
        onCancel={onCancelModal}
        width={380}
        content={
          <>
            <p>
              {activeElementModal.body.isActive
                ? "¿Estás seguro de desactivar este rol?"
                : "¿Estás seguro de activar este rol?"}
            </p>
          </>
        }
      />
      <ActionMenuModal
        open={isDeleteModalActive}
        actionalId={activeElementModal.id}
        onConfirm={onDeleteRole}
        onCancel={onCancelModal}
        width={380}
        content={
          <>
            <p>¿Estás seguro de eliminar este rol?</p>
          </>
        }
      />
      <DetailRoleDrawer
        id={activeDrawerId as number}
        onClose={() => setActiveDrawerId(null)}
      />
      <TableTabsStyled>
        <div className="table-tab-container">
          <TopSearch
            search={{
              placeholder: "Buscar roles",
              onClick: (search: string) => onSearch(search),
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
    </>
  );
};

export default RoleTab;
