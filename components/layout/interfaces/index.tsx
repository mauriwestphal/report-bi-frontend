import { PERMISSION_TYPE } from "../../../shared/enum/permission.enum";

export interface DateInterface {
  day: string;
  numberDay: number;
  month: string;
  year: string;
}

export interface RoleInterface {
  id: number;
  name: string;
  keyName?: string;
  permissions: IPermission[];
  reportPages?: IReportPage[];
  totalUsers?: number;
  isActive?: boolean;
  users?: UserInterface[];
}

export interface UserInterface {
  id?: number;
  rut: string;
  dv?: number;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleInterface;
  workshop_id?: string;
  service_id?:string;
  contract_supervisor_id?: string;
  zone_id?: number;
  isActive: boolean;
}

export interface IPermission {
  id: number;
  description?: string;
  groupName?: string;
  keyName: PERMISSION_TYPE;
  name: string;
}

export interface IReportPage {
  value: number;
  label: string;
  id?: number;
}

export interface MonitorInterface {
  id?: number;
  identifier?: string;
  name: string;
  alias?: string;
  description?: string;
  url?: string;
  isActive?: boolean;
  createDateUrl?: Date;
  updateDateUrl?: Date;
  dashboard?: {
    id?: number;
    nameScreen: string;
    isActive: boolean;
  };
  report?: {
    id?: number;
    name?: string;
    accessToken?: string;
    embedUrl?: string;
    pageName?: string;
  };
}

export interface MonitorInterfaceItem {
  id?: number;
  identifier?: string;
  name?: string;
  alias?: string;
  description?: string;
  url?: string;
  isActive?: boolean;
  createDateUrl?: Date;
  updateDateUrl?: Date;
  report?: {
    description?: string;
    id: number;
    name: string;
    reportId?: number;
  };
  dashboard?: {
    id: number;
    nameScreen: string;
    isActive: boolean;
  };
}
export interface FilterInterface {
  taller?: string;
  servicio?: string;
  zona?: string;
}
export interface DashboardInterface {
  OSPADRE: string;
  DEVICEID: string;
  GROUPID: string;
  WORKSHOPLOCATIONID: string;
  STATUS?: number;
  SUBSTATUSTO?: string;
  STATUSTO?: number;
  RECEPCION?: string;
  RECEPCIONHORA?: string;
  fecharecepcion?: Date;
  DIASPASADOS?: number;
  HORASPASADAS?: string;
  OSHIJA: string;
  SERVICIO: string;
  TALLER: string;
  SOLUTION: string;
  MonthName: string;
  CurrentWeekNumber: string;
  ULTIMAACTUALIZACION: string;
  CAUSE: string;
  WORKSHOP: string;
  CREATEDDATETIME1: string;
  LOGS?: Array<any>;
  ZONE_CITY: string;
}

export interface BinnacleInterface {
  id?: string;
  order: string;
  status: string;
  username?: string;
  substatus?: string;
  serviceType?: string;
  workshop?: {
    name: string;
    region: string;
    city: string;
  };
  createdDate: Date;
  symptoms: string;
  solution: string;
  rec?: number;
  device?: string;
  customerRut?: string;
  description?: string;
  type: string;
  title?: string;
}


export interface LogsBinnacleInterface {
  id?: string;
  os_padre: string;
  caseid?: string;
  createdby1: string;
  createddatetime1: Date;
  statusto?: string;
  estado?: string;
  substatusto?: string;
  syncstartdatetime?: string;
  recid?: string;
  projid?: string;
  schedfromdate?: Date;
  workshop: string;
  city?: string;
  region?: string;
  tipo_servicio?: string;
  grupo_servicio?: string;
  solution?: string;
  cause?: string;
  description?: string;
  type: string;
}