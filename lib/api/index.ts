import { getToken, getAuthHeader } from '@/lib/auth'

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  if (!token) throw new Error('No token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}${path}`,
    {
      ...options,
      headers: {
        ...options?.headers,
        ...getAuthHeader(token),
      },
    }
  )

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// Export functions for Client Components
export * from './auth'
export * from './users'
export * from './roles'
export * from './monitors'

// Note: apiFetchServer is only for Server Components and should be imported directly from './server'
