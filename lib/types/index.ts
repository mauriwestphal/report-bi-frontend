export type PermissionKey =
  | 'CAN_CREATE_USER'
  | 'CAN_EDIT_USER'
  | 'CAN_ENABLE_USER'
  | 'CAN_DELETE_USER'
  | 'CAN_CREATE_ROLE'
  | 'CAN_EDIT_ROLE'
  | 'CAN_DELETE_ROLE'
  | 'CAN_VIEW_REPORTS'
  | 'CAN_CREATE_MONITOR'
  | 'CAN_EDIT_MONITOR'
  | 'CAN_ENABLE_MONITOR'
  | 'CAN_DELETE_MONITOR'
  | 'CAN_GENERATE_NEW_URL'

export interface Permission {
  id: number
  keyName: PermissionKey
}

export interface Role {
  id: number
  name: string
  permissions: Permission[]
  keyName?: string
  description?: string | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface User {
  id: number
  name: string
  email: string
  role: Role
  activePermissions?: string[]
}
