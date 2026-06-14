# /run-tests

## Objetivo

Generar, revisar o ejecutar pruebas relacionadas con una feature del proyecto **JICA**.  
Este comando se utiliza al final del ciclo de desarrollo de cada módulo para asegurar que la funcionalidad tenga una estrategia mínima de pruebas antes de aceptarse.

El comando debe validar pruebas de frontend, backend, integración, API y contratos cuando aplique, respetando las tecnologías definidas en el README del proyecto.

---

## Responsabilidad principal

Este comando será utilizado principalmente por el responsable de **Testing**.

---

## Agente principal

```txt
testing-agent.md
```

---

## Agentes de apoyo

```txt
frontend-api-contract-agent.md
architecture-validator.md
backend-controller-agent.md
backend-service-agent.md
backend-repository-agent.md
```

> Los agentes de apoyo se utilizan cuando la feature involucra contratos frontend-backend, endpoints REST, reglas de negocio backend o validación de arquitectura por capas.

---

## Skills aplicados

```txt
testing.skill.md
frontend-api-contracts.skill.md
backend-layered-architecture.skill.md
coding-standards.skill.md
database-prisma.skill.md
```

---

## Tecnologías compatibles con JICA

Este comando debe generar o revisar pruebas usando únicamente tecnologías compatibles con el proyecto.

### Frontend

```txt
Vitest
React Testing Library
Playwright
TypeScript
vi.mock
JSDOM
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

## Qué debe generar o revisar

El comando debe generar o revisar:

- Unit tests.
- Integration tests.
- Component tests.
- API tests.
- Contract tests.
- E2E tests.
- Health checks, si aplica.
- Casos exitosos.
- Casos de error.
- Validación de respuestas esperadas.
- Mocks necesarios.
- Archivos sugeridos.
- Comandos para ejecutar las pruebas.
- Cobertura mínima esperada.

---

## Validaciones obligatorias

Antes de aprobar una feature, este comando debe validar:

```txt
[ ] Las reglas de negocio principales tienen pruebas unitarias.
[ ] Los endpoints nuevos o modificados tienen pruebas de API con Supertest.
[ ] Los hooks, services o componentes frontend tienen pruebas con Vitest o React Testing Library.
[ ] Los flujos críticos del usuario tienen pruebas E2E con Playwright.
[ ] Los contratos entre frontend y backend están validados cuando cambia un DTO, schema Zod o tipo TypeScript.
[ ] Se prueban casos exitosos.
[ ] Se prueban errores comunes.
[ ] Las pruebas siguen la estructura definida por el proyecto.
[ ] No existen credenciales hardcodeadas.
[ ] Los unit tests no dependen de servicios reales.
[ ] Los mocks no ocultan errores importantes.
[ ] La feature no se acepta sin una estrategia mínima de pruebas.
```

---

## Estructura esperada de pruebas

### Frontend

```txt
/frontend/tests
├── unit/
│   ├── utils/
│   ├── validations/
│   ├── services/
│   ├── hooks/
│   ├── routes/
│   └── features/
│       ├── investments/
│       └── simulation/
└── e2e/
    ├── auth/
    ├── investments/
    └── simulation/
```

### Backend

```txt
/backend/tests
├── unit/
│   ├── investments/
│   ├── simulation/
│   ├── auth/
│   └── common/
└── integration/
    ├── investments/
    ├── simulation/
    └── health/
```

También puede utilizarse la estructura estándar de NestJS:

```txt
/backend/test
├── app.e2e-spec.ts
└── jest-e2e.json
```

---

## Reglas de uso

### Unit testing frontend

Debe utilizarse **Vitest** para probar:

- Funciones de `/src/utils`.
- Schemas de `/src/validations`.
- Services de `/src/services`.
- Hooks globales.
- Hooks por feature.
- Lógica de cálculo de simulación.

Ejemplo de import esperado:

```ts
import { describe, it, expect, vi } from 'vitest';
```

---

### Component testing frontend

Debe utilizarse **React Testing Library** para probar componentes visuales.

Correcto:

```ts
screen.getByRole('button', { name: /confirmar inversión/i });
screen.getByText(/riesgo medio/i);
```

Incorrecto:

```ts
document.querySelector('.btn-primary');
```

---

### E2E frontend

Debe utilizarse **Playwright** para flujos completos.

Flujos mínimos recomendados:

```txt
Login
Registro
Dashboard
Detalle de inversión
Simulación de inversión
Confirmación de inversión
Volver al dashboard
```

Las credenciales deben venir de variables de entorno:

```txt
PLAYWRIGHT_TEST_EMAIL
PLAYWRIGHT_TEST_PASSWORD
PLAYWRIGHT_BASE_URL
```

---

### Unit testing backend

Debe utilizarse **Jest** y `@nestjs/testing` para probar:

- Services.
- Guards.
- Filters.
- Utils.
- DTO validation.
- Repositories con Prisma mockeado.

Los Services deben probarse con Repositories mockeados.

---

### API testing backend

Debe utilizarse **Supertest** para validar endpoints REST.

Validar:

- Status code.
- Body esperado.
- DTO validation.
- Errores 400.
- Errores 401.
- Errores 403.
- Errores 404.

---

## Flujo interno del comando

Cuando se ejecute `/run-tests`, el comando debe seguir este orden:

```txt
1. Identificar la feature indicada por el usuario.
2. Determinar si la feature afecta frontend, backend o ambos.
3. Llamar a testing-agent.md como agente principal.
4. Si hay contratos frontend-backend, solicitar revisión de frontend-api-contract-agent.md.
5. Si hay endpoints REST, revisar con backend-controller-agent.md.
6. Si hay reglas de negocio, revisar con backend-service-agent.md.
7. Si hay acceso a datos o Prisma, revisar con backend-repository-agent.md o database-prisma-agent.md.
8. Validar estructura de pruebas con testing.skill.md.
9. Generar lista de pruebas necesarias.
10. Proponer archivos y casos de prueba.
11. Indicar comandos de ejecución.
12. Devolver checklist de aprobación.
```

---

## Formato de entrada esperado

```txt
/run-tests

Feature: <nombre de la feature>

Generar o revisar pruebas para la feature.

Incluir:
- <tipo de prueba requerida>
- <endpoint o componente relacionado>
- <casos exitosos>
- <casos de error>
- <validaciones de contrato si aplica>

Devuelve:
- pruebas necesarias
- archivos sugeridos
- casos de prueba
- mocks necesarios
- comandos de ejecución
- resultado esperado
```

---

## Ejemplo de uso

```txt
/run-tests

Feature: Investment Simulation

Generar o revisar pruebas para la feature.

Incluir:
- unit tests para el service de simulación
- API tests para POST /investment-simulations
- contract tests entre DTO backend y schema Zod frontend
- casos de error para montos inválidos
- caso exitoso de simulación

Devuelve:
- pruebas necesarias
- archivos sugeridos
- casos de prueba
- resultado esperado
```

---

## Resultado esperado

El comando debe devolver una respuesta con esta estructura:

```txt
Feature evaluada:
<nombre de la feature>

Agente principal:
testing-agent.md

Skills aplicados:
testing.skill.md
...

Pruebas necesarias:
1. Unit tests
2. Integration tests
3. API tests
4. Contract tests
5. E2E tests

Archivos sugeridos:
- frontend/tests/...
- backend/tests/...

Casos de prueba:
- Caso exitoso
- Caso de error
- Caso de autorización
- Caso de contrato

Mocks necesarios:
- Servicio mockeado
- Repository mockeado
- Token mockeado
- Response mockeada

Comandos:
npm run test
npm run test:coverage
npm run test:e2e
npm run test:cov

Quality gate:
[ ] Cumple cobertura mínima.
[ ] No rompe pruebas existentes.
[ ] No usa credenciales hardcodeadas.
[ ] No depende de servicios reales en unit tests.
```

---

## Comandos recomendados

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
