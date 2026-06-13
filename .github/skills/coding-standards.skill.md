# coding-standards.skill.md

## Cuándo usar este skill

Usa este skill cuando se genere, revise, refactorice o valide código dentro del proyecto JICA.

Aplica a frontend, backend, arquitectura, testing y revisiones técnicas.

Este skill debe ser considerado la referencia principal de estándares de ingeniería del proyecto.

---

## Objetivo

Asegurar consistencia, mantenibilidad, legibilidad, seguridad y alineación arquitectónica en todo el código fuente.

---

# Convenciones de nombres

## Archivos y carpetas

Usar siempre:

```txt
kebab-case
```

Ejemplos:

```txt
investment-card.tsx
investment-service.ts
investment.schema.ts
```

## Componentes React

Usar:

```txt
PascalCase
```

Ejemplos:

```tsx
InvestmentCard
SimulationForm
InvestorDashboard
```

## Hooks

Todos los hooks deben iniciar con:

```txt
use
```

Ejemplos:

```ts
useInvestments()
useSimulation()
useAuth()
```

## Services

```txt
{Entidad}Service
```

## Repositories

```txt
{Entidad}Repository
```

## DTOs

```txt
CreateInvestmentDto
UpdateInvestmentDto
InvestmentResponseDto
```

## Schemas Zod

```txt
investment.schema.ts
simulation.schema.ts
```

## Variables

camelCase

## Constantes

UPPER_SNAKE_CASE

---

# Estructura de carpetas

## Frontend

Seguir arquitectura por features.

Ejemplo:

```txt
src/
├── app/
├── features/
├── shared/
├── services/
├── hooks/
├── routes/
├── types/
├── config/
```

## Backend

```txt
src/
├── investments/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── dto/
│   ├── entities/
│   └── tests/
```

---

## Shared

Solo puede contener:

- componentes reutilizables
- hooks reutilizables
- utilidades genéricas
- tipos compartidos

Nunca lógica de negocio específica.

---

# Reglas TypeScript

## Strict Mode obligatorio

Compatible con:

```txt
strict: true
```

---

## Prohibido any

Incorrecto:

```ts
const data: any
```

Correcto:

```ts
const data: InvestmentResponse
```

---

## Preferir unknown

Cuando el tipo sea desconocido.

---

## APIs tipadas

Correcto:

```ts
api.get<InvestmentResponse[]>()
```

---

## Tipos compartidos

Centralizar contratos reutilizables.

---

# React Standards

## Componentes con una responsabilidad

Evitar componentes gigantes.

---

## Props tipadas

Toda prop debe tener tipado explícito.

---

## Evitar lógica compleja en JSX

Extraer lógica a hooks o funciones.

---

## Container-Presentational Pattern

Separar:

- lógica
- estado
- obtención de datos

de

- renderizado
- presentación

---

# Zustand Standards

## Solo para estado global

No usar Zustand para:

- formularios
- cache remota
- estado temporal

---

# TanStack Query Standards

Toda consulta remota debe utilizar:

```txt
TanStack Query
```

Evitar:

```ts
useEffect(async () => {})
```

para fetching.

---

# Zod Standards

Todo formulario debe tener schema.

No realizar validaciones manuales cuando exista un schema.

---

# Seguridad

## MSAL obligatorio

No implementar mecanismos alternativos.

---

## Tokens

Prohibido:

- guardar tokens manualmente
- exponer tokens
- almacenar credenciales

---

## OWASP

Todo desarrollo debe respetar OWASP Top 10.

---

# Buenas prácticas

## SRP

Funciones y módulos con una sola responsabilidad.

---

## DRY

Evitar duplicación.

---

## Nombres descriptivos

Evitar:

```txt
data
temp
obj
value
```

cuando no expresan intención.

---

## Early Returns

Preferir retornos tempranos.

---

## Manejo explícito de errores

Nunca:

```ts
catch {}
```

---

## Configuración centralizada

No hardcodear:

- URLs
- Secrets
- Timeouts
- Configuración

---

# Observabilidad

## Sentry

Errores relevantes deben reportarse.

---

## Logs

Eliminar console.log temporales.

---

# Testing Standards

## Frontend

Usar:

- Vitest
- React Testing Library

---

## Backend

Usar:

- Jest
- Supertest

---

## Regla general

Testear comportamiento observable.

No implementación interna.

---

# Estándares arquitectónicos del README

## Feature-Based Architecture

Obligatoria.

---

## Layered Architecture

Obligatoria.

---

## Facade Pattern

Respetar donde haya sido definido.

---

## Container-Presentational Pattern

Respetar separación entre lógica y UI.

---

# Checklist de revisión

```txt
[ ] Respeta arquitectura por features.
[ ] Respeta arquitectura por capas.
[ ] Sigue convenciones de nombres.
[ ] No utiliza any.
[ ] APIs tipadas.
[ ] Utiliza Zustand correctamente.
[ ] Utiliza TanStack Query.
[ ] Utiliza Zod.
[ ] Utiliza MSAL.
[ ] No existe lógica de negocio en UI.
[ ] Existen validaciones.
[ ] Existen pruebas cuando aplica.
```

---

# Violaciones críticas

- Uso extensivo de any.
- Violaciones arquitectónicas.
- Tecnologías no aprobadas.
- Ausencia de validación.
- Gestión insegura de autenticación.

---

# Violaciones medias

- Convenciones incumplidas.
- Carpetas mal organizadas.
- Código duplicado.
- Tipos inconsistentes.

---

# Violaciones bajas

- Nombres mejorables.
- Refactorizaciones menores.
- Comentarios innecesarios.

---

# Formato esperado

```txt
Módulo revisado:

Convenciones:
✓ / ✗

Estructura:
✓ / ✗

TypeScript:
✓ / ✗

Arquitectura:
✓ / ✗

Buenas prácticas:
✓ / ✗

Hallazgos críticos:
-

Hallazgos medios:
-

Hallazgos bajos:
-

Estado final:
APROBADO | REQUIERE CORRECCIONES
```
