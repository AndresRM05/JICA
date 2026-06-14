# Review Architecture

## Purpose

Review the architecture of the JICA codebase by orchestrating the project architecture agents.

This command must be used whenever the team needs to inspect or validate architectural quality, cohesion, coupling, and SOLID compliance for a target area of the repository.

The goal is to provide an architecture review focused on the local MVP implementation and the feature or layer under review.

---

## Command

The command name is:

```txt
review architecture
```

It should be invoked with a target path or area whenever possible, for example:

```txt
review architecture /backend/src
review architecture /frontend/src
review architecture /backend/src/investments
review architecture /frontend/src/features/investments
```

If no path is provided, review the repository architecture at a high level.

---

## Agents to Orchestrate

Apply the responsibilities defined in the following agents:

```txt
.github/agents/architecture/Architecture_Validator.md
.github/agents/architecture/SOLID_Reviewer.md
.github/agents/architecture/High_Cohesion_Reviewer.md
.github/agents/architecture/Low_Coupling_Reviewer.md
```

Do not duplicate the full responsibilities of each agent inside this command. Use the agents as the source of truth for their specific responsibilities.

---

## Expected User Input

The user may provide:

```txt
Target path or module:
Review focus (architecture, cohesion, coupling, SOLID):
Area of concern:
Specific files or directories:
```

If information is missing, perform a broad architecture review and clearly state any assumptions.

---

## Review Process

When this command is executed:

1. Identify the review target (path, module, or entire repository).
2. Analyze structural organization and folder layout.
3. Validate architecture against documented project conventions.
4. Review SOLID compliance.
5. Review cohesion within modules and units.
6. Review coupling across layers and features.
7. Identify violations or improvement opportunities.
8. Provide clear recommendations.

---

## Expected Response Structure

Respond using the following structure:

```txt
1. Review summary
2. Target and assumptions
3. Architecture findings
4. SOLID findings
5. Cohesion findings
6. Coupling findings
7. Recommendations
8. Suggested improvements
```

---

## Final Instruction

Before accepting the review, show that the architecture assessment was performed using the required agents.

The final answer must make clear that the following agents were consulted:

* Architecture Validator
* SOLID Reviewer
* High Cohesion Reviewer
* Low Coupling Reviewer
