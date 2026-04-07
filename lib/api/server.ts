import { cookies } from 'next/headers'
import { TOKEN_COOKIE_NAME } from '@/lib/constants'

export async function apiFetchServer<T>(path: string): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value
  if (!token) throw new Error('No token')

  // Get active client ID from cookies for Server Components
  const activeClientId = cookieStore.get('bipro-active-client-id')?.value
  
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  }
  
  if (activeClientId && activeClientId !== 'null') {
    headers['X-Client-Id'] = activeClientId
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}${path}`,
    {
      headers,
      cache: 'no-store',
    }
  )

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
