import { Suspense } from 'react'
import { apiFetchServer } from '@/lib/api'
import RoleForm from '@/components/features/roles/RoleForm'
import RolesSkeleton from '@/components/features/roles/RolesSkeleton'

export default async function CreateRolePage() {
  // Obtener permisos disponibles en el servidor
  let permissions = []
  let reportPages = []
  
  try {
    permissions = await apiFetchServer<any[]>('/api/permission')
    
    // Si el usuario tiene CAN_VIEW_REPORTS, obtener reportPages
    // Por ahora inicializamos vacío, el componente RoleForm manejará la lógica condicional
  } catch (error) {
    console.error('Error fetching permissions:', error)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Crear Nuevo Rol</h1>
          <p className="text-muted-foreground">
            Define un nuevo rol y asigna sus permisos
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-lg border border-border bg-card p-6">
        <Suspense fallback={<RolesSkeleton />}>
          <RoleForm 
            permissions={permissions}
            reportPages={reportPages}
            mode="create"
          />
        </Suspense>
      </div>
    </div>
  )
}