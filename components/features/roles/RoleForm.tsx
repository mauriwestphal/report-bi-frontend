'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useApp } from '@/hooks/useApp'
import { PERMISSION_TYPE } from '@/shared/enum/permission.enum'
import { roleSchema, RoleFormValues } from '@/lib/validations/role'
import { createRole, updateRole } from '@/lib/api/roles'
import PermissionTree, { PermissionGroup } from '@/components/shared/Inputs/PermissionTree'
import { IPermission } from '@/components/layout/interfaces'

interface RoleFormProps {
  role?: any // Role from API
  permissions: any[] // Raw permissions from API
  reportPages?: any[]
  mode: 'create' | 'edit'
}

export default function RoleForm({ role, permissions, reportPages = [], mode }: RoleFormProps) {
  const router = useRouter()
  const { user } = useApp()
  const [loading, setLoading] = useState(false)
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([])

  const canViewReports = user?.activePermissions?.includes(PERMISSION_TYPE.CAN_VIEW_REPORTS)

  // Transform raw permissions into groups for PermissionTree
  useEffect(() => {
    if (permissions && permissions.length > 0) {
      const groupsMap = new Map<string, IPermission[]>()
      
      permissions.forEach((group: any) => {
        if (group.permissions && Array.isArray(group.permissions)) {
          group.permissions.forEach((perm: any) => {
            const groupName = perm.groupName || 'Sin grupo'
            if (!groupsMap.has(groupName)) {
              groupsMap.set(groupName, [])
            }
            groupsMap.get(groupName)!.push({
              id: perm.id,
              name: perm.name,
              keyName: perm.keyName,
              groupName: perm.groupName,
              description: perm.description
            })
          })
        }
      })

      const groups: PermissionGroup[] = Array.from(groupsMap.entries()).map(([name, perms]) => ({
        name,
        permissions: perms
      }))

      setPermissionGroups(groups)
    }
  }, [permissions])

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || '',
      keyName: role?.keyName || '',
      description: role?.description || '',
      isActive: role?.isActive ?? true,
      permissionIds: role?.permissions?.map((p: any) => p.id) || [],
      reportPageIds: role?.reportPages?.map((rp: any) => rp.id) || [],
    }
  })

  const onSubmit = async (data: RoleFormValues) => {
    setLoading(true)
    try {
      if (mode === 'create') {
        await createRole(data)
        router.push('/roles')
        router.refresh()
      } else if (mode === 'edit' && role) {
        await updateRole(role.id, data)
        router.push('/roles')
        router.refresh()
      }
    } catch (error: any) {
      console.error('Error saving role:', error)
      // Aquí podríamos mostrar un toast de error
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Rol *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Administrador" {...field} />
                </FormControl>
                <FormDescription>
                  Nombre descriptivo del rol
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: ADMIN" {...field} />
                </FormControl>
                <FormDescription>
                  Identificador único en mayúsculas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descripción del rol y sus responsabilidades"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Estado</FormLabel>
                  <FormDescription>
                    El rol estará disponible para asignar a usuarios
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Permissions */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Permisos</h3>
            <p className="text-sm text-muted-foreground">
              Selecciona los permisos que tendrá este rol
            </p>
          </div>

          <FormField
            control={form.control}
            name="permissionIds"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PermissionTree
                    value={field.value}
                    onChange={field.onChange}
                    groups={permissionGroups}
                    loading={permissionGroups.length === 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Report Pages (conditional) */}
        {canViewReports && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Páginas de Reporte</h3>
              <p className="text-sm text-muted-foreground">
                Selecciona las páginas de reporte a las que tendrá acceso este rol
              </p>
            </div>

            <FormField
              control={form.control}
              name="reportPageIds"
              render={({ field }) => (
                <FormItem>
                  <Select
                    value={field.value.map(String)}
                    onValueChange={(values) => field.onChange(values.map(Number))}
                    multiple
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar páginas de reporte" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reportPages.map((page) => (
                        <SelectItem key={page.id} value={String(page.id)}>
                          {page.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {mode === 'create' ? 'Crear Rol' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Form>
  )
}