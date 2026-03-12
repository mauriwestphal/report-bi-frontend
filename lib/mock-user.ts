import type { User } from '@/lib/types'

export const MOCK_USER: User = {
  id: 1,
  name: 'Dev User',
  email: 'dev@uss.cl',
  role: {
    id: 1,
    name: 'Administrador',
    permissions: [
      { id: 1, keyName: 'CAN_VIEW_REPORTS' },
      { id: 2, keyName: 'CAN_CREATE_MONITOR' },
      { id: 3, keyName: 'CAN_EDIT_MONITOR' },
      { id: 4, keyName: 'CAN_ENABLE_MONITOR' },
      { id: 5, keyName: 'CAN_DELETE_MONITOR' },
      { id: 6, keyName: 'CAN_GENERATE_NEW_URL' },
      { id: 7, keyName: 'CAN_CREATE_USER' },
      { id: 8, keyName: 'CAN_EDIT_USER' },
      { id: 9, keyName: 'CAN_ENABLE_USER' },
      { id: 10, keyName: 'CAN_DELETE_USER' },
      { id: 11, keyName: 'CAN_CREATE_ROLE' },
      { id: 12, keyName: 'CAN_EDIT_ROLE' },
      { id: 13, keyName: 'CAN_DELETE_ROLE' },
    ],
  },
}

export const IS_DEV_MODE =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_MOCK_AUTH === 'true'
