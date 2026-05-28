# JICA

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

## Paleta de colores

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

## Tipografías

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

## Logos

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


