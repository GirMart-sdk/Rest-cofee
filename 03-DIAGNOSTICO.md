# Diagnóstico Integral — Hostal Cofee v2

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee--v2-brightgreen.svg)](README.md)
![Diagnóstico](https://img.shields.io/badge/Diagnóstico-Integral-blue.svg)
[![Seguridad](https://img.shields.io/badge/Seguridad-22%20Hallazgos-red.svg)](03-DIAGNOSTICO.md)
[![Funcionalidad](https://img.shields.io/badge/Funcionalidad-38%20Hallazgos-orange.svg)](03-DIAGNOSTICO.md)
[![Estructura](https://img.shields.io/badge/Estructura-28%20Hallazgos-blue.svg)](03-DIAGNOSTICO.md)

---

## 1. Propósito

Documento de **diagnóstico del estado actual** del proyecto Hostal Cofee v2, orientado a
evaluar su madurez como **prototipo MVP**. No contiene pasos de implementación ni fechas:
describe, punto por punto, la situación real del sistema en ciberseguridad, funcionalidad e
inconsistencias, y lógica/estructura, para tener la información general necesaria antes de
decidir cualquier iteración.

**Método:** auditoría de solo lectura verificada contra el código actual (referencias
`archivo:línea`). No se modificó ningún archivo.

---

## 2. Resumen ejecutivo

> **Estado de resolución (2026-08-16):** los hallazgos que bloqueaban el MVP se
> corrigieron en esta iteración. Se mantiene el listado completo del diagnóstico con su
> severidad original para trazabilidad; los resueltos están marcados ✅.

| Ámbito              | Hallazgos   | Críticos | Altos  | Medios | Bajos  |
| ------------------- | ----------- | -------- | ------ | ------ | ------ |
| Ciberseguridad      | 22 (H1–H22) | 1        | 5      | 8      | 8      |
| Funcionalidad       | 38          | 1        | 5      | 20     | 10     |
| Lógica y estructura | 28 (A1–A28) | 0        | 4      | 12     | 12     |
| **Total**           | **88**      | **2**    | **14** | **40** | **30** |

### 2.1 Hallazgos resueltos en esta iteración

| Hallazgo | Severidad | Corrección aplicada                                                                                                                                                                         |
| -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ H1    | Crítica   | Dominio Wompi corregido a `https://sandbox.wompi.co/v1` / `https://production.wompi.co/v1` (config, `.env.example`, deploy)                                                                 |
| ✅ H3    | Alta      | `create-transaction` recibe solo `orderId` (el monto lo calcula el servidor); el webhook verifica `amount_in_cents` contra `order.total` y rechaza discrepancias (`paymentsAmountMismatch`) |
| ✅ H4    | Alta      | `GET /api/orders/table/:tableNumber` sanea PII vía `toPublicOrder` y valida el parámetro (1–999)                                                                                            |
| ✅ A1    | Alta      | `GET /api/tables` ya no expone `reservations` ni PII de pedidos                                                                                                                             |
| ✅ A2    | Alta      | Pedidos por mesa sin PII + parámetro validado (coincide con H4)                                                                                                                             |
| ✅ A4    | Alta      | `GET /api/tables/:number` sin PII de pedidos + parámetro validado                                                                                                                           |
| ✅ U1    | Crítica   | Dirección y zona de entrega obligatorias para `domicilio` (server + cliente controlado)                                                                                                     |
| ✅ U3    | Alta      | Flujo `out_for_delivery → delivered` en `AdminOrders`                                                                                                                                       |
| ✅ E1    | Alta      | El cliente inicia el cobro Wompi tras crear la orden (`POST /payments/create-transaction` + apertura del link)                                                                              |
| ✅ E2    | Alta      | Botón "Marcar Pagado" en admin consume `PATCH /orders/:id/payment`                                                                                                                          |
| ✅ A18   | Baja      | Esquema de creación de pedidos exige dirección y zona en `domicilio` (coincide con U1)                                                                                                      |
| ✅ A23   | Baja      | `parseInt` de params reemplazado por validación Zod + coerción en rutas públicas                                                                                                            |

**Conclusión general:** la base técnica es sólida (tests, CI, seguridad en profundidad,
arquitectura en capas), pero el sistema aún no alcanza el umbral de **MVP funcional**:
existen flujos de negocio rotos (pedidos a domicilio sin dirección, domicilios que no pueden
marcarse entregados), la integración de pagos no está conectada al cliente y hay un endpoint
público que expone datos personales. El resto del conjunto es deuda de calidad que no bloquea
la operación básica.

---

## 3. Diagnóstico de ciberseguridad (punto por punto y por capas)

### 3.1 Resumen por severidad

| Severidad | Conteo | Hallazgos |
| --------- | ------ | --------- |
| Crítica   | 1      | H1        |
| Alta      | 5      | H2–H6     |
| Media     | 8      | H7–H14    |
| Baja      | 8      | H15–H22   |

### 3.2 Hallazgos detallados

#### H1 — Dominio base de Wompi incorrecto (`wompi.su` en vez de `wompi.co`) ✅ Resuelto

- **Severidad:** Crítica | **Capa:** Integraciones externas
- **Ubicación:** `server/src/config/index.ts:26-29`; `server/.env.example:31`; `deploy/.env.production.example:40`; `deploy/README.md:156`
- **Descripción:** `wompiBaseUrls = { sandbox: 'https://api-sandbox.wompi.su/v1', production: 'https://api.wompi.su/v1' }`. El dominio oficial de Wompi Colombia es `sandbox.wompi.co` / `production.wompi.co`. El TLD `.su` no pertenece a Wompi.
- **Impacto:** Los cobros se envían a un host no controlado por Wompi. En sandbox la integración nunca funciona; en producción, si el `.su` está en manos de un tercero, se exponen las transacciones y los payloads firmados con la clave privada de pagos.
- **Corrección:** URLs base corregidas a `https://sandbox.wompi.co/v1` y `https://production.wompi.co/v1` en `server/src/config/index.ts`, `.env.example`, `deploy/.env.production.example` y `deploy/README.md`.

#### H2 — `trust proxy` sin configurar → rate limiting roto detrás de Caddy

- **Severidad:** Alta | **Capa:** Red/Transporte
- **Ubicación:** `server/src/index.ts:34-40,45`; `server/src/routes/auth.ts:26-46`; `deploy/Caddyfile:23`
- **Descripción:** No existe `app.set('trust proxy', ...)`. El despliegue documentado usa Caddy como proxy inverso, que inyecta `X-Forwarded-For`; `express-rate-limit@7` rechaza el header o toma `127.0.0.1` para todos.
- **Impacto:** En producción todos los usuarios comparten una única bucket: el `authLimiter` (10/15 min) y el limiter global (100/15 min) se agotan entre todos los usuarios combinados → denegación de servicio de login. Las IPs registradas en auditoría quedan como `::ffff:127.0.0.1`.

#### H3 — Webhook de pagos sin verificación de monto ✅ Resuelto

- **Severidad:** Alta | **Capa:** Aplicación
- **Ubicación:** `server/src/routes/payments.ts:150-214`; `:14-27,59-86`
- **Descripción:** El webhook valida la firma pero solo hace match por `paymentId`/`reference`/`receiptNumber` y marca la orden `paid` sin comparar `amount_in_cents` contra `order.total`. `create-transaction` acepta `amount_in_cents` y `reference` aportados por el cliente.
- **Impacto:** Un cliente puede crear una transacción propia con `reference` = un `receiptNumber` existente (`HC-…` predecible) y pagar 1 COP; el webhook marca la orden como pagada. Fraude de "pago mínimo" que corrompe la contabilidad.
- **Corrección:** `create-transaction` recibe solo `orderId` y calcula `amount_in_cents = Math.round(order.total * 100)`; el webhook verifica el monto y, ante discrepancias, incrementa la métrica `paymentsAmountMismatch` sin marcar la orden como pagada.

#### H4 — Exposición de datos personales en `GET /api/orders/table/:tableNumber` ✅ Resuelto

- **Severidad:** Alta | **Capa:** Datos/Privacidad
- **Ubicación:** `server/src/routes/orders.ts:77-81`; `server/src/services/order.service.ts:156-168`
- **Descripción:** Endpoint público sin autenticación que devuelve las órdenes activas de una mesa con todos los campos escalares: `customerName`, `customerPhone`, `customerEmail`, `address`, `deliveryNotes`, `receiptNumber`. Los números de mesa son enumerables (1–999).
- **Impacto:** Cualquier persona puede enumerar mesas y obtener nombres, teléfonos, emails y direcciones de clientes.
- **Corrección:** La respuesta pasa por `toPublicOrder` (`server/src/utils/public-order.ts`), que elimina los campos personales, y el parámetro se valida con Zod (entero 1–999).

#### H5 — `JWT_SECRET`: los placeholders conocidos pasan la validación en runtime

- **Severidad:** Alta | **Capa:** Config/Operación
- **Ubicación:** `server/src/config/index.ts:5-24`; `server/.env.example:16`; `deploy/.env.production.example:22`
- **Descripción:** `getJwtSecret()` solo rechaza vacío, `'fallback-secret'` o <32 chars. Los placeholders de plantilla (`CHANGE_ME_TO_A_STRONG_RANDOM_SECRET_MIN_32_CHARS`, `REEMPLAZA_ESTE_SECRETO_POR_UNO_REAL_DE_64_CARACTERES_HEX`) superan la validación de longitud. `deploy.ps1:236` los detecta, pero el runtime no.
- **Impacto:** Un despliegue manual/docker con la plantilla arranca con secreto público → cualquier atacante forja JWTs de admin (acceso total).

#### H6 — Los tests de seguridad NO se ejecutan en CI

- **Severidad:** Alta | **Capa:** Config/Operación
- **Ubicación:** `.github/workflows/ci.yml:59-97`; `server/package.json:19`; `SECURITY-REPORT.md:33`
- **Descripción:** `SECURITY-REPORT.md` afirma que "cada PR ejecuta los tests de seguridad", pero `test:security` no aparece en ningún job de CI.
- **Impacto:** La suite de 42 tests de seguridad es una garantía documental, no real: un PR que rompa seguridad no rompería el pipeline.

#### H7 — Protección anti-timing inefectiva → enumeración de usuarios

- **Severidad:** Media | **Capa:** Autenticación/Autorización
- **Ubicación:** `server/src/routes/auth.ts:180-186`
- **Descripción:** El "dummy compare" usa `'$2a$10$invalidhash...'`, que no es un hash bcrypt válido. Medido: dummy ≈ 0.01 ms vs hash real ≈ 542 ms.
- **Impacto:** Un atacante distingue emails registrados vs no registrados por latencia. La mitigación #9 de SECURITY-REPORT.md ("Timing attacks — mitigado") está rota.

#### H8 — Sanitización XSS por regex: evadible y muta datos

- **Severidad:** Media | **Capa:** Aplicación
- **Ubicación:** `server/src/middleware/sanitize.ts:3-14,37-45`
- **Descripción:** Filtrado reactivo por regex evadible con encoding (`<scr<script>ipt>`, entidades HTML). Además muta TODO el body: una contraseña como `Pass<1!` se almacena como `Pass1!`.
- **Impacto:** La defensa XSS real descansa solo en el escape de React; el middleware da falsa sensación de seguridad y corrompe datos silenciosamente.

#### H9 — Errores que filtran detalles internos

- **Severidad:** Media | **Capa:** Aplicación
- **Ubicación:** `server/src/middleware/errors.ts:29-40`; `server/src/routes/payments.ts:41-54`
- **Descripción:** El error handler devuelve `err.message`/`err.details` tal cual; `wompiFetch` inyecta el body de Wompi en `details`; los errores de "not found" exponen los CUIDs internos de items.
- **Impacto:** Fuga de estructura interna (IDs, formato Wompi) útil para escalar un ataque.

#### H10 — Logs con datos potencialmente sensibles

- **Severidad:** Media | **Capa:** Datos/Privacidad
- **Ubicación:** `server/src/routes/payments.ts:44-49,162-165`; `server/src/routes/auth.ts:186`
- **Descripción:** El body completo de respuesta de Wompi se vuelca a log, y la IP de los intentos de login es spoofeable (ver H2/H11). Contradice la sección 11.3 de SECURITY.md ("NUNCA loguear datos de pago").
- **Impacto:** PII/datos de pago persistidos en disco en claro.

#### H11 — Lockout solo por email → DoS a cuentas de terceros

- **Severidad:** Media | **Capa:** Autenticación/Autorización
- **Ubicación:** `server/src/middleware/lockout.ts:5-35`; `server/src/routes/auth.ts:108-114,178,186`
- **Descripción:** El lockout cuenta solo por `email` (no por IP); cualquiera puede bloquear el login de un usuario 15 min con 5 intentos fallidos. Además `getClientIp()` confía ciegamente en `X-Forwarded-For` → IPs falsificables.
- **Impacto:** DoS dirigido a cuentas; traza de intentos inservible para incidentes.

#### H12 — Pedidos anónimos sin restricción de abuso

- **Severidad:** Media | **Capa:** Aplicación
- **Ubicación:** `server/src/routes/orders.ts:129-165,179-207`
- **Descripción:** `POST /api/orders` y `POST /api/orders/table` aceptan PII arbitraria sin autenticación; cada pedido dispara notificación al WhatsApp del restaurante y broadcast SSE.
- **Impacto:** Spam masivo de pedidos falsos que satura al personal y consume la API de WhatsApp Business.

#### H13 — Contraseñas placeholder en plantillas y usadas como defaults en tests

- **Severidad:** Media | **Capa:** Config/Operación
- **Ubicación:** `server/.env.example:50,52` (`ChangeMe!2026`); `deploy/.env.production.example:55,57` (`CambiaEstaClaveAdmin`); `server/tests/security.test.ts:182-184`
- **Descripción:** Si el operador despliega con la plantilla sin editar, el seed crea admin con password pública conocida.
- **Impacto:** Toma total del restaurante si alguien despliega "como está documentado" sin editar `.env`.

#### H14 — Endpoints de sesión sin rate limit propio

- **Severidad:** Media | **Capa:** Autenticación/Autorización
- **Ubicación:** `server/src/routes/auth.ts:366 (/refresh)`, `:404 (/logout)`, `:427 (/change-password)`
- **Descripción:** Solo cubiertos por el limiter global. `/change-password` verifica `currentPassword` sin limiter ni lockout; `/refresh` sin limiter permite reventar cookies de refresco robadas.
- **Impacto:** Facilita fuerza bruta sobre credenciales secundarias una vez comprometida una sesión.

#### H15 — Access token en `localStorage`

- **Severidad:** Baja | **Capa:** Aplicación
- **Ubicación:** `client/src/services/api.ts:3-11`; `client/src/context/AuthContext.tsx:16-24`
- **Descripción:** El access token (15 min) se guarda en `localStorage` (legible por JS); el refresh token sí está en cookie `httpOnly`.
- **Impacto:** Si un XSS ejecuta, el token es robable; mitigado parcialmente por el refresh `httpOnly` y la CSP estricta.

#### H16 — `/api/payments/status` expone configuración interna

- **Severidad:** Baja | **Capa:** Datos/Privacidad
- **Ubicación:** `server/src/routes/payments.ts:103-115`
- **Descripción:** Con `authenticate` (cualquier rol) devuelve `baseUrl`, `availableUrls` y flags de claves configuradas; la URL `.su` queda visible.
- **Impacto:** Divulgación de configuración de integración; mínimo para un atacante informado.

#### H17 — `upgradeInsecureRequests` nunca se envía

- **Severidad:** Baja | **Capa:** Red/Transporte
- **Ubicación:** `server/src/index.ts:68` (`upgradeInsecureRequests: isDev ? [] : []`)
- **Descripción:** La expresión ternaria produce siempre `[]`; helmet omite directivas con array vacío.
- **Impacto:** Sin refuerzo HTTP→HTTPS en el navegador; el transporte HTTPS lo garantiza Caddy.

#### H18 — `X-Request-Id` acepta el valor del cliente

- **Severidad:** Baja | **Capa:** Config/Operación
- **Ubicación:** `server/src/middleware/requestId.ts:5`
- **Descripción:** Se reutiliza el `x-request-id` entrante en vez de generar un UUID propio; el test de seguridad incluso verifica el eco.
- **Impacto:** Envenenamiento de correlación de logs.

#### H19 — Backups de base de datos sin cifrado

- **Severidad:** Baja | **Capa:** Físico/Humano
- **Ubicación:** `deploy/backup-db.ps1:142-160`
- **Descripción:** Los dumps contienen toda la PII sin cifrado ni ACL específicas; rotación solo por antigüedad.
- **Impacto:** Compromiso de disco = fuga total de datos; riesgo asumible en MVP pero a documentar.

#### H20 — 2FA: `setup` guarda el secreto antes de habilitar; `enable` sin re-autenticación

- **Severidad:** Baja | **Capa:** Autenticación/Autorización
- **Ubicación:** `server/src/routes/auth.ts:273-292`, `:300-326`, `:335-363`
- **Descripción:** Con un access token robado, el atacante puede activar su propio 2FA y bloquear al usuario legítimo.
- **Impacto:** Secuestro persistente de cuenta tras robo de token; mitigado por la corta vida del token.

#### H21 — Webhook de pagos cubierto por el rate limit global

- **Severidad:** Baja | **Capa:** Integraciones externas
- **Ubicación:** `server/src/index.ts:39`; `server/src/routes/payments.ts:150`
- **Descripción:** Los eventos de Wompi comparten la bucket global (100/15 min en prod) y no tienen `skip`.
- **Impacto:** Un pico de eventos puede rechazar el webhook → órdenes pagadas que quedan en `pending` sin aviso.

#### H22 — Comparación de checksum del webhook no es en tiempo constante

- **Severidad:** Baja | **Capa:** Integraciones externas
- **Ubicación:** `server/src/routes/payments.ts:143-147`
- **Descripción:** `digest === expected` es comparación de strings; la firma se calcula sobre el JSON re-parsed, no sobre el body crudo.
- **Impacto:** Riesgo teórico de side-channel; la implementación falla de forma segura (401/503).

### 3.3 Por capas

| Capa                       | Estado      | Hallazgos                                                             |
| -------------------------- | ----------- | --------------------------------------------------------------------- |
| Red/Transporte             | Debilidades | H2 (Alta), H17 (Baja); TLS/HSTS ok por Caddy + helmet                 |
| Aplicación                 | Debilidades | H3 (Alta), H4 (Alta), H8 (Media), H9 (Media), H12 (Media), H15 (Baja) |
| Autenticación/Autorización | Debilidades | H5 (Alta), H7 (Media), H11 (Media), H14 (Media), H20 (Baja)           |
| Datos/Privacidad           | Debilidades | H4 (Alta), H10 (Media), H16 (Baja)                                    |
| Config/Operación           | Debilidades | H6 (Alta), H13 (Media), H18 (Baja)                                    |
| Integraciones externas     | Crítico     | H1 (Crítica), H21 (Baja), H22 (Baja)                                  |
| Físico/Humano              | Observación | H19 (Baja)                                                            |

### 3.4 Fortalezas verificadas

1. Sin secretos en el repositorio (verificado con `git ls-files`); `.env` real no trackeado.
2. Gestión de tokens sólida: HS256 fijado, refresh `httpOnly` con rotación one-time, hash en BD, revocación y `tokenVersion`.
3. 2FA TOTP funcional con limiter propio en `/2fa/verify`.
4. Validación Zod en todas las rutas de escritura + payload limit 10 kb.
5. Headers de seguridad completos (CSP/HSTS/nosniff/frame/COEP/COOP/Referrer) y error handler sin stack en prod.
6. RBAC consistente (`requireAdmin` en rutas sensibles; `OrderService.getAll` filtra por `userId`).
7. CI con lint, `npm audit --audit-level=high` y cobertura con umbrales.
8. Webhook fail-closed (sin secreto → 503, firma inválida → 401).

### 3.5 Contraste con SECURITY-REPORT.md (16 mitigaciones)

| #   | Mitigación documentada               | Estado real                                                  |
| --- | ------------------------------------ | ------------------------------------------------------------ |
| 1   | Secretos expuestos                   | ✅ Resuelto (verificado en git)                              |
| 2   | JWT débil                            | ⚠️ Parcial (longitud ok; placeholders pasan en runtime — H5) |
| 3   | Credenciales en seed                 | ✅ Resuelto (seed exige env)                                 |
| 4   | Sin `.gitignore`                     | ✅ Resuelto                                                  |
| 5   | Orders status/payment sin Zod        | ✅ Resuelto                                                  |
| 6   | Sin sanitización XSS                 | ⚠️ Parcial (regex evadible y muta datos — H8)                |
| 7   | Logs con datos sensibles             | ⚠️ Parcial (bodies de Wompi aún se loguean — H10)            |
| 8   | JWT algorithm confusion              | ✅ Resuelto (`algorithms: ['HS256']`)                        |
| 9   | Timing attacks                       | ❌ **Roto** (dummy hash malformado — H7)                     |
| 10  | Password policy débil                | ⚠️ Parcial (min 8 en código vs 12 documentado)               |
| 11  | Sin CSP                              | ✅ Resuelto                                                  |
| 12  | Token sin expiración                 | ✅ Resuelto (15m/7d + rotación)                              |
| 13  | Sin lockout                          | ✅ Implementado (con riesgo de DoS por email — H11)          |
| 14  | Sin token revocation                 | ✅ Resuelto                                                  |
| 15  | Password change no invalida sesiones | ✅ Resuelto (`tokenVersion`)                                 |
| 16  | Sin request tracking                 | ⚠️ Parcial (ID spoofeable — H18)                             |

**Conclusión:** 9 de 16 mitigaciones resueltas, 5 parciales, 1 rota (timing). La afirmación de
que los tests de seguridad corren en CI es falsa (H6).

---

## 4. Diagnóstico de funcionalidad e inconsistencias

### 4.1 Resumen por tipo

| Tipo               | Conteo | Hallazgos  |
| ------------------ | ------ | ---------- |
| Feature faltante   | 5      | §4.2.1     |
| UI rota            | 9      | U1–U8, U10 |
| Endpoint sin uso   | 10     | E1–E10     |
| Dato inconsistente | 6      | D1–D6      |
| Error sin manejo   | 4      | G1–G4      |
| Dead code          | 4      | DC1–DC4    |

### 4.2 Hallazgos detallados

#### 4.2.1 Features declaradas vs reales (README/TRD)

| Feature                            | Estado real                                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Menú digital con filtros           | ✅ Implementado                                                                                        |
| Carrito persistente (localStorage) | ✅ Implementado (`useCartState`)                                                                       |
| Checkout WhatsApp (wa.me)          | ✅ Implementado                                                                                        |
| Checkout Wompi                     | ❌ Decorativo: solo setea `paymentMethod:'wompi'`; nunca se crea transacción ni se redirige (E1)       |
| Panel de pagos Wompi (admin)       | ❌ No existe como ruta ni entrada de menú (README.md:125 lo declara)                                   |
| Reservas + QR por mesa             | ⚠️ Parcial: sin validación de disponibilidad (`reservation.service.ts:34-68` no chequea doble reserva) |
| Reportes diarios/semanales         | ⚠️ Parcial: diarios ✅; semanales sin UI (E3)                                                          |
| Pedidos en tiempo real (SSE)       | ⚠️ Parcial: SSE ok, pero el flujo de domicilio se atasca (U3)                                          |
| POS táctil con receipt             | ✅ Implementado                                                                                        |
| Turnos                             | ✅ Implementado                                                                                        |
| Mesas/QR                           | ✅ Implementado                                                                                        |
| Login/Registro + refresh           | ⚠️ Parcial: 2FA del servidor sin flujo cliente (U4)                                                    |
| Paginación                         | ✅ Implementado                                                                                        |
| 404                                | ✅ Implementado                                                                                        |

#### 4.2.2 UI rota

| #   | Hallazgo                                                                                                                                                                                                                                                                                                                                                                                                                                     | Severidad   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| U1  | **Pedidos a domicilio sin dirección (crítico):** ~~`DeliveryForm.tsx:54-65` captura dirección/notas localmente, pero el POST en `CartDrawer.tsx:72-80` no envía `address` ni `deliveryNotes`. La dirección nunca llega al servidor (`AdminOrders.tsx:191` muestra el pedido sin domicilio)~~ ✅ **Resuelto:** `DeliveryForm` es controlado, el carrito envía `address`/`deliveryNotes` y el servidor exige dirección y zona para `domicilio` | **Crítica** |
| U2  | **"Para la mesa" sin mesa:** `CartDrawer.tsx:72-80` envía `orderType:'mesa'` sin `tableId` ni selector de mesa → pedido sin mesa asignada                                                                                                                                                                                                                                                                                                    | Alta        |
| U3  | **Domicilio atascado en `out_for_delivery`:** ~~`AdminOrders.tsx:91` (`getNextStatus`) no contempla `out_for_delivery`; `:236` solo muestra "Marcar Entregado" cuando `next==='delivered'`; `:241-244` lleva a `out_for_delivery` sin acción de avance~~ ✅ **Resuelto:** `out_for_delivery → delivered`                                                                                                                                     | **Alta**    |
| U4  | **2FA rompe el login:** `AuthContext.tsx:70-81` asume `accessToken`; ante `requiresTwoFactor` devuelve `false` y `LoginPage.tsx:33` muestra "Credenciales incorrectas"                                                                                                                                                                                                                                                                       | Alta        |
| U5  | **MesaPage envía email como teléfono:** `MesaPage.tsx:141` `customerPhone: user?.email`; si supera 20 chars el server responde 400                                                                                                                                                                                                                                                                                                           | Media       |
| U6  | **Login/Registro inconsistentes:** `minLength={6}` (`LoginPage.tsx:77`) contradice la política del server (8+, `auth.ts:50`); errores de registro muestran "Credenciales incorrectas"                                                                                                                                                                                                                                                        | Media       |
| U7  | **Dashboard con etiquetas engañosas:** "Pedidos Totales"/"Ingresos Totales" (`AdminDashboard.tsx:119,143`) usan datos del reporte de hoy (`/reports/daily`)                                                                                                                                                                                                                                                                                  | Media       |
| U8  | **Mesas:** botones Editar/Eliminar solo en hover (`opacity-0 group-hover`, `AdminTables.tsx:143`) → inaccesibles en táctil                                                                                                                                                                                                                                                                                                                   | Media       |
| U10 | **POS:** nequi/daviplata/wompi se registran como venta "digital" sin confirmación de pago; `paymentStatus` queda `pending` para siempre (no se consume `PATCH /orders/:id/payment`)                                                                                                                                                                                                                                                          | Media       |

#### 4.2.3 Endpoints sin uso (server ok, cliente nunca los llama)

| #   | Endpoint                                                                                                                                                                                                                                                                              | Severidad |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| E1  | ~~`/api/payments/*` completo (create-transaction, transactions/:id, status, webhook) — "wompi" solo aparece como string en `CartDrawer.tsx:311` y `AdminPOS.tsx:267`~~ ✅ **Resuelto:** `CartDrawer` llama a `POST /payments/create-transaction` con `orderId` y abre el link de pago | Alta      |
| E2  | ~~`PATCH /api/orders/:id/payment` — ningún botón lo invoca → ningún pedido puede marcarse pagado desde la app~~ ✅ **Resuelto:** botón "Marcar Pagado" en `AdminOrders` para pagos no cash                                                                                            | **Alta**  |
| E3  | `GET /api/reports/weekly` — reportes semanales sin UI (`AdminReports.tsx:24` solo llama `/reports/daily`)                                                                                                                                                                             | Media     |
| E4  | `GET /api/orders/daily-sales` + `OrderService.getDailySales` duplican `ReportService.getDailyReport`                                                                                                                                                                                  | Media     |
| E5  | `/api/audit` — logs de auditoría en BD sin página que los muestre                                                                                                                                                                                                                     | Media     |
| E6  | `/api/auth/2fa/*` y `/api/auth/change-password` — implementados y testeados, sin ninguna UI                                                                                                                                                                                           | Media     |
| E7  | `GET /api/orders/table/:tableNumber` sin consumir (y además público — H4)                                                                                                                                                                                                             | Baja      |
| E8  | `/api/shifts/by-period`, `/api/shifts/:id`, `/api/shifts/:id/summary` sin consumir                                                                                                                                                                                                    | Baja      |
| E9  | `GET /api/tables` y `GET /api/tables/:number` sin consumir                                                                                                                                                                                                                            | Baja      |
| E10 | `/api/metrics` y `/api/health` sin consumir por el cliente                                                                                                                                                                                                                            | Info      |

#### 4.2.4 Inconsistencias de datos

| #   | Hallazgo                                                                                                                                                        | Severidad |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| D1  | Tarifas de delivery duplicadas: `CartContext.tsx:24-27` (3000/5000/8000) y `delivery.service.ts:8-27`; el total real cobrado puede divergir del mostrado        | Media     |
| D2  | Formato de moneda mezclado: `$precio` crudo, `.toFixed(2)`, `.toFixed(0)`, `.toLocaleString()` en distintos lugares                                             | Media     |
| D3  | Timezone: `new Date().toISOString().split('T')[0]` = UTC (`AdminReports.tsx:19`, `ReservationForm.tsx:113`); en Colombia (UTC-5) el día del reporte se desplaza | Media     |
| D4  | Types vs schema: `MenuItem.image: string` vs `String?`; `Order.items: CartItem[]` vs `OrderItem[]`; `Table.available` nunca poblada                             | Baja      |
| D5  | `description` opcional en Zod (`routes/menu.ts:29`) pero `NOT NULL` en BD → POST sin descripción revienta en Prisma                                             | Baja      |
| D6  | Se muestra `Envío ({deliveryZone})` con el nombre interno crudo en vez del label (`CartDrawer.tsx:338`)                                                         | Baja      |

#### 4.2.5 Manejo de errores

| #   | Hallazgo                                                                                                                                                                    | Severidad |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| G1  | Catch silencioso `.catch(() => {})` en `MenuGrid.tsx:29`, `MesaPage.tsx:65`, `AdminPOS.tsx:41`, `DeliveryForm.tsx:26` → "No hay platillos" o checkout bloqueado sin mensaje | Media     |
| G2  | `DeliveryForm` sin fallback: si falla la carga de zonas, `handleContinue` queda deshabilitado sin error visible                                                             | Media     |
| G3  | Prisma P2003 sin handler → borrar item referenciado da 500                                                                                                                  | Media     |
| G4  | Errores de validación del server casi nunca mostrados (toast genérico)                                                                                                      | Media     |

#### 4.2.6 Dead code

| #   | Hallazgo                                                            | Severidad |
| --- | ------------------------------------------------------------------- | --------- |
| DC1 | `useLocalStorage`/`useDebounce` solo usados en sus tests            | Baja      |
| DC2 | Componente `Badge` solo usado en tests                              | Baja      |
| DC3 | `OrderService.getDailySales` duplica `ReportService.getDailyReport` | Baja      |
| DC4 | Endpoints muertos E1–E9 y `/api/audit` sin UI                       | Media     |
| DC5 | `server/dist/` versionado en el repo (artefactos de build)          | Info      |

### 4.3 Prioridad funcional

1. **U1 (Crítica):** los pedidos a domicilio llegan sin dirección.
2. **E1 + E2 (Altas):** Wompi no está integrado en el cliente y ningún pedido puede marcarse pagado.
3. **U3 (Alta):** los domicilios quedan atascados en `out_for_delivery`.

---

## 5. Diagnóstico de lógica y estructura

### 5.1 Resumen por severidad

| Severidad | Conteo | Hallazgos |
| --------- | ------ | --------- |
| Alta      | 4      | A1–A4     |
| Media     | 12     | A5–A16    |
| Baja      | 12     | A17–A28   |

### 5.2 Hallazgos detallados

| #   | Hallazgo                                                                                                                                                                                                                                                                                                | Severidad |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| A1  | ~~Exposición de PII en endpoint público de mesas: `GET /api/tables/` (`routes/tables.ts:9`) incluye reservas completas (`name`, `phone`, `notes`, `userId`) vía `TableService.getAll()` (`table.service.ts:12-14`)~~ ✅ **Resuelto:** se eliminan `reservations` y se sanan pedidos con `toPublicOrder` | **Alta**  |
| A2  | ~~Pedidos activos por mesa accesibles sin autenticación: `GET /api/orders/table/:tableNumber` (`orders.ts:77`) devuelve items + `customerName`/`customerPhone`; número de mesa adivinable (coincide con H4)~~ ✅ **Resuelto:** sin PII + parámetro validado                                             | **Alta**  |
| A3  | Webhook de Wompi no verifica el monto contra la orden (`payments.ts:150-214`); `create-transaction` acepta `amount_in_cents`/`reference` del cliente (coincide con H3)                                                                                                                                  | **Alta**  |
| A4  | ~~Detalle de mesa público con pedidos activos: `GET /api/tables/:number` (`tables.ts:73`) sin autenticar~~ ✅ **Resuelto:** sin PII de pedidos + parámetro validado                                                                                                                                     | **Alta**  |
| A5  | Creación de pedido + actualización de turno sin `$transaction` (`order.service.ts:96-127`) → contadores del turno pueden quedar inconsistentes                                                                                                                                                          | Media     |
| A6  | Prisma P2003 (FK) devuelve 500 en vez de 400 (`errors.ts:12-22`)                                                                                                                                                                                                                                        | Media     |
| A7  | Reservas públicas quedan huérfanas: `POST /api/reservations` nunca pasa `userId`; un cliente no-admin jamás ve sus propias reservas (`reservations.ts:79-93`)                                                                                                                                           | Media     |
| A8  | Pedidos anónimos invisibles para su creador posterior: `POST /api/orders` usa `optionalAuth` y guarda `userId: null`; `GET /api/orders` filtra por `userId`                                                                                                                                             | Media     |
| A9  | `AuthService` completo pero nunca usado; `routes/auth.ts:135-453` reimplementa la lógica con prisma directo; expiraciones divergentes (service 15m/7d hardcode vs `config.jwtExpiresIn`)                                                                                                                | Media     |
| A10 | `MenuService` muerto; `routes/menu.ts:46,82,103` accede a prisma directo, rompiendo la capa de servicios                                                                                                                                                                                                | Media     |
| A11 | `OrderService.getDailySales` (`order.service.ts:185-237`) duplica `ReportService.getDailyReport` (`report.service.ts:11-110`) con diferencias sutiles                                                                                                                                                   | Media     |
| A12 | `getClientIp` confía en `X-Forwarded-For` sin `trust proxy` (`auth.ts:108-114`); IP falsificable en `loginAttempt` (coincide con H2)                                                                                                                                                                    | Media     |
| A13 | En producción, `/api/*` inexistente devuelve `index.html` con 200 (`index.ts:125-131`); sin 404 JSON explícito                                                                                                                                                                                          | Media     |
| A14 | Webhook Wompi no idempotente: `paymentStatus = status === 'APPROVED' ? 'paid' : 'failed'` (`payments.ts:175`); un PENDING posterior a un evento marca `failed`, y los reenvíos reprocesan                                                                                                               | Media     |
| A15 | Ventana de reuso en rotación de refresh token (`auth.ts:366-402`): dos peticiones concurrentes pueden emitir dos pares válidos                                                                                                                                                                          | Media     |
| A16 | `sanitize` global muta el body del webhook antes de la verificación de firma (`index.ts:51`, `sanitize.ts:8-14`) → puede romper el digest y rechazar pagos legítimos                                                                                                                                    | Media     |
| A17 | Múltiples turnos abiertos sin control (`shift.service.ts:47-65`); `getCurrent` devuelve array                                                                                                                                                                                                           | Baja      |
| A18 | ~~Pedido domicilio sin dirección/zona validada: el esquema permite `orderType:'domicilio'` con `address`/`deliveryZone` opcionales (`orders.ts:113-127`)~~ ✅ **Resuelto:** `superRefine` exige ambos campos para `domicilio` (coincide con U1)                                                         | Baja      |
| A19 | `config.jwtRefreshExpiresIn` sin uso; expiración hardcodeada en `auth.ts:78` y `cookies.ts:15`                                                                                                                                                                                                          | Baja      |
| A20 | CSP `upgradeInsecureRequests: isDev ? [] : []` siempre vacío (coincide con H17)                                                                                                                                                                                                                         | Baja      |
| A21 | Normalización de métricas no agrupa IDs cuid (`metrics.ts:60` solo cubre hex ≥24)                                                                                                                                                                                                                       | Baja      |
| A22 | SSE sin límite de clientes conectados (`events.ts:7-13`, `orders.ts:88-106`)                                                                                                                                                                                                                            | Baja      |
| A23 | ~~`parseInt` de params sin validación en rutas públicas (`orders.ts:78`, `tables.ts:74`) → NaN posible~~ ✅ **Resuelto:** validación Zod (`z.coerce.number()`) + coerción en el handler                                                                                                                 | Baja      |
| A24 | Zona horaria inconsistente entre `report.service.ts:4-8` y `shift.service.ts:123-125`                                                                                                                                                                                                                   | Baja      |
| A25 | Cierre de turno sin cuadre de caja: `ShiftService.close` acepta `closingCash` arbitrario sin arqueo (`shift.service.ts:67-99`)                                                                                                                                                                          | Baja      |
| A26 | Logger registra la query string completa (`requestLogger.ts:14`)                                                                                                                                                                                                                                        | Baja      |
| A27 | Límite de body de 10 kb puede rechazar pedidos legítimos (50 items + notas de 500 chars) (`index.ts:48`); 413 no mapeado en `errors.ts`                                                                                                                                                                 | Baja      |
| A28 | Rate limit global muy restrictivo en producción (100/15 min para todo `/api/`) detrás de IPs compartidas (`index.ts:34-40`)                                                                                                                                                                             | Baja      |

### 5.3 Patrones correctos (verificados)

- **P1 · Arquitectura en capas dominante:** `ruta → service → prisma` en Orders, Reservations, Shifts, Tables; acceso centralizado en `db.ts`.
- **P2 · Error handler centralizado:** ZodError→400, P2002→409, P2025→404, 500 sin stack en prod; `express-async-errors`.
- **P3 · Gestión de tokens sólida:** HS256, `tokenVersion` contra BD por request, refresh hasheados con SHA-256, rotación, cookies `httpOnly` + `SameSite=Lax`.
- **P4 · Rate limiting en capas:** global + específicos de auth/2FA con valores por entorno.
- **P5 · Headers de seguridad:** helmet con CSP restrictiva, HSTS, CORP, noSniff, xssFilter.
- **P6 · Sanitización global** (con limitaciones, H8/A16).
- **P7 · Lockout de credenciales** (con riesgo, H11).
- **P8 · Política de contraseñas y bcrypt round 12.**
- **P9 · Anti-timing-oracle** (roto, H7).
- **P10 · Auditoría no intrusiva** (fail-open, no rompe la request).
- **P11 · Verificación de firma de webhook** (SHA-256, fail-closed).
- **P12 · Prisma singleton y limpieza programada de tokens.**
- **P13 · Paginación acotada (máx 100) y filtrado por rol.**
- **P14 · Métricas instrumentadas** (expuestas solo bajo admin).
- **P15 · Validación Zod previa en handlers críticos.**
- **P16 · Modelo tipado con enums Prisma.**
- **P17 · SSE con limpieza correcta** (heartbeat 30s, remoción en close).
- **P18 · 2FA TOTP en dos pasos** (setup→enable).

---

## 6. Madurez como prototipo MVP

### 6.1 Qué bloquea el MVP (crítico)

> **Actualización (2026-08-16):** los 6 bloqueos fueron corregidos en esta iteración
> (ver §2.1). La operación como MVP ya no depende de estos hallazgos.

| #   | Bloqueo                                   | Hallazgo(s)                                                                                 |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------- |
| 1   | Pagos inseguros/inoperantes               | H1 (dominio Wompi `.su`), H3 (webhook sin verificar monto), E1/E2 (Wompi sin flujo cliente) |
| 2   | Los pedidos a domicilio no son operativos | U1 (sin dirección), U3 (atascados en `out_for_delivery`)                                    |
| 3   | Fuga de PII por endpoints públicos        | H4/A2 (órdenes por mesa), A1/A4 (mesas con reservas y pedidos)                              |

### 6.2 Qué tiene nivel MVP (funcional hoy)

- Flujo completo cliente: menú → carrito → WhatsApp.
- POS táctil con receipt, turnos, reportes diarios, reservas, QR por mesa.
- Autenticación robusta (JWT + refresh + 2FA server-side) y RBAC.
- 446 tests, CI con lint/audit/coverage, seguridad en profundidad (9/16 mitigaciones efectivas).

### 6.3 Qué es deuda de calidad (no bloquea MVP)

- Servicios muertos y duplicación de lógica (A9–A11, DC3).
- Inconsistencias de datos/formatos/timezone (D1–D6).
- Errores sin manejo y UX frágil (G1–G4, U6–U10).
- Endpoints sin consumir y features declaradas sin UI (E1–E10, §4.2.1).

---

## 7. Conclusión

Hostal Cofee v2 tiene una base técnica por encima de la media de un prototipo: arquitectura en
capas, validación estricta, seguridad en profundidad y una suite de pruebas real. Los 6 hallazgos
críticos/altos que bloqueaban la operación (dominio de pagos, verificación de montos, dirección
de domicilios, avance del estado de entrega, y endpoints públicos con datos personales) fueron
corregidos en la iteración de agosto de 2026 (ver §2.1). El resto de los 88 hallazgos son
mejoras de calidad y endurecimiento que pueden iterarse sin impedir la operación básica.
