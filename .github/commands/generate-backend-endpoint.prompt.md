# Generate Backend Endpoint

## Purpose

You are responsible for generating backend code for the JICA MVP.

This command must be used whenever the team needs to create or modify a backend endpoint. The generated code must follow the backend architecture defined for the project and must be suitable for a local MVP implementation.

The goal is not only to generate code, but to generate backend code that is reviewed, organized, validated, testable, and consistent with the project's architecture.

---

## Project Context

JICA is an investment marketplace for gastronomic small and medium businesses.

The MVP focuses on the investor flow:

1. Investor registration or login.
2. Investor dashboard.
3. Investment opportunities list.
4. Investment opportunity detail.
5. Investment simulation.
6. Investment confirmation.

The backend must support this flow with local, functional REST endpoints.

This MVP is intended to run locally. Do not generate Azure, CI/CD, cloud deployment, Application Insights, staging, production, or infrastructure configuration unless explicitly requested.

---

## Required Agents to Orchestrate

When executing this command, consider and apply the responsibilities of these agents:

```txt
.github/agents/technical/backend-controller-agent.md
.github/agents/technical/backend-service-agent.md
.github/agents/technical/backend-repository-agent.md
.github/agents/architecture/architecture-validator.md
.github/agents/design/solid-reviewer.md
.github/agents/design/high-cohesion-reviewer.md
.github/agents/design/low-coupling-reviewer.md
.github/agents/technical/testing-agent.md
```

### Agent Responsibilities

#### backend-controller-agent

Responsible for:

* Defining the HTTP endpoint.
* Handling request and response.
* Extracting params, query params, and body data.
* Calling the correct service.
* Returning proper HTTP status codes.
* Avoiding business logic inside controllers.

#### backend-service-agent

Responsible for:

* Implementing business logic.
* Applying domain rules.
* Coordinating operations required by the use case.
* Calling repositories when data is needed.
* Keeping the logic independent from HTTP details.

#### backend-repository-agent

Responsible for:

* Accessing the database.
* Using Prisma when persistence is required.
* Encapsulating queries.
* Avoiding business rules inside repositories.

#### architecture-validator

Responsible for:

* Validating the layered architecture.
* Checking separation of responsibilities.
* Ensuring dependencies flow in the correct direction.
* Detecting misplaced logic.

#### solid-reviewer

Responsible for:

* Reviewing SOLID principles.
* Detecting responsibilities mixed in the same file.
* Suggesting refactors before final code is accepted.

#### high-cohesion-reviewer

Responsible for:

* Checking that each module groups related responsibilities.
* Detecting files or functions that do too many unrelated things.

#### low-coupling-reviewer

Responsible for:

* Checking that layers are not unnecessarily dependent on each other.
* Ensuring controllers are not coupled to Prisma.
* Ensuring services are not coupled to HTTP details.
* Ensuring repositories are not coupled to business rules.

#### testing-agent

Responsible for:

* Suggesting or generating unit tests.
* Suggesting or generating endpoint/API tests.
* Covering success and error cases.

---

## Required Skills to Apply

Apply these skills during the generation process:

```txt
.github/skills/backend-layered-architecture.skill.md
.github/skills/backend-security.skill.md
.github/skills/database-prisma.skill.md
.github/skills/testing.skill.md
.github/skills/architecture-guidelines.skill.md
.github/skills/coding-standars.skill.md
```

If one of these files is not available, continue using the intent described by its name.

---

## Expected User Input

The user should provide the feature or endpoint to generate.

Expected information:

```txt
Feature name:
HTTP method:
Endpoint path:
Request body:
Params or query params:
Expected response:
Business rules:
Database models involved:
Validation rules:
Error cases:
```

If some information is missing, make reasonable assumptions for a local MVP and clearly state those assumptions before generating code.

Do not stop the process unless the missing information makes the endpoint impossible to generate.

---

## Backend Architecture

The backend must follow a layered architecture:

```txt
Controller → Service → Repository → Database
```

### Controller Rules

The controller must:

* Receive HTTP requests.
* Validate or delegate validation of request input.
* Extract route params, query params, and body data.
* Call the service.
* Return HTTP responses.
* Handle known errors and status codes.

The controller must not:

* Contain business logic.
* Access Prisma directly.
* Execute database queries directly.
* Know implementation details of the repository.
* Contain complex calculations.

---

### Service Rules

The service must:

* Contain business logic.
* Apply domain rules.
* Validate business conditions.
* Coordinate the use case.
* Call repositories when data is required.
* Return data in a format that the controller can send as a response.

The service must not:

* Depend on Express request or response objects.
* Return raw HTTP responses.
* Access frontend-specific details.
* Mix unrelated use cases in the same function.
* Contain direct UI concerns.

---

### Repository Rules

The repository must:

* Encapsulate database access.
* Use Prisma when data persistence or queries are required.
* Return data to the service.
* Keep queries isolated from business rules.

The repository must not:

* Contain business logic.
* Know HTTP status codes.
* Validate request bodies.
* Depend on controllers.
* Depend on frontend details.

---

## Suggested File Structure

Use the existing project structure if it already exists.

If no structure exists, use this structure:

```txt
src/
└── features/
    └── {feature-name}/
        ├── controllers/
        │   └── {feature-name}.controller.ts
        ├── services/
        │   └── {feature-name}.service.ts
        ├── repositories/
        │   └── {feature-name}.repository.ts
        ├── dto/
        │   ├── {feature-name}-request.dto.ts
        │   └── {feature-name}-response.dto.ts
        ├── validations/
        │   └── {feature-name}.schema.ts
        └── routes/
            └── {feature-name}.routes.ts
```

If the project uses a different naming convention, follow the existing convention.

---

## Generation Process

Before generating final code, follow this process:

1. Understand the requested feature.
2. Identify the endpoint method and path.
3. Define the request body, params, and query params.
4. Define the expected response.
5. Identify involved database models.
6. Identify business rules.
7. Identify validation rules.
8. Identify possible error cases.
9. Propose the required file structure.
10. Generate code by layer.
11. Review architecture.
12. Review SOLID principles.
13. Review high cohesion.
14. Review low coupling.
15. Suggest or generate tests.
16. Provide a final checklist.

---

## Code Generation Rules

When generating code:

* Use TypeScript.
* Generate clean and readable code.
* Use clear names.
* Keep functions small and focused.
* Avoid duplicated logic.
* Avoid unnecessary abstractions for the MVP.
* Keep the implementation simple enough to run locally.
* Use DTOs for request and response objects.
* Use validation schemas when necessary.
* Use Prisma only from repositories.
* Avoid cloud-specific configuration.
* Avoid hardcoded secrets.
* Keep code testable.

---

## Validation Rules

For each endpoint, define input validation.

Consider:

* Required fields.
* Data types.
* Empty strings.
* Positive numbers.
* Valid IDs.
* Valid enum values.
* Minimum and maximum values.
* Invalid request body.
* Missing params.
* Invalid query params.

If the project uses a validation library, place validation logic in the `validations` folder.

---

## Security Rules for Local MVP

Apply basic security practices:

* Do not trust client input.
* Validate all request data.
* Do not expose internal errors to the client.
* Do not hardcode secrets.
* Use environment variables for sensitive configuration.
* Check if a resource exists before operating on it.
* Verify ownership or authorization when the endpoint requires an authenticated user.
* Return generic error messages for unexpected failures.

If authentication is not fully implemented in the MVP, clearly mark where authentication or user validation should be added.

---

## Error Handling Rules

Handle at least these cases when applicable:

```txt
400 Bad Request
- Invalid input.
- Missing required fields.

401 Unauthorized
- Missing or invalid authentication, if applicable.

403 Forbidden
- User does not have permission, if applicable.

404 Not Found
- Resource does not exist.

409 Conflict
- Operation conflicts with existing data.

500 Internal Server Error
- Unexpected server error.
```

Error responses should follow a consistent format:

```json
{
  "message": "Readable error message",
  "code": "ERROR_CODE"
}
```

Do not expose Prisma errors, stack traces, secrets, or internal implementation details to the client.

---

## Testing Requirements

For every endpoint, suggest or generate tests for:

* Successful request.
* Invalid input.
* Missing required fields.
* Resource not found.
* Business rule error.
* Repository or database failure, when applicable.

Prefer tests for:

```txt
Service tests
Endpoint/API tests
Repository tests, if the repository contains custom queries
```

Each test suggestion should include:

* Test name.
* Input data.
* Expected result.
* Expected status code, if applicable.

---

## Required Architecture Review

Before finalizing the response, include this checklist:

```txt
[ ] Controller only handles HTTP concerns.
[ ] Controller does not contain business logic.
[ ] Controller does not access Prisma directly.
[ ] Service contains the business logic.
[ ] Service does not depend on HTTP request/response objects.
[ ] Repository only handles database access.
[ ] Repository does not contain business rules.
[ ] DTOs are clearly defined.
[ ] Input validation is separated or clearly handled.
[ ] Error handling is consistent.
[ ] Code supports local MVP execution.
[ ] No cloud-specific configuration was generated.
```

---

## Required SOLID Review

Before finalizing the response, include this checklist:

```txt
[ ] Each class, function, or module has a clear responsibility.
[ ] The endpoint can be extended without rewriting unrelated modules.
[ ] Business logic can be tested independently.
[ ] Dependencies are not unnecessarily inverted or tightly coupled.
[ ] No file has too many unrelated responsibilities.
```

---

## Required Cohesion and Coupling Review

Before finalizing the response, include this checklist:

```txt
[ ] Files group related responsibilities.
[ ] Controller, service, and repository responsibilities are not mixed.
[ ] Service is not coupled to HTTP details.
[ ] Controller is not coupled to Prisma.
[ ] Repository is not coupled to business rules.
[ ] Backend does not depend on frontend implementation details.
[ ] The feature can evolve without affecting unrelated features.
```

---

## Expected Response Format

When this command is used, respond using this format:

```txt
1. Feature summary
2. Assumptions
3. Endpoint definition
4. Request and response contract
5. Business rules
6. Error cases
7. Suggested file structure
8. Generated code by file
9. Tests or test cases
10. Architecture checklist
11. SOLID checklist
12. Cohesion and coupling checklist
13. Final recommendation
```

---

## Example Usage

```txt
/generate-backend-endpoint

Feature: Investment Simulation

Create the endpoint POST /investment-simulations.

Request body:
- investorId
- opportunityId
- amount

Expected response:
- simulationId
- projectedReturn
- expectedProfit
- riskLevel
- simulationDate

Business rules:
- amount must be greater than 0
- opportunity must exist
- projectedReturn is calculated using the opportunity ROI
- riskLevel comes from the selected investment opportunity

Use layered architecture:
controller → service → repository

Use Prisma if data access is needed.

Before final code:
- validate architecture
- review SOLID
- review high cohesion
- review low coupling
- suggest tests
```

---

## Important Final Instruction

Do not generate backend code as a single isolated file.

Always separate responsibilities into the appropriate layers:

```txt
Controller → Service → Repository
```

Always include validations, error handling, and a final review checklist.

The final answer must show that the endpoint was generated with architectural consistency and that it was reviewed before being accepted.
