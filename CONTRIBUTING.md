# Guía de Contribución — Normativa Obligatoria

[![Proyecto](https://img.shields.io/badge/Proyecto-Hostal%20Cofee--v2-brightgreen.svg)](README.md)
![Estado](https://img.shields.io/badge/Estado-Normativa%20Obligatoria-red.svg)
[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)
![Actualizado](https://img.shields.io/badge/Actualizado-Agosto%202026-orange.svg)
![Commits](https://img.shields.io/badge/Commits-Conventional-blue.svg)
![PR Size](https://img.shields.io/badge/PR%20Size-%3C500%20Lines-red.svg)
![Tests](https://img.shields.io/badge/Tests-446%20Passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/Coverage-Server%2092%25%20%C2%B7%20Client%2099%25-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)

---

**Versión**: 2.0
**Última actualización**: 08 de agosto de 2026

> **ADVERTENCIA**: El incumplimiento de cualquiera de estas normas resultará en el **rechazo inmediato** del Pull Request o la **suspensión** del contribuidor.

---

## 1. Aceptación de Términos

Al contribuir a **Hostal Cofee**, usted acepta expresamente:

1. Cumplir con el [Código de Conducta](CODE_OF_CONDUCT.md)
2. Ceder todos los derechos de sus contribuciones al propietario del proyecto bajo los términos de la [Licencia Propietaria](LICENSE)
3. Seguir **todas** las normas establecidas en este documento
4. Someterse al proceso de revisión y aprobación

**No se aceptan excepciones.** Si no está de acuerdo con alguna norma, no contribuya al proyecto.

---

## 2. Requisitos Obligatorios Previos

### 2.1 Cuenta de GitHub

- Cuenta de GitHub con historial público verificable
- Perfil completo (nombre, foto, biografía)
- Correo electrónico verificado

### 2.2 Herramientas Obligatorias

| Herramienta | Versión Mínima | Propósito            |
| ----------- | -------------- | -------------------- |
| Node.js     | 18.0.0         | Runtime              |
| npm         | 9.0.0          | Package manager      |
| PostgreSQL  | 14.0           | Base de datos        |
| Git         | 2.40.0         | Control de versiones |
| ESLint      | Última estable | Linting              |
| Prettier    | Última estable | Formateo             |

### 2.3 Configuración Local

```bash
# 1. Fork del repositorio (obligatorio desde GitHub)

# 2. Clonar tu fork
git clone https://github.com/TU_USUARIO/REST-COFEE.git
cd REST-COFEE

# 3. Configurar upstream
git remote add upstream https://github.com/USUARIO_ORIGINAL/REST-COFEE.git
git fetch upstream
git checkout -b master upstream/master

# 4. Instalar dependencias
cd hostal-cofre/server && npm install
cd ../client && npm install

# 5. Configurar base de datos
cp .env.example .env
# Editar .env con credenciales válidas

# 6. Ejecutar migraciones
cd ../server
npx prisma migrate dev

# 7. Poblar base de datos
npx tsx src/utils/seed.ts

# 8. Verificar configuración
npm run lint
npm run test
```

**Si la configuración falla, no continúe.** Solicite ayuda en un Issue.

---

## 3. Ramas — Estructura Obligatoria

### 3.1 Naming de Ramas

| Tipo     | Formato            | Ejemplo                    | Ejemplo No Válido           |
| -------- | ------------------ | -------------------------- | --------------------------- |
| Feature  | `feature/xxx-xxx`  | `feature/add-cart-system`  | `feature/cart` (incompleto) |
| Fix      | `fix/xxx-xxx`      | `fix/login-redirect`       | `fix-bug` (sin slash)       |
| Docs     | `docs/xxx-xxx`     | `docs/update-api`          | `docs` (sin descripción)    |
| Refactor | `refactor/xxx-xxx` | `refactor/auth-middleware` | `refactor-code` (sin slash) |
| Test     | `test/xxx-xxx`     | `test/add-menu-tests`      | `test` (sin descripción)    |
| Hotfix   | `hotfix/xxx-xxx`   | `hotfix/security-patch`    | `hotfix` (sin descripción)  |

### 3.2 Reglas de Ramas

- **NUNCA** trabajar directamente en `master`
- **UNA** funcionalidad por branch
- **UNA** funcionalidad por Pull Request
- Branch debe ser **actualizada** con `master` antes del PR
- Branch se **elimina** después del merge

### 3.3 Sincronización

```bash
# Antes de crear tu branch
git checkout master
git fetch upstream
git merge upstream/master
git push origin master

# Crear branch actualizada
git checkout -b feature/tu-funcionalidad
```

---

## 4. Commits — Formato Estricto

### 4.1 Formato Obligatorio

```
<type>(<scope>): <description>

[body opcional]

[footer opcional]
```

### 4.2 Tipos Permitidos

| Tipo       | Uso                         | Ejemplo                                    |
| ---------- | --------------------------- | ------------------------------------------ |
| `feat`     | Nueva funcionalidad         | `feat(cart): add quantity selector`        |
| `fix`      | Corrección de bug           | `fix(auth): resolve token refresh`         |
| `docs`     | Documentación               | `docs(api): update endpoints`              |
| `style`    | Formato (sin cambio lógico) | `style(client): apply prettier`            |
| `refactor` | Refactoring                 | `refactor(middleware): extract validation` |
| `test`     | Tests                       | `test(orders): add integration tests`      |
| `chore`    | Mantenimiento               | `chore(deps): update prisma`               |
| `perf`     | Rendimiento                 | `perf(menu): optimize queries`             |
| `ci`       | CI/CD                       | `ci(github): add test job`                 |

### 4.3 Reglas de Commits

- **Primera línea**: Máximo **72 caracteres**
- **Descripción**: En inglés, imperativo, sin punto final
- **Scope**: Opcional pero recomendado (nombre del módulo)
- **Body**: Explicar **qué** y **por qué**, no **cómo**
- **Footer**: Referenciar issues: `Closes #123`

### 4.4 Prohibiciones en Commits

- ❌ **NUNCA** commitear credenciales, secrets o tokens
- ❌ **NUNCA** commitear `node_modules/`, `.env`, `dist/`
- ❌ **NUNCA** commitear archivos generados automáticamente
- ❌ **NUNCA** usar mensajes genéricos ("fix", "update", "changes")
- ❌ **NUNCA** commitear más de 500 líneas en un solo commit (dividir)
- ❌ **NUNCA** hacer force push sin autorización explícita

### 4.5 Ejemplos

**Correcto:**

```
feat(reservations): add cancellation policy

- Add 24-hour cancellation window
- Send notification email on cancellation
- Update availability on cancellation

Closes #45
```

**Incorrecto:**

```
fix stuff
```

```
actualizado el carrito de compras
```

---

## 5. Código — Estándares Obligatorios

### 5.1 TypeScript

- **Obligatorio**: `strict: true` en `tsconfig.json`
- **Obligatorio**: Tipado explícito en parámetros y retorno
- **Prohibido**: Uso de `any` (excepto con justificación documentada)
- **Obligatorio**: Manejo de errores con try/catch
- **Obligatorio**: Validación de inputs con Zod

### 5.2 Naming Conventions

| Elemento          | Formato                    | Ejemplo                                 |
| ----------------- | -------------------------- | --------------------------------------- |
| Variables         | `camelCase`                | `userName`, `orderTotal`                |
| Funciones         | `camelCase`                | `calculateTotal()`, `fetchOrders()`     |
| Componentes React | `PascalCase`               | `CartComponent`, `OrderList`            |
| Clases            | `PascalCase`               | `AuthService`, `OrderService`           |
| Constantes        | `UPPER_SNAKE_CASE`         | `MAX_RETRY_COUNT`, `API_VERSION`        |
| Interfaces        | `PascalCase` + prefijo `I` | `IUser`, `IOrder`                       |
| Enums             | `PascalCase`               | `OrderStatus`, `PaymentMethod`          |
| Archivos          | `kebab-case`               | `order-service.ts`, `cart-component.ts` |

### 5.3 Estructura de Código

```
src/
├── config/           # Configuración
├── middleware/        # Middleware Express
├── routes/           # Rutas API
├── services/         # Lógica de negocio
├── utils/            # Utilidades
└── types/            # Tipos TypeScript
```

### 5.4 Comentarios

- **Prohibido**: Comentarios obvios (`// incrementar i`)
- **Prohibido**: Código comentado (usar git para historial)
- **Obligatorio**: JSDoc en funciones públicas
- **Obligatorio**: Explicar **por qué**, no **qué**

**Correcto:**

```typescript
/**
 * Calculate total with tax and discount
 * @param subtotal - Base amount before tax
 * @param taxRate - Tax percentage (0-1)
 * @param discount - Discount percentage (0-1)
 * @returns Total after tax and discount
 */
function calculateTotal(
  subtotal: number,
  taxRate: number,
  discount: number,
): number {
  // Using Math.round to avoid floating point precision issues
  return Math.round(subtotal * (1 + taxRate) * (1 - discount));
}
```

**Incorrecto:**

```typescript
// Función para calcular total
function calculateTotal(
  subtotal: number,
  taxRate: number,
  discount: number,
): number {
  // Calcular impuesto
  let tax = subtotal * taxRate;
  // Calcular descuento
  let discountAmount = subtotal * discount;
  // Retornar total
  return subtotal + tax - discountAmount;
}
```

### 5.5 Formateo

- **Obligatorio**: Prettier con configuración del proyecto
- **Obligatorio**: ESLint sin errores
- **Obligatorio**: 2 espacios de indentación
- **Obligatorio**: Punto y coma al final
- **Obligatorio**: Comillas simples para strings
- **Obligatorio**: Trailing commas

```json
// .prettierrc (configuración del proyecto)
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## 6. Pull Requests — Proceso Estricto

### 6.1 Requisitos Previos al PR

- [ ] Código compila sin errores (`npm run build`)
- [ ] Tests pasan (`npm run test`)
- [ ] Lint sin errores (`npm run lint`)
- [ ] Formato correcto (`npm run format`)
- [ ] Branch actualizada con `master`
- [ ] **UNA** funcionalidad por PR
- [ ] Descripción completa según template

### 6.2 Template del PR

```markdown
## Descripción

[Descripción clara del cambio]

## Tipo de Cambio

- [ ] Bug fix (fix)
- [ ] Nueva funcionalidad (feat)
- [ ] Documentación (docs)
- [ ] Refactoring (refactor)
- [ ] Tests (test)
- [ ] Otro: ___

## Issue Relacionado

Closes #[número]

## Cambios Realizados

- [ ] Detalle 1
- [ ] Detalle 2

## Testing

[Descripción de cómo se probó]

## Screenshots (si aplica)

[Capturas de pantalla]

## Checklist

- [ ] Código compila sin errores
- [ ] Tests pasan
- [ ] Lint sin errores
- [ ] Formato correcto
- [ ] Documentación actualizada
- [ ] No rompe funcionalidad existente
- [ ] Branch actualizada con master
- [ ] Descripción clara del cambio
```

### 6.3 Reglas de PR

- **Mínimo** 1 aprobación requerida
- **Todos** los checks deben pasar
- **NO** merge sin aprobación
- **NO** force push en PR
- **NO** commits de merge (usar rebase o squash)
- **Responder** a todos los comentarios
- **Resolver** todas las conversaciones
- **Tiempo máximo** de respuesta a feedback: 72 horas

### 6.4 Tamaño del PR

| Tamaño        | Líneas  | Ejemplo                             |
| ------------- | ------- | ----------------------------------- |
| Pequeño       | < 100   | Fix simple, cambio de configuración |
| Mediano       | 100-300 | Feature completa                    |
| Grande        | 300-500 | Múltiples features relacionadas     |
| **RECHAZADO** | > 500   | Dividir en múltiples PRs            |

**Si el PR excede 500 líneas, será rechazado automáticamente.**

### 6.5 Review

- **Tiempo máximo** de review: 5 días hábiles
- **Mínimo** 1 aprobación requerida
- **Todos** los comentarios deben ser resueltos
- **Solicitar** re-review después de cambios
- **No hacer** push durante review (a menos que se solicite)

### 6.6 Merge

- **Solo** maintainer puede hacer merge
- **Squash and merge** para features
- **Rebase and merge** para fixes
- **NO** merge commits

---

## 7. Seguridad — Reglas Críticas

### 7.1 Prohibiciones Absolutas

- ❌ **NUNCA** commitear credenciales, tokens o secrets
- ❌ **NUNCA** commitear archivos `.env`
- ❌ **NUNCA** hardcodear contraseñas
- ❌ **NUNCA** exponer datos sensibles en logs
- ❌ **NUNCA** usar APIs inseguras (HTTP en producción)

### 7.2 Dependencias

- **Verificar** vulnerabilidades antes de instalar
- **Usar** `npm audit` regularmente
- **NO** instalar dependencias no autorizadas
- **Documentar** razón de cada nueva dependencia

```bash
# Verificar vulnerabilidades
npm audit
npm audit fix
```

### 7.3 Autenticación

- **NO** implementar autenticación sin autorización
- **NO** modificar middleware de seguridad sin aprobación
- **Reportar** vulnerabilidades a `security@hostalcofee.com`

---

## 8. Testing — Cobertura Obligatoria

### 8.1 Tipos de Tests

| Tipo        | Cobertura Mínima | Ejecución                  |
| ----------- | ---------------- | -------------------------- |
| Unit        | 80%              | `npm run test:coverage`    |
| Integration | 60%              | `npm run test:integration` |
| Security    | 100%             | `npm run test:security`    |

Los thresholds se aplican en `hostal-cofre/server/vitest.config.ts` y
`hostal-cofre/client/vitest.config.ts` y se verifican en CI (`npm run test:coverage`).

### 8.2 Estructura de Tests

```typescript
describe("OrderService", () => {
  describe("calculateTotal", () => {
    it("should calculate total with tax", () => {
      // Arrange
      const subtotal = 100;
      const taxRate = 0.19;

      // Act
      const result = calculateTotal(subtotal, taxRate, 0);

      // Assert
      expect(result).toBe(119);
    });

    it("should throw error for negative subtotal", () => {
      // Arrange
      const subtotal = -100;

      // Act & Assert
      expect(() => calculateTotal(subtotal, 0.19, 0)).toThrow(
        "Subtotal cannot be negative",
      );
    });
  });
});
```

### 8.3 Reglas de Tests

- **Obligatorio**: Tests para cada función nueva
- **Obligatorio**: Tests para cada bug fix
- **Obligatorio**: Coverage mínimo del 80%
- **Prohibido**: Tests sin assertions
- **Prohibido**: Tests que dependen de estado externo
- **Prohibido**: Tests con datos hardcodeados sensibles

---

## 9. Documentación — Requisitos

### 9.1 Documentación Obligatoria

- [ ] README.md actualizado (si cambia instalación/features)
- [ ] CHANGELOG.md actualizado
- [ ] API docs (si cambian endpoints)
- [ ] JSDoc en funciones públicas

### 9.2 Formato de Documentación

- **Idioma**: Inglés para código, español para comentarios al usuario
- **Formato**: Markdown
- **Ejemplos**: Código funcional y verificable
- **Enlaces**: Referenciar archivos relevantes

---

## 10. Issues — Formato Obligatorio

### 10.1 Bug Report

```markdown
## Descripción

[Descripción clara y concisa del bug]

## Pasos para Reproducir

1. Ir a '...'
2. Hacer clic en '...'
3. Desplazarse hasta '...'
4. Ver error

## Comportamiento Esperado

[Qué debería pasar]

## Comportamiento Actual

[Qué pasa realmente]

## Entorno

- SO: [ej. Windows 11]
- Navegador: [ej. Chrome 120]
- Node.js: [ej. 18.17.0]
- npm: [ej. 9.6.7]

## Screenshots

[Si aplica]

## Additional Context

[Cualquier otra información relevante]
```

### 10.2 Feature Request

```markdown
## Descripción

[Descripción clara de la funcionalidad]

## Use Case

[Por qué es necesaria esta funcionalidad]

## Alternativas Consideradas

[Otras soluciones evaluadas]

## Additional Context

[Cualquier otra información relevante]
```

---

## 11. Prohibiciones Generales

### 11.1 Acciones Prohibidas

- ❌ Trabajar directamente en `master`
- ❌ Commitear sin mensagem descriptiva
- ❌ Hacer force push sin autorización
- ❌ Modificar `.gitignore` sin aprobación
- ❌ Agregar dependencias sin documentar razón
- ❌ Cambiar configuración de linting/formato
- ❌ Modificar CI/CD sin aprobación
- ❌ Compartir credenciales o secrets
- ❌ Ignorar comentarios del reviewer
- ❌ Cerrar Issues sin resolver

### 11.2 Consecuencias

| Infracción    | Consecuencia                          |
| ------------- | ------------------------------------- |
| 1ra vez       | Advertencia y solicitud de corrección |
| 2da vez       | Rechazo del PR y revisión obligatoria |
| 3ra vez       | Suspensión temporal de contribuciones |
| Gravedad alta | Ban permanente del proyecto           |

---

## 12. Contacto y Soporte

### 12.1 Preguntas Técnicas

- **Issue**: Usar etiqueta `question`
- **Tiempo de respuesta**: 48 horas

### 12.2 Reportar Vulnerabilidades

- **Email**: `security@hostalcofee.com`
- **NO** usar Issues públicas
- **Asunto**: `[Security] Descripción breve`

### 12.3 Sugerencias

- **Issue**: Usar etiqueta `enhancement`
- **Incluir**: Justificación y alternativas

---

## 13. Aceptación

Al contribuir a este proyecto, usted confirma que:

1. Ha leído y comprendido todas las normas
2. Acepta cumplirlas estrictamente
3. Entiende las consecuencias del incumplimiento
4. Licencia sus contribuciones bajo la [Licencia Propietaria DEVCO](LICENSE)

**Contribuciones que no cumplan con estas normas serán rechazadas sin excepción.**

---

## 14. Licencia

[![Licencia: DEVCO Propietaria](https://img.shields.io/badge/Licencia-DEVCO%20Propietaria-red.svg)](LICENSE)

Este proyecto se distribuye bajo una **Licencia de Uso Propietario DEVCO - Versión Comercial**.
Copyright (c) 2026 **GirMart-SDK**. Todos los derechos reservados.

Al contribuir, usted cede los derechos de sus aportes al propietario bajo los
términos de la [LICENSE](LICENSE). Prohibida la reproducción total o parcial sin
autorización expresa por escrito.
