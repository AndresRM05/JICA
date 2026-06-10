# frontend-security.skill.md

## Propósito

Este skill define las reglas obligatorias de seguridad para el frontend de JICA. Copilot debe aplicar estas reglas al generar cualquier código relacionado con autenticación, autorización, manejo de sesiones y rutas protegidas.

---

## Microsoft Entra ID

JICA usa **Microsoft Entra ID** como proveedor de autenticación. El método es email y contraseña. No se implementa autenticación propia.

### SDKs obligatorios

```
@azure/msal-browser  3.x
@azure/msal-react    2.x
```

### Reglas

- Ningún componente ni página llama al SDK de MSAL directamente. Usar exclusivamente `frontend/src/services/authService.ts`.
- El Access Token nunca se almacena en `localStorage`, `sessionStorage` ni Zustand.
- El Access Token se obtiene siempre con `acquireTokenSilent()` desde el SDK.
- La configuración de MSAL vive en `frontend/src/services/msalConfig.ts`.
- `cacheLocation` debe ser siempre `sessionStorage`. No cambiar a `localStorage`.

### Inicialización

MSAL se inicializa en `frontend/src/main.tsx` antes de montar la aplicación con `MsalProvider`.

---

## MSAL

### Operaciones de autenticación

Todas las operaciones van en `frontend/src/services/authService.ts`:

```ts
loginUser(msalInstance)           // loginRedirect
logoutUser(msalInstance)          // logoutRedirect
getAccessToken(msalInstance, account) // acquireTokenSilent
```

### Escucha del estado de autenticación

La sincronización entre MSAL y el store de Zustand se realiza en `frontend/src/hooks/useAuthListener.ts` usando `onAuthStateChanged` de MSAL. Se monta una sola vez en la aplicación.

### Renovación de token

MSAL renueva el Access Token automáticamente. No implementar lógica manual de renovación.

---

## Roles

Los roles vienen en el claim `roles` del Access Token como App Roles de Entra ID.

### Roles definidos

| Rol | Valor en token |
|---|---|
| Inversionista | `investor` |
| Empresa (Pyme) | `business` |
| Administrador | `admin` |

### Tipo obligatorio

```ts
// frontend/src/types/auth.types.ts
export type UserRole = 'investor' | 'business' | 'admin';
```

### Reglas

- El rol viene del store, nunca de la URL.
- El frontend no es la fuente de verdad del control de acceso. El backend valida el rol en cada request.
- No usar condicionales inline `if (user.role === 'investor')` dispersos en componentes. Usar `RoleGuard`.

---

## Protected Routes

### ProtectedRoute

Toda ruta privada debe estar envuelta en `ProtectedRoute`. Vive en `frontend/src/routes/ProtectedRoute.tsx`.

Comportamiento obligatorio:
- Si no autenticado → redirect `/login`
- Si rol incorrecto → redirect `/unauthorized`
- Nunca renderizar el contenido si las condiciones no se cumplen

### Clasificación de rutas

```
Públicas (sin autenticación):
  /login, /register, /forgot-password, /

Privadas (cualquier rol autenticado):
  /dashboard, /profile

Por rol:
  investor:  /investments, /investments/:id, /simulate, /portfolio
  business:  /my-business, /financials, /publish-opportunity
  admin:     /admin/users, /admin/approvals, /admin/businesses
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

### Logout automático por inactividad

El hook `frontend/src/hooks/useInactivityLogout.ts` cierra sesión automáticamente por inactividad. El tiempo viene de la variable de entorno `VITE_INACTIVITY_TIMEOUT_MS`, nunca hardcodeado.

Eventos que reinician el timer: `mousemove`, `keydown`, `click`, `scroll`, `touchstart`.

### Logout manual

```
1. clearSession() en authStore
2. msalInstance.logoutRedirect()
```

### Persistencia

MSAL almacena la sesión en `sessionStorage`. La sesión se destruye al cerrar el tab. No cambiar este comportamiento.

### Errores de autenticación

Los errores de MSAL nunca se muestran directamente al usuario. Mostrar siempre: *"Credenciales incorrectas"* sin revelar si el email existe en el sistema.

---

## Variables de entorno de seguridad

```bash
VITE_AZURE_CLIENT_ID        # ID de la app en Entra ID
VITE_AZURE_TENANT_ID        # ID del tenant de Azure
VITE_AZURE_REDIRECT_URI     # URI de redirección registrada en Entra ID
VITE_AZURE_API_SCOPE        # Scope de la API del backend
VITE_INACTIVITY_TIMEOUT_MS  # Tiempo de inactividad en ms
```

Nunca incluir en variables de entorno del frontend:
- Client secret de Entra ID
- Claves privadas
- Credenciales del backend

---

## Reglas generales

- Nunca loguear Access Tokens, contraseñas ni datos financieros con `console.log`.
- Nunca exponer el rol del usuario en la URL.
- Toda comunicación con el backend es exclusivamente por HTTPS en `stage` y `production`.
- No transmitir tokens como query parameters en la URL.

---

## Ejemplos reales en el proyecto

> Estos archivos existen como estructura base y patrón de referencia. No representan la implementación final del MVP. Copilot debe usarlos únicamente para entender la estructura y nomenclatura del proyecto, no para copiar su contenido.

- `frontend/src/services/msalConfig.ts`
- `frontend/src/services/authService.ts`
- `frontend/src/store/authStore.ts`
- `frontend/src/routes/ProtectedRoute.tsx`
- `frontend/src/components/auth/RoleGuard.tsx`
- `frontend/src/hooks/useAuthListener.ts`
- `frontend/src/hooks/useInactivityLogout.ts`
