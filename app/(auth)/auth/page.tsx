'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function LoginContent() {
  const searchParams = useSearchParams()
  const expired = searchParams?.get('expired')
  const status = searchParams?.get('status')

  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_URL_API}/auth/ms/redir`
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground mb-2">
              Plataforma BI USS
            </h1>
            <p className="text-sm text-muted-foreground">
              Acceso exclusivo mediante cuenta Microsoft
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

          <button
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
            onClick={handleLogin}
            type="button"
          >
            Iniciar sesión con Microsoft
          </button>
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
