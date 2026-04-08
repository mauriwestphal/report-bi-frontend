'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getUser, createUser, updateUser, getRoles } from '@/lib/api'
import { Role } from '@/lib/types'
import { useEmailValidation } from '@/hooks/useEmailValidation'
import { useAutoSave } from '@/hooks/useAutoSave'
import PasswordStrength from '@/components/shared/PasswordStrength'
import { notify } from '@/utils/toast'
import { userSchema, UserFormData } from '@/lib/validations/user'

interface UserFormProps {
  userId?: number
  onSuccess?: () => void
}

export default function UserForm({ userId, onSuccess }: UserFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      roleId: 0,
      isActive: true,
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  })
  
  const email = watch('email')
  const password = watch('password')
  const roleId = watch('roleId')
  const isActive = watch('isActive')
  
  // Validación de email único
  const emailValidation = useEmailValidation(email, userId ? email : undefined)
  
  // Auto-save
  const formData = watch()
  useAutoSave({
    data: formData,
    key: `user-form-${userId || 'new'}`,
    delay: 30000,
    onSave: (savedData: any) => {
      if (!userId) {
        Object.keys(savedData).forEach((key) => {
          setValue(key as keyof UserFormData, savedData[key])
        })
      }
    },
    enabled: !userId, // Solo auto-save para creación
  })

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles()
        setRoles(rolesData.roles || [])
      } catch (error) {
        console.error('Error fetching roles:', error)
        notify.error('Error al cargar los perfiles')
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
          setValue('firstName', user.firstName)
          setValue('lastName', user.lastName)
          setValue('email', user.email)
          setValue('roleId', user.role.id)
          setValue('isActive', user.isActive)
        } catch (error) {
          console.error('Error fetching user:', error)
          notify.error('Error al cargar el usuario')
        } finally {
          setLoading(false)
        }
      }
      
      fetchUser()
    }
  }, [userId, setValue])

  const onSubmit = async (data: UserFormData) => {
    // Validar email único
    if (emailValidation.error) {
      notify.error(emailValidation.error)
      return
    }
    
    setSubmitting(true)
    try {
      const userData: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        roleId: data.roleId,
        isActive: data.isActive
      }
      
      // Solo incluir password si se está creando o cambiando
      if (!userId && data.password) {
        userData.password = data.password
      }
      
      if (userId) {
        await updateUser({ id: userId, ...userData })
        notify.success('Usuario actualizado correctamente')
      } else {
        await createUser(userData)
        notify.success('Usuario creado correctamente')
      }
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/users')
      }
    } catch (error: any) {
      console.error('Error saving user:', error)
      const errorMessage = error.message || 'Error al guardar el usuario. Por favor, intente nuevamente.'
      notify.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  // Preview de permisos del rol seleccionado
  const selectedRole = roles.find(r => r.id === roleId)
  
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.firstName ? 'border-destructive' : 'border-border'
              }`}
              disabled={submitting}
              {...register('firstName')}
            />
            <div className="min-h-[20px]">
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <label htmlFor="lastName" className="text-sm font-medium">
              Apellido *
            </label>
            <input
              id="lastName"
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.lastName ? 'border-destructive' : 'border-border'
              }`}
              disabled={submitting}
              {...register('lastName')}
            />
            <div className="min-h-[20px]">
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Correo electrónico *
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.email || emailValidation.error ? 'border-destructive' : 'border-border'
              }`}
              disabled={submitting}
              {...register('email')}
            />
            <div className="min-h-[20px]">
              {emailValidation.isChecking && (
                <p className="text-xs text-muted-foreground flex items-center">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent mr-1"></span>
                  Verificando email...
                </p>
              )}
              {emailValidation.error && (
                <p className="text-xs text-destructive">{emailValidation.error}</p>
              )}
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Password fields for new users */}
          {!userId && (
            <>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña *
                </label>
                <input
                  id="password"
                  type="password"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.password ? 'border-destructive' : 'border-border'
                  }`}
                  disabled={submitting}
                  {...register('password')}
                />
                <div className="min-h-[20px]">
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>
                {password && password.length > 0 && (
                  <div className="mt-2">
                    <PasswordStrength password={password} />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmar contraseña *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.confirmPassword ? 'border-destructive' : 'border-border'
                  }`}
                  disabled={submitting}
                  {...register('confirmPassword')}
                />
                <div className="min-h-[20px]">
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </>
          )}
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.roleId ? 'border-destructive' : 'border-border'
            }`}
            disabled={submitting || roles.length === 0}
            {...register('roleId', { valueAsNumber: true })}
          >
            <option value={0}>Seleccionar perfil</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <div className="min-h-[20px]">
            {errors.roleId && (
              <p className="text-xs text-destructive">{errors.roleId.message}</p>
            )}
          </div>
          {roles.length === 0 && !submitting && (
            <p className="text-xs text-muted-foreground">Cargando perfiles...</p>
          )}
          
          {/* Preview de permisos del rol seleccionado */}
          {selectedRole && (
            <div className="mt-3 p-3 border border-border rounded-md bg-muted/30">
              <p className="text-sm font-medium mb-2">Permisos del perfil "{selectedRole.name}":</p>
              {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
                <div className="space-y-1">
                  {selectedRole.permissions.slice(0, 5).map((perm: any) => (
                    <div key={perm.id} className="text-xs text-muted-foreground flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                      {perm.name}
                    </div>
                  ))}
                  {selectedRole.permissions.length > 5 && (
                    <p className="text-xs text-muted-foreground">
                      +{selectedRole.permissions.length - 5} permisos más
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Este perfil no tiene permisos asignados</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Estado</h3>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setValue('isActive', !isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isActive ? 'bg-primary' : 'bg-muted'
            }`}
            disabled={submitting}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <label className="text-sm font-medium">
            Estado: {isActive ? 'Activo' : 'Inactivo'}
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
          disabled={submitting || !isValid || emailValidation.isChecking || !!emailValidation.error}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
              Guardando...
            </span>
          ) : userId ? 'Actualizar usuario' : 'Crear usuario'}
        </button>
      </div>
    </form>
  )
}