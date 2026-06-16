# TypeScript Utility Types Over Duplication

**Title:**

- Prefer TypeScript Built-in Utility Types Over Manual Type Duplication

**ID:**

- TS-UTILITY-TYPES

**Scope:**

- `*.ts`

**Related:**

- None.

**Rule:**

- ALWAYS prefer built-in utility types (`Pick`, `Omit`, `Partial`, `Required`, `ReturnType`, etc.) over redefining existing object structures.
- ALWAYS derive related types from a single source of truth rather than copy-pasting fields.

**Reason:**

- Because manual type duplication creates unnecessary code maintenance debt whenever the base type changes.
- Because utility types explicitly document the relationships between your data models, making the architecture easier to follow.

**Exceptions:**

- Framework-required interfaces that mandate specific standalone declarations.

**Enforcement:**

- May

**Category:**

- Maintainability

## ❌ BAD

```typescript
// Re-declaring fields manually creates duplication and violates the single source of truth.
interface User {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface UserUpdateInput {
	name?: string;
	email?: string;
}

interface UserProfileSummary {
	id: string;
	name: string;
}
```

## ✅ GOOD

```typescript
// Leveraging utility types clearly expresses intent and scales automatically with the base type.
interface User {
	id: string;
	name: string;
	email: string;
	role: string;
}

type UserUpdateInput = Partial<Pick<User, "name" | "email">>;

type UserProfileSummary = Pick<User, "id" | "name">;
```
