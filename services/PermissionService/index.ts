import { AxiosResponse } from "axios";
import request from "../../utils/request";
import { IPermission, IReportPage } from "../../components/layout/interfaces";

export interface IPermissionGroup {
  id: string | number;
  groupName: string;
  permissions: IPermission[];
}

export interface IPermissionDataNode {
  key: string | number;
  title: string;
  children?: IPermissionDataNode[];
}

const list = (): Promise<AxiosResponse<IPermissionGroup[]>> => {
  return request({
    url: "/api/permission",
    method: "GET",
    private: true,
  });
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
    url: "/api/report",
    method: "GET",
    private: true,
  });
};

const formatToDataNode = (groups: IPermissionGroup[]): IPermissionDataNode[] => {
  return groups.map((group) => ({
    key: group.groupName,
    title: group.groupName,
    children: group.permissions.map((p) => ({
      key: p.id,
      title: p.name,
    })),
  }));
};

const PermissionService = {
  list,
  listReportPage,
  listReport,
  formatToDataNode,
};

export default PermissionService;
