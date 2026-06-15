# Revisión de Arquitectura - Bloque de Simulación de Inversión

## Fecha: 2026-06-14
## Status: REVISIÓN EN PROGRESO

---

## VALIDACIONES REALIZADAS

### ✅ 1. Estructura del Endpoint
- **Endpoint**: `POST /opportunities/:opportunityId/simulations`
- **Parámetro**: `opportunityId` extraído correctamente via `@Param()`
- **Body**: `investmentAmount` recibido via `CreateSimulationDto`
- **Status**: ✅ CORRECTO

### ✅ 2. Autenticación y Autorización
- **Guard**: `InvestorGuard` aplicado a nivel de controller
- **Extracción de investorId**: `request.user.investorId`
- **Validación de rol**: Implementada en `InvestorGuard`
- **Status**: ✅ CORRECTO

### ✅ 3. Validación de DTO
- **Validador `@IsNumber()`**: Verifica tipo numérico
- **Validador `@IsPositive()`**: Valida investmentAmount > 0
- **maxDecimalPlaces**: Límita a 2 decimales
- **Status**: ✅ CORRECTO

### ✅ 4. Validaciones de Negocio (Service Layer)
- **Oportunidad existe**: `findById()` + NotFoundException
- **Status es available**: Validación `opportunity.status !== 'available'` → BadRequestException
- **Monto >= minAmount**: Validación `investmentAmount < opportunity.minAmount` → BadRequestException
- **Status**: ✅ CORRECTO

### ⚠️ 5. Cálculos de Simulación - INCONSISTENCIA ENCONTRADA

**Especificación del usuario:**
```
Regla de cálculo sugerida:
- estimatedProfit = investmentAmount * estimatedReturn / 100
- estimatedReturn = investmentAmount + estimatedProfit
- roiUsed = estimatedReturn de la oportunidad
```

**Implementación actual:**
- `estimatedProfit = investmentAmount * estimatedReturn / 100` ✅ CORRECTO
- `estimatedReturn` en respuesta = porcentaje (15) ❌ INCORRECTO
- `roiUsed` en respuesta = porcentaje (15) ✅ CORRECTO

**Problema identificado:**
El campo `estimatedReturn` devuelto en la respuesta tiene el valor del porcentaje (15), 
cuando debería ser `investmentAmount + estimatedProfit` = 5000 + 750 = 5750.

**Ejemplo:**
- investmentAmount: 5000
- estimatedReturn (oportunidad %): 15
- estimatedProfit (cálculo correcto): 750
- Respuesta actual: `estimatedReturn: 15` ❌ DEBERÍA SER: 5750
- roiUsed (correcto): 15 ✅

**Status**: ⚠️ REQUIERE CORRECCIÓN

### ✅ 6. Naming Conventions
- `simulationId` para InvestmentSimulation ✅
- `opportunityId` para InvestmentOpportunity ✅
- No usa `investmentId` para oportunidades ✅
- `investorId` para Investor ✅
- **Status**: ✅ CORRECTO

### ✅ 7. Arquitectura por Capas
- **Controller**: Solo maneja HTTP, delega a service
- **Service**: Contiene lógica de negocio y validaciones
- **Repository**: Acceso exclusivo a Prisma
- **PrismaService**: No accedido directamente desde controller ni service
- **DTOs**: Controlando qué se expone en respuesta
- **Status**: ✅ CORRECTO

### ✅ 8. Persistencia en Base de Datos
- **Modelo**: `InvestmentSimulation` en Prisma schema
- **Campos guardados**: investorId, opportunityId, amount, estimatedReturn, riskLevel
- **Relaciones**: Relaciones con Investor e InvestmentOpportunity
- **Status**: ✅ CORRECTO

### ✅ 9. Sin Implementaciones Fuera de MVP
- ❌ NO implementa confirmación de intención
- ❌ NO implementa pagos
- ❌ NO implementa transferencias
- ❌ NO implementa contratos
- ❌ NO implementa bancos
- **Status**: ✅ CORRECTO

### ✅ 10. DTOs y Response Types
- `CreateSimulationDto`: Claro con validadores
- `SimulationResultDto`: Claro con tipos explícitos
- No expone Prisma types directamente
- **Status**: ✅ CORRECTO

### ✅ 11. Tests y Cobertura
- **Suites**: 15 suites (44 tests totales, todos pasando)
- **Casos simulación.service.spec.ts**:
  - ✅ Simulación exitosa
  - ✅ Error cuando oportunidad no existe
  - ✅ Error cuando oportunidad no está available
  - ✅ Error cuando monto < minAmount
  - ✅ Cálculo correcto de estimatedProfit
- **Casos simulación.controller.spec.ts**:
  - ✅ Delega a service correctamente
  - ✅ Extrae investorId correctamente
- **Casos simulación.repository.spec.ts**:
  - ✅ Crea registro en BD
  - ✅ Calcula estimatedProfit en respuesta
- **Status**: ✅ CORRECTO (pero tests capturan el bug de estimatedReturn)

### ⚠️ 12. Consistencia de Nomenclatura en Respuesta

**Campo `estimatedReturn` está sobrecargado:**
- En modelo BD: Guarda el porcentaje (15)
- En respuesta especificada: Debería ser total esperado (5750)
- En tests: Verifica porcentaje (15) - necesita actualización

**Campo `roiUsed`:**
- En especificación: Porcentaje de la oportunidad (15)
- En implementación: Correcto (15) ✅

**Status**: ⚠️ REQUIERE CORRECCIÓN EN TESTS

---

## BUGS ENCONTRADOS

### 🔴 BUG #1: Campo `estimatedReturn` en Respuesta
**Ubicación**: `backend/src/simulation/simulation.repository.ts` línea ~45

**Problema**: 
```typescript
// INCORRECTO - retorna el porcentaje
estimatedReturn: Number(simulation.estimatedReturn),  // 15

// DEBERÍA SER
estimatedReturn: investmentAmount + estimatedProfit,  // 5750
```

**Impacto**: La respuesta devuelve un valor confuso. Los clientes esperan recibir el total a recuperar (investmentAmount + profit), no el porcentaje.

**Solución**: Cambiar a `investmentAmount + estimatedProfit`

### 🔴 BUG #2: Tests Capturan Valor Incorrecto
**Ubicación**: `backend/test/unit/simulation.service.spec.ts` línea ~71

**Problema**: Los tests verifican `estimatedReturn: 15` cuando debería ser `estimatedReturn: 5750`

**Impacto**: Los tests validan un comportamiento incorrecto

**Solución**: Actualizar los mocks para devolver valor correcto

---

## RESUMEN DE CORRECCIONES NECESARIAS

| Archivo | Línea | Cambio |
|---------|-------|--------|
| `simulation.repository.ts` | ~45 | Cambiar `estimatedReturn: Number(...)` a `investmentAmount + estimatedProfit` |
| `simulation.service.spec.ts` | ~72 | Actualizar mock a `estimatedReturn: 5750` |
| `simulation.service.spec.ts` | ~130 | Actualizar mock a `estimatedReturn: 12000` |
| `simulation.controller.spec.ts` | ~52 | Actualizar mock a `estimatedReturn: 5750` |
| `simulation.controller.spec.ts` | ~85 | Actualizar mock a `estimatedReturn: 5750` |
| `simulation.repository.spec.ts` | ~69 | Actualizar expectativa a `estimatedProfit: 750` |
| `simulation.repository.spec.ts` | ~92 | Actualizar expectativa a `estimatedProfit: 2000` |

---

## ASPECTOS CORRECTOS ✅

1. ✅ Endpoint POST /opportunities/:opportunityId/simulations implementado
2. ✅ Parámetro opportunityId recibido correctamente
3. ✅ Body investmentAmount validado
4. ✅ Usuario autenticado con rol investor (InvestorGuard)
5. ✅ Validación: oportunidad existe
6. ✅ Validación: oportunidad status = available
7. ✅ Validación: investmentAmount > 0 (DTO @IsPositive)
8. ✅ Validación: investmentAmount >= minAmount
9. ✅ Cálculo: estimatedProfit correcto
10. ✅ Persistencia: InvestmentSimulation en BD
11. ✅ Naming: simulationId, opportunityId, investorId consistente
12. ✅ No usa investmentId para oportunidades
13. ✅ No implementa confirmación, pagos, transferencias
14. ✅ Arquitectura: Controller → Service → Repository → Prisma
15. ✅ Controller no usa Prisma
16. ✅ Service no usa Prisma
17. ✅ DTOs claros y previenen leaks
18. ✅ Tests ejecutables y cobertura amplia
19. ✅ Módulo registrado en app.module.ts
20. ✅ Guard protege endpoint

---

## ESTADO FINAL

### Antes de Correcciones: ⚠️ REQUIERE CORRECCIONES
- 1 bug crítico en lógica de respuesta
- 7 tests necesitan actualización

### Después de Correcciones: ✅ LISTO PARA APROBACIÓN

---

## RECOMENDACIÓN

**RECHAZADO TEMPORALMENTE** - Requiere corrección del bug de `estimatedReturn`.

Una vez corregido, el bloque estará **APROBADO PARA AVANZAR** a la siguiente etapa: Confirmación de Intención de Inversión.

