import type { User } from '@/lib/types'
import type { ReportSummary } from '@/lib/types/reports'
import type { MonitorEmbed } from '@/lib/types/monitors'

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

export const MOCK_MONITOR_EMBED: MonitorEmbed = {
  id: 1,
  identifier: 'abc-123-mock-uuid',
  name: 'Dashboard Académico',
  alias: 'dashboard-academico',
  description: 'Indicadores académicos por facultad',
  isActive: true,
  report: {
    accessToken: 'mock-token-no-funciona-en-browser',
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=mock',
    pageName: 'mock-page',
  },
}

export const MOCK_REPORTS: ReportSummary[] = [
  {
    id: 1,
    name: 'Dashboard Académico',
    description: 'Indicadores académicos por facultad y carrera',
    isActive: true,
    identifier: 'abc-123',
    alias: 'dashboard-academico',
  },
  {
    id: 2,
    name: 'Reporte Financiero',
    description: 'Estado financiero consolidado del período',
    isActive: true,
    identifier: 'def-456',
    alias: 'reporte-financiero',
  },
  {
    id: 3,
    name: 'Seguimiento Matrícula',
    description: 'Evolución de matrícula por sede y período',
    isActive: false,
    identifier: 'ghi-789',
    alias: 'seguimiento-matricula',
  },
  {
    id: 4,
    name: 'Indicadores RRHH',
    description: 'Dotación, ausentismo y rotación de personal',
    isActive: true,
    identifier: 'jkl-012',
    alias: 'indicadores-rrhh',
  },
  {
    id: 5,
    name: 'Gestión Investigación',
    description: 'Proyectos activos, publicaciones y fondos',
    isActive: true,
    identifier: 'mno-345',
    alias: 'gestion-investigacion',
  },
  {
    id: 6,
    name: 'Infraestructura',
    description: 'Uso de espacios físicos y salas por sede',
    isActive: true,
    identifier: 'pqr-678',
    alias: 'infraestructura',
  },
]
