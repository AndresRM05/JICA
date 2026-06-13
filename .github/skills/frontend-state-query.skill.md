# frontend-state-query.skill.md

## Propósito

Este skill define las reglas obligatorias para manejo de estado y datos del servidor en el proyecto JICA. Copilot debe aplicar estas reglas al generar cualquier código relacionado con Zustand, TanStack Query, caché y query keys.

---

## Separación de responsabilidades de estado

El estado del frontend de JICA se divide en dos capas con responsabilidades distintas. No mezclarlas bajo ninguna circunstancia.

| Capa | Herramienta | Qué maneja |
|---|---|---|
| Estado del servidor | TanStack Query | Datos del backend: inversiones, pymes, documentos, simulaciones |
| Estado global de UI | Zustand | Sesión del usuario, notificaciones, filtros activos, tema |

---

## Zustand

### Stores definidos

| Store | Archivo | Responsabilidad |
|---|---|---|
| `authStore` | `frontend/src/store/authStore.ts` | Sesión y usuario autenticado |
| `notificationStore` | `frontend/src/store/notificationStore.ts` | Notificaciones en tiempo real de Socket.io |
| `uiStore` | `frontend/src/store/uiStore.ts` | Tema, sidebar abierto/cerrado |
| `filterStore` | `frontend/src/store/filterStore.ts` | Filtros activos en el dashboard de inversiones |

### Reglas

- Cada store tiene una responsabilidad única. No crear un store global que maneje todo.
- No almacenar datos del servidor en Zustand. Esos van en TanStack Query.
- No almacenar el Access Token de MSAL en Zustand. Obtenerlo siempre con `acquireTokenSilent()`.
- No crear stores adicionales sin justificación documentada.
- El estado de UI global va en Zustand. El estado local de un componente va en `useState`.

### Estructura obligatoria de un store

```ts
// Ejemplo de referencia — authStore
interface AuthState {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthenticatedUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  clearSession: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}));
```

---

## TanStack Query

### Configuración global

TanStack Query debe estar  configurado globalmente en `frontend/src/App.tsx`.  un ejemplo es el siguiente

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // 5 minutos
      gcTime: 1000 * 60 * 10,          // 10 minutos
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0, // las mutaciones nunca se reintentan automáticamente
    },
  },
});
```

### Query Keys

Las query keys son constantes definidas en el mismo archivo del hook. Nunca escribir query keys como strings sueltos en los componentes.

```ts
// Patrón obligatorio de query keys
export const investmentKeys = {
  all: ['investments'] as const,
  list: (filters: InvestmentFilters) => ['investments', 'list', filters] as const,
  detail: (id: string) => ['investments', 'detail', id] as const,
};
```

### Ubicación de queries y mutations

Los hooks de TanStack Query deben organizarse por feature dentro de `frontend/src/features/{feature}/hooks/`. No definir queries directamente en páginas o componentes.

```ts
// frontend/src/features/investments/hooks/useInvestments.ts
export function useInvestments(filters: InvestmentFilters) {
  return useQuery({
    queryKey: investmentKeys.list(filters),
    queryFn: () => getAvailableInvestments(filters),
  });
}

export function useInvestmentDetail(id: string) {
  return useQuery({
    queryKey: investmentKeys.detail(id),
    queryFn: () => getInvestmentById(id),
    enabled: !!id,
  });
}
```

### Mutations

Las mutaciones nunca deben reintentarse automáticamente (`retry: 0`). Después de una mutación exitosa, invalidar el caché correspondiente.

```ts
export function useConfirmInvestment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmInvestment,
    retry: 0,
    onSuccess: (_, { investmentId }) => {
      queryClient.invalidateQueries({ queryKey: investmentKeys.detail(investmentId) });
      queryClient.invalidateQueries({ queryKey: investmentKeys.all });
    },
    onError: (error) => {
      // Mostrar error al usuario con opción de reintento manual
    },
  });
}
```

### Procesos largos con mutations

Los procesos largos como carga de documentos deben usar `isPending` para mostrar feedback visual. El usuario debe poder reintentar manualmente si falla.

```ts
const { mutate, isPending, isError } = useUploadFinancialDocument();
// isPending → mostrar barra de progreso
// isError   → mostrar mensaje de error con botón de reintento manual
```

---

## Caché

### staleTime por tipo de dato

| Dato | staleTime | Justificación |
|---|---|---|
| Lista de inversiones disponibles | 5 minutos | Cambia con frecuencia moderada |
| Detalle de una inversión | 10 minutos | Cambia poco una vez publicada |
| Perfil del inversionista | 15 minutos | Cambia raramente |
| Métricas financieras de pyme | 10 minutos | Se actualizan periódicamente |
| Simulación de inversión | 0 (sin caché) | Siempre debe ser fresca |

```ts
// Ejemplo de staleTime específico por query
useQuery({
  queryKey: investmentKeys.detail(id),
  queryFn: () => getInvestmentById(id),
  staleTime: 1000 * 60 * 10, // 10 minutos
});

// Simulación sin caché
useQuery({
  queryKey: ['simulation', params],
  queryFn: () => runSimulation(params),
  staleTime: 0,
  retry: 0,
});
```

### Invalidación de caché

El caché debe invalidarse después de mutaciones que modifiquen datos en el servidor:

```ts
// Después de confirmar inversión
queryClient.invalidateQueries({ queryKey: investmentKeys.detail(id) });
queryClient.invalidateQueries({ queryKey: investmentKeys.all });
```

### Lo que nunca debe cachearse con TanStack Query

- Datos del usuario autenticado → van en `authStore` (Zustand)
- Access Token de MSAL → obtener siempre con `acquireTokenSilent()`
- Estado de UI (sidebar, tema, filtros) → van en stores de Zustand

---

## Manejo de estado de loading y error

- Usar `isPending` de TanStack Query para estados de carga de datos del servidor. No duplicar ese estado con `useState` local.
- Usar skeleton loaders para contenido con estructura conocida (tarjetas, tablas, perfiles).
- Usar spinner solo para acciones puntuales sin estructura predefinida.
- Los errores de queries se capturan globalmente en el `QueryClient`. Ver configuración en `frontend/src/App.tsx`.

---

## Ejemplos reales en el proyecto

> Estos archivos existen como estructura base y patrón de referencia. No representan la implementación final del MVP. Copilot debe usarlos únicamente para entender la estructura y nomenclatura del proyecto, no para copiar su contenido.

- `frontend/src/store/authStore.ts`
- `frontend/src/store/notificationStore.ts`
