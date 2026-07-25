# TRD — Documento de Requisitos Técnicos

![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee%20v2-brightgreen.svg)
![Versión Documento](https://img.shields.io/badge/Versión-2.0-blue.svg)
![Licencia](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)
![Actualizado](https://img.shields.io/badge/Actualizado-Julio%202026-orange.svg)

![Arquitectura](https://img.shields.io/badge/Arquitectura-Monolito%20por%20Capas-blue.svg)
![Validación](https://img.shields.io/badge/Validación-Zod-blue.svg)
![Autenticación](https://img.shields.io/badge/Auth-JWT%20%26%20Refresh-blue.svg)
![Tests](https://img.shields.io/badge/Tests-73%20Pasando-brightgreen.svg)

---

**Producto:** Hostal Cofee v2
**Versión:** 2.0
**Fecha:** Julio 2026

---

## 1. Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                      Cliente (Browser)                   │
│  React 18 + Vite 5 + TailwindCSS 3 + React Router 6    │
│  Puerto: 5173                                           │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (proxy /api → :3001)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    API Server (Express)                   │
│  Express 4.19 + TypeScript ESM + Prisma 5.18            │
│  Puerto: 3001                                           │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Auth    │ │  Orders  │ │  Menu    │ │  Shifts  │  │
│  │ Routes   │ │ Routes   │ │ Routes   │ │ Routes   │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       │            │            │             │         │
│  ┌────▼────────────▼────────────▼─────────────▼─────┐  │
│  │              Services Layer                       │  │
│  └────────────────────┬──────────────────────────────┘  │
│                       │                                  │
│  ┌────────────────────▼──────────────────────────────┐  │
│  │              Prisma ORM (Query Engine)             │  │
│  └────────────────────┬──────────────────────────────┘  │
└───────────────────────┼─────────────────────────────────┘
                        │ TCP (puerto 5432)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                     │
│  10 modelos · 10 enums · 15+ índices                    │
│  Puerto: 5432                                           │
└─────────────────────────────────────────────────────────┘
```

**Tipo de arquitectura:** Monolito con separación por capas (Routes → Services → Prisma)

---

## 2. Stack Tecnológico

### 2.1 Backend

| Componente    | Tecnología         | Versión | Propósito                     |
| ------------- | ------------------ | ------- | ----------------------------- |
| Runtime       | Node.js            | 18+     | Ejecución JavaScript          |
| Framework     | Express            | ^4.19.2 | HTTP server y routing         |
| Lenguaje      | TypeScript         | ^5.5.4  | Type safety (ESM modules)     |
| ORM           | Prisma             | ^5.18.0 | Database access y migraciones |
| Validación    | Zod                | ^3.23.8 | Request validation            |
| Auth          | jsonwebtoken       | ^9.0.2  | JWT tokens (HS256)            |
| Hashing       | bcryptjs           | ^2.4.3  | Password hashing (12 rounds)  |
| Seguridad     | Helmet             | ^7.1.0  | Security headers (CSP, HSTS)  |
| CORS          | cors               | ^2.8.5  | Cross-origin requests         |
| Rate Limiting | express-rate-limit | ^7.3.1  | Brute force protection        |
| HTTP Client   | node-fetch         | ^3.3.2  | Wompi API calls               |
| Dev Runner    | tsx                | ^4.16.2 | TypeScript execution          |
| Test Runner   | Vitest             | ^2.0.5  | Unit/integration tests        |
| HTTP Testing  | Supertest          | ^6.3.4  | API testing                   |
| Linting       | ESLint             | ^8.57.0 | Code quality                  |
| Formatting    | Prettier           | ^3.3.3  | Code style                    |

### 2.2 Frontend

| Componente  | Tecnología       | Versión | Propósito              |
| ----------- | ---------------- | ------- | ---------------------- |
| Framework   | React            | ^18.3.1 | UI framework           |
| Build Tool  | Vite             | ^5.3.5  | Dev server + bundler   |
| Routing     | React Router DOM | ^6.26.0 | Client-side routing    |
| CSS         | TailwindCSS      | ^3.4.7  | Utility-first styling  |
| HTTP Client | Axios            | ^1.7.4  | API communication      |
| Animations  | Framer Motion    | ^11.3.0 | UI transitions         |
| Toast       | react-hot-toast  | ^2.4.1  | Notifications          |
| Icons       | react-icons      | ^5.3.0  | Icon library (Feather) |
| QR Code     | qrcode.react     | ^4.2.0  | Table QR generation    |

### 2.3 Base de Datos

| Componente | Tecnología | Versión | Propósito          |
| ---------- | ---------- | ------- | ------------------ |
| Motor      | PostgreSQL | 14+     | Primary database   |
| ORM        | Prisma     | ^5.18.0 | Schema + queries   |
| Puerto     | localhost  | 5432    | Default PostgreSQL |

---

## 3. Seguridad

### 3.1 Autenticación y Autorización

| Mecanismo           | Detalle                                                          |
| ------------------- | ---------------------------------------------------------------- |
| Access Token        | JWT HS256, expira en 15 minutos                                  |
| Refresh Token       | UUID v4, almacenable en DB, expira en 7 días                     |
| Rotación de refresh | El token old se revoca al usarlo (one-time use)                  |
| Invalidación total  | Cambio de contraseña revoca TODOS los refresh tokens del usuario |
| Roles               | `admin` y `client`, validados en middleware `requireAdmin`       |
| Algoritmo whitelist | Solo HS256 aceptado (previene algorithm switching attacks)       |

### 3.2 Protección de Endpoints

| Mecanismo                | Detalle                                                         |
| ------------------------ | --------------------------------------------------------------- |
| Rate limiting global     | 100 req/15min (producción), 1000 req/15min (desarrollo)         |
| Rate limiting auth       | 10 req/15min en /register y /login (deshabilitado en test)      |
| Account lockout          | 5 intentos fallidos → bloqueo 15 min, retorna 429 con countdown |
| Password policy          | 8+ chars, mayúscula, minúscula, dígito, carácter especial       |
| Timing attack prevention | bcrypt dummy compare cuando usuario no existe                   |

### 3.3 Protección de Datos

| Mecanismo        | Detalle                                                                          |
| ---------------- | -------------------------------------------------------------------------------- |
| XSS Sanitization | Middleware que limpia HTML tags, event handlers, javascript: URIs del body/query |
| Helmet CSP       | Sin frames, same-origin strict, no MIME sniffing                                 |
| Body limit       | 10KB máximo para requests JSON                                                   |
| Password masking | Nunca se retorna `password` en respuestas API                                    |

### 3.4 Validación

| Mecanismo          | Detalle                                            |
| ------------------ | -------------------------------------------------- |
| Request validation | Zod schemas en middleware `validate()`             |
| Parsed values      | Valores parseados reemplazan req.body/query/params |
| Error format       | 400 con detalles de validación Zod                 |

---

## 4. Infraestructura

### 4.1 Ambientes

| Ambiente    | Frontend                               | Backend                                 | DB                    | Notes                  |
| ----------- | -------------------------------------- | --------------------------------------- | --------------------- | ---------------------- |
| Development | Vite dev (`hostal-cofre/client` :5173) | tsx watch (`hostal-cofre/server` :3001) | PostgreSQL (:5432)    | Proxy /api → :3001     |
| Production  | Vite build (static)                    | Node.js (`hostal-cofre/server` :3001)   | PostgreSQL            | Same DB                |
| Test        | Vitest                                 | createApp() in-process                  | PostgreSQL (misma DB) | DB cleanup entre tests |

### 4.2 Puerto y Proxy

```
Frontend:  http://localhost:5173
Backend:   http://localhost:3001
Database:  localhost:5432
Proxy:     Vite redirige /api/* → http://localhost:3001
```

### 4.3 Variables de Entorno

**Backend (.env):**

```
DATABASE_URL          # PostgreSQL connection string
JWT_SECRET            # Mínimo 32 caracteres
JWT_EXPIRES_IN        # Default: 15m
JWT_REFRESH_EXPIRES_IN # Default: 7d
| CORS_ORIGIN           # Default: http://localhost:5173
WOMPI_PUBLIC_KEY      # Wompi sandbox public key
WOMPI_PRIVATE_KEY     # Wompi sandbox private key
WOMPI_BASE_URL        # Default: https://api-sandbox.wompi.su/v1
WHATSAPP_PHONE        # Número de WhatsApp del restaurante
ADMIN_EMAIL           # Email del admin seed
ADMIN_PASSWORD        # Password del admin seed
CLIENT_EMAIL          # Email del cliente seed
CLIENT_PASSWORD       # Password del cliente seed
```

**Frontend (.env):**

```
VITE_WHATSAPP_PHONE   # Número de WhatsApp para deep links
```

---

## 5. Dependencias Externas

### 5.1 Wompi (Pasarela de Pagos)

- **Tipo:** Sandbox API REST
- **Base URL:** `https://api-sandbox.wompi.su/v1`
- **Uso actual:** Backend proxy para crear/transacciones y consultar estado
- **Uso pendiente:** Frontend SDK para checkout real
- **Endpoints consumidos:** POST `/transactions`, GET `/transactions/:id`

### 5.2 WhatsApp (Notificaciones)

- **Tipo:** Deep links a `wa.me`
- **Uso actual:** Links client-side con mensaje pre-llenado
- **Uso pendiente:** WhatsApp Business API (envío server-side automático)

---

## 6. Testing

### 6.1 Framework

| Herramienta | Versión | Propósito       |
| ----------- | ------- | --------------- |
| Vitest      | ^2.0.5  | Test runner     |
| Supertest   | ^6.3.4  | HTTP assertions |

### 6.2 Configuración

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    singleThread: true, // Ejecución secuencial
    singleFork: true, // Un solo fork
    pool: "forks",
    exclude: ["**/security.test.ts"], // Test runner custom
  },
});
```

### 6.3 Cobertura Actual

| Suite                | Tests  | Estado           |
| -------------------- | ------ | ---------------- |
| auth.test.ts         | 15     | Todos pasando    |
| orders.test.ts       | 15     | Todos pasando    |
| reservations.test.ts | 14     | Todos pasando    |
| menu.test.ts         | 11     | Todos pasando    |
| shifts.test.ts       | 9      | Todos pasando    |
| validation.test.ts   | 9      | Todos pasando    |
| **Total**            | **73** | **100% pasando** |

### 6.4 Patrón de Tests

```typescript
// Helpers compartidos (tests/helpers.ts)
- createApp()        → App Express de prueba
- seedTestData()     → Crea admin, cliente, 2 mesas, 2 items menú
- cleanupTestData()  → Limpia datos de prueba
- adminToken()       → JWT de admin para tests
- clientToken()      → JWT de cliente para tests
- ensureUser()       → findOrCreate idempotente
- ensureTable()      → findOrCreate idempotente
```

---

## 7. Code Quality

### 7.1 Linting y Formatting

| Herramienta | Configuración             | Archivos        |
| ----------- | ------------------------- | --------------- |
| ESLint      | reglas React + TypeScript | `*.ts`, `*.tsx` |
| Prettier    | Configuración estándar    | `src/**`        |

### 7.2 TypeScript

- **Strict mode:** Activado en ambos proyectos
- **Target:** ES2020
- **Module resolution:** Bundler
- **Path aliases:** `@/` → `./src/`

### 7.3 Code Style

- ESM modules (`import/export`) en todo el backend
- Funciones de servicio como clases estáticas (Patrón Service)
- Zod schemas para validación de entrada
- catchAsync wrapper para handlers async (Express 4)
- Error handler global con soporte para errores custom (statusCode)

---

## 8. Stack de Despliegue (Futuro)

| Componente       | Opción Actual    | Opción Recomendada           |
| ---------------- | ---------------- | ---------------------------- |
| Hosting frontend | Local / Vercel   | Vercel / Netlify             |
| Hosting backend  | Local / Railway  | Railway / Render             |
| Database         | Local PostgreSQL | Supabase / Neon / Railway DB |
| Dominio          | —                | Cloudflare + SSL             |

---

## 9. Technical Debt Conocido

| #   | Deuda                                                                               | Prioridad | Esfuerzo |
| --- | ----------------------------------------------------------------------------------- | --------- | -------- |
| 1   | Hooks no usados (useMenu, useOrders, useReservations, useLocalStorage, useDebounce) | Baja      | 1h       |
| 2   | Componentes UI definidos pero no adoptados (ui/index.tsx)                           | Media     | 4h       |
| 3   | CartContext duplicado en MesaPage (MesaCartContext separado)                        | Baja      | 2h       |
| 4   | Modelo DailyReport sin uso (nunca se escribe)                                       | Baja      | 15min    |
| 5   | Wompi solo como label, sin SDK real en frontend                                     | Alta      | 8h       |
| 6   | WhatsApp solo deep links, sin API server-side                                       | Alta      | 16h      |
| 7   | Social links stub (href="#")                                                        | Baja      | 30min    |
| 8   | Charts CSS puros en reportes (sin librería)                                         | Media     | 4h       |
| 9   | cleanupExpiredTokens() nunca llamado                                                | Media     | 1h       |
| 10  | Sin paginación en listas (pedidos, reservas)                                        | Media     | 6h       |

---

## Licencia

[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)

Este proyecto se distribuye bajo una **Licencia de Uso Propietario DEVCO - Versión Comercial**.

Para más detalles, consulte el archivo [LICENSE](LICENSE).
