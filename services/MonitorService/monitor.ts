import { AxiosResponse } from "axios";
import { MonitorInterface, MonitorInterfaceItem } from "../../components/layout/interfaces";
import request from "../../utils/request";
import { ListMonitor } from "../interfaces/List.interface";

const listMonitor = (
  params: ListMonitor
): Promise<AxiosResponse<{ monitors: MonitorInterface[]; total: number }>> => {
  return request({
    url: "/api/monitor",
    method: "GET",
    params,
    private: true,
  });
};

const getMonitor = (id: string): Promise<AxiosResponse<MonitorInterface>> => {
  return request({
    url: `/api/monitor/${id}`,
    method: "GET",
    private: true,
  });
};

const getOneMonitor = (id: number): Promise<AxiosResponse<MonitorInterfaceItem>> => {
  return request({
    url: `/api/monitor/${id}`,
    method: "GET",
    private: true,
  });
};

const createMonitor = (data: Partial<MonitorInterfaceItem>) => {
  return request({
    url: "/api/monitor",
    method: "POST",
    data,
    private: true,
  }).catch(({ data: errData, status }: any) => {
    throw { ...errData, status };
  });
};

const updateMonitor = (body: MonitorInterfaceItem) => {
  return request({
    url: `/api/monitor/${body.id}`,
    method: "PATCH",
    data: body,
    private: true,
  }).catch(({ data: errData, status }: any) => {
    throw { ...errData, status };
  });
};

const updateEnableDesable = (id: number) => {
  return request({
    url: `/api/monitor/updateEnableDesable/${id}`,
    method: "PATCH",
    private: true,
  }).catch(({ data: errData }: any) => {
    throw errData;
  });
};

const deleteMonitor = (id: number) => {
  return request({
    url: `/api/monitor/${id}`,
    method: "DELETE",
    private: true,
  }).catch(({ data: errData }: any) => {
    throw errData;
  });
};

const MonitorService = {
  listMonitor,
  createMonitor,
  updateMonitor,
  deleteMonitor,
  getMonitor,
  getOneMonitor,
  updateEnableDesable,
};

export default MonitorService;
