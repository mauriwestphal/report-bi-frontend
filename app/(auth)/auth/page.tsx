'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function LoginContent() {
  const searchParams = useSearchParams()
  const expired = searchParams.get('expired')
  const status = searchParams.get('status')

  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_URL_API}/auth/ms/redir`
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background)',
      }}
    >
      <div
        className="uss-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem',
          borderRadius: 'var(--border-radius)',
          backgroundColor: 'var(--surface-default)',
        }}
      >
        <div className="uss-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 className="uss-h3" style={{ color: 'var(--text-strong)', marginBottom: '0.5rem' }}>
              Plataforma BI USS
            </h1>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem', margin: 0 }}>
              Acceso exclusivo mediante cuenta Microsoft
            </p>
          </div>

          {expired === 'true' && (
            <div className="uss-alert-message uss-alert-message--warning" role="alert">
              <div className="uss-alert-message__content">
                <span className="uss-alert-message--warning__title">
                  Tu sesión expiró. Iniciá sesión nuevamente.
                </span>
              </div>
            </div>
          )}

          {status === '401' && (
            <div className="uss-alert-message uss-alert-message--error" role="alert">
              <div className="uss-alert-message__content">
                <span className="uss-alert-message--error__title">
                  No autorizado para acceder a esta plataforma.
                </span>
              </div>
            </div>
          )}

          {status === '403' && (
            <div className="uss-alert-message uss-alert-message--error" role="alert">
              <div className="uss-alert-message__content">
                <span className="uss-alert-message--error__title">
                  No tenés permisos para acceder.
                </span>
              </div>
            </div>
          )}

          <button
            className="uss-btn uss-btn--primary"
            onClick={handleLogin}
            type="button"
            style={{ width: '100%', justifyContent: 'center' }}
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
