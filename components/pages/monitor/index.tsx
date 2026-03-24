import { ColumnsType } from "antd/es/table";
import React, { useMemo, useState, useEffect } from "react";
import { MonitorInterface } from "../../layout/interfaces";
import Table from "../../shared/Table";
import { TableTabsStyled } from "../../shared/TableTabs/style";
import { MonitorInterfaceItem } from "../../layout/interfaces/index";
import { ListMonitor } from "../../../services/interfaces/List.interface";
import MonitorService from "../../../services/MonitorService/monitor";
import { Badge, Input, Button } from "antd";
import { getValidatedItems } from "../../../utils/validatedItems";
import ActionMenu from "../../shared/ActionMenu";
import ActionMenuModal from "../../shared/ActionMenuModal";
import { useAppContext } from "../../../context/AppContext";
import { useRouter } from "next/router";
import { CopyOutlined } from "@ant-design/icons";
import { useNotification } from "../../shared/Notifications";
import { PERMISSION_TYPE } from "../../../shared/enum/permission.enum";

interface Props {
  search?: string;
}

const PAGE_SIZE = 10;

const Monitor = ({ search }: Props) => {
  const router = useRouter();
  const { user } = useAppContext();
  const [monitors, setMonitors] = useState<MonitorInterface[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { openNotification, contextHolder } = useNotification();

  const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);
  const [isEnableModalActive, setIsEnableModalActive] = useState(false);
  const [isViewModalActive, setIsViewModalActive] = useState(false);
  const [urlText, setUrlText] = useState("");

  const [activeElementModal, setActiveElementModal] = useState<{
    id: number;
    body: { isActive: boolean };
  }>({ id: 0, body: { isActive: false } });

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(urlText);
  };

  const fetchMonitors = (params: ListMonitor): void => {
    setLoading(true);
    MonitorService.listMonitor(params)
      .then(({ data }) => {
        setMonitors(data.monitors.sort((a: any, b: any) => b?.id - a?.id));
        setTotal(data.total ?? data.monitors.length);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchMonitors({ search, limit: PAGE_SIZE, offset: 0 });
  }, [search]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    fetchMonitors({
      search,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    });
  };

  const actionOptions = (item: MonitorInterface) => [
    {
      label: item.isActive ? "Desactivar" : "Activar",
      key: 0,
      permissions: [PERMISSION_TYPE.CAN_ENABLE_MONITOR],
      onClick: () => {
        setActiveElementModal({
          id: item.id || 0,
          body: { isActive: item?.isActive || false },
        });
        setIsEnableModalActive(true);
      },
    },
    {
      label: "Editar",
      key: 1,
      permissions: [PERMISSION_TYPE.CAN_EDIT_MONITOR],
      onClick: () => router.push(`monitor/editar/${item.id}`),
    },
    {
      label: "Eliminar",
      key: 2,
      permissions: [PERMISSION_TYPE.CAN_DELETE_MONITOR],
      onClick: () => {
        setActiveElementModal({
          id: item.id || 0,
          body: { isActive: item?.isActive || false },
        });
        setIsDeleteModalActive(true);
      },
    },
    {
      label: "Ver URL",
      key: 3,
      onClick: () => {
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        setUrlText(`${baseUrl}/monitor/report/${item.identifier}`);
        setIsViewModalActive(true);
      },
    },
  ];

  const onCancelModal = () => {
    setActiveElementModal({ id: 0, body: { isActive: false } });
    setIsDeleteModalActive(false);
    setIsEnableModalActive(false);
    setIsViewModalActive(false);
  };

  const onEnableDisable = async (id: number) => {
    try {
      setLoading(true);
      await MonitorService.updateEnableDesable(id);
      openNotification(
        "success",
        `Monitor ${!activeElementModal.body.isActive ? "activado" : "desactivado"} exitosamente!`
      );
      fetchMonitors({
        search,
        limit: PAGE_SIZE,
        offset: (currentPage - 1) * PAGE_SIZE,
      });
    } catch {
      setLoading(false);
      openNotification("error", "Ocurrió un error al actualizar el monitor.");
    }
  };

  const onDeleteMonitor = async (id: number) => {
    try {
      setLoading(true);
      await MonitorService.deleteMonitor(id);
      openNotification("success", "Monitor eliminado exitosamente!");
      const newPage =
        monitors.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      setCurrentPage(newPage);
      fetchMonitors({
        search,
        limit: PAGE_SIZE,
        offset: (newPage - 1) * PAGE_SIZE,
      });
    } catch {
      setLoading(false);
      openNotification("error", "Ocurrió un error al eliminar el monitor.");
    }
  };

  const columns: ColumnsType<any> = useMemo(
    () => [
      { title: "ID", dataIndex: "id" },
      { title: "Nombre", dataIndex: "name" },
      { title: "Descripción", dataIndex: "description" },
      { title: "Alias", dataIndex: "alias" },
      {
        title: "Sección asignada",
        dataIndex: "report",
        render: (_: any, item: MonitorInterfaceItem) => {
          if (item.report) return `Reporte BI - ${item.report.name}`;
          if (item.dashboard) return `Dashboard 360 - ${item.dashboard.nameScreen}`;
          return "Sin asignar";
        },
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
        render: (_: any, item: MonitorInterface) => {
          const validatedItems = getValidatedItems(
            actionOptions(item),
            user?.activePermissions
          );
          return <ActionMenu options={validatedItems} />;
        },
        className: "action-column",
      },
    ],
    [user?.activePermissions, currentPage, search]
  );

  return (
    <>
      {contextHolder}

      <ActionMenuModal
        open={isEnableModalActive}
        actionalId={activeElementModal.id}
        onConfirm={() => onEnableDisable(activeElementModal.id)}
        onCancel={onCancelModal}
        width={380}
        content={
          <p>
            {activeElementModal.body.isActive
              ? "¿Estás seguro de desactivar este monitor?"
              : "¿Estás seguro de activar este monitor?"}
          </p>
        }
      />

      <ActionMenuModal
        open={isDeleteModalActive}
        actionalId={activeElementModal.id}
        onConfirm={() => onDeleteMonitor(activeElementModal.id)}
        onCancel={onCancelModal}
        width={380}
        content={
          <p>¿Estás seguro de eliminar este monitor? Esta acción no se puede deshacer.</p>
        }
      />

      <ActionMenuModal
        open={isViewModalActive}
        actionalId={activeElementModal.id}
        onConfirm={() => {}}
        onCancel={onCancelModal}
        width={700}
        showFooter={false}
        content={
          <>
            <h1>Ver link</h1>
            <p style={{ marginTop: 20 }}>URL pública del monitor</p>
            <Input
              readOnly
              value={urlText}
              addonAfter={
                <Button type="text" onClick={handleCopyUrl}>
                  <CopyOutlined />
                </Button>
              }
            />
          </>
        }
      />

      <TableTabsStyled>
        <div className="table-tab-container">
          <Table
            columns={columns}
            dataSource={monitors}
            loading={loading}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: PAGE_SIZE,
              total,
              onChange: onPageChange,
            }}
          />
        </div>
      </TableTabsStyled>
    </>
  );
};

export default Monitor;
