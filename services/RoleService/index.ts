import { AxiosResponse } from "axios";
import { IPermission, RoleInterface } from "../../components/layout/interfaces";
import request from "../../utils/request";
import { List } from "../interfaces/List.interface";

const list = (params: List) => {
  return request({
    url: "/api/role",
    method: "GET",
    params,
    private: true,
  });
};

const findOne = (id: number): Promise<AxiosResponse<RoleInterface>> => {
  return request({
    url: `/api/role/${id}`,
    method: "GET",
    private: true,
  });
};

const create = (data: CreateOrUpdateRole) => {
  return request({
    url: "/api/role",
    method: "POST",
    data,
    private: true,
  }).catch(({ data }) => {
    throw data;
  });
};

const update = (data: CreateOrUpdateRole) => {
  return request({
    url: `/api/role/${data.id}`,
    method: "PATCH",
    data,
    private: true,
  }).catch(({ data }) => {
    throw data;
  });
};

const deleteRole = (id: number) => {
  return request({
    url: `/api/role/${id}`,
    method: "DELETE",
    private: true,
  }).catch(({ data }) => {
    throw data;
  });
};

interface CreateOrUpdateRole extends Partial<RoleInterface> {}

const RoleService = {
  list,
  create,
  findOne,
  update,
  deleteRole,
};

export default RoleService;
