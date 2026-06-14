# /generate-database-model

## Objetivo

Generar o revisar modelos de base de datos usando **Prisma ORM** y **PostgreSQL**, asegurando que las entidades representen correctamente el dominio del MVP de **JICA** y soporten el flujo principal del sistema.

Este comando debe validar que el modelo sea compatible con el backend en **NestJS**, la capa **Repository**, las migraciones de Prisma y los requerimientos funcionales del frontend.

---

## Responsabilidad principal

Este comando será utilizado principalmente por el responsable de **Database**.

---

## Agente principal

```txt
database-prisma-agent.md
```

---

## Agentes de apoyo

```txt
backend-repository-agent.md
architecture-validator.md
low-coupling-reviewer.md
testing-agent.md
```

> `testing-agent.md` participa como apoyo cuando el cambio de modelo requiere pruebas de Repository, Service, API o contract testing.

---

## Skills aplicados

```txt
database-prisma.skill.md
backend-layered-architecture.skill.md
architecture-guidelines.skill.md
coding-standards.skill.md
testing.skill.md
```

---

## Tecnologías compatibles con JICA

Este comando debe trabajar únicamente con el stack definido para el proyecto:

```txt
PostgreSQL
Prisma ORM
Prisma Client
Prisma Migrate
Prisma Seed
NestJS
TypeScript
Azure Database for PostgreSQL
```

No debe proponer por defecto:

```txt
MongoDB
MySQL
SQLite como base principal
TypeORM
Sequelize
Mongoose
Firestore
DynamoDB
```

---

## Qué debe generar o revisar

El comando debe generar o revisar:

- Modelos Prisma.
- Enums del dominio.
- Relaciones entre entidades.
- Llaves primarias.
- Llaves foráneas.
- Campos obligatorios.
- Campos opcionales.
- Restricciones de integridad.
- Índices.
- Restricciones `unique`.
- Campos de auditoría.
- Soft delete.
- Nombres consistentes.
- Posibles datos semilla.
- Impacto del modelo sobre backend.
- Impacto del modelo sobre frontend.
- Impacto del modelo sobre testing.
- Compatibilidad con Repository Pattern.

---

## Validaciones obligatorias

Antes de aprobar un modelo, este comando debe validar:

```txt
[ ] Los modelos representan correctamente el dominio de JICA.
[ ] Las relaciones son claras y justificadas.
[ ] No existe duplicación innecesaria de datos.
[ ] El diseño soporta el flujo del MVP.
[ ] Los nombres siguen las convenciones del proyecto.
[ ] Las entidades mantienen bajo acoplamiento.
[ ] El modelo permite consultas necesarias para dashboard, detalle, simulación y confirmación.
[ ] Las entidades principales usan UUID.
[ ] Los montos financieros usan Decimal.
[ ] Existen índices para foreign keys y consultas frecuentes.
[ ] Existen restricciones unique cuando aplica.
[ ] Existen campos createdAt y updatedAt.
[ ] Existe deletedAt cuando aplica soft delete.
[ ] El modelo puede ser consumido desde Repositories.
[ ] El modelo no obliga a consultar Prisma desde Controllers o Services.
[ ] Se propone una estrategia de migración.
[ ] Se propone seed data si aplica.
```

---

## Flujo principal que debe soportar

Todo modelo generado o revisado debe soportar el flujo principal de JICA:

```txt
Registro de inversionista
    ↓
Dashboard de oportunidades
    ↓
Detalle de oportunidad de inversión
    ↓
Simulación de inversión
    ↓
Confirmación de inversión
```

Esto implica que el modelo debe permitir consultas para:

```txt
- Obtener usuario autenticado.
- Obtener perfil de inversionista.
- Listar oportunidades disponibles.
- Consultar detalle financiero de una oportunidad.
- Consultar pyme asociada a una oportunidad.
- Registrar simulación.
- Registrar interés de inversión.
- Confirmar inversión.
- Enviar o almacenar notificaciones.
```

---

## Entidades base esperadas

El comando debe considerar estas entidades principales:

```txt
User
Investor
Business
FinancialReport
InvestmentOpportunity
InvestmentInterest
Investment
Simulation
Document
Notification
```

---

## Convenciones obligatorias

### Modelos

Usar PascalCase y nombres en singular.

Correcto:

```txt
User
Business
InvestmentOpportunity
FinancialReport
```

Incorrecto:

```txt
Users
Negocio
InvestmentOpportunities
```

---

### Campos

Usar camelCase.

Correcto:

```txt
firstName
targetAmount
riskLevel
estimatedReturn
```

Incorrecto:

```txt
first_name
TargetAmount
nivelRiesgo
```

---

### Foreign keys

Usar formato `{entity}Id`.

```txt
userId
businessId
investorId
opportunityId
```

---

### Enums

Usar PascalCase para el nombre del enum y lowercase para sus valores.

```prisma
enum RiskLevel {
  low
  medium
  high
}
```

---

## Reglas Prisma obligatorias

### UUID

```prisma
id String @id @default(uuid()) @db.Uuid
```

---

### Auditoría

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
deletedAt DateTime?
```

---

### Campos financieros

```prisma
targetAmount Decimal
currentAmount Decimal
investmentAmount Decimal
estimatedReturn Decimal
expectedReturn Decimal
```

---

### Relaciones

```prisma
businessId String @db.Uuid
business Business @relation(fields: [businessId], references: [id])
```

---

### Índices

```prisma
@@index([businessId])
@@index([investorId])
@@index([opportunityId])
@@index([status])
```

---

### Restricciones únicas

```prisma
email String @unique
userId String @unique @db.Uuid
@@unique([investorId, opportunityId])
```

---

## Relación con backend

El modelo generado debe respetar la arquitectura por capas del backend:

```txt
Controller
    ↓
Service
    ↓
Repository
    ↓
PrismaService
    ↓
PostgreSQL
```

El comando debe revisar que el modelo sea usable desde:

```txt
backend/src/{module}/{module}.repository.ts
backend/src/prisma/prisma.service.ts
backend/src/{module}/{module}.service.ts
backend/src/{module}/dto
```

---

## Relación con frontend

El modelo debe permitir construir contratos claros para el frontend:

```txt
investment.types.ts
simulation.types.ts
auth.types.ts
api.types.ts
Zod schemas
```

El comando debe advertir si un cambio de modelo requiere actualizar:

```txt
- DTOs backend
- Tipos TypeScript frontend
- Schemas Zod frontend
- Servicios API frontend
- Hooks de TanStack Query
- Pruebas de contrato
```

---

## Relación con testing

Si el modelo cambia, el comando debe indicar pruebas necesarias:

```txt
- Repository tests.
- Service tests.
- API tests con Supertest.
- Contract tests entre DTO backend y schemas frontend.
- Seed validation.
```

En este caso debe solicitar apoyo de:

```txt
testing-agent.md
testing.skill.md
```

---

## Formato de entrada esperado

```txt
/generate-database-model

Feature: <nombre de la feature>

Crear o validar el modelo <nombre del modelo>.

Debe relacionarse con:
- <entidad 1>
- <entidad 2>

Debe almacenar:
- <campo 1>
- <campo 2>
- <campo 3>

Antes de entregar el modelo final, validar:
- relaciones correctas
- integridad referencial
- consistencia con el dominio
- soporte para el flujo del MVP
```

---

## Ejemplo de uso

```txt
/generate-database-model

Feature: Investment Confirmation

Crear o validar el modelo Investment.

Debe relacionarse con:
- Investor
- InvestmentOpportunity

Debe almacenar:
- amount
- status
- confirmedAt
- expectedReturn
- riskLevel

Antes de entregar el modelo final, validar:
- relaciones correctas
- integridad referencial
- consistencia con el dominio
- soporte para el flujo del MVP
```

---

## Resultado esperado

El comando debe devolver una respuesta con esta estructura:

```txt
Feature evaluada:
<nombre de la feature>

Agente principal:
database-prisma-agent.md

Skills aplicados:
database-prisma.skill.md
...

Modelo propuesto o revisado:
<modelo Prisma>

Relaciones:
- Relación 1
- Relación 2

Campos:
- Campo obligatorio
- Campo opcional
- Campo calculado o derivado, si aplica

Índices y restricciones:
- Índice 1
- Unique 1

Migración sugerida:
npx prisma migrate dev --name <nombre>

Seed data sugerido:
- Dato 1
- Dato 2

Impacto en backend:
- DTOs afectados
- Repositories afectados
- Services afectados

Impacto en frontend:
- Tipos afectados
- Schemas Zod afectados
- Hooks afectados

Pruebas necesarias:
- Repository tests
- API tests
- Contract tests

Checklist:
[ ] Soporta el flujo del MVP.
[ ] No duplica datos.
[ ] Tiene relaciones claras.
[ ] Usa UUID.
[ ] Usa Decimal en montos.
[ ] Tiene auditoría.
[ ] Mantiene bajo acoplamiento.
```

---

## Comandos Prisma recomendados

### Desarrollo

```bash
npx prisma format
npx prisma validate
npx prisma migrate dev --name <nombre_migracion>
npx prisma generate
npx prisma db seed
```

### Staging y producción

```bash
npx prisma migrate deploy
npx prisma generate
```

---

## Quality gate

El modelo no debe aprobarse si:

```txt
[ ] Rompe relaciones existentes.
[ ] Duplica datos innecesariamente.
[ ] Usa nombres fuera de la convención.
[ ] No soporta dashboard, detalle, simulación o confirmación.
[ ] Obliga a saltarse la capa Repository.
[ ] No define integridad referencial.
[ ] No define índices para consultas frecuentes.
[ ] No contempla pruebas necesarias.
[ ] No contempla migración.
```
