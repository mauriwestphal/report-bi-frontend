'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { getMonitor, createMonitor, updateMonitor, getReportPages } from '@/lib/api/monitors'
import { monitorSchema, type MonitorFormValues } from '@/lib/validations/monitor'
import { useApp } from '@/hooks/useApp'
import { hasPermission } from '@/lib/auth/permissions'
import { PERMISSIONS } from '@/lib/auth/constants'

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
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<MonitorFormValues>({
    name: '',
    identifier: uuidv4(), // Generar UUID automáticamente
    reportPageId: 0,
    description: '',
    enabled: true
  })

  // Verificar permisos
  const canCreate = hasPermission(user, PERMISSIONS.CAN_CREATE_MONITOR)
  const canEdit = hasPermission(user, PERMISSIONS.CAN_EDIT_MONITOR)

  // Fetch report pages
  useEffect(() => {
    const fetchReportPages = async () => {
      try {
        const pages = await getReportPages()
        setReportPages(pages || [])
      } catch (error) {
        console.error('Error fetching report pages:', error)
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
          setFormData({
            name: monitor.name,
            identifier: monitor.identifier,
            reportPageId: 0, // TODO: Obtener reportPageId del monitor
            description: monitor.description || '',
            enabled: monitor.isActive
          })
        } catch (error) {
          console.error('Error fetching monitor:', error)
        } finally {
          setLoading(false)
        }
      }
      
      fetchMonitor()
    }
  }, [monitorId])

  const validateForm = (): boolean => {
    try {
      monitorSchema.parse(formData)
      setErrors({})
      return true
    } catch (error: any) {
      const newErrors: Record<string, string> = {}
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message
          }
        })
      }
      setErrors(newErrors)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Verificar permisos
    if ((monitorId && !canEdit) || (!monitorId && !canCreate)) {
      setErrors({ submit: 'No tienes permisos para realizar esta acción' })
      return
    }
    
    setSubmitting(true)
    try {
      if (monitorId) {
        await updateMonitor(monitorId, formData)
      } else {
        await createMonitor(formData)
      }
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/monitors')
      }
    } catch (error: any) {
      console.error('Error saving monitor:', error)
      setErrors({ 
        submit: error.message || 'Error al guardar el monitor. Por favor, intente nuevamente.' 
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof MonitorFormValues, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleGenerateNewUUID = () => {
    handleChange('identifier', uuidv4())
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
          <p className="text-sm text-destructive">{errors.submit}</p>
        </div>
      )}
      
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
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.name ? 'border-destructive' : 'border-border'
              }`}
              disabled={submitting}
              placeholder="Ej: Dashboard de Ventas"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
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
                value={formData.identifier}
                readOnly
                className={`w-full px-3 py-2 border rounded-md bg-muted ${
                  errors.identifier ? 'border-destructive' : 'border-border'
                }`}
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
            {errors.identifier && (
              <p className="text-xs text-destructive">{errors.identifier}</p>
            )}
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
              value={formData.reportPageId}
              onChange={(e) => handleChange('reportPageId', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.reportPageId ? 'border-destructive' : 'border-border'
              }`}
              disabled={submitting || reportPages.length === 0}
            >
              <option value={0}>Seleccionar página de reporte</option>
              {reportPages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.name}
                </option>
              ))}
            </select>
            {errors.reportPageId && (
              <p className="text-xs text-destructive">{errors.reportPageId}</p>
            )}
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
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={submitting}
              rows={3}
              placeholder="Descripción opcional del monitor"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Estado</h3>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleChange('enabled', !formData.enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.enabled ? 'bg-primary' : 'bg-muted'
            }`}
            disabled={submitting}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                formData.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <label className="text-sm font-medium">
            Estado: {formData.enabled ? 'Activo' : 'Inactivo'}
          </label>
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
          disabled={submitting}
        >
          {submitting ? 'Guardando...' : monitorId ? 'Actualizar monitor' : 'Crear monitor'}
        </button>
      </div>
    </form>
  )
}