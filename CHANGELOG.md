# Changelog

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee--v2-brightgreen.svg)](README.md)
[![Versión](https://img.shields.io/badge/Versión-1.1.0-blue.svg)](CHANGELOG.md)
[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)
![Actualizado](https://img.shields.io/badge/Actualizado-Agosto%202026-orange.svg)

[![Semantic Versioning](https://img.shields.io/badge/SemVer-2.0.0-blue.svg)](https://semver.org/lang/es/)
[![Security](https://img.shields.io/badge/Security-Hardened-red.svg)](SECURITY.md)

---

Todos los cambios notables en **Hostal Cofee** se documentan en este archivo.

---

## [Unreleased]

### Added

- Cliente: autenticación con refresh token en cookie httpOnly (`hostal_refresh`); el access
  token se renueva vía `POST /api/auth/refresh` sin exponer el refresh token en `localStorage`
- Cliente: pedidos en tiempo real vía SSE (`src/services/events.ts`) con indicador de
  conexión en el panel de gestión de pedidos
- Cliente: hook compartido `useCartState` (`src/hooks/useCartState.ts`) que centraliza la
  lógica de carrito (items, add/remove/update, total, persistencia opcional en
  `localStorage`) con suite de tests propia
- Cliente: variantes `success` y `outline` en `Button` del design system
- Cliente: design system (Button/Input/Card/EmptyState) adoptado en flujos clave —
  login, grid de menú, checkout (carrito, dirección, reservas) y formularios admin
  (menú, mesas, turnos, POS)
- Suite de tests del cliente con Vitest (208 tests) y workflow de CI (lint + tests +
  coverage para server y cliente)
- CI: `npm audit --audit-level=high` en lint-server y lint-client, acciones fijadas por SHA,
  Node 22 y timeouts por job
- Cliente: página 404 con ruta catch-all (`pages/NotFound.tsx`) y test dedicado
- Cliente: componentes de design system `Skeleton`, `EmptyState` y `Pagination`
  (`components/ui`) con suite de tests propia
- Servidor: paginación server-side en `GET /api/orders` (default 50) y
  `GET /api/reservations` (default 100) con metadatos `pagination` y controles en el
  panel admin
- Servidor: cron de limpieza de refresh tokens expirados (`cleanupExpiredTokens()`) cada
  6 horas y al arranque

### Changed

- Documentación: consolidados todos los pendientes por corregir en el único backlog
  `04-PENDIENTES.md` (deduplicado: 65 ítems); `03-DIAGNOSTICO.md` pasa a ser información
  general (contexto, resueltos y fortalezas) y `SECURITY-REPORT.md` queda marcado como
  histórico con enlaces a ambos
- Cliente: subidos los umbrales de cobertura (statements/lines ≥ 95%, branches ≥ 90%,
  functions ≥ 90%)
- Dependencias: react-router-dom 6 → 7, Vite 5 → 6, Vitest 2 → 3, Express 4.19 → 4.22,
  Prisma → 5.22 (server y cliente)
- Servidor: el rate limiter global solo aplica a rutas `/api/`, dejando de contar las
  peticiones de assets del dev server de Vite y de estáticos
- Documentación: insignias actualizadas (436 tests, coverage server 92% / client 99%,
  42 tests de seguridad) y plan de implementación con la deuda cerrada
- Cliente: `Footer` reemplaza los enlaces sociales stub (`href="#"`) por WhatsApp
  (`wa.me`, configurable vía `VITE_WHATSAPP_PHONE`) y `tel:`
- Cliente: `Input` del design system asocia `label` ↔ `input` con `useId` (accesibilidad)
- Cliente: `CartContext` reconstruido sobre `useCartState('hostal-cofee-cart')`
  (addItem con toast, clearCart limpia tipo de pedido y zona de entrega)
- Cliente: `MesaPage` elimina la duplicación de carrito usando `useCartState` con
  instancia propia sin persistencia (pedidos de mesa)
- Cliente: paneles admin de pedidos y reservas con loading skeletons, empty states con
  acción de refresco y paginación

### Removed

- Documentación: eliminado `06-PLAN-IMPLEMENTACION.md` (plan de implementación y
  seguimiento: bugs, roadmap, RICE, métricas). La estructura y funciones quedan en
  `02-TRD.md` y `README.md`; eliminada también la sección de deuda técnica del TRD y
  el bloque de estado real de CONTRIBUTING
- Documentación: añadido `03-DIAGNOSTICO.md` (diagnóstico integral de ciberseguridad,
  funcionalidad e inconsistencias, y lógica/estructura — 88 hallazgos — con madurez MVP)
- Cliente: hooks muertos `useApi`, `useMenu`, `useOrders`, `useReservations` y su archivo
  de test (`src/hooks/useApi.*`), solo usados entre sí
- Servidor: modelo `DailyReport` del schema Prisma (nunca escrito) — migración
  `20260815100000_remove_daily_report`

### Fixed

- Pagos (server): dominio Wompi corregido a `https://sandbox.wompi.co/v1` /
  `https://production.wompi.co/v1` (antes `wompi.su`); `create-transaction` ahora recibe
  solo `orderId` y el monto lo calcula el servidor (`order.total`), ignorando valores del
  cliente; el webhook verifica `amount_in_cents` contra la orden y rechaza discrepancias
  (métrica `paymentsAmountMismatch`)
- Pagos (cliente): el carrito inicia el cobro Wompi tras crear la orden (`POST
/payments/create-transaction`) y abre el link de pago en una pestaña nueva
- Admin: botón "Marcar Pagado" consume `PATCH /orders/:id/payment` para pagos no cash y
  se muestra el estado de pago en las tarjetas de pedido
- Domicilios (server): el esquema de creación exige dirección y zona de entrega cuando
  `orderType === 'domicilio'`
- Domicilios (cliente): `DeliveryForm` es controlado y el carrito envía `address`/
  `deliveryNotes`; los pedidos ya no se atascan en `out_for_delivery` (flujo → `delivered`)
- Privacidad: los endpoints públicos `GET /api/orders/table/:tableNumber`,
  `GET /api/tables` y `GET /api/tables/:number` ya no exponen PII (nuevo `toPublicOrder`);
  los parámetros numéricos se validan con Zod (1–999)
- Cliente: el interceptor de `api` ya no intenta refrescar/redirigir en un 401 de
  `/auth/login` (o `/auth/register`), evitando la recarga completa que ocultaba el toast
  de "Credenciales incorrectas"
- E2E: `home.spec.ts` resuelve el nav duplicado (escritorio + móvil) y `cart.spec.ts`
  ya no depende del estado transitorio "Añadido", evitando flakiness bajo carga
- Documentación: contaba 384 tests y 86% de cobertura cliente; ahora refleja 436 tests
  y 99% (métricas reales)

### R1–R5 · Resolución completa del backlog (65/65 ✅)

**Added**

- Resolución completa: los 65 ítems de `04-PENDIENTES.md` quedaron resueltos (registro de
  resolución 65/65 ✅); `03-DIAGNOSTICO.md` actualizado a 88/88 hallazgos resueltos
- Servidor: `GET /api/payments` (admin) con filtro por estado y límite de resultados para el
  nuevo panel de pagos
- Servidor: 2FA completa — flujo `requiresTwoFactor` + `pendingToken`, configuración con
  re-autenticación y verificación con limiter propio
- Cliente: panel de auditoría (`/admin/auditoria`) con listado paginado y filtros
- Cliente: panel de pagos Wompi (`/admin/pagos`) con resumen de transacciones, filtro por
  estado y detalle por orden
- Cliente: modal de resumen por turno (ventas por método de pago y pedidos por tipo)
  consumiendo `GET /api/shifts/:id/summary`
- Cliente: reporte semanal en `AdminReports` (pestaña guardada con `useLocalStorage`)
- Cliente: buscador de pedidos en `AdminOrders` con `useDebounce`
- Cliente: `MesaPage` valida la mesa (`GET /api/tables/:number`, capacidad y "Mesa no
  encontrada") y muestra los pedidos activos (`GET /api/orders/table/:tableNumber`)

**Changed**

- Cliente: el access token se mantiene solo en memoria (fuera de `localStorage`); la sesión
  se restaura vía refresh token en cookie `httpOnly`
- Servidor: `AuthService` (código muerto) eliminado; la lógica de auth queda consolidada en
  `routes/auth.ts`
- Servidor: `sanitize` excluye campos de credenciales y está exento del webhook de Wompi
- Servidor: `upgradeInsecureRequests` de la CSP solo en producción; 404 JSON en `/api`;
  respuesta 413 con body 32 kb; rate limit global 300/15 min (prod) y 2000 (dev)
- Tarifas de delivery con una única fuente: `GET /orders/zones` consumido por `CartContext`
- Formato de moneda centralizado (`formatCOP`) y fechas en zona local (`toLocalDateString`)

**Fixed**

- Anti-timing en login con hash bcrypt válido y lockout por email **e IP**
- Webhook Wompi idempotente (no revierte `paid`) y firma verificada con `timingSafeEqual`
- Rotación de refresh token con detección de reuso; `config.jwtRefreshExpiresIn` aplicado
- `X-Request-Id` generado con `crypto.randomUUID()` (se ignora el valor del cliente)
- Creación de pedido atómica con `$transaction`; turno único abierto y cierre con arqueo
- Reservas asocian `userId` y validan doble reserva; pedidos anónimos recuperables
- Errores de validación del server visibles en la UI (`getErrorMessage`) y handler P2003 → 400
- Placeholders de `JWT_SECRET` y contraseñas en plantillas eliminados; `test:security`
  (43/43) ahora sí se ejecuta en CI
- Cliente: flujo 2FA funcional (login paso a paso y `change-password`), consistencia
  `minLength` de contraseñas y botones de mesas accesibles en táctil
- Cuadre de caja al cerrar turno; backups de BD cifrados con ACL; límite de conexiones SSE

**Test coverage**

- Cliente: 232 tests (31 archivos) · Servidor: 188 tests (14 archivos) · Seguridad: 43 tests

---

## [1.1.0] - 2026-08-08

### Added

#### Observabilidad

- Logger estructurado en JSON (`utils/logger.ts`) con nivel configurable (`LOG_LEVEL`)
- Request ID (UUID) en cada petición (`middleware/requestId.ts`)
- Middleware de request logging con duración y status
- Endpoint admin `GET /api/metrics` con contadores (requests, status codes, latencia)

#### WhatsApp Business API

- Nuevo servicio `utils/whatsapp.ts`: envía notificaciones vía API de WhatsApp Business
  cuando `WHATSAPP_API_TOKEN` y `WHATSAPP_PHONE_NUMBER_ID` están configurados
- Fallback automático a deep links `wa.me` si la API falla o no está configurada
- Tests dedicados (`tests/whatsapp.test.ts`, 8 tests)

#### Wompi en producción

- Soporte de `WOMPI_MODE=production`: URL base `https://api.wompi.su/v1` automática
- Variables `WOMPI_PUBLIC_KEY` / `WOMPI_PRIVATE_KEY` para entorno real

#### Testing

- Tests frontend con Vitest (25 tests): App, AuthContext, CartContext, api client, MenuGrid
- Polyfills de `IntersectionObserver`/`ResizeObserver`/`matchMedia` para jsdom
- Suite E2E con Playwright (`e2e/`): home, menú, auth, carrito y documentación
- Script `test:e2e:docs` que genera capturas full-page en `docs/screenshots/`
- Umbral de cobertura real en CI: 80% (statements/lines/functions, 65% branches)

#### Despliegue bare-metal (Windows)

- Scripts en `deploy/`: `deploy.ps1`, `uninstall-service.ps1`, `backup-db.ps1`,
  `restore-db.ps1`, `monitor.ps1`, `Caddyfile` y `.env.production.example`
- Servicio Windows con NSSM + Caddy para HTTPS automático
- Guía completa en [deploy/README.md](deploy/README.md)

#### CI/CD

- Eliminado el job de Docker (el proyecto ya no usa contenedores)
- Nuevos jobs: `test-client` (Vitest frontend) y `e2e` (Playwright con PostgreSQL)
- Job `build` compila server (`tsc`) y client (`tsc + vite build`)

### Changed

- Frontend: `tsconfig.build.json` separado para builds de producción (excluye tests)
- CI: el job E2E levanta el servidor con middleware de Vite sobre PostgreSQL de servicio
- README y documentación actualizados con rutas reales (`hostal-cofre/...`)

### Fixed

- `brace-expansion` override (5.0.9 → ^2.0.1): rompía `npm run test:coverage` (ESM-only)
- Coverage contaba `dist/` al 0%: ahora se excluye (`dist/` en `vitest.config.ts`)
- Tests frontend fallaban por el hoisting de `vi.mock` → migrado a `vi.hoisted()`
- README con rutas y contadores obsoletos corregidos

---

## [1.0.0] - 2026-07-16

### Added

#### Backend (Node.js + Express + Prisma)

- Sistema de autenticación JWT con refresh tokens
- Gestión de menú (CRUD completo)
- Sistema de pedidos con estados
- Sistema de reservas de mesas
- Integración con Wompi (sandbox)
- Integración con WhatsApp (wa.me)
- Validación de entrada con Zod
- Middleware de sanitización XSS
- Headers de seguridad (Helmet + CSP)
- Account lockout (anti brute force)
- Request ID tracking para auditoría

#### Frontend (React + Vite + TypeScript)

- Menú digital con filtros por categoría
- Carrito de compras persistente
- Reserva de mesas con selección visual
- Checkout con WhatsApp
- Login/Registro de usuarios
- Dashboard admin con estadísticas
- CRUD de menú (admin)
- Gestión de pedidos en tiempo real (admin)
- Gestión de reservas (admin)
- Panel de pagos (admin)

#### Infraestructura y CI/CD

- CI/CD con GitHub Actions
- Husky + lint-staged para pre-commit hooks
- ESLint + Prettier configurados

#### Seguridad (6 Capas)

- Capa 1: Gestión de Secrets (.gitignore, .env.example, JWT validation)
- Capa 2: Hardening de Autenticación (algorithm locking, password policy, bcrypt 12)
- Capa 3: Validación de Entrada (Zod schemas, XSS sanitization)
- Capa 4: Headers de Seguridad (CSP, HSTS, X-Frame-Options)
- Capa 5: Gestión de Sesiones (refresh tokens, account lockout, token revocation)
- Capa 6: Tests Automatizados de seguridad

---

## [0.1.0] - 2026-07-01

### Added

- Estructura inicial del proyecto
- Configuración de base de datos PostgreSQL
- Schema de Prisma básico
- Endpoints API iniciales

---

## Referencias de Versiones

- **MAJOR**: Cambios incompatibles con versiones anteriores
- **MINOR**: Funcionalidades nuevas compatibles
- **PATCH**: Correcciones de bugs compatibles

[Unreleased]: https://github.com/TU_USUARIO/REST-COFEE/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/TU_USUARIO/REST-COFEE/releases/tag/v1.1.0
[1.0.0]: https://github.com/TU_USUARIO/REST-COFEE/releases/tag/v1.0.0
[0.1.0]: https://github.com/TU_USUARIO/REST-COFEE/releases/tag/v0.1.0

---

## Licencia

[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)

Este proyecto se distribuye bajo una **Licencia de Uso Propietario DEVCO - Versión Comercial**.
Copyright (c) 2026 GirMart-SDK. Para más detalles, consulte el archivo [LICENSE](LICENSE).
