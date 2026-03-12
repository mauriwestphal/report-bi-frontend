'use client'

import { useTheme } from '@/hooks/useTheme'
import { useApp } from '@/hooks/useApp'
import { Navbar } from './Navbar'
import { Spinner } from '@/components/ui/Spinner'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const { isLoading } = useApp()

  return (
    <div data-theme={theme} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '2rem' }}>
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
            }}
          >
            <Spinner size="lg" label="Cargando..." />
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
