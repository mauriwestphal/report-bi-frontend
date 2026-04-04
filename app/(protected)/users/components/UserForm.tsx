'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUser, createUser, updateUser, getRoles } from '@/lib/api'
import { Role } from '@/lib/types'

interface UserFormProps {
  userId?: number
  onSuccess?: () => void
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  roleId: number | ''
  isActive: boolean
}

export default function UserForm({ userId, onSuccess }: UserFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    roleId: '',
    isActive: true
  })

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles()
        setRoles(rolesData.roles || [])
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }
    
    fetchRoles()
  }, [])

  // Fetch user data if editing
  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        setLoading(true)
        try {
          const user = await getUser(userId)
          setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roleId: user.role.id,
            isActive: user.isActive
          })
        } catch (error) {
          console.error('Error fetching user:', error)
        } finally {
          setLoading(false)
        }
      }
      
      fetchUser()
    }
  }, [userId])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    

    
    if (!formData.roleId) {
      newErrors.roleId = 'El perfil es requerido'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSubmitting(true)
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        roleId: Number(formData.roleId),
        isActive: formData.isActive
      }
      
      if (userId) {
        await updateUser({ id: userId, ...userData })
      } else {
        await createUser(userData)
      }
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/users')
      }
    } catch (error) {
      console.error('Error saving user:', error)
      setErrors({ submit: 'Error al guardar el usuario. Por favor, intente nuevamente.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string | boolean | number) => {
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
        <h3 className="font-semibold text-sm">Información del usuario</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-1.5">
            <label htmlFor="firstName" className="text-sm font-medium">
              Nombre *
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.firstName ? 'border-destructive' : 'border-border'
              }`}
              disabled={submitting}
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <label htmlFor="lastName" className="text-sm font-medium">
              Apellido *
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.lastName ? 'border-destructive' : 'border-border'
              }`}
              disabled={submitting}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Correo electrónico *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.email ? 'border-destructive' : 'border-border'
              }`}
              disabled={submitting}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>


        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Asignación de perfil</h3>
        
        <div className="space-y-1.5">
          <label htmlFor="roleId" className="text-sm font-medium">
            Perfil *
          </label>
          <select
            id="roleId"
            value={formData.roleId}
            onChange={(e) => handleChange('roleId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.roleId ? 'border-destructive' : 'border-border'
            }`}
            disabled={submitting || roles.length === 0}
          >
            <option value="">Seleccionar perfil</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.roleId && (
            <p className="text-xs text-destructive">{errors.roleId}</p>
          )}
          {roles.length === 0 && !submitting && (
            <p className="text-xs text-muted-foreground">Cargando perfiles...</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Estado</h3>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleChange('isActive', !formData.isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.isActive ? 'bg-primary' : 'bg-muted'
            }`}
            disabled={submitting}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                formData.isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <label className="text-sm font-medium">
            Estado: {formData.isActive ? 'Activo' : 'Inactivo'}
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => router.push('/users')}
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
          {submitting ? 'Guardando...' : userId ? 'Actualizar usuario' : 'Crear usuario'}
        </button>
      </div>
    </form>
  )
}