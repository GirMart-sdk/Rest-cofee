# Backlog de Pendientes — Hostal Cofee v2

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee--v2-brightgreen.svg)](README.md)
![Estado](https://img.shields.io/badge/Estado-Completado-brightgreen.svg)
![Tipo](https://img.shields.io/badge/Tipo-Backlog%20de%20Pendientes-blue.svg)
[![Fuente](https://img.shields.io/badge/Fuente-Diagnóstico%20Integral-blue.svg)](03-DIAGNOSTICO.md)
![Actualizado](https://img.shields.io/badge/Actualizado-16%20Ago%202026-blue.svg)

---

## 1. Estado

**El backlog quedó completamente resuelto: 65/65 ítems ✅.** Este documento se convierte en el
**registro de resolución** de los hallazgos pendientes del diagnóstico integral
(ciberseguridad H, funcionalidad U/E/D/G/DC y lógica/estructura A). Cada fila indica la corrección
aplicada y su ubicación actual. Los hallazgos ya resueltos antes de este ciclo se registran en
`03-DIAGNOSTICO.md`.

- Cuando un hallazgo compartía causa con otro (ej. H2/A12), se fusionó en una sola entrada.
- Cada ítem conserva el/los ID original(es) para trazabilidad.

## 2. Resumen por severidad

| Prioridad | Conteo | Estado       |
| --------- | ------ | ------------ |
| Alta      | 5      | 5/5 ✅       |
| Media     | 31     | 31/31 ✅     |
| Baja      | 25     | 25/25 ✅     |
| Info      | 4      | 4/4 ✅       |
| **Total** | **65** | **65/65 ✅** |

---

## 3. Prioridad Alta

| ID(s)        | Hallazgo                                                                                                                                       | Corrección aplicada                                                                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **H2** / A12 | `trust proxy` sin configurar → rate limiting roto detrás de Caddy; `getClientIp` confía en `X-Forwarded-For` (IP spoofeable en `loginAttempt`) | ✅ `app.set('trust proxy', config.nodeEnv === 'production' ? 1 : false)` (`server/src/index.ts:35`); IP del cliente derivada de la fuente de confianza       |
| **H5**       | `JWT_SECRET`: placeholders de plantilla pasan la validación de runtime (solo rechaza vacío / <32 chars)                                        | ✅ Validación endurecida: rechaza placeholders/secretos de ejemplo; `.env.example` y `deploy/.env.production.example` con instrucciones                      |
| **H6**       | Los tests de seguridad (`test:security`) **no se ejecutan en CI**; la afirmación documentada es falsa                                          | ✅ CI ejecuta `npm run test:security` (`.github/workflows/ci.yml`); suite en verde (43/43)                                                                   |
| **U2**       | "Para la mesa" envía `orderType:'mesa'` sin `tableId` ni selector de mesa → pedido sin mesa asignada                                           | ✅ CartDrawer con selector de mesa; envía `tableId` al crear el pedido                                                                                       |
| **U4** / E6  | 2FA rompe el login: el cliente no maneja `requiresTwoFactor` y muestra "Credenciales incorrectas"; 2FA/`change-password` sin UI                | ✅ Flujo `requiresTwoFactor` + `pendingToken` (`server/src/routes/auth.ts:176-180`); UI de 2FA en LoginPage y configuración/`change-password` en AccountPage |

---

## 4. Prioridad Media

### 4.1 Seguridad (H)

| ID(s)   | Hallazgo                                                                                                         | Corrección aplicada                                                                                         |
| ------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **H7**  | Anti-timing roto: el "dummy compare" usa un hash bcrypt inválido (≈0.01 ms vs ≈542 ms) → enumeración de usuarios | ✅ Dummy compare con hash bcrypt válido para que el costo coincida                                          |
| **H8**  | Sanitización XSS por regex: evadible con encoding y muta datos (contraseñas)                                     | ✅ Campos de credenciales excluidos (`SKIP_FIELDS`, `middleware/sanitize.ts:9`); cobertura también en query |
| **H9**  | Errores que filtran detalles internos (`err.message`/`details`, CUIDs, body de Wompi)                            | ✅ Errores normalizados sin detalles internos (`middleware/errors.ts`)                                      |
| **H10** | Logs con datos sensibles: body completo de Wompi y IP de login spoofeable                                        | ✅ Logs sin body de Wompi y sin IP no confiable                                                             |
| **H11** | Lockout solo por email → DoS a cuentas de terceros (5 intentos bloquean 15 min)                                  | ✅ Lockout por email **e IP** (`middleware/lockout.ts`)                                                     |
| **H12** | Pedidos anónimos sin restricción de abuso: spam de pedidos falsos + WhatsApp/SSE                                 | ✅ Rate limiter específico para creación de pedidos anónimos                                                |
| **H13** | Contraseñas placeholder en plantillas y usadas como defaults en tests                                            | ✅ Placeholders eliminados; tests usan variables de entorno                                                 |
| **H14** | `/refresh`, `/logout`, `/change-password` sin rate limit propio                                                  | ✅ Limiters propios para cada ruta (`routes/auth.ts:28-31`)                                                 |

### 4.2 Funcionalidad (U/E/D/G)

| ID(s)              | Hallazgo                                                                                                 | Corrección aplicada                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **U5**             | `MesaPage` envía el email como teléfono → 400 si supera 20 chars                                         | ✅ Campo teléfono validado y formateado antes de enviar                                          |
| **U6**             | Login/Registro inconsistentes: `minLength={6}` vs política server (8+); errores de registro genéricos    | ✅ `minLength={8}` en cliente; errores del servidor mostrados                                    |
| **U7**             | Dashboard con etiquetas engañosas ("Pedidos Totales"/"Ingresos Totales" usan reporte de hoy)             | ✅ Etiquetas corregidas (reporte de hoy) en `AdminDashboard.tsx`                                 |
| **U10**            | POS: nequi/daviplata/wompi se registran como venta sin confirmación de pago (`pending` para siempre)     | ✅ Flujo de pago con confirmación: wompi transacción, nequi/daviplata registran estado explícito |
| **E3**             | `GET /api/reports/weekly` sin UI (reporte semanal)                                                       | ✅ Vista semanal en `AdminReports.tsx` con `useLocalStorage` para la pestaña activa              |
| **E4** / A11 / DC3 | `GET /api/orders/daily-sales` + `OrderService.getDailySales` duplican `ReportService.getDailyReport`     | ✅ Eliminada duplicación; `ReportService` es la única fuente del reporte diario                  |
| **E5** / DC4       | `/api/audit` (logs de auditoría) sin página que los muestre                                              | ✅ Página `AdminAudit.tsx` con listado paginado y filtros                                        |
| **D1**             | Tarifas de delivery duplicadas (cliente 3000/5000/8000 vs servidor) → totales divergentes                | ✅ `CartContext` consume `GET /orders/zones` con `FALLBACK_ZONES`; única fuente de tarifas       |
| **D2**             | Formato de moneda mezclado (`$precio` crudo, `.toFixed(2)`, `.toFixed(0)`, `.toLocaleString()`)          | ✅ `formatCOP` centralizado (`client/src/utils/format.ts`)                                       |
| **D3** / A24       | Timezone inconsistente: `new Date().toISOString()` = UTC; en Colombia (UTC-5) el reporte/día se desplaza | ✅ Fechas en zona local (`toLocalDateString`) en reportes, reservas y cierre de turno            |
| **G1**             | Catches silenciosos `.catch(() => {})` → UX sin mensaje de error                                         | ✅ Mensajes de error visibles en todos los flujos                                                |
| **G2**             | `DeliveryForm` sin fallback: si falla la carga de zonas, queda deshabilitado sin error visible           | ✅ Fallback con error visible y re-intento                                                       |
| **G3** / A6        | Prisma P2003 (FK) sin handler → 500 en vez de 400                                                        | ✅ Mapeo P2003 → 400 en `middleware/errors.ts`                                                   |
| **G4**             | Errores de validación del server casi nunca mostrados (toast genérico)                                   | ✅ `getErrorMessage(error, fallback)` muestra los errores estructurados del server               |

### 4.3 Lógica y estructura (A)

| ID(s)   | Hallazgo                                                                                                          | Corrección aplicada                                                                                        |
| ------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **A5**  | Creación de pedido + actualización de turno sin `$transaction` → contadores inconsistentes                        | ✅ Creación de pedido con `$transaction`                                                                   |
| **A7**  | Reservas públicas huérfanas: `POST /api/reservations` nunca pasa `userId`; cliente no-admin jamás ve sus reservas | ✅ Reservas asocian `userId`; cliente autenticado consulta sus reservas                                    |
| **A8**  | Pedidos anónimos invisibles para su creador posterior (`userId: null` vs filtro por `userId`)                     | ✅ Pedidos anónimos recuperables por su creador (identificador de sesión)                                  |
| **A9**  | `AuthService` muerto; `routes/auth.ts` reimplementa la lógica con prisma directo; expiraciones divergentes        | ✅ `server/src/services/auth.service.ts` eliminado (código muerto); lógica consolidada en `routes/auth.ts` |
| **A10** | `MenuService` muerto; `routes/menu.ts` accede a prisma directo                                                    | ✅ `MenuService` en uso (`routes/menu.ts:4,11`)                                                            |
| **A13** | En producción `/api/*` inexistente devuelve `index.html` con 200; sin 404 JSON                                    | ✅ 404 JSON para rutas `/api` inexistentes (`index.ts:110`)                                                |
| **A14** | Webhook Wompi no idempotente: un evento PENDING posterior marca `failed`; reenvíos reprocesan                     | ✅ Webhook idempotente: no revierte `paid` y no reprocesa (`payments.ts:236`)                              |
| **A15** | Ventana de reuso en rotación de refresh token (dos peticiones concurrentes → dos pares válidos)                   | ✅ Rotación con detección de reuso; token rotado se invalida                                               |
| **A16** | `sanitize` global muta el body del webhook antes de la verificación de firma → puede romper el digest             | ✅ Webhook exento de `sanitize` (`middleware/sanitize.ts:44`)                                              |

---

## 5. Prioridad Baja

### 5.1 Seguridad (H)

| ID(s)         | Hallazgo                                                                                   | Corrección aplicada                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| **H15**       | Access token en `localStorage` (legible por JS; refresh sí en cookie `httpOnly`)           | ✅ Access token en memoria (`client/src/services/api.ts`); sesión se restaura vía refresh cookie httpOnly |
| **H16**       | `/api/payments/status` expone configuración interna (`baseUrl`, flags de claves)           | ✅ Endpoint solo admin y solo expone `mode` + `publicKeyConfigured` (`payments.ts:124-129`)               |
| **H17** / A20 | `upgradeInsecureRequests: isDev ? [] : []` siempre vacío → never se envía                  | ✅ `upgradeInsecureRequests: []` solo en producción (`index.ts:75`)                                       |
| **H18**       | `X-Request-Id` acepta el valor del cliente en vez de generar UUID propio                   | ✅ `crypto.randomUUID()` propio; se ignora el valor del cliente (`middleware/requestId.ts:7-8`)           |
| **H19**       | Backups de BD sin cifrado ni ACL específicas                                               | ✅ `deploy/backup-db.ps1` cifra el respaldo y aplica ACL                                                  |
| **H20**       | 2FA: `setup` guarda el secreto antes de habilitar; `enable` sin re-autenticación           | ✅ Secreto solo persiste al habilitar; `enable` requiere re-autenticación                                 |
| **H21**       | Webhook de pagos cubierto por el rate limit global (eventos de Wompi rechazables)          | ✅ Webhook exento del limiter global (`index.ts:44`)                                                      |
| **H22**       | Checksum del webhook no en tiempo constante (`digest === expected`) y sobre JSON re-parsed | ✅ Verificación con `crypto.timingSafeEqual` sobre el body crudo (`payments.ts:165`)                      |

### 5.2 Funcionalidad (U/E/D/DC)

| ID(s)   | Hallazgo                                                                            | Corrección aplicada                                                                                  |
| ------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **U8**  | Mesas: botones Editar/Eliminar solo en hover (`opacity-0`) → inaccesibles en táctil | ✅ Botones siempre visibles en `AdminTables.tsx`                                                     |
| **E7**  | `GET /api/orders/table/:tableNumber` sin consumir (público)                         | ✅ `MesaPage` muestra banner "N pedido(s) activo(s) en esta mesa"                                    |
| **E8**  | `/api/shifts/by-period`, `/api/shifts/:id`, `/api/shifts/:id/summary` sin consumir  | ✅ `AdminShifts` consume `/shifts/:id/summary` en el modal de resumen                                |
| **E9**  | `GET /api/tables` y `GET /api/tables/:number` sin consumir                          | ✅ CartDrawer consume `GET /tables`; `MesaPage` valida la mesa con `GET /tables/:number`             |
| **D4**  | Types vs schema: `MenuItem.image`, `Order.items`, `Table.available` nunca poblada   | ✅ Types alineados con el schema Prisma                                                              |
| **D5**  | `description` opcional en Zod (`routes/menu.ts:29`) pero `NOT NULL` en BD → 500     | ✅ Esquema y BD consistentes (descripción opcional con default)                                      |
| **D6**  | `Envío ({deliveryZone})` muestra el nombre interno crudo en vez del label           | ✅ Muestra el label de la zona (`CartDrawer.tsx`)                                                    |
| **DC1** | `useLocalStorage` / `useDebounce` solo usados en sus tests                          | ✅ `useDebounce` en AdminOrders (buscador); `useLocalStorage` en AdminReports (vista diaria/semanal) |
| **DC2** | Componente `Badge` solo usado en tests                                              | ✅ `Badge` usado para el estado del pago en `AdminPayments.tsx`                                      |

### 5.3 Lógica y estructura (A)

| ID(s)   | Hallazgo                                                                 | Corrección aplicada                                                        |
| ------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| **A17** | Múltiples turnos abiertos sin control; `getCurrent` devuelve array       | ✅ Turno único abierto garantizado; `getCurrent` tipado para un solo turno |
| **A19** | `config.jwtRefreshExpiresIn` sin uso; expiración hardcodeada             | ✅ `config.jwtRefreshExpiresIn` utilizado para la cookie y el JWT          |
| **A21** | Normalización de métricas no agrupa IDs cuid (solo hex ≥24)              | ✅ Detección de IDs cuid en la normalización (`utils/metrics.ts`)          |
| **A22** | SSE sin límite de clientes conectados                                    | ✅ Límite de conexiones SSE (`utils/events.ts`)                            |
| **A25** | Cierre de turno sin cuadre de caja: `closingCash` arbitrario sin arqueo  | ✅ Cierre de turno con arqueo/validación de caja                           |
| **A26** | Logger registra la query string completa                                 | ✅ Query string no se registra completa (`middleware/requestLogger.ts`)    |
| **A27** | Límite de body 10 kb puede rechazar pedidos legítimos; 413 no mapeado    | ✅ Body limit 32 kb (`index.ts:55`) y respuesta 413 correcta               |
| **A28** | Rate limit global muy restrictivo (100/15 min) detrás de IPs compartidas | ✅ 300 req/15 min en producción y 2000 en dev (`index.ts:37-47`)           |

---

## 6. Info

| ID(s)   | Hallazgo                                                                                          | Corrección aplicada                                                                              |
| ------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **E10** | `/api/metrics` y `/api/health` sin consumir por el cliente                                        | ✅ Documentados como endpoints de monitoreo/operación (no de UI)                                 |
| **DC5** | `server/dist/` versionado en el repo (artefactos de build)                                        | ✅ `hostal-cofre/server/dist` en `.gitignore`; 0 archivos trackeados                             |
| **F1**  | Feature declarada sin cumplir: "Panel de pagos Wompi (admin)" — no existe ruta ni entrada de menú | ✅ `AdminPayments.tsx` + entrada "Pagos" en `AdminSidebar` (`/admin/pagos`); `GET /api/payments` |
| **F2**  | Reservas sin validación de disponibilidad (no chequea doble reserva)                              | ✅ Validación de doble reserva en `reservation.service.ts`                                       |

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
