# Backend JICA - MVP

Backend NestJS para el MVP de JICA, una plataforma fintech enfocada en mostrar oportunidades de inversión para pymes gastronómicas.

Para facilitar la presentación, esta versión funciona con datos en memoria y no requiere PostgreSQL, Prisma ni configuración de Microsoft Entra ID. El objetivo es que el flujo principal del inversionista pueda ejecutarse rápido:

```txt
Dashboard de oportunidades
        ↓
Detalle financiero de una oportunidad
        ↓
Simulación de inversión
        ↓
Confirmación de intención de inversión
```

## Requisitos

- Node.js 20 o superior.
- npm.

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run start:dev
```

El backend queda disponible por defecto en:

```txt
http://localhost:3000/api/v1
```

## Ejecutar en modo producción local

```bash
npm run build
npm run start:prod
```

## Variables de entorno opcionales

Puedes copiar `.env.example` a `.env` si quieres cambiar el puerto o los orígenes permitidos por CORS.

```env
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Usuario demo

Para que el MVP funcione sin login externo, los guards asignan automáticamente un inversionista demo cuando no llega un usuario autenticado.

```txt
email: demo@jica.local
password: Demo12345
role: investor
```

También puedes registrar usuarios nuevos con `/auth/register` y probar login local con `/auth/login`.

## Endpoints principales

### Health/root

```bash
curl http://localhost:3000/api/v1
```

### Listar oportunidades

```bash
curl http://localhost:3000/api/v1/opportunities
```

### Ver detalle financiero

```bash
curl http://localhost:3000/api/v1/opportunities/00000000-0000-4000-8000-000000000001/financial-detail
```

### Crear simulación

```bash
curl -X POST http://localhost:3000/api/v1/opportunities/00000000-0000-4000-8000-000000000001/simulations \
  -H "Content-Type: application/json" \
  -d '{"investmentAmount":3000}'
```

### Confirmar simulación

Usa el `simulationId` devuelto por el endpoint anterior.

```bash
curl -X POST http://localhost:3000/api/v1/simulations/<simulationId>/confirm
```

### Registrar interés en una oportunidad

```bash
curl -X POST http://localhost:3000/api/v1/investments/00000000-0000-4000-8000-000000000001/interest
```

## Validación

```bash
npm run build
npm test -- --runInBand
```

Resultado validado:

```txt
Test Suites: 17 passed, 17 total
Tests:       50 passed, 50 total
```

## Cambios principales realizados para estabilizar el MVP

- Se reemplazó la dependencia obligatoria de Prisma/PostgreSQL por un `PrismaService` en memoria compatible con los repositorios existentes.
- Se agregaron datos demo de oportunidades, métricas financieras, inversionista, simulaciones e intenciones.
- Se corrigieron dependencias faltantes (`helmet`, `compression`, tipos de compression).
- Se agregaron DTOs faltantes para inversiones.
- Se creó `InvestmentsModule` y se registró en `AppModule`.
- Se ajustaron los guards para permitir demo local sin Microsoft Entra ID.
- Se corrigieron imports y archivos incompletos que impedían compilar.
- Se excluyó `prisma/` del build porque el seed ya no forma parte del runtime del MVP.
