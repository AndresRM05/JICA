# JICA
# Frontend

## 2.1 Stack de tecnologías del frontend

El frontend de JICA será desarrollado como una aplicación web de tipo **Client Side Rendering**, orientada a inversionistas que necesitan explorar oportunidades de inversión, revisar información financiera de pymes gastronómicas y simular inversiones dentro de una interfaz clara, moderna y segura.



| Categoría | Tecnología | Versión compatible | Uso dentro de JICA |
|---|---|---:|---|
| Application type | Client Side Rendering Web App | N/A | La aplicación se renderiza principalmente en el navegador del usuario. |
| Framework Frontend | React | 19.x | Construcción de pantallas y componentes reutilizables. |
| Runtime Backend | Node.js | 22.x | Runtime utilizado para ejecutar herramientas del frontend, scripts y dependencias. |
| Lenguaje | TypeScript | 6.x | Tipado estático para reducir errores en datos financieros y contratos. |
| Manejo de estado | Zustand | 5.x | Manejo de estado global simple, como usuario autenticado, filtros y simulación. |
| Validación de datos | Zod | 4.x | Validación de formularios, datos de entrada y contratos con el backend. |
| Testing Unitario | Vitest | 4.x | Pruebas unitarias de componentes, hooks y funciones utilitarias. |
| E2E Testing | Playwright | 1.x | Pruebas de flujos completos: registro, dashboard, detalle, simulación e inversión. |
| Linting | ESLint | 9.x | Validación automática de reglas de calidad de código. |
| Formateo de código | Prettier | 3.x | Formato consistente en todos los archivos del frontend. |
| Git Hooks | Husky | 9.x | Ejecución automática de validaciones antes de commits. |
| Cloud Provider | Microsoft Azure | N/A | Proveedor cloud seleccionado para despliegue del frontend. |
| Hosting | Azure Static Web Apps | N/A | Hosting del frontend compilado. |
| CI/CD | GitHub Actions | N/A | Automatización de pruebas, build y despliegue. |
| Observabilidad | Sentry Frontend SDK | N/A | Monitoreo de errores y fallos en producción. |
| Repositorio | GitHub | N/A | Control de versiones y colaboración del equipo. |
| Environments | development, stage, production | N/A | Ambientes separados para desarrollo, pruebas y producción. |

### Justificación de elección

React fue seleccionado porque permite construir una interfaz modular basada en componentes reutilizables. Esto es importante para JICA, ya que pantallas como el dashboard, las cards de inversión, el detalle financiero de una pyme, la simulación de inversión y la confirmación pueden reutilizar componentes comunes.

TypeScript será obligatorio para reducir errores relacionados con estructuras financieras, como ROI, riesgo, montos de inversión, retornos estimados y datos de pymes.

Zustand se utilizará para manejar estados globales de forma simple y liviana, evitando una complejidad innecesaria para el MVP.

Zod será utilizado para validar datos antes de enviarlos al backend, especialmente en formularios de registro, login y simulación de inversión.

Vitest y Playwright permitirán validar tanto componentes individuales como flujos completos del usuario.

ESLint, Prettier y Husky serán obligatorios para mantener calidad, consistencia y validaciones automáticas antes de integrar cambios al repositorio.

Azure Static Web Apps será utilizado para publicar el frontend de forma segura y separada por ambientes. GitHub Actions automatizará el proceso de integración y despliegue continuo.


## 2.2 Estructura general del frontend

El frontend de JICA estará ubicado dentro de la carpeta `/frontend` del repositorio. La aplicación debe mantener una estructura modular, separando responsabilidades entre páginas, componentes reutilizables, servicios, hooks, validaciones, tipos y configuración.



```txt
/frontend
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── validations/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
└── README.md
```

| Carpeta            | Responsabilidad                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `/public`          | Archivos estáticos públicos como favicon, logos o imágenes que no requieren procesamiento. |
| `/src/assets`      | Imágenes, íconos, ilustraciones y recursos visuales usados por la interfaz.                |
| `/src/components`  | Componentes reutilizables y genéricos como botones, cards, inputs, modales y tablas.       |
| `/src/features`    | Módulos funcionales del sistema, agrupados por dominio.                                    |
| `/src/hooks`       | Custom hooks reutilizables para lógica de frontend.                                        |
| `/src/layouts`     | Estructuras visuales generales como layout autenticado, layout público o dashboard layout. |
| `/src/pages`       | Pantallas principales asociadas a rutas.                                                   |
| `/src/routes`      | Configuración centralizada de rutas públicas, privadas y protegidas.                       |
| `/src/services`    | Comunicación con APIs del backend y servicios externos.                                    |
| `/src/store`       | Estado global manejado con Zustand.                                                        |
| `/src/types`       | Tipos e interfaces TypeScript compartidas.                                                 |
| `/src/validations` | Esquemas de validación con Zod.                                                            |
| `/src/utils`       | Funciones utilitarias reutilizables.                                                       |
| `/tests/unit`      | Pruebas unitarias con Vitest.                                                              |
| `/tests/e2e`       | Pruebas end-to-end con Playwright.                                                         |

## 2.3 Desarrollo de componentes visuales

Los componentes visuales del frontend de JICA deben desarrollarse bajo un enfoque modular, reutilizable y mantenible. Cada componente debe tener una única responsabilidad visual o funcional, evitando mezclar lógica de negocio, llamadas a API o validaciones complejas dentro del JSX.

El objetivo es que cualquier programador pueda identificar rápidamente qué componente debe modificar, reutilizar o extender.

### Principios generales

- Cada componente debe tener una responsabilidad clara.
- Los componentes deben ser reutilizables siempre que sea posible.
- La lógica de negocio no debe colocarse directamente dentro de componentes visuales.
- Los estilos deben implementarse con Tailwind CSS.
- Las props deben estar tipadas con TypeScript.
- Los componentes deben ser pequeños, legibles y fáciles de probar.
- Los componentes compartidos deben ubicarse en `/src/components`.
- Los componentes específicos de una funcionalidad deben ubicarse dentro de `/src/features`.

---


## Estructura recomendada de un componente

Cada componente reutilizable seguirá una arquitectura modular separando lógica, tipos y exportaciones.

### Ejemplo implementado

/src/components/ui/Button/

- [Button.tsx](./frontend/src/components/ui/Button/Button.tsx)
  - Contiene la lógica visual y renderizado del componente.

- [Button.types.ts](./frontend/src/components/ui/Button/Button.types.ts)
  - Define interfaces y tipos TypeScript utilizados por el componente.

- [index.ts](./frontend/src/components/ui/Button/index.ts)
  - Centraliza las exportaciones del componente.


| Tipo de componente                 | Ubicación                                      | Ejemplos                                 |
| ---------------------------------- | ---------------------------------------------- | ---------------------------------------- |
| Componentes UI genéricos           | `/src/components/ui`                           | Button, Input, Card, Badge, Modal        |
| Componentes de layout              | `/src/layouts`                                 | DashboardLayout, AuthLayout              |
| Componentes específicos de negocio | `/src/features`                                | InvestmentCard, RiskBadge, ROIChart      |
| Páginas                            | `/src/pages` o `/src/features/{feature}/pages` | DashboardPage, LoginPage, SimulationPage |

### Ejemplos reales implementados
/src/features/investments/components/InvestmentCard
#### Componentes específicos de negocio

- [InvestmentCard.tsx](./frontend/src/features/investments/components/InvestmentCard/InvestmentCard.tsx)
- [InvestmentCard.types.ts](./frontend/src/features/investments/components/InvestmentCard/InvestmentCard.types.ts)

## 2.4 Convenciones de nomenclatura

Para mantener el código del frontend consistente, legible se deben seguir las siguientes convenciones de nomenclatura en todo el proyecto.

### Componentes

Los componentes de React deben nombrarse usando **PascalCase**.

```tsx
InvestorCard.tsx
InvestmentDetailModal.tsx
LoginForm.tsx
RegisterForm.tsx
DashboardLayout.tsx
```

Cada archivo de componente debe tener el mismo nombre que el componente principal que exporta.

```tsx
// InvestmentCard.tsx
export function InvestmentCard() {
  return <div>...</div>;
}
```

No se deben usar nombres genéricos como:

```tsx
Component.tsx
Card.tsx
View.tsx
Page.tsx
```

En su lugar, el nombre debe describir claramente su propósito dentro del sistema.

```tsx
InvestmentCard.tsx
InvestorProfileView.tsx
ProjectSummaryCard.tsx
ConfirmInvestmentModal.tsx
```

---

### Páginas

Las páginas principales deben nombrarse usando **PascalCase** y terminar con el sufijo `Page`.

```tsx
LoginPage.tsx
RegisterPage.tsx
DashboardPage.tsx
InvestmentDetailsPage.tsx
ProfilePage.tsx
```

Esto permite diferenciar fácilmente una página completa de un componente reutilizable.

---

### Layouts

Los layouts deben nombrarse usando **PascalCase** y terminar con el sufijo `Layout`.

```tsx
AuthLayout.tsx
DashboardLayout.tsx
MainLayout.tsx
```

Un layout debe utilizarse únicamente para definir estructura visual común, como navegación, sidebar, header, footer o contenedores generales.

---

### Hooks personalizados

Los hooks personalizados deben nombrarse usando **camelCase** y siempre deben iniciar con el prefijo `use`.

```tsx
useAuth.ts
useInvestments.ts
useInvestorProfile.ts
useInvestmentForm.ts
```

No se deben crear hooks con nombres que no indiquen claramente su responsabilidad.

Incorrecto:

```tsx
useData.ts
useHandler.ts
useLogic.ts
```

Correcto:

```tsx
useInvestmentDetails.ts
useRegisterInvestor.ts
useConfirmInvestment.ts
```

---

### Servicios y llamadas a API

Los archivos encargados de comunicarse con el backend deben nombrarse usando **camelCase** y terminar con el sufijo `Service`.

```tsx
authService.ts
investmentService.ts
investorService.ts
projectService.ts
```

Las funciones internas deben describir claramente la acción que realizan.

```tsx
loginUser()
registerInvestor()
getAvailableInvestments()
getInvestmentById()
confirmInvestment()
```

---

### Carpetas

Las carpetas deben nombrarse usando **kebab-case**.

```txt
components/
pages/
layouts/
hooks/
services/
utils/
investment-details/
investor-profile/
auth-forms/
```

No se deben usar espacios, mayúsculas ni guiones bajos en nombres de carpetas.

Incorrecto:

```txt
InvestmentDetails/
investment_details/
Investor Profile/
```

Correcto:

```txt
investment-details/
investor-profile/
```

---

### Archivos de utilidades

Los archivos de utilidades deben nombrarse usando **camelCase** y deben reflejar claramente su función.

```tsx
formatCurrency.ts
formatDate.ts
validateEmail.ts
calculateReturn.ts
```

Las funciones utilitarias también deben usar **camelCase**.

```tsx
formatCurrency()
formatDate()
validateEmail()
calculateExpectedReturn()
```

---

### Interfaces y tipos

Las interfaces y tipos de TypeScript deben nombrarse usando **PascalCase**.

```tsx
Investor
Investment
InvestmentProject
UserSession
RegisterFormData
```

Cuando un tipo representa los datos de un formulario, debe terminar con el sufijo `FormData`.

```tsx
LoginFormData
RegisterFormData
InvestmentFormData
```

Cuando un tipo representa una respuesta del backend, debe terminar con el sufijo `Response`.

```tsx
LoginResponse
InvestmentResponse
InvestorProfileResponse
```

Cuando un tipo representa propiedades de un componente, debe terminar con el sufijo `Props`.

```tsx
InvestmentCardProps
LoginFormProps
DashboardLayoutProps
```

---

### Variables y funciones

Las variables y funciones deben usar **camelCase**.

```tsx
const investorName = "Juan Pérez";
const availableInvestments = [];
const selectedInvestment = null;

function handleLogin() {}
function handleRegister() {}
function handleConfirmInvestment() {}
```

Las funciones que manejan eventos de usuario deben iniciar con el prefijo `handle`.

```tsx
handleSubmit()
handleClick()
handleCancel()
handleConfirmInvestment()
handleViewDetails()
```

Las funciones que obtienen datos deben iniciar preferiblemente con verbos como `get`, `fetch` o `load`.

```tsx
getInvestmentById()
fetchAvailableInvestments()
loadInvestorProfile()
```

---

### Constantes

Las constantes globales deben nombrarse usando **UPPER_SNAKE_CASE**.

```tsx
API_BASE_URL
MAX_INVESTMENT_AMOUNT
MIN_PASSWORD_LENGTH
DEFAULT_CURRENCY
```

Las constantes locales dentro de componentes pueden usar **camelCase** si no representan valores globales.

```tsx
const maxVisibleProjects = 6;
const defaultRiskLevel = "medium";
```

---

### Estilos con Tailwind CSS

El proyecto utilizará clases de Tailwind CSS directamente en los componentes. Las clases deben escribirse de forma ordenada para mejorar la legibilidad.

Orden recomendado:

1. Layout y display
2. Espaciado
3. Tamaño
4. Bordes
5. Colores
6. Tipografía
7. Estados e interacciones

Ejemplo:

```tsx
<button className="flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
  Confirmar inversión
</button>
```

No se deben crear clases personalizadas innecesarias si Tailwind ya ofrece una utilidad equivalente.

Incorrecto:

```css
.primary-button {
  background-color: blue;
  color: white;
}
```

Correcto:

```tsx
<button className="bg-blue-600 text-white">
  Confirmar inversión
</button>
```

---

### Clases personalizadas

Solo se deben crear clases personalizadas cuando:

* La clase representa un patrón visual reutilizable.
* La combinación de clases Tailwind es demasiado extensa.
* El estilo no puede resolverse fácilmente con utilidades de Tailwind.

Las clases personalizadas deben usar **kebab-case**.

```css
.dashboard-container
.investment-card-highlight
.auth-form-wrapper
```

---

### Nombres prohibidos o poco descriptivos

No se deben utilizar nombres ambiguos, genéricos o difíciles de interpretar.

Evitar:

```tsx
data
info
item
thing
stuff
temp
aux
component
screen
box
```

Preferir nombres descriptivos:

```tsx
investmentData
investorInfo
selectedProject
temporaryToken
dashboardContainer
```

---
## 2.5 Lineamientos de CSS y estilos

Esta sección define las reglas visuales que debe seguir el frontend del sistema. 

El frontend debe utilizar **Tailwind CSS** como herramienta principal de estilos. Se deben evitar estilos CSS aislados o inconsistentes, salvo cuando sea estrictamente necesario.

---

### Paleta de colores

La paleta de colores debe transmitir confianza, seguridad financiera, claridad y modernidad. 

### Colores principales

```ts
primary: "#064E3B"       // Verde oscuro JICA
secondary: "#047857"     // Verde principal para acciones
accent: "#22C55E"        // Verde financiero positivo
background: "#F8FAFC"    // Fondo general claro
surface: "#FFFFFF"       // Tarjetas y contenedores
textPrimary: "#0F172A"   // Texto principal
textSecondary: "#64748B" // Texto secundario
border: "#E2E8F0"        // Bordes suaves
error: "#DC2626"         // Errores
warning: "#F59E0B"       // Riesgo medio / advertencias
success: "#16A34A"       // Confirmaciones
info: "#2563EB"          // Información secundaria, no color principal
```

### Uso recomendado

* `primary`: encabezados, navegación principal, elementos institucionales.
* `secondary`: botones principales, enlaces y acciones importantes.
* `accent`: indicadores positivos, rentabilidad, inversión confirmada.
* `background`: fondo general de las pantallas.
* `surface`: tarjetas, formularios, modales y paneles.
* `error`: mensajes de error y validaciones fallidas.
* `warning`: alertas preventivas.
* `success`: operaciones exitosas.

No se deben usar colores arbitrarios directamente en los componentes si ya existe un color definido en la paleta.

---

### Tipografías

Tipografía que se va a utilizar:

```txt
Inter
```

En caso de no estar disponible, se debe usar la siguiente cadena de respaldo:

```css
font-family: Inter, system-ui, sans-serif;
```

### Jerarquía tipográfica

```txt
Título principal: text-3xl font-bold
Título de sección: text-2xl font-semibold
Subtítulo: text-xl font-semibold
Texto base: text-base font-normal
Texto secundario: text-sm text-slate-500
Texto auxiliar: text-xs text-slate-400
```

No se deben mezclar muchas fuentes ni tamaños sin justificación.

---

### Logos

El logo del sistema debe utilizarse de forma consistente en todas las pantallas.

### Reglas de uso

* El logo debe aparecer en la pantalla de inicio de sesión, registro y layout principal.
* No se debe deformar, recortar ni cambiar su proporción.
* Debe mantener suficiente espacio alrededor.
* No debe colocarse sobre fondos con poco contraste.
* La versión horizontal debe usarse en desktop.
* La versión compacta o isotipo debe usarse en mobile o sidebar reducido.

El atributo `alt` siempre debe estar presente para accesibilidad.

---

## Iconografía

La iconografía debe ser simple, clara y consistente. 

Librería que se va a utilizar :
```txt
lucide-react
```

### Reglas de uso

* Todos los iconos deben mantener el mismo estilo visual.
* El tamaño estándar debe ser `20px` o `24px`.
* Los iconos no deben reemplazar texto importante.
* Cuando un icono represente una acción crítica, debe ir acompañado de una etiqueta textual.
* No se deben mezclar librerías de iconos distintas sin justificación.

---

## Espaciados

El sistema debe seguir una escala de espaciado consistente basada en Tailwind CSS.

### Escala recomendada

```txt
xs: 0.25rem  // p-1
sm: 0.5rem   // p-2
md: 1rem     // p-4
lg: 1.5rem   // p-6
xl: 2rem     // p-8
2xl: 3rem    // p-12
```

### Reglas generales

* Las tarjetas deben usar `p-4` o `p-6`.
* Las secciones principales deben usar `py-8` o `py-12`.
* Los elementos internos deben separarse con `gap-4` o `gap-6`.
* No se deben usar márgenes aleatorios sin seguir la escala de Tailwind.

---

## Estilos reutilizables

Los patrones visuales frecuentes deben estandarizarse para evitar duplicación y mantener consistencia.

### Botón primario

Uso: acciones principales como registrarse, iniciar sesión o confirmar inversión.

```tsx
className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
```

### Botón secundario

Uso: acciones alternativas o menos importantes.

```tsx
className="inline-flex items-center justify-center rounded-xl border border-emerald-700 px-5 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-100"
```

### Tarjetas

Uso: proyectos de inversión, resumen financiero, datos del usuario.

```tsx
className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
```

### Inputs

Uso: formularios de registro, inicio de sesión, perfil e inversión.

```tsx
className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
```

### Mensajes de error

```tsx
className="text-sm font-medium text-red-600"
```

### Etiquetas visuales

```tsx
className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
```

---

## Responsive design

El sistema debe diseñarse siguiendo un enfoque **mobile-first**. Esto significa que primero se debe construir la interfaz para pantallas pequeñas y luego adaptarla progresivamente a pantallas medianas y grandes.

### Breakpoints recomendados

```txt
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Reglas responsive

* En mobile, el contenido debe mostrarse en una sola columna.
* En tablet, pueden utilizarse dos columnas cuando el contenido lo permita.
* En desktop, se pueden usar grids de tres o más columnas.
* Los formularios deben ocupar el ancho disponible en mobile.
* La navegación principal debe adaptarse a menú colapsable en pantallas pequeñas.
* Las tablas grandes deben convertirse en tarjetas o permitir scroll horizontal.

---

## Branding y etiquetado visual

La identidad visual de JICA debe seguir el estilo definido en los prototipos: interfaz fintech limpia, fondo claro, tarjetas blancas, bordes redondeados, sombras suaves, verde oscuro como color principal y acentos amarillos/naranjas únicamente para advertencias o riesgo medio.

### Lineamientos de branding

* Usar lenguaje visual limpio y profesional.
* Evitar saturación de colores.
* Priorizar claridad sobre decoración.
* Usar tarjetas para separar información financiera.
* Resaltar datos clave como rentabilidad, monto mínimo, riesgo y estado del proyecto.
* Mantener consistencia entre dashboard, formularios y páginas de detalle.

---

## Etiquetas de estado

Las etiquetas visuales deben ayudar al usuario a identificar rápidamente el estado de una inversión o proyecto.

### Estados recomendados

```txt
Disponible
En revisión
Financiado
Confirmado
Pendiente
Rechazado
Cancelado
```

### Estilos sugeridos

```tsx
Disponible: bg-green-100 text-green-700
En revisión: bg-yellow-100 text-yellow-700
Financiado: bg-blue-100 text-blue-700
Confirmado: bg-green-100 text-green-700
Pendiente: bg-orange-100 text-orange-700
Rechazado: bg-red-100 text-red-700
Cancelado: bg-slate-100 text-slate-600
```


---

## Etiquetas de riesgo

Los niveles de riesgo deben representarse con texto y color. Nunca se debe depender únicamente del color.

```txt
Riesgo bajo
Riesgo medio
Riesgo alto
```

Estilos sugeridos:

```tsx
Riesgo bajo: bg-green-100 text-green-700
Riesgo medio: bg-yellow-100 text-yellow-700
Riesgo alto: bg-red-100 text-red-700
```
---

## Reglas generales de estilos

* No usar estilos inline salvo casos excepcionales.
* No duplicar clases extensas si el patrón se repite muchas veces.
* Mantener consistencia entre botones, tarjetas, formularios y modales.
* Usar Tailwind CSS como fuente principal de estilos.
* Evitar colores o tamaños arbitrarios sin justificación.
* Todos los elementos interactivos deben tener estados `hover`, `focus` y `disabled`.
* Los textos deben tener contraste suficiente con el fondo.
* La interfaz debe ser clara tanto para usuarios técnicos como no técnicos.

---
## 2.6 Seguridad del frontend
## Tecnologías y servicios de autenticación
 
| Categoría | Tecnología / Servicio | Versión | Uso |
|---|---|---|---|
| Proveedor de autenticación | Firebase Authentication | SDK v10.x | Gestión de identidad, login, registro, sesión y tokens |
| SDK cliente | `firebase` (npm) | 10.x | Integración del frontend con Firebase Auth |
| Método de autenticación | Email y contraseña | — | Único método de login en JICA MVP |
| Token de identidad | Firebase ID Token (JWT) | — | Token enviado al backend en cada request |
| Renovación de token | Firebase SDK (automático) | — | El SDK renueva el ID Token cada 60 minutos sin intervención manual |
| Estado de sesión | Zustand + Firebase `onAuthStateChanged` | — | Sincronización del estado de autenticación con el store global |
| Rol de usuario | Custom Claims en Firebase Token | — | El backend asigna el rol (`investor`, `business`, `admin`) como claim en el token |
 
---
 
## Autenticación
 
JICA utiliza **Firebase Authentication** con método de **email y contraseña**. El frontend no gestiona tokens manualmente; el SDK de Firebase se encarga de la emisión, almacenamiento y renovación del ID Token.
 
### Cómo funciona Firebase Auth en JICA
 
```
1. Usuario ingresa email + contraseña en el formulario de login
2. Frontend llama: signInWithEmailAndPassword(auth, email, password)
3. Firebase autentica y devuelve un UserCredential con un ID Token (JWT, exp: 1 hora)
4. Firebase SDK almacena la sesión de forma segura internamente (IndexedDB)
5. Frontend obtiene el ID Token con: user.getIdToken()
6. Cada request al backend incluye: Authorization: Bearer <idToken>
7. El SDK renueva el ID Token automáticamente antes de que expire
8. Si el usuario cierra sesión o el token es revocado → sesión destruida
```

### Inicialización de Firebase
 
La configuración de Firebase debe ubicarse en `/src/services/firebase.ts`. Las credenciales deben provenir exclusivamente de variables de entorno.
Ejemplo en [firebase.ts](./frontend/src/services/firebase.ts)
 
Variables de entorno requeridas en todos los ambientes:
 
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
```

### Servicio de autenticación
 
Todas las operaciones de autenticación deben centralizarse en `/src/services/authService.ts`. Ningún componente o página debe llamar al SDK de Firebase directamente.

 Ejemplo en [authService.ts](./frontend/src/services/authService.ts)


 ### Store de autenticación
El store de Zustand debe sincronizarse con Firebase `onAuthStateChanged`. El ID Token no se almacena en el store; se obtiene fresco desde el SDK cuando se necesita.
 Ejemplo en [authStore.ts](./frontend/src/store/authStore.ts)

 ### Escucha del estado de autenticación
 
La sincronización entre Firebase y el store debe iniciarse una sola vez al montar la app en un hook dedicado `/src/hooks/useAuthListener.ts`.

Ejemplo en  [useAuthListener.ts](./frontend/src/hooks/useAuthListener.ts)
 
## Roles y autorización
 
JICA maneja tres roles de usuario. El rol es asignado por el backend como **Custom Claim** dentro del Firebase ID Token, después del registro.
 
| Rol | Valor en claim | Acceso principal |
|---|---|---|
| Inversionista | `investor` | Dashboard, exploración de pymes, simulación, registro de interés |
| Empresa (Pyme) | `business` | Panel de negocio, carga de métricas, publicación de oportunidades |
| Administrador | `admin` | Panel de administración, gestión de usuarios, aprobación de pymes |
 
### Lectura del rol desde el token
 
El rol viene en el Custom Claims del ID Token decodificado. El frontend lo lee así:
 Ejemplo [authService.ts](./frontend/src/services/authService.ts)

 El tipo de roles debe definirse en `/src/types/auth.types.ts`:
 Ejemplo [auth.types.ts](./frontend/src/types/auth.types.ts) 

 ### Rutas protegidas
 
Las rutas deben clasificarse en tres categorías en `/src/routes/`:
 
```
Rutas públicas (sin autenticación):
  /login
  /register
  /forgot-password
  / (landing)
 
Rutas privadas (cualquier rol autenticado):
  /dashboard
  /profile
 
Rutas por rol:
  investor:  /investments, /investments/:id, /simulate, /portfolio
  business:  /my-business, /financials, /publish-opportunity
  admin:     /admin/users, /admin/approvals, /admin/businesses
 
```

El componente `ProtectedRoute` debe ubicarse en `/src/routes/ProtectedRoute.tsx`:
Ejemplo [ProtectedRoute.tsx](./frontend/src/routes/ProtectedRoute.tsx) 

### Visibilidad de UI por rol
 
Los elementos de UI condicionados por rol deben usar el componente `RoleGuard` en `/src/components/auth/RoleGuard.tsx`. No se deben usar condicionales inline `if (user.role === 'investor')` dispersos en los componentes.
Ejemplo [ProtectedRoute.tsx](./frontend/src/components/auth/RoleGuard.tsx) 

## Interceptor HTTP
 
Todo cliente HTTP debe adjuntar el ID Token de Firebase en cada request al backend. El token debe obtenerse fresco desde el SDK (no desde el store) para garantizar que siempre esté vigente.
 
El interceptor se ubica en  `/src/services/httpClient.ts`:
Ejemplo [httpClient.ts](./frontend/src/services/httpClient.ts) 

## Manejo seguro de sesiones
 
### Persistencia de sesión
 
Firebase SDK persiste la sesión en `IndexedDB` del navegador de forma automática. No se debe configurar `browserSessionPersistence` salvo requerimiento explícito, ya que eliminaría la sesión al cerrar el tab.
 
La persistencia por defecto de Firebase (`LOCAL`) es la correcta para JICA, ya que el usuario espera seguir autenticado al regresar al sitio.
 
### Logout automático por inactividad
 
El frontend debe cerrar sesión automáticamente si el usuario lleva 30 minutos sin interacción. El hook debe ubicarse en `/src/hooks/useInactivityLogout.ts`.


```ts
// /src/hooks/useInactivityLogout.ts
const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutos
 
// Eventos a escuchar: mousemove, keydown, click, scroll, touchstart
// Al cumplir el tiempo: logoutUser() + clearSession() + redirect '/login'
// Al desmontar: limpiar todos los listeners y el timer
```
 
### Logout manual
 
```ts
// Flujo correcto de logout:
// 1. Llamar logoutUser() de authService (signOut de Firebase)
// 2. clearSession() en el store
// 3. redirect '/login'
```
 
### Verificación de email
 
Los usuarios recién registrados deben tener `emailVerified: false`. El frontend debe:
 
- Mostrar un banner de advertencia en el dashboard mientras `emailVerified` sea `false`.
- No bloquear el acceso por este motivo en el MVP, pero sí advertir visualmente.
- Ofrecer un botón para reenviar el email de verificación usando `sendEmailVerification`.
---

## Privacidad de datos y masking
 
Los datos sensibles no deben mostrarse completos en la UI. Las funciones de masking deben ubicarse en `/src/utils/maskData.ts`.
 
| Dato | Masking aplicado | Ejemplo visible |
|---|---|---|
| Número de cédula | Solo últimos 4 dígitos | `***-****-1234` |
| Número de cuenta bancaria | Solo últimos 4 dígitos | `**** **** **** 5678` |
| Email en listados admin | Dominio visible, local parcial | `ju***@gmail.com` |
| Monto de inversión de terceros | No visible para otros roles | — |
| Datos financieros internos de pyme | Solo visibles si están marcados como públicos | — |
 
 Ejemplo en  [maskData.ts](./frontend/src/utils/maskData.ts)  

 
### Reglas de visibilidad por rol
 
- `investor`: no puede ver datos financieros internos de una pyme que no estén marcados como públicos por el negocio.
- `business`: no puede ver la identidad ni montos de otros inversionistas interesados en su proyecto.
- `admin`: puede ver datos sin masking únicamente dentro de rutas `/admin/*`.
Esta regla se valida en el backend . El frontend la aplica para no renderizar lo que no corresponde mostrar.
 
---
 
## Cifrado y transmisión de datos
 
- Toda comunicación con el backend debe realizarse exclusivamente por **HTTPS**. No se permiten requests HTTP en `stage` ni `production`.
- `VITE_API_BASE_URL` debe comenzar con `https://` en ambientes distintos a `development`.
- No se deben transmitir tokens, contraseñas ni datos sensibles como query parameters en la URL.
- Los formularios con datos sensibles deben enviarse siempre por `POST` o `PUT`, nunca por `GET`.
### Variables de entorno
**development**
 
Se usa un archivo `.env.development` 
 
**stage y production**
 
 Las variables se configuran exclusivamente en **GitHub Actions Secrets** y se inyectan durante el `vite build` en el pipeline de CI/CD.
 
## Reglas generales de seguridad
 
- Nunca llamar al SDK de Firebase directamente desde componentes o páginas. Usar exclusivamente `authService.ts`.
- Nunca almacenar el ID Token en `localStorage`, `sessionStorage` ni Zustand. Siempre obtenerlo con `user.getIdToken()`.
- Nunca exponer el rol del usuario en la URL. El rol viene del store.
- Nunca renderizar rutas o componentes de un rol sin pasar por `ProtectedRoute` o `RoleGuard`.
- Nunca mostrar mensajes de error de Firebase directamente al usuario. Traducirlos a mensajes genéricos en UI.
- Nunca loguear ID Tokens, contraseñas ni datos financieros con `console.log` en `stage` o `production`.
- Los formularios de login y registro deben manejar los códigos de error de Firebase (`auth/user-not-found`, `auth/wrong-password`, `auth/email-already-in-use`) y mostrar mensajes claros sin revelar si el email existe o no en el sistema.

## 2.7 Estándares de seguridad OWASP aplicados al frontend

Esta sección define las prácticas de seguridad obligatorias del frontend de JICA basadas en el estándar **OWASP Top 10**. 

---

## A01 — Control de acceso roto

OWASP identifica la falta de restricciones en rutas y funcionalidades como la vulnerabilidad más crítica.

**Reglas obligatorias:**

- Toda ruta privada debe estar envuelta en `ProtectedRoute`. Ver implementación en `/src/routes/ProtectedRoute.tsx` [ProtectedRoute.tsx](./frontend/src/routes/ProtectedRoute.tsx)  . 
- Toda funcionalidad restringida por rol debe estar envuelta en `RoleGuard`. Ver implementación en `/src/components/auth/RoleGuard.tsx` [ProtectedRoute.tsx](./frontend/src/components/auth/RoleGuard.tsx) .
- Nunca ocultar rutas solo con CSS o condicionales de visibilidad. Si el usuario no tiene acceso, debe ser redirigido, no solo ocultado el elemento.
- El frontend no es la fuente de verdad del control de acceso. Toda acción crítica debe ser validada también por el backend.

---

## A02 — Fallas criptográficas

Exposición de datos sensibles por transmisión o almacenamiento inseguro.

**Reglas obligatorias:**

- Toda comunicación con el backend debe ser exclusivamente por **HTTPS**. No se permiten requests HTTP en `stage` ni `production`.
- El ID Token de Firebase nunca debe almacenarse en `localStorage` ni `sessionStorage`. Debe obtenerse siempre con `user.getIdToken()` desde el SDK.
- Las contraseñas nunca deben almacenarse, loguearse ni transmitirse fuera del formulario de autenticación.
- Los datos financieros sensibles (cuentas bancarias, cédulas) deben mostrarse con masking en la UI. Ver funciones en `/src/utils/maskData.ts` [maskData.ts](./frontend/src/utils/maskData.ts)   .

---

## A03 — Inyección (XSS)

Cross-Site Scripting ocurre cuando contenido malicioso es ejecutado en el navegador del usuario.

**Reglas obligatorias:**

- No usar `dangerouslySetInnerHTML` en ningún componente. Si existe un caso justificado, debe sanitizarse el contenido con la librería `dompurify` antes de renderizarlo.
- No construir HTML dinámico concatenando strings con datos del usuario o del backend.
- No usar `eval()`, `Function()` ni equivalentes en ninguna parte del frontend.
- Los datos provenientes del backend deben tratarse siempre como datos, nunca como markup o código ejecutable.
- React escapa el contenido por defecto al renderizar en JSX. No se debe saltar este mecanismo bajo ninguna circunstancia.

```ts
// Incorrecto
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// Correcto si es absolutamente necesario renderizar HTML externo
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

---

## A05 — Configuración de seguridad incorrecta

Configuraciones por defecto inseguras o información expuesta innecesariamente.

**Reglas obligatorias:**

- Las variables de entorno del frontend solo deben exponer lo estrictamente necesario para el cliente. 
- En `stage` y `production`, Vite debe compilar con `mode: 'production'` para eliminar código de desarrollo, logs y mensajes de error detallados.
- Los mensajes de error del backend nunca deben mostrarse directamente al usuario. Deben traducirse a mensajes genéricos en la UI.
- Sentry debe estar activo en `stage` y `production` para capturar errores sin exponerlos al usuario. Ver configuración en `/src/main.tsx`.
- No dejar `console.log` con datos sensibles (tokens, datos de usuario, respuestas de API) en código que llegue a `stage` o `production`. ESLint debe configurarse para advertir sobre `console.log` en producción.

---

## A06 — Componentes vulnerables y desactualizados

Uso de dependencias con vulnerabilidades conocidas.

**Reglas obligatorias:**

- Ejecutar `npm audit` como parte del pipeline de CI/CD. Un audit con vulnerabilidades críticas debe bloquear el deploy.
- Las dependencias deben mantenerse actualizadas. Revisar actualizaciones al menos una vez por sprint.
- No instalar librerías de terceros sin evaluar su mantenimiento activo y reputación en la comunidad.
- No usar librerías que no tengan soporte para TypeScript o que no hayan tenido actividad en el repositorio en más de 12 meses.

---

## A07 — Fallas de identificación y autenticación

Implementación incorrecta de autenticación que permite accesos no autorizados.

**Reglas obligatorias:**

- La autenticación se gestiona exclusivamente con **Firebase Authentication**. No se debe implementar autenticación custom. Ver implementación en `/src/services/authService.ts` [authService.ts](./frontend/src/services/authService.ts) .
- Los errores de Firebase Auth (`auth/user-not-found`, `auth/wrong-password`) no deben exponerse directamente. Deben mostrarse como un mensaje genérico: *"Credenciales incorrectas"*, sin revelar si el email existe o no en el sistema.
- El formulario de login debe tener un límite visual de intentos fallidos. Después de 5 intentos fallidos debe mostrarse un mensaje indicando que intente más tarde (Firebase maneja el bloqueo real en el backend).
- La sesión debe cerrarse automáticamente tras 30 minutos de inactividad. Ver implementación en `/src/hooks/useInactivityLogout.ts` [useInactivityLogout.ts](./frontend/src/hooks/useInactivityLogout.ts) ..
- Los usuarios con `emailVerified: false` deben ver un banner de advertencia. No se bloquea el acceso en el MVP pero sí se advierte visualmente.

---

## A09 — Fallas en el registro y monitoreo de seguridad

Ausencia de trazabilidad ante incidentes de seguridad.

**Reglas obligatorias:**

- **Sentry** debe estar configurado para capturar errores no manejados en `stage` y `production`.
- Los errores de autenticación de Firebase deben capturarse en Sentry sin incluir contraseñas ni tokens en el payload del error.
- No se deben registrar datos sensibles (tokens, contraseñas, datos financieros) en Sentry ni en ningún sistema de logging.
- Sentry debe inicializarse en `/src/main.tsx` antes de montar la aplicación.

```ts
// /src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: import.meta.env.MODE !== 'development',
  environment: import.meta.env.MODE,
});
```

---

## Reglas generales OWASP para el frontend

- No confiar en validaciones del lado del cliente como única barrera. Zod valida en el frontend para UX; el backend valida para seguridad.
- No almacenar información sensible en `localStorage`, `sessionStorage`, cookies accesibles desde JS ni en el estado global más allá de lo estrictamente necesario para la sesión activa.
- No construir URLs de API concatenando input del usuario directamente.
- Mantener el principio de mínimo privilegio: mostrar solo la información que el rol del usuario necesita ver.

## 2.8 Almacenamiento, comunicación y observabilidad
 
Esta sección define las reglas obligatorias para el manejo de almacenamiento en el navegador, comunicación asíncrona, Web Sockets, procesos largos, eventos, observabilidad, monitoreo, errores, estado, caché y reintentos en el frontend de JICA.
 
---
 
## Tecnologías incorporadas en esta sección
 
Las siguientes tecnologías se suman al stack definido en la sección 2.1:
 
| Categoría | Tecnología | Versión | Uso |
|---|---|---|---|
| Servidor de estado y caché | TanStack Query (React Query) | 5.x | Caché de datos del servidor, estados de loading/error, reintentos automáticos |
| Web Sockets | Socket.io client | 4.x | Notificaciones en tiempo real: inversión confirmada, proyecto financiado, aprobación de pyme |
| Monitoreo de errores | Sentry Frontend SDK | (ver sección 2.1) | Captura de errores no manejados en stage y production |
 

 
---
 
## Session Storage y Local Storage
 
### Regla general
 
El uso de `localStorage` y `sessionStorage` está **restringido** en JICA. La mayoría del estado vive en Zustand (estado de UI) o TanStack Query (estado del servidor). El almacenamiento en el navegador solo se permite para los casos explícitamente definidos a continuación.
 
### Casos permitidos
 
| Dato | Mecanismo | Justificación |
|---|---|---|
| Preferencia de tema (claro/oscuro) | `localStorage` | Persiste entre sesiones sin necesidad del backend |
| Filtros activos del dashboard | `sessionStorage` | Persiste durante la sesión activa, se limpia al cerrar el tab |
| Paso activo en flujo de simulación | `sessionStorage` | Recupera el progreso si el usuario recarga accidentalmente |
 
### Casos prohibidos
 
- ID Token de Firebase → obtener siempre con `user.getIdToken()`. Ver sección 2.6.
- Datos del usuario autenticado → viven en `authStore` (Zustand). Ver `/src/store/authStore.ts`.
- Datos financieros de pymes o inversiones → viven en caché de TanStack Query.
- Cualquier dato sensible: contraseñas, cuentas bancarias, cédulas, montos.
### Implementación
 
Las funciones de acceso a storage deben centralizarse en `/src/utils/storage.ts`. No se debe llamar a `localStorage` o `sessionStorage` directamente desde componentes. Ejemplo [storage.ts](./frontend/src/utils/storage.ts) 

Todas las keys de storage deben usar el prefijo `jica:` para evitar colisiones con otras aplicaciones en el mismo dominio.

## Comunicación asíncrona con el backend
 
### Cliente HTTP
 
Todas las llamadas HTTP al backend deben realizarse a través del cliente centralizado en `/src/services/httpClient.ts`Ejemplo [httpClient.ts](./frontend/src/services/httpClient.ts)  Ningún componente o página debe usar `fetch` o `axios` directamente.
 
### TanStack Query
 
TanStack Query es la capa de comunicación asíncrona con el servidor. Maneja automáticamente caché, estados de carga, errores y reintentos. Debe inicializarse en `/src/App.tsx`:


### Estructura de queries
 
Los queries de TanStack Query deben organizarse por feature dentro de `/src/features/{feature}/hooks/`. No se deben definir queries directamente en páginas o componentes. Ejemplo [useInvestments.ts](./frontend/src/features/investments/hooks/useInvestments.ts)

### Query keys
 
Todas las query keys deben definirse como constantes en el mismo archivo del hook usando el patrón de objetos mostrado arriba. Esto garantiza invalidación precisa del caché sin colisiones entre features.
 
---
 
## Web Sockets — Notificaciones en tiempo real
 
JICA utiliza **Socket.io** para notificaciones en tiempo real. El uso de Web Sockets está limitado exclusivamente a eventos de notificación; la carga de datos sigue siendo responsabilidad de TanStack Query.
 
### Eventos definidos
 
| Evento (servidor → cliente) | Descripción | Roles que lo reciben |
|---|---|---|
| `investment:confirmed` | Una inversión fue confirmada por el admin | `investor` |
| `project:funded` | Un proyecto alcanzó su meta de financiamiento | `investor`, `business` |
| `business:approved` | Una pyme fue aprobada por el admin | `business` |
| `business:rejected` | Una pyme fue rechazada por el admin | `business` |
 
### Inicialización del cliente Socket.io
 
La conexión debe gestionarse en `/src/services/socketService.ts`. La conexión solo debe iniciarse cuando el usuario está autenticado y debe cerrarse al hacer logout.Ejemplo [socketService.ts](./frontend/src/services/socketService.ts)

### Hook de notificaciones
 
Los componentes no deben suscribirse directamente a eventos del socket. Deben usar el hook centralizado `/src/hooks/useNotifications.ts` Ejemplo [useNotifications.ts](./frontend/src/hooks/useNotifications.ts) 

### Store de notificaciones
 
Las notificaciones recibidas deben almacenarse en `/src/store/notificationStore.ts`: Ejemplo [notificationStore.ts](./frontend/src/store/notificationStore.ts) 


## Manejo de procesos largos
 
Los siguientes procesos en JICA pueden tomar tiempo considerable y requieren feedback visual al usuario:
 
| Proceso | Duración estimada | Estrategia |
|---|---|---|
| Carga de documentos financieros de pyme | 2–10 segundos | Barra de progreso + estado `uploading` |
| Generación de reporte de simulación | 3–8 segundos | Skeleton loader + estado `generating` |
| Aprobación de pyme por admin | Asíncrono (minutos/horas) | Estado `pending` + notificación por Socket.io al resolverse |
 
### Reglas obligatorias
 
- Todo proceso largo debe mostrar un indicador visual de progreso. No se debe bloquear la UI con un spinner sin información.
- El usuario debe poder cancelar procesos largos cuando sea técnicamente posible.
- Si un proceso falla, debe mostrarse el error con una opción de reintento visible.
- Los procesos asíncronos que el backend resuelve en background (como aprobación de pyme) deben notificarse via Socket.io cuando se completen. El frontend no debe hacer polling para verificar el resultado.
### Implementación con TanStack Query mutations
Ejemplo [useUploadFinancialDocument.ts](./frontend/src/features/documents/hooks/useUploadFinancialDocument.ts) 
---
## Manejo de eventos del navegador
 
Los eventos del navegador (`resize`, `scroll`, `visibilitychange`, etc.) deben manejarse exclusivamente a través de custom hooks. No se deben agregar `addEventListener` directamente en componentes.
Ejemplo [useWindowSize.ts](./frontend/src/hooks/useWindowSize.ts) 
Todo `addEventListener` dentro de un `useEffect` debe tener su correspondiente `removeEventListener` en el cleanup para evitar memory leaks.
 
---

 
## Observabilidad y monitoreo
 
### Sentry
 
Sentry es el único sistema de monitoreo de errores del frontend. Debe inicializarse en `/src/main.tsx` antes de montar la aplicación. Solo debe estar activo en `stage` y `production`. Ejemplo [main.tsx](./frontend/src/main.tsx) 

 
### Qué debe capturar Sentry
 
- Errores JavaScript no manejados
- Errores en queries de TanStack Query (`onError` global)
- Errores de conexión con Socket.io
- Errores en carga de documentos o simulación
### Qué nunca debe enviarse a Sentry
 
- ID Tokens de Firebase
- Contraseñas
- Datos financieros del usuario
- Números de cuenta o cédula
### TanStack Query — monitoreo global de errores
 
Los errores globales de queries deben capturarse en el `QueryClient` y reportarse a Sentry:
 
## Manejo de errores
 
### Clasificación de errores
 
| Tipo | Origen | Manejo |
|---|---|---|
| Error de red | Request fallido sin respuesta del servidor | Mostrar mensaje genérico + opción de reintento |
| Error 400 | Validación fallida en el backend | Mostrar mensaje del campo específico en el formulario |
| Error 401 | Token expirado o revocado | Logout automático + redirect `/login`. Ver sección 2.6 |
| Error 403 | Acción no permitida para el rol | Mostrar mensaje "No tienes permiso para realizar esta acción" |
| Error 404 | Recurso no encontrado | Mostrar página o componente de estado vacío |
| Error 500 | Error interno del servidor | Mostrar mensaje genérico, capturar en Sentry |
 
### Error Boundary
 
Cada feature crítica debe estar envuelta en un `ErrorBoundary` de React para capturar errores de renderizado sin romper toda la aplicación. Usar el wrapper de Sentry:

### Mensajes de error al usuario
 
- Los errores nunca deben mostrar mensajes técnicos, stack traces ni códigos de error del servidor.
- Los mensajes deben ser claros, en español y orientados a la acción del usuario.
Ejemplo en [errorMessages.ts](./frontend/src/utils/errorMessages.ts) 


---
 
## Manejo de estado
 
### Separación de responsabilidades
 
El estado del frontend de JICA se divide en dos capas con responsabilidades distintas. No se deben mezclar:
 
| Capa | Herramienta | Qué maneja |
|---|---|---|
| Estado del servidor | TanStack Query | Datos del backend: inversiones, pymes, documentos, simulaciones |
| Estado global de UI | Zustand | Sesión del usuario, notificaciones, filtros activos, tema |
 
### Stores de Zustand
 
Cada store de Zustand debe tener una responsabilidad única. No se debe crear un store global que maneje todo.
 
| Store | Archivo | Responsabilidad |
|---|---|---|
| `authStore` | `/src/store/authStore.ts` | Sesión y usuario autenticado. Ver sección 2.6 |
| `notificationStore` | `/src/store/notificationStore.ts` | Notificaciones en tiempo real de Socket.io |
| `uiStore` | `/src/store/uiStore.ts` | Estado de UI global: tema, sidebar abierto/cerrado |
| `filterStore` | `/src/store/filterStore.ts` | Filtros activos en el dashboard de inversiones |
 
No se deben crear stores adicionales sin justificación documentada.
 
---
 
## Caché
 
El caché en JICA es gestionado exclusivamente por TanStack Query. No se debe implementar caché manual con variables, refs o `localStorage`.
 
### Configuración de staleTime por tipo de dato
 
El `staleTime` define cuánto tiempo los datos se consideran frescos antes de hacer un nuevo request. Debe configurarse por query según la frecuencia de cambio del dato:
 
| Dato | staleTime | Justificación |
|---|---|---|
| Lista de inversiones disponibles | 5 minutos | Cambia con frecuencia moderada |
| Detalle de una inversión | 10 minutos | Cambia poco una vez publicada |
| Perfil del inversionista | 15 minutos | Cambia raramente |
| Métricas financieras de pyme | 10 minutos | Se actualizan periódicamente |
| Simulación de inversión | 0 (sin caché) | Siempre debe ser fresca |
 
```ts
// Ejemplo de staleTime por query
useQuery({
  queryKey: investmentKeys.detail(id),
  queryFn: () => getInvestmentById(id),
  staleTime: 1000 * 60 * 10, // 10 minutos
});
```
 
### Invalidación de caché
 
El caché debe invalidarse después de mutaciones que modifiquen datos en el servidor:
 
```ts
// Después de confirmar una inversión, invalidar el detalle y la lista
queryClient.invalidateQueries({ queryKey: investmentKeys.detail(id) });
queryClient.invalidateQueries({ queryKey: investmentKeys.all });
```
 
---
 
## Reintentos
 
### Queries (lectura de datos)
 
TanStack Query reintenta automáticamente los queries fallidos con backoff exponencial. La configuración global está en `/src/App.tsx` . Los queries individuales pueden sobreescribir esta configuración.
 
```ts
// Query sin reintentos (datos que no deben reintentarse automáticamente)
useQuery({
  queryKey: ['simulation', params],
  queryFn: () => runSimulation(params),
  retry: 0,
});
```
 
### Mutaciones (escritura de datos)
 
Las mutaciones **no deben reintentarse automáticamente**. Un reintento automático en una operación de escritura (confirmar inversión, subir documento) puede causar duplicados o efectos no deseados. El usuario debe reintentar manualmente.
 
```ts
// Correcto: retry: 0 en mutaciones
useMutation({
  mutationFn: confirmInvestment,
  retry: 0,
  onError: (error) => {
    // Mostrar error al usuario con opción de reintento manual
  },
});
```
 
### Reintentos en Socket.io
 
El cliente de Socket.io debe intentar reconectarse automáticamente hasta 5 veces con un delay de 2 segundos entre intentos. Ver configuración en `/src/services/socketService.ts`. Si supera los 5 intentos, debe mostrarse un banner informando al usuario que las notificaciones en tiempo real no están disponibles, sin interrumpir el resto de la aplicación.

---
## 2.9 Estrategia de testing del frontend
 
Esta sección define las reglas obligatorias de testing para el frontend de JICA. Cubre pruebas unitarias, de integración de componentes y de UI end-to-end. El backend tiene su propia estrategia de testing; lo definido aquí es exclusivo del lado del cliente.
 

 
## Tecnologías de testing
 
| Categoría | Tecnología | Versión | Uso |
|---|---|---|---|
| Unit e integration testing | Vitest | 4.x | Pruebas de funciones utilitarias, hooks, servicios y componentes |
| Renderizado de componentes | React Testing Library | 16.x | Renderizar y consultar componentes en pruebas unitarias e integración |
| E2E / UI testing | Playwright | 1.x | Pruebas de flujos completos desde el navegador |
| Mocking de módulos | Vitest (`vi.mock`) | 4.x | Mock de servicios, Firebase, Socket.io y TanStack Query |
| Cobertura | Vitest (`@vitest/coverage-v8`) | 4.x | Reporte de cobertura de código |
 
---
 
## Estructura de archivos de prueba
 
Las pruebas unitarias y de integración de componentes se ubican en `/tests/unit/`, espejando la estructura de `/src/`. Las pruebas E2E se ubican en `/tests/e2e/`.
 Ejemplo de estructura de carpetas 
```txt
/tests
├── unit/
│   ├── utils/
│   │   ├── maskData.test.ts
│   │   ├── formatCurrency.test.ts
│   │   └── errorMessages.test.ts
│   ├── hooks/
│   │   ├── useInactivityLogout.test.ts
│   │   └── useAuthListener.test.ts
│   ├── services/
│   │   └── authService.test.ts
│   └── features/
│       ├── investments/
│       │   ├── components/
│       │   │   └── InvestmentCard.test.tsx
│       │   └── hooks/
│       │       └── useInvestments.test.ts
│       └── simulation/
│           └── hooks/
│               └── useSimulation.test.ts
└── e2e/
    ├── auth/
    │   ├── login.spec.ts
    │   └── register.spec.ts
    ├── investments/
    │   ├── explore.spec.ts
    │   └── detail.spec.ts
    └── simulation/
        └── simulate.spec.ts
```
 
---

## Unit Testing
 
Las pruebas unitarias validan funciones, hooks y servicios de forma aislada, sin dependencias externas reales. Todas las dependencias externas deben ser mockeadas.
 
### Qué debe tener pruebas unitarias obligatoriamente
 
| Categoría | Qué probar |
|---|---|
| `/src/utils/` | Todas las funciones utilitarias: `maskData`, `formatCurrency`, `formatDate`, `calculateReturn`, `errorMessages` |
| `/src/validations/` | Todos los esquemas Zod: casos válidos, casos inválidos y mensajes de error esperados |
| `/src/services/` | Funciones de `authService`, `investmentService`, `documentService` con HTTP mockeado |
| `/src/hooks/` | Custom hooks globales: `useInactivityLogout`, `useAuthListener`, `useNotifications` |
| `/src/features/*/hooks/` | Hooks de cada feature: `useInvestments`, `useInvestmentDetail`, `useSimulation`, `useUploadFinancialDocument` |
 
### Convenciones
 
- Los archivos de prueba deben nombrarse igual que el archivo que prueban con el sufijo `.test.ts` o `.test.tsx`.
- Cada `describe` debe corresponder a una función, hook o componente.
- Cada `it` debe describir un comportamiento específico en lenguaje claro.
```ts
// Correcto
describe('maskId', () => {
  it('debe ocultar todos los dígitos excepto los últimos 4', () => { ... });
  it('debe retornar string vacío si el input es vacío', () => { ... });
});
 
// Incorrecto
describe('tests', () => {
  it('funciona', () => { ... });
});
```
 
### Ejemplo — prueba unitaria de utilidad

[maskData.test.ts](./frontend/tests/unit/utils/maskData.test.ts) 

 
### Ejemplo — prueba unitaria de esquema Zod

[loginSchema.test.ts](./frontend/tests/unit/validations/loginSchema.test.ts) 


### Mocking de Firebase Auth
 
Las pruebas que involucren Firebase deben mockear el módulo completo. Nunca se debe conectar a Firebase real en pruebas.

[authService.test.ts](./frontend/tests/unit/services/authService.test.ts)

### Mocking del cliente HTTP
 
Las pruebas de servicios que llamen al backend deben mockear `httpClient`, no interceptar requests reales.
[useInvestments.test.ts](./frontend/tests/unit/features/investments/hooks/useInvestments.test.ts)


---
 
## Integration Testing (componentes)
 
Las pruebas de integración validan que los componentes rendericen correctamente y respondan a interacciones del usuario. Se usan con React Testing Library sobre Vitest.
 
### Qué debe tener pruebas de integración obligatoriamente
 
| Componente / Feature | Qué probar |
|---|---|
| `LoginForm` | Renderizado, validación de campos, submit con credenciales correctas e incorrectas |
| `RegisterForm` | Validación de todos los campos, submit exitoso, manejo de email ya registrado |
| `InvestmentCard` | Renderizado con datos reales, click en "Ver detalle", badge de riesgo según nivel |
| `RiskBadge` | Renderizado correcto para cada nivel: `low`, `medium`, `high` |
| `ProtectedRoute` | Redirect a `/login` si no autenticado, redirect a `/unauthorized` si rol incorrecto |
| `RoleGuard` | Muestra children si el rol coincide, muestra fallback si no coincide |
| `SimulationForm` | Cálculo de retorno estimado al cambiar el monto, validación de monto mínimo |
 
### Convenciones con React Testing Library
 
- Consultar elementos por `role`, `label` o `text` visible. Nunca por `className`, `id` o selectores CSS.
- No probar detalles de implementación interna (estado interno, nombres de variables).
- Probar lo que el usuario ve y hace, no cómo está implementado.
```tsx
// Correcto: consultar por rol y texto visible
const button = screen.getByRole('button', { name: /confirmar inversión/i });
 
// Incorrecto: consultar por className o test-id arbitrario
const button = document.querySelector('.btn-primary');
```

### Ejemplo — prueba de integración de componente

[InvestmentCard.test.ts](./frontend/tests/unit/features/investments/components/InvestmentCard.test.tsx)

### Ejemplo — prueba de integración de ProtectedRoute

[ProtectedRoute.test.ts](./frontend/tests/unit/routes/ProtectedRoute.test.tsx)

# UI Testing — End to End con Playwright
 
Las pruebas E2E validan flujos completos del usuario desde el navegador real. No mockean servicios ni el backend; se ejecutan contra el ambiente `stage`.
 
### Flujos obligatorios con cobertura E2E
 
| Flujo | Archivo | Pasos que debe cubrir |
|---|---|---|
| Login | `/tests/e2e/auth/login.spec.ts` | Login exitoso, credenciales incorrectas, redirect post-login por rol |
| Registro | `/tests/e2e/auth/register.spec.ts` | Registro exitoso, email ya registrado, validaciones de formulario |
| Exploración de inversiones | `/tests/e2e/investments/explore.spec.ts` | Ver listado, aplicar filtros, ver detalle de una inversión |
| Simulación de inversión | `/tests/e2e/simulation/simulate.spec.ts` | Ingresar monto, ver retorno estimado, confirmar simulación |
| Registro de interés | `/tests/e2e/investments/detail.spec.ts` | Ver detalle completo de pyme, registrar interés de inversión |
 
### Convenciones de Playwright
 
- Usar `page.getByRole()`, `page.getByLabel()` y `page.getByText()` como selectores principales.
- No usar selectores CSS ni XPath salvo casos donde no exista alternativa.
- Cada spec debe ser independiente: no debe depender del estado dejado por otra prueba.
- Usar `test.beforeEach` para login cuando el flujo requiere autenticación.
- Las credenciales de prueba deben venir de variables de entorno, nunca hardcodeadas.
```ts
// playwright.config.ts — variables de entorno para E2E
// PLAYWRIGHT_TEST_EMAIL
// PLAYWRIGHT_TEST_PASSWORD
// PLAYWRIGHT_BASE_URL
```
 
### Ejemplo — prueba E2E de login
[login.spec.ts](./frontend/tests/e2e/auth/login.spec.ts)

### Ejemplo — prueba E2E de simulación de inversión

[simulate.spec.ts](./frontend/tests/e2e/simulation/simulate.spec.ts)

## Cobertura mínima esperada
 
La cobertura se mide con `@vitest/coverage-v8` y se reporta en cada ejecución del pipeline de CI/CD. Un build con cobertura por debajo del mínimo definido debe **bloquear el merge**.
 
| Categoría | Cobertura mínima |
|---|---|
| `/src/utils/` | 90% |
| `/src/validations/` | 90% |
| `/src/services/` | 80% |
| `/src/hooks/` | 80% |
| `/src/features/*/hooks/` | 75% |
| `/src/features/*/components/` | 70% |
| `/src/routes/` | 80% |
| **Cobertura global del proyecto** | **75%** |

### Ejecución de pruebas
 
```bash
# Pruebas unitarias e integración
npm run test
 
# Pruebas con cobertura
npm run test:coverage
 
# Pruebas E2E contra ambiente stage
npm run test:e2e
 
# Pruebas E2E en modo UI (debug)
npm run test:e2e:ui
```
 
Estos scripts deben estar definidos en `package.json`. Los nombres de los scripts no deben cambiarse; el pipeline de CI/CD los llama por estos nombres exactos.
 
### Pipeline de CI/CD
 
El pipeline de GitHub Actions debe ejecutar en orden:
 
```
1. npm run test:coverage   → bloquea si cobertura < mínimo definido
2. npm run test:e2e        → bloquea si algún flujo crítico falla
3. vite build              → solo si los dos pasos anteriores pasan
```
 
Las pruebas E2E solo se ejecutan en el pipeline de `stage`. No se ejecutan en `production`; el deploy a production depende de que el pipeline de stage haya pasado completamente.


 ## 2.10 Consumo de APIs y contratos de datos

Esta sección define cómo el frontend de JICA debe comunicarse con el backend y cómo se deben manejar los contratos de datos entre ambas capas.

El objetivo es evitar llamadas dispersas, estructuras inconsistentes y errores al consumir información de autenticación, usuarios, inversiones, simulaciones, documentos o administración.

---

### Regla general

El frontend **no debe consumir APIs directamente desde páginas ni componentes visuales**.

Toda comunicación con el backend debe seguir este flujo:

```txt
Página / Componente
        ↓
Hook de feature
        ↓
Servicio de API
        ↓
Cliente HTTP centralizado
        ↓
Backend
```

Ejemplo de flujo esperado:

```txt
InvestmentDetailsPage.tsx
        ↓
useInvestmentDetail.ts
        ↓
investmentService.ts
        ↓
httpClient.ts
        ↓
GET /investments/:id
```

---

### Responsabilidad de cada capa

| Capa              | Ubicación                                                  | Responsabilidad                                                                  |
| ----------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Página            | `/src/pages` o `/src/features/{feature}/pages`             | Renderiza la pantalla y conecta los componentes principales.                     |
| Componente visual | `/src/components` o `/src/features/{feature}/components`   | Muestra información recibida por props. No consume APIs directamente.            |
| Hook de feature   | `/src/features/{feature}/hooks`                            | Usa TanStack Query para manejar loading, error, success, caché e invalidación.   |
| Servicio de API   | `/src/features/{feature}/services` o `/src/services`       | Define funciones específicas para llamar endpoints del backend.                  |
| Cliente HTTP      | `/src/services/httpClient.ts`                              | Centraliza base URL, headers, token Firebase, timeout y manejo común de errores. |
| Tipos             | `/src/types` o `/src/features/{feature}/types`             | Define contratos TypeScript para requests y responses.                           |
| Validaciones      | `/src/validations` o `/src/features/{feature}/validations` | Define esquemas Zod para formularios y respuestas críticas.                      |

---

### Cliente HTTP centralizado

Todas las llamadas HTTP deben realizarse desde el cliente centralizado.

Archivo requerido:

[httpClient.ts](./frontend/src/services/httpClient.ts)

Reglas obligatorias:

* No usar `fetch` directamente en componentes, páginas o hooks.
* No usar `axios` directamente fuera de `httpClient.ts`.
* Todas las requests deben usar `VITE_API_BASE_URL`.
* En `stage` y `production`, `VITE_API_BASE_URL` debe iniciar con `https://`.
* El ID Token de Firebase debe adjuntarse automáticamente en el header `Authorization`.
* El token debe obtenerse con `user.getIdToken()`, nunca desde `localStorage`, `sessionStorage` ni Zustand.
* Los errores HTTP deben normalizarse antes de llegar a la UI.
* El timeout recomendado para requests generales es de `15000 ms`.

---

### Servicios de API

Los servicios contienen las funciones que llaman endpoints específicos del backend.

Ubicación requerida para servicios por feature:

```txt
/src/features/{feature}/services
```

Ejemplos requeridos:

* [investmentService.ts](./frontend/src/features/investments/services/investmentService.ts)
* [simulationService.ts](./frontend/src/features/simulation/services/simulationService.ts)
* [documentService.ts](./frontend/src/features/documents/services/documentService.ts)

Reglas obligatorias:

* Cada servicio debe representar un dominio del sistema.
* Las funciones deben usar nombres claros como `getInvestments`, `getInvestmentById`, `confirmInvestment`, `runSimulation` o `uploadDocument`.
* Cada función debe retornar datos tipados.
* Los servicios no deben manejar renderizado, navegación ni mensajes visuales.
* Los servicios no deben modificar stores de Zustand.
* Los servicios no deben contener lógica de UI.

---

### Hooks para consumo de datos

Los componentes y páginas deben consumir datos mediante hooks de feature. Estos hooks deben usar TanStack Query.

Ubicación requerida:

```txt
/src/features/{feature}/hooks
```

Ejemplos requeridos:

* [useInvestments.ts](./frontend/src/features/investments/hooks/useInvestments.ts)
* [useConfirmInvestment.ts](./frontend/src/features/investments/hooks/useConfirmInvestment.ts)
* [useSimulation.ts](./frontend/src/features/simulation/hooks/useSimulation.ts)

Reglas obligatorias:

* No definir `useQuery` ni `useMutation` directamente dentro de páginas.
* No llamar servicios directamente desde componentes visuales.
* Cada hook debe tener una responsabilidad clara.
* Las query keys deben estar centralizadas y ser predecibles.
* Las mutaciones de escritura deben tener `retry: 0`.
* Después de una mutación exitosa, se debe invalidar el caché relacionado.

---

### Contratos de datos

Todo dato enviado o recibido del backend debe tener contrato TypeScript.

Ubicación requerida para contratos globales:

[api.types.ts](./frontend/src/types/api.types.ts)

Ubicación requerida para contratos por feature:

```txt
/src/features/{feature}/types
```

Ejemplos requeridos:

* [investment.types.ts](./frontend/src/features/investments/types/investment.types.ts)
* [auth.types.ts](./frontend/src/features/auth/types/auth.types.ts)
* [simulation.types.ts](./frontend/src/features/simulation/types/simulation.types.ts)

Reglas obligatorias:

* No usar `any` para respuestas del backend.
* No asumir campos que no estén definidos en el contrato.
* Todo dato financiero debe tener tipo explícito.
* Los nombres de propiedades deben coincidir con el contrato acordado con backend.
* Si el backend cambia un contrato, se debe actualizar primero el tipo correspondiente.
* No transformar datos directamente dentro de componentes visuales.

---

### Contrato estándar de respuesta

Cuando el backend retorne una respuesta envolvente, debe seguir esta estructura en el frontend:

Archivo requerido:

[api.types.ts](./frontend/src/types/api.types.ts)

```ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    page?: number;
    pageSize?: number;
    totalItems?: number;
    totalPages?: number;
  };
}
```

Para listados paginados, el campo `meta` debe utilizarse para renderizar los controles de paginación.

---

### Contrato estándar de error

Los errores del backend deben transformarse a una estructura estándar antes de llegar a la UI.

Archivo requerido:

[api.types.ts](./frontend/src/types/api.types.ts)

```ts
export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
}
```

Reglas obligatorias:

* Los componentes no deben interpretar directamente errores de Axios o del backend.
* Los errores técnicos no deben mostrarse al usuario final.
* Los mensajes visibles deben estar en español.
* Los errores `401` deben cerrar sesión y redirigir a `/login`.
* Los errores `403` deben mostrar un mensaje de permisos insuficientes.
* Los errores `500` deben mostrar un mensaje genérico y reportarse a Sentry.
* Los errores de validación `400` deben mapearse a campos del formulario.

Mensajes visibles requeridos:

[errorMessages.ts](./frontend/src/utils/errorMessages.ts)

---

### Validación de contratos con Zod

TypeScript valida durante desarrollo, pero no protege contra respuestas incorrectas en tiempo de ejecución. Por eso, las respuestas críticas del backend deben validarse con Zod.

Ubicación requerida:

```txt
/src/features/{feature}/validations
```

Ejemplos requeridos:

* [investmentSchema.ts](./frontend/src/features/investments/validations/investmentSchema.ts)
* [loginSchema.ts](./frontend/src/features/auth/validations/loginSchema.ts)
* [simulationSchema.ts](./frontend/src/features/simulation/validations/simulationSchema.ts)

Deben validarse con Zod:

* Formularios de login y registro.
* Formularios de simulación de inversión.
* Datos financieros recibidos del backend.
* Perfil del usuario autenticado.
* Roles y permisos.
* Inversiones y detalle de inversión.
* Parámetros enviados en mutaciones críticas.

---

### Parámetros de consulta

Los filtros, búsquedas y paginación deben enviarse como query parameters usando el objeto `params` del cliente HTTP.

Correcto:

```ts
httpClient.get("/investments", {
  params: {
    riskLevel: "medium",
    page: 1,
    pageSize: 10,
  },
});
```

Incorrecto:

```ts
httpClient.get("/investments?riskLevel=" + riskLevel + "&page=" + page);
```

Reglas obligatorias:

* No construir URLs concatenando input del usuario.
* No enviar datos sensibles como query parameters.
* Los filtros deben estar tipados.
* La paginación debe usar `page` y `pageSize`.
* Las búsquedas deben usar `search`.

---

### Mutations y operaciones de escritura

Las operaciones que modifican datos deben implementarse con `useMutation`.

Ejemplos de operaciones de escritura:

* Registro de usuario.
* Confirmación de inversión.
* Registro de interés.
* Actualización de perfil.
* Carga de documentos.
* Simulación de inversión cuando queda registrada en backend.

Reglas obligatorias:

* Las mutations no deben tener reintentos automáticos.
* Toda mutation debe mostrar estado de carga.
* Toda mutation debe manejar error visible.
* Toda mutation exitosa debe invalidar queries relacionadas.
* Las mutations críticas deben mostrar confirmación visual al usuario.
* No se deben ejecutar mutations automáticamente al renderizar un componente.

Ejemplo requerido:

[useConfirmInvestment.ts](./frontend/src/features/investments/hooks/useConfirmInvestment.ts)

---

### Estados obligatorios en pantallas con APIs

Toda pantalla que consuma APIs debe manejar explícitamente estos estados:

```txt
loading
success
empty
error
```

Reglas obligatorias:

* `loading`: mostrar skeleton o indicador visual claro.
* `success`: mostrar los datos.
* `empty`: mostrar mensaje cuando no existan resultados.
* `error`: mostrar mensaje claro y botón de reintento.
* No dejar pantallas en blanco mientras se cargan datos.
* No mostrar errores técnicos al usuario.

Componentes reutilizables recomendados:

```txt
/src/components/ui/LoadingState
/src/components/ui/EmptyState
/src/components/ui/ErrorState
```

---

### Endpoints esperados para el MVP

Los siguientes endpoints son los mínimos esperados para el frontend del MVP. Los nombres finales deben coincidir con el contrato definido por backend.

| Feature     | Método  | Endpoint                        | Uso                                           |
| ----------- | ------- | ------------------------------- | --------------------------------------------- |
| Auth        | `POST`  | `/auth/register`                | Registrar usuario y asignar rol inicial.      |
| Auth        | `GET`   | `/auth/me`                      | Obtener perfil del usuario autenticado.       |
| Investments | `GET`   | `/investments`                  | Listar oportunidades de inversión.            |
| Investments | `GET`   | `/investments/:id`              | Obtener detalle de una oportunidad.           |
| Investments | `POST`  | `/investments/:id/interest`     | Registrar interés del inversionista.          |
| Simulation  | `POST`  | `/simulations`                  | Calcular o registrar simulación de inversión. |
| Business    | `GET`   | `/businesses/:id`               | Obtener información pública de una pyme.      |
| Documents   | `POST`  | `/documents/upload`             | Cargar documentos financieros de una pyme.    |
| Admin       | `PATCH` | `/admin/businesses/:id/approve` | Aprobar pyme.                                 |
| Admin       | `PATCH` | `/admin/businesses/:id/reject`  | Rechazar pyme.                                |

---

### Versionado de contratos

Los contratos entre frontend y backend deben mantenerse estables durante cada entrega. Si se requiere cambiar un contrato, se debe actualizar en este orden:

```txt
1. Actualizar contrato documentado del endpoint.
2. Actualizar tipos TypeScript.
3. Actualizar esquemas Zod.
4. Actualizar servicio de API.
5. Actualizar hooks afectados.
6. Actualizar componentes afectados.
7. Actualizar pruebas unitarias, integración o E2E afectadas.
```

Reglas obligatorias:

* No cambiar nombres de campos sin actualizar tipos y validaciones.
* No eliminar campos usados por la UI sin ajustar los componentes.
* No agregar lógica temporal en componentes para compensar respuestas inconsistentes.
* Todo cambio de contrato debe reflejarse en pruebas.

---

### Prohibiciones

No se permite:

* Consumir APIs directamente desde componentes.
* Usar `fetch` directamente fuera de `httpClient.ts`.
* Usar `axios` directamente fuera de `httpClient.ts`.
* Usar `any` para respuestas del backend.
* Guardar respuestas completas con datos sensibles en `localStorage`.
* Mostrar errores técnicos del backend al usuario.
* Concatenar parámetros manualmente en URLs.
* Reintentar automáticamente operaciones de escritura.
* Duplicar lógica de consumo de APIs entre features.
* Usar datos mockeados en producción.
* Ignorar estados de carga, error o vacío.

---

### Checklist para implementar un nuevo endpoint

Antes de consumir un nuevo endpoint desde el frontend, se debe completar esta lista:

```txt
[ ] Definir el contrato TypeScript de request y response.
[ ] Definir esquema Zod si el dato es crítico o viene de formularios.
[ ] Crear o actualizar el servicio de API correspondiente.
[ ] Consumir el servicio desde un hook de feature con TanStack Query.
[ ] Definir query key si es una operación de lectura.
[ ] Definir invalidación de caché si es una mutation.
[ ] Manejar loading, success, empty y error states en la UI.
[ ] Agregar pruebas unitarias o de integración según corresponda.
[ ] Verificar que no se expongan datos sensibles.
[ ] Enlazar el archivo implementado en esta documentación si aplica.
```

