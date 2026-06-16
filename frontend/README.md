# JICA Frontend MVP

Frontend local para el flujo principal del inversionista dentro del MVP académico de JICA.

## Flujo implementado

```txt
Registro de inversionista
  ↓
Dashboard de oportunidades
  ↓
Detalle financiero de oportunidad
  ↓
Simulación de inversión
  ↓
Confirmación de inversión
```

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Zustand
- TanStack Query
- Axios
- Zod
- lucide-react

## Variables de entorno

Copie el archivo de ejemplo:

```bash
cp .env.example .env
```

Valor esperado para desarrollo local:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Ejecutar localmente

Primero levante el backend:

```bash
cd ../backend
npm install
npm run start
```

Luego levante el frontend:

```bash
cd ../frontend
npm install
npm run dev
```

Abra:

```txt
http://localhost:5173
```

## Credenciales demo

```txt
Correo: demo@jica.local
Contraseña: Demo12345
```

También puede usar la pantalla de registro. El backend del MVP guarda datos en memoria, por lo que al reiniciar el servidor se restauran los datos demo.

## Validaciones ejecutadas

```bash
npm run type-check
npm run lint
npm run build
npm test
```
