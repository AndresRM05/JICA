# frontend-api-contracts.skill.md

## Propósito

Este skill define las reglas obligatorias para contratos TypeScript, validación con Zod, servicios API y uso del cliente HTTP en el proyecto JICA. Copilot debe aplicar estas reglas al generar cualquier código relacionado con comunicación con el backend.

---

## Contratos TypeScript

### Reglas de tipos e interfaces

- Todas las interfaces y tipos usan **PascalCase**.
- Los tipos de formulario terminan con sufijo `FormData`.
- Los tipos de respuesta del backend terminan con sufijo `Response`.
- Los tipos de props de componentes terminan con sufijo `Props`.
- Los tipos compartidos entre módulos van en `frontend/src/types/`.

### Convenciones obligatorias

```ts
// Tipos de formulario
LoginFormData
RegisterFormData
InvestmentFormData

// Tipos de respuesta del backend
LoginResponse
InvestmentResponse
InvestorProfileResponse

// Props de componentes
InvestmentCardProps
LoginFormProps
DashboardLayoutProps
```

### Rol de usuario

```ts
// frontend/src/types/auth.types.ts
export type UserRole = 'investor' | 'business' | 'admin';

export interface AuthenticatedUser {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
}
```

---

## Zod

Zod se usa para validar datos de entrada en formularios antes de enviarlos al backend. No reemplaza la validación del backend — es una capa de UX.

### Ubicación

Los esquemas de validación van en `frontend/src/validations/`. Un archivo por formulario o dominio.

```
frontend/src/validations/
├── loginSchema.ts
├── registerSchema.ts
├── investmentSchema.ts
└── simulationSchema.ts
```

### Reglas

- Todo formulario que envía datos al backend debe tener un esquema Zod.
- Los mensajes de error deben estar en español y ser claros para el usuario.
- La validación de reglas de negocio no pertenece a Zod — pertenece al backend.
- Los esquemas deben inferir sus tipos con `z.infer<typeof schema>` para no duplicar tipos.

```ts
// frontend/src/validations/loginSchema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

---

## Servicios API

### Regla general

Todas las llamadas al backend deben realizarse a través de archivos de servicio en `frontend/src/services/`. Ningún componente, página ni hook llama a `httpClient` directamente.

### Ubicación y nomenclatura

Los archivos de servicio usan **camelCase** con sufijo `Service`:

```
frontend/src/services/
├── authService.ts
├── investmentService.ts
├── investorService.ts
├── documentService.ts
└── httpClient.ts
```

### Nomenclatura de funciones

Las funciones de servicio describen claramente su acción:

```ts
// Obtener datos
getAvailableInvestments()
getInvestmentById()
getInvestorProfile()

// Mutaciones
registerInvestor()
confirmInvestment()
uploadFinancialDocument()
registerInterest()
```

### Reglas

- Funciones que obtienen datos usan prefijos `get`, `fetch` o `load`.
- Ningún componente usa `fetch` o `axios` directamente.
- Ningún componente importa `httpClient` directamente.
- Los servicios no manejan estado — solo realizan llamadas HTTP y retornan datos.

---

## Http Client

### Regla general

El cliente HTTP centralizado vive en `frontend/src/services/httpClient.ts`. Es el único punto de salida de requests al backend.

### Responsabilidades del httpClient

- Adjuntar el Access Token de MSAL en cada request con `Authorization: Bearer <token>`.
- Manejar respuestas 401 — logout automático y redirect a `/login`.
- El token se obtiene siempre con `acquireTokenSilent()`, nunca desde el store.

### Reglas

- Toda comunicación con el backend usa `httpClient`, nunca `fetch` ni `axios` directo.
- En `stage` y `production` `VITE_API_BASE_URL` debe comenzar con `https://`.
- No transmitir tokens ni datos sensibles como query parameters en la URL.
- Los formularios con datos sensibles se envían por `POST` o `PUT`, nunca por `GET`.

---

## DTOs del frontend

Los DTOs del frontend son los tipos que definen qué datos se envían y reciben del backend.

### Reglas

- Los DTOs de respuesta nunca incluyen datos sensibles sin masking. El backend aplica masking antes de responder.
- Los DTOs de entrada deben tener un esquema Zod asociado para validación.
- Los DTOs se infieren desde los esquemas Zod con `z.infer<>` cuando es posible.

```ts
// Ejemplo: DTO inferido desde esquema Zod
export const createInvestmentSchema = z.object({
  amount: z.number().min(0, 'El monto debe ser mayor a 0'),
  investmentId: z.string().uuid('ID de inversión inválido'),
});

export type CreateInvestmentDto = z.infer<typeof createInvestmentSchema>;
```

---

## Ejemplos reales en el proyecto

> Estos archivos existen como estructura base y patrón de referencia. No representan la implementación final del MVP. Copilot debe usarlos únicamente para entender la estructura y nomenclatura del proyecto, no para copiar su contenido.

- `frontend/src/services/httpClient.ts`
- `frontend/src/services/authService.ts`
- `frontend/src/types/auth.types.ts`
