'use client'

import { useApp } from '@/hooks/useApp'
import { hasPermission } from '@/lib/auth/permissions'
import type { PermissionKey } from '@/lib/types'

interface PermissionGuardProps {
  permission: PermissionKey
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { user } = useApp()
  return hasPermission(user, permission) ? <>{children}</> : <>{fallback}</>
}
