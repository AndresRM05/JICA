# Generate Backend Endpoint

## Purpose

Generate or modify backend endpoints for the JICA MVP by orchestrating the backend agents and reusable skills defined in the project.

This command must be used whenever the team needs to create, modify, or review a backend endpoint.

The goal is to produce backend code that is:

* Local and functional for the MVP.
* Organized by layers.
* Consistent with the project architecture.
* Validated before being accepted.
* Testable.
* Free of cloud, deployment, CI/CD, or production infrastructure configuration unless explicitly requested.

---

## MVP Context

JICA is an investment marketplace for gastronomic small and medium businesses.

The MVP focuses on the investor flow:

1. Investor registration or login.
2. Investor dashboard.
3. Investment opportunities list.
4. Investment opportunity detail.
5. Investment simulation.
6. Investment confirmation.

The backend must support this flow through local REST endpoints.

---

## Agents to Orchestrate

Apply the responsibilities defined in the following agents:

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

Do not duplicate the full responsibilities of each agent inside this command. Use the agents as the source of truth for their specific responsibilities.

---

## Skills to Apply

Apply the rules and guidance defined in the following skills:

```txt
.github/skills/backend-layered-architecture.skill.md
.github/skills/backend-security.skill.md
.github/skills/database-prisma.skill.md
.github/skills/testing.skill.md
.github/skills/architecture-guidelines.skill.md
.github/skills/coding-standards.skill.md
```

If one of these files is not available, continue using the intent described by its name.

---

## Expected User Input

The user may provide a complete endpoint description or only a feature name.

Useful information includes:

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

If some information is missing, make reasonable assumptions for the local MVP and clearly state those assumptions before generating code.

Do not stop unless the missing information makes the endpoint impossible to generate.

---

## Architecture Requirement

Use the backend architecture defined by the project agents and skills.

At minimum, generated endpoints must follow this flow:

```txt
Controller → Service → Repository → Database
```

Do not generate backend code as a single isolated file.

Responsibilities must remain separated by layer.

---

## MVP Scope Rules

This command is only for the local MVP.

Do not generate:

* Azure configuration.
* CI/CD pipelines.
* Cloud deployment files.
* Application Insights configuration.
* Staging or production setup.
* Paid service integrations.
* Infrastructure configuration.

If any of these are required, the user must request them explicitly.

---

## Generation Process

When this command is executed:

1. Understand the requested feature or endpoint.
2. Identify the endpoint method and path.
3. Define request data, params, query params, and response contract.
4. Identify business rules.
5. Identify validation rules.
6. Identify database access needs.
7. Identify possible error cases.
8. Propose the required file structure.
9. Generate the code by layer.
10. Apply architecture validation.
11. Apply SOLID review.
12. Apply high cohesion review.
13. Apply low coupling review.
14. Suggest or generate tests.
15. Provide a final checklist and recommendation.

---

## Code Generation Expectations

Generated code must:

* Use the project’s backend conventions.
* Follow the existing folder structure when available.
* Keep controllers focused on HTTP concerns.
* Keep services focused on business logic.
* Keep repositories focused on database access.
* Use DTOs or contracts when needed.
* Use validation schemas when needed.
* Use Prisma only from repositories.
* Avoid duplicated logic.
* Avoid unnecessary abstractions for the MVP.
* Avoid hardcoded secrets.
* Return consistent error responses.
* Be testable.

---

## Expected Response Format

Respond using the following structure:

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
10. Architecture review
11. SOLID review
12. Cohesion and coupling review
13. Final recommendation
```

---

## Final Instruction

Before accepting the generated code, show that the endpoint was reviewed using the required agents and skills.

The final answer must make clear that:

* The endpoint follows the required layered architecture.
* The responsibilities are separated correctly.
* The implementation is suitable for the local MVP.
* The endpoint includes validation and error handling.
* Testing was considered.
* No cloud or production infrastructure was generated.
