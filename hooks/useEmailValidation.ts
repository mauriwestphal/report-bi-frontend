import { useState, useEffect } from 'react'
import { useDebounce } from './useDebounce'

interface EmailValidationResult {
  isValid: boolean
  isChecking: boolean
  error: string | null
}

export function useEmailValidation(email: string, initialEmail?: string): EmailValidationResult {
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debouncedEmail = useDebounce(email, 500)

  useEffect(() => {
    const validateEmail = async () => {
      if (!debouncedEmail || debouncedEmail === initialEmail) {
        setError(null)
        return
      }

      // Validación básica de formato
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(debouncedEmail)) {
        setError('Email inválido')
        return
      }

      setIsChecking(true)
      setError(null)

      try {
        // Aquí deberíamos llamar a la API para verificar si el email ya existe
        // Por ahora simulamos una validación
        const response = await fetch(`/api/user/check-email?email=${encodeURIComponent(debouncedEmail)}`)
        
        if (!response.ok) {
          throw new Error('Error al verificar el email')
        }

        const data = await response.json()
        
        if (data.exists) {
          setError('Este email ya está registrado')
        } else {
          setError(null)
        }
      } catch (err) {
        console.error('Error checking email:', err)
        // No mostramos error al usuario si falla la verificación de unicidad
        // Solo mostramos errores de formato
      } finally {
        setIsChecking(false)
      }
    }

    validateEmail()
  }, [debouncedEmail, initialEmail])

  return {
    isValid: !error && !isChecking,
    isChecking,
    error
  }
}