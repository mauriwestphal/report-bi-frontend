'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { User } from '@/lib/types/users'
import { useApp } from '@/hooks/useApp'
import { PERMISSION_TYPE } from '@/shared/enum/permission.enum'

interface UserActionsProps {
  user: User
  onEnableDisable?: () => void
  onDelete?: () => void
}

export default function UserActions({ user, onEnableDisable, onDelete }: UserActionsProps) {
  const router = useRouter()
  const { user: currentUser } = useApp()
  
  const canEditUser = currentUser?.activePermissions?.includes(PERMISSION_TYPE.CAN_EDIT_USER)
  const canEnableUser = currentUser?.activePermissions?.includes(PERMISSION_TYPE.CAN_ENABLE_USER)
  const canDeleteUser = currentUser?.activePermissions?.includes(PERMISSION_TYPE.CAN_DELETE_USER)

  // If no permissions for any action, don't render anything
  if (!canEditUser && !canEnableUser && !canDeleteUser) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      {canEditUser && (
        <button
          onClick={() => router.push(`/users/edit/${user.id}`)}
          className="p-1 hover:bg-muted rounded transition-colors"
          title="Editar usuario"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
      
      {canEnableUser && (
        <button
          onClick={onEnableDisable}
          className="p-1 hover:bg-muted rounded transition-colors"
          title={user.isActive ? 'Desactivar usuario' : 'Activar usuario'}
        >
          {user.isActive ? (
            <XCircle className="h-4 w-4 text-yellow-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
        </button>
      )}
      
      {canDeleteUser && (
        <button
          onClick={onDelete}
          className="p-1 hover:bg-muted rounded transition-colors text-destructive"
          title="Eliminar usuario"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}