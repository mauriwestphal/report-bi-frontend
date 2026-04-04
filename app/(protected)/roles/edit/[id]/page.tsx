import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { apiFetchServer } from '@/lib/api/server'
import RoleForm from '@/components/features/roles/RoleForm'
import RolesSkeleton from '@/components/features/roles/RolesSkeleton'

export const dynamic = 'force-dynamic'

interface EditRolePageProps {
  params: Promise<{ id: string }>
}

export default async function EditRolePage({ params }: EditRolePageProps) {
  const { id } = await params
  const roleId = parseInt(id, 10)
  
  if (isNaN(roleId)) {
    notFound()
  }

  // Obtener rol y permisos disponibles en el servidor
  let role: any = null
  let permissions: any[] = []
  let reportPages: any[] = []
  
  try {
    // Obtener el rol
    role = await apiFetchServer<any>(`/api/role/${roleId}`)
    
    // Obtener permisos disponibles
    permissions = await apiFetchServer<any[]>('/api/permission')
    
    // Si el usuario tiene CAN_VIEW_REPORTS, obtener reportPages
    // Por ahora inicializamos vacío, el componente RoleForm manejará la lógica condicional
  } catch (error) {
    console.error('Error fetching role or permissions:', error)
    notFound()
  }

  if (!role) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editar Rol: {role.name}</h1>
          <p className="text-muted-foreground">
            Modifica los permisos y configuración del rol
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-lg border border-border bg-card p-6">
        <Suspense fallback={<RolesSkeleton />}>
          <RoleForm 
            role={role}
            permissions={permissions}
            reportPages={reportPages}
            mode="edit"
          />
        </Suspense>
      </div>
    </div>
  )
}