# Prefer composing types over duplicating object shapes

**Title:**

- Prefer composing types over duplicating object shapes to establish a single source of truth for structural definitions.

**ID:**

- TS-COMPOSING-TYPES

**Scope:**

- `*.ts`

**Related:**

- TS-READONLY-WHERE-POSSIBLE

**Rule:**

- ALWAYS prefer composing, intersecting, or transforming existing types over copy-pasting and duplicating object structures.
- ALWAYS use TypeScript utility types (e.g., `Pick`, `Omit`, `Partial`, `Readonly`) to derive subset or mutated configurations from an original base type.

**Reason:**

- Because duplicating type definitions breaks the single source of truth principle, forcing developers to manually update multiple shapes whenever a core domain structure shifts.
- Because type composition clearly signals architectural relationships and data derivation flows between parent and child abstractions to anyone reading the codebase.
- Because using utility types drastically reduces boilerplate and mitigates omissions or type divergence during continuous system refactoring.

**Exceptions:**

- External data models or DTO configurations belonging to completely independent microservices or distinct system boundaries where sharing structural definitions could lead to brittle coupling.

**Enforcement:**

- MUST

**Category:**

- Architecture

## ❌ BAD

```typescript
// Duplicates the structural shape of properties, breaking the single source of truth
type User = {
	id: string;
	name: string;
	email: string;
};

// If 'id' changes to a branded type or number, this type must be manually updated too
type UserPreview = {
	id: string;
	name: string;
};
```

## ✅ GOOD

```typescript
// Establishes a definitive model structure
type User = {
	id: string;
	name: string;
	email: string;
};

// Dynamically derives properties directly from the source model definition
type UserPreview = Pick<User, "id" | "name">;

// Combines composition strategies cleanly for other data contexts
type UserUpdatePayload = Partial<Omit<User, "id">>;
```
