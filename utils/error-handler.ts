/**
 * Traduce errores de API a mensajes amigables para el usuario
 */

interface ApiError {
  message?: string
  status?: number
  code?: string
}

export function getFriendlyErrorMessage(error: any): string {
  // Si ya es un string, devolverlo
  if (typeof error === 'string') {
    return translateErrorMessage(error)
  }

  // Si es un objeto Error
  if (error instanceof Error) {
    return translateErrorMessage(error.message)
  }

  // Si es un objeto con propiedad message
  if (error && typeof error === 'object' && error.message) {
    return translateErrorMessage(error.message)
  }

  // Si es un objeto de respuesta de API
  if (error && typeof error === 'object') {
    // Intentar extraer mensaje de diferentes formatos comunes
    const possibleMessages = [
      error.message,
      error.error,
      error.detail,
      error.description,
      error.reason,
    ].filter(Boolean)

    if (possibleMessages.length > 0) {
      return translateErrorMessage(possibleMessages[0])
    }
  }

  // Error desconocido
  return 'Ocurrió un error inesperado. Por favor, intente nuevamente.'
}

function translateErrorMessage(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Errores de autenticación
  if (lowerMessage.includes('invalid credentials') || 
      lowerMessage.includes('invalid email or password') ||
      lowerMessage.includes('incorrect password')) {
    return 'Email o contraseña incorrectos'
  }

  if (lowerMessage.includes('user not found') || 
      lowerMessage.includes('user does not exist')) {
    return 'Usuario no encontrado'
  }

  if (lowerMessage.includes('email already exists') || 
      lowerMessage.includes('email is already registered')) {
    return 'Este email ya está registrado'
  }

  if (lowerMessage.includes('invalid email')) {
    return 'Email inválido'
  }

  if (lowerMessage.includes('password too weak') || 
      lowerMessage.includes('password does not meet requirements')) {
    return 'La contraseña no cumple con los requisitos de seguridad'
  }

  if (lowerMessage.includes('token expired') || 
      lowerMessage.includes('jwt expired')) {
    return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente'
  }

  if (lowerMessage.includes('unauthorized') || 
      lowerMessage.includes('not authorized')) {
    return 'No tienes permisos para realizar esta acción'
  }

  if (lowerMessage.includes('forbidden')) {
    return 'Acceso denegado'
  }

  // Errores de validación
  if (lowerMessage.includes('validation failed') || 
      lowerMessage.includes('invalid input')) {
    return 'Datos inválidos. Por favor, verifica la información ingresada'
  }

  if (lowerMessage.includes('required field') || 
      lowerMessage.includes('is required')) {
    return 'Por favor, completa todos los campos requeridos'
  }

  // Errores de red/API
  if (lowerMessage.includes('network error') || 
      lowerMessage.includes('failed to fetch')) {
    return 'Error de conexión. Verifica tu conexión a internet'
  }

  if (lowerMessage.includes('timeout') || 
      lowerMessage.includes('request timeout')) {
    return 'La solicitud tardó demasiado. Por favor, intente nuevamente'
  }

  if (lowerMessage.includes('server error') || 
      lowerMessage.includes('internal server error')) {
    return 'Error del servidor. Por favor, intente más tarde'
  }

  // Errores específicos del negocio
  if (lowerMessage.includes('role not found')) {
    return 'El perfil seleccionado no existe'
  }

  if (lowerMessage.includes('monitor not found')) {
    return 'El monitor seleccionado no existe'
  }

  if (lowerMessage.includes('report page not found')) {
    return 'La página de reporte seleccionada no existe'
  }

  if (lowerMessage.includes('permission denied')) {
    return 'No tienes permisos para acceder a este recurso'
  }

  // Si no se reconoce el mensaje, devolverlo tal cual (pero capitalizado)
  return message.charAt(0).toUpperCase() + message.slice(1)
}

/**
 * Maneja errores de API y muestra notificaciones
 */
export function handleApiError(error: any, defaultMessage = 'Ocurrió un error'): string {
  const friendlyMessage = getFriendlyErrorMessage(error)
  
  // Log del error para debugging (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error)
    console.error('Friendly message:', friendlyMessage)
  }
  
  return friendlyMessage
}