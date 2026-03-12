'use client'

import { useApp } from '@/hooks/useApp'
import type { PermissionKey } from '@/lib/types'

interface PermissionGuardProps {
  permission: PermissionKey
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { hasPermission } = useApp()
  return hasPermission(permission) ? <>{children}</> : <>{fallback}</>
}
