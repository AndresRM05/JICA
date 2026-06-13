# backend-security.skill.md — MVP Local

## Cuándo usar este skill

Usa este skill cuando se genere, revise o refactorice código del backend de JICA relacionado con:

* Autenticación
* Autorización
* Guards
* Roles
* Endpoints protegidos
* Endpoints públicos
* Manejo de tokens
* Contraseñas
* Protección de datos sensibles
* Masking
* Logs
* Variables de entorno
* Configuración segura
* Manejo seguro de errores
* Validación de entrada
* Pruebas de seguridad

Este skill debe ser utilizado por agentes como:

* `backend-api-agent`
* `backend-controller-agent`
* `backend-service-agent`
* `backend-repository-agent`
* `architecture-validator`
* `testing-agent`

---

## Objetivo

Asegurar que el backend de JICA proteja correctamente los endpoints, datos sensibles y operaciones críticas del MVP académico local.

El objetivo principal es evitar exposición de contraseñas, tokens, datos personales, información financiera, secretos o detalles internos del sistema, manteniendo una implementación simple, gratuita y ejecutable localmente.

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

El sistema puede manejar información sensible como:

* Datos personales de usuarios.
* Datos básicos de pymes gastronómicas.
* Simulaciones de inversión.
* Confirmaciones de inversión.
* Tokens JWT locales.
* Roles de usuario.
* Contraseñas hasheadas.

El backend del MVP utiliza:

* NestJS
* TypeScript
* PostgreSQL local
* Prisma ORM
* JWT local
* bcrypt
* Guards de NestJS
* Roles locales
* DTOs con class-validator
* Variables de entorno locales
* Jest
* Supertest

---

## Restricción principal del MVP

Este skill debe guiar la generación y revisión de seguridad únicamente para un MVP académico local.

No debe proponer, exigir ni generar código que dependa de:

* Azure
* Microsoft Entra ID
* MSAL
* Firebase Auth
* Auth0
* JWKS externo
* Azure Key Vault
* Azure Blob Storage
* Azure App Service
* Azure Application Insights
* Sentry
* Redis
* BullMQ
* Socket.io
* Servicios cloud o pagos
* Infraestructura de producción
* Procesos en background

Si el README menciona tecnologías de producción, este skill debe considerarlas fuera del alcance del MVP, salvo que el usuario solicite explícitamente implementarlas.

---

## Principio general de seguridad

Toda funcionalidad backend debe seguir el principio de mínimo privilegio:

```txt
Cada usuario solo puede acceder a los recursos y operaciones estrictamente necesarias para su rol.
```

Además, ningún endpoint debe exponer más información de la necesaria para el flujo del MVP.

---

## Roles del sistema

El backend debe reconocer los siguientes roles locales:

```txt
investor
business
admin
```

---

## Rol investor

Puede:

* Consultar oportunidades de inversión.
* Ver detalle de oportunidades.
* Realizar simulaciones.
* Registrar interés de inversión.
* Confirmar inversiones propias.
* Consultar información básica de su perfil.

No puede:

* Aprobar negocios.
* Ver información administrativa.
* Acceder a datos sensibles completos de otros usuarios.
* Modificar oportunidades de inversión de una pyme.
* Acceder a funciones de administración.

---

## Rol business

Puede:

* Gestionar información básica de su pyme, si el MVP lo incluye.
* Consultar oportunidades asociadas a su negocio, si el MVP lo incluye.

No puede:

* Confirmar inversiones como inversionista.
* Acceder a información privada de inversionistas.
* Aprobar negocios.
* Acceder a funciones administrativas.

---

## Rol admin

Puede:

* Consultar información administrativa básica, si el MVP lo incluye.
* Crear o gestionar oportunidades de inversión, si el equipo decide incluirlo.

No debe:

* Exponer secretos del sistema.
* Consultar tokens.
* Ver contraseñas o hashes.
* Acceder a datos sensibles completos si no son necesarios.

Para el MVP inicial, el rol `admin` puede existir en la base de datos aunque no se implementen pantallas administrativas completas.

---

# Autenticación local

## Regla 1 — JWT local para el MVP

La autenticación del MVP debe implementarse con JWT local generado por el backend.

Se permite:

```txt
@nestjs/jwt
passport-jwt
JwtAuthGuard
JwtStrategy
bcrypt
```

No se permite para el MVP:

```txt
Microsoft Entra ID
MSAL
Firebase Auth
Auth0
EntraIdGuard
validación JWKS externa
servicios externos de autenticación
```

---

## Regla 2 — Registro seguro

El endpoint de registro debe:

```txt
1. Validar datos con DTO.
2. Verificar si el email ya existe.
3. Hashear la contraseña con bcrypt.
4. Guardar passwordHash, nunca password.
5. Crear el usuario con rol válido.
6. Retornar datos seguros.
```

No debe retornar:

```txt
password
passwordHash
JWT_SECRET
datos internos
```

Ejemplo de respuesta segura:

```json
{
  "id": "uuid",
  "email": "investor@jica.com",
  "role": "investor"
}
```

---

## Regla 3 — Login seguro

El endpoint de login debe:

```txt
1. Buscar usuario por email.
2. Comparar contraseña usando bcrypt.compare.
3. Rechazar credenciales inválidas con UnauthorizedException.
4. Generar JWT local.
5. Retornar accessToken y datos básicos del usuario.
```

El mensaje de error no debe revelar si falló el email o la contraseña.

Correcto:

```txt
Credenciales inválidas
```

Incorrecto:

```txt
El email no existe
La contraseña es incorrecta
```

---

## Regla 4 — Nunca guardar contraseñas en texto plano

Prohibido guardar:

```txt
password
plainPassword
rawPassword
```

Solo se permite guardar:

```txt
passwordHash
```

El hash debe generarse con bcrypt.

---

## Regla 5 — Payload mínimo del JWT

El JWT debe incluir únicamente datos mínimos:

```txt
sub
email
role
```

No debe incluir:

```txt
password
passwordHash
datos financieros
cuentas bancarias
cédulas
documentos
secretos
información sensible innecesaria
```

Ejemplo permitido:

```json
{
  "sub": "user-id",
  "email": "investor@jica.com",
  "role": "investor"
}
```

---

## Regla 6 — JWT_SECRET en variables de entorno

El secreto para firmar tokens debe estar en `.env`.

Ejemplo:

```env
JWT_SECRET=local_mvp_secret_change_me
JWT_EXPIRES_IN=1d
```

No se permite hardcodear secretos:

```ts
JwtModule.register({
  secret: 'my-secret',
})
```

Correcto:

```ts
JwtModule.register({
  secret: configService.get<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
  },
})
```

---

## Regla 7 — Expiración del token

El token debe tener expiración.

Valor recomendado para MVP:

```txt
JWT_EXPIRES_IN=1d
```

No generar tokens sin expiración.

---

# Protección de endpoints

## Regla 8 — Endpoints privados con JwtAuthGuard

Todo endpoint privado debe usar:

```txt
JwtAuthGuard
```

Ejemplo:

```ts
@UseGuards(JwtAuthGuard)
@Get('me')
getMe() {}
```

No usar:

```txt
EntraIdGuard
MSAL
Microsoft Entra ID
Firebase Auth
```

---

## Regla 9 — Endpoints restringidos con RolesGuard

Toda operación restringida por rol debe usar:

```txt
JwtAuthGuard
RolesGuard
@Roles(...)
```

Ejemplo:

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('investor')
@Post(':id/confirm')
confirmInvestment() {}
```

---

## Regla 10 — Rutas públicas explícitas

Las rutas públicas deben marcarse con:

```txt
@Public()
```

Rutas públicas esperadas:

```txt
GET  /health
POST /auth/register
POST /auth/login
```

El resto de rutas deben ser privadas por defecto, salvo justificación.

---

## Regla 11 — Usuario autenticado con CurrentUser

El usuario autenticado debe obtenerse mediante:

```txt
@CurrentUser()
```

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

## Regla 12 — Token solo por Authorization header

El token debe enviarse únicamente mediante:

```txt
Authorization: Bearer <token>
```

Prohibido:

```txt
/api/v1/investments?token=abc
/api/v1/simulation?accessToken=abc
```

---

# Protección de endpoints del MVP

## Dashboard y oportunidades

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

Si el equipo desea mostrar oportunidades sin login en una landing pública, debe documentarlo explícitamente y retornar solo información pública mínima.

---

## Simulación de inversión

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

## Registro de interés o confirmación de inversión

Los endpoints que registran interés o confirman inversión deben protegerse con rol de inversionista.

Ejemplos esperados:

```txt
POST /api/v1/investments/:id/interest
POST /api/v1/investments/:id/confirm
```

Rol esperado:

```txt
investor
```

Además, el backend debe validar que el usuario autenticado tenga permiso para ejecutar esa operación.

---

## Administración

Los endpoints administrativos, si existen en el MVP, deben estar protegidos con rol:

```txt
admin
```

Para el MVP inicial, no es obligatorio implementar un módulo administrativo completo.

---

# Autorización por reglas de negocio

## Regla 13 — El backend no debe confiar solo en el frontend

Aunque el frontend oculte botones o pantallas, el backend debe validar permisos.

Ejemplos:

```txt
Solo investor puede confirmar inversiones.
Solo el dueño de una simulación puede usarla.
Solo usuarios autenticados pueden ver su perfil.
```

---

## Regla 14 — Validar rol en operaciones críticas

En operaciones críticas, el Service debe validar reglas funcionales además de los Guards cuando corresponda.

Ejemplo:

```txt
Confirmar inversión:
- Guard valida JWT.
- RolesGuard valida rol investor.
- Service valida que la oportunidad permita inversión.
```

---

## Regla 15 — Validar propiedad del recurso

Cuando una operación dependa de un recurso del usuario, el Service debe validar propiedad.

Ejemplos:

```txt
Una simulación pertenece al inversionista autenticado.
Una inversión pertenece al inversionista autenticado.
Una pyme pertenece al usuario business autenticado.
```

Si el MVP no guarda simulaciones previas, esta validación aplica únicamente a los recursos que sí existan.

---

# Protección de datos sensibles

## Regla 16 — No retornar datos sensibles

Nunca retornar:

```txt
password
passwordHash
JWT_SECRET
accessToken de otros usuarios
refreshToken
accountNumber
taxId
documentContent
bankInformation
secret keys
variables de entorno
connection strings
```

Excepción:

```txt
El endpoint de login puede retornar el accessToken del usuario autenticado.
```

---

## Regla 17 — passwordHash solo para AuthService

`passwordHash` solo puede seleccionarse en métodos internos usados para login.

Ejemplo permitido:

```txt
UsersRepository.findByEmailForAuth()
```

Ese método solo debe ser usado por `AuthService`.

Prohibido retornar `passwordHash` en:

```txt
GET /auth/me
GET /users
GET /users/:id
GET /investments
GET /businesses
```

---

## Regla 18 — Masking cuando corresponda

Si se retorna información sensible parcial, debe aplicarse masking.

Ejemplos:

```txt
email → ju***@gmail.com
taxId → ***-***-1234
accountNumber → **** **** **** 5678
```

Para el MVP inicial, si no se necesitan `taxId`, `accountNumber` o documentos, no se deben agregar al modelo ni a las respuestas.

---

## Regla 19 — Minimización de datos

Los endpoints deben retornar únicamente los campos necesarios para el caso de uso.

Para una tarjeta de oportunidad en el dashboard, no retornar:

```txt
passwordHash
cuentas bancarias
documentos legales completos
tokens
secretos
campos internos innecesarios
```

---

## Regla 20 — DTOs de respuesta seguros

Los DTOs de respuesta no deben incluir datos sensibles sin masking.

Incorrecto:

```ts
export class UserResponseDto {
  id: string;
  email: string;
  passwordHash: string;
}
```

Correcto:

```ts
export class UserResponseDto {
  id: string;
  email: string;
  role: string;
}
```

---

## Regla 21 — No usar modelos completos de Prisma como respuesta

No se permite retornar entidades completas de Prisma directamente al cliente.

Incorrecto:

```ts
return this.prisma.user.findMany();
```

Correcto:

```ts
return this.usersRepository.findSafeUsers();
```

---

# Seguridad en tokens

## Regla 22 — Tokens solo en headers

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

## Regla 23 — No loguear tokens

No se permite registrar tokens en consola o logs.

Prohibido:

```ts
console.log(token);
console.log(req.headers.authorization);
```

---

## Regla 24 — No guardar tokens sensibles en base de datos

Para el MVP local, no es necesario guardar refresh tokens ni sesiones persistentes en base de datos.

No generar por defecto:

```txt
RefreshToken
Session
TokenBlacklist
```

Salvo que el equipo lo solicite explícitamente.

---

# Manejo seguro de errores

## Regla 25 — No exponer errores internos

Los errores enviados al cliente no deben incluir:

```txt
stack trace
mensajes internos de Prisma
detalles de conexión
variables de entorno
consultas SQL
secretos
tokens
JWT_SECRET
```

---

## Regla 26 — Formato estándar de error

Los errores deben pasar por el filtro global de excepciones y usar una estructura consistente.

Formato esperado:

```json
{
  "statusCode": 400,
  "message": "Datos inválidos",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "path": "/api/v1/simulation"
}
```

No se deben construir respuestas de error manualmente en Controllers.

---

## Regla 27 — Mensajes de error de autenticación

Los errores de login deben ser genéricos.

Correcto:

```txt
Credenciales inválidas
```

Incorrecto:

```txt
El usuario no existe
La contraseña es incorrecta
```

---

# Logs

## Regla 28 — Logs sin información sensible

Los logs pueden incluir:

```txt
endpoint
statusCode
módulo
tipo de error
fecha
```

No deben incluir:

```txt
tokens
contraseñas
passwordHash
cédulas completas
cuentas bancarias
documentos completos
payloads sensibles
headers Authorization
JWT_SECRET
```

Para el MVP local, se puede usar el `Logger` de NestJS.

No es obligatorio usar Application Insights, Sentry ni sistemas externos de monitoreo.

---

## Regla 29 — Correlation ID opcional

El uso de correlation ID es útil, pero no obligatorio para el MVP inicial.

Si se implementa, debe hacerse de forma local y simple.

No debe requerir:

```txt
Application Insights
Sentry
servicios cloud
```

---

# Variables de entorno y secretos

## Regla 30 — No hardcodear secretos

No se deben escribir secretos directamente en el código.

Prohibido:

```txt
JWT_SECRET
DATABASE_URL
apiKey
privateKey
connectionString
```

Deben cargarse desde:

```txt
.env local
ConfigService
```

No usar Azure Key Vault en el MVP local.

---

## Regla 31 — Configuración centralizada

La configuración debe leerse mediante el módulo de configuración del backend.

Recomendado:

```txt
@nestjs/config
ConfigService
.env
.env.example
```

Evitar acceder a `process.env` de forma desordenada en múltiples archivos.

---

## Regla 32 — .env no debe subirse al repositorio

Debe existir:

```txt
.env.example
```

No debe subirse:

```txt
.env
```

Ejemplo de `.env.example`:

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
PORT=
NODE_ENV=
```

---

# Seguridad en base de datos

## Regla 33 — Select explícito

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
    email: true,
    role: true,
  },
});
```

---

## Regla 34 — Soft delete

Si una entidad usa campos de soft delete, las consultas públicas no deben retornar registros eliminados lógicamente.

Campos esperados:

```txt
deletedAt
isDeleted
```

Ejemplo:

```ts
where: {
  deletedAt: null,
}
```

---

## Regla 35 — No datos sensibles innecesarios en el modelo MVP

Para el MVP inicial, evitar agregar datos sensibles si no son necesarios.

No agregar por defecto:

```txt
taxId
accountNumber
bankInformation
documentContent
legalDocuments
```

---

# Seguridad en pruebas

## Regla 36 — Probar endpoints protegidos

Los endpoints privados deben tener pruebas para:

```txt
sin token
token inválido
token válido con rol incorrecto
token válido con rol correcto
```

---

## Regla 37 — Probar datos sensibles

Las pruebas deben validar que las respuestas no incluyan campos sensibles.

Ejemplo:

```txt
La respuesta no debe contener passwordHash.
La respuesta no debe contener JWT_SECRET.
La respuesta no debe contener tokens de otros usuarios.
```

---

## Regla 38 — Probar login seguro

Las pruebas de login deben validar:

```txt
login exitoso retorna accessToken
login fallido retorna mensaje genérico
passwordHash no aparece en la respuesta
accessToken contiene payload mínimo
```

---

## Checklist de revisión

Cuando este skill se use para revisar código, validar:

```txt
[ ] El MVP usa JWT local, no Entra ID.
[ ] Los endpoints privados usan JwtAuthGuard.
[ ] Los endpoints restringidos usan RolesGuard.
[ ] Los endpoints restringidos declaran @Roles.
[ ] Las rutas públicas usan @Public.
[ ] El usuario autenticado se obtiene con @CurrentUser.
[ ] No se accede directamente a req.user.
[ ] Los tokens no se envían por query params.
[ ] Los tokens no se registran en logs.
[ ] Las contraseñas se guardan como passwordHash con bcrypt.
[ ] passwordHash no se retorna al frontend.
[ ] Los DTOs de respuesta no exponen datos sensibles.
[ ] Las consultas usan select explícito.
[ ] Se aplica masking cuando corresponde.
[ ] No se retornan modelos completos de Prisma.
[ ] Los errores no exponen detalles internos.
[ ] Los secretos no están hardcodeados.
[ ] La configuración se lee de forma centralizada.
[ ] Existe .env.example.
[ ] .env está ignorado por Git.
[ ] Existen pruebas para autorización.
[ ] Existen pruebas para no exposición de datos sensibles.
[ ] No se usan Azure, Entra ID, MSAL, Firebase, Auth0, Redis, BullMQ, Socket.io, Sentry ni servicios cloud.
```

---

## Violaciones críticas

Reportar como críticas:

* Endpoint privado sin `JwtAuthGuard`.
* Endpoint restringido sin `RolesGuard`.
* Endpoint restringido sin `@Roles`.
* Uso de `EntraIdGuard`, Microsoft Entra ID, MSAL, Firebase Auth o Auth0 en el MVP local.
* Token enviado por query parameter.
* Token registrado en logs.
* Contraseña guardada en texto plano.
* `passwordHash` retornado al frontend.
* Datos sensibles completos retornados al frontend.
* Secreto o connection string hardcodeado.
* Modelo completo de Prisma retornado al cliente.
* Error interno expuesto al cliente.
* Confirmación de inversión sin validar permisos.
* Uso de Azure, Redis, BullMQ, Socket.io, Sentry o servicios cloud.

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
* JWT sin expiración.
* Mensajes de login demasiado específicos.
* Uso innecesario de refresh tokens o sesiones persistentes en el MVP.

---

## Violaciones bajas

Reportar como bajas:

* Nombres de roles inconsistentes.
* Mensajes de error poco claros.
* Falta de correlation ID si el equipo decidió usarlo.
* Falta de comentarios en reglas de seguridad complejas.
* Falta de ejemplos en pruebas de seguridad.
* `.env.example` incompleto.

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

Tecnologías fuera del MVP detectadas:
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

Restricciones MVP respetadas:
-

Pruebas recomendadas:
-

Código generado:
-
```

---

## Prohibiciones generales

No se permite:

* Usar Microsoft Entra ID, MSAL, EntraIdGuard, Firebase Auth o Auth0 en el MVP local.
* Usar Azure, Redis, BullMQ, Socket.io, Sentry o servicios cloud.
* Enviar tokens por URL.
* Loguear tokens.
* Loguear contraseñas o passwordHash.
* Guardar contraseñas en texto plano.
* Retornar passwordHash al frontend.
* Retornar accessToken de otros usuarios.
* Exponer stack traces.
* Exponer mensajes internos de Prisma.
* Retornar entidades completas de Prisma.
* Saltarse Guards en endpoints privados.
* Validar roles manualmente en Controllers.
* Hardcodear secretos.
* Leer variables de entorno de forma dispersa.
* Retornar datos de otros usuarios sin validar ownership.
* Crear refresh tokens, sesiones persistentes o token blacklist si no son necesarios para el MVP.
* Agregar datos sensibles al modelo si no son necesarios para el flujo principal.

```
```
