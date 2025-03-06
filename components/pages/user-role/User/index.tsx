import { Badge, message, Tag } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue } from "antd/es/table/interface";
import { useEffect, useMemo, useState } from "react";
import {
  Direction,
  List,
} from "../../../../services/interfaces/List.interface";
import UserService from "../../../../services/UserService/services";
import { RoleInterface, UserInterface } from "../../../layout/interfaces";
import ActionMenu from "../../../shared/ActionMenu";
import Table from "../../../shared/Table";
import { format } from "rut.js";
import Router from "next/router";
import TopSearch from "../../../shared/TopSearch";
import { TableTabsStyled } from "../../../shared/TableTabs/style";
import { useAppContext } from "../../../../context/AppContext";
import { PERMISSION_TYPE } from "../../../../shared/enum/permission.enum";
import { getValidatedItems } from "../../../../utils/validatedItems";
import ActionMenuModal from "../../../shared/ActionMenuModal";

const UserTab = () => {
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserInterface[]>();
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
    skip: 0,
    total: 0,
  });
  useEffect(() => {
    const { pageSize, skip } = page;
    fetch({ take: pageSize, skip });
  }, []);

  const fetch = (params: List): void => {
    setLoading(true);
    UserService.list(params).then(({ data }) => {
      setUsers(data.users);
      setLoading(false);
      setPage((prevPage) => ({ ...prevPage, total: data.total }));
    });
  };

  const onTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: any
  ) => {
    const temporalPage = {
      pageSize: pagination.pageSize as number,
      skip:
        ((pagination.current as number) - 1) * (pagination.pageSize as number),
      total: page.total,
      current: pagination.current,
    };
    setPage(temporalPage);

    fetch({
      take: temporalPage.pageSize,
      skip: temporalPage.skip,
      sortField: sorter.field,
      sortOrder:
        sorter.order === "ascend" ? Direction.ASCENDANT : Direction.DESCENDANT,
    });
  };

  const onSearch = (search: string) => {
    const { pageSize, skip } = page;
    fetch({ take: pageSize, skip, search });
  };

  const onCancelModal = () => {
    setActiveElementModal({ id: 0, body: { isActive: false } });
    setIsDeleteModalActive(false);
    setIsEnableModalActive(false);
  };

  const onEnableDisableUser = async (id: number) => {
    try {
      const { pageSize, skip } = page;
      setLoading(true);
      await UserService.update({
        id,
        isActive: !activeElementModal.body.isActive,
      });

      message.success(
        `Usuario ${
          !activeElementModal.body.isActive ? "activado" : "desactivado"
        } exitosamente!`
      );
      fetch({ take: pageSize, skip });
    } catch {
      setLoading(false);
      message.error("Ocurrio un error al intentar actualizar la información.");
    }
  };

  const onDeleteUser = async (id: number) => {
    try {
      const { pageSize, skip } = page;
      setLoading(true);
      await UserService.deleteUser(id);
      message.success("Usuario eliminado exitosamente!");
      fetch({ take: pageSize, skip });
    } catch {
      setLoading(false);
      message.error("Ocurrio un error al intentar eliminar el usuario.");
    }
  };

  const actionOptions = (item: UserInterface) => [
    {
      label: item.isActive ? "Desactivar usuario" : "Activar usuario",
      key: 0,
      onClick: () => {
        setActiveElementModal({
          id: item.id || 0,
          body: {
            isActive: item.isActive,
          },
        });
        setIsEnableModalActive(true);
      },
      permissions: [PERMISSION_TYPE.CAN_ENABLE_USER],
    },
    {
      label: "Eliminar",
      key: 1,
      onClick: async () => {
        setActiveElementModal({
          id: item.id || 0,
          body: {
            isActive: item.isActive,
          },
        });
        setIsDeleteModalActive(true);
      },
      permissions: [PERMISSION_TYPE.CAN_DELETE_USER],
    },
    {
      label: "Editar",
      key: 2,
      onClick: () => Router.push(`user-role/usuario/editar/${item.id}`),
      permissions: [PERMISSION_TYPE.CAN_EDIT_USER],
    },
  ];
  const columns: ColumnsType<UserInterface> = useMemo(
    () => [
      {
        title: "RUT",
        dataIndex: "rut",
        render: (_, item: UserInterface) => {
          return format(`${item.rut}-${item.dv}`);
        },
        sorter: true,
        showSorterTooltip: false,
      },
      {
        title: "Nombre",
        dataIndex: "firstName",
        sorter: true,
        showSorterTooltip: false,
      },
      {
        title: "Apellido",
        dataIndex: "lastName",
        sorter: true,
        showSorterTooltip: false,
      },
      {
        title: "Correo electrónico",
        dataIndex: "email",
        sorter: true,
        showSorterTooltip: false,
      },
      {
        title: "Estado",
        dataIndex: "isActive",
        sorter: true,
        showSorterTooltip: false,
        render: (isActive: boolean) =>
          isActive ? (
            <Badge color="#79BB61" text="Activo" />
          ) : (
            <Badge color="#DF545C" text="Inactivo" />
          ),
      },
      {
        title: "Perfil",
        dataIndex: "role",
        render: (item: RoleInterface) => {
          return <Tag color="#434343">{item?.name || "NO ROLE"}</Tag>;
        },
        sorter: true,
        showSorterTooltip: false,
      },
      {
        title: "Acciones",
        dataIndex: "actions",
        render: (_, item: UserInterface) => {
          const validatedItems = getValidatedItems(
            actionOptions(item),
            user?.activePermissions
          );

          return <ActionMenu options={validatedItems} />;
        },
        className: "action-column",
      },
    ],
    [user?.activePermissions]
  );

  return (
    <>
      <ActionMenuModal
        open={isEnableModalActive}
        actionalId={activeElementModal.id}
        onConfirm={onEnableDisableUser}
        onCancel={onCancelModal}
        width={380}
        content={
          <>
            <p>
              {activeElementModal.body.isActive
                ? "¿Estás seguro de desactivar este usuario?"
                : "¿Estás seguro de activar este usuario?"}
            </p>
          </>
        }
      />
      <ActionMenuModal
        open={isDeleteModalActive}
        actionalId={activeElementModal.id}
        onConfirm={onDeleteUser}
        onCancel={onCancelModal}
        width={380}
        content={
          <>
            <p>¿Estás seguro de eliminar este usuario?</p>
          </>
        }
      />
      <TableTabsStyled>
        <div className="table-tab-container">
          <TopSearch
            search={{
              placeholder: "Buscar usuarios",
              onClick: (search: string) => onSearch(search),
            }}
          />
          <Table
            columns={columns}
            dataSource={users}
            onChange={onTableChange}
            loading={loading}
            pagination={{ ...page }}
            rowClassName={(record: UserInterface) =>
              !record.isActive ? "row-disabled-element" : "row-active-element"
            }
            
          />
        </div>
      </TableTabsStyled>
    </>
  );
};

export default UserTab;
