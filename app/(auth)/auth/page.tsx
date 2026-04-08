'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login } from '@/lib/api'
import { useDebounce } from '@/hooks/useDebounce'
import PasswordStrength from '@/components/shared/PasswordStrength'
import { notify } from '@/utils/toast'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const expired = searchParams?.get('expired')
  const status = searchParams?.get('status')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [emailValidation, setEmailValidation] = useState<{isValid: boolean, message: string}>({isValid: true, message: ''})

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  const email = watch('email')
  const password = watch('password')
  const debouncedEmail = useDebounce(email, 500)

  // Validación de email en tiempo real
  useEffect(() => {
    if (!debouncedEmail) {
      setEmailValidation({isValid: true, message: ''})
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(debouncedEmail)) {
      setEmailValidation({isValid: false, message: 'Email inválido'})
    } else {
      setEmailValidation({isValid: true, message: ''})
    }
  }, [debouncedEmail])

  // Cargar email recordado
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      setRememberMe(true)
      // Podríamos prellenar el email aquí si usáramos setValue
    }
  }, [])

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await login(data)
      
      // Guardar email si recordar usuario está activado
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', data.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }
      
      notify.success('Sesión iniciada correctamente')
      router.push('/')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión'
      setError(errorMessage)
      notify.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground mb-2">
              ReportBI Platform
            </h1>
            <p className="text-sm text-muted-foreground">
              Iniciar sesión con email y contraseña
            </p>
          </div>

          {expired === 'true' && (
            <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200" role="alert">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  Tu sesión expiró. Iniciá sesión nuevamente.
                </span>
              </div>
            </div>
          )}

          {status === '401' && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200" role="alert">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  No autorizado para acceder a esta plataforma.
                </span>
              </div>
            </div>
          )}

          {status === '403' && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200" role="alert">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  No tenés permisos para acceder.
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200" role="alert">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {error}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  emailValidation.isValid ? 'border-input' : 'border-red-500'
                }`}
                placeholder="tu@email.com"
                {...register('email')}
                disabled={isLoading}
              />
              <div className="mt-1 min-h-[20px]">
                {emailValidation.message && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {emailValidation.message}
                  </p>
                )}
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
              />
              <div className="mt-1 min-h-[20px]">
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {password && password.length > 0 && (
                <div className="mt-3">
                  <PasswordStrength password={password} showSuggestions={false} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-foreground">
                  Recordar usuario
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !isValid || !emailValidation.isValid}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <p>Credenciales demo: admin@demo.com / Demo1234!</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
