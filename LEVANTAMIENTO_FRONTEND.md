# Levantamiento Técnico — Frontend BI Platform (GAMA)

> Este documento es el contexto inicial para un nuevo proyecto frontend que reemplaza y moderniza `report-bi-frontend`.
> Leerlo completo antes de proponer cualquier arquitectura o empezar a codear.

---

## 1. ¿Qué es este sistema?

Plataforma web para **GAMA Seguimiento de Vehículos** que permite:
- Ver reportes **Power BI embebidos** según el perfil del usuario
- Gestionar **monitores** (configuraciones de dashboards Power BI)
- Administrar **usuarios y roles** con permisos granulares
- (Secundario) Dashboard operativo de órdenes de servicio / seguimiento de flotas

El acceso es por **Microsoft Azure AD (OAuth)**. El sistema de permisos es RBAC: cada usuario tiene un rol, cada rol tiene permisos específicos y páginas de Power BI asignadas.

---

## 2. Backend — Contrato de API

**Stack:** NestJS 9 + TypeORM + PostgreSQL
**Deploy:** AWS Lambda + API Gateway (Serverless Framework)
**Base URL prod:** `https://w0tkfslmh5.execute-api.us-east-1.amazonaws.com/dev`
**Swagger:** `{BASE_URL}/api`
**WebSocket URL:** `wss://y3txdj6egh.execute-api.us-east-1.amazonaws.com/Prod` ← no funcional aún

### 2.1 Autenticación Microsoft OAuth

```
Frontend → GET {API}/auth/ms/redir
  └→ 302 → login.microsoftonline.com/{TENANT}/oauth2/v2.0/authorize
       └→ Microsoft → GET {API}/auth/ms/callback?code=...
            └→ Backend genera JWT → 302 → {FRONT_URL}/auth/ms/complete?token={JWT}
                                       └→ (error) → {FRONT_URL}/auth/ms/complete?status=401|403
```

- **JWT payload:** `{ user: { id, email, role, workshop_id?, service_id?, contract_supervisor_id?, zone_id? } }`
- **JWT options:** `{ expiresIn: "12h", issuer: "Gama Leasing", audience: "https://gamaleasing.cl/" }`
- **Header en requests:** `Authorization: Bearer {token}`
- **Cookie frontend:** `gama-seguimiento-vehiculos.token` (1 día)

### 2.2 GET /auth/me — Objeto usuario completo

```typescript
{
  id: number,
  isActive: boolean,
  firstName: string,
  lastName: string,
  rut: number,
  dv: number,
  email: string,
  deletedDate: Date | null,
  workshop_id: string | null,
  service_id: string | null,
  contract_supervisor_id: string | null,
  zone_id: number | null,
  role: {
    id: number,
    name: string,
    keyName: string,
    isActive: boolean,
    permissions: [{
      id: number,
      name: string,
      keyName: PERMISSION_TYPE,  // ver enum abajo
      groupName: "USERS" | "ROLES" | "REPORTS" | "MONITORS",
      description: string
    }],
    reportPages: ReportPageEntity[]
  }
}
```

### 2.3 Endpoints principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /auth/ms/redir | No | Inicia OAuth |
| GET | /auth/me | SessionGuard | Perfil completo del usuario |
| GET | /api/user | SessionGuard + permisos | Lista usuarios (paginada) |
| GET | /api/user/:id | SessionGuard + CAN_EDIT_USER | Un usuario |
| POST | /api/user | SessionGuard + CAN_CREATE_USER | Crear usuario |
| PATCH | /api/user/:id | SessionGuard + CAN_EDIT_USER | Actualizar usuario |
| DELETE | /api/user/:id | SessionGuard + CAN_DELETE_USER | Eliminar usuario (soft) |
| GET | /api/role | SessionGuard | Lista roles |
| GET | /api/role/:id | SessionGuard + CAN_EDIT_ROLE | Rol con permisos |
| POST | /api/role | SessionGuard + CAN_CREATE_ROLE | Crear rol |
| PATCH | /api/role/:id | SessionGuard + CAN_EDIT_ROLE | Actualizar rol |
| DELETE | /api/role/:id | SessionGuard + CAN_DELETE_ROLE | Eliminar rol |
| GET | /api/permission | SessionGuard | Lista permisos agrupados |
| GET | /api/monitor | Sin guard ⚠️ | Lista monitores |
| POST | /api/monitor | Sin guard ⚠️ | Crear monitor |
| GET | /api/monitor/report/list | Sin guard ⚠️ | Páginas Power BI disponibles |
| GET | /api/monitor/report/user | Sin guard ⚠️ | Reportes del usuario |
| GET | /api/monitor/:id | Sin guard ⚠️ | Monitor + embed token |
| GET | /api/monitor/editar/:id | Sin guard ⚠️ | Monitor para edición |
| GET | /api/monitor/identifier/:id | Sin guard ⚠️ | Monitor por UUID (público) |
| PATCH | /api/monitor/:id | Sin guard ⚠️ | Actualizar monitor |
| PATCH | /api/monitor/updateEnableDesable/:id | Sin guard ⚠️ | Toggle isActive |
| DELETE | /api/monitor/:id | Sin guard ⚠️ | Eliminar monitor |
| GET | /api/report-page | Sin guard ⚠️ | Lista report pages |
| GET | /api/report-page/report | Sin guard ⚠️ | Lista reports |
| POST | /api/screen-dashboard/:id/binnacle | SessionGuard | Crear entrada de bitácora |
| GET | /api/screen-dashboard/metricas/slas | Sin guard | SLAs |
| GET | /api/screen-dashboard/metricas/colour | Sin guard | Colores/métricas |
| GET | /api/screen-dashboard/metricas/statusSla | Sin guard | Estados de SLA |

### 2.4 GET /api/monitor/:id — Respuesta con embed token

```typescript
{
  id: number,
  identifier: string,       // UUID — usado para links públicos
  name: string,
  alias: string,
  zones: number,
  description: string,
  url: string | null,
  isActive: boolean,
  dashboard: ScreenDashboardEntity | null,
  report: {
    accessToken: string,    // Azure access token para Power BI embed
    embedUrl: string,       // https://app.powerbi.com/reportEmbed?reportId=...
    pageName: string        // Power BI page identifier
  }
}
```

> ⚠️ **El token de Power BI se genera en cada request** (sin caché). Hay que mostrar
> un skeleton/loader prominente durante la carga del reporte.

### 2.5 Parámetros de paginación

```typescript
// Para listas de usuarios/roles:
{ skip?: number, take?: number, sortField?: string, sortOrder?: "ASC"|"DESC", search?: string }

// Para lista de monitores:
{ search?: string, limit?: number, offset?: number }
```

---

## 3. Modelo de datos (entidades del backend)

### Permisos disponibles (enum PERMISSION_TYPE)

```typescript
enum PERMISSION_TYPE {
  CAN_CREATE_USER = "CAN_CREATE_USER",
  CAN_EDIT_USER = "CAN_EDIT_USER",
  CAN_ENABLE_USER = "CAN_ENABLE_USER",
  CAN_DELETE_USER = "CAN_DELETE_USER",
  CAN_CREATE_ROLE = "CAN_CREATE_ROLE",
  CAN_EDIT_ROLE = "CAN_EDIT_ROLE",
  CAN_DELETE_ROLE = "CAN_DELETE_ROLE",
  CAN_VIEW_REPORTS = "CAN_VIEW_REPORTS",
  CAN_CREATE_MONITOR = "CAN_CREATE_MONITOR",
  CAN_EDIT_MONITOR = "CAN_EDIT_MONITOR",
  CAN_ENABLE_MONITOR = "CAN_ENABLE_MONITOR",
  CAN_DELETE_MONITOR = "CAN_DELETE_MONITOR",
  CAN_GENERATE_NEW_URL = "CAN_GENERATE_NEW_URL"
}
```

### Monitor (tabla: monitors)
```
id, identifier (UUID único), name (único), alias (único), zones, description (max 550),
url (único), createDateUrl, updateDateUrl, deleteDate (soft-delete), isActive,
dashboard → FK ScreenDashboard (nullable), report → FK ReportPage (nullable)
```

### Report / ReportPage
```
Report:     id, name, description, reportId (Power BI GUID), groupId (workspace GUID)
ReportPage: id, name, description, pageId, reportId, report→Report, roles→Role[]
```

### User / Role / Permission
```
User:       id, firstName, lastName, rut, dv, email (único), isActive, role→Role,
            workshop_id?, service_id?, contract_supervisor_id?, zone_id?
Role:       id, name, keyName, isActive, permissions→Permission[], reportPages→ReportPage[]
Permission: id, name, keyName (PERMISSION_TYPE), groupName, description
```

---

## 4. Sistema existente — qué hay implementado

### Rutas actuales
```
/                           → redirect a /auth
/auth                       → Login Microsoft (muestra error si ?status=401|403)
/auth/ms/complete           → Callback OAuth (guarda token, redirect a /report)
/report                     → Grilla de reportes Power BI del usuario
/monitor                    → Lista y gestión de monitores
/monitor/crear              → Crear monitor
/monitor/editar/[id]        → Editar monitor
/monitor/report/[id]        → Viewer Power BI embebido (también accesible por UUID público)
/user-role                  → ABM usuarios y roles (tabbed, permission-gated)
/user-role/usuario/crear    → Crear usuario
/user-role/usuario/editar/[id] → Editar usuario
/user-role/rol/crear        → Crear rol
/user-role/rol/editar/[id]  → Editar rol
```

### Componentes clave existentes
- **EmbedBi** — wrapper de powerbi-client-react, auto-refresh a 30min, SSR disabled
- **TreeForm** — tree checkbox para selección de permisos (Ant Design Tree)
- **AppContext** — estado global del usuario con `activePermissions[]` y `activeReports[]`
- **useNotification** — hook para toasts (wrappea Ant Design notification)
- **request.ts** — axios con interceptor: 401 → logout+redirect, 403 → toast, private flag → agrega Bearer token
- **getValidatedItems()** — filtra items de UI según permisos del usuario

### Funcionalidades a preservar
1. Flujo completo de Microsoft OAuth
2. Embed de Power BI con auto-refresh (30min) y skeleton durante carga
3. RBAC: menú, tabs, botones y rutas condicionales por permiso
4. CRUD completo de usuarios, roles y monitores
5. Links públicos de monitores por UUID (sin auth)
6. Árbol de permisos en el formulario de roles
7. Validación de RUT chileno

### Funcionalidades deshabilitadas / incompletas
- WebSocket / tiempo real (handlers comentados en backend, no implementar por ahora)
- Campos de usuario: zona, taller, servicio, supervisor (comentados, no implementar por ahora)
- Dashboard operativo de órdenes de servicio (módulo de vehículos — definir si sigue en scope)

---

## 5. Deuda técnica del sistema actual

| Issue | Impacto |
|-------|---------|
| Next.js 12 (desactualizado) | Sin App Router, sin Server Components, sin server actions |
| Tokens Power BI sin caché | Latencia alta en cada carga — MOSTRAR LOADER SIEMPRE |
| ZoneService.createZone() crea monitores | Naming confuso, corregir en reescritura |
| console.log() en MonitorForm, RoleForm, UserForm | Limpiar |
| URL hardcodeada: `https://reporteria-bi.onrender.com` | Mover a env var |
| Cookie name hardcodeada en auth.ts | Mover a constante centralizada |
| Campos comentados en UserForm | Decidir si se implementan o se eliminan |
| `synchronize: true` en backend (TypeORM) | Riesgo DB — NO es problema del frontend |
| Endpoints monitor sin guard | Riesgo seguridad — NO es problema del frontend |

---

## 6. Decisiones de arquitectura pendientes (a definir con el usuario)

Estas decisiones NO están tomadas aún. El nuevo proyecto NO debe asumir ninguna sin confirmación:

1. **Next.js version** — ¿14/15 con App Router o seguir en Pages Router?
2. **UI Library** — ¿Ant Design 5, shadcn/ui + Tailwind, MUI v5?
3. **Tema** — ¿Mantener oscuro (#1C1C1C + #ff6600), nuevo sistema, soporte light/dark?
4. **Diseño** — ¿Hay Figma? ¿O se rediseña desde lo existente?
5. **Scope** — ¿El módulo de vehículos/órdenes sigue siendo parte del proyecto?
6. **Estado prod** — ¿Hay usuarios reales usando esto hoy?

---

## 7. Variables de entorno requeridas

```env
NEXT_PUBLIC_URL_API=https://w0tkfslmh5.execute-api.us-east-1.amazonaws.com/dev
NEXT_PUBLIC_URL_WEBSOCKET=wss://y3txdj6egh.execute-api.us-east-1.amazonaws.com/Prod

# Local dev:
# NEXT_PUBLIC_URL_API=http://localhost:3000
# NEXT_PUBLIC_URL_WEBSOCKET=http://localhost:3001
```

---

## 8. Lógica de negocio crítica a no perder

### Embed de Power BI
```typescript
// El token viene de GET /api/monitor/:id (se genera en cada request)
// Configuración de embed:
{
  type: "report",
  id: reportId,
  embedUrl: embedUrl,
  accessToken: accessToken,
  tokenType: models.TokenType.Aad,
  settings: {
    panes: { filters: { visible: false }, pageNavigation: { visible: false } },
    layoutType: models.LayoutType.Custom,
    customLayout: { displayOption: models.DisplayOption.FitToWidth }
  }
}
// Auto-refresh: cada 30 minutos re-montar el componente con nueva key
```

### Validación de token en layout
```typescript
// En cada carga de página protegida:
// 1. getToken() → cookie "gama-seguimiento-vehiculos.token"
// 2. isTokenValid(token) → decodifica JWT, compara exp con Date.now()
// 3. Si inválido → router.push("/auth?expired=true")
```

### Árbol de permisos
```typescript
// PermissionService.list() devuelve grupos:
// [{ description: "USERS", permissions: [{ id, name, keyName, groupName }] }]
// formatToDataNode() convierte a DataNode[] para Ant Design Tree
// El formulario de rol guarda solo los IDs de los permisos hijos (sin los grupos)
// CAN_VIEW_REPORTS activa campos adicionales: reportPages y report
```

### Links públicos de monitor
```typescript
// Cada monitor tiene un `identifier` (UUID v4) además del `id` numérico
// La ruta /monitor/report/[id] acepta tanto id numérico como UUID
// Si es UUID → no muestra título, acceso sin auth
// URL pública: https://reporteria-bi.onrender.com/monitor/report/{identifier}
// ← esta URL debe moverse a variable de entorno
```

---

## 9. Notas de UX existente

- Menú de navegación horizontal con 3 ítems (Reportes, Gestión Monitores, Usuarios y Roles)
- Los ítems del menú se filtran según permisos del usuario logueado
- Tema oscuro: fondo `#1C1C1C`, primario `#ff6600`, textos blancos
- Badges de estado: verde `#79BB61` (activo), rojo `#DF545C` (inactivo)
- Tablas con paginación centrada al fondo
- Modales de confirmación para acciones destructivas
- Skeleton/spinner durante carga de datos (Ant Design Spin)
- Formato de fecha en español usando moment.js

---

## 10. Repositorios

- **Frontend (este proyecto):** `report-bi-frontend`
- **Backend:** Repo separado (NestJS), analizar independientemente
- Los dos proyectos tienen ciclos de deploy independientes
- El gestor de proyecto asignará tareas coordinadas entre ambos repos
