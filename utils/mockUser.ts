import { PERMISSION_TYPE } from '../shared/enum/permission.enum';

export const MOCK_USER = {
  id: 1,
  firstName: 'Admin',
  lastName: 'Mock',
  email: 'admin@bipro.app',
  isActive: true,
  deletedDate: null,
  role: {
    id: 1,
    name: 'Administrador',
    keyName: 'ADMIN',
    isActive: true,
    permissions: Object.values(PERMISSION_TYPE).map((keyName, id) => ({
      id: id + 1,
      name: keyName,
      keyName,
      groupName: keyName.includes('USER') ? 'USERS'
               : keyName.includes('ROLE') ? 'ROLES'
               : keyName.includes('REPORT') ? 'REPORTS'
               : 'MONITORS',
      description: keyName,
    })),
    reportPages: [],
  },
};
