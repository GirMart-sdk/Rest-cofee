# Hostal Cofee v2 - Fullstack Restaurant

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee-v2-brightgreen.svg)](README.md)
[![Versión](https://img.shields.io/badge/Versión-1.1.0-blue.svg)](CHANGELOG.md)
[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)
![Actualizado](https://img.shields.io/badge/Actualizado-Agosto%202026-orange.svg)

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=nodedotjs)](https://nodejs.org)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5-darkblue?logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)
[![Security](https://img.shields.io/badge/Security-6%20Layers-red.svg)](SECURITY.md)
[![Tests](https://img.shields.io/badge/Tests-342%20Passing-brightgreen.svg)](02-TRD.md)
[![Coverage](https://img.shields.io/badge/Coverage-Server%2092%25%20%C2%B7%20Client%2086%25-brightgreen.svg)](02-TRD.md)
[![E2E](https://img.shields.io/badge/E2E-Playwright-blue.svg)](e2e/README.md)
[![Deploy](https://img.shields.io/badge/Deploy-Windows%20Bare--Metal-blue.svg)](deploy/README.md)

---

Sistema completo de gestión de restaurante **Hostal Cofee**: React + Node.js + PostgreSQL,
con menú digital, carrito, pedidos, reservas, POS, turnos, reportes, pagos Wompi y
notificaciones WhatsApp. Desplegable en un solo servidor Windows (servicio Node + Caddy).

## Stack

| Capa          | Tecnología                                            |
| ------------- | ----------------------------------------------------- |
| Frontend      | React 18 + Vite 5 + TypeScript + TailwindCSS          |
| Backend       | Node.js 18 + Express + Prisma ORM + Zod               |
| Base de datos | PostgreSQL 14                                         |
| Pagos         | Wompi (sandbox y producción)                          |
| WhatsApp      | Deep links `wa.me` + WhatsApp Business API (opcional) |
| Despliegue    | Windows bare-metal: NSSM + Caddy (HTTPS)              |

## Seguridad (6 Capas)

| Capa        | Protección                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------- |
| 1. Secrets  | `.gitignore`, `.env.example`, `JWT_SECRET` validado (min 32 chars), seed con contraseñas desde variables de entorno |
| 2. Auth     | JWT HS256 (algorithm locking), password policy, bcrypt 12 rounds, timing attack protection, account lockout         |
| 3. Input    | Zod en todas las rutas, XSS sanitization, error handler sin stack trace en producción, payload limit                |
| 4. Headers  | Helmet + CSP, HSTS, CORS restringido, Request ID tracking                                                           |
| 5. Sesiones | Refresh tokens rotados, revocación en DB, cambio de contraseña invalida todas las sesiones                          |
| 6. Testing  | 164 tests backend + 25 tests frontend + suite E2E Playwright, umbral de cobertura 80%                               |

Ver [SECURITY.md](SECURITY.md) y [SECURITY-REPORT.md](SECURITY-REPORT.md).

## Resumen rápido

- **Backend**: API REST monolítica Express + Prisma (rutas: auth, menu, orders, reservations, payments, shifts, tables, reports).
- **Frontend**: SPA React + Vite + Tailwind con menú digital, carrito persistente, reservas, checkout WhatsApp/Wompi y panel admin.
- **Observabilidad**: logs estructurados (JSON), request ID por petición, `/api/metrics` para monitoreo.
- **Tests**: Vitest (164 backend / 25 frontend) + Playwright E2E con capturas para documentación.
- **Despliegue**: scripts PowerShell para Windows (NSSM + Caddy) en `deploy/`.

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- npm 9+

## Instalación Rápida

```bash
# 1. Instalar dependencias del servidor
cd hostal-cofre/server
npm install

# 2. Crear base de datos
psql -U postgres -c "CREATE DATABASE hostal_cofee;"

# 3. Configurar .env (copiar de .env.example y ajustar)
cp .env.example .env
# IMPORTANTE: Generar un JWT_SECRET fuerte:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 4. Ejecutar migraciones
npx prisma migrate dev

# 5. Poblar base de datos
npm run db:seed

# 6. Iniciar servidor (con Vite embebido sirve la SPA y la API en :3001)
npm run dev
```

Alternativa desde la raíz del repositorio:

```bash
npm install          # dependencias del monorepo
npm run dev          # backend Express + Vite middleware en http://localhost:3001
npm run start:all    # backend en :3001 + frontend Vite en :5173
```

## URLs

- Aplicación (dev): http://localhost:3001 (SPA + API) y http://localhost:5173 (solo frontend)
- API Health: http://localhost:3001/api/health
- Prisma Studio: `npx prisma studio`

## Credenciales (configurar en .env)

| Rol     | Email                 | Contraseña                        |
| ------- | --------------------- | --------------------------------- |
| Admin   | admin@hostalcofee.com | (definir en .env ADMIN_PASSWORD)  |
| Cliente | cliente@mail.com      | (definir en .env CLIENT_PASSWORD) |

## Features

### Cliente

- Menú digital con filtros por categoría
- Carrito de compras persistente (localStorage)
- Reserva de mesas con selección visual y QR por mesa
- Checkout con WhatsApp (deep link `wa.me`) y Wompi
- Login/Registro con tokens de refresco

### Admin

- Dashboard con estadísticas y métricas
- CRUD completo de menú
- Gestión de pedidos en tiempo real (POS táctil con receipt)
- Gestión de reservas (confirmar/cancelar) y turnos
- Panel de pagos (Wompi) y reportes (diarios/semanales)
- QR codes de mesas

## Tests

```bash
npm run test            # server (Vitest, 164 tests)
npm run test:coverage   # server con cobertura (threshold 80%)
npm run test --prefix hostal-cofre/client   # frontend (Vitest, 25 tests)
npm run test:e2e        # E2E Playwright (requiere servidor en :3001)
npm run test:e2e:docs   # genera capturas en docs/screenshots
```

## Documentación del Proyecto

| Documento                                              | Descripción                                         |
| ------------------------------------------------------ | --------------------------------------------------- |
| [LICENSE](LICENSE)                                     | Licencia Propietaria DEVCO - GirMart-SDK            |
| [02-TRD.md](02-TRD.md)                                 | Requisitos técnicos, arquitectura y stack           |
| [06-PLAN-IMPLEMENTACION.md](06-PLAN-IMPLEMENTACION.md) | Plan de implementación y roadmap                    |
| [CONTRIBUTING.md](CONTRIBUTING.md)                     | Guía de contribución (normativa obligatoria)        |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)               | Código de conducta                                  |
| [CHANGELOG.md](CHANGELOG.md)                           | Historial de cambios                                |
| [SECURITY.md](SECURITY.md)                             | Política de seguridad y reporte de vulnerabilidades |
| [SECURITY-REPORT.md](SECURITY-REPORT.md)               | Informe de blindaje de seguridad (6 capas)          |
| [PRIVACY.md](PRIVACY.md)                               | Política de privacidad                              |
| [TERMS.md](TERMS.md)                                   | Términos de uso                                     |
| [deploy/README.md](deploy/README.md)                   | Guía de despliegue en producción (Windows)          |
| [e2e/README.md](e2e/README.md)                         | Cómo ejecutar los tests E2E                         |

---

## Estructura

```
.
├── hostal-cofre/
│   ├── client/              # React + Vite + Tailwind
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── context/     # Auth, Cart
│   │   │   └── services/    # api client (axios + refresh)
│   │   └── package.json
│   └── server/              # Node.js + Express + Prisma
│       ├── src/
│       │   ├── config/
│       │   ├── middleware/  # auth, sanitize, validation, errors, requestId, lockout
│       │   ├── routes/
│       │   ├── services/
│       │   └── utils/       # logger, metrics, seed
│       ├── prisma/
│       ├── tests/           # 164 tests (Vitest)
│       └── package.json
├── deploy/                  # Scripts de despliegue Windows (NSSM + Caddy)
├── e2e/                     # Tests E2E Playwright + capturas
├── docs/screenshots/        # Capturas de pantalla de la app
├── .github/workflows/ci.yml # CI: lint, tests, build, E2E
└── LICENSE
```

---

## Licencia

[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)

Copyright (c) 2026 **GirMart-SDK**. Todos los derechos reservados.

Este proyecto se distribuye bajo una **Licencia de Uso Propietario DEVCO - Versión Comercial**.
Está **PROHIBIDA** la redistribución, uso comercial o modificación sin autorización
expresa por escrito. Consulte el archivo [LICENSE](LICENSE) para los términos completos.
