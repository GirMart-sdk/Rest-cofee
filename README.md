# Hostal Cofee v2 - Fullstack Restaurant

![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee%20v2-brightgreen.svg)
![Versión](https://img.shields.io/badge/Versión-1.0.0-blue.svg)
![Licencia](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)
![Estado](https://img.shields.io/badge/Estado-Activo-success.svg)

---

Sistema completo de restaurante con React + Node.js + PostgreSQL.

## Stack

| Capa          | Tecnología                              |
| ------------- | --------------------------------------- |
| Frontend      | React 18 + Vite + TypeScript + Tailwind |
| Backend       | Node.js + Express + Prisma ORM          |
| Base de datos | PostgreSQL                              |
| Pagos         | Wompi (sandbox)                         |
| WhatsApp      | wa.me API                               |

## Seguridad (Capas 1-3 Blindaje)

| Capa       | Protección                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------------- |
| 1. Secrets | .gitignore, .env.example, JWT_SECRET validation (min 32 chars), env-based seed passwords                             |
| 2. Auth    | JWT HS256 algorithm locking, password policy (upper+lower+digit+special), bcrypt 12 rounds, timing attack protection |
| 3. Input   | Zod validation en todas las rutas, XSS sanitization middleware, error handler sanitizado, enum validation estricta   |

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- npm 9+

## Instalación Rápida

```bash
# 1. Instalar dependencias del servidor
cd server
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
npx tsx src/utils/seed.ts

# 6. Iniciar servidor
npm run dev
```

```bash
# 7. En otra terminal, instalar cliente
cd client
npm install

# 8. Iniciar frontend
npm run dev
```

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Prisma Studio: npx prisma studio

## Credenciales (configurar en .env)

| Rol     | Email                 | Contraseña                        |
| ------- | --------------------- | --------------------------------- |
| Admin   | admin@hostalcofee.com | (definir en .env ADMIN_PASSWORD)  |
| Cliente | cliente@mail.com      | (definir en .env CLIENT_PASSWORD) |

## Features

### Cliente

- Menú digital con filtros por categoría
- Carrito de compras persistente
- Reserva de mesas con selección visual
- Checkout con WhatsApp
- Login/Registro

### Admin

- Dashboard con estadísticas
- CRUD completo de menú
- Gestión de pedidos en tiempo real
- Gestión de reservas (confirmar/cancelar)
- Panel de pagos (Wompi, Nequi, Daviplata)

## Documentación del Proyecto

| Documento                                | Descripción                             |
| ---------------------------------------- | --------------------------------------- |
| [LICENSE](LICENSE)                       | Licencia GNU AGPL v3.0                  |
| [CONTRIBUTING.md](CONTRIBUTING.md)       | Guía para contribuidores                |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Código de conducta                      |
| [CHANGELOG.md](CHANGELOG.md)             | Historial de cambios                    |
| [SECURITY.md](SECURITY.md)               | Política de reporte de vulnerabilidades |
| [PRIVACY.md](PRIVACY.md)                 | Política de privacidad                  |
| [TERMS.md](TERMS.md)                     | Términos de uso                         |
| [SECURITY-REPORT.md](SECURITY-REPORT.md) | Informe de blindaje de seguridad        |

---

## Estructura

```
hostal-cofee/
├── client/          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── package.json
│
├── server/          # Node.js Backend
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/   # auth, sanitize, validation, errors
│   │   ├── routes/
│   │   └── utils/
│   ├── prisma/
│   └── package.json
│
└── README.md
```
