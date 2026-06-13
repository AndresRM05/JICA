# backend-layered-architecture.skill.md — MVP Local

## Cuándo usar este skill

Usa este skill cuando se genere, revise o refactorice código del backend de JICA relacionado con:

* Controllers
* Services
* Repositories
* DTOs
* Módulos NestJS
* PrismaService
* Flujo entre capas
* Organización interna de módulos backend
* Separación de responsabilidades

Este skill debe ser utilizado por agentes como:

* `backend-api-agent`
* `backend-controller-agent`
* `backend-service-agent`
* `backend-repository-agent`
* `architecture-validator`
* `solid-reviewer`
* `cohesion-coupling-reviewer`

---

## Objetivo

Asegurar que el backend de JICA respete la arquitectura por capas definida para el MVP académico local, manteniendo separación de responsabilidades, bajo acoplamiento, alta cohesión y consistencia entre documentación e implementación.

Este skill debe evitar que Copilot genere código innecesariamente complejo, dependiente de servicios cloud o fuera del alcance del MVP.

---

## Contexto del proyecto

JICA es una plataforma de inversión para pymes gastronómicas.

El MVP académico se enfoca en el flujo principal del inversionista:

```txt
Registro de inversionista
    ↓
Login
    ↓
Dashboard de oportunidades
    ↓
Detalle de oportunidad de inversión
    ↓
Simulación de inversión
    ↓
Confirmación de inversión
```

El backend del MVP está construido con:

* Node.js
* TypeScript
* NestJS
* PostgreSQL local
* Prisma ORM
* JWT local
* bcrypt
* class-validator
* Jest
* Supertest
* Swagger / OpenAPI

---

## Restricción principal del MVP

Este skill debe guiar la generación y revisión de código únicamente para un MVP académico local.

No debe proponer, exigir ni generar código que dependa de:

* Azure
* Microsoft Entra ID
* MSAL
* Firebase Auth
* Azure Key Vault
* Azure Blob Storage
* Azure App Service
* Azure Application Insights
* Sentry
* Redis
* BullMQ
* Socket.io
* Servicios cloud o pagos
* Procesos en background
* Infraestructura de producción
* Auditoría avanzada obligatoria
* Reportes financieros complejos

Si el README menciona tecnologías de producción, este skill debe considerarlas fuera del alcance del MVP, salvo que el usuario solicite explícitamente implementarlas.

---

## Arquitectura obligatoria

Todo flujo del backend debe respetar esta estructura:

```txt
Request HTTP
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
PrismaService
    ↓
PostgreSQL local
```

Ninguna capa puede saltarse otra capa.

El flujo debe ser siempre descendente. Las capas inferiores no deben depender de capas superiores.

---

## Responsabilidad de cada capa

## Controller

El Controller recibe solicitudes HTTP y delega la operación al Service correspondiente.

### Puede:

* Definir rutas REST.
* Recibir `body`, `params` y `query`.
* Aplicar Guards.
* Aplicar Roles.
* Utilizar DTOs.
* Retornar la respuesta del Service.
* Documentar endpoints con Swagger.
* Obtener el usuario autenticado mediante `@CurrentUser()`.

### No puede:

* Contener lógica de negocio.
* Acceder a Prisma.
* Acceder a Repositories.
* Ejecutar cálculos financieros.
* Validar reglas de negocio.
* Formatear manualmente errores.
* Acceder directamente a la base de datos.
* Instanciar servicios externos.
* Usar servicios cloud.
* Acceder directamente a `req.user`.

---

## Service

El Service contiene la lógica de negocio del sistema.

### Puede:

* Validar reglas de negocio.
* Orquestar uno o más Repositories.
* Invocar otros Services exportados por módulos.
* Ejecutar cálculos financieros simples del MVP.
* Confirmar inversiones.
* Ejecutar simulaciones.
* Validar estado de oportunidades.
* Validar monto de inversión.
* Validar propiedad de recursos.
* Lanzar excepciones de negocio.
* Usar bcrypt en `AuthService`.
* Generar JWT local en `AuthService`.

### No puede:

* Acceder directamente a `PrismaService`.
* Ejecutar consultas Prisma.
* Instanciar `PrismaClient`.
* Acceder al objeto HTTP `Request` o `Response`.
* Definir rutas.
* Manejar decoradores propios de Controllers.
* Formatear respuestas HTTP.
* Enviar notificaciones en tiempo real.
* Encolar procesos con Redis o BullMQ.
* Subir archivos a servicios cloud.

---

## Repository

El Repository encapsula el acceso a la base de datos.

### Puede:

* Inyectar `PrismaService`.
* Consultar datos.
* Crear registros.
* Actualizar registros.
* Eliminar o desactivar registros.
* Aplicar `select` explícito.
* Aplicar masking de datos sensibles cuando corresponda.
* Implementar paginación.
* Ejecutar transacciones cuando aplique.
* Retornar `null` cuando un registro no existe.

### No puede:

* Contener lógica de negocio.
* Validar reglas funcionales.
* Ejecutar cálculos financieros.
* Lanzar excepciones de negocio como `BadRequestException` o `ForbiddenException`.
* Inyectar Services.
* Inyectar otros Repositories.
* Retornar modelos completos de Prisma con datos sensibles.
* Acceder a `Request` o `Response`.
* Usar Guards o decorators HTTP.
* Instanciar `PrismaClient`.

---

## PrismaService

`PrismaService` es el único punto autorizado para comunicarse con PostgreSQL local.

### Debe:

* Gestionar la conexión con PostgreSQL.
* Proveer el cliente Prisma tipado.
* Ser utilizado únicamente desde Repositories.
* Registrarse mediante `PrismaModule`.

### No debe:

* Contener lógica de negocio.
* Validar reglas funcionales.
* Formatear datos para la API.
* Ser inyectado en Controllers o Services.
* Conectarse a servicios cloud.
* Instanciarse manualmente fuera de su módulo.

---

## Reglas obligatorias de dependencia

## Regla 1 — Controllers solo inyectan su propio Service

Correcto:

```ts
constructor(
  private readonly investmentsService: InvestmentsService,
) {}
```

Incorrecto:

```ts
constructor(
  private readonly prisma: PrismaService,
) {}
```

Incorrecto:

```ts
constructor(
  private readonly investmentsRepository: InvestmentsRepository,
) {}
```

---

## Regla 2 — Services inyectan Repositories y Services justificados

Un Service puede inyectar Repositories y otros Services exportados explícitamente por otros módulos.

Correcto:

```ts
constructor(
  private readonly investmentsRepository: InvestmentsRepository,
  private readonly simulationService: SimulationService,
) {}
```

Incorrecto:

```ts
constructor(
  private readonly prisma: PrismaService,
) {}
```

Incorrecto:

```ts
constructor(
  private readonly request: Request,
) {}
```

El Service no debe depender de infraestructura HTTP.

---

## Regla 3 — Repositories solo inyectan PrismaService

Correcto:

```ts
constructor(
  private readonly prisma: PrismaService,
) {}
```

Incorrecto:

```ts
constructor(
  private readonly investmentsService: InvestmentsService,
) {}
```

Incorrecto:

```ts
constructor(
  private readonly usersRepository: UsersRepository,
) {}
```

Incorrecto:

```ts
constructor(
  private readonly azureBlobService: AzureBlobService,
) {}
```

---

## Regla 4 — PrismaService solo se usa en Repositories

No se permite inyectar `PrismaService` en:

```txt
Controllers
Services
Guards
DTOs
Interceptors
Utilities
```

Correcto:

```txt
InvestmentsRepository → PrismaService
```

Incorrecto:

```txt
InvestmentsService → PrismaService
InvestmentsController → PrismaService
```

---

## Regla 5 — No saltarse capas

No se permite:

```txt
Controller → Repository
Controller → PrismaService
Service → PrismaService
Repository → Service
Repository → Controller
```

Flujo correcto:

```txt
Controller → Service → Repository → PrismaService
```

---

## Organización por módulos

El backend debe organizarse por dominio de negocio.

Estructura esperada:

```txt
/backend/src/{module}/
├── dto/
│   ├── create-{module}.dto.ts
│   ├── update-{module}.dto.ts
│   ├── get-{module}-query.dto.ts
│   └── {module}-response.dto.ts
├── {module}.controller.ts
├── {module}.service.ts
├── {module}.repository.ts
└── {module}.module.ts
```

Ejemplo:

```txt
/backend/src/investments/
├── dto/
│   ├── create-investment.dto.ts
│   ├── investment-response.dto.ts
│   └── get-investments-query.dto.ts
├── investments.controller.ts
├── investments.service.ts
├── investments.repository.ts
└── investments.module.ts
```

---

## Módulos esperados para el MVP

Para el MVP local, se deben priorizar estos módulos:

```txt
auth
users
investors
businesses
investments
simulation
health
prisma
common
```

No generar por defecto:

```txt
documents
notifications
audit-log
queues
reports avanzados
admin avanzado
```

Estos módulos pueden quedar para una versión futura o productiva, pero no deben implementarse en el MVP inicial salvo solicitud explícita.

---

## Reglas por módulo

## Regla 6 — Cada módulo debe ser autocontenido

Un módulo debe agrupar su propio:

```txt
Controller
Service
Repository
DTOs
Module
```

No se deben dispersar archivos de un mismo dominio en carpetas no relacionadas.

Correcto:

```txt
investments/investments.service.ts
investments/investments.repository.ts
investments/dto/create-investment.dto.ts
```

Incorrecto:

```txt
services/investments.service.ts
repositories/investments.repository.ts
dtos/create-investment.dto.ts
```

---

## Regla 7 — Código compartido en common

El código reutilizable entre módulos debe vivir en:

```txt
/backend/src/common
```

Ejemplos:

```txt
common/decorators
common/guards
common/filters
common/utils
common/types
```

Funciones utilitarias como `maskEmail`, `formatCurrency` o helpers simples deben ubicarse en `common/utils`.

---

## Regla 8 — Utils sin dependencias de NestJS

Las funciones en `common/utils` deben ser funciones puras.

Correcto:

```ts
export function calculateEstimatedReturn(amount: number, roi: number): number {
  return amount + amount * roi;
}
```

Incorrecto:

```ts
@Injectable()
export class CalculateReturnUtil {
  constructor(private readonly prisma: PrismaService) {}
}
```

Si una función necesita dependencias, probablemente pertenece a un Service.

---

## DTOs y validación

## Regla 9 — Los DTOs no contienen lógica de negocio

Los DTOs definen estructura y validaciones de entrada.

Pueden usar:

```txt
class-validator
class-transformer
Swagger decorators
```

No pueden:

```txt
consultar base de datos
validar reglas funcionales complejas
calcular ROI
calcular riesgo
llamar Services
```

---

## Regla 10 — Validaciones de DTO vs reglas de negocio

Validaciones simples pertenecen al DTO:

```txt
email válido
amount numérico
amount mínimo
campo requerido
UUID válido
longitud mínima
```

Reglas de negocio pertenecen al Service:

```txt
oportunidad existe
oportunidad está abierta
usuario puede invertir
monto no excede el faltante
simulación pertenece al usuario
email ya existe
```

---

## Regla 11 — ValidationPipe global

El backend debe usar `ValidationPipe` global con:

```txt
whitelist: true
forbidNonWhitelisted: true
transform: true
```

Esto debe configurarse en `main.ts`.

---

## Seguridad dentro de la arquitectura

## Regla 12 — Autenticación local con JWT

Para el MVP local, la autenticación debe implementarse con JWT local.

Se permite:

```txt
JwtAuthGuard
JwtStrategy
RolesGuard
@Roles
@CurrentUser
@Public
```

No se permite para el MVP:

```txt
EntraIdGuard
Microsoft Entra ID
MSAL
Firebase Auth
Auth0
servicios externos de autenticación
```

---

## Regla 13 — El usuario autenticado no se obtiene desde req.user directamente

Correcto:

```ts
@Get('me')
getMe(@CurrentUser() user: AuthUser) {
  return user;
}
```

Incorrecto:

```ts
@Get('me')
getMe(@Req() req: Request) {
  return req.user;
}
```

---

## Regla 14 — Seguridad crítica también en Service

Aunque los Guards protejan rutas, las reglas críticas del negocio deben validarse en Services.

Ejemplos:

```txt
Confirmar inversión solo si el usuario es investor.
Confirmar inversión solo si la oportunidad está abierta.
Confirmar inversión solo si el monto es válido.
Simular inversión solo si la oportunidad existe.
```

---

## Persistencia y datos

## Regla 15 — Repositories usan select explícito

Toda consulta Prisma debe usar `select` explícito cuando retorne datos hacia capas superiores.

Correcto:

```ts
return this.prisma.investmentOpportunity.findMany({
  select: {
    id: true,
    title: true,
    projectedRoi: true,
    riskLevel: true,
    status: true,
  },
});
```

Incorrecto:

```ts
return this.prisma.investmentOpportunity.findMany();
```

---

## Regla 16 — No exponer datos sensibles

No se deben retornar:

```txt
password
passwordHash
JWT_SECRET
tokens internos
accountNumber
taxId
documentContent
bankInformation
secret keys
```

Excepción:

```txt
passwordHash puede ser seleccionado únicamente en métodos internos de AuthRepository o UsersRepository usados por AuthService para validar login.
```

---

## Regla 17 — Soft delete si existe deletedAt

Si una entidad usa `deletedAt`, las consultas de negocio deben filtrar:

```ts
where: {
  deletedAt: null,
}
```

---

## Regla 18 — Transacciones donde aplique

Si una operación modifica múltiples entidades relacionadas, debe utilizarse una transacción en el Repository.

Ejemplos:

```txt
Crear usuario + crear investor
Crear usuario + crear business
Confirmar inversión + actualizar currentAmount
```

La decisión de negocio ocurre en el Service; la operación persistente transaccional ocurre en el Repository.

---

## Reglas de negocio mínimas del MVP

El MVP debe soportar como mínimo:

```txt
registro local de usuario
login local con JWT
consulta de oportunidades
consulta de detalle de oportunidad
simulación de inversión
confirmación de inversión
```

---

## Simulación de inversión

La simulación debe ser simple para el MVP.

Flujo esperado:

```txt
1. Recibir opportunityId y amount.
2. Validar amount > 0.
3. Buscar oportunidad.
4. Verificar que la oportunidad esté abierta.
5. Calcular estimatedReturn.
6. Retornar resultado.
```

Fórmula base:

```txt
estimatedReturn = amount + (amount * roi)
```

No obligar:

```txt
métricas financieras avanzadas
Strategy Pattern
Factory Pattern
reportes complejos
procesos en background
```

---

## Confirmación de inversión

Flujo mínimo esperado:

```txt
1. Recibir usuario autenticado, opportunityId y amount.
2. Validar que el usuario tenga rol investor.
3. Buscar oportunidad.
4. Verificar que la oportunidad esté abierta.
5. Validar amount > 0.
6. Validar que amount no exceda el faltante, si aplica.
7. Crear inversión.
8. Actualizar currentAmount de la oportunidad.
9. Retornar confirmación.
```

No obligar:

```txt
AuditLogService
notificaciones
Socket.io
BullMQ
procesos asíncronos
```

---

## Testing mínimo asociado a la arquitectura

El backend debe incluir pruebas gratuitas y locales usando:

```txt
Jest
Supertest
```

Pruebas recomendadas:

```txt
AuthService
InvestmentsService
SimulationService
InvestmentsController
SimulationController
AuthController
```

No generar pruebas que dependan de:

```txt
Azure
Microsoft Entra ID
Redis
BullMQ
Socket.io
Sentry
servicios externos
```

---

## Violaciones críticas

Reportar como críticas:

* Controller accede a Repository.
* Controller accede a PrismaService.
* Controller contiene lógica de negocio.
* Service accede a PrismaService.
* Service instancia PrismaClient.
* Repository inyecta Service.
* Repository inyecta otro Repository.
* Repository contiene lógica de negocio.
* PrismaService usado fuera de Repository.
* Uso de Microsoft Entra ID, MSAL, EntraIdGuard o Firebase Auth en el MVP.
* Uso de Azure, Redis, BullMQ, Socket.io, Sentry o servicios cloud.
* Datos sensibles expuestos.
* `passwordHash` expuesto fuera de métodos internos de autenticación.
* Confirmación de inversión sin validación de oportunidad o monto.
* Simulación sin validación de monto.

---

## Violaciones medias

Reportar como medias:

* DTO con lógica de negocio.
* Falta de DTO en endpoint con body.
* Repository sin `select` explícito.
* Query masiva sin paginación.
* Service con demasiadas dependencias.
* Módulo con baja cohesión.
* Código compartido duplicado en varios módulos.
* No filtrar `deletedAt: null` cuando aplica.
* No usar transacción en operación multi-entidad.
* Implementar módulos fuera del MVP sin justificación.
* Usar Strategy o Factory sin necesidad clara para el MVP.

---

## Violaciones bajas

Reportar como bajas:

* Nombres poco descriptivos.
* Métodos demasiado largos.
* Organización mejorable de imports.
* Duplicación menor de código.
* Swagger incompleto.
* Mensajes de error mejorables.
* Comentarios innecesarios.
* Archivos con responsabilidades poco claras pero no críticas.

---

## Checklist de revisión

Cuando se use este skill, validar:

```txt
[ ] Controller solo inyecta su Service.
[ ] Controller no contiene lógica de negocio.
[ ] Controller no accede a Prisma ni Repositories.
[ ] Service usa Repositories.
[ ] Service no accede a PrismaService.
[ ] Service no instancia PrismaClient.
[ ] Repository solo inyecta PrismaService.
[ ] Repository no contiene lógica de negocio.
[ ] PrismaService solo se usa en Repositories.
[ ] DTOs no contienen lógica de negocio.
[ ] Validaciones simples están en DTOs.
[ ] Reglas funcionales están en Services.
[ ] Repositories usan select explícito.
[ ] No se exponen datos sensibles.
[ ] JWT local se usa para autenticación.
[ ] No se usa Microsoft Entra ID, MSAL ni Firebase Auth.
[ ] No se usan Azure, Redis, BullMQ, Socket.io ni Sentry.
[ ] Los módulos corresponden al alcance del MVP.
[ ] Las pruebas son locales con Jest/Supertest.
[ ] El sistema puede ejecutarse localmente.
```

---

## Formato esperado de salida

Cuando este skill sea usado para revisar un módulo o archivo backend, responder con:

```txt
Módulo revisado:
Archivos revisados:

Hallazgos críticos:
-

Hallazgos medios:
-

Hallazgos bajos:
-

Violaciones de capas detectadas:
-

Tecnologías fuera del MVP detectadas:
-

Correcciones recomendadas:
-

Estado final:
APROBADO | REQUIERE CORRECCIONES
```

Cuando este skill sea usado para generar código, responder con:

```txt
Módulo propuesto:
Archivos a generar:
Capas involucradas:
Dependencias permitidas:
Reglas de negocio incluidas:
Restricciones MVP respetadas:
Pruebas recomendadas:
```

---

## Prohibiciones generales

No se permite:

* Controller con lógica de negocio.
* Controller usando Prisma o Repositories.
* Service usando PrismaService.
* Service instanciando PrismaClient.
* Repository usando Services.
* Repository usando otros Repositories.
* PrismaService usado fuera de Repositories.
* DTOs con lógica de negocio.
* Consultas sin `select` explícito cuando retornan datos.
* Retornar modelos completos de Prisma.
* Exponer datos sensibles.
* Retornar `passwordHash` fuera de métodos internos de autenticación.
* Usar EntraIdGuard, Microsoft Entra ID, MSAL o Firebase Auth.
* Usar Azure, Redis, BullMQ, Socket.io, Sentry o servicios cloud.
* Generar módulos fuera del flujo MVP sin justificación.
* Obligar patrones complejos si el MVP puede resolverse de forma simple.

---

## Prioridad del skill

Este skill debe priorizar siempre:

```txt
Arquitectura clara
Capas separadas
Código local
Código gratuito
MVP funcional
Bajo acoplamiento
Alta cohesión
Simplicidad sobre sobreingeniería
```
