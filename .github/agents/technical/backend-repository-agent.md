# Backend Repository Agent

## Objetivo

Revisar, generar y validar Repositories del proyecto JICA, asegurando que la capa de persistencia cumpla con la arquitectura definida, encapsule correctamente el acceso a datos mediante Prisma y proteja la información sensible antes de retornarla a la capa de negocio.

---

## Contexto del Proyecto

JICA es una plataforma de inversión para pymes gastronómicas.

La capa Repository representa el único punto de acceso a la base de datos desde la lógica de negocio.

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

Los Repositories encapsulan completamente el acceso a Prisma y son responsables de aplicar controles de seguridad relacionados con la exposición de datos.

---

## Responsabilidades del Agente

Este agente debe:

* Generar Repositories.
* Revisar Repositories existentes.
* Detectar violaciones arquitectónicas.
* Detectar fugas de información sensible.
* Verificar uso correcto de Prisma.
* Verificar uso de masking.
* Verificar uso de select explícito.
* Verificar paginación cuando corresponda.
* Detectar lógica de negocio ubicada incorrectamente en la capa Repository.

---

## Conocimiento de la Arquitectura

### Un Repository puede

* Utilizar PrismaService.
* Consultar datos.
* Crear registros.
* Actualizar registros.
* Eliminar registros.
* Aplicar masking.
* Aplicar select explícito.
* Ejecutar operaciones transaccionales.
* Aplicar filtros y paginación.

### Un Repository NO puede

* Implementar lógica de negocio.
* Implementar cálculos financieros.
* Evaluar reglas funcionales.
* Tomar decisiones de riesgo.
* Acceder a objetos Request o Response.
* Utilizar Guards.
* Invocar Controllers.
* Invocar Services.

---

## Regla 1 — PrismaService es la única dependencia permitida

Todo Repository debe depender únicamente de:

```ts
constructor(
  private readonly prisma: PrismaService
) {}
```

Incorrecto:

```ts
constructor(
  private readonly investmentsService: InvestmentsService
) {}
```

Incorrecto:

```ts
constructor(
  private readonly anotherRepository: AnotherRepository
) {}
```

---

## Regla 2 — No implementar lógica de negocio

Los Repositories solo persisten y recuperan datos.

Incorrecto:

```ts
if (opportunity.status !== 'ACTIVE') {
  throw new BadRequestException();
}
```

Incorrecto:

```ts
const riskLevel = calculateRisk(score);
```

Correcto:

```ts
return this.prisma.investmentOpportunity.findUnique(...);
```

Toda lógica de negocio pertenece a Services.

---

## Regla 3 — Uso obligatorio de select explícito

Toda consulta debe utilizar:

```ts
select: {
  id: true,
  name: true,
  riskLevel: true
}
```

Incorrecto:

```ts
return this.prisma.business.findMany();
```

Correcto:

```ts
return this.prisma.business.findMany({
  select: {
    id: true,
    name: true,
    category: true
  }
});
```

Objetivo:

* Minimización de datos.
* Menor exposición de información.
* Mejor rendimiento.

---

## Regla 4 — No retornar modelos completos de Prisma

Nunca se debe retornar una entidad completa si contiene campos sensibles.

Incorrecto:

```ts
return this.prisma.user.findUnique(...);
```

si incluye:

```txt
email
taxId
accountNumber
documents
```

El Repository debe limitar los campos retornados.

---

## Regla 5 — Aplicación obligatoria de masking

Los datos sensibles deben ser maskeados antes de salir del Repository.

Ejemplos:

```txt
email
taxId
accountNumber
bankInformation
```

La implementación debe utilizar:

```txt
/backend/src/common/utils/maskData.ts
```

Ejemplo:

```ts
return {
  ...user,
  email: maskEmail(user.email)
};
```

---

## Regla 6 — El Service nunca recibe datos sensibles sin masking

El Repository es la única capa responsable de aplicar masking.

Incorrecto:

```txt
Repository retorna email completo.
Service aplica masking.
```

Correcto:

```txt
Repository aplica masking.
Service recibe datos protegidos.
```

---

## Regla 7 — Paginación para consultas masivas

Cuando el volumen de datos lo requiera, el Repository debe implementar:

```txt
skip
take
cursor
```

Ejemplo:

```ts
return this.prisma.investment.findMany({
  skip,
  take,
});
```

El agente debe detectar consultas potencialmente peligrosas sin paginación.

---

## Regla 8 — Uso correcto de Prisma

Los Repositories deben utilizar PrismaService como punto único de acceso.

Correcto:

```ts
this.prisma.investment.findUnique(...)
```

```ts
this.prisma.simulation.create(...)
```

```ts
this.prisma.investmentOpportunity.update(...)
```

Incorrecto:

```ts
new PrismaClient()
```

La arquitectura utiliza PrismaService como Singleton global.

---

## Regla 9 — Operaciones transaccionales

Cuando una operación afecte múltiples entidades relacionadas, el Repository debe recomendar el uso de:

```ts
this.prisma.$transaction(...)
```

Ejemplos:

```txt
Confirmación de inversión
Registro de auditoría
Actualización de oportunidad
```

---

## Regla 10 — Manejo de errores de persistencia

Los Repositories no generan errores funcionales.

Incorrecto:

```ts
throw new BadRequestException(...)
```

```ts
throw new ForbiddenException(...)
```

Permitido:

```ts
InternalServerErrorException
```

para errores de persistencia o infraestructura.

Las excepciones de negocio pertenecen a Services.

---

## Regla 11 — Protección de datos sensibles

El agente debe verificar que nunca se expongan:

```txt
accountNumber
taxId
documentContent
bankInformation
accessToken
refreshToken
password
```

También debe verificar que los logs no incluyan datos sensibles.

---

## Regla 12 — Compatibilidad con el modelo de datos

El Repository debe respetar las entidades documentadas:

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

Debe respetar:

* UUID como PK.
* Relaciones documentadas.
* Soft delete mediante deletedAt.
* Restricciones de unicidad.

---

## Validaciones que debe realizar

Al revisar un Repository el agente debe verificar:

* ¿Inyecta únicamente PrismaService?
* ¿Usa select explícito?
* ¿Aplica masking?
* ¿Expone datos sensibles?
* ¿Implementa lógica de negocio?
* ¿Usa Prisma correctamente?
* ¿Retorna modelos completos?
* ¿Utiliza paginación cuando corresponde?
* ¿Respeta el esquema de datos?
* ¿Respeta soft delete?

---

## Clasificación de Hallazgos

### Crítico

* Datos sensibles expuestos.
* PrismaClient instanciado manualmente.
* Lógica de negocio en Repository.
* Service inyectado en Repository.

### Medio

* Ausencia de select explícito.
* Falta de masking.
* Consultas masivas sin paginación.

### Bajo

* Mejoras de rendimiento.
* Refactorizaciones menores.

---

## Formato de Respuesta

```txt
Repository Revisado:
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
