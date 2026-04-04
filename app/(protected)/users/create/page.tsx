'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import UserForm from '../components/UserForm'
import { useApp } from '@/hooks/useApp'
import { PERMISSION_TYPE } from '@/shared/enum/permission.enum'

export default function CreateUserPage() {
  const router = useRouter()
  const { user } = useApp()

  const canCreateUser = user?.activePermissions?.includes(PERMISSION_TYPE.CAN_CREATE_USER)

  // Redirect if user doesn't have permission
  if (!canCreateUser) {
    router.push('/users')
    return null
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/users')}
          className="p-2 hover:bg-muted rounded-md transition-colors"
          title="Volver"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Crear Nuevo Usuario</h1>
          <p className="text-muted-foreground">
            Complete el formulario para agregar un nuevo usuario al sistema
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="rounded-lg border border-border bg-card p-6">
        <UserForm onSuccess={() => router.push('/users')} />
      </div>
    </div>
  )
}