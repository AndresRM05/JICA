# backend-security.skill.md

## Cuándo usar este skill

Usa este skill cuando se genere, revise o refactorice código del backend de JICA relacionado con:

* Autenticación
* Autorización
* Guards
* Roles
* Endpoints protegidos
* Endpoints públicos
* Manejo de tokens
* Protección de datos sensibles
* Masking
* Logs
* Variables de entorno
* Configuración segura
* Manejo seguro de errores

Este skill debe ser utilizado por agentes como:

* `backend-api-agent`
* `backend-controller-agent`
* `backend-service-agent`
* `backend-repository-agent`
* `architecture-validator`

---

## Objetivo

Asegurar que el backend de JICA proteja correctamente los endpoints, datos sensibles y operaciones críticas, siguiendo los lineamientos de seguridad definidos para el proyecto.

El objetivo principal es evitar exposición de información financiera, datos personales, tokens, secretos o reglas internas del sistema.

---

## Contexto del proyecto

JICA es una plataforma de inversión para pymes gastronómicas.

El sistema maneja información sensible como:

* Datos personales de inversionistas.
* Datos de pymes gastronómicas.
* Información financiera.
* Cédulas.
* Cuentas bancarias.
* Documentos.
* Métricas de negocio.
* Simulaciones de inversión.
* Confirmaciones de inversión.
* Tokens de acceso.
* Roles de usuario.

El backend utiliza:

* NestJS
* TypeScript
* Microsoft Entra ID
* JWT
* JWKS
* Guards de NestJS
* Roles por aplicación
* PostgreSQL
* Prisma ORM
* Application Insights
* Variables de entorno

---

## Principio general de seguridad

Toda funcionalidad backend debe seguir el principio de mínimo privilegio:

```txt
Cada usuario solo puede acceder a los recursos y operaciones estrictamente necesarias para su rol.
```

Además, ningún endpoint debe exponer más información de la requerida por el flujo del MVP.

---

## Roles del sistema

El backend debe reconocer al menos los siguientes roles:

```txt
investor
business
admin
```

### Investor

Puede:

* Consultar oportunidades de inversión.
* Ver detalles de oportunidades autorizadas.
* Realizar simulaciones.
* Registrar interés de inversión.
* Confirmar inversiones propias.
* Consultar su propio portafolio.

No puede:

* Aprobar negocios.
* Ver información administrativa.
* Acceder a datos sensibles completos de otros usuarios.
* Modificar oportunidades de inversión de una pyme.

### Business

Puede:

* Gestionar información de su pyme.
* Consultar sus oportunidades.
* Ver métricas asociadas a su negocio.

No puede:

* Confirmar inversiones como inversionista.
* Acceder a información privada de inversionistas.
* Aprobar negocios.

### Admin

Puede:

* Revisar negocios.
* Aprobar o rechazar pymes.
* Consultar información administrativa.
* Supervisar actividad del sistema.

No debe:

* Exponer secretos del sistema.
* Consultar tokens.
* Ver datos sensibles completos si no son necesarios.

---

## Autenticación

### Regla 1 — Microsoft Entra ID como proveedor de identidad

La autenticación del backend debe basarse en Microsoft Entra ID.

No se debe implementar autenticación manual con contraseñas propias dentro del backend.

Prohibido:

```txt
validar contraseñas manualmente
guardar contraseñas en la base de datos
crear tokens JWT propios sin Entra ID
usar autenticación casera
```

---

### Regla 2 — Validación de JWT

Los endpoints protegidos deben validar tokens JWT emitidos por Microsoft Entra ID.

La validación debe incluir:

* Firma del token.
* Issuer.
* Audience.
* Expiration time.
* Claims necesarias.
* Roles o permisos del usuario.

---

### Regla 3 — Uso de EntraIdGuard

Todo endpoint privado debe estar protegido con:

```txt
EntraIdGuard
```

Ejemplo esperado:

```ts
@UseGuards(EntraIdGuard)
@Get('profile')
findProfile() {}
```

El agente debe reportar cualquier endpoint privado sin `EntraIdGuard`.

---

## Autorización

### Regla 4 — Uso de RolesGuard en operaciones restringidas

Toda operación restringida por rol debe usar:

```txt
RolesGuard
```

Ejemplo esperado:

```ts
@UseGuards(EntraIdGuard, RolesGuard)
@Roles('investor')
@Post('simulation')
simulateInvestment() {}
```

---

### Regla 5 — Uso obligatorio de @Roles

Cuando un endpoint requiere un rol específico, debe declararlo explícitamente con:

```txt
@Roles(...)
```

Ejemplos:

```ts
@Roles('investor')
@Roles('business')
@Roles('admin')
```

No se permite validar roles manualmente dentro del Controller.

Incorrecto:

```ts
if (user.role !== 'admin') {
  throw new ForbiddenException();
}
```

Correcto:

```ts
@UseGuards(EntraIdGuard, RolesGuard)
@Roles('admin')
```

---

### Regla 6 — Rutas públicas explícitas

Toda ruta pública debe marcarse con:

```txt
@Public()
```

Ejemplo:

```ts
@Public()
@Get('health')
healthCheck() {}
```

El agente debe reportar rutas sin guard y sin `@Public()`.

---

### Regla 7 — Acceso al usuario autenticado

El usuario autenticado debe obtenerse mediante un decorador controlado, por ejemplo:

```txt
@CurrentUser()
```

No debe accederse directamente a:

```txt
req.user
request.user
```

Esto mantiene la consistencia, reduce acoplamiento con Express y facilita pruebas.

---

## Protección de endpoints del MVP

### Dashboard y oportunidades

Los endpoints que muestran oportunidades de inversión deben protegerse con autenticación.

Ejemplo esperado:

```txt
GET /api/v1/investments
GET /api/v1/investments/:id
```

Roles esperados:

```txt
investor
admin
```

---

### Simulación de inversión

El endpoint de simulación debe protegerse para usuarios inversionistas.

Ejemplo esperado:

```txt
POST /api/v1/simulation
```

Rol esperado:

```txt
investor
```

La simulación no debe confirmar una inversión real.

---

### Registro de interés o confirmación de inversión

Los endpoints que registran interés o confirman inversión deben protegerse con rol de inversionista.

Ejemplos esperados:

```txt
POST /api/v1/investments/:id/interest
POST /api/v1/investments/confirm
```

Rol esperado:

```txt
investor
```

Además, el backend debe validar que el usuario autenticado sea propietario de la simulación o inversión correspondiente.

---

### Administración

Los endpoints administrativos deben estar protegidos con rol:

```txt
admin
```

---

## Protección de datos sensibles

### Regla 8 — No retornar datos sensibles completos

El backend no debe retornar información sensible completa al frontend.

Datos sensibles:

```txt
cédula
cuenta bancaria
correo electrónico completo en listados
documentos internos
tokens
secretos
contraseñas
información financiera privada no necesaria
```

Si un dato sensible debe mostrarse, debe ir con masking.

Ejemplo:

```txt
Cédula: 1-****-****
Cuenta: **** **** **** 1234
Email: i*****@correo.com
```

---

### Regla 9 — Masking desde backend

El masking debe aplicarse antes de retornar información al cliente.

Lugar recomendado:

```txt
Repository o mapper de respuesta
```

Utilidad esperada:

```txt
/backend/src/common/utils/maskData.ts
```

El agente debe reportar respuestas que envíen datos sensibles sin masking.

---

### Regla 10 — Minimización de datos

Los endpoints deben retornar únicamente los campos necesarios para el caso de uso.

Ejemplo:

Para una tarjeta de oportunidad en el dashboard, no se debe retornar información interna como:

```txt
cuentas bancarias
documentos legales completos
métricas privadas no usadas por la pantalla
tokens
identificadores internos innecesarios
```

---

## Seguridad en DTOs y respuestas

### Regla 11 — DTOs de respuesta seguros

Los DTOs de respuesta no deben incluir datos sensibles sin masking.

Incorrecto:

```ts
export class BusinessResponseDto {
  taxId: string;
  bankAccount: string;
}
```

Correcto:

```ts
export class BusinessResponseDto {
  maskedTaxId: string;
  maskedBankAccount: string;
}
```

---

### Regla 12 — No usar modelos completos de Prisma como respuesta

No se permite retornar entidades completas de Prisma directamente al cliente.

Incorrecto:

```ts
return this.prisma.business.findMany();
```

Correcto:

```ts
return this.businessRepository.findPublicOpportunities();
```

---

## Seguridad en tokens

### Regla 13 — Tokens solo en headers

Los tokens deben enviarse únicamente mediante el header:

```txt
Authorization: Bearer <accessToken>
```

Prohibido:

```txt
?token=...
?accessToken=...
```

---

### Regla 14 — No loguear tokens

No se permite registrar tokens en consola, logs o herramientas de monitoreo.

Prohibido:

```ts
console.log(token);
console.log(req.headers.authorization);
```

---

## Manejo seguro de errores

### Regla 15 — No exponer errores internos

Los errores enviados al cliente no deben incluir:

```txt
stack trace
mensajes internos de Prisma
detalles de conexión
variables de entorno
consultas SQL
secretos
tokens
```

---

### Regla 16 — Formato estándar de error

Los errores deben pasar por el filtro global de excepciones y usar una estructura consistente.

Formato esperado:

```json
{
  "statusCode": 400,
  "message": "Datos inválidos",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "path": "/api/v1/simulation"
}
```

No se deben construir respuestas de error manualmente en Controllers.

---

## Logs y monitoreo

### Regla 17 — Logs sin información sensible

Los logs pueden incluir:

```txt
correlationId
endpoint
statusCode
duración
módulo
tipo de error
```

No deben incluir:

```txt
tokens
contraseñas
cédulas completas
cuentas bancarias
documentos completos
payloads sensibles
headers Authorization
```

---

### Regla 18 — Uso de correlation ID

Cada solicitud debe poder rastrearse mediante un identificador de correlación.

Uso esperado:

```txt
correlationId
```

Este ID puede enviarse a Application Insights para trazabilidad.

---

## Variables de entorno y secretos

### Regla 19 — No hardcodear secretos

No se deben escribir secretos directamente en el código.

Prohibido:

```txt
clientSecret
databaseUrl
tenantId sensible
connectionString
apiKey
privateKey
```

Deben cargarse desde:

```txt
variables de entorno
servicio de configuración
Azure Key Vault
```

---

### Regla 20 — Configuración centralizada

La configuración debe leerse mediante el módulo de configuración del backend.

No se permite acceder a `process.env` de forma desordenada en múltiples archivos si existe un servicio de configuración centralizado.

---

## Seguridad en base de datos

### Regla 21 — Select explícito

Las consultas deben usar `select` explícito para evitar exposición accidental de campos sensibles.

Incorrecto:

```ts
return this.prisma.user.findMany();
```

Correcto:

```ts
return this.prisma.user.findMany({
  select: {
    id: true,
    name: true,
    role: true,
  },
});
```

---

### Regla 22 — Soft delete

Si una entidad usa campos de soft delete, las consultas públicas no deben retornar registros eliminados lógicamente.

Campos esperados:

```txt
deletedAt
isDeleted
```

---

## Seguridad en pruebas

### Regla 23 — Probar endpoints protegidos

Los endpoints privados deben tener pruebas para:

```txt
sin token
token inválido
token válido con rol incorrecto
token válido con rol correcto
```

---

### Regla 24 — Probar datos sensibles

Las pruebas deben validar que las respuestas no incluyan campos sensibles completos.

Ejemplo:

```txt
La respuesta no debe contener bankAccount completo.
La respuesta no debe contener taxId completo.
La respuesta debe contener maskedBankAccount si aplica.
```

---

## Checklist de revisión

Cuando este skill se use para revisar código, validar:

```txt
[ ] Los endpoints privados usan EntraIdGuard.
[ ] Los endpoints restringidos usan RolesGuard.
[ ] Los endpoints restringidos declaran @Roles.
[ ] Las rutas públicas usan @Public.
[ ] El usuario autenticado se obtiene con @CurrentUser.
[ ] No se accede directamente a req.user.
[ ] Los tokens no se envían por query params.
[ ] Los tokens no se registran en logs.
[ ] Los DTOs de respuesta no exponen datos sensibles.
[ ] Las consultas usan select explícito.
[ ] Se aplica masking cuando corresponde.
[ ] No se retornan modelos completos de Prisma.
[ ] Los errores no exponen detalles internos.
[ ] Los secretos no están hardcodeados.
[ ] La configuración se lee de forma centralizada.
[ ] Existen pruebas para autorización.
[ ] Existen pruebas para no exposición de datos sensibles.
```

---

## Violaciones críticas

Reportar como críticas:

* Endpoint privado sin `EntraIdGuard`.
* Endpoint restringido sin `RolesGuard`.
* Endpoint restringido sin `@Roles`.
* Token enviado por query parameter.
* Token registrado en logs.
* Datos sensibles completos retornados al frontend.
* Contraseña, secreto o connection string hardcodeado.
* Modelo completo de Prisma retornado al cliente.
* Error interno expuesto al cliente.
* Confirmación de inversión sin validar dueño del recurso.

---

## Violaciones medias

Reportar como medias:

* Ruta pública sin `@Public`.
* Acceso directo a `req.user`.
* Falta de masking en campos parcialmente sensibles.
* Falta de pruebas de autorización.
* Falta de pruebas de datos sensibles.
* Uso desordenado de `process.env`.
* Logs con demasiada información.

---

## Violaciones bajas

Reportar como bajas:

* Nombres de roles inconsistentes.
* Mensajes de error poco claros.
* Falta de correlation ID.
* Falta de comentarios en reglas de seguridad complejas.
* Falta de ejemplos en pruebas de seguridad.

---

## Formato esperado de salida al usar este skill

Cuando este skill sea usado para revisar seguridad, responder con:

```txt
Módulo revisado:
Archivos revisados:

Hallazgos críticos:
-

Hallazgos medios:
-

Hallazgos bajos:
-

Riesgo de seguridad:
BAJO | MEDIO | ALTO

Correcciones recomendadas:
-

Pruebas de seguridad sugeridas:
-

Estado final:
APROBADO | REQUIERE CORRECCIONES
```

Cuando este skill sea usado para generar código seguro, responder con:

```txt
Archivos sugeridos:
-

Controles de seguridad aplicados:
-

Riesgos considerados:
-

Pruebas recomendadas:
-

Código generado:
-
```

---

## Prohibiciones generales

No se permite:

* Implementar login manual con contraseña propia.
* Guardar contraseñas en la base de datos.
* Crear JWT propios fuera de Microsoft Entra ID.
* Enviar tokens por URL.
* Loguear tokens.
* Loguear datos financieros sensibles.
* Exponer stack traces.
* Exponer mensajes internos de Prisma.
* Retornar entidades completas de Prisma.
* Saltarse Guards en endpoints privados.
* Validar roles manualmente en Controllers.
* Hardcodear secretos.
* Leer variables de entorno de forma dispersa.
* Retornar datos de otros usuarios sin validar ownership.
