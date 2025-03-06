import { AxiosResponse } from "axios";
import { MonitorInterface, MonitorInterfaceItem } from "../../components/layout/interfaces";
import request from "../../utils/request";
import { ListMonitor } from "../interfaces/List.interface";
import { identity } from 'lodash';

const listMonitor = (
  params: ListMonitor
): Promise<AxiosResponse<{ monitors: MonitorInterface[] }>> => {
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
    url: `/api/monitor/editar/${id}`,
    method: "GET",
    private: true,
  });
}
const updateMonitor = (body: MonitorInterfaceItem) => {
  return request({
    url: `/api/monitor/${body.id}`,
    method: "PATCH",
    data: body,
    private: true,
  }).catch(({ data }) => {
    throw data;
  });
};

const updateEnableDesable = (id: number) => {
  return request({
    url: `/api/monitor/updateEnableDesable/${id}`,
    method: "PATCH",
    private: true,
  }).catch(({ data }) => {
    throw data;
  });
}
const deleteMonitor = (id: number) => {
  return request({
    url: `/api/monitor/${id}`,
    method: "PATCH",
    private: true,
  }).catch(({ data }) => {
    throw data;
  });
};

const MonitorService = {
  listMonitor,
  updateMonitor,
  deleteMonitor,
  getMonitor,
  getOneMonitor,
  updateEnableDesable
};

export default MonitorService;
