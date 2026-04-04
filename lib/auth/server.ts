import { cookies } from 'next/headers'
import { TOKEN_COOKIE_NAME } from '@/lib/constants'
import type { User } from '@/lib/types'

/**
 * Get server session from cookies
 */
export async function getServerSession(): Promise<{ user: User } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value
  
  if (!token) return null
  
  try {
    // In a real implementation, this would validate the JWT
    // and fetch user data from the API
    // For now, we'll return a mock user
    return {
      user: {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
        activePermissions: [
          'CAN_CREATE_MONITOR',
          'CAN_EDIT_MONITOR',
          'CAN_ENABLE_MONITOR',
          'CAN_DELETE_MONITOR',
          'CAN_GENERATE_NEW_URL',
          'CAN_CREATE_USER',
          'CAN_EDIT_USER',
          'CAN_ENABLE_USER',
          'CAN_DELETE_USER',
          'CAN_CREATE_ROLE',
          'CAN_EDIT_ROLE',
          'CAN_DELETE_ROLE',
          'CAN_VIEW_REPORTS',
        ],
      } as User,
    }
  } catch (error) {
    console.error('Error getting server session:', error)
    return null
  }
}