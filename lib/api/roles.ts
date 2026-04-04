import { apiFetch } from './index'
import { Role } from '@/lib/types'

export async function getRoles(): Promise<Role[]> {
  return apiFetch('/api/role')
}