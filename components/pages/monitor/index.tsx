import { ColumnsType } from 'antd/es/table';
import React, { useMemo, useState, useEffect } from 'react'
import { MonitorInterfaceItem, UserInterface } from '../../layout/interfaces';
import Table from '../../shared/Table';
import { TableStyle } from '../../shared/Table/style';
import { TableTabsStyled } from '../../shared/TableTabs/style';
import TopSearch from '../../shared/TopSearch';
import { MonitorInterface } from '../../layout/interfaces/index';
import { ListMonitor } from '../../../services/interfaces/List.interface';
import MonitorService from '../../../services/MonitorService/monitor';
import { Badge, message, Input, Button } from 'antd';
import { getValidatedItems } from '../../../utils/validatedItems';
import ActionMenu from '../../shared/ActionMenu';
import ActionMenuModal from '../../shared/ActionMenuModal';
import { useAppContext } from '../../../context/AppContext';
import { useRouter } from 'next/router';
import { IncomingMessage } from 'http';
import { CopyOutlined } from '@ant-design/icons';
import { useNotification } from '../../shared/Notifications';

interface Zones {
  label: string;
  value: number
}
interface Props {
  optionZones: Zones[]
}


const Monitor = ({ optionZones }: Props, { req }: { req: IncomingMessage }) => {
  const router = useRouter()
  
  // const protocol = window.location.protocol ;
  // const host = window.location.host ;

  // const fullUrl = `${protocol}//${host}`
  const { user } = useAppContext();
  const [monitors, setMonitors] = useState<MonitorInterface[]>();
  const [loading, setLoading] = useState(false);
  const { openNotification, contextHolder } = useNotification()

  const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);
  const [isEnableModalActive, setIsEnableModalActive] = useState(false);
  const [isViewModalActive, setIsViewModalActive] = useState(false);
  const [text, setText] = useState('');


  const [url, setUrl] = useState('');

  const [activeElementModal, setActiveElementModal] = useState({
    id: 0,
    body: {
      isActive: false,
    },
  });
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };
  const fetch = (params: ListMonitor): void => {
    setLoading(true);
    MonitorService.listMonitor(params).then(({ data }) => {
      setMonitors(data.monitors.sort((a: any, b: any) => b?.id - a?.id));
    }).finally(() => {
      setLoading(false);
    })
  }

  const actionOptions = (item: MonitorInterface) => [
    {
      label: item.isActive ? "Desactivar" : "Activar",
      key: 0,
      onClick: () => {
        setActiveElementModal({
          id: item.id || 0,
          body: {
            isActive: item?.isActive || false,
          },
        });
        setIsEnableModalActive(true);
      },
      // permissions: [PERMISSION_TYPE.CAN_ENABLE_USER],
    },
    {
      label: "Editar",
      key: 1,
      onClick: () => router.push(`monitor/editar/${item.id}`),
      // permissions: [PERMISSION_TYPE.CAN_ENABLE_USER],
    },
    // {
    //   label: "Eliminar",
    //   key: 2,
    //   onClick: async () => {
    //     setIsDeleteModalActive(true);
    //   },
    //   // permissions: [PERMISSION_TYPE.CAN_DELETE_USER],
    // },
    {
      label: "Ver Url",
      key: 3,
      onClick: () => {
        setIsViewModalActive(true);
        console.log('item de la url',item);
        setText(`https://reporteria-bi.onrender.com/monitor/report/'}` + `${item.identifier}`);
      },
      // permissions: [PERMISSION_TYPE.CAN_EDIT_USER],
    },
  ];

  const onCancelModal = () => {
    setActiveElementModal({ id: 0, body: { isActive: false } });
    setIsDeleteModalActive(false);
    setIsEnableModalActive(false);
    setIsViewModalActive(false)
  };

  const onEnableDisableUser = async (id: number) => {
    try {
      // const { pageSize, skip } = page;
      setLoading(true);
      await MonitorService.updateEnableDesable(id).finally(() => {
        setLoading(false);
      });

      openNotification('success', `Monitor ${!activeElementModal.body.isActive ? "activado" : "desactivado"} exitosamente!`);
     
      fetch({ });
    } catch {
      setLoading(false);
      openNotification("error","Ocurrio un error al intentar actualizar la información.");
    }
  };

  const onDeleteUser = async (id: number) => {
    try {
      // const { pageSize, skip } = page;
      setLoading(true);
      await MonitorService.deleteMonitor(id).finally(() => {
        setLoading(false);
      });
      message.success("Monitor eliminado exitosamente!");
      // fetch({ take: pageSize, skip });
    } catch {
      setLoading(false);
      message.error("Ocurrio un error al intentar eliminar el usuario.");
    }
  };


  const onViewMonitor = async (id: number) => {
    try {
      // const { pageSize, skip } = page;
      setLoading(true);
      // await MonitorService.deleteMonitor(id);
      // message.success("Monitor eliminado exitosamente!");
      // fetch({ take: pageSize, skip });

    } catch {
      setLoading(false);
      message.error("Ocurrio un error al intentar eliminar el error.");
    }
  };

  const onNewUrl = async (params: any) => {
    try {
      await message.success("Se ha regenerado una nueva URL");

    } catch (error) {

    }
  }

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        
      },
      {
        title: "Nombre",
        dataIndex: "name",
        
      },
      {
        title: "Descripción",
        dataIndex: "description",
        
      },
      {
        title: "Alias",
        dataIndex: "alias",
        
      },
      // {
      //   title: "Zonas",
      //   dataIndex: "zones",
        
      //   render: (_, zones) => {
      //     const zona = optionZones.find(zone => zone.value === zones.zones);
      //     return zona?.label || 'Sin Zona';
      //   }
      // },
      {
        title: "Sección asignada",
        dataIndex: "report",
        render: (_, item: MonitorInterfaceItem) => {
          let segmento = item.report ? `Reporte Bi - ${item.report.name}` :
            item.dashboard ? `Dashboard 360 - ${item.dashboard.nameScreen}` :
              'Sin asignar sección';

          return segmento;

        }
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
        render: (_, item: MonitorInterface) => {
          const validatedItems = getValidatedItems(actionOptions(item), user?.activePermissions);

          return <ActionMenu options={validatedItems} />;
        },
        className: "action-column",
      },
    ],
    [user?.activePermissions]
  );



  useEffect(() => {
    fetch({
      // limit: 10, offset: 0 
    })
  }, [])

  return (
    <>
    {contextHolder}
      <ActionMenuModal
        open={isEnableModalActive}
        actionalId={activeElementModal.id}
        onConfirm={()=>onEnableDisableUser(activeElementModal.id)}
        onCancel={onCancelModal}
        width={380}
        content={
          <>
            <p>
              {activeElementModal.body.isActive
                ? "¿Estás seguro de desactivar este monitor?"
                : "¿Estás seguro de activar este monitor?"}
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


      <ActionMenuModal
        open={isViewModalActive}
        actionalId={activeElementModal.id}
        onConfirm={onNewUrl}
        onCancel={onCancelModal}
        width={700}
        showFooter={false}
        content={
          <>
            <h1>Ver link</h1>

            <p style={{
              top: 20
            }}>URL</p>

            <Input readOnly
              value={text}
              onChange={e => setText(e.target.value)}
              addonAfter={
                <Button type="text" onClick={handleCopy}>
                  <CopyOutlined />
                </Button>
              }
            />
          </>
        }
      />

      <TableTabsStyled>
        <div className="table-tab-container">
          {/* <TopSearch
            search={{
              placeholder: "Buscar usuarios",
              onClick: (search: string) => { },
            }}
          /> */}
          <Table
            columns={columns}
            dataSource={monitors}
            loading={loading}
          />
        </div>
      </TableTabsStyled>
    </>
  )
}

export default Monitor;