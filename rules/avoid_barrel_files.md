# Avoid Internal Barrel Files

**Title:**

- Avoid internal barrel files in favor of explicit imports to keep dependencies visible and reduce unnecessary module
  loading.

**ID:**

- TS-NO-INTERNAL-BARRELS

**Scope:**

- `*.ts`
- `*.tsx`

**Related:**

- TS-PREFER-EXPLICIT-IMPORTS

**Rule:**

- NEVER create new internal barrel files solely to re-export modules from a directory.
- PREFER importing modules directly from their defining files.
- ALWAYS use `import type` for type-only dependencies.
- ALWAYS name files descriptively based on their primary export or domain context.
- DO NOT remove or refactor an existing barrel file unless the task explicitly requires it or there is a demonstrated
  dependency, build, or maintenance problem.

**Reason:**

- Because internal barrel files can hide dependency relationships and obscure module resolution paths.
- Because internal barrel files can make circular dependencies easier to introduce and harder to diagnose.
- Because barrel files can cause unnecessary module-graph traversal and parsing, particularly affecting development and test execution speed.
- Because direct imports make it immediately clear where a dependency is defined and can simplify dead-code elimination.

**Exceptions:**

- Public package entry points (e.g., `src/index.ts`).
- Deliberate public API boundaries.
- Framework-mandated entry points or routing conventions.
- Other explicitly documented module boundaries.

**Enforcement:**

- MUST

**Category:**

- Architecture

## ❌ BAD

```typescript
// src/components/index.ts
export * from "./Button";
export * from "./Input";
export * from "./types";

// src/app.ts
// Dependency is hidden behind the barrel.
import {Button, Input} from "./components";
```
