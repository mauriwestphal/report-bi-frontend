'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, X, Loader2, Search, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useApp } from '@/hooks/useApp'
import { PERMISSION_TYPE } from '@/shared/enum/permission.enum'
import { roleSchema, RoleFormValues } from '@/lib/validations/role'
import { createRole, updateRole, checkRoleName } from '@/lib/api/roles'
import { useDebounce } from '@/hooks/useDebounce'
import { useAutoSave } from '@/hooks/useAutoSave'
import { notify } from '@/utils/toast'

interface RoleFormProps {
  role?: any // Role from API
  permissions: any[] // Raw permissions from API
  reportPages?: any[]
  mode: 'create' | 'edit'
}

// Componente para tree view de permisos con search
function PermissionTreeWithSearch({ 
  value, 
  onChange, 
  groups, 
  loading 
}: { 
  value: number[]
  onChange: (value: number[]) => void
  groups: any[]
  loading: boolean
}) {
  const [search, setSearch] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups
    
    const searchLower = search.toLowerCase()
    return groups.map(group => ({
      ...group,
      permissions: group.permissions.filter((perm: any) => 
        perm.name.toLowerCase().includes(searchLower) ||
        perm.description?.toLowerCase().includes(searchLower) ||
        perm.keyName.toLowerCase().includes(searchLower)
      )
    })).filter(group => group.permissions.length > 0)
  }, [groups, search])

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    )
  }

  const togglePermission = (permissionId: number) => {
    const newValue = value.includes(permissionId)
      ? value.filter(id => id !== permissionId)
      : [...value, permissionId]
    onChange(newValue)
  }

  const toggleAllInGroup = (groupName: string, permissions: any[]) => {
    const groupPermissionIds = permissions.map((p: any) => p.id)
    const allSelected = groupPermissionIds.every(id => value.includes(id))
    
    if (allSelected) {
      // Deseleccionar todos
      onChange(value.filter(id => !groupPermissionIds.includes(id)))
    } else {
      // Seleccionar todos
      const newValue = [...value]
      groupPermissionIds.forEach(id => {
        if (!newValue.includes(id)) {
          newValue.push(id)
        }
      })
      onChange(newValue)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar permisos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Permissions tree */}
      <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
        {filteredGroups.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {search ? 'No se encontraron permisos' : 'No hay permisos disponibles'}
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.name} className="divide-y">
              {/* Group header */}
              <div 
                className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleGroup(group.name)}
              >
                <div className="flex items-center gap-3">
                  <div className={`transform transition-transform ${
                    expandedGroups.includes(group.name) ? 'rotate-90' : ''
                  }`}>
                    ▶
                  </div>
                  <div>
                    <h4 className="font-medium">{group.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {group.permissions.length} permiso(s)
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleAllInGroup(group.name, group.permissions)
                  }}
                >
                  {group.permissions.every((p: any) => value.includes(p.id)) 
                    ? 'Deseleccionar todos' 
                    : 'Seleccionar todos'}
                </Button>
              </div>

              {/* Permissions list */}
              {expandedGroups.includes(group.name) && (
                <div className="bg-muted/20">
                  {group.permissions.map((permission: any) => (
                    <div
                      key={permission.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted/30 cursor-pointer"
                      onClick={() => togglePermission(permission.id)}
                    >
                      <div className={`h-4 w-4 border rounded flex items-center justify-center ${
                        value.includes(permission.id)
                          ? 'bg-primary border-primary'
                          : 'border-border'
                      }`}>
                        {value.includes(permission.id) && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{permission.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {permission.keyName}
                        </div>
                        {permission.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {permission.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Selected permissions summary */}
      {value.length > 0 && (
        <div className="p-3 border rounded-md bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Permisos seleccionados: {value.length}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange([])}
            >
              Limpiar todos
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {value.slice(0, 10).map(permissionId => {
              const permission = groups
                .flatMap(g => g.permissions)
                .find((p: any) => p.id === permissionId)
              return permission ? (
                <span
                  key={permissionId}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                >
                  {permission.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePermission(permissionId)
                    }}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ) : null
            })}
            {value.length > 10 && (
              <span className="text-xs text-muted-foreground">
                +{value.length - 10} más
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function RoleForm({ role, permissions, reportPages = [], mode }: RoleFormProps) {
  const router = useRouter()
  const { user } = useApp()
  const [loading, setLoading] = useState(false)
  const [nameValidation, setNameValidation] = useState<{isValid: boolean, message: string, isChecking: boolean}>({
    isValid: true,
    message: '',
    isChecking: false
  })
  const [keyNameValidation, setKeyNameValidation] = useState<{isValid: boolean, message: string, isChecking: boolean}>({
    isValid: true,
    message: '',
    isChecking: false
  })

  const canViewReports = user?.activePermissions?.includes(PERMISSION_TYPE.CAN_VIEW_REPORTS)

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || '',
      keyName: role?.keyName || '',
      description: role?.description || '',
      isActive: role?.isActive ?? true,
      permissionIds: role?.permissions?.map((p: any) => p.id) || [],
      reportPageIds: role?.reportPages?.map((rp: any) => rp.id) || [],
    },
    mode: 'onChange',
  })

  const name = form.watch('name')
  const keyName = form.watch('keyName')
  const debouncedName = useDebounce(name, 500)
  const debouncedKeyName = useDebounce(keyName, 500)

  // Auto-save
  const formData = form.watch()
  useAutoSave({
    data: formData,
    key: `role-form-${role?.id || 'new'}`,
    delay: 30000,
    onSave: (savedData: any) => {
      if (mode === 'create') {
        Object.keys(savedData).forEach((key) => {
          form.setValue(key as keyof RoleFormValues, savedData[key])
        })
      }
    },
    enabled: mode === 'create',
  })

  // Validación de nombre único
  useEffect(() => {
    const validateName = async () => {
      if (!debouncedName || debouncedName === role?.name) {
        setNameValidation({ isValid: true, message: '', isChecking: false })
        return
      }

      if (debouncedName.length < 2) {
        setNameValidation({ isValid: false, message: 'El nombre debe tener al menos 2 caracteres', isChecking: false })
        return
      }

      setNameValidation({ isValid: true, message: '', isChecking: true })

      try {
        const response = await checkRoleName(debouncedName)
        
        if (response.exists) {
          setNameValidation({ isValid: false, message: 'Este nombre de rol ya existe', isChecking: false })
        } else {
          setNameValidation({ isValid: true, message: '', isChecking: false })
        }
      } catch (error) {
        console.error('Error checking role name:', error)
        // No mostramos error al usuario si falla la verificación de unicidad
        setNameValidation({ isValid: true, message: '', isChecking: false })
      }
    }

    validateName()
  }, [debouncedName, role?.name])

  // Validación de keyName único
  useEffect(() => {
    const validateKeyName = async () => {
      if (!debouncedKeyName || debouncedKeyName === role?.keyName) {
        setKeyNameValidation({ isValid: true, message: '', isChecking: false })
        return
      }

      if (!/^[A-Z_]+$/.test(debouncedKeyName)) {
        setKeyNameValidation({ isValid: false, message: 'El keyName debe contener solo letras mayúsculas y guiones bajos', isChecking: false })
        return
      }

      setKeyNameValidation({ isValid: true, message: '', isChecking: true })

      try {
        // Aquí deberíamos llamar a una API para verificar keyName único
        // Por ahora simulamos con el mismo endpoint de nombre
        const response = await checkRoleName(debouncedKeyName)
        
        if (response.exists) {
          setKeyNameValidation({ isValid: false, message: 'Este keyName ya existe', isChecking: false })
        } else {
          setKeyNameValidation({ isValid: true, message: '', isChecking: false })
        }
      } catch (error) {
        console.error('Error checking keyName:', error)
        setKeyNameValidation({ isValid: true, message: '', isChecking: false })
      }
    }

    validateKeyName()
  }, [debouncedKeyName, role?.keyName])

  const onSubmit = async (data: RoleFormValues) => {
    // Validar nombre y keyName únicos
    if (!nameValidation.isValid) {
      notify.error(nameValidation.message)
      return
    }
    
    if (!keyNameValidation.isValid) {
      notify.error(keyNameValidation.message)
      return
    }

    setLoading(true)
    try {
      // Convert null description to undefined
      const payload = {
        ...data,
        description: data.description || undefined
      }
      
      if (mode === 'create') {
        await createRole(payload)
        notify.success('Rol creado correctamente')
        router.push('/roles')
        router.refresh()
      } else if (mode === 'edit' && role) {
        await updateRole(role.id, payload)
        notify.success('Rol actualizado correctamente')
        router.push('/roles')
        router.refresh()
      }
    } catch (error: any) {
      console.error('Error saving role:', error)
      const errorMessage = error.message || 'Error al guardar el rol. Por favor, intente nuevamente.'
      notify.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Transform raw permissions into groups for PermissionTree
  const permissionGroups = useMemo(() => {
    if (!permissions || permissions.length === 0) return []

    const groupsMap = new Map<string, any[]>()
    
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

    return Array.from(groupsMap.entries()).map(([name, perms]) => ({
      name,
      permissions: perms
    }))
  }, [permissions])

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
                  <div className="relative">
                    <Input 
                      placeholder="Ej: Administrador" 
                      {...field}
                      className={nameValidation.isValid ? '' : 'border-destructive'}
                    />
                    {nameValidation.isChecking && (
                      <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                    )}
                    {!nameValidation.isValid && !nameValidation.isChecking && (
                      <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Nombre descriptivo del rol
                </FormDescription>
                <div className="min-h-[20px]">
                  {nameValidation.message && (
                    <p className="text-sm text-destructive">{nameValidation.message}</p>
                  )}
                  <FormMessage />
                </div>
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
                  <div className="relative">
                    <Input 
                      placeholder="Ej: ADMIN" 
                      {...field}
                      className={keyNameValidation.isValid ? '' : 'border-destructive'}
                    />
                    {keyNameValidation.isChecking && (
                      <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                    )}
                    {!keyNameValidation.isValid && !keyNameValidation.isChecking && (
                      <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Identificador único en mayúsculas
                </FormDescription>
                <div className="min-h-[20px]">
                  {keyNameValidation.message && (
                    <p className="text-sm text-destructive">{keyNameValidation.message}</p>
                  )}
                  <FormMessage />
                </div>
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
                  <PermissionTreeWithSearch
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
                  <FormLabel>Páginas de reporte</FormLabel>
                  <div className="space-y-2">
                    {reportPages.map((page) => (
                      <div key={page.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`report-page-${page.id}`}
                          checked={field.value.includes(page.id)}
                          onChange={(e) => {
                            const newValue = e.target.checked
                              ? [...field.value, page.id]
                              : field.value.filter((id) => id !== page.id)
                            field.onChange(newValue)
                          }}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label
                          htmlFor={`report-page-${page.id}`}
                          className="text-sm font-medium leading-none"
                        >
                          {page.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormDescription>
                    Páginas de reporte a las que tendrá acceso este rol
                  </FormDescription>
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
          <Button 
            type="submit" 
            disabled={loading || !nameValidation.isValid || !keyNameValidation.isValid || nameValidation.isChecking || keyNameValidation.isChecking}
          >
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