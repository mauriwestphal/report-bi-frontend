'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MonitorList } from '@/lib/types/monitors'
import { toggleMonitorActive, deleteMonitor } from '@/lib/api/monitors'
import { useApp } from '@/hooks/useApp'
import { hasPermission } from '@/lib/auth/permissions'
import { PERMISSIONS } from '@/lib/auth/constants'

interface MonitorsListProps {
  monitors: MonitorList[]
}

export default function MonitorsList({ monitors }: MonitorsListProps) {
  const router = useRouter()
  const { user } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const filteredMonitors = useMemo(() => {
    if (!searchTerm.trim()) return monitors

    const term = searchTerm.toLowerCase()
    return monitors.filter(
      (monitor) =>
        monitor.name.toLowerCase().includes(term) ||
        monitor.alias.toLowerCase().includes(term) ||
        monitor.description.toLowerCase().includes(term)
    )
  }, [monitors, searchTerm])

  const handleView = (identifier: string) => {
    router.push(`/reports/${identifier}`)
  }

  const handleEdit = (id: number) => {
    router.push(`/monitors/edit/${id}`)
  }

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    if (!hasPermission(user, PERMISSIONS.CAN_ENABLE_MONITOR)) return

    const confirmMessage = currentStatus
      ? '¿Desactivar este monitor?'
      : '¿Activar este monitor?'

    if (!window.confirm(confirmMessage)) return

    setIsLoading(id)
    setError(null)

    try {
      await toggleMonitorActive(id)
      // Recargar la página para reflejar el cambio
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado')
    } finally {
      setIsLoading(null)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!hasPermission(user, PERMISSIONS.CAN_DELETE_MONITOR)) return

    if (!window.confirm(`¿Eliminar el monitor "${name}"? Esta acción no se puede deshacer.`)) return

    setIsLoading(id)
    setError(null)

    try {
      await deleteMonitor(id)
      // Recargar la página para reflejar el cambio
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar monitor')
    } finally {
      setIsLoading(null)
    }
  }

  const canCreate = hasPermission(user, PERMISSIONS.CAN_CREATE_MONITOR)
  const canEdit = hasPermission(user, PERMISSIONS.CAN_EDIT_MONITOR)
  const canEnable = hasPermission(user, PERMISSIONS.CAN_ENABLE_MONITOR)
  const canDelete = hasPermission(user, PERMISSIONS.CAN_DELETE_MONITOR)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Monitores</h1>
          <p className="mt-1 text-sm text-gray-500">
            Lista de monitores configurados en el sistema
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => router.push('/monitors/create')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Crear nuevo monitor
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, alias o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alias
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMonitors.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  {searchTerm ? 'No se encontraron monitores con ese criterio' : 'No hay monitores configurados'}
                </td>
              </tr>
            ) : (
              filteredMonitors.map((monitor) => (
                <tr key={monitor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{monitor.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{monitor.alias}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {monitor.description || 'Sin descripción'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        monitor.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {monitor.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(monitor.identifier)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver reporte"
                      >
                        Ver
                      </button>
                      
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(monitor.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar"
                        >
                          Editar
                        </button>
                      )}
                      
                      {canEnable && (
                        <button
                          onClick={() => handleToggleActive(monitor.id, monitor.isActive)}
                          disabled={isLoading === monitor.id}
                          className={`${
                            monitor.isActive
                              ? 'text-yellow-600 hover:text-yellow-900'
                              : 'text-green-600 hover:text-green-900'
                          } ${isLoading === monitor.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={monitor.isActive ? 'Desactivar' : 'Activar'}
                        >
                          {isLoading === monitor.id ? '...' : monitor.isActive ? 'Desactivar' : 'Activar'}
                        </button>
                      )}
                      
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(monitor.id, monitor.name)}
                          disabled={isLoading === monitor.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Counter */}
      <div className="text-sm text-gray-500">
        Mostrando {filteredMonitors.length} de {monitors.length} monitores
      </div>
    </div>
  )
}