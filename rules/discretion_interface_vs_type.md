# `interface` vs `type`

**Title:**

- Use `interface` for extensible object shapes and `type` for unions, intersections, and type-level transformations.

**ID:**

- TS-INTERFACE-VS-TYPE

**Scope:**

- `*.ts`

**Related:**

- TS-PREFER-COMPOSING-TYPES
- TS-PREFER-DISCRIMINATED-UNIONS

**Rule:**

- ALWAYS use `interface` when defining an object shape that may be implemented by a class or extended by another interface.
- ALWAYS use `type` for union types, intersection types, mapped types, conditional types, and type aliases of primitives or tuples.
- NEVER mix the two interchangeably within the same codebase — apply the above distinction consistently.
- NEVER use `interface` to define a union or conditional type (it cannot express these constructs).

**Reason:**

- Because `interface` declarations support declaration merging, making them the natural choice for public API shapes that library consumers may augment.
- Because `interface` errors are reported at the declaration site, whereas `type` alias errors can surface at usage sites, making `interface` easier to debug for object shapes.
- Because `type` is the only way to express unions, intersections, mapped types, and conditional types — using it for those constructs keeps intent clear and avoids misuse of `interface`.
- Because consistent use of this distinction makes it immediately obvious whether a definition is "a shape to implement" (`interface`) or "a type computation" (`type`).

**Exceptions:**

- Simple, non-extensible data-transfer-object shapes where either would be idiomatic and the team prefers `type` for brevity — document the team preference.
- When refactoring legacy code, pragmatic consistency with surrounding code takes priority over this rule.

**Enforcement:**

- SHOULD

**Category:**

- Consistency

## ❌ BAD

```typescript
// Using type for an object shape that a class will implement — misses the intent signal.
type Repository<T> = {
	findById(id: string): Promise<T | null>;
	save(entity: T): Promise<void>;
};

// Using interface for a union — syntactically impossible, forces awkward workarounds.
// This is not valid TypeScript:
// interface Status = "active" | "inactive";

// Mixing both arbitrarily with no consistent rule.
interface ApiResponse {
	data: unknown;
}
type ApiResponse2 = { data: unknown }; // same shape, no reason to differ
```

## ✅ GOOD

```typescript
// interface for a shape intended to be implemented/extended.
interface Repository<T> {
	findById(id: string): Promise<T | null>;
	save(entity: T): Promise<void>;
}

class UserRepository implements Repository<User> {
	async findById(id: string): Promise<User | null> {
		/* … */
	}
	async save(entity: User): Promise<void> {
		/* … */
	}
}

// type for a union.
type Status = "active" | "inactive" | "pending";

// type for a mapped type transformation.
type Nullable<T> = { [K in keyof T]: T[K] | null };

// type for a conditional type.
type NonNullable<T> = T extends null | undefined ? never : T;

// interface extension — leverages declaration merging.
interface BaseEntity {
	id: string;
	createdAt: Date;
}

interface User extends BaseEntity {
	name: string;
	email: string;
}
```
