import { apiFetch } from './index'
import { Role, RoleListResponse, CreateRoleDto, UpdateRoleDto, ListParams } from '@/lib/types/roles'

export async function getRoles(params?: ListParams): Promise<RoleListResponse> {
  const queryParams = new URLSearchParams()
  if (params?.take) queryParams.append('take', params.take.toString())
  if (params?.skip) queryParams.append('skip', params.skip.toString())
  if (params?.search) queryParams.append('search', params.search)
  
  const queryString = queryParams.toString()
  const url = `/api/role${queryString ? `?${queryString}` : ''}`
  
  return apiFetch(url)
}

export async function getRole(id: number): Promise<Role> {
  return apiFetch(`/api/role/${id}`)
}

export async function createRole(data: CreateRoleDto): Promise<Role> {
  return apiFetch('/api/role', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

export async function updateRole(id: number, data: UpdateRoleDto): Promise<Role> {
  return apiFetch(`/api/role/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
}

export async function deleteRole(id: number): Promise<void> {
  return apiFetch(`/api/role/${id}`, {
    method: 'DELETE'
  })
}

export async function getPermissions(): Promise<any[]> {
  return apiFetch('/api/permission')
}