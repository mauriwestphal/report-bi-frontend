'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import type { PermissionKey, User } from '@/lib/types'

interface AppContextValue {
  user: User | null
  isLoading: boolean
  error: string | null
  hasPermission: (key: PermissionKey) => boolean
  refreshUser: () => Promise<void>
  clearUser: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshUser = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiFetch<User>('/auth/me')
      setUser(data)
    } catch (err) {
      setUser(null)
      if (err instanceof Error && !err.message.includes('No token')) {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearUser = () => {
    setUser(null)
    setError(null)
  }

  const hasPermission = (key: PermissionKey): boolean => {
    return user?.role.permissions.some((p) => p.keyName === key) ?? false
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <AppContext.Provider value={{ user, isLoading, error, hasPermission, refreshUser, clearUser }}>
      {children}
    </AppContext.Provider>
  )
}

export { AppContext }
