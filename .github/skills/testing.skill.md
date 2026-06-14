# testing.skill.md — JICA

## Cuándo usar este skill

Usa este skill cuando se genere, revise o refactorice testing en JICA:

* Unit tests
* Integration tests
* Component tests
* E2E tests
* Contract tests
* Mocks
* Coverage
* Scripts de testing
* Quality gates

Este skill debe ser usado por:

* `testing-agent`
* `frontend-ui-agent`
* `frontend-state-query-agent`
* `frontend-api-contract-agent`
* `backend-controller-agent`
* `backend-service-agent`
* `backend-repository-agent`
* `architecture-validator`

---

## Objetivo

Asegurar que las pruebas de JICA sean automatizadas, mantenibles y compatibles con el stack definido para el proyecto.

---

## Stack oficial de testing

### Frontend

```txt
Vitest
React Testing Library
Playwright
JSDOM
TypeScript
vi.mock
```

### Backend

```txt
Jest
Supertest
@nestjs/testing
TestingModule
TypeScript
```

---

## Referencias del proyecto

### Frontend

```txt
frontend/tests/unit/utils/maskData.test.ts
frontend/tests/unit/features/investments/components/InvestmentCard.test.tsx
frontend/tests/unit/features/investments/hooks/useInvestments.test.ts
frontend/tests/unit/routes/ProtectedRoute.test.tsx
frontend/tests/e2e/auth/login.spec.ts
frontend/tests/e2e/simulation/simulate.spec.ts
```

### Backend

```txt
backend/test/app.e2e-spec.ts
backend/test/jest-e2e.json
backend/src/investments/investments.service.ts
backend/src/investments/investments.repository.ts
backend/src/auth/guards/roles.guard.ts
backend/src/common/filters/http-exception.filter.ts
```

---

## Reglas generales

### 1. Probar comportamiento, no implementación

Las pruebas deben validar lo que el usuario o consumidor del módulo observa.

Correcto:

```ts
screen.getByRole('button', { name: /confirmar inversión/i });
```

Incorrecto:

```ts
document.querySelector('.btn-primary');
```

---

### 2. No depender de servicios reales en unit tests

Unit tests no deben conectarse a:

* PostgreSQL real.
* Azure.
* Microsoft Entra ID real.
* APIs productivas.
* Servicios externos.
* Socket real.

Usar mocks controlados.

---

### 3. No usar credenciales hardcodeadas

Las pruebas E2E deben usar variables de entorno.

```txt
PLAYWRIGHT_TEST_EMAIL
PLAYWRIGHT_TEST_PASSWORD
PLAYWRIGHT_BASE_URL
```

---

## Frontend testing

### Unit tests con Vitest

Aplicar a:

```txt
/src/utils
/src/validations
/src/services
/src/hooks
/src/features/*/hooks
```

Estructura recomendada:

```ts
import { describe, it, expect, vi } from 'vitest';
```

---

### Component tests con React Testing Library

Aplicar a:

```txt
/src/components
/src/features/*/components
/src/routes
```

Validar:

* Renderizado visible.
* Interacciones del usuario.
* Estados `loading`, `success`, `empty` y `error`.
* Badges de riesgo.
* Botones principales.
* Rutas protegidas.

---

### E2E con Playwright

Cubrir flujos:

```txt
Login
Registro
Dashboard
Detalle de inversión
Simulación de inversión
Confirmación de inversión
Volver al dashboard
```

Usar selectores accesibles:

```ts
page.getByRole('button', { name: /simular inversión/i });
page.getByLabel(/monto a invertir/i);
page.getByText(/credenciales incorrectas/i);
```

---

## Backend testing

### Unit tests con Jest

Aplicar a:

```txt
Services
Repositories
Guards
Filters
Utils
DTO validations
```

Los Services deben probarse con Repositories mockeados.

Los Repositories deben probarse con Prisma mockeado o base controlada de pruebas.

---

### Integration/API tests con Supertest

Aplicar a endpoints REST.

Validar:

* Status code.
* Body esperado.
* DTO validation.
* Errores 400.
* Errores 401.
* Errores 403.
* Errores 404.
* Flujo de inversión cuando exista endpoint.

Referencia:

```txt
backend/test/app.e2e-spec.ts
```

---

## Contract testing

Crear o actualizar pruebas de contrato cuando cambien:

```txt
DTOs backend
ApiResponse<T>
ApiError
Schemas Zod
Tipos TypeScript
investment.types.ts
simulation.types.ts
auth.types.ts
```

El objetivo es confirmar que frontend y backend siguen hablando el mismo idioma.

---

## Cobertura mínima recomendada

### Frontend

```txt
utils                  90%
validations            90%
services               80%
hooks                  80%
features/*/hooks       75%
features/*/components  70%
routes                 80%
global                 75%
```

### Backend

```txt
services               80%
repositories           75%
guards                 80%
filters                80%
api/e2e                flujos críticos cubiertos
```

---

## Quality gates

Un cambio no debe aprobarse si:

```txt
[ ] Las pruebas fallan.
[ ] Baja la cobertura mínima.
[ ] Agrega lógica sin prueba.
[ ] Agrega endpoint sin prueba API.
[ ] Agrega formulario sin validación probada.
[ ] Usa credenciales hardcodeadas.
[ ] Usa selectores frágiles.
[ ] Depende de servicios reales en unit tests.
[ ] No actualiza contract tests tras cambiar DTOs o tipos.
[ ] Usa snapshots sin justificación.
```

---

## Scripts esperados

### Frontend

```bash
npm run test
npm run test:coverage
npm run test:e2e
npm run test:e2e:ui
```

### Backend

```bash
npm run test
npm run test:cov
npm run test:e2e
```

---

## Resultado esperado

Cada vez que este skill se use, la respuesta debe incluir:

1. Tipo de prueba.
2. Archivo donde debe ubicarse.
3. Herramienta usada.
4. Código o estructura sugerida.
5. Mocks necesarios.
6. Comando de ejecución.
7. Checklist de calidad.
