import { saveToken } from '@/lib/auth'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al iniciar sesión')
  }

  const result = await response.json()
  saveToken(result.token)
  return result
}

export async function getCurrentUser() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Error al obtener usuario')
  }

  return response.json()
}