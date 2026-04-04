'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import UserList from './components/UserList'
import { useApp } from '@/hooks/useApp'
import { PERMISSION_TYPE } from '@/shared/enum/permission.enum'

export default function UsersPage() {
  const router = useRouter()
  const { user } = useApp()
  const [search, setSearch] = useState('')

  const canCreateUser = user?.activePermissions?.includes(PERMISSION_TYPE.CAN_CREATE_USER)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema y sus permisos
          </p>
        </div>
        
        {canCreateUser && (
          <button
            onClick={() => router.push('/users/create')}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo usuario
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="rounded-lg border border-border bg-card p-6">
        <UserList 
          search={search}
          onSearchChange={setSearch}
        />
      </div>
    </div>
  )
}