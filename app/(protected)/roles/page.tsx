import { Suspense } from 'react'
import { apiFetchServer } from '@/lib/api/server'
import { PERMISSION_TYPE } from '@/shared/enum/permission.enum'
import RolesGrid from '@/components/features/roles/RolesGrid'
import RolesSkeleton from '@/components/features/roles/RolesSkeleton'
import { PageHeader } from '@/components/layout/PageHeader'

export const dynamic = 'force-dynamic'

export default async function RolesPage() {
  // Obtener roles iniciales en el servidor
  let initialRoles = []
  let total = 0
  
  try {
    const response = await apiFetchServer<{ roles: any[], total: number }>('/api/role?take=10&skip=0')
    initialRoles = response.roles
    total = response.total
  } catch (error) {
    console.error('Error fetching roles:', error)
    // Si hay error, inicializar vacío - el error boundary lo manejará
  }

  return (
    <main className="p-8 space-y-6">
      <PageHeader 
        title="Gestión de Roles" 
        description="Administra los roles del sistema y sus permisos"
      />

      {/* Main Content */}
      <div className="rounded-lg border border-border bg-card p-6">
        <Suspense fallback={<RolesSkeleton />}>
          <RolesGrid 
            initialRoles={initialRoles}
            initialTotal={total}
            canCreateRole={true} // Se verificará en el cliente con useApp()
          />
        </Suspense>
      </div>
    </main>
  )
}