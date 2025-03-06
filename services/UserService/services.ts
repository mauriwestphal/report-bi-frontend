import { AxiosResponse } from "axios";
import { UserInterface } from "../../components/layout/interfaces";
import request from "../../utils/request";
import { List } from "../interfaces/List.interface";

const list = (
  params: List
): Promise<AxiosResponse<{ users: UserInterface[]; total: number }>> => {
  return request({
    url: "/api/user",
    method: "GET",
    params,
    private: true,
  });
};

const get = (id: number): Promise<AxiosResponse<UserInterface>> => {
  return request({
    url: `/api/user/${id}`,
    method: "GET",
    private: true,
  }).catch(({ data }) => {
    throw data;
  });
};

const getLoggerUser = (): Promise<AxiosResponse<UserInterface>> => {
  return request({
    url: `/auth/me`,
    method: "GET",
    private: true,
  }).catch(({ data }) => {
    throw data;
  });
};

const create = (body: UserServiceDto) => {
  return request({
    url: "/api/user",
    method: "POST",
    data: body,
    private: true,
  }).catch(({ data }) => {
    throw data;
  });
};

const update = (body: UserUpdateDto) => {
  return request({
    url: `/api/user/${body.id}`,
    method: "PATCH",
    data: body,
    private: true,
  }).catch(({ data }) => {
    throw data;
  });
};

const deleteUser = (id: number) => {
  return request({
    url: `/api/user/${id}`,
    method: "DELETE",
    private: true,
  }).catch(({ data }) => {
    throw data;
  });
};

const UserService = {
  list,
  create,
  update,
  get,
  getLoggerUser,
  deleteUser,
};

export default UserService;

export interface UserServiceDto extends UserInterface {
  workshop_id?:any;
  zone_id?: any;
  service_id?:any;
  contract_supervisor_id?:any;
}

export interface UserUpdateDto extends Partial<UserInterface> {
  id: number;
  workshop_id?:any;
  zone_id?: any;
  service_id?:any;
  contract_supervisor_id?:any;
}
