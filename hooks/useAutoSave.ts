import { useEffect, useRef } from 'react'
import { useDebounce } from './useDebounce'

interface UseAutoSaveOptions<T> {
  data: T
  key: string
  delay?: number
  onSave?: (data: T) => void
  enabled?: boolean
}

export function useAutoSave<T>({
  data,
  key,
  delay = 30000, // 30 segundos por defecto
  onSave,
  enabled = true
}: UseAutoSaveOptions<T>) {
  const debouncedData = useDebounce(data, delay)
  const isInitialMount = useRef(true)

  // Cargar datos guardados al montar
  useEffect(() => {
    if (!enabled) return

    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (onSave && Object.keys(parsed).length > 0) {
          onSave(parsed)
        }
      }
    } catch (error) {
      console.error('Error loading auto-save data:', error)
    }
  }, [key, onSave, enabled])

  // Guardar datos cuando cambian
  useEffect(() => {
    if (!enabled || isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    try {
      localStorage.setItem(key, JSON.stringify(debouncedData))
      console.log('Auto-save realizado:', key)
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [debouncedData, key, enabled])

  // Limpiar datos guardados
  const clearSavedData = () => {
    try {
      localStorage.removeItem(key)
      console.log('Auto-save data cleared:', key)
    } catch (error) {
      console.error('Error clearing auto-save data:', error)
    }
  }

  return { clearSavedData }
}