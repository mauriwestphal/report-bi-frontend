'use client'

import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import MonitorForm from '@/components/features/monitors/MonitorForm'
import { useApp } from '@/hooks/useApp'
import { PERMISSION_TYPE } from '@/shared/enum/permission.enum'

export default function EditMonitorPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useApp()

  const monitorId = params?.id ? parseInt(params.id as string) : undefined
  const canEditMonitor = user?.activePermissions?.includes(PERMISSION_TYPE.CAN_EDIT_MONITOR)

  // Redirect if user doesn't have permission or no ID
  if (!canEditMonitor || !monitorId || isNaN(monitorId)) {
    router.push('/monitors')
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
          <h1 className="text-2xl font-bold tracking-tight">Editar Monitor</h1>
          <p className="text-muted-foreground">
            Modifique la información del monitor según sea necesario
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="rounded-lg border border-border bg-card p-6">
        <MonitorForm monitorId={monitorId} onSuccess={() => router.push('/monitors')} />
      </div>
    </div>
  )
}