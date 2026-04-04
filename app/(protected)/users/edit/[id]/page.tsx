'use client'

import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import UserForm from '../../components/UserForm'
import { useApp } from '@/hooks/useApp'
import { PERMISSION_TYPE } from '@/shared/enum/permission.enum'

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useApp()

  const userId = params?.id ? parseInt(params.id as string) : undefined
  const canEditUser = user?.activePermissions?.includes(PERMISSION_TYPE.CAN_EDIT_USER)

  // Redirect if user doesn't have permission or no ID
  if (!canEditUser || !userId || isNaN(userId)) {
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
          <h1 className="text-2xl font-bold tracking-tight">Editar Usuario</h1>
          <p className="text-muted-foreground">
            Modifique la información del usuario según sea necesario
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="rounded-lg border border-border bg-card p-6">
        <UserForm userId={userId} onSuccess={() => router.push('/users')} />
      </div>
    </div>
  )
}