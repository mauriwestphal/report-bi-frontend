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
    <div className="flex items-center gap-3">
      <div className="text-right leading-tight">
        <div className="text-sm font-semibold text-foreground">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-xs text-muted-foreground">
          {user.email}
        </div>
      </div>
      <button
        className="px-3 py-1.5 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        onClick={handleLogout}
        type="button"
      >
        Cerrar sesión
      </button>
    </div>
  )
}
