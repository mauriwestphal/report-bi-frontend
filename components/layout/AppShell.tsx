'use client'

import { useApp } from '@/hooks/useApp'
import { Navbar } from './Navbar'
import { Spinner } from '@/components/ui/Spinner'
import { NotificationProvider } from '@/context/NotificationContext'
import { NotificationManager } from '@/components/shared/NotificationManager'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoading } = useApp()

  return (
    <NotificationProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <NotificationManager />
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
    </NotificationProvider>
  )
}
