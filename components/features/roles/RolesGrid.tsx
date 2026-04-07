'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Eye, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/hooks/useApp'
import { PERMISSION_TYPE } from '@/shared/enum/permission.enum'
import { getRoles, deleteRole } from '@/lib/api/roles'
import { Role } from '@/lib/types/roles'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'

interface RolesGridProps {
  initialRoles: Role[]
  initialTotal: number
  canCreateRole: boolean
}

export default function RolesGrid({ initialRoles, initialTotal, canCreateRole }: RolesGridProps) {
  const router = useRouter()
  const { user } = useApp()
  
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [total, setTotal] = useState(initialTotal)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)

  const canEditRole = user?.activePermissions?.includes(PERMISSION_TYPE.CAN_EDIT_ROLE)
  const canDeleteRole = user?.activePermissions?.includes(PERMISSION_TYPE.CAN_DELETE_ROLE)

  const fetchRoles = async () => {
    setLoading(true)
    try {
      const response = await getRoles({
        take: pageSize,
        skip: (page - 1) * pageSize,
        search: search || undefined
      })
      setRoles(response.roles)
      setTotal(response.total)
    } catch (error) {
      console.error('Error fetching roles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [page, search])

  const handleDelete = async () => {
    if (!roleToDelete) return
    
    try {
      await deleteRole(roleToDelete.id)
      setRoleToDelete(null)
      fetchRoles() // Refresh the list
    } catch (error) {
      console.error('Error deleting role:', error)
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1) // Reset to first page on search
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar roles..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {canCreateRole && (
          <Button onClick={() => router.push('/roles/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Rol
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Permisos</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-32 bg-muted rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 w-16 bg-muted rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse"></div></TableCell>
                </TableRow>
              ))
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No se encontraron roles
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="font-mono text-sm">{role.keyName}</TableCell>
                  <TableCell>
                    <Badge variant={role.isActive ? "default" : "secondary"}>
                      {role.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {role.permissions?.length || 0} permisos
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/roles/edit/${role.id}`)}
                        disabled={!canEditRole}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRoleToDelete(role)}
                        disabled={!canDeleteRole}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} de {total} roles
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <span className="flex items-center px-3 text-sm">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!roleToDelete}
        onOpenChange={(open) => !open && setRoleToDelete(null)}
        title="Eliminar Rol"
        description={`¿Estás seguro de eliminar el rol "${roleToDelete?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="destructive"
      />
    </div>
  )
}