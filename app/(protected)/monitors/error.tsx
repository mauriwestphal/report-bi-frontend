'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function MonitorsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Monitors page error:', error)
  }, [error])

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Error al cargar monitores
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {error.message || 'Ocurrió un error inesperado al cargar la lista de monitores.'}
        </p>
        <div className="space-x-4">
          <Button
            onClick={reset}
            variant="default"
          >
            Reintentar
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  )
}