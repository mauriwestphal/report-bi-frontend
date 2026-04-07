import { getToken, getAuthHeader } from '@/lib/auth'

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  if (!token) throw new Error('No token')

  // Convert headers to Record<string, string>
  const headersObj: Record<string, string> = {};
  
  // Add existing headers
  if (options?.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headersObj[key] = value;
      });
    } else {
      Object.entries(options.headers).forEach(([key, value]) => {
        headersObj[key] = value as string;
      });
    }
  }
  
  // Add auth header
  headersObj['Authorization'] = `Bearer ${token}`;
  
  // Add X-Client-Id header if active client is set
  if (typeof window !== 'undefined') {
    const activeClientId = localStorage.getItem('bipro-active-client-id');
    if (activeClientId && activeClientId !== 'null') {
      headersObj['X-Client-Id'] = activeClientId;
    }
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}${path}`,
    {
      ...options,
      headers: headersObj,
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
