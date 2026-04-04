'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import MonitorForm from '@/components/features/monitors/MonitorForm'
import { useApp } from '@/hooks/useApp'
import { PERMISSION_TYPE } from '@/shared/enum/permission.enum'

export default function CreateMonitorPage() {
  const router = useRouter()
  const { user } = useApp()

  const canCreateMonitor = user?.activePermissions?.includes(PERMISSION_TYPE.CAN_CREATE_MONITOR)

  // Redirect if user doesn't have permission
  useEffect(() => {
    if (!canCreateMonitor) {
      router.push('/monitors')
    }
  }, [canCreateMonitor, router])

  if (!canCreateMonitor) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/monitors')}
          className="p-2 hover:bg-muted rounded-md transition-colors"
          title="Volver"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Crear Nuevo Monitor</h1>
          <p className="text-muted-foreground">
            Complete el formulario para agregar un nuevo monitor al sistema
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="rounded-lg border border-border bg-card p-6">
        <MonitorForm onSuccess={() => router.push('/monitors')} />
      </div>
    </div>
  )
}