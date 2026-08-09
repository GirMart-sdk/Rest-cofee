# Changelog

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee-v2-brightgreen.svg)](README.md)
[![Versión](https://img.shields.io/badge/Versión-1.1.0-blue.svg)](CHANGELOG.md)
[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)
![Actualizado](https://img.shields.io/badge/Actualizado-Agosto%202026-orange.svg)

[![Keep a Changelog](https://img.shields.io/badge/Changelog-Keep%20a%20Changelog-e05735.svg)](https://keepachangelog.com/es/1.1.0/)
[![Semantic Versioning](https://img.shields.io/badge/SemVer-2.0.0-blue.svg)](https://semver.org/lang/es/)
![Conventional Commits](https://img.shields.io/badge/Commits-Conventional-blue.svg)
[![Security](https://img.shields.io/badge/Security-Hardened-red.svg)](SECURITY.md)
[![Tests](https://img.shields.io/badge/Tests-342%20Passing-brightgreen.svg)](02-TRD.md)

---

Todos los cambios notables en **Hostal Cofee** se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

### Added

- Cliente: autenticación con refresh token en cookie httpOnly (`hostal_refresh`); el access
  token se renueva vía `POST /api/auth/refresh` sin exponer el refresh token en `localStorage`
- Cliente: pedidos en tiempo real vía SSE (`src/services/events.ts`) con indicador de
  conexión en el panel de gestión de pedidos
- Suite de tests del cliente con Vitest (156 tests) y workflow de CI (lint + tests +
  coverage para server y cliente)

### Changed

- Cliente: subidos los umbrales de cobertura (statements/lines ≥ 52%, branches ≥ 70%)
- Documentación: insignias actualizadas (342 tests, coverage server 92% / client 86%,
  42 tests de seguridad)

### Fixed

- N/A

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
