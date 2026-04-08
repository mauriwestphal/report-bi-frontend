'use client'

import { useEffect, useState } from 'react'

interface PasswordStrengthProps {
  password: string
  showSuggestions?: boolean
}

export default function PasswordStrength({ password, showSuggestions = true }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    calculateStrength(password)
  }, [password])

  const calculateStrength = (pwd: string) => {
    let score = 0
    const newSuggestions: string[] = []

    // Longitud mínima
    if (pwd.length >= 8) score += 1
    else newSuggestions.push('Usa al menos 8 caracteres')

    // Contiene mayúsculas
    if (/[A-Z]/.test(pwd)) score += 1
    else newSuggestions.push('Agrega al menos una letra mayúscula')

    // Contiene minúsculas
    if (/[a-z]/.test(pwd)) score += 1
    else newSuggestions.push('Agrega al menos una letra minúscula')

    // Contiene números
    if (/\d/.test(pwd)) score += 1
    else newSuggestions.push('Agrega al menos un número')

    // Contiene caracteres especiales
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score += 1
    else newSuggestions.push('Agrega al menos un carácter especial (!@#$%^&*)')

    setStrength(score)
    setSuggestions(newSuggestions)
  }

  const getStrengthLabel = () => {
    if (password.length === 0) return 'Sin contraseña'
    if (strength <= 1) return 'Muy débil'
    if (strength === 2) return 'Débil'
    if (strength === 3) return 'Regular'
    if (strength === 4) return 'Fuerte'
    return 'Muy fuerte'
  }

  const getStrengthColor = () => {
    if (password.length === 0) return 'bg-gray-200'
    if (strength <= 1) return 'bg-red-500'
    if (strength === 2) return 'bg-orange-500'
    if (strength === 3) return 'bg-yellow-500'
    if (strength === 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthWidth = () => {
    if (password.length === 0) return '0%'
    return `${(strength / 5) * 100}%`
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Fortaleza de la contraseña:</span>
        <span className={`text-sm font-medium ${
          password.length === 0 ? 'text-gray-500' :
          strength <= 1 ? 'text-red-600' :
          strength === 2 ? 'text-orange-600' :
          strength === 3 ? 'text-yellow-600' :
          strength === 4 ? 'text-blue-600' :
          'text-green-600'
        }`}>
          {getStrengthLabel()}
        </span>
      </div>
      
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: getStrengthWidth() }}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && password.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sugerencias para mejorar:
          </p>
          <ul className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                <span className="mr-1">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}