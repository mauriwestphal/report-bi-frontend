# report-bi — Plataforma BI USS

Plataforma de Business Intelligence para USS con Power BI embebido y gestión de monitores.

## 🚀 Stack tecnológico

- **Framework:** Next.js 12.3.4 con App Router (en migración desde Pages Router)
- **UI Components:** Shadcn/ui + KitDigital CSS (migrando desde Ant Design)
- **Lenguaje:** TypeScript
- **State Management:** React Query (TanStack Query)
- **Formularios:** React Hook Form + Zod para validación
- **Power BI:** `powerbi-client-react` con auto-refresh cada 30 minutos
- **Autenticación:** Azure AD OAuth + JWT (cookie `bipro-report.token`)
- **Arquitectura:** Dual — App Router (nuevo) + Pages Router (legacy en producción)

## 📦 Setup local

### Prerrequisitos
- Node.js 18+ y npm
- Variables de entorno (crear `.env.local` basado en `.env.example`)

### Variables de entorno requeridas
```env
NEXT_PUBLIC_URL_API=http://localhost:19097
NEXT_PUBLIC_POWER_BI_CLIENT_ID=your_client_id
NEXT_PUBLIC_POWER_BI_TENANT_ID=your_tenant_id
NEXT_PUBLIC_POWER_BI_USERNAME=your_username
NEXT_PUBLIC_POWER_BI_PASSWORD=your_password
NEXT_PUBLIC_POWER_BI_WORKSPACE_ID=your_workspace_id
```

### Instalación
```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

### Notas importantes
- **Arquitectura dual:** El proyecto usa tanto App Router (`app/`) como Pages Router (`pages/`). La migración está en curso.
- **Power BI:** Los tokens se generan en cada request. Siempre se muestra skeleton/loader durante la carga.
- **Autenticación:** El flujo OAuth termina en `/auth/ms/complete?token={JWT}`.
- **Ruta pública:** `/monitor/report/[id]` con UUID NO requiere autenticación (viewer público).

## 🚢 Deploy

El frontend se despliega en **Vercel** con las siguientes configuraciones:

- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Environment Variables:** Configuradas en el dashboard de Vercel

### URLs
- **Producción:** [https://report-bi-frontend.vercel.app](https://report-bi-frontend.vercel.app)
- **Swagger (Backend):** [http://localhost:19097/api](http://localhost:19097/api)

## 📊 Estado del proyecto

**En desarrollo activo — Sprint 3 en progreso**

### Migraciones en curso
1. **UI Components:** Ant Design → Shadcn/ui + KitDigital CSS
2. **Router:** Pages Router → App Router
3. **Power BI auth:** Password flow → Service principal (pendiente)

### Cambios importantes
- **RUT eliminado:** Ya no se usa RUT chileno para usuarios
- **Soft delete:** Usuarios usan `deletedDate`, roles hard delete
- **RBAC:** Verificación de permisos con `hasPermission()` o `user.activePermissions`

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Ejecutar linting
npm run lint
```

## 📁 Estructura del proyecto

```
report-bi-frontend/
├── app/                    # App Router (nuevo)
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Dashboard principal
│   └── layout.tsx         # Layout raíz
├── pages/                 # Pages Router (legacy)
│   ├── api/               # API routes
│   ├── auth/              # Autenticación legacy
│   └── monitor/           # Monitores legacy
├── components/            # Componentes compartidos
├── lib/                   # Utilidades y configuraciones
├── services/              # Servicios API (Axios)
└── public/                # Assets estáticos
```

## 🔗 Links importantes

- **Backend Repository:** [report-bi-backend](https://github.com/uss-digital/report-bi-backend)
- **Swagger API Docs:** [http://localhost:19097/api](http://localhost:19097/api)
- **Vercel Dashboard:** [https://vercel.com/dashboard](https://vercel.com/dashboard)

## 📝 Notas para desarrolladores

- **TypeScript:** `strict: true` activo — evitar `any`, usar `unknown` con type guards
- **Linting:** `npm run lint` debe pasar sin warnings antes de commit
- **Commits:** Usar formato `tipo(scope): descripción breve en inglés`
- **Seguridad:** Nunca loguear credenciales, tokens o datos de usuarios

---

*README.md — report-bi frontend — v2.0 — 2026-04-03*