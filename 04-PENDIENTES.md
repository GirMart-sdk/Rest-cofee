# Backlog de Pendientes — Hostal Cofee v2

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee--v2-brightgreen.svg)](README.md)
![Tipo](https://img.shields.io/badge/Tipo-Backlog%20de%20Pendientes-red.svg)
[![Fuente](https://img.shields.io/badge/Fuente-Diagnóstico%20Integral-blue.svg)](03-DIAGNOSTICO.md)
![Actualizado](https://img.shields.io/badge/Actualizado-16%20Ago%202026-blue.svg)

---

## 1. Propósito

**Único documento fuente de verdad de lo que falta por corregir.** Consolida, deduplicados,
todos los hallazgos pendientes del diagnóstico: ciberseguridad (H), funcionalidad (U/E/D/G/DC)
y lógica/estructura (A). Los hallazgos ya resueltos **no** aparecen aquí (se registran en
`03-DIAGNOSTICO.md`).

- Cuando un hallazgo comparte causa con otro (ej. H2/A12), se fusiona en una sola entrada.
- Cada ítem conserva el/los ID original(es) para trazabilidad.
- Al corregir un ítem: marcarlo `✅ Resuelto` y moverlo (o eliminarlo) de este documento.

## 2. Resumen por severidad

| Prioridad | Conteo | ítems                                                                |
| --------- | ------ | -------------------------------------------------------------------- |
| Alta      | 5      | H2, H5, H6, U2, U4                                                   |
| Media     | 31     | H7–H14, U5–U7, U10, E3–E5, D1–D3, G1–G4, A5, A7–A10, A13–A16         |
| Baja      | 25     | H15–H22, U8, E7–E9, D4–D6, DC1–DC2, A17, A19, A21–A22, A25–A28       |
| Info      | 4      | E10, DC5, F1, F2                                                     |
| **Total** | **65** | (de los 88 hallazgos originales, con duplicados cruzados fusionados) |

---

## 3. Prioridad Alta

| ID(s)        | Hallazgo                                                                                                                                       | Ubicación                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **H2** / A12 | `trust proxy` sin configurar → rate limiting roto detrás de Caddy; `getClientIp` confía en `X-Forwarded-For` (IP spoofeable en `loginAttempt`) | `server/src/index.ts:34-45`; `routes/auth.ts:26-46,108-114`; `deploy/Caddyfile:23`        |
| **H5**       | `JWT_SECRET`: placeholders de plantilla pasan la validación de runtime (solo rechaza vacío / <32 chars)                                        | `server/src/config/index.ts:5-24`; `.env.example:16`; `deploy/.env.production.example:22` |
| **H6**       | Los tests de seguridad (`test:security`) **no se ejecutan en CI**; la afirmación documentada es falsa                                          | `.github/workflows/ci.yml:59-97`; `server/package.json:19`                                |
| **U2**       | "Para la mesa" envía `orderType:'mesa'` sin `tableId` ni selector de mesa → pedido sin mesa asignada                                           | `client/src/components/cart/CartDrawer.tsx:72-80`                                         |
| **U4** / E6  | 2FA rompe el login: el cliente no maneja `requiresTwoFactor` y muestra "Credenciales incorrectas"; 2FA/`change-password` sin UI                | `client/src/context/AuthContext.tsx:70-81`; `LoginPage.tsx:33`                            |

---

## 4. Prioridad Media

### 4.1 Seguridad (H)

| ID(s)   | Hallazgo                                                                                                         | Ubicación                                                                                      |
| ------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **H7**  | Anti-timing roto: el "dummy compare" usa un hash bcrypt inválido (≈0.01 ms vs ≈542 ms) → enumeración de usuarios | `server/src/routes/auth.ts:180-186`                                                            |
| **H8**  | Sanitización XSS por regex: evadible con encoding y muta datos (contraseñas)                                     | `server/src/middleware/sanitize.ts:3-14,37-45`                                                 |
| **H9**  | Errores que filtran detalles internos (`err.message`/`details`, CUIDs, body de Wompi)                            | `server/src/middleware/errors.ts:29-40`; `routes/payments.ts:41-54`                            |
| **H10** | Logs con datos sensibles: body completo de Wompi y IP de login spoofeable                                        | `server/src/routes/payments.ts:44-49,162-165`; `routes/auth.ts:186`                            |
| **H11** | Lockout solo por email → DoS a cuentas de terceros (5 intentos bloquean 15 min)                                  | `server/src/middleware/lockout.ts:5-35`; `routes/auth.ts:108-114,178,186`                      |
| **H12** | Pedidos anónimos sin restricción de abuso: spam de pedidos falsos + WhatsApp/SSE                                 | `server/src/routes/orders.ts:129-165,179-207`                                                  |
| **H13** | Contraseñas placeholder en plantillas y usadas como defaults en tests                                            | `.env.example:50,52`; `deploy/.env.production.example:55,57`; `tests/security.test.ts:182-184` |
| **H14** | `/refresh`, `/logout`, `/change-password` sin rate limit propio                                                  | `server/src/routes/auth.ts:366,404,427`                                                        |

### 4.2 Funcionalidad (U/E/D/G)

| ID(s)              | Hallazgo                                                                                                 | Ubicación                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **U5**             | `MesaPage` envía el email como teléfono → 400 si supera 20 chars                                         | `client/src/pages/MesaPage.tsx:141`                                                                                          |
| **U6**             | Login/Registro inconsistentes: `minLength={6}` vs política server (8+); errores de registro genéricos    | `client/src/pages/LoginPage.tsx:77`; `server/src/routes/auth.ts:50`                                                          |
| **U7**             | Dashboard con etiquetas engañosas ("Pedidos Totales"/"Ingresos Totales" usan reporte de hoy)             | `client/src/pages/admin/AdminDashboard.tsx:119,143`                                                                          |
| **U10**            | POS: nequi/daviplata/wompi se registran como venta sin confirmación de pago (`pending` para siempre)     | `client/src/pages/admin/AdminPOS.tsx`                                                                                        |
| **E3**             | `GET /api/reports/weekly` sin UI (reporte semanal)                                                       | `client/src/pages/admin/AdminReports.tsx:24`                                                                                 |
| **E4** / A11 / DC3 | `GET /api/orders/daily-sales` + `OrderService.getDailySales` duplican `ReportService.getDailyReport`     | `server/src/services/order.service.ts:185-237`; `report.service.ts:11-110`                                                   |
| **E5** / DC4       | `/api/audit` (logs de auditoría) sin página que los muestre                                              | `server/src/routes/audit.ts`                                                                                                 |
| **D1**             | Tarifas de delivery duplicadas (cliente 3000/5000/8000 vs servidor) → totales divergentes                | `client/src/context/CartContext.tsx:24-27`; `server/src/services/delivery.service.ts:8-27`                                   |
| **D2**             | Formato de moneda mezclado (`$precio` crudo, `.toFixed(2)`, `.toFixed(0)`, `.toLocaleString()`)          | Varios componentes cliente                                                                                                   |
| **D3** / A24       | Timezone inconsistente: `new Date().toISOString()` = UTC; en Colombia (UTC-5) el reporte/día se desplaza | `client/src/pages/admin/AdminReports.tsx:19`; `ReservationForm.tsx:113`; `report.service.ts:4-8`; `shift.service.ts:123-125` |
| **G1**             | Catches silenciosos `.catch(() => {})` → UX sin mensaje de error                                         | `MenuGrid.tsx:29`; `MesaPage.tsx:65`; `AdminPOS.tsx:41`; `DeliveryForm.tsx:26`                                               |
| **G2**             | `DeliveryForm` sin fallback: si falla la carga de zonas, queda deshabilitado sin error visible           | `client/src/components/cart/DeliveryForm.tsx`                                                                                |
| **G3** / A6        | Prisma P2003 (FK) sin handler → 500 en vez de 400                                                        | `server/src/middleware/errors.ts:12-22`                                                                                      |
| **G4**             | Errores de validación del server casi nunca mostrados (toast genérico)                                   | Varios componentes cliente                                                                                                   |

### 4.3 Lógica y estructura (A)

| ID(s)   | Hallazgo                                                                                                          | Ubicación                                                         |
| ------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **A5**  | Creación de pedido + actualización de turno sin `$transaction` → contadores inconsistentes                        | `server/src/services/order.service.ts:96-127`                     |
| **A7**  | Reservas públicas huérfanas: `POST /api/reservations` nunca pasa `userId`; cliente no-admin jamás ve sus reservas | `server/src/routes/reservations.ts:79-93`                         |
| **A8**  | Pedidos anónimos invisibles para su creador posterior (`userId: null` vs filtro por `userId`)                     | `server/src/routes/orders.ts`                                     |
| **A9**  | `AuthService` muerto; `routes/auth.ts` reimplementa la lógica con prisma directo; expiraciones divergentes        | `server/src/services/auth.service.ts`; `routes/auth.ts:135-453`   |
| **A10** | `MenuService` muerto; `routes/menu.ts` accede a prisma directo                                                    | `server/src/services/menu.service.ts`; `routes/menu.ts:46,82,103` |
| **A13** | En producción `/api/*` inexistente devuelve `index.html` con 200; sin 404 JSON                                    | `server/src/index.ts:125-131`                                     |
| **A14** | Webhook Wompi no idempotente: un evento PENDING posterior marca `failed`; reenvíos reprocesan                     | `server/src/routes/payments.ts:175`                               |
| **A15** | Ventana de reuso en rotación de refresh token (dos peticiones concurrentes → dos pares válidos)                   | `server/src/routes/auth.ts:366-402`                               |
| **A16** | `sanitize` global muta el body del webhook antes de la verificación de firma → puede romper el digest             | `server/src/index.ts:51`; `middleware/sanitize.ts:8-14`           |

---

## 5. Prioridad Baja

### 5.1 Seguridad (H)

| ID(s)         | Hallazgo                                                                                   | Ubicación                                                          |
| ------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| **H15**       | Access token en `localStorage` (legible por JS; refresh sí en cookie `httpOnly`)           | `client/src/services/api.ts:3-11`; `context/AuthContext.tsx:16-24` |
| **H16**       | `/api/payments/status` expone configuración interna (`baseUrl`, flags de claves)           | `server/src/routes/payments.ts:103-115`                            |
| **H17** / A20 | `upgradeInsecureRequests: isDev ? [] : []` siempre vacío → never se envía                  | `server/src/index.ts:68`                                           |
| **H18**       | `X-Request-Id` acepta el valor del cliente en vez de generar UUID propio                   | `server/src/middleware/requestId.ts:5`                             |
| **H19**       | Backups de BD sin cifrado ni ACL específicas                                               | `deploy/backup-db.ps1:142-160`                                     |
| **H20**       | 2FA: `setup` guarda el secreto antes de habilitar; `enable` sin re-autenticación           | `server/src/routes/auth.ts:273-292,300-326,335-363`                |
| **H21**       | Webhook de pagos cubierto por el rate limit global (eventos de Wompi rechazables)          | `server/src/index.ts:39`; `routes/payments.ts:150`                 |
| **H22**       | Checksum del webhook no en tiempo constante (`digest === expected`) y sobre JSON re-parsed | `server/src/routes/payments.ts:143-147`                            |

### 5.2 Funcionalidad (U/E/D/DC)

| ID(s)   | Hallazgo                                                                            | Ubicación                                       |
| ------- | ----------------------------------------------------------------------------------- | ----------------------------------------------- |
| **U8**  | Mesas: botones Editar/Eliminar solo en hover (`opacity-0`) → inaccesibles en táctil | `client/src/pages/admin/AdminTables.tsx:143`    |
| **E7**  | `GET /api/orders/table/:tableNumber` sin consumir (público)                         | `server/src/routes/orders.ts`                   |
| **E8**  | `/api/shifts/by-period`, `/api/shifts/:id`, `/api/shifts/:id/summary` sin consumir  | `server/src/routes/shifts.ts`                   |
| **E9**  | `GET /api/tables` y `GET /api/tables/:number` sin consumir                          | `server/src/routes/tables.ts`                   |
| **D4**  | Types vs schema: `MenuItem.image`, `Order.items`, `Table.available` nunca poblada   | `client/src/types/index.ts`; schema Prisma      |
| **D5**  | `description` opcional en Zod (`routes/menu.ts:29`) pero `NOT NULL` en BD → 500     | `server/src/routes/menu.ts:29`; schema Prisma   |
| **D6**  | `Envío ({deliveryZone})` muestra el nombre interno crudo en vez del label           | `client/src/components/cart/CartDrawer.tsx:338` |
| **DC1** | `useLocalStorage` / `useDebounce` solo usados en sus tests                          | `client/src/hooks/`                             |
| **DC2** | Componente `Badge` solo usado en tests                                              | `client/src/components/ui/index.tsx`            |

### 5.3 Lógica y estructura (A)

| ID(s)   | Hallazgo                                                                 | Ubicación                                                    |
| ------- | ------------------------------------------------------------------------ | ------------------------------------------------------------ |
| **A17** | Múltiples turnos abiertos sin control; `getCurrent` devuelve array       | `server/src/services/shift.service.ts:47-65`                 |
| **A19** | `config.jwtRefreshExpiresIn` sin uso; expiración hardcodeada             | `server/src/routes/auth.ts:78`; `utils/cookies.ts:15`        |
| **A21** | Normalización de métricas no agrupa IDs cuid (solo hex ≥24)              | `server/src/utils/metrics.ts:60`                             |
| **A22** | SSE sin límite de clientes conectados                                    | `server/src/utils/events.ts:7-13`; `routes/orders.ts:88-106` |
| **A25** | Cierre de turno sin cuadre de caja: `closingCash` arbitrario sin arqueo  | `server/src/services/shift.service.ts:67-99`                 |
| **A26** | Logger registra la query string completa                                 | `server/src/middleware/requestLogger.ts:14`                  |
| **A27** | Límite de body 10 kb puede rechazar pedidos legítimos; 413 no mapeado    | `server/src/index.ts:48`; `middleware/errors.ts`             |
| **A28** | Rate limit global muy restrictivo (100/15 min) detrás de IPs compartidas | `server/src/index.ts:34-40`                                  |

---

## 6. Info

| ID(s)   | Hallazgo                                                                                          | Ubicación                                          |
| ------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **E10** | `/api/metrics` y `/api/health` sin consumir por el cliente                                        | `server/src/index.ts`                              |
| **DC5** | `server/dist/` versionado en el repo (artefactos de build)                                        | `hostal-cofre/server/dist/`                        |
| **F1**  | Feature declarada sin cumplir: "Panel de pagos Wompi (admin)" — no existe ruta ni entrada de menú | `README.md:125`                                    |
| **F2**  | Reservas sin validación de disponibilidad (no chequea doble reserva)                              | `server/src/services/reservation.service.ts:34-68` |

---

## 7. Archivos relacionados (información general)

| Documento            | Rol                                                              |
| -------------------- | ---------------------------------------------------------------- |
| `03-DIAGNOSTICO.md`  | Diagnóstico integral: contexto, hallazgos resueltos y fortalezas |
| `SECURITY-REPORT.md` | Informe histórico de blindaje (16 mitigaciones, 08-08-2026)      |
| `SECURITY.md`        | Política y buenas prácticas de seguridad del proyecto            |
| `02-TRD.md`          | Especificación de requisitos técnicos (spec)                     |
| `CHANGELOG.md`       | Historial de versiones y cambios por release                     |
| `README.md`          | Descripción general del proyecto                                 |
