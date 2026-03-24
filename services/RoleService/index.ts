import { AxiosResponse } from "axios";
import { RoleInterface } from "../../components/layout/interfaces";
import request from "../../utils/request";
import { List } from "../interfaces/List.interface";

export interface CreateRoleDto {
  name: string;
  keyName: string;
  isActive: boolean;
  permissionIds: number[];
  reportPageIds?: number[];
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {
  id: number;
}

const list = (params: List): Promise<AxiosResponse<RoleInterface[]>> => {
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

const create = (data: CreateRoleDto): Promise<AxiosResponse<RoleInterface>> => {
  return request({
    url: "/api/role",
    method: "POST",
    data,
    private: true,
  }).catch(({ data: errData }) => {
    throw errData;
  });
};

const update = (data: UpdateRoleDto): Promise<AxiosResponse<RoleInterface>> => {
  return request({
    url: `/api/role/${data.id}`,
    method: "PATCH",
    data,
    private: true,
  }).catch(({ data: errData }) => {
    throw errData;
  });
};

const deleteRole = (id: number): Promise<AxiosResponse<void>> => {
  return request({
    url: `/api/role/${id}`,
    method: "DELETE",
    private: true,
  }).catch(({ data: errData }) => {
    throw errData;
  });
};

const RoleService = {
  list,
  create,
  findOne,
  update,
  deleteRole,
};

export default RoleService;
