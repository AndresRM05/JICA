# backend-api-contracts.skill.md

## Cuándo usar este skill

Usa este skill cuando se genere, revise o refactorice código relacionado con las APIs REST del backend de JICA.

Aplica especialmente cuando se trabaje con:

* Endpoints REST
* Controllers
* DTOs de entrada
* DTOs de salida
* Query params
* Códigos HTTP
* Manejo de errores
* Swagger / OpenAPI
* API Testing con Supertest
* Contratos entre frontend y backend

Este skill debe ser utilizado por agentes como:

* `backend-api-agent`
* `backend-controller-agent`
* `backend-service-agent`
* `architecture-validator`
* `testing-agent`

---

## Objetivo

Asegurar que las APIs REST del backend de JICA funcionen como contratos claros, seguros, consistentes y testeables para el frontend.

El objetivo principal es evitar inconsistencias entre lo que el frontend consume y lo que el backend expone.

---

## Contexto del proyecto

JICA es una plataforma de inversión para pymes gastronómicas.

El frontend consume APIs del backend para soportar el flujo principal del MVP:

```txt
Registro de inversionista
↓
Dashboard de oportunidades
↓
Detalle de oportunidad
↓
Simulación de inversión
↓
Confirmación de inversión
```

El backend utiliza:

* NestJS
* TypeScript
* DTOs
* class-validator
* Microsoft Entra ID
* Guards
* Swagger / OpenAPI
* Jest
* Supertest

---

## Principio general

Toda API expuesta por el backend debe ser tratada como un contrato formal.

Esto significa que cada endpoint debe definir claramente:

```txt
método HTTP
ruta
parámetros
body
query params
respuesta exitosa
respuestas de error
seguridad
roles permitidos
pruebas asociadas
```

---

## Endpoints esperados para el MVP

Como referencia, el flujo MVP puede requerir endpoints como:

```txt
GET /api/v1/health
GET /api/v1/investments
GET /api/v1/investments/:id
POST /api/v1/simulation
POST /api/v1/investments/:id/interest
POST /api/v1/investments/confirm
```

Estos endpoints pueden ajustarse según la implementación final, pero deben mantener coherencia con el flujo principal del MVP y con los contratos usados por el frontend.

---

## Reglas de diseño REST

### Regla 1 — Versionado de API

Toda ruta del backend debe estar bajo el prefijo:

```txt
/api/v1
```

Ejemplos correctos:

```txt
GET /api/v1/investments
POST /api/v1/simulation
```

Ejemplos incorrectos:

```txt
GET /investments
POST /simulation
```

---

### Regla 2 — Uso correcto de métodos HTTP

Usar cada método HTTP según su responsabilidad:

| Método   | Uso esperado                                          |
| -------- | ----------------------------------------------------- |
| `GET`    | Consultar información                                 |
| `POST`   | Crear recursos o ejecutar acciones que generan estado |
| `PUT`    | Reemplazar un recurso completo                        |
| `PATCH`  | Actualizar parcialmente un recurso                    |
| `DELETE` | Eliminar o desactivar un recurso                      |

Ejemplos correctos:

```txt
GET /api/v1/investments
GET /api/v1/investments/:id
POST /api/v1/simulation
POST /api/v1/investments/:id/interest
```

Ejemplos incorrectos:

```txt
GET /api/v1/confirmInvestment
POST /api/v1/getInvestments
```

---

### Regla 3 — Nombres de rutas claros

Las rutas deben usar sustantivos claros, no acciones genéricas.

Correcto:

```txt
/investments
/investments/:id
/simulation
/businesses
/users
```

Incorrecto:

```txt
/getData
/process
/doAction
/handleSimulation
```

---

### Regla 4 — Recursos en plural

Cuando una ruta represente un recurso, debe escribirse en plural.

Correcto:

```txt
/investments
/businesses
/users
/documents
```

Incorrecto:

```txt
/investment
/business
/user
/document
```

---

## Reglas de DTOs

### Regla 5 — Todo dato de entrada o salida debe usar DTO

Todo dato que entra o sale de un endpoint debe estar definido mediante DTO.

Tipos obligatorios:

| Tipo                     | Sufijo                 | Uso                              |
| ------------------------ | ---------------------- | -------------------------------- |
| Entrada de creación      | `Create{Entidad}Dto`   | Datos para crear un recurso      |
| Entrada de actualización | `Update{Entidad}Dto`   | Datos para actualizar un recurso |
| Query params             | `Get{Entidad}QueryDto` | Filtros y paginación             |
| Respuesta                | `{Entidad}ResponseDto` | Datos que se retornan al cliente |

Ejemplos:

```txt
CreateInvestmentDto
UpdateInvestmentDto
GetInvestmentsQueryDto
InvestmentResponseDto
CreateSimulationDto
SimulationResponseDto
```

---

### Regla 6 — DTOs ubicados en carpeta dto

Los DTOs deben ubicarse dentro de la carpeta `dto/` de su módulo.

Correcto:

```txt
/backend/src/investments/dto/create-investment.dto.ts
/backend/src/investments/dto/update-investment.dto.ts
/backend/src/investments/dto/investment-response.dto.ts
```

Incorrecto:

```txt
/backend/src/investments/create-investment.dto.ts
/backend/src/shared/investment.dto.ts
```

---

### Regla 7 — DTOs de entrada con class-validator

Todo DTO que reciba datos del cliente debe usar decoradores de `class-validator`.

Ejemplo correcto:

```ts
export class CreateInvestmentDto {
  @IsString()
  businessId: string;

  @IsNumber()
  @Min(1)
  amount: number;
}
```

Ejemplo incorrecto:

```ts
export class CreateInvestmentDto {
  businessId: string;
  amount: number;
}
```

---

### Regla 8 — DTOs de actualización con PartialType

Los DTOs de actualización deben extender el DTO de creación usando `PartialType` de NestJS.

Correcto:

```ts
export class UpdateInvestmentDto extends PartialType(CreateInvestmentDto) {}
```

Incorrecto:

```ts
export class UpdateInvestmentDto {
  businessId?: string;
  amount?: number;
}
```

---

### Regla 9 — DTOs de respuesta sin datos sensibles

Los DTOs de respuesta no deben exponer datos sensibles sin masking.

No deben retornarse completos:

```txt
cédula
cuenta bancaria
tokens
contraseñas
secretos
documentos internos
información financiera privada innecesaria
```

Correcto:

```ts
export class BusinessResponseDto {
  id: string;
  name: string;
  maskedTaxId?: string;
}
```

Incorrecto:

```ts
export class BusinessResponseDto {
  id: string;
  name: string;
  taxId: string;
  bankAccount: string;
}
```

---

## Validación de entrada

### Regla 10 — ValidationPipe global

El backend debe usar `ValidationPipe` global con:

```txt
whitelist: true
forbidNonWhitelisted: true
transform: true
```

Esto asegura que:

* Campos no declarados en DTOs sean eliminados o rechazados.
* Tipos de datos sean transformados correctamente.
* El contrato de entrada sea estricto.

---

### Regla 11 — Query params tipados

Los query params deben tener un DTO específico cuando incluyan filtros, búsqueda, paginación u ordenamiento.

Ejemplo:

```ts
@Get()
findAll(@Query() query: GetInvestmentsQueryDto) {}
```

Incorrecto:

```ts
@Get()
findAll(@Query() query: any) {}
```

---

## Respuestas HTTP

### Regla 12 — Códigos HTTP coherentes

Los endpoints deben retornar códigos HTTP consistentes.

| Código                      | Uso esperado                              |
| --------------------------- | ----------------------------------------- |
| `200 OK`                    | Consulta o acción exitosa sin creación    |
| `201 Created`               | Recurso creado correctamente              |
| `204 No Content`            | Operación exitosa sin cuerpo de respuesta |
| `400 Bad Request`           | Datos inválidos                           |
| `401 Unauthorized`          | Token ausente o inválido                  |
| `403 Forbidden`             | Usuario autenticado sin permisos          |
| `404 Not Found`             | Recurso no encontrado                     |
| `409 Conflict`              | Conflicto de negocio                      |
| `500 Internal Server Error` | Error inesperado                          |

---

### Regla 13 — Respuestas predecibles

Una respuesta exitosa debe tener estructura clara y predecible.

Ejemplo aceptable:

```json
{
  "id": "uuid",
  "businessName": "Costa Verde Café",
  "projectedRoi": 0.12,
  "riskLevel": "MEDIUM"
}
```

Evitar respuestas ambiguas:

```json
{
  "data": "ok"
}
```

---

## Manejo estándar de errores

### Regla 14 — Formato estándar de error

Todo error HTTP debe responder con una estructura consistente.

Formato esperado:

```json
{
  "statusCode": 400,
  "message": "Datos inválidos",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "path": "/api/v1/simulation"
}
```

---

### Regla 15 — No formatear errores manualmente en Controllers

Los Controllers no deben construir errores manualmente.

Incorrecto:

```ts
return {
  error: true,
  message: 'Error',
};
```

Correcto:

```ts
throw new BadRequestException('Datos inválidos');
```

---

### Regla 16 — No exponer detalles internos

Los errores no deben incluir:

```txt
stack traces
mensajes internos de Prisma
SQL
connection strings
tokens
secretos
variables de entorno
```

---

## Seguridad del contrato API

### Regla 17 — Tokens solo por Authorization header

Los endpoints protegidos deben recibir tokens mediante:

```txt
Authorization: Bearer <accessToken>
```

Prohibido:

```txt
/api/v1/investments?token=abc
/api/v1/simulation?accessToken=abc
```

---

### Regla 18 — Endpoints privados protegidos

Todo endpoint privado debe estar protegido por:

```txt
EntraIdGuard
```

Los endpoints restringidos por rol deben usar además:

```txt
RolesGuard
@Roles(...)
```

---

### Regla 19 — Rutas públicas explícitas

Las rutas públicas deben marcarse con:

```txt
@Public()
```

Ejemplo:

```ts
@Public()
@Get('health')
```

---

## Swagger / OpenAPI

### Regla 20 — Todo endpoint debe documentarse

Cada endpoint debe incluir documentación Swagger/OpenAPI mediante:

```txt
@ApiTags
@ApiOperation
@ApiResponse
```

Los endpoints protegidos deben incluir:

```txt
@ApiBearerAuth
```

---

### Regla 21 — Swagger debe reflejar el contrato real

La documentación Swagger debe coincidir con:

```txt
DTOs de entrada
DTOs de salida
status codes
rutas
seguridad
roles esperados
```

Si el código cambia, la documentación debe actualizarse.

---

## API Testing

### Regla 22 — Pruebas con Supertest

Todo endpoint importante del MVP debe tener pruebas con Supertest.

Deben validarse:

* Código de estado HTTP.
* Estructura de respuesta.
* Validación de DTOs.
* Escenarios exitosos.
* Escenarios de error.
* Endpoints públicos.
* Endpoints protegidos.

---

### Regla 23 — Pruebas de validación

Debe probarse que los DTOs rechazan entradas inválidas.

Ejemplos:

```txt
amount <= 0
businessId vacío
campos extra no permitidos
tipo incorrecto
query params inválidos
```

---

### Regla 24 — Pruebas de seguridad

Los endpoints protegidos deben probar:

```txt
sin token
token inválido
token válido con rol incorrecto
token válido con rol correcto
```

---

### Regla 25 — Health check

Debe existir y probarse un endpoint de salud.

Endpoint esperado:

```txt
GET /api/v1/health
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

---

## Consistencia con frontend

### Regla 26 — El backend no debe romper contratos del frontend

Cuando se cambie una respuesta del backend, debe revisarse también:

```txt
frontend/src/types
frontend/src/services
frontend/src/validations
frontend/src/features
```

El backend debe mantener respuestas compatibles con los contratos TypeScript y esquemas Zod del frontend.

---

### Regla 27 — Cambios de contrato deben documentarse

Todo cambio en:

```txt
ruta
método HTTP
body
query params
respuesta
status code
error
```

Debe actualizar la documentación y las pruebas.

---

## Procedimiento para crear un nuevo endpoint

Al crear un endpoint, seguir este orden:

```txt
1. Definir ruta y método HTTP.
2. Definir DTO de entrada si recibe body.
3. Definir DTO de query params si recibe filtros.
4. Definir DTO de respuesta.
5. Aplicar Guards y Roles según corresponda.
6. Implementar Controller delegando al Service.
7. Implementar lógica en Service.
8. Implementar acceso a datos en Repository si aplica.
9. Documentar Swagger/OpenAPI.
10. Agregar pruebas API con Supertest.
11. Verificar que no se expongan datos sensibles.
12. Verificar compatibilidad con frontend.
```

---

## Checklist de revisión

Cuando se use este skill para revisar APIs, validar:

```txt
[ ] La ruta usa /api/v1.
[ ] El método HTTP es correcto.
[ ] El nombre de ruta es claro.
[ ] La ruta representa recursos en plural cuando aplica.
[ ] El endpoint usa DTOs de entrada.
[ ] El endpoint usa DTOs de salida.
[ ] Los DTOs están en dto/.
[ ] Los DTOs de entrada usan class-validator.
[ ] Los DTOs de actualización usan PartialType.
[ ] Los query params usan DTO.
[ ] ValidationPipe está configurado globalmente.
[ ] Los status codes son correctos.
[ ] Los errores usan formato estándar.
[ ] No se exponen detalles internos.
[ ] El endpoint privado usa EntraIdGuard.
[ ] El endpoint restringido usa RolesGuard y @Roles.
[ ] Las rutas públicas usan @Public.
[ ] Swagger está completo.
[ ] Existen pruebas con Supertest.
[ ] Existen pruebas de validación.
[ ] Existen pruebas de autorización.
[ ] No se exponen datos sensibles.
[ ] El contrato coincide con lo esperado por frontend.
```

---

## Violaciones críticas

Reportar como críticas:

* Endpoint privado sin autenticación.
* Endpoint restringido sin roles.
* Token recibido por query param.
* Datos sensibles expuestos en respuesta.
* DTO de entrada inexistente en endpoint con body.
* Error interno expuesto al cliente.
* Endpoint principal del MVP sin prueba API.
* Cambio de contrato sin actualizar pruebas o documentación.

---

## Violaciones medias

Reportar como medias:

* Swagger incompleto.
* Código HTTP incorrecto.
* Query params sin DTO.
* DTO fuera de carpeta `dto/`.
* Nombre de ruta poco claro.
* Endpoint sin prueba de escenario de error.
* Respuesta ambigua o poco predecible.

---

## Violaciones bajas

Reportar como bajas:

* Descripciones Swagger poco claras.
* Falta de ejemplos de respuesta.
* Nombres mejorables.
* Inconsistencias menores de estilo.
* Mensajes de error poco específicos.

---

## Formato esperado de salida al usar este skill

Cuando este skill sea usado para revisar un endpoint o módulo API, responder con:

```txt
Módulo revisado:
Endpoints revisados:

Hallazgos críticos:
-

Hallazgos medios:
-

Hallazgos bajos:
-

Riesgo del contrato API:
BAJO | MEDIO | ALTO

Correcciones recomendadas:
-

Pruebas API sugeridas:
-

Estado final:
APROBADO | REQUIERE CORRECCIONES
```

Cuando este skill sea usado para generar un nuevo endpoint, responder con:

```txt
Endpoint propuesto:
Método:
Ruta:
DTOs necesarios:
Seguridad requerida:
Status codes:
Swagger requerido:
Pruebas Supertest requeridas:
Archivos a modificar:
```

---

## Prohibiciones generales

No se permite:

* Crear endpoints sin DTOs.
* Usar `any` para body, params o query.
* Recibir tokens por URL.
* Retornar modelos completos de Prisma.
* Exponer datos sensibles sin masking.
* Documentar Swagger de forma distinta al comportamiento real.
* Usar nombres de rutas genéricos.
* Usar métodos HTTP incorrectos.
* Crear endpoints privados sin Guards.
* Crear endpoints restringidos sin Roles.
* Cambiar contratos sin actualizar pruebas.
* Cambiar contratos sin revisar compatibilidad con frontend.
