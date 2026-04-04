import { apiFetch } from './index'
import { User, UserListResponse, CreateUserDto, UpdateUserDto, ListParams } from '@/lib/types/users'

export async function getUsers(params: ListParams): Promise<UserListResponse> {
  const query = new URLSearchParams()
  if (params.take) query.append('take', params.take.toString())
  if (params.skip) query.append('skip', params.skip.toString())
  if (params.search) query.append('search', params.search)
  
  return apiFetch(`/api/user?${query.toString()}`)
}

export async function getUser(id: number): Promise<User> {
  return apiFetch(`/api/user/${id}`)
}

export async function createUser(data: CreateUserDto): Promise<User> {
  return apiFetch('/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export async function updateUser(data: UpdateUserDto): Promise<User> {
  return apiFetch(`/api/user/${data.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export async function deleteUser(id: number): Promise<void> {
  await apiFetch(`/api/user/${id}`, {
    method: 'DELETE',
  })
}