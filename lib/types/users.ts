import { Role } from './index'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  role: Role
}

export interface UserListResponse {
  users: User[]
  total: number
}

export interface CreateUserDto {
  firstName: string
  lastName: string
  email: string
  roleId: number
  isActive?: boolean
}

export interface UpdateUserDto {
  id: number
  firstName?: string
  lastName?: string
  email?: string
  roleId?: number
  isActive?: boolean
}

export interface ListParams {
  take?: number
  skip?: number
  search?: string
}