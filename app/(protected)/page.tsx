'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getMonitors } from '@/lib/api/monitors'
import { getUsers } from '@/lib/api/users'
import { getUserReports } from '@/lib/api/reports'
import { MonitorList } from '@/lib/types/monitors'
import { User } from '@/lib/types/users'
import { ReportSummary } from '@/lib/types/reports'
import { 
  BarChart3, 
  Users, 
  Eye, 
  Activity,
  Monitor,
  FileText,
  UserPlus,
  PlusCircle,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface DashboardMetrics {
  activeMonitors: number
  totalReports: number
  activeUsers: number
  lastActivity: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeMonitors: 0,
    totalReports: 0,
    activeUsers: 0,
    lastActivity: 'N/A'
  })
  const [monitors, setMonitors] = useState<MonitorList[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [reports, setReports] = useState<ReportSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch data in parallel
      const [monitorsData, usersData, reportsData] = await Promise.allSettled([
        getMonitors(),
        getUsers({ take: 100, skip: 0 }),
        getUserReports()
      ])

      // Process monitors
      if (monitorsData.status === 'fulfilled') {
        const monitorsList = monitorsData.value
        setMonitors(monitorsList.slice(0, 5)) // Last 5 monitors
        const activeMonitors = monitorsList.filter(m => m.isActive).length
        setMetrics(prev => ({ ...prev, activeMonitors }))
      }

      // Process users
      if (usersData.status === 'fulfilled') {
        const usersList = usersData.value.users
        setUsers(usersList.slice(0, 5)) // Last 5 users
        const activeUsers = usersList.filter(u => u.isActive).length
        setMetrics(prev => ({ ...prev, activeUsers }))
      }

      // Process reports
      if (reportsData.status === 'fulfilled') {
        const reportsList = reportsData.value
        setReports(reportsList.slice(0, 5)) // Last 5 reports
        setMetrics(prev => ({ ...prev, totalReports: reportsList.length }))
      }

      // Set last activity (simplified - would come from API)
      const now = new Date()
      setMetrics(prev => ({ 
        ...prev, 
        lastActivity: now.toLocaleDateString('es-CL', { 
          day: '2-digit', 
          month: 'short', 
          hour: '2-digit', 
          minute: '2-digit' 
        }) 
      }))

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Prepare chart data
  const monitorStatusData = [
    { name: 'Activos', value: metrics.activeMonitors, color: '#10b981' },
    { name: 'Inactivos', value: monitors.length - metrics.activeMonitors, color: '#6b7280' },
  ]

  const userActivityData = [
    { name: 'Lun', activos: 4, total: 10 },
    { name: 'Mar', activos: 3, total: 8 },
    { name: 'Mié', activos: 5, total: 12 },
    { name: 'Jue', activos: 7, total: 15 },
    { name: 'Vie', activos: 6, total: 14 },
    { name: 'Sáb', activos: 2, total: 6 },
    { name: 'Dom', activos: 1, total: 4 },
  ]

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon,
    description,
    color = 'text-primary'
  }: { 
    title: string
    value: string | number
    icon: any
    description?: string
    color?: string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-20" /> : value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )

  const QuickAction = ({ 
    title, 
    description, 
    icon: Icon,
    onClick,
    color = 'blue'
  }: { 
    title: string
    description: string
    icon: any
    onClick: () => void
    color?: string
  }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
    }
    
    return (
      <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={onClick}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de métricas y actividad de la plataforma
        </p>
      </div>

      {/* Main Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Monitores Activos"
          value={metrics.activeMonitors}
          icon={Monitor}
          description="Total de monitores en ejecución"
          color="text-blue-500"
        />
        <MetricCard
          title="Reportes Disponibles"
          value={metrics.totalReports}
          icon={FileText}
          description="Reportes Power BI accesibles"
          color="text-green-500"
        />
        <MetricCard
          title="Usuarios Activos"
          value={metrics.activeUsers}
          icon={Users}
          description="Usuarios en el cliente actual"
          color="text-purple-500"
        />
        <MetricCard
          title="Última Actividad"
          value={metrics.lastActivity}
          icon={Activity}
          description="Última interacción registrada"
          color="text-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <QuickAction
            title="Crear Monitor"
            description="Configurar nuevo monitor de reporte"
            icon={PlusCircle}
            onClick={() => router.push('/monitors/create')}
            color="blue"
          />
          <QuickAction
            title="Invitar Usuario"
            description="Agregar nuevo usuario al sistema"
            icon={UserPlus}
            onClick={() => router.push('/users/create')}
            color="green"
          />
          <QuickAction
            title="Ver Reportes"
            description="Explorar todos los reportes disponibles"
            icon={Eye}
            onClick={() => router.push('/reports')}
            color="purple"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Monitors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Últimos Monitores
            </CardTitle>
            <CardDescription>Monitores creados recientemente</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : monitors.length > 0 ? (
              <div className="space-y-3">
                {monitors.map(monitor => (
                  <div key={monitor.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{monitor.name}</p>
                      <p className="text-sm text-muted-foreground">{monitor.alias}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${monitor.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {monitor.isActive ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No hay monitores registrados</p>
            )}
            {!loading && monitors.length > 0 && (
              <Button 
                variant="ghost" 
                className="w-full mt-4"
                onClick={() => router.push('/monitors')}
              >
                Ver todos los monitores
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Últimos Usuarios
            </CardTitle>
            <CardDescription>Usuarios agregados recientemente</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-3">
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No hay usuarios registrados</p>
            )}
            {!loading && users.length > 0 && (
              <Button 
                variant="ghost" 
                className="w-full mt-4"
                onClick={() => router.push('/users')}
              >
                Ver todos los usuarios
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monitor Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Estado de Monitores
            </CardTitle>
            <CardDescription>Distribución de monitores activos vs inactivos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Skeleton className="h-48 w-48 rounded-full" />
                </div>
              ) : (
                /* @ts-ignore */
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={monitorStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {monitorStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Activity Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Actividad de Usuarios
            </CardTitle>
            <CardDescription>Usuarios activos por día (ejemplo)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Skeleton className="h-48 w-full" />
                </div>
              ) : (
                /* @ts-ignore */
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="activos" name="Usuarios Activos" fill="#8884d8" />
                    <Bar dataKey="total" name="Total Usuarios" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}