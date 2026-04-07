import { getMonitors } from '@/lib/api/monitors'
import { hasPermission } from '@/lib/auth/permissions'
import { PERMISSIONS } from '@/lib/auth/constants'
import { getServerSession } from '@/lib/auth/server'
import MonitorsList from '@/components/features/monitors/MonitorsList'
import { PageHeader } from '@/components/layout/PageHeader'

export default async function MonitorsPage() {
  const session = await getServerSession()
  
  if (!session) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Sesión no válida</h2>
        <p className="mt-2 text-gray-600">Por favor, inicia sesión para acceder a esta página.</p>
      </div>
    )
  }

  // Verificar permisos básicos para ver la página
  if (!hasPermission(session.user, PERMISSIONS.SESSION_GUARD)) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Acceso denegado</h2>
        <p className="mt-2 text-gray-600">No tienes permisos para acceder a esta página.</p>
      </div>
    )
  }

  try {
    const monitors = await getMonitors()
    
    return (
      <main className="p-8">
        <PageHeader title="Monitores" />
        <div className="max-w-7xl mx-auto">
          <MonitorsList monitors={monitors} />
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading monitors:', error)
    
    return (
      <main className="p-8">
        <PageHeader title="Monitores" />
        <div className="py-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Error al cargar monitores</h2>
          <p className="mt-2 text-gray-600">
            {error instanceof Error ? error.message : 'Ocurrió un error inesperado'}
          </p>
        </div>
      </main>
    )
  }
}
