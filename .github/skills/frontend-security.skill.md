# frontend-security.skill.md
 
## Restricción principal del MVP
 
Este skill debe generar únicamente código para el MVP académico local de JICA.
 
No debe proponer, exigir ni generar código que dependa de:
- Microsoft Entra ID o MSAL
- Firebase Auth o Auth0
- Azure Key Vault
- Azure o cualquier servicio cloud
- Sentry
- Servicios de pago o infraestructura de producción
El stack de autenticación permitido para el MVP es:
```
JWT local + bcrypt + Zustand
```
 
Si el README menciona tecnologías de producción como MSAL o Entra ID, deben considerarse fuera del alcance del MVP, salvo que el usuario lo solicite explícitamente.
 
---
 
## Propósito
 
Este skill define las reglas obligatorias de seguridad para el frontend de JICA. Copilot debe aplicar estas reglas al generar cualquier código relacionado con autenticación, autorización, manejo de sesiones y rutas protegidas.
 
---
 
## Autenticación — JWT local
 
JICA usa **JWT local** para autenticación en el MVP. El backend genera el token con una clave secreta configurada en `.env`. El método es email y contraseña.
 
### Flujo de autenticación del MVP
 
```
1. Usuario ingresa email + contraseña en el formulario de login
2. Frontend llama: POST /api/v1/auth/login
3. Backend valida credenciales y responde con: { accessToken, user }
4. Frontend guarda accessToken y user en authStore (Zustand)
5. Cada request al backend incluye: Authorization: Bearer <accessToken>
6. Si el backend responde 401 → clearSession() + redirect /login
```
 
### Operaciones de autenticación
 
Todas las operaciones van en `frontend/src/services/authService.ts`:
 
```ts
loginUser(data: LoginFormData): Promise<LoginResponse>   // POST /api/v1/auth/login
registerUser(data: RegisterFormData): Promise<void>       // POST /api/v1/auth/register
getCurrentUser(): Promise<AuthenticatedUser>              // GET  /api/v1/auth/me
```
 
### Reglas
 
- Ningún componente ni página llama a `httpClient` directamente. Usar exclusivamente `authService.ts`.
- El JWT nunca se almacena en `localStorage` ni `sessionStorage`. Vive en `authStore` de Zustand en memoria.
- Ningún componente accede directamente al token — el `httpClient` lo adjunta automáticamente.
---
 
## Roles
 
Los roles vienen en el payload del JWT generado por el backend.
 
### Roles definidos para el MVP
 
| Rol | Valor en token | Acceso en el MVP |
|---|---|---|
| Inversionista | `investor` | Dashboard, detalle, simulación, confirmación |
| Empresa (Pyme) | `business` | Fuera del alcance del MVP inicial |
| Administrador | `admin` | Fuera del alcance del MVP inicial |
 
> El MVP se enfoca en el flujo del inversionista. Los roles `business` y `admin` están definidos pero sus rutas y funcionalidades quedan fuera del MVP inicial.
 
### Tipo obligatorio
 
```ts
// frontend/src/types/auth.types.ts
export type UserRole = 'investor' | 'business' | 'admin';
 
export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}
 
export interface LoginResponse {
  accessToken: string;
  user: AuthenticatedUser;
}
```
 
### Reglas
 
- El rol viene del store, nunca de la URL.
- El frontend no es la fuente de verdad del control de acceso. El backend valida el token y el rol en cada request.
- No usar condicionales inline `if (user.role === 'investor')` dispersos en componentes. Usar `RoleGuard`.
---
 
## Protected Routes
 
### ProtectedRoute
 
Toda ruta privada debe estar envuelta en `ProtectedRoute`. Vive en `frontend/src/routes/ProtectedRoute.tsx`.
 
Comportamiento obligatorio:
- Si no autenticado → redirect `/login`
- Si rol incorrecto → redirect `/unauthorized`
- Nunca renderizar el contenido si las condiciones no se cumplen
```tsx
// Referencia de implementación
export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
 
  if (isLoading) return <FullScreenLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
 
  return <>{children}</>;
}
```
 
### Rutas del MVP
 
```
Públicas (sin autenticación):
  /login
  /register
  /
 
Privadas del MVP (rol investor):
  /dashboard
  /investments/:id
  /simulate
  /confirm
```
 
### RoleGuard
 
Los elementos de UI condicionados por rol usan `RoleGuard` en `frontend/src/components/auth/RoleGuard.tsx`. No se usan condicionales inline.
 
```tsx
// Uso correcto
<RoleGuard allowedRoles={['investor']}>
  <SimulateInvestmentButton />
</RoleGuard>
```
 
### Reglas
 
- Nunca ocultar rutas o elementos solo con CSS. Si el usuario no tiene acceso debe ser redirigido.
- Nunca renderizar rutas sin pasar por `ProtectedRoute`.
- Nunca renderizar elementos por rol sin pasar por `RoleGuard`.
---
 
## Manejo de sesiones
 
### Persistencia del token en el MVP
 
El JWT vive en `authStore` de Zustand en memoria. Al recargar la página se pierde. El usuario debe volver a hacer login.
 

 
### Logout manual
 
```ts
// Flujo correcto de logout en el MVP:
// 1. clearSession() en authStore — limpia user y accessToken
// 2. redirect '/login'
```
 
### Errores de autenticación
 
Los errores del backend nunca se muestran directamente al usuario. Mostrar siempre un mensaje genérico: *"Credenciales incorrectas"* sin revelar si el email existe en el sistema.
 
---
 
## Variables de entorno del MVP
 
```bash
# frontend/.env.development
VITE_API_BASE_URL=http://localhost:3000
```
 
Nunca incluir en variables de entorno del frontend:
- JWT_SECRET o cualquier clave privada del backend
- Credenciales de base de datos
- Claves de servicios externos
---
 
## Reglas generales
 
- Nunca loguear tokens, contraseñas ni datos financieros con `console.log`.
- Nunca exponer el rol del usuario en la URL.
- No transmitir tokens como query parameters en la URL.
- Los formularios con contraseñas se envían siempre por `POST`, nunca por `GET`.
---
 
## Ejemplos reales en el proyecto
 
> Estos archivos existen como estructura base y patrón de referencia. No representan la implementación final del MVP. Copilot debe usarlos únicamente para entender la estructura y nomenclatura del proyecto, no para copiar su contenido.
 
- `frontend/src/services/authService.ts`
- `frontend/src/store/authStore.ts`
- `frontend/src/routes/ProtectedRoute.tsx`
- `frontend/src/components/auth/RoleGuard.tsx`
- `frontend/src/types/auth.types.ts`
 