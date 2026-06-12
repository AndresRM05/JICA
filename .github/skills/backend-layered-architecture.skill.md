# backend-layered-architecture.skill.md

## Cuándo usar este skill

Usa este skill cuando se genere, revise o refactorice código del backend de JICA relacionado con:

* Controllers
* Services
* Repositories
* DTOs
* Módulos NestJS
* Integración con Prisma
* Flujo entre capas
* Organización interna de módulos backend

Este skill debe ser utilizado por agentes como:

* `backend-api-agent`
* `backend-controller-agent`
* `backend-service-agent`
* `backend-repository-agent`
* `architecture-validator`

---

## Objetivo

Asegurar que el backend de JICA respete la arquitectura por capas definida en el README, manteniendo separación de responsabilidades, bajo acoplamiento, alta cohesión y consistencia entre documentación e implementación.

---

## Contexto del proyecto

JICA es una plataforma de inversión para pymes gastronómicas.

El backend está construido con:

* Node.js
* TypeScript
* NestJS
* PostgreSQL
* Prisma ORM
* Microsoft Entra ID
* Jest
* Supertest
* Swagger / OpenAPI

La arquitectura del backend se organiza por módulos de dominio y sigue una comunicación estrictamente descendente entre capas.

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
PostgreSQL
```

Ninguna capa puede saltarse otra capa.

---

## Responsabilidad de cada capa

### Controller

El Controller recibe solicitudes HTTP y delega la operación al Service correspondiente.

Puede:

* Definir rutas REST.
* Recibir `body`, `params` y `query`.
* Aplicar Guards.
* Aplicar Roles.
* Utilizar DTOs.
* Retornar la respuesta del Service.
* Documentar endpoints con Swagger.

No puede:

* Contener lógica de negocio.
* Acceder a Prisma.
* Acceder a Repositories.
* Ejecutar cálculos financieros.
* Validar reglas de negocio.
* Formatear manualmente errores.
* Acceder directamente a la base de datos.

---

### Service

El Service contiene la lógica de negocio del sistema.

Puede:

* Validar reglas de negocio.
* Orquestar uno o más Repositories.
* Invocar otros Services exportados por módulos.
* Ejecutar cálculos financieros.
* Confirmar inversiones.
* Ejecutar simulaciones.
* Evaluar riesgo.
* Lanzar excepciones de negocio.

No puede:

* Acceder directamente a `PrismaService`.
* Ejecutar consultas Prisma.
* Acceder al objeto HTTP `Request` o `Response`.
* Definir rutas.
* Manejar decoradores propios de Controllers.
* Formatear respuestas HTTP.

---

### Repository

El Repository encapsula el acceso a la base de datos.

Puede:

* Inyectar `PrismaService`.
* Consultar datos.
* Crear registros.
* Actualizar registros.
* Eliminar o desactivar registros.
* Aplicar `select` explícito.
* Aplicar masking de datos sensibles.
* Implementar paginación.
* Ejecutar transacciones cuando aplique.

No puede:

* Contener lógica de negocio.
* Validar reglas funcionales.
* Ejecutar cálculos financieros.
* Lanzar excepciones de negocio como `BadRequestException` o `ForbiddenException`.
* Inyectar Services.
* Inyectar otros Repositories.
* Retornar modelos completos de Prisma con datos sensibles.

---

### PrismaService

`PrismaService` es el único punto autorizado para comunicarse con PostgreSQL.

Debe:

* Gestionar la conexión con PostgreSQL.
* Proveer el cliente Prisma tipado.
* Ser utilizado únicamente desde Repositories.
* Registrarse como servicio global mediante `PrismaModule`.

No debe:

* Contener lógica de negocio.
* Validar reglas funcionales.
* Formatear datos para la API.
* Ser inyectado en Controllers o Services.

---

## Reglas obligatorias de dependencia

### Controllers

Un Controller solo puede inyectar su propio Service.

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

### Services

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

---

### Repositories

Un Repository solo puede inyectar `PrismaService`.

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

---

## Organización obligatoria por módulo

Cada módulo del backend debe organizarse por dominio de negocio.

Estructura esperada:

```txt
/backend/src/{modulo}/
├── dto/
│   ├── create-{modulo}.dto.ts
│   ├── update-{modulo}.dto.ts
│   ├── get-{modulo}-query.dto.ts
│   └── {modulo}-response.dto.ts
├── {modulo}.controller.ts
├── {modulo}.service.ts
├── {modulo}.repository.ts
└── {modulo}.module.ts
```

Ejemplos de módulos esperados:

```txt
auth
users
investors
businesses
investments
simulation
documents
admin
prisma
common
config
```

---

## Reglas de DTOs

Todo dato que entra o sale del sistema debe estar tipado mediante DTOs.

Tipos esperados:

| Tipo                     | Sufijo                 | Uso                         |
| ------------------------ | ---------------------- | --------------------------- |
| Entrada de creación      | `Create{Entidad}Dto`   | Crear recursos              |
| Entrada de actualización | `Update{Entidad}Dto`   | Actualizar recursos         |
| Query params             | `Get{Entidad}QueryDto` | Filtros y paginación        |
| Respuesta                | `{Entidad}ResponseDto` | Datos retornados al cliente |

Reglas:

* Los DTOs deben ubicarse en la carpeta `dto/` del módulo correspondiente.
* Los DTOs de entrada deben usar `class-validator`.
* Los DTOs de actualización deben extender el DTO de creación con `PartialType`.
* Los DTOs de respuesta no deben exponer datos sensibles sin masking.

---

## Reglas de errores por capa

### Controller

No debe lanzar excepciones de negocio ni formatear errores manualmente.

### Service

Puede lanzar excepciones de negocio como:

```txt
NotFoundException
BadRequestException
ForbiddenException
ConflictException
```

### Repository

Solo debe traducir errores inesperados de persistencia a errores técnicos controlados, como:

```txt
InternalServerErrorException
```

No debe lanzar excepciones de negocio.

---

## Reglas de acceso a datos

* Solo los Repositories pueden usar `PrismaService`.
* Ningún Controller puede acceder a Prisma.
* Ningún Service puede acceder directamente a Prisma.
* Toda consulta debe usar `select` explícito.
* No se deben retornar modelos completos con datos sensibles.
* El masking de datos sensibles debe aplicarse antes de retornar datos al Service.

---

## Reglas de comunicación entre módulos

* Un módulo puede depender de otro módulo únicamente mediante Services exportados.
* Un módulo nunca debe importar Repositories internos de otro módulo.
* Si un módulo expone funcionalidad para otros módulos, debe declararlo en `exports`.

Ejemplo correcto:

```ts
@Module({
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
```

Ejemplo incorrecto:

```ts
// InvestmentsService importa UsersRepository directamente
```

---

## Procedimiento para generar una nueva funcionalidad backend

Cuando se genere una nueva funcionalidad, seguir este orden:

```txt
1. Definir DTOs de entrada y salida.
2. Crear o actualizar Repository si requiere persistencia.
3. Crear o actualizar Service con reglas de negocio.
4. Crear o actualizar Controller con rutas HTTP.
5. Registrar providers en el Module.
6. Agregar pruebas unitarias o de integración.
7. Verificar que no se rompan las restricciones de capas.
```

---

## Procedimiento para revisar una funcionalidad backend

Al revisar código backend, validar:

```txt
[ ] El Controller solo depende de su Service.
[ ] El Controller no contiene lógica de negocio.
[ ] El Service contiene las reglas de negocio.
[ ] El Service no accede directamente a Prisma.
[ ] El Repository solo depende de PrismaService.
[ ] El Repository no contiene lógica de negocio.
[ ] Las consultas usan select explícito.
[ ] Los datos sensibles se retornan con masking o no se retornan.
[ ] Los DTOs están en la carpeta dto/.
[ ] Los DTOs de entrada usan class-validator.
[ ] Las excepciones se lanzan desde la capa correcta.
[ ] El módulo respeta la estructura definida.
```

---

## Prohibiciones generales

No se permite:

* Llamar `PrismaService` desde Controllers.
* Llamar `PrismaService` desde Services.
* Inyectar Repositories en Controllers.
* Inyectar Services dentro de Repositories.
* Crear `new PrismaClient()` manualmente.
* Colocar lógica de negocio en Controllers.
* Colocar lógica de negocio en Repositories.
* Retornar entidades completas de Prisma con datos sensibles.
* Crear archivos fuera de la estructura modular definida.
* Mezclar responsabilidades de distintos dominios en un mismo módulo.

---

## Formato esperado de salida al usar este skill

Cuando este skill sea usado para revisar código, responder con:

```txt
Módulo revisado:
Archivos revisados:

Cumplimientos detectados:
-

Violaciones encontradas:
-

Riesgo arquitectónico:
BAJO | MEDIO | ALTO

Correcciones recomendadas:
-

Estado final:
APROBADO | REQUIERE CORRECCIONES
```

Cuando este skill sea usado para generar código, responder con:

```txt
Archivos sugeridos:
-

Capas involucradas:
-

Consideraciones arquitectónicas:
-

Código generado:
-
```

---

## Relación con agentes

Este skill puede ser usado por:

### Backend Controller Agent

Para validar que los Controllers no rompan la arquitectura.

### Backend Service Agent

Para validar que la lógica de negocio viva únicamente en Services.

### Backend Repository Agent

Para validar acceso correcto a datos mediante Prisma.

### Backend API Agent

Para validar que los endpoints respeten la estructura interna del backend.

### Architecture Validator

Para comparar la arquitectura documentada contra la implementación real.
