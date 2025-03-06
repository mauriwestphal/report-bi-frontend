import { AxiosResponse } from "axios";
import { IPermission, IReportPage } from "../../components/layout/interfaces";
import request from "../../utils/request";

const list = (): Promise<AxiosResponse<IPermissionGroup[]>> => {
  return request({
    url: "/api/permission",
    method: "GET",
    private: true,
  });
};

const formatToDataNode = (
  permissionArray: IPermissionGroup[]
): IPermissionDataNode[] => {
  return permissionArray.map((permission) => ({
    title: permission.description,
    key: permission.permissions[0].groupName as string,
    children: permission.permissions.map((element) => ({
      title: element.name,
      key: element.id as number,
    })),
  }));
};

const listReportPage = (): Promise<AxiosResponse<IReportPage[]>> => {
  return request({
    url: "/api/report-page",
    method: "GET",
    private: true,
  });
};


const listReport = (): Promise<AxiosResponse<IReportPage[]>> => {
  return request({
    url: "/api/report-page/report",
    method: "GET",
    private: true,
  });
};
export interface IPermissionDataNode {
  title: string;
  key: number | string;
  children?: IPermissionDataNode[];
}

export interface IPermissionGroup {
  description: string;
  permissions: IPermission[];
}

export interface IPermissionGroup {
  description: string;
  permissions: IPermission[];
}

const PermissionService = {
  list,
  formatToDataNode,
  listReportPage,
  listReport
};

export default PermissionService;
