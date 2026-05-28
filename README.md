# JICA

## 2.1 Stack de tecnologías del frontend

El frontend de JICA será desarrollado como una aplicación web de tipo **Client Side Rendering**, orientada a inversionistas que necesitan explorar oportunidades de inversión, revisar información financiera de pymes gastronómicas y simular inversiones dentro de una interfaz clara, moderna y segura.

El stack seleccionado busca mantener una arquitectura frontend escalable, mantenible y fácil de trabajar para el equipo de desarrollo. Cada tecnología tiene una responsabilidad definida para evitar improvisaciones durante la implementación.

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
