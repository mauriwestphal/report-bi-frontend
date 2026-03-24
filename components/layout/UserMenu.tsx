'use client'

import { useRouter } from 'next/navigation'
import { useApp } from '@/hooks/useApp'
import { removeToken } from '@/lib/auth'

export function UserMenu() {
  const { user, clearUser } = useApp()
  const router = useRouter()

  if (!user) return null

  const handleLogout = () => {
    removeToken()
    clearUser()
    router.push('/auth')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ textAlign: 'right', lineHeight: 1.3 }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-strong)' }}>
          {user.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
          {user.email}
        </div>
      </div>
      <button
        className="uss-btn uss-btn--secondary uss-btn--small"
        onClick={handleLogout}
        type="button"
      >
        Cerrar sesión
      </button>
    </div>
  )
}
