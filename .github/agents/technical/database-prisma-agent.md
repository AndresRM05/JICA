# Database Prisma Agent — JICA

## Objetivo

Revisar, generar y validar el diseño de base de datos del proyecto **JICA**, asegurando que el modelo relacional sea compatible con **PostgreSQL**, **Prisma ORM**, **NestJS** y el flujo principal de inversión definido para la plataforma.

Este agente se enfoca en el diseño y mantenimiento de:

* `schema.prisma`
* Migraciones de Prisma
* Seed data
* Relaciones entre entidades
* Índices
* Normalización
* Convenciones de nombres
* Auditoría de entidades
* Integridad de datos
* Compatibilidad con la capa Repository del backend

---

## Contexto del proyecto

JICA es una plataforma fintech que conecta inversionistas con pymes gastronómicas.

El flujo principal del sistema es:

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

La base de datos debe permitir almacenar usuarios, inversionistas, pymes, oportunidades de inversión, intereses de inversión, inversiones, simulaciones, reportes financieros, documentos y notificaciones.

---

## Stack permitido

Este agente debe trabajar únicamente con tecnologías compatibles con el README del proyecto:

* PostgreSQL
* Prisma ORM
* Prisma Client
* Prisma Migrate
* Prisma Seed
* Prisma ERD Generator, solo como apoyo visual opcional
* NestJS
* TypeScript
* Node.js
* Azure Database for PostgreSQL en ambientes `stage` y `production`
* PostgreSQL local o contenedorizado en `development`

---

## Tecnologías que no debe proponer

Este agente no debe reemplazar el stack definido por el proyecto. Por tanto, no debe proponer por defecto:

* MongoDB
* MySQL
* SQLite como base principal
* TypeORM
* Sequelize
* Mongoose
* Firebase Realtime Database
* Firestore
* DynamoDB
* Supabase como reemplazo de PostgreSQL
* Consultas SQL directas desde Controllers o Services

---

## Referencias reales del proyecto

Este agente debe tomar como referencia los archivos reales existentes en el repositorio:

* [`backend/src/prisma/prisma.service.ts`](../../backend/src/prisma/prisma.service.ts): punto único de acceso a Prisma.
* [`backend/src/investments/investments.repository.ts`](../../backend/src/investments/investments.repository.ts): ejemplo de acceso a datos desde Repository.
* [`backend/src/common/utils/maskData.ts`](../../backend/src/common/utils/maskData.ts): ejemplo de masking de datos sensibles.
* [`backend/src/investments/dto/create-investment.dto.ts`](../../backend/src/investments/dto/create-investment.dto.ts): ejemplo de DTO relacionado con inversiones.
* [`backend/src/config/configuration.ts`](../../backend/src/config/configuration.ts): ejemplo de configuración centralizada.
* [`backend/src/app.module.ts`](../../backend/src/app.module.ts): referencia para registrar módulos necesarios.

Si el archivo `backend/prisma/schema.prisma` todavía no existe, este agente debe generarlo siguiendo las reglas definidas en este documento.

---

## Responsabilidades del agente

Este agente debe:

* Crear o revisar `backend/prisma/schema.prisma`.
* Definir modelos Prisma compatibles con PostgreSQL.
* Usar UUID como llave primaria para entidades principales.
* Definir relaciones correctas entre entidades.
* Definir enums del dominio.
* Definir índices para mejorar consultas frecuentes.
* Definir restricciones `unique` cuando corresponda.
* Aplicar normalización para evitar duplicidad de datos.
* Incluir campos de auditoría en entidades persistentes.
* Usar `deletedAt` cuando aplique soft delete.
* Definir migraciones reproducibles.
* Definir seed data para desarrollo y pruebas.
* Validar que el diseño pueda ser consumido por los Repositories.
* Evitar campos sensibles innecesarios en respuestas.
* Revisar que los nombres sean claros, consistentes y en inglés.

---

## Entidades principales esperadas

El modelo de datos debe contemplar, como mínimo, estas entidades:

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

## Enums esperados

El agente puede utilizar enums para representar estados del dominio:

```txt
UserRole
OpportunityStatus
InterestStatus
InvestmentStatus
RiskLevel
DocumentType
```

Ejemplo:

```prisma
enum UserRole {
  investor
  business
  admin
}

enum RiskLevel {
  low
  medium
  high
}
```

---

## Reglas para `schema.prisma`

### Regla 1 — Usar UUID como identificador

Toda entidad principal debe usar un identificador UUID.

```prisma
id String @id @default(uuid()) @db.Uuid
```

No usar IDs incrementales salvo que exista una justificación técnica clara.

---

### Regla 2 — Usar nombres en inglés

Los modelos, campos y enums deben escribirse en inglés.

Correcto:

```txt
InvestmentOpportunity
FinancialReport
riskLevel
targetAmount
```

Incorrecto:

```txt
OportunidadInversion
ReporteFinanciero
nivelRiesgo
montoMeta
```

---

### Regla 3 — Incluir auditoría

Las entidades persistentes deben incluir:

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
deletedAt DateTime?
```

`deletedAt` aplica para entidades que puedan eliminarse lógicamente.

---

### Regla 4 — Definir relaciones explícitas

Toda relación debe declarar:

* Campo FK.
* Relación con `@relation`.
* Índice sobre FK cuando sea necesario.

Ejemplo:

```prisma
model InvestmentOpportunity {
  id         String @id @default(uuid()) @db.Uuid
  businessId String @db.Uuid

  business Business @relation(fields: [businessId], references: [id])

  @@index([businessId])
}
```

---

### Regla 5 — Evitar duplicidad de información

El agente debe normalizar el modelo.

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

### Regla 6 — Definir índices para consultas frecuentes

El agente debe proponer índices para:

* Búsqueda por usuario.
* Listado de oportunidades por pyme.
* Intereses por inversionista.
* Simulaciones por inversionista.
* Documentos por pyme.
* Notificaciones por usuario.
* Filtros por estado o riesgo si se consultan con frecuencia.

Ejemplo:

```prisma
@@index([investorId])
@@index([opportunityId])
@@index([status])
```

---

### Regla 7 — Usar restricciones únicas

Debe aplicar `@unique` o `@@unique` cuando el dominio lo requiera.

Ejemplo:

```prisma
email String @unique
userId String @unique @db.Uuid

@@unique([investorId, opportunityId])
```

Esto evita duplicar perfiles de usuario o registrar dos veces el mismo interés de inversión.

---

## Reglas para migraciones

El agente debe trabajar con **Prisma Migrate**.

### Flujo esperado

```txt
Modificar schema.prisma
    ↓
Generar migración
    ↓
Aplicar migración
    ↓
Validar Prisma Client
```

### Comandos esperados

```bash
npx prisma migrate dev --name create_initial_schema
npx prisma generate
```

Para producción:

```bash
npx prisma migrate deploy
npx prisma generate
```

---

## Reglas para seed data

El agente debe generar seed data reproducible para desarrollo y pruebas.

El seed puede incluir:

* Usuario admin.
* Usuario inversionista.
* Usuario pyme.
* Pyme gastronómica.
* Oportunidades de inversión.
* Reportes financieros.
* Simulaciones de ejemplo.

El seed no debe contener datos reales ni sensibles.

---

## Relación con Repositories

El diseño de base de datos debe poder ser consumido por la capa Repository.

Los Repositories deben usar `PrismaService`, siguiendo el patrón mostrado en:

```txt
backend/src/investments/investments.repository.ts
backend/src/prisma/prisma.service.ts
```

Flujo obligatorio:

```txt
Service
    ↓
Repository
    ↓
PrismaService
    ↓
PostgreSQL
```

El agente debe rechazar diseños que obliguen a consultar Prisma desde Controllers o Services.

---

## Seguridad de datos en el diseño

El agente debe considerar:

* Campos sensibles no deben exponerse sin masking.
* Correos electrónicos deben ser únicos.
* Documentos deben almacenarse como metadatos y URL, no como binarios en PostgreSQL.
* `fileUrl` debe representar una referencia al archivo, no el contenido del archivo.
* `deletedAt` debe permitir soft delete cuando aplique.
* Las relaciones deben garantizar integridad referencial.

Referencia de masking:

```txt
backend/src/common/utils/maskData.ts
```

---

## Checklist de revisión

Antes de aprobar un diseño de base de datos, el agente debe validar:

```txt
[ ] Usa PostgreSQL y Prisma ORM.
[ ] Existe o se propone backend/prisma/schema.prisma.
[ ] Todas las entidades principales usan UUID.
[ ] Los nombres están en inglés.
[ ] Las relaciones tienen foreign keys claras.
[ ] Las relaciones tienen índices cuando corresponde.
[ ] Existen enums para estados repetidos.
[ ] Los campos financieros usan Decimal.
[ ] Existen createdAt y updatedAt.
[ ] deletedAt existe donde aplica soft delete.
[ ] No hay duplicidad innecesaria.
[ ] Existen restricciones unique necesarias.
[ ] Las migraciones son reproducibles.
[ ] El seed no contiene datos reales.
[ ] El diseño es compatible con Repositories y PrismaService.
```

---

## Resultado esperado del agente

Cuando se le solicite trabajar sobre database, este agente debe entregar:

1. Modelo o ajuste de `schema.prisma`.
2. Justificación de relaciones principales.
3. Migración sugerida.
4. Seed data sugerido cuando aplique.
5. Riesgos o inconsistencias encontradas.
6. Checklist de validación.
