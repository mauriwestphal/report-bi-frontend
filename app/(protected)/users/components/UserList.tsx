'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react'
import { getUsers, deleteUser, updateUser } from '@/lib/api'
import { User } from '@/lib/types/users'
import { useApp } from '@/hooks/useApp'
import { PERMISSION_TYPE } from '@/shared/enum/permission.enum'

interface UserListProps {
  search: string
  onSearchChange: (value: string) => void
}

const PAGE_SIZE = 10

export default function UserList({ search, onSearchChange }: UserListProps) {
  const router = useRouter()
  const { user: currentUser } = useApp()
  
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({ open: false, user: null })
  const [enableDialog, setEnableDialog] = useState<{ open: boolean; user: User | null }>({ open: false, user: null })

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const fetchUsers = async (params: { take: number; skip: number; search?: string }) => {
    setLoading(true)
    try {
      const response = await getUsers(params)
      setUsers(response.users)
      setTotal(response.total)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers({ take: PAGE_SIZE, skip: 0 })
  }, [])

  const changePage = (newPage: number) => {
    setPage(newPage)
    fetchUsers({ take: PAGE_SIZE, skip: (newPage - 1) * PAGE_SIZE, search: search || undefined })
  }

  const handleSearch = (value: string) => {
    onSearchChange(value)
    setPage(1)
    fetchUsers({ take: PAGE_SIZE, skip: 0, search: value || undefined })
  }

  const handleEnableDisable = async () => {
    if (!enableDialog.user) return
    
    try {
      setLoading(true)
      await updateUser({
        id: enableDialog.user.id,
        isActive: !enableDialog.user.isActive
      })
      
      // Refresh the list
      fetchUsers({ take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE, search: search || undefined })
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setEnableDialog({ open: false, user: null })
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.user) return
    
    try {
      setLoading(true)
      await deleteUser(deleteDialog.user.id)
      
      // Refresh the list
      fetchUsers({ take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE, search: search || undefined })
    } catch (error) {
      console.error('Error deleting user:', error)
    } finally {
      setDeleteDialog({ open: false, user: null })
      setLoading(false)
    }
  }

  const canCreateUser = currentUser?.activePermissions?.includes(PERMISSION_TYPE.CAN_CREATE_USER)
  const canEditUser = currentUser?.activePermissions?.includes(PERMISSION_TYPE.CAN_EDIT_USER)
  const canEnableUser = currentUser?.activePermissions?.includes(PERMISSION_TYPE.CAN_ENABLE_USER)
  const canDeleteUser = currentUser?.activePermissions?.includes(PERMISSION_TYPE.CAN_DELETE_USER)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar usuarios por email o nombre..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Users Table */}
      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">Nombre completo</th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">Correo electrónico</th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">Perfil</th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">Estado</th>
              <th className="h-10 px-4 text-left font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse"></div></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className={`border-b border-border transition-colors hover:bg-muted/50 last:border-0 ${
                    !user.isActive ? 'opacity-60' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                      {user.role?.name || 'Sin perfil'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {canEditUser && (
                        <button
                          onClick={() => router.push(`/users/edit/${user.id}`)}
                          className="p-1 hover:bg-muted rounded"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      
                      {canEnableUser && (
                        <button
                          onClick={() => setEnableDialog({ open: true, user })}
                          className="p-1 hover:bg-muted rounded"
                          title={user.isActive ? 'Desactivar' : 'Activar'}
                        >
                          {user.isActive ? (
                            <XCircle className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </button>
                      )}
                      
                      {canDeleteUser && (
                        <button
                          onClick={() => setDeleteDialog({ open: true, user })}
                          className="p-1 hover:bg-muted rounded text-destructive"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <button
            onClick={() => changePage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
          >
            ← Anterior
          </button>
          <span className="text-sm text-muted-foreground px-2">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => changePage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Enable/Disable Dialog */}
      {enableDialog.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">
              {enableDialog.user?.isActive ? 'Desactivar usuario' : 'Activar usuario'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {enableDialog.user?.isActive
                ? '¿Estás seguro de desactivar este usuario?'
                : '¿Estás seguro de activar este usuario?'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEnableDialog({ open: false, user: null })}
                className="px-4 py-2 border border-border rounded-md hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                onClick={handleEnableDisable}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Eliminar usuario</h3>
            <p className="text-muted-foreground mb-6">
              ¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteDialog({ open: false, user: null })}
                className="px-4 py-2 border border-border rounded-md hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}