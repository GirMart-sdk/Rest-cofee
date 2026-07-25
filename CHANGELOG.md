# Changelog

Todos los cambios notables en **Hostal Cofee** se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/),
y este proyecto adheres a [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

### Added

- Documentación del proyecto (LICENSE, CONTRIBUTING, CODE_OF_CONDUCT)
- Políticas de uso, privacidad y seguridad
- Guía de contribución

### Changed

- N/A

### Fixed

- N/A

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
- Tests automatizados de seguridad (34 tests)

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
- Capa 6: Tests Automatizados (34 tests de seguridad)

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

[Unreleased]: https://github.com/TU_USUARIO/REST-COFEE/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/TU_USUARIO/REST-COFEE/releases/tag/v1.0.0
[0.1.0]: https://github.com/TU_USUARIO/REST-COFEE/releases/tag/v0.1.0
