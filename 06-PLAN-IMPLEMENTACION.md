# 6. Plan de Implementación

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee--v2-brightgreen.svg)](README.md)
![Estado](https://img.shields.io/badge/Estado-Activo-success.svg)
[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)
![Actualizado](https://img.shields.io/badge/Actualizado-Agosto%202026-orange.svg)

![Progreso General](https://img.shields.io/badge/Progreso-90%25-blue.svg)
![Bugs Corregidos](https://img.shields.io/badge/Bugs%20Corregidos-29%2F30-brightgreen.svg)
![Tests Pasando](https://img.shields.io/badge/Tests-384%2F384-brightgreen.svg)
![Deuda Técnica](https://img.shields.io/badge/Deuda%20Técnica-8%20items-yellow.svg)
![Prioridad Máx (RICE)](<https://img.shields.io/badge/Prioridad%20Máx%20(RICE)-108-orange.svg>)

---

**Producto:** Hostal Cofee v2
**Fecha:** Agosto 2026

---

## 1. Estado Actual — Lo que ya está hecho

### 1.1 Bugs Corregidos (29/30)

| #   | Severidad | Descripción                                             | Archivos                                                 |
| --- | --------- | ------------------------------------------------------- | -------------------------------------------------------- |
| 1   | CRÍTICO   | Zod parse no escribía valores de vuelta a req           | `middleware/validation.ts`                               |
| 2   | CRÍTICO   | generateRefreshToken no era async                       | `routes/auth.ts`                                         |
| 3   | CRÍTICO   | Reservar no se podía ver desde admin (userId filter)    | `services/reservation.service.ts`                        |
| 4   | CRÍTICO   | Estados de pedido sin validación (cualquier transición) | `services/order.service.ts`                              |
| 5   | CRÍTICO   | Cancelar pedido no revertía totales del turno           | `services/order.service.ts`                              |
| 6   | CRÍTICO   | Se podían abrir múltiples turnos simultáneos            | `services/shift.service.ts`                              |
| 7   | CRÍTICO   | UTC/Local timezone mixing en queries de turno           | `services/order.service.ts`, `services/shift.service.ts` |
| 8   | CRÍTICO   | Borrar menú con pedidos activos cascateaba              | `services/menu.service.ts`, `middleware/errors.ts`       |
| 9   | CRÍTICO   | localStorage crash si JSON corrupto                     | `context/CartContext.tsx`                                |
| 10  | CRÍTICO   | Admin reservas mostraba UUID en vez de #mesa            | `AdminReservations.tsx`                                  |
| 11  | CRÍTICO   | POS crasheaba con receipt null fields                   | `AdminPOS.tsx`                                           |
| 12  | ALTO      | Pedidos aceptaban items agotados                        | `services/order.service.ts`                              |
| 13  | ALTO      | Pedidos fuera de turno activo                           | `services/order.service.ts`                              |
| 14  | ALTO      | Receipt number predecible (secuencial)                  | `services/order.service.ts`                              |
| 15  | ALTO      | Errores Wompi no retornaban status                      | `routes/payments.ts`                                     |
| 16  | ALTO      | Dashboard duplicaba tarjeta "Ingresos Totales"          | `AdminDashboard.tsx`                                     |
| 17  | ALTO      | Filtro de pedidos no incluía "cancelled"                | `AdminOrders.tsx`                                        |
| 18  | ALTO      | Pago en efectivo sin validación de monto                | `AdminPOS.tsx`                                           |
| 19  | ALTO      | Pedidos no auto-actualizaban                            | `AdminOrders.tsx`                                        |
| 20  | ALTO      | Catch blocks sin feedback al usuario                    | `AdminPOS.tsx`, `AdminDashboard.tsx`                     |
| 21  | ALTO      | POS sin reloj en tiempo real                            | `AdminPOS.tsx`                                           |
| 22  | MEDIO     | Reservar mesa sin check de capacidad                    | `services/reservation.service.ts`                        |
| 23  | MEDIO     | Auth service muerto (dead code)                         | `services/auth.service.ts` (eliminado)                   |
| 25  | MEDIO     | Sin página 404                                          | `App.tsx`                                                |
| 26  | MEDIO     | Modales sin cerrar al hacer click afuera                | `AdminPOS.tsx`, `AdminShifts.tsx`, `AdminTables.tsx`     |
| 27  | MEDIO     | clearCart reseteaba tipo de pedido y zona               | `CartContext.tsx`                                        |
| 28  | MEDIO     | CartItem sin campo precio                               | `types/index.ts`, `AdminOrders.tsx`                      |
| 29  | MEDIO     | Reservar sin orden cronológico                          | `AdminReservations.tsx`                                  |
| 30  | MEDIO     | Input precio sin restricciones                          | `AdminMenu.tsx`                                          |

### 1.2 Infraestructura Corregida

- Docker Eliminado: se removieron `docker-compose.yml`, `Dockerfile`s y scripts relacionados. El proyecto se enfoca en desarrollo local y despliegue **bare-metal en Windows** (NSSM + Caddy, ver `deploy/`).
- Express async error handling (catchAsync middleware en todas las rutas)
- Error handler global mejorado (statusCode custom, FK constraints, Prisma errors)
- Rate limiting deshabilitado en test (NODE_ENV=test)
- Tests: **186/186 backend** (auth: 25, orders: 16, reservations: 12, menu: 11, middleware: 23, payments: 11, reports: 6, services: 27, shifts: 12, tables: 18, validation: 9, whatsapp: 8, audit: 5, events: 3) + **156 frontend** + **42 tests de seguridad** + **E2E Playwright**
- Cobertura: **92% líneas servidor · 86% cliente** (umbral CI 80%)
- Observabilidad: logs JSON, request ID, `GET /api/metrics`

### 1.3 Funcionalidades Implementadas al 100%

| Módulo                                                | Estado               |
| ----------------------------------------------------- | -------------------- |
| Auth (registro, login, JWT, roles)                    | COMPLETO             |
| Menú (CRUD admin, catálogo público)                   | COMPLETO             |
| Pedidos (3 tipos, machine de estados)                 | COMPLETO             |
| Reservas (formulario, gestión admin)                  | COMPLETO             |
| POS (terminal táctil, receipt, print)                 | COMPLETO             |
| Turnos (apertura, conciliación, cierre)               | COMPLETO             |
| Reportes (diarios, top items, horarios)               | COMPLETO             |
| Mesas (CRUD, QR codes, occupancy)                     | COMPLETO             |
| Delivery zones (tarifas, cálculo)                     | COMPLETO             |
| WhatsApp Business API (deep links + API con fallback) | COMPLETO             |
| Wompi (sandbox + producción)                          | COMPLETO             |
| Observabilidad (logs JSON, request ID, métricas)      | COMPLETO             |
| Despliegue bare-metal Windows (NSSM + Caddy)          | COMPLETO             |
| E2E Playwright + capturas para docs                   | COMPLETO             |
| Test suite                                            | COMPLETO (384 tests) |

---

## 2. Tech Debt — Lo que necesita limpieza

| #   | Prioridad | Deuda                                                                                        | Esfuerzo | Impacto                    |
| --- | --------- | -------------------------------------------------------------------------------------------- | -------- | -------------------------- |
| 1   | Baja      | Hooks no usados: `useMenu`, `useOrders`, `useReservations`, `useLocalStorage`, `useDebounce` | 1h       | Limpieza de código         |
| 2   | Media     | UI Library definida (`ui/index.tsx`) pero no adoptada — cada página construye UI inline      | 4h       | Consistencia visual        |
| 3   | Baja      | CartContext duplicado en MesaPage (`MesaCartContext` separado)                               | 2h       | Mantenibilidad             |
| 4   | Baja      | Modelo `DailyReport` en Prisma schema pero nunca escrito                                     | 15min    | Schema limpio              |
| 5   | ~~Alta~~  | ~~Wompi solo como label~~ — ✅ resuelto: modo producción + proxy de transacciones            | —        | Pagos reales               |
| 6   | ~~Alta~~  | ~~WhatsApp solo deep links~~ — ✅ resuelto: Business API con fallback a wa.me                | —        | Notificaciones automáticas |
| 7   | Baja      | Social links stub (`href="#"` en Footer)                                                     | 30min    | UX                         |
| 8   | Media     | Charts CSS puros en reportes — sin librería de gráficos                                      | 4h       | Visualización              |
| 9   | Media     | `cleanupExpiredTokens()` definido pero nunca llamado                                         | 1h       | Seguridad                  |
| 10  | Media     | Sin paginación en listas de pedidos y reservas                                               | 6h       | Performance                |

---

## 3. Roadmap de Implementación

### Fase 1 — Corto Plazo (1-2 semanas)

**Objetivo:** Consolidar lo existente y cerrar deuda técnica

| Tarea                                                                | Esfuerzo | Dependencias         |
| -------------------------------------------------------------------- | -------- | -------------------- |
| Adoptar `ui/index.tsx` como design system en páginas admin           | 4h       | Ninguna              |
| Eliminar hooks no usados del directorio `hooks/`                     | 1h       | Ninguna              |
| Eliminar modelo `DailyReport` del schema (o habilitar escritura)     | 15min    | Decisión de producto |
| Conectar `cleanupExpiredTokens()` a un cron o middleware             | 1h       | Ninguna              |
| ~~Integrar Wompi modo producción~~ — ✅ hecho (backend + WOMPI_MODE) | —        | —                    |
| ~~Agregar tests E2E (Playwright)~~ — ✅ hecho (suite + capturas)     | —        | —                    |
| ~~WhatsApp Business API~~ — ✅ hecho (envío server-side + fallback)  | —        | —                    |
| Agregar paginación a `GET /api/orders` y `GET /api/reservations`     | 6h       | Frontend update      |
| Configurar ESLint rules para evitar imports no usados                | 30min    | Ninguna              |

**Total estimado:** ~29h

### Fase 2 — Mediano Plazo (1 mes)

**Objetivo:** Real-time updates y mejores integraciones

| Tarea                                                                  | Esfuerzo | Dependencias                       |
| ---------------------------------------------------------------------- | -------- | ---------------------------------- |
| WebSocket (Socket.io) para updates de estado de pedidos en tiempo real | 16h      | Instancia Socket.io en backend     |
| WhatsApp Business API (envío server-side automático)                   | 16h      | Cuenta WhatsApp Business + API key |
| PWA (service worker, manifest.json, offline menu)                      | 12h      | Configuración Vite + assets        |
| Reemplazar CSS charts con Recharts o similar                           | 4h       | npm install recharts               |
| Loading skeletons para todas las páginas                               | 8h       | Design system adoptado             |
| Empty states ilustrados (SVG)                                          | 4h       | Assets SVG                         |
| Búsqueda/filtro avanzado en pedidos y reservas                         | 6h       | Paginación previa                  |
| Toast messages consistentes (position, duration, variant)              | 2h       | Ninguna                            |

**Total estimado:** ~68h

### Fase 3 — Largo Plazo (2-3 meses)

**Objetivo:** Escalar el producto

| Tarea                                                   | Esfuerzo | Dependencias             |
| ------------------------------------------------------- | -------- | ------------------------ |
| Multi-sucursal (schema + UI)                            | 40h      | Decisión de arquitectura |
| Módulo de inventario y stock                            | 32h      | Schema extensión         |
| Dashboard analytics avanzado (tendencias, comparativas) | 24h      | Datos históricos         |
| Mobile app (React Native o PWA avanzado)                | 60h      | Framework decision       |
| OAuth (Google login)                                    | 8h       | Google Cloud Console     |
| Notificaciones push (web push)                          | 12h      | Service worker           |
| Programación de platos (disponibilidad por horario)     | 16h      | Schema extensión         |
| Sistema de propinas                                     | 12h      | Schema + UI              |
| Sistema de valoraciones/reseñas                         | 16h      | Schema + UI              |
| Exportación de reportes (PDF/Excel)                     | 12h      | Librería (jsPDF, xlsx)   |

**Total estimado:** ~232h

---

## 4. Priorización RICE

| Feature               | Reach | Impact | Confidence | Effort | RICE Score | Fase |
| --------------------- | ----- | ------ | ---------- | ------ | ---------- | ---- |
| Wompi SDK real        | 8     | 3      | 9          | 2      | **108**    | 1    |
| Paginación            | 9     | 2      | 10         | 2      | **90**     | 1    |
| WebSocket real-time   | 10    | 3      | 8          | 4      | **60**     | 2    |
| WhatsApp Business API | 7     | 3      | 7          | 4      | **37**     | 2    |
| PWA                   | 8     | 2      | 8          | 3      | **43**     | 2    |
| Loading skeletons     | 10    | 1      | 10         | 2      | **50**     | 2    |
| Multi-sucursal        | 4     | 3      | 6          | 10     | **7**      | 3    |
| Inventario            | 5     | 3      | 7          | 8      | **13**     | 3    |
| Analytics dashboard   | 6     | 2      | 8          | 6      | **16**     | 3    |
| Mobile app            | 9     | 3      | 5          | 15     | **9**      | 3    |

**Escala RICE:** Reach (1-10), Impact (1-3), Confidence (1-10), Effort (1-15)
**Score:** (Reach × Impact × Confidence) / Effort

---

## 5. Arquitectura Futura

### 5.1 Estado Actual

```
Monolito: Client (React) + Server (Express) + DB (PostgreSQL)
```

### 5.2 Estado Objetivo (Fase 3)

```
┌─────────────────────────────────────────────────┐
│                   CDN / Edge                     │
│            (Vercel / Cloudflare)                 │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│              PWA / SPA (React)                   │
│         Service Worker + Cache                   │
└──────────────────┬──────────────────────────────┘
                   │ HTTP + WebSocket
┌──────────────────▼──────────────────────────────┐
│              API Server (Express)                │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│   │  REST    │  │WebSocket │  │  Cron    │     │
│   │  Routes  │  │  Server  │  │  Jobs    │     │
│   └──────────┘  └──────────┘  └──────────┘     │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│            PostgreSQL (Supabase/Neon)            │
│          + Redis (sessions, cache)               │
└─────────────────────────────────────────────────┘

Externo:
├── Wompi API (pagos)
├── WhatsApp Business API (notificaciones)
├── Push Notification Service
└── File Storage (imágenes de menú)
```

---

## 6. Métricas de Progreso

### 6.1 Completitud por Módulo

```
Auth:       ████████████████████ 100%
Menu:       ████████████████████ 100%
Pedidos:    ████████████████████ 100%
Reservas:   ████████████████████ 100%
POS:        ████████████████████ 100%
Turnos:     ████████████████████ 100%
Reportes:   ████████████████████ 100%
Mesas:      ████████████████████ 100%
Pagos:      ████████████████████ 100% (sandbox + producción)
Notif:      ████████████████████ 100% (Business API + wa.me)
Testing:    ████████████████████ 100% (186 + 156 + 42 + E2E)
Observab:   ████████████████████ 100% (logs JSON + métricas)
Deploy:     ████████████████████ 100% (Windows bare-metal)
UI/UX:      ████████████████░░░░  80% (sin design system adoptado)
```

### 6.2 Progreso General

| Categoría                  | Progreso                      |
| -------------------------- | ----------------------------- |
| Funcionalidad backend      | 100%                          |
| Funcionalidad frontend     | 95%                           |
| Testing                    | 100% (unit + cobertura + E2E) |
| Integración pagos          | 100% (sandbox + producción)   |
| Integración notificaciones | 100% (Business API + wa.me)   |
| Observabilidad             | 100%                          |
| Despliegue                 | 100% (Windows bare-metal)     |
| Design system              | 30% (definido, no adoptado)   |
| PWA                        | 0%                            |
| **General**                | **~90%**                      |

---

## 7. Decisiones Técnicas Pendientes

| Decisión       | Opciones                               | Recomendación                                |
| -------------- | -------------------------------------- | -------------------------------------------- |
| Chart library  | Recharts / Chart.js / Victory          | Recharts (mejor React integration)           |
| Mobile app     | React Native / PWA avanzado / Expo     | PWA avanzado (menor esfuerzo, sin app store) |
| Real-time      | Socket.io / SSE / Polling mejorado     | Socket.io (ya familiar, ecosystem rico)      |
| Multi-sucursal | Schema con `branchId` / Microservicios | Schema con `branchId` (monolito escalado)    |
| Image storage  | Local / Cloudinary / S3                | Cloudinary (free tier generoso)              |
| Cache          | Sin cache / Redis / In-memory          | Redis (cuando se necesite escalabilidad)     |

---

## Licencia

[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)

Este proyecto se distribuye bajo una **Licencia de Uso Propietario DEVCO - Versión Comercial**.
Copyright (c) 2026 **GirMart-SDK**. Todos los derechos reservados.

Prohibida la reproducción total o parcial sin autorización expresa por escrito.
Para más detalles, consulte el archivo [LICENSE](LICENSE).
