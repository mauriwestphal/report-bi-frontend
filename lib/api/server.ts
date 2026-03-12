import { cookies } from 'next/headers'
import { TOKEN_COOKIE_NAME } from '@/lib/constants'

export async function apiFetchServer<T>(path: string): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value
  if (!token) throw new Error('No token')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}${path}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    }
  )

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
