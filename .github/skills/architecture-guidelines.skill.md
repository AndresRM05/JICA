# architecture-guidelines.skill.md

## Cuándo usar este skill

Usa este skill cuando se diseñe, implemente, revise o refactorice la arquitectura del proyecto JICA.

Aplica especialmente a:

* Diseño de nuevas funcionalidades
* Revisiones arquitectónicas
* Refactorizaciones
* Code Reviews
* Validaciones de estructura
* Análisis de dependencias
* Evaluaciones de cohesión y acoplamiento

Este skill debe ser utilizado por:

* architecture-validator
* high-cohesion-reviewer
* low-coupling-reviewer
* solid-reviewer
* frontend-agents
* backend-agents

---

## Objetivo

Garantizar que toda implementación respete la arquitectura oficial definida para JICA.

El objetivo principal es mantener consistencia arquitectónica, minimizar deriva arquitectónica y asegurar que las decisiones documentadas se reflejen en el código.

---

# Arquitectura General

JICA utiliza:

* Feature-Based Architecture
* Layered Architecture
* Facade Pattern
* Container-Presentational Pattern

Toda implementación debe alinearse con estas decisiones.

---

# Arquitectura Frontend

## Estructura General

```txt
src/
│
├── app/
├── features/
├── shared/
├── services/
├── hooks/
├── routes/
├── types/
├── config/
```

---

## Organización por Features

Las funcionalidades deben agruparse por dominio funcional.

Ejemplo:

```txt
features/
├── investments/
├── simulation/
├── authentication/
```

Cada feature debe contener sus propios componentes, hooks, validaciones y lógica específica.

---

## Responsabilidades Frontend

### Pages

Responsables de:

* composición de pantallas
* routing
* integración de containers

No deben contener lógica compleja.

---

### Containers

Responsables de:

* obtención de datos
* manejo de estado
* coordinación de acciones

Pueden utilizar:

* Facades
* Hooks
* Stores

---

### Presentational Components

Responsables únicamente de:

* renderizado
* interacción visual

No deben:

* llamar APIs
* acceder a estado global
* contener lógica de negocio

---

### Facades

Responsables de simplificar el acceso a:

* servicios
* queries
* stores
* casos de uso

Los Containers deben preferir consumir Facades.

---

### Services

Responsables de:

* comunicación HTTP
* integración externa

No deben contener lógica visual.

---

# Flujo Frontend

Flujo esperado:

```txt
Page
↓
Container
↓
Facade
↓
Service
↓
API
```

Flujos prohibidos:

```txt
Page → API

Component → API

Component → Database

Component → Service
```

---

# Arquitectura Backend

## Estructura General

```txt
src/
│
├── investments/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── dto/
│   ├── entities/
│   └── tests/
```

---

## Responsabilidades Backend

### Controllers

Responsables de:

* recibir requests
* validar entrada
* delegar al service

No deben contener lógica de negocio.

---

### Services

Responsables de:

* reglas de negocio
* casos de uso
* coordinación de procesos

---

### Repositories

Responsables de:

* acceso a datos
* consultas
* persistencia

---

### Prisma

Responsable de:

* interacción con la base de datos

Debe estar encapsulado dentro de repositories.

---

### Database

Responsable únicamente de persistencia.

---

# Flujo Backend

Flujo obligatorio:

```txt
Controller
↓
Service
↓
Repository
↓
Prisma
↓
Database
```

---

# Dependencias Permitidas

## Frontend

Permitido:

```txt
Page → Container

Container → Facade

Facade → Service

Facade → Store

Facade → Query

Service → API
```

Prohibido:

```txt
Component → API

Component → Store

Component → Query

Feature → internals de otra feature
```

---

## Backend

Permitido:

```txt
Controller → Service

Service → Repository

Repository → Prisma
```

Prohibido:

```txt
Controller → Repository

Controller → Prisma

Controller → Database

Service → Prisma

Service → Database
```

---

# Dependencias entre Features

Las features deben ser independientes.

Correcto:

```txt
Feature A
↓
Contrato Compartido
↓
Feature B
```

Incorrecto:

```txt
Feature A
↓
Import interno
↓
Feature B
```

---

# Shared Layer

Puede contener:

* componentes reutilizables
* hooks reutilizables
* utilidades genéricas
* tipos compartidos

No puede contener:

* lógica de negocio específica
* dependencias hacia features

---

# Patrones Arquitectónicos Obligatorios

## Feature-Based Architecture

Toda funcionalidad debe pertenecer a una feature.

---

## Layered Architecture

Cada capa tiene responsabilidades definidas.

Las capas deben comunicarse únicamente mediante los flujos permitidos.

---

## Facade Pattern

Las operaciones complejas deben exponerse mediante facades cuando aplique.

---

## Container-Presentational Pattern

Separar:

```txt
lógica
estado
obtención de datos
```

de

```txt
presentación
renderizado
UI
```

---

# Restricciones Arquitectónicas

## Restricción 1

No existe acceso directo a Prisma fuera de repositories.

---

## Restricción 2

No existe acceso directo a base de datos fuera de Prisma.

---

## Restricción 3

No existe lógica de negocio en controllers.

---

## Restricción 4

No existe lógica de negocio en componentes presentacionales.

---

## Restricción 5

No existen llamadas HTTP directas desde componentes UI.

---

## Restricción 6

No existen dependencias circulares.

---

## Restricción 7

No existen imports cruzados entre capas prohibidas.

---

## Restricción 8

No se crean nuevas arquitecturas paralelas.

Toda implementación debe alinearse con la arquitectura oficial.

---

## Restricción 9

No se introducen tecnologías que sustituyan:

* Zustand
* TanStack Query
* MSAL

sin aprobación arquitectónica.

---

## Restricción 10

Toda nueva funcionalidad debe integrarse dentro de una feature existente o una nueva feature formal.

---

# Checklist Arquitectónico

```txt
[ ] Sigue Feature-Based Architecture.
[ ] Sigue Layered Architecture.
[ ] Respeta Container-Presentational.
[ ] Respeta Facade Pattern.
[ ] Controllers delegan a Services.
[ ] Services delegan a Repositories.
[ ] Repositories encapsulan Prisma.
[ ] No existen dependencias prohibidas.
[ ] No existen dependencias circulares.
[ ] Shared no contiene lógica de negocio.
[ ] Las features son independientes.
[ ] No existen accesos directos a infraestructura.
```

---

# Violaciones Críticas

* Controller accediendo Prisma.
* Controller accediendo Database.
* Service accediendo Database.
* Dependencias circulares.
* Bypass de capas.
* Lógica de negocio en UI.
* Features accediendo internals de otras features.
* Arquitectura paralela no documentada.

---

# Violaciones Medias

* Ubicación incorrecta de módulos.
* Uso incorrecto de shared.
* Responsabilidades mezcladas.
* Facades omitidas donde la arquitectura las requiere.

---

# Violaciones Bajas

* Inconsistencias organizacionales menores.
* Oportunidades de alineación arquitectónica.
* Mejoras estructurales recomendadas.

---

# Formato esperado de salida

```txt
Módulo revisado:

Arquitectura Frontend:
✓ / ✗

Arquitectura Backend:
✓ / ✗

Dependencias:
✓ / ✗

Patrones:
✓ / ✗

Restricciones:
✓ / ✗

Hallazgos críticos:
-

Hallazgos medios:
-

Hallazgos bajos:
-

Estado final:

APROBADO | REQUIERE CORRECCIONES
```
