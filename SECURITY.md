# POLÍTICA DE SEGURIDAD — NORMATIVA OBLIGATORIA

![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee%20v2-brightgreen.svg)
![Clasificación](https://img.shields.io/badge/Clasificación-Confidencial-red.svg)
![Licencia](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)
![Actualizado](https://img.shields.io/badge/Actualizado-Julio%202026-orange.svg)
![Tolerancia](https://img.shields.io/badge/Tolerancia-Cero-red.svg)
![Reporte](https://img.shields.io/badge/Reporte-Obligatorio-yellow.svg)
![Capas](https://img.shields.io/badge/Seguridad-6%20Capas-red.svg)
![Tests](https://img.shields.io/badge/Tests%20Seguridad-34%20Mínimo-green.svg)

---

**Versión**: 2.0
**Última actualización**: 23 de julio de 2026
**Clasificación**: DOCUMENTO OFICIAL Y CONFIDENCIAL

> **IMPORTANTE**: La seguridad es **INNEGOCIABLE**. El incumplimiento de esta política resultará en **ACCIONES LEGALES** y **BAN PERMANENTE**.

---

## 1. COMPROMISO INCONDICIONAL

**Hostal Cofee** mantiene una postura **CERO TOLERANCIA** ante vulnerabilidades de seguridad. Nos comprometemos a:

- Proteger datos de usuarios, clientes y sistema con los más altos estándares
- Responder a incidentes de seguridad de manera **INMEDIATA**
- Cooperar con autoridades competentes en caso de actividad ilegal
- Mantener transparencia sobre incidentes que afecten a usuarios
- Aplicar sanciones **SEVERAS** a quienes violen esta política

---

## 2. VERSIONES SOPORTADAS

| Versión | Estado   | Soporte                                    |
| ------- | -------- | ------------------------------------------ |
| 1.0.x   | Activa   | ✅ Actualizaciones de seguridad            |
| < 1.0   | Obsoleta | ❌ Sin soporte — Actualizar inmediatamente |

**OBLIGATORIO**: Todas las implementaciones deben usar la versión más reciente.

---

## 3. CANAL ÚNICO DE REPORTES

### 3.1 Reportar Vulnerabilidades

**CANAL ÚNICO Y EXCLUSIVO**:

```
Email: security@hostalcofee.com
Asunto: [SECURITY] [SEVERIDAD] Descripción breve
```

### 3.2 PROHIBICIONES ABSOLUTAS

| #   | Prohibición                            | Consecuencia                          |
| --- | -------------------------------------- | ------------------------------------- |
| 1   | Reportar en Issues públicas            | **BAN PERMANENTE**                    |
| 2   | Reportar en Pull Requests              | **BAN PERMANENTE**                    |
| 3   | Reportar en redes sociales             | **BAN PERMANENTE**                    |
| 4   | Reportar en Discord/Slack público      | **BAN PERMANENTE**                    |
| 5   | Divulgar vulnerabilidad antes del fix  | **BAN PERMANENTE + Acciones Legales** |
| 6   | Explotar vulnerabilidad sin reportar   | **BAN PERMANENTE + Acciones Legales** |
| 7   | Vender información de vulnerabilidades | **BAN PERMANENTE + Acciones Legales** |

### 3.3 Información Obligatoria en el Reporte

**INCOMPLETO = NO PROCESADO**

El reporte **DEBE** incluir TODA la siguiente información:

| Campo                    | Obligatorio | Descripción                                 |
| ------------------------ | ----------- | ------------------------------------------- |
| Tipo de vulnerabilidad   | ✅ Sí       | XSS, SQL Injection, CSRF, RCE, etc.         |
| Ubicación exacta         | ✅ Sí       | Endpoint, archivo, línea de código          |
| Pasos para reproducir    | ✅ Sí       | Instrucciones detalladas paso a paso        |
| Impacto potencial        | ✅ Sí       | Datos comprometidos, funcionalidad afectada |
| Prueba de concepto       | ✅ Sí       | Código, screenshots, videos                 |
| Severidad estimada       | ✅ Sí       | Crítica, Alta, Media, Baja                  |
| Versión afectada         | ✅ Sí       | Versión exacta del sistema                  |
| Entorno de prueba        | ✅ Sí       | SO, navegador, configuración                |
| Sugerencia de corrección | ❌ No       | Recomendado pero opcional                   |

### 3.4 Formato Obligatorio del Reporte

```markdown
# [SECURITY] [SEVERIDAD] Descripción

## Tipo de Vulnerabilidad

[XSS / SQL Injection / CSRF / RCE / IDOR / Otro]

## Ubicación

- Endpoint:
- Archivo:
- Línea:

## Pasos para Reproducir

1.
2.
3.

## Impacto

- [ ] Datos de usuarios comprometidos
- [ ] Datos de pago comprometidos
- [ ] Acceso no autorizado
- [ ] Manipulación de datos
- [ ] Denegación de servicio
- [ ] Otro:

## Prueba de Concepto

[Código o evidencia]

## Severidad Estimada

[ ] Crítica - Acceso completo al sistema
[ ] Alta - Acceso a datos sensibles
[ ] Media - Acceso limitado
[ ] Baja - Información expuesta

## Versión Afectada

[ ]

## Entorno de Prueba

- SO:
- Navegador:
- Node.js:
```

---

## 4. TIEMPOS DE RESPUESTA — OBLIGATORIOS

### 4.1 Tabla de Tiempos

| Severidad   | Acuse de Recibo | Evaluación | Fix      | Publicación |
| ----------- | --------------- | ---------- | -------- | ----------- |
| **Crítica** | 1 hora          | 4 horas    | 24 horas | 48 horas    |
| **Alta**    | 4 horas         | 24 horas   | 72 horas | 7 días      |
| **Media**   | 24 horas        | 48 horas   | 7 días   | 30 días     |
| **Baja**    | 48 horas        | 5 días     | 30 días  | 90 días     |

### 4.2 Incumplimiento de Tiempos

Si no se cumplen los tiempos:

1. **Notificación automática** a mantenimiento superior
2. **Escalación** a equipo de seguridad
3. **Reporte público** si afecta a usuarios
4. **Responsabilidad** del mantenedor asignado

---

## 5. CLASIFICACIÓN DE SEVERIDAD — TABLA COMPLETA

### 5.1 Niveles de Severidad

| Nivel       | Descripción                                           | Ejemplos                                                                                                        | Tiempo de Respuesta |
| ----------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------- |
| **CRÍTICA** | Acceso completo al sistema, robo de datos masivo      | SQL Injection autenticado, RCE, JWT bypass total, Authentication bypass, Exfiltración de base de datos completa | 1 hora              |
| **ALTA**    | Acceso a datos sensibles, manipulación de información | Stored XSS persistente, IDOR en datos de pago, CSRF en cambio de contraseña, Acceso a panel admin no autorizado | 4 horas             |
| **MEDIA**   | Acceso limitado, información expuesta parcialmente    | Reflected XSS, CSRF en acciones no críticas, Información de sistema expuesta, Enumeración de usuarios           | 24 horas            |
| **BAJA**    | Información de configuración, mejoras menores         | Stack traces expuestas, Versiones de software, Headers de seguridad faltantes, Configuración insegura           | 48 horas            |

### 5.2 Criterios de Escalamiento

Una vulnerabilidad se **ESCALA** de nivel cuando:

- Afecta datos de múltiples usuarios
- Permite escalada de privilegios
- No tiene mitigación inmediata
- Está siendo explotada activamente
- Afecta datos de pago

---

## 6. MEDIDAS DE SEGURIDAD — CAPAS OBLIGATORIAS

### Capa 1: GESTIÓN DE SECRETS

| Componente      | Requisito                                | Estado         |
| --------------- | ---------------------------------------- | -------------- |
| `.gitignore`    | Excluir `.env`, secrets, certs           | ✅ OBLIGATORIO |
| `.env.example`  | Plantilla sin valores reales             | ✅ OBLIGATORIO |
| JWT_SECRET      | Mínimo 32 caracteres, alta entropía      | ✅ OBLIGATORIO |
| Credenciales DB | Variables de entorno, nunca hardcodeadas | ✅ OBLIGATORIO |
| API Keys        | Variables de entorno, nunca en código    | ✅ OBLIGATORIO |
| Certificados    | Nunca en repositorio                     | ✅ OBLIGATORIO |

**VIOLACIÓN = RECHAZO INMEDIATO DEL PR**

### Capa 2: AUTENTICACIÓN

| Componente        | Requisito                                                  | Estado         |
| ----------------- | ---------------------------------------------------------- | -------------- |
| JWT Algorithm     | HS256 explícito, nunca "none"                              | ✅ OBLIGATORIO |
| Password Policy   | Mayúscula + minúscula + dígito + especial, mínimo 12 chars | ✅ OBLIGATORIO |
| bcrypt Rounds     | Mínimo 12                                                  | ✅ OBLIGATORIO |
| Timing Protection | Dummy compare en login fallido                             | ✅ OBLIGATORIO |
| Duplicate Check   | 409 en email existente                                     | ✅ OBLIGATORIO |
| Account Lockout   | 5 intentos → 15 min lockout                                | ✅ OBLIGATORIO |

### Capa 3: VALIDACIÓN DE ENTRADA

| Componente       | Requisito                                 | Estado         |
| ---------------- | ----------------------------------------- | -------------- |
| Zod Schemas      | TODAS las rutas                           | ✅ OBLIGATORIO |
| XSS Sanitization | Middleware recursivo                      | ✅ OBLIGATORIO |
| Error Handler    | Logs sanitizados, sin stack trace en prod | ✅ OBLIGATORIO |
| Payload Limit    | Máximo 1MB                                | ✅ OBLIGATORIO |
| Enum Validation  | Valores permitidos estrictos              | ✅ OBLIGATORIO |

### Capa 4: HEADERS DE SEGURIDAD

| Header                    | Valor Mínimo                                  | Estado         |
| ------------------------- | --------------------------------------------- | -------------- |
| Content-Security-Policy   | `default-src 'self'`                          | ✅ OBLIGATORIO |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains`         | ✅ OBLIGATORIO |
| X-Frame-Options           | `DENY`                                        | ✅ OBLIGATORIO |
| X-Content-Type-Options    | `nosniff`                                     | ✅ OBLIGATORIO |
| X-XSS-Protection          | `1; mode=block`                               | ✅ OBLIGATORIO |
| Referrer-Policy           | `strict-origin-when-cross-origin`             | ✅ OBLIGATORIO |
| Permissions-Policy        | Restringir cámara, micrófono, geolocalización | ✅ OBLIGATORIO |

### Capa 5: SESIONES

| Componente       | Requisito                      | Estado         |
| ---------------- | ------------------------------ | -------------- |
| Access Token     | 15 min expiración              | ✅ OBLIGATORIO |
| Refresh Token    | 7 días, rotación obligatoria   | ✅ OBLIGATORIO |
| Token Revocation | Tabla RefreshToken con revoked | ✅ OBLIGATORIO |
| Logout           | Revocar refresh token en DB    | ✅ OBLIGATORIO |
| Password Change  | Invalidar TODOS los tokens     | ✅ OBLIGATORIO |
| Request ID       | UUID tracking por request      | ✅ OBLIGATORIO |

### Capa 6: TESTING DE SEGURIDAD

| Test                      | Cobertura | Frecuencia |
| ------------------------- | --------- | ---------- |
| Headers (CSP, HSTS, etc.) | 100%      | Cada PR    |
| Rate Limiting             | 100%      | Cada PR    |
| Password Policy           | 100%      | Cada PR    |
| Token Refresh             | 100%      | Cada PR    |
| Account Lockout           | 100%      | Cada PR    |
| XSS Sanitization          | 100%      | Cada PR    |
| Input Validation          | 100%      | Cada PR    |
| JWT Security              | 100%      | Cada PR    |

**MINIMO**: 34 tests de seguridad pasando antes de cada merge.

---

## 7. PROHIBICIONES DE SEGURIDAD — LISTA ABSOLUTA

### 7.1 En Código

| #   | Prohibición                                   | Consecuencia              |
| --- | --------------------------------------------- | ------------------------- |
| 1   | Hardcodear credenciales o secrets             | **RECHAZO + ADVERTENCIA** |
| 2   | Usar HTTP en producción                       | **RECHAZO + ADVERTENCIA** |
| 3   | Deshabilitar validación de entrada            | **RECHAZO + ADVERTENCIA** |
| 4   | Deshabilitar CORS sin justificación           | **RECHAZO + ADVERTENCIA** |
| 5   | Usar `eval()` o `Function()`                  | **RECHAZO + ADVERTENCIA** |
| 6   | Conectar a DB sin SSL en producción           | **RECHAZO + ADVERTENCIA** |
| 7   | Loguear datos sensibles (passwords, tokens)   | **RECHAZO + ADVERTENCIA** |
| 8   | Deshabilitar helmet o middleware de seguridad | **RECHAZO + ADVERTENCIA** |
| 9   | Usar `any` en TypeScript sin justificación    | **RECHAZO**               |
| 10  | Ignorar warnings de npm audit                 | **RECHAZO**               |

### 7.2 En Configuración

| #   | Prohibición                        | Consecuencia              |
| --- | ---------------------------------- | ------------------------- |
| 1   | Commit de `.env`                   | **REVERT + ADVERTENCIA**  |
| 2   | Commit de `node_modules`           | **REVERT + ADVERTENCIA**  |
| 3   | Commit de archivos de certificados | **REVERT + ADVERTENCIA**  |
| 4   | Deshabilitar HTTPS                 | **RECHAZO + ADVERTENCIA** |
| 5   | Usar JWT_SECRET débil              | **RECHAZO + ADVERTENCIA** |
| 6   | Configurar CORS `*` en producción  | **RECHAZO + ADVERTENCIA** |
| 7   | Deshabilitar rate limiting         | **RECHAZO + ADVERTENCIA** |

### 7.3 En Dependencias

| #   | Prohibición                                    | Consecuencia              |
| --- | ---------------------------------------------- | ------------------------- |
| 1   | Instalar paquete con vulnerabilidades críticas | **RECHAZO**               |
| 2   | Ignorar `npm audit`                            | **RECHAZO**               |
| 3   | Usar dependencias no verificadas               | **RECHAZO**               |
| 4   | No documentar nuevas dependencias              | **RECHAZO**               |
| 5   | Instalar dependencias sin aprobación           | **RECHAZO + ADVERTENCIA** |

---

## 8. PROCESO DE RESPUESTA A INCIDENTES

### 8.1 Niveles de Incidente

| Nivel  | Descripción                          | Equipo                  | Tiempo     |
| ------ | ------------------------------------ | ----------------------- | ---------- |
| **N1** | Vulnerabilidad reportada porexterno  | Equipo de seguridad     | 1-24 horas |
| **N2** | Vulnerabilidad explotada activamente | Equipo completo         | Inmediato  |
| **N3** | Brecha de datos confirmada           | Equipo completo + Legal | Inmediato  |
| **N4** | Compromiso de sistema completo       | Todos + Autoridades     | Inmediato  |

### 8.2 Flujo de Respuesta

```
DETECCIÓN → CONTENCIÓN → ERRADICACIÓN → RECUPERACIÓN → LECCIONES
    ↓            ↓             ↓              ↓            ↓
  1 hora      4 horas       24 horas       72 horas     7 días
```

### 8.3 Contención

1. **Aislar** el sistema afectado
2. **Revocar** credenciales comprometidas
3. **Bloquear** IPs maliciosas
4. **Notificar** a usuarios afectados
5. **Preservar** evidencia para investigación

### 8.4 Erradicación

1. **Identificar** causa raíz
2. **Desarrollar** parche
3. **Probar** exhaustivamente
4. **Desplegar** corrección
5. **Verificar** resolución

### 8.5 Recuperación

1. **Restaurar** servicios
2. **Monitorear** comportamiento
3. **Validar** integridad de datos
4. **Confirmar** resolución completa
5. **Documentar** lecciones aprendidas

---

## 9. OBLIGACIONES DE COLABORADORES

### 9.1 Antes de Contribuir

- [ ] Revisar `npm audit` en dependencias
- [ ] Verificar que no hay secrets en código
- [ ] Ejecutar tests de seguridad
- [ ] Revisar headers de seguridad
- [ ] Validar autenticación y autorización

### 9.2 Durante el Desarrollo

- [ ] Validar TODOS los inputs con Zod
- [ ] Sanitizar outputs contra XSS
- [ ] Usar parámetros preparados para queries
- [ ] Implementar autorización en cada endpoint
- [ ] Loguear eventos de seguridad (sin datos sensibles)

### 9.3 Antes de Submitir PR

- [ ] Todos los tests de seguridad pasan
- [ ] No hay vulnerabilidades en `npm audit`
- [ ] No hay secrets en el diff
- [ ] Headers de seguridad configurados
- [ ] Rate limiting implementado
- [ ] Documentación de seguridad actualizada

### 9.4 Responsabilidad Personal

Cada colaborador es **PERSONALMENTE RESPONSABLE** por:

- Código que contribuya
- Vulnerabilidades que introduzca
- Dependencias que agregue
- Configuraciones que modifique

**La responsabilidad NO se divide entre el equipo.**

---

## 10. MEJORES PRÁCTICAS PARA USUARIOS

### 10.1 Contraseñas

| Regla          | Requisito                                 |
| -------------- | ----------------------------------------- |
| Longitud       | Mínimo 12 caracteres                      |
| Complejidad    | Mayúscula + minúscula + dígito + especial |
| Reutilización  | **PROHIBIDO** reutilizar entre servicios  |
| Almacenamiento | **NUNCA** en texto plano                  |
| Cambio         | Cada 90 días o ante sospecha              |

### 10.2 Autenticación

- **OBLIGATORIO**: Autenticación de dos factores cuando esté disponible
- **OBLIGATORIO**: Cerrar sesión en dispositivos compartidos
- **PROHIBIDO**: Compartir credenciales
- **PROHIBIDO**: Usar redes públicas sin VPN

### 10.3 Datos Sensibles

- **NUNCA** compartir por email sin cifrar
- **NUNCA** compartir por mensajería no segura
- **NUNCA** almacenar en dispositivos no cifrados
- **SIEMPRE** verificar destinatario

---

## 11. MONITOREO Y AUDITORÍA

### 11.1 Logs Obligatorios

| Evento                   | Información Mínima                                   |
| ------------------------ | ---------------------------------------------------- |
| Login exitoso            | Email, IP, timestamp, User-Agent                     |
| Login fallido            | Email, IP, timestamp, razón                          |
| Cambio de contraseña     | Email, IP, timestamp                                 |
| Acceso a datos sensibles | Usuario, IP, timestamp, datos accedidos              |
| Error de aplicación      | Error, endpoint, timestamp (sin stack trace en prod) |

### 11.2 Retención de Logs

| Tipo de Log            | Retención |
| ---------------------- | --------- |
| Autenticación          | 1 año     |
| Acceso a datos         | 2 años    |
| Errores                | 6 meses   |
| Auditoría de seguridad | 5 años    |

### 11.3 Prohibiciones en Logs

- **NUNCA** loguear contraseñas
- **NUNCA** loguear tokens JWT completos
- **NUNCA** loguear datos de pago
- **NUNCA** loguear información personal sin necesidad
- **NUNCA** loguear stack traces en producción

---

## 12. RECONOCIMIENTO

### 12.1 Programa de Recompensas

| Severidad | Recompensa                             |
| --------- | -------------------------------------- |
| Crítica   | $500 - $2,000 + Agradecimiento público |
| Alta      | $200 - $500 + Agradecimiento público   |
| Media     | $50 - $200 + Agradecimiento público    |
| Baja      | Agradecimiento público                 |

### 12.2 Condiciones

- Vulnerabilidad reportada responsablemente
- No explotada previamente
- Primera en reportarse
- Evidencia completa proporcionada

### 12.3 Reconocimiento Público

- Nombre o alias en CHANGELOG
- Mención en release notes
- Certificado de agradecimiento (opcional)

---

## 13. CONTACTO

| Propósito                | Email                                | Tiempo de Respuesta |
| ------------------------ | ------------------------------------ | ------------------- |
| Reportar vulnerabilidad  | `security@hostalcofee.com`           | 1-4 horas           |
| Preguntas de seguridad   | `security-questions@hostalcofee.com` | 24 horas            |
| Emergencias de seguridad | `security-emergency@hostalcofee.com` | Inmediato           |
| Auditorías de seguridad  | `security-audit@hostalcofee.com`     | 48 horas            |

---

## 14. CONSECUENCIAS

### 14.1 Para Colaboradores

| Violación                      | Consecuencia                       |
| ------------------------------ | ---------------------------------- |
| Exponer secrets                | Advertencia + Rotación obligatoria |
| Introducir vulnerabilidad      | Rechazo + Corrección obligatoria   |
| Ignorar npm audit              | Rechazo + Auditoría                |
| No seguir protocolo de reporte | Advertencia                        |
| Divulgar vulnerabilidad        | Ban permanente + Acciones legales  |

### 14.2 Para Usuarios

| Violación                 | Consecuencia                |
| ------------------------- | --------------------------- |
| Compartir credenciales    | Suspensión de cuenta        |
| Explotar vulnerabilidades | Ban + Reporte a autoridades |
| Acceso no autorizado      | Ban + Reporte a autoridades |
| Fraude                    | Ban + Reporte a autoridades |

---

## 15. AJUSTES DE POLÍTICA

- Esta política puede actualizarse sin previo aviso
- Los cambios críticos se notificarán por email
- El uso continuado implica aceptación
- Las violaciones se juzgan según la versión vigente

---

## 16. LEGAL

Esta política es un documento legal vinculante. El incumplimiento puede resultar en:

- Terminación de cuenta
- Acciones civiles por daños y perjuicios
- Reporte a autoridades competentes
- Responsabilidad penal según jurisdicción

---

## 17. ACEPTACIÓN

Al usar **Hostal Cofee**, usted acepta:

1. Cumplir con TODAS las disposiciones de esta política
2. Reportar vulnerabilidades por el canal establecido
3. No divulgar información de seguridad
4. Someterse a auditorías de seguridad cuando sea requerido
5. Aceptar las consecuencias del incumplimiento

**NO USE ESTE SERVICIO SI NO ACEPTA ESTA POLÍTICA.**

---

## Licencia

[![Licencia: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

Este proyecto está licenciado bajo la **Licencia Pública General de Affero v3.0 (AGPL-3.0)**.

Para más detalles, consulte el archivo LICENSE.
