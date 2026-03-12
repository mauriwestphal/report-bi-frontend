import { getToken, getAuthHeader } from '@/lib/auth'

export async function apiFetch<T>(path: string): Promise<T> {
  const token = getToken()
  if (!token) throw new Error('No token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}${path}`,
    { headers: getAuthHeader(token) }
  )

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
