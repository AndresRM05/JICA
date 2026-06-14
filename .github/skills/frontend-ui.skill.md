# frontend-ui.skill.md
 
## Restricción principal del MVP
 
Este skill debe generar únicamente código para el MVP académico local de JICA.
 
No debe proponer, exigir ni generar código que dependa de:
- Azure o cualquier servicio cloud
- Azure Static Web Apps
- Sentry
- Servicios de pago o infraestructura de producción
El stack permitido para UI es:
```
React + Vite + TypeScript + Tailwind CSS + lucide-react
```
 
Si el README menciona tecnologías de producción, deben considerarse fuera del alcance del MVP, salvo que el usuario lo solicite explícitamente.
 
---
 
## Propósito
 
Este skill define las reglas obligatorias para generar y revisar componentes React en el proyecto JICA. Copilot debe aplicar estas reglas automáticamente al generar cualquier componente visual, sin excepción.
 
---
 
## Componentes React
 
### Estructura obligatoria de un componente
 
Cada componente debe separarse en tres archivos dentro de su propia carpeta:
 
```
/ComponentName
├── ComponentName.tsx        ← lógica visual y renderizado
├── ComponentName.types.ts   ← interfaces y tipos TypeScript
└── index.ts                 ← exportaciones centralizadas
```
 
### Reglas
 
- Cada componente tiene una única responsabilidad visual o funcional.
- Las props siempre deben estar tipadas con TypeScript en el archivo `.types.ts`.
- La lógica de negocio, llamadas a API y validaciones complejas no van dentro del JSX.
- Los componentes compartidos van en `/src/components/ui`.
- Los componentes específicos de una funcionalidad van en `/src/features/{feature}/components`.
### Nomenclatura
 
- Archivos de componentes: **PascalCase** → `InvestmentCard.tsx`
- Páginas: **PascalCase** con sufijo `Page` → `DashboardPage.tsx`
- Layouts: **PascalCase** con sufijo `Layout` → `DashboardLayout.tsx`
- Props interfaces: **PascalCase** con sufijo `Props` → `InvestmentCardProps`
### Nombres prohibidos
 
No usar nombres genéricos:
```
Component.tsx / Card.tsx / View.tsx / Page.tsx
data / info / item / thing / temp / aux
```
 
### Tipos de componentes y su ubicación
 
| Tipo | Ubicación | Ejemplos |
|---|---|---|
| UI genéricos | `/src/components/ui` | Button, Input, Card, Badge, Modal |
| Layout | `/src/layouts` | DashboardLayout, AuthLayout |
| Negocio | `/src/features` | InvestmentCard, RiskBadge, ROIChart |
| Páginas | `/src/pages` | DashboardPage, LoginPage, SimulationPage |
 
### Ejemplos reales en el proyecto
 
> Estos archivos existen como estructura base y patrón de referencia. No representan la implementación final del MVP. Copilot debe usarlos únicamente para entender la estructura y nomenclatura del proyecto, no para copiar su contenido.
 
Componente UI genérico:
- `frontend/src/components/ui/Button/Button.tsx`
- `frontend/src/components/ui/Button/Button.types.ts`
- `frontend/src/components/ui/Button/index.ts`
Componente de negocio:
- `frontend/src/features/investments/components/InvestmentCard/InvestmentCard.tsx`
- `frontend/src/features/investments/components/InvestmentCard/InvestmentCard.types.ts`
---
 
## Tailwind CSS
 
### Orden de clases obligatorio
 
1. Layout y display
2. Espaciado
3. Tamaño
4. Bordes
5. Colores
6. Tipografía
7. Estados e interacciones
### Estilos reutilizables obligatorios
 
**Botón primario:**
```tsx
className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
```
 
**Botón secundario:**
```tsx
className="inline-flex items-center justify-center rounded-xl border border-emerald-700 px-5 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-100"
```
 
**Tarjeta:**
```tsx
className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
```
 
**Input:**
```tsx
className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
```
 
**Mensaje de error:**
```tsx
className="text-sm font-medium text-red-600"
```
 
**Etiqueta visual:**
```tsx
className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
```
 
### Reglas
 
- No usar estilos inline salvo casos excepcionales justificados.
- No crear clases CSS personalizadas si Tailwind ya tiene una utilidad equivalente.
- Las clases personalizadas usan **kebab-case**: `.investment-card-highlight`
- Solo crear clases personalizadas cuando el patrón se repite muchas veces o la combinación es demasiado extensa.
- Todos los elementos interactivos deben tener estados `hover`, `focus` y `disabled`.
### Etiquetas de estado
 
```tsx
Disponible:   className="bg-green-100 text-green-700"
En revisión:  className="bg-yellow-100 text-yellow-700"
Financiado:   className="bg-blue-100 text-blue-700"
Confirmado:   className="bg-green-100 text-green-700"
Pendiente:    className="bg-orange-100 text-orange-700"
Rechazado:    className="bg-red-100 text-red-700"
Cancelado:    className="bg-slate-100 text-slate-600"
```
 
### Etiquetas de riesgo
 
```tsx
Riesgo bajo:  className="bg-green-100 text-green-700"
Riesgo medio: className="bg-yellow-100 text-yellow-700"
Riesgo alto:  className="bg-red-100 text-red-700"
```
 
El nivel de riesgo nunca debe representarse solo con color. Siempre debe incluir texto.
 
---
 
## Responsive Design
 
### Enfoque mobile-first obligatorio
 
Primero se construye para pantallas pequeñas y luego se adapta progresivamente.
 
### Breakpoints
 
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```
 
### Reglas
 
- Mobile: contenido en una sola columna.
- Tablet: dos columnas cuando el contenido lo permita.
- Desktop: grids de tres o más columnas.
- Formularios ocupan el ancho disponible en mobile.
- Navegación principal se adapta a menú colapsable en pantallas pequeñas.
- Tablas grandes se convierten en tarjetas o permiten scroll horizontal en mobile.
---
 
## Branding JICA
 
### Paleta de colores obligatoria
 
```ts
primary:        "#064E3B"  // Verde oscuro JICA — encabezados, navegación
secondary:      "#047857"  // Verde principal — botones, acciones importantes
accent:         "#22C55E"  // Verde financiero positivo — rentabilidad, confirmaciones
background:     "#F8FAFC"  // Fondo general de pantallas
surface:        "#FFFFFF"  // Tarjetas, formularios, modales
textPrimary:    "#0F172A"  // Texto principal
textSecondary:  "#64748B"  // Texto secundario
border:         "#E2E8F0"  // Bordes suaves
error:          "#DC2626"  // Errores y validaciones fallidas
warning:        "#F59E0B"  // Riesgo medio, advertencias
success:        "#16A34A"  // Confirmaciones exitosas
info:           "#2563EB"  // Información secundaria
```
 
No usar colores arbitrarios si ya existe un color definido en la paleta.
 
### Tipografía
 
```css
font-family: Inter, system-ui, sans-serif;
```
 
### Jerarquía tipográfica
 
```
Título principal:  text-3xl font-bold
Título de sección: text-2xl font-semibold
Subtítulo:         text-xl font-semibold
Texto base:        text-base font-normal
Texto secundario:  text-sm text-slate-500
Texto auxiliar:    text-xs text-slate-400
```
 
### Iconografía
 
- Librería obligatoria: `lucide-react`
- Tamaño estándar: `20px` o `24px`
- Los iconos no reemplazan texto importante.
- Acciones críticas llevan icono + etiqueta textual.
- No mezclar librerías de iconos distintas.
### Espaciados
 
```
xs:  p-1   (0.25rem)
sm:  p-2   (0.5rem)
md:  p-4   (1rem)
lg:  p-6   (1.5rem)
xl:  p-8   (2rem)
2xl: p-12  (3rem)
```
 
- Tarjetas usan `p-4` o `p-6`.
- Secciones principales usan `py-8` o `py-12`.
- Elementos internos se separan con `gap-4` o `gap-6`.
### Logo
 
- Aparece en login, registro y layout principal.
- No deformar, recortar ni cambiar proporciones.
- Versión horizontal en desktop.
- Versión compacta en mobile o sidebar reducido.
- Siempre incluir atributo `alt`.
---
 
## Accesibilidad
 
- Todo elemento `<img>` de contenido debe tener `alt` descriptivo. Solo puede estar vacío en imágenes decorativas.
- Los textos deben tener contraste suficiente con el fondo.
- Los elementos interactivos deben ser accesibles por teclado.
- El nivel de riesgo y estado de inversión nunca dependen únicamente del color — siempre acompañar con texto.
- Los iconos en acciones críticas siempre llevan etiqueta textual visible.
 