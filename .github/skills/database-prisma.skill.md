# database-prisma.skill.md — JICA

## Cuándo usar este skill

Usa este skill cuando se genere, revise o refactorice cualquier elemento relacionado con la base de datos de JICA:

* `schema.prisma`
* Modelos Prisma
* Relaciones
* Índices
* Migraciones
* Seed data
* Normalización
* Convenciones de nombres
* Auditoría
* Soft delete
* Repositories que consumen Prisma

Este skill debe ser utilizado principalmente por:

* `database-prisma-agent`
* `backend-repository-agent`
* `backend-service-agent`
* `architecture-validator`

---

## Objetivo

Asegurar que la base de datos de JICA sea consistente, normalizada, escalable y compatible con el stack oficial del proyecto:

```txt
PostgreSQL
Prisma ORM
NestJS
TypeScript
Prisma Migrate
Prisma Client
```

---

## Principios obligatorios

### 1. PostgreSQL es la base principal

Todo diseño debe asumir PostgreSQL como motor de base de datos relacional.

No proponer MongoDB, MySQL, SQLite, Firestore, DynamoDB ni motores alternativos como reemplazo del modelo principal.

---

### 2. Prisma ORM es la capa de acceso

El acceso a datos debe pasar por Prisma ORM y por la capa Repository del backend.

Flujo obligatorio:

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

Referencias del proyecto:

```txt
backend/src/prisma/prisma.service.ts
backend/src/investments/investments.repository.ts
```

---

### 3. `schema.prisma` es la fuente de verdad

La estructura de la base de datos debe originarse en:

```txt
backend/prisma/schema.prisma
```

No se deben crear tablas manualmente en ambientes compartidos.

---

## Modelos esperados

El skill debe priorizar estas entidades:

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

## Reglas de modelado

### UUID en entidades principales

```prisma
id String @id @default(uuid()) @db.Uuid
```

### Auditoría

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
deletedAt DateTime?
```

### Campos financieros

Los montos, ROI, ingresos, gastos y retornos deben usar `Decimal`.

```prisma
targetAmount Decimal
currentAmount Decimal
estimatedReturn Decimal
```

### Relaciones explícitas

```prisma
businessId String @db.Uuid
business Business @relation(fields: [businessId], references: [id])
```

### Índices

Agregar índices para foreign keys y filtros frecuentes.

```prisma
@@index([businessId])
@@index([investorId])
@@index([opportunityId])
@@index([status])
```

### Unicidad

Usar `@unique` o `@@unique` cuando aplique.

```prisma
email String @unique
userId String @unique @db.Uuid
@@unique([investorId, opportunityId])
```

---

## Normalización

El modelo debe evitar datos duplicados.

Incorrecto:

```prisma
model InvestmentOpportunity {
  businessName String
  businessEmail String
}
```

Correcto:

```prisma
model InvestmentOpportunity {
  businessId String @db.Uuid
  business Business @relation(fields: [businessId], references: [id])
}
```

---

## Convenciones de nombres

### Modelos

Usar PascalCase en singular.

```txt
User
Business
InvestmentOpportunity
FinancialReport
```

### Campos

Usar camelCase.

```txt
firstName
lastName
targetAmount
riskLevel
```

### Foreign keys

Usar el formato `{entity}Id`.

```txt
userId
businessId
investorId
opportunityId
```

### Enums

Usar PascalCase para el enum y lowercase para los valores.

```prisma
enum RiskLevel {
  low
  medium
  high
}
```

---

## Migraciones

Usar Prisma Migrate.

### Desarrollo

```bash
npx prisma migrate dev --name nombre_descriptivo
npx prisma generate
```

### Staging y producción

```bash
npx prisma migrate deploy
npx prisma generate
```

Nunca modificar migraciones ya aplicadas en otros ambientes.

---

## Seed data

El seed debe ser:

* Reproducible.
* Seguro.
* Sin datos reales.
* Útil para pruebas y desarrollo.
* Compatible con el flujo principal del inversionista.

Debe incluir datos como:

```txt
admin@jica.com
investor@jica.com
business@jica.com
Café Tico
Costa Verde Café
Oportunidad de expansión
Simulación de ejemplo
```

---

## Seguridad de datos

El diseño debe evitar exposición innecesaria de información sensible.

Reglas:

* No guardar binarios de documentos directamente en PostgreSQL.
* Guardar únicamente metadata y `fileUrl` para documentos.
* Usar `select` explícito desde Repositories.
* Aplicar masking antes de retornar datos sensibles.
* Mantener `deletedAt` para soft delete cuando aplique.
* No duplicar datos personales en varias tablas.

Referencia:

```txt
backend/src/common/utils/maskData.ts
```

---

## Checklist antes de aprobar

```txt
[ ] Usa PostgreSQL.
[ ] Usa Prisma ORM.
[ ] Usa UUID en entidades principales.
[ ] Define relaciones explícitas.
[ ] Define índices para foreign keys.
[ ] Define unique constraints necesarias.
[ ] Usa Decimal para montos.
[ ] Incluye createdAt y updatedAt.
[ ] Usa deletedAt donde aplica.
[ ] Evita duplicación de datos.
[ ] Usa nombres en inglés.
[ ] Es compatible con Repository Pattern.
[ ] No obliga a consultar Prisma fuera de Repository.
[ ] Tiene migraciones reproducibles.
[ ] Tiene seed data seguro.
```
