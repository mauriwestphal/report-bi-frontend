import { PERMISSIONS, PermissionValue } from './constants'
import type { User } from '@/lib/types'

interface UserWithPermissions {
  id?: number
  activePermissions?: string[]
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  user: User | UserWithPermissions | null | undefined,
  permission: PermissionValue | string
): boolean {
  if (!user) return false
  
  // Special case for SESSION_GUARD - any authenticated user can access
  if (permission === 'SESSION_GUARD') {
    return !!user.id
  }
  
  // Check if user has the permission in their activePermissions array
  return user.activePermissions?.includes(permission as string) || false
}

/**
 * Check if user has any of the given permissions
 */
export function hasAnyPermission(
  user: User | null | undefined,
  permissions: (PermissionValue | string)[]
): boolean {
  if (!user) return false
  return permissions.some(permission => hasPermission(user, permission))
}

/**
 * Check if user has all of the given permissions
 */
export function hasAllPermissions(
  user: User | null | undefined,
  permissions: (PermissionValue | string)[]
): boolean {
  if (!user) return false
  return permissions.every(permission => hasPermission(user, permission))
}