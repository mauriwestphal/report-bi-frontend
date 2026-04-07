'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import UserList from './components/UserList'
import { useApp } from '@/hooks/useApp'
import { PERMISSION_TYPE } from '@/shared/enum/permission.enum'
import { PageHeader } from '@/components/layout/PageHeader'

export default function UsersPage() {
  const router = useRouter()
  const { user } = useApp()
  const [search, setSearch] = useState('')

  const canCreateUser = user?.activePermissions?.includes(PERMISSION_TYPE.CAN_CREATE_USER)

  return (
    <main className="p-8 space-y-6">
      <PageHeader 
        title="Gestión de Usuarios" 
        description="Administra los usuarios del sistema y sus permisos"
      >
        {canCreateUser && (
          <button
            onClick={() => router.push('/users/create')}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo usuario
          </button>
        )}
      </PageHeader>

      {/* Main Content */}
      <div className="rounded-lg border border-border bg-card p-6">
        <UserList 
          search={search}
          onSearchChange={setSearch}
        />
      </div>
    </main>
  )
}