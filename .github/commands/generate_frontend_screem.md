# Generate Frontend Screen
 
## Objetivo
 
Generar una pantalla del frontend de JICA aplicando los agentes y skills definidos en el proyecto.
 
Este comando debe asegurar que la pantalla cumpla con:
 
* Estructura de componentes React con TypeScript.
* Lineamientos visuales y branding de JICA.
* Manejo de estado con Zustand y TanStack Query.
* Contratos TypeScript y validaciones con Zod.
* Seguridad con JWT local, rutas protegidas y roles.
* Responsive design mobile-first.
---
 
## Cuándo usar este comando
 
Usar este comando cuando se necesite crear o modificar una pantalla del frontend.
 
Ejemplos:
 
```txt
Crear pantalla de login
Crear dashboard de oportunidades de inversión
Crear pantalla de detalle de una inversión
Crear formulario de simulación de inversión
Crear pantalla de confirmación de inversión
```
 
---
 
## Entrada esperada
 
El usuario debe indicar:
 
```txt
Nombre de la pantalla:
Ruta:
Rol autorizado:
Descripción:
Datos que consume del backend:
Acciones del usuario:

```
 
Ejemplo:
 
```txt
Nombre de la pantalla: SimulationPage
Ruta: /simulate
Rol autorizado: investor
Descripción: Permite al inversionista simular una inversión ingresando un monto y viendo el retorno estimado.
Datos que consume del backend:
- GET /api/v1/investments/:id (detalle de la oportunidad)
- POST /api/v1/simulation (resultado de la simulación)
Acciones del usuario:
- Ingresar monto a invertir
- Ver retorno estimado
- Confirmar o cancelar

```
 
---
 
## Agentes que debe invocar
 
```txt
frontend-ui-agent
frontend-state-query-agent
frontend-api-contract-agent
```
 
Si aplica, también puede usar:
 
```txt
architecture-validator
solid-reviewer
```
 
---
 
## Skills que debe aplicar
 
```txt
frontend-ui.skill.md
frontend-state-query.skill.md
frontend-api-contracts.skill.md
frontend-security.skill.md
coding-standards.skill.md
architecture-guidelines.skill.md
```
 
---
 
## Flujo obligatorio
 
### Paso 1: Diseñar la estructura de la pantalla
 
Usar `frontend-ui-agent` y `frontend-ui.skill.md`.
 
Validar:
 
```txt
[ ] La página termina con sufijo Page (ej: SimulationPage.tsx).
[ ] La página vive en /src/pages/ o /src/features/{feature}/pages/.
[ ] La página no contiene lógica de negocio ni llamadas a API directamente.
[ ] Los componentes se separan en: Page → componentes de feature → componentes UI.
[ ] Cada componente tiene su carpeta con ComponentName.tsx, ComponentName.types.ts e index.ts.
[ ] Los estilos usan Tailwind CSS con la paleta de colores de JICA.
[ ] El diseño es mobile-first.
[ ] Los iconos usan lucide-react.
```
 
---
 
### Paso 2: Definir el contrato de datos
 
Usar `frontend-api-contract-agent` y `frontend-api-contracts.skill.md`.
 
Validar:
 
```txt
[ ] Los tipos de respuesta del backend terminan con sufijo Response.
[ ] Los tipos de formulario terminan con sufijo FormData.
[ ] Los tipos compartidos están en /src/types/.
[ ] No se usa any.
[ ] Los formularios tienen esquema Zod con mensajes de error en español.
[ ] Los esquemas Zod están en /src/validations/.
[ ] Los tipos se infieren con z.infer<typeof schema>.
```
 
---
 
### Paso 3: Definir servicios API
 
Usar `frontend-api-contract-agent` y `frontend-api-contracts.skill.md`.
 
Validar:
 
```txt
[ ] Las llamadas al backend están en /src/services/ con sufijo Service.
[ ] Ningún componente llama a httpClient directamente.
[ ] Las funciones de servicio usan prefijos get, fetch, load o verbos descriptivos.
[ ] El token JWT se adjunta automáticamente desde el interceptor de httpClient.
[ ] No se transmiten tokens como query parameters.
```
 
---
 
### Paso 4: Definir manejo de estado y queries
 
Usar `frontend-state-query-agent` y `frontend-state-query.skill.md`.
 
Validar:
 
```txt
[ ] Los datos del servidor se manejan con TanStack Query, no con useState.
[ ] Los hooks de query están en /src/features/{feature}/hooks/.
[ ] Las query keys son constantes definidas en el mismo archivo del hook.
[ ] Las mutaciones tienen retry: 0.
[ ] Las mutaciones exitosas invalidan el caché correspondiente.
[ ] Las mutaciones tienen manejo de onError.
[ ] La simulación tiene staleTime: 0.
[ ] El estado de UI va en Zustand, no en TanStack Query.
[ ] No se duplica el estado de loading con useState.
[ ] Se usan skeleton loaders para contenido con estructura conocida.
```
 
---
 
### Paso 5: Aplicar seguridad
 
Usar `frontend-security.skill.md`.
 
Validar:
 
```txt
[ ] La ruta está envuelta en ProtectedRoute si es privada.
[ ] Los elementos de UI condicionados por rol usan RoleGuard.
[ ] No se usan condicionales inline if (user.role === ...) en componentes.
[ ] El rol no se expone en la URL.
[ ] No se loguea el token ni datos sensibles con console.log.
[ ] Los formularios con contraseñas usan método POST.
```
 
---
 
### Paso 6: Validación final
 
Usar `architecture-validator`.
 
Validar:
 
```txt
[ ] La página no contiene lógica de negocio ni llamadas directas a la API.
[ ] Los componentes tienen una única responsabilidad visual.
[ ] El estado del servidor está en TanStack Query.
[ ] El estado de UI está en Zustand.
[ ] Los contratos TypeScript siguen las convenciones de sufijos.
[ ] La seguridad está aplicada correctamente.
[ ] El diseño sigue el branding de JICA.
[ ] Existen o se sugieren pruebas para los hooks y componentes críticos.
```
 
---
 
## Formato de salida esperado
 
Responder siempre con esta estructura:
 
```txt
Pantalla generada:
Nombre:
Ruta:
Rol autorizado:
 
Archivos creados/modificados:
-
 
Componentes generados:
-
 
Hooks generados:
-
 
Servicios involucrados:
-
 
Validaciones Zod:
-
 
Seguridad aplicada:
-
 
Validaciones realizadas:
-
 
Hallazgos pendientes:
-
 
Estado final:
APROBADO | REQUIERE CORRECCIONES
```
 
---
 
## Prohibiciones
 
Este comando no debe:
 
* Crear páginas con lógica de negocio o llamadas directas a la API.
* Crear componentes sin archivo de tipos separado.
* Usar colores o fuentes fuera de la paleta de JICA.
* Usar librerías de iconos distintas a `lucide-react`.
* Definir queries de TanStack Query directamente en componentes o páginas.
* Usar strings sueltos como query keys.
* Crear mutaciones con retry distinto a 0.
* Omitir ProtectedRoute en rutas privadas.
* Omitir RoleGuard en elementos condicionados por rol.
* Almacenar el JWT en localStorage o sessionStorage.
* Usar any explícito en TypeScript.
* Crear formularios sin esquema Zod.
* Escribir mensajes de error de Zod en inglés.
* Generar código que dependa de MSAL, Entra ID, Azure o servicios cloud.
 