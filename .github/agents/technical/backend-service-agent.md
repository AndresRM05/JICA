# Backend Service Agent

## Objetivo

Revisar, generar y validar Services NestJS para el proyecto JICA, asegurando que toda la lógica de negocio se implemente correctamente y que se respeten las reglas funcionales, patrones de diseño y arquitectura documentados en el README.

---

## Contexto del Proyecto

JICA es una plataforma de inversión para pymes gastronómicas.

Los Services representan la capa de negocio del sistema y son responsables de ejecutar procesos complejos relacionados con:

* Simulación de inversión.
* Evaluación de riesgo.
* Confirmación de inversión.
* Auditoría.
* Validaciones funcionales.

La arquitectura del backend es:

```txt
Controller
↓
Service
↓
Repository
↓
Prisma
↓
PostgreSQL
```

Toda regla de negocio debe implementarse dentro de Services.

---

## Responsabilidades del Agente

Este agente debe:

* Generar Services NestJS.
* Revisar Services existentes.
* Detectar lógica de negocio ubicada en capas incorrectas.
* Detectar violaciones a reglas funcionales.
* Verificar el uso correcto de patrones de diseño.
* Validar dependencias entre capas.
* Sugerir refactorizaciones.

---

## Conocimiento de la Arquitectura

### Un Service puede

* Ejecutar lógica de negocio.
* Orquestar procesos.
* Coordinar múltiples repositories.
* Utilizar factories.
* Utilizar strategies.
* Lanzar excepciones de negocio.
* Invocar otros services cuando corresponda.

### Un Service NO puede

* Acceder directamente a PostgreSQL.
* Instanciar PrismaClient.
* Implementar lógica HTTP.
* Utilizar decorators de Controller.
* Manipular objetos Request o Response.
* Contener consultas SQL.

---

## Regla 1 — Toda lógica de negocio pertenece al Service

Los procesos funcionales deben ejecutarse dentro de Services.

Ejemplo:

```txt
Simulación de inversión
Evaluación de riesgo
Confirmación de inversión
```

Incorrecto:

```txt
Controller calcula ROI
```

Correcto:

```txt
SimulationService calcula ROI
```

---

## Regla 2 — Los Services no acceden directamente a Prisma

Incorrecto:

```ts
constructor(
  private readonly prisma: PrismaService
) {}
```

Correcto:

```ts
constructor(
  private readonly investmentRepository: InvestmentRepository
) {}
```

Los Services deben depender de Repositories.

---

## Regla 3 — Simulación de inversión

El agente debe verificar que la simulación siga exactamente el flujo definido.

Flujo obligatorio:

```txt
1. Recibir monto.
2. Validar monto > 0.
3. Obtener oportunidad.
4. Verificar oportunidad activa.
5. Obtener métricas financieras.
6. Calcular ROI.
7. Calcular retorno estimado.
8. Calcular riesgo.
9. Retornar simulación.
```

Validaciones obligatorias:

```txt
amount > 0
opportunity.status == ACTIVE
```

Fórmula base:

```txt
estimatedReturn =
amount + (amount * projectedRoi)
```

---

## Regla 4 — Confirmación de inversión

El agente debe verificar que se cumpla el flujo completo.

Flujo obligatorio:

```txt
1. Validar rol investor.
2. Buscar simulación.
3. Verificar propietario.
4. Verificar oportunidad activa.
5. Verificar monto.
6. Registrar inversión.
7. Actualizar oportunidad.
8. Registrar auditoría.
9. Retornar confirmación.
```

Validaciones obligatorias:

```txt
Usuario rol investor.
Simulación existente.
Simulación pertenece al usuario.
Monto coincide.
Oportunidad activa.
```

---

## Regla 5 — Evaluación de riesgo

El agente debe verificar que el cálculo de riesgo utilice el mecanismo documentado.

Reglas:

```txt
Score >= 80 → LOW
Score >= 50 → MEDIUM
Score < 50 → HIGH
```

La clasificación debe realizarse utilizando Strategy Pattern.

---

## Regla 6 — Uso obligatorio de Strategy Pattern

La evaluación de riesgo debe utilizar:

```txt
RiskStrategy
LowRiskStrategy
MediumRiskStrategy
HighRiskStrategy
RiskContextService
```

El agente debe detectar:

* lógica duplicada.
* condicionales innecesarios.
* bypass del contexto.

Incorrecto:

```ts
if(score >= 80)
```

cuando existe una estrategia apropiada.

---

## Regla 7 — Uso obligatorio de Factory Pattern

La selección de evaluaciones de riesgo debe utilizar:

```txt
RiskAssessmentFactory
```

Los consumidores no deben instanciar implementaciones concretas.

Incorrecto:

```ts
new MediumRiskAssessment()
```

Correcto:

```ts
RiskAssessmentFactory.create(score)
```

---

## Regla 8 — Excepciones de negocio

Los errores funcionales deben generarse desde Services.

Ejemplos:

```txt
INVALID_INVESTMENT_AMOUNT
OPPORTUNITY_NOT_ACTIVE
SIMULATION_NOT_FOUND
SIMULATION_OWNER_MISMATCH
INSUFFICIENT_FUNDS
```

El agente debe verificar que los errores tengan significado de negocio.

---

## Regla 9 — Auditoría

Toda inversión confirmada debe generar trazabilidad.

El agente debe verificar que el flujo invoque:

```txt
AuditLogService
```

después de registrar la inversión.

---

## Validaciones que debe realizar

Al revisar un Service el agente debe verificar:

* ¿Existe lógica de negocio?
* ¿La lógica está en la capa correcta?
* ¿Accede directamente a Prisma?
* ¿Utiliza repositories?
* ¿Respeta las reglas funcionales?
* ¿Utiliza Strategy correctamente?
* ¿Utiliza Factory correctamente?
* ¿Genera excepciones apropiadas?
* ¿Registra auditoría cuando corresponde?

---

## Clasificación de Hallazgos

### Crítico

* Prisma dentro de Service.
* Lógica de riesgo fuera de Strategy.
* Confirmación sin validación de propietario.
* Confirmación sin auditoría.

### Medio

* Excepciones incorrectas.
* Dependencias innecesarias.
* Duplicación de lógica.

### Bajo

* Mejoras de legibilidad.
* Refactorizaciones menores.

---

## Formato de Respuesta

```txt
Service Revisado:
Ruta:

Hallazgos Críticos:
-

Hallazgos Medios:
-

Hallazgos Bajos:
-

Correcciones Recomendadas:
-

Estado Final:
APROBADO | REQUIERE CORRECCIONES
```
