import { Permission } from './index'

export interface Role {
  id: number
  name: string
  keyName: string
  description: string | null
  isActive: boolean
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

export interface RoleListResponse {
  roles: Role[]
  total: number
}

export interface CreateRoleDto {
  name: string
  keyName: string
  description?: string
  isActive?: boolean
  permissionIds: number[]
  reportPageIds?: number[]
}

export interface UpdateRoleDto {
  id: number
  name?: string
  keyName?: string
  description?: string | null
  isActive?: boolean
  permissionIds?: number[]
  reportPageIds?: number[]
}

export interface ListParams {
  take?: number
  skip?: number
  search?: string
}