'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'
import { getMonitor, createMonitor, updateMonitor, getReportPages } from '@/lib/api/monitors'
import { monitorSchema, type MonitorFormValues } from '@/lib/validations/monitor'
import { useApp } from '@/hooks/useApp'
import { hasPermission } from '@/lib/auth/permissions'
import { PERMISSIONS } from '@/lib/auth/constants'
import { useAutoSave } from '@/hooks/useAutoSave'
import { notify } from '@/utils/toast'

interface MonitorFormProps {
  monitorId?: number
  onSuccess?: () => void
}

export default function MonitorForm({ monitorId, onSuccess }: MonitorFormProps) {
  const router = useRouter()
  const { user } = useApp()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [reportPages, setReportPages] = useState<any[]>([])
  const [urlValidation, setUrlValidation] = useState<{isValid: boolean, message: string}>({isValid: true, message: ''})
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<MonitorFormValues>({
    resolver: zodResolver(monitorSchema),
    defaultValues: {
      name: '',
      identifier: uuidv4(),
      reportPageId: 0,
      description: '',
      enabled: true
    },
    mode: 'onChange',
  })

  // Verificar permisos
  const canCreate = hasPermission(user, PERMISSIONS.CAN_CREATE_MONITOR)
  const canEdit = hasPermission(user, PERMISSIONS.CAN_EDIT_MONITOR)

  const name = watch('name')
  const identifier = watch('identifier')
  const reportPageId = watch('reportPageId')
  const description = watch('description')
  const enabled = watch('enabled')

  // Auto-save
  const formData = watch()
  useAutoSave({
    data: formData,
    key: `monitor-form-${monitorId || 'new'}`,
    delay: 30000,
    onSave: (savedData: any) => {
      if (!monitorId) {
        Object.keys(savedData).forEach((key) => {
          setValue(key as keyof MonitorFormValues, savedData[key])
        })
      }
    },
    enabled: !monitorId, // Solo auto-save para creación
  })

  // Fetch report pages
  useEffect(() => {
    const fetchReportPages = async () => {
      try {
        const pages = await getReportPages()
        setReportPages(pages || [])
      } catch (error) {
        console.error('Error fetching report pages:', error)
        notify.error('Error al cargar las páginas de reporte')
      }
    }
    
    fetchReportPages()
  }, [])

  // Fetch monitor data if editing
  useEffect(() => {
    if (monitorId) {
      const fetchMonitor = async () => {
        setLoading(true)
        try {
          const monitor = await getMonitor(monitorId)
          setValue('name', monitor.name)
          setValue('identifier', monitor.identifier)
          setValue('reportPageId', 0) // TODO: Obtener reportPageId del monitor
          setValue('description', monitor.description || '')
          setValue('enabled', monitor.isActive)
        } catch (error) {
          console.error('Error fetching monitor:', error)
          notify.error('Error al cargar el monitor')
        } finally {
          setLoading(false)
        }
      }
      
      fetchMonitor()
    }
  }, [monitorId, setValue])

  // Validación de URL Power BI (si se agrega un campo de URL en el futuro)
  useEffect(() => {
    // Por ahora, esta función está preparada para cuando se agregue un campo de URL
    // Se puede usar para validar URLs de Power BI
  }, [])

  const onSubmit = async (data: MonitorFormValues) => {
    // Verificar permisos
    if ((monitorId && !canEdit) || (!monitorId && !canCreate)) {
      notify.error('No tienes permisos para realizar esta acción')
      return
    }
    
    setSubmitting(true)
    try {
      if (monitorId) {
        await updateMonitor(monitorId, data)
        notify.success('Monitor actualizado correctamente')
      } else {
        await createMonitor(data)
        notify.success('Monitor creado correctamente')
      }
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/monitors')
      }
    } catch (error: any) {
      console.error('Error saving monitor:', error)
      const errorMessage = error.message || 'Error al guardar el monitor. Por favor, intente nuevamente.'
      notify.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleGenerateNewUUID = () => {
    setValue('identifier', uuidv4())
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Información del monitor</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre *
            </label>
            <input
              id="name"
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.name ? 'border-destructive' : 'border-border'
              }`}
              disabled={submitting}
              placeholder="Ej: Dashboard de Ventas"
              {...register('name')}
            />
            <div className="min-h-[20px]">
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
          </div>

          {/* Identifier */}
          <div className="space-y-1.5">
            <label htmlFor="identifier" className="text-sm font-medium">
              Identificador (UUID) *
            </label>
            <div className="flex gap-2">
              <input
                id="identifier"
                type="text"
                readOnly
                className={`w-full px-3 py-2 border rounded-md bg-muted ${
                  errors.identifier ? 'border-destructive' : 'border-border'
                }`}
                {...register('identifier')}
              />
              <button
                type="button"
                onClick={handleGenerateNewUUID}
                className="px-3 py-2 border border-border rounded-md hover:bg-muted text-sm whitespace-nowrap"
                disabled={submitting}
              >
                Generar nuevo
              </button>
            </div>
            <div className="min-h-[20px]">
              {errors.identifier && (
                <p className="text-xs text-destructive">{errors.identifier.message}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              UUID único para identificar este monitor
            </p>
          </div>

          {/* Report Page */}
          <div className="space-y-1.5">
            <label htmlFor="reportPageId" className="text-sm font-medium">
              Página de reporte *
            </label>
            <select
              id="reportPageId"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.reportPageId ? 'border-destructive' : 'border-border'
              }`}
              disabled={submitting || reportPages.length === 0}
              {...register('reportPageId', { valueAsNumber: true })}
            >
              <option value={0}>Seleccionar página de reporte</option>
              {reportPages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>
            <div className="min-h-[20px]">
              {errors.reportPageId && (
                <p className="text-xs text-destructive">{errors.reportPageId.message}</p>
              )}
            </div>
            {reportPages.length === 0 && !submitting && (
              <p className="text-xs text-muted-foreground">Cargando páginas de reporte...</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descripción
            </label>
            <textarea
              id="description"
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={submitting}
              rows={3}
              placeholder="Descripción opcional del monitor"
              {...register('description')}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Estado</h3>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setValue('enabled', !enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              enabled ? 'bg-primary' : 'bg-muted'
            }`}
            disabled={submitting}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <label className="text-sm font-medium">
            Estado: {enabled ? 'Activo' : 'Inactivo'}
          </label>
        </div>
      </div>

      {/* Preview de permisos requeridos */}
      <div className="space-y-4 p-4 border border-border rounded-md bg-muted/30">
        <h3 className="font-semibold text-sm">Permisos requeridos</h3>
        <p className="text-sm text-muted-foreground">
          Para acceder a este monitor, los usuarios necesitarán el permiso: <code className="px-1 py-0.5 bg-muted rounded text-xs">CAN_VIEW_MONITOR</code>
        </p>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
            <span>Permiso básico: Ver monitor</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
            <span>Permiso adicional: Ver reportes Power BI</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => router.push('/monitors')}
          className="px-4 py-2 border border-border rounded-md hover:bg-muted"
          disabled={submitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting || !isValid || (monitorId && !canEdit) || (!monitorId && !canCreate)}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
              Guardando...
            </span>
          ) : monitorId ? 'Actualizar monitor' : 'Crear monitor'}
        </button>
      </div>
    </form>
  )
}