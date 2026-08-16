# Diagnóstico Integral — Hostal Cofee v2

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee--v2-brightgreen.svg)](README.md)
![Diagnóstico](https://img.shields.io/badge/Diagnóstico-Integral-blue.svg)
[![Pendientes](https://img.shields.io/badge/Pendientes-0-brightgreen.svg)](04-PENDIENTES.md)
[![Resueltos](https://img.shields.io/badge/Resueltos-88-brightgreen.svg)](04-PENDIENTES.md)

---

## 1. Propósito

Documento de **diagnóstico del estado actual** del proyecto Hostal Cofee v2, orientado a
evaluar su madurez como **prototipo MVP**. Es información general: contexto, hallazgos ya
resueltos y fortalezas verificadas. **Todo lo pendiente por corregir vive en un solo lugar:
[`04-PENDIENTES.md`](04-PENDIENTES.md).**

**Método:** auditoría de solo lectura verificada contra el código actual (referencias
`archivo:línea`).

---

## 2. Resumen ejecutivo

> **Estado de resolución (2026-08-16):** los 88 hallazgos del diagnóstico quedaron resueltos
> (12 previos en §2.1 + 65 del backlog). Los 65 del backlog, con su corrección aplicada, están
> registrados en [`04-PENDIENTES.md`](04-PENDIENTES.md) como registro de resolución.

| Ámbito              | Hallazgos   | Críticos | Altos  | Medios | Bajos  | Resueltos    |
| ------------------- | ----------- | -------- | ------ | ------ | ------ | ------------ |
| Ciberseguridad      | 22 (H1–H22) | 1        | 5      | 8      | 8      | 22/22 ✅     |
| Funcionalidad       | 38          | 1        | 5      | 20     | 10     | 38/38 ✅     |
| Lógica y estructura | 28 (A1–A28) | 0        | 4      | 12     | 12     | 28/28 ✅     |
| **Total**           | **88**      | **2**    | **14** | **40** | **30** | **88/88 ✅** |

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

---

## 3. Ciberseguridad

### 3.1 Evaluación general

22 hallazgos (H1–H22). Estado: **22/22 resueltos**. Los 8 de severidad baja/media del backlog
(H7–H22) y los de alta (H2, H5–H6) con su corrección están en
[`04-PENDIENTES.md`](04-PENDIENTES.md).

### 3.2 Fortalezas verificadas

1. Sin secretos en el repositorio (`git ls-files`); `.env` real no trackeado.
2. Gestión de tokens sólida: HS256 fijado, refresh `httpOnly` con rotación one-time, hash en BD, revocación y `tokenVersion`.
3. 2FA TOTP funcional con limiter propio en `/2fa/verify`.
4. Validación Zod en todas las rutas de escritura + payload limit 10 kb.
5. Headers de seguridad completos (CSP/HSTS/nosniff/frame/COEP/COOP/Referrer) y error handler sin stack en prod.
6. RBAC consistente (`requireAdmin` en rutas sensibles; `OrderService.getAll` filtra por `userId`).
7. CI con lint, `npm audit --audit-level=high` y cobertura con umbrales.
8. Webhook fail-closed (sin secreto → 503, firma inválida → 401).

### 3.3 Contraste con SECURITY-REPORT.md

`SECURITY-REPORT.md` (08-08-2026) documenta 16 mitigaciones. El contraste verificó: 9 plenas,
5 parciales, 1 rota (anti-timing, H7) y la afirmación de tests en CI era falsa (H6). Ambos
hallazgos quedaron corregidos en esta iteración (ver [`04-PENDIENTES.md`](04-PENDIENTES.md)).

---

## 4. Funcionalidad e inconsistencias

### 4.1 Evaluación general

38 hallazgos (features, UI, endpoints sin uso, datos, errores, dead code). Estado: **38/38
resueltos** (4 previos U1/U3/E1/E2 + 34 del backlog en [`04-PENDIENTES.md`](04-PENDIENTES.md)).

### 4.2 Features verificadas

- Menú digital con filtros, carrito persistente (`localStorage`), checkout WhatsApp (`wa.me`).
- POS táctil con receipt, turnos, reportes diarios, reservas, QR por mesa.
- Login/Registro + refresh (2FA server-side sin flujo completo en cliente).
- Paginación y 404 implementados.
- Checkout Wompi (cliente): iniciado por el cliente tras crear la orden (E1 ✅).

### 4.3 Prioridad funcional histórica

1. **U1 (Crítica):** pedidos a domicilio sin dirección → ✅ resuelto.
2. **E1 + E2 (Altas):** Wompi sin flujo cliente y sin "Marcar Pagado" → ✅ resueltos.
3. **U3 (Alta):** domicilios atascados en `out_for_delivery` → ✅ resuelto.

---

## 5. Lógica y estructura

### 5.1 Evaluación general

28 hallazgos (A1–A28) sobre arquitectura en capas, servicios, transacciones y consistencia.
Estado: **28/28 resueltos** (5 previos A1/A2/A4/A18/A23 + 23 del backlog en
[`04-PENDIENTES.md`](04-PENDIENTES.md)).

### 5.2 Patrones correctos (verificados)

- **P1 · Arquitectura en capas dominante:** `ruta → service → prisma` en Orders, Reservations, Shifts, Tables; acceso centralizado en `db.ts`.
- **P2 · Error handler centralizado:** ZodError→400, P2002→409, P2025→404, 500 sin stack en prod; `express-async-errors`.
- **P3 · Gestión de tokens sólida:** HS256, `tokenVersion` contra BD por request, refresh hasheados con SHA-256, rotación, cookies `httpOnly` + `SameSite=Lax`.
- **P4 · Rate limiting en capas:** global + específicos de auth/2FA con valores por entorno.
- **P5 · Headers de seguridad:** helmet con CSP restrictiva, HSTS, CORP, noSniff, xssFilter.
- **P6–P18:** sanitización global, lockout, política de contraseñas y bcrypt 12, verificación de firma de webhook (SHA-256, fail-closed), Prisma singleton, paginación acotada (máx 100), filtrado por rol, métricas instrumentadas, validación Zod previa, enums Prisma, SSE con limpieza correcta y 2FA TOTP en dos pasos.

---

## 6. Madurez como prototipo MVP

### 6.1 Bloqueos resueltos

> **Actualización (2026-08-16):** los 6 bloqueos fueron corregidos en esta iteración
> (ver §2.1). La operación como MVP ya no depende de estos hallazgos.

1. Pagos inseguros/inoperantes — H1, H3, E1/E2.
2. Pedidos a domicilio no operativos — U1, U3.
3. Fuga de PII por endpoints públicos — H4/A2, A1/A4.

### 6.2 Nivel MVP (funcional hoy)

- Flujo completo cliente: menú → carrito → WhatsApp + pago Wompi (transacción/nequi/daviplata en POS).
- POS táctil con receipt, turnos, reportes diarios/semanales, reservas, QR por mesa y panel de pagos.
- Autenticación robusta (JWT + refresh httpOnly en memoria + 2FA) y RBAC.
- 232 tests de cliente + 188 de servidor + 43 de seguridad, CI con lint/audit/coverage.

### 6.3 Deuda de calidad (saldada)

- Servicios muertos y duplicación de lógica (A9–A11, DC3) → eliminados/consolidados.
- Inconsistencias de datos/formatos/timezone (D1–D6) → corregidas.
- Errores sin manejo y UX frágil (G1–G4, U6–U10) → resueltos.
- Endpoints sin consumir y features declaradas sin UI (E3–E10, F1–F2) → consumidos/implementados.

Detalle de cada ítem con su corrección: [`04-PENDIENTES.md`](04-PENDIENTES.md).

---

## 7. Conclusión

Hostal Cofee v2 tiene una base técnica por encima de la media de un prototipo: arquitectura en
capas, validación estricta, seguridad en profundidad y una suite de pruebas real. Con la
iteración de agosto de 2026 se resolvieron **los 88 hallazgos del diagnóstico**: los 6
críticos/altos que bloqueaban la operación (dominio de pagos, verificación de montos, dirección
de domicilios, avance del estado de entrega y endpoints públicos con datos personales, ver §2.1)
y los 65 del backlog de calidad y endurecimiento. El registro de cada corrección está en
[`04-PENDIENTES.md`](04-PENDIENTES.md).
