# frontend-api-contracts.skill.md
 
## Restricción principal del MVP
 
Este skill debe generar únicamente código para el MVP académico local de JICA.
 
No debe proponer, exigir ni generar código que dependa de:
- Azure, MSAL o Microsoft Entra ID
- Firebase Auth o Auth0
- Sentry
- Redis, BullMQ o Socket.io
- Servicios cloud o de pago
El stack permitido para contratos y comunicación HTTP es:
```
TypeScript + Zod + axios + JWT local
```
 
El backend corre localmente en `http://localhost:3000`. No se usa HTTPS en development.
 
Si el README menciona tecnologías de producción, deben considerarse fuera del alcance del MVP, salvo que el usuario lo solicite explícitamente.
 
---
 
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
SimulationFormData
 
// Tipos de respuesta del backend
LoginResponse
InvestmentResponse
SimulationResponse
 
// Props de componentes
InvestmentCardProps
LoginFormProps
DashboardLayoutProps
```
 
### Tipos de autenticación para el MVP
 
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
 
---
 
## Zod
 
Zod se usa para validar datos de entrada en formularios antes de enviarlos al backend. No reemplaza la validación del backend — es una capa de UX.
 
### Ubicación
 
Los esquemas de validación van en `frontend/src/validations/`. Un archivo por formulario o dominio.
 
```
frontend/src/validations/
├── loginSchema.ts
├── registerSchema.ts
├── simulationSchema.ts
└── confirmInvestmentSchema.ts
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
 
```ts
// frontend/src/validations/simulationSchema.ts
import { z } from 'zod';
 
export const simulationSchema = z.object({
  amount: z.number().min(1, 'El monto debe ser mayor a 0'),
  investmentId: z.string().uuid('ID de inversión inválido'),
});
 
export type SimulationFormData = z.infer<typeof simulationSchema>;
```
 
---
 
## Servicios API
 
### Regla general
 
Todas las llamadas al backend deben realizarse a través de archivos de servicio en `frontend/src/services/`. Ningún componente, página ni hook llama a `httpClient` directamente.
 
### Servicios del MVP
 
```
frontend/src/services/
├── authService.ts        ← register, login, getMe
├── investmentService.ts  ← getInvestments, getInvestmentById, registerInterest, confirmInvestment
├── simulationService.ts  ← runSimulation
└── httpClient.ts         ← cliente HTTP centralizado
```
 
### Ejemplos de endpoints que se podrian utilizar 
 
```ts
// authService.ts
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
 
// investmentService.ts
GET  /api/v1/investments
GET  /api/v1/investments/:id
POST /api/v1/investments/:id/interest
POST /api/v1/investments/:id/confirm
 
// simulationService.ts
POST /api/v1/simulation
```
 
### Nomenclatura de funciones
 
```ts
// authService.ts
registerUser(data: RegisterFormData): Promise<void>
loginUser(data: LoginFormData): Promise<LoginResponse>
getCurrentUser(): Promise<AuthenticatedUser>
 
// investmentService.ts
getAvailableInvestments(filters?: InvestmentFilters): Promise<InvestmentResponse[]>
getInvestmentById(id: string): Promise<InvestmentResponse>
registerInterest(investmentId: string): Promise<void>
confirmInvestment(investmentId: string, amount: number): Promise<void>
 
// simulationService.ts
runSimulation(data: SimulationFormData): Promise<SimulationResponse>
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
 
### Responsabilidades del httpClient en el MVP
 
- Adjuntar el JWT local en cada request con `Authorization: Bearer <token>`.
- El token se lee desde `authStore` de Zustand.
- Manejar respuestas 401 — ejecutar `clearSession()` y redirigir a `/login`.
- Apuntar a `VITE_API_BASE_URL` configurado en `.env.development`.
```ts
// Referencia de implementación — httpClient.ts
httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
 
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```
 
### Reglas
 
- Toda comunicación con el backend usa `httpClient`, nunca `fetch` ni `axios` directo.
- No transmitir tokens ni datos sensibles como query parameters en la URL.
- Los formularios con datos sensibles se envían por `POST` o `PUT`, nunca por `GET`.
### Variable de entorno requerida
 
```bash
# frontend/.env.development
VITE_API_BASE_URL=http://localhost:3000
```
 
---
 
## DTOs del frontend
 
Los DTOs del frontend son los tipos que definen qué datos se envían y reciben del backend.
 
### Reglas
 
- Los DTOs de respuesta nunca incluyen datos sensibles sin masking. El backend aplica masking antes de responder.
- Los DTOs de entrada deben tener un esquema Zod asociado para validación.
- Los DTOs se infieren desde los esquemas Zod con `z.infer<>` cuando es posible.
```ts
// Ejemplo: DTO inferido desde esquema Zod
export const simulationSchema = z.object({
  amount: z.number().min(1, 'El monto debe ser mayor a 0'),
  investmentId: z.string().uuid('ID de inversión inválido'),
});
 
export type SimulationFormData = z.infer<typeof simulationSchema>;
```
 
---
 
## Ejemplos reales en el proyecto
 
> Estos archivos existen como estructura base y patrón de referencia. No representan la implementación final del MVP. Copilot debe usarlos únicamente para entender la estructura y nomenclatura del proyecto, no para copiar su contenido.
 
- `frontend/src/services/httpClient.ts`
- `frontend/src/services/authService.ts`
- `frontend/src/types/auth.types.ts`
 