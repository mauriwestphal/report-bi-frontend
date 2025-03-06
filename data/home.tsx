import {
  CarOutlined,
  FundProjectionScreenOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ReactNode } from "react";
import { PERMISSION_TYPE } from "../shared/enum/permission.enum";
interface HomeMenu {
  icon: ReactNode;
  title: string | ReactNode;
  body: string | ReactNode;
  url: string;
  permissions?: PERMISSION_TYPE[];
}

const homeMenu: HomeMenu[] = [
  {
    icon: <CarOutlined />,
    title: "Dashboard 360",
    body: (
      <ul>
        <li>Lista de vehículos detenidos en taller</li>
        <li>Dashboard de información 360</li>
        <li>Reporteria BI</li>
      </ul>
    ),
    url: "/dashboard-usuarios",
  },
  {
    icon: <FundProjectionScreenOutlined />,
    title: "Gestión de Monitores",
    body: (
      <ul>
        <li>Lista de pantallas activas e inactivas.</li>
        <li>Creación y edición de pantallas.</li>
        <li>Asignación de perfiles.</li>
      </ul>
    ),
    url: "/monitor/",
    permissions: [
      PERMISSION_TYPE.CAN_CREATE_MONITOR,
      PERMISSION_TYPE.CAN_EDIT_MONITOR,
      PERMISSION_TYPE.CAN_DELETE_MONITOR,
      PERMISSION_TYPE.CAN_GENERATE_NEW_URL,
      PERMISSION_TYPE.CAN_ENABLE_MONITOR
    ]
  },
  {
    icon: <UserOutlined />,
    title: "Gestión de Usuarios",
    body: (
      <ul>
        <li>Lista de usuarios activos e inactivos.</li>
        <li>Creación y edición de usuarios.</li>
        <li>Asignación de perfiles.</li>
      </ul>
    ),
    url: "/user-role?active=user",
    permissions: [
      PERMISSION_TYPE.CAN_CREATE_USER,
      PERMISSION_TYPE.CAN_EDIT_USER,
      PERMISSION_TYPE.CAN_ENABLE_USER,
    ],
  },
  {
    icon: <TeamOutlined />,
    title: "Gestión de Roles",
    body: (
      <ul>
        <li>Administra roles y permisos.</li>
        <li>Creación y edición de roles.</li>
        <li>Asignación de permisos.</li>
      </ul>
    ),
    url: "/user-role?active=role",
    permissions: [
      PERMISSION_TYPE.CAN_EDIT_ROLE,
      PERMISSION_TYPE.CAN_CREATE_ROLE,
      PERMISSION_TYPE.CAN_DELETE_ROLE,
    ],
  },
  {
    icon: <PieChartOutlined />,
    title: "Reportes",
    body: (
      <ul>
        <li>Informes BI de usuario.</li>
        <li>Tablas de detalle.</li>
        <li>Informes XL para pantallas.</li>
      </ul>
    ),
    url: "/report",
  },
];

export default homeMenu;
