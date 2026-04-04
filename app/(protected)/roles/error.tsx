'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function RolesError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-destructive">Error al cargar roles</h2>
        <p className="text-muted-foreground mt-2">
          {error.message || 'Ocurrió un error inesperado'}
        </p>
      </div>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  )
}