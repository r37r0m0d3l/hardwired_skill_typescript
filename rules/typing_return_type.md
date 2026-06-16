# Use Type Predicates for Reusable Narrowing

**Title:**

- Use explicit type predicates to connect runtime verification logic with compile-time type intelligence.

**ID:**

- TS-TYPE-PREDICATES

**Scope:**

- `*.ts`

**Related:**

- TS-PREFER-UNKNOWN-OVER-ANY
- TS-DISCRIMINATED-UNIONS

**Rule:**

- ALWAYS use the `value is T` type predicate syntax for custom validation functions that narrow the type of argument.
- ALWAYS perform complete structural runtime validation within the predicate function before asserting the type to the compiler.

**Reason:**

- Because standard boolean-returning functions only provide runtime logic, leaving the TypeScript compiler unable to infer or narrow type shapes within later conditional blocks.
- Because type predicates bridge the gap between dynamic runtime execution and static type analysis, eliminating the need for unsafe manual type assertions (`as`) downstream.
- Because encapsulating narrowing logic into reusable predicates reduces code duplication and centralizes structural contracts around volatile external inputs.

**Exceptions:**

- Simple inline conditions where native control-flow analysis (like `typeof` or `instanceof`) can automatically narrow the type without a helper function.

**Enforcement:**

- MUST

**Category:**

- Reliability

## ❌ BAD

```typescript
interface User {
	id: string;
}

// Returns a plain boolean; TypeScript loses all context outside of this function block
function isUser(value: unknown): boolean {
	return typeof value === "object" && value !== null && "id" in value;
}

function process(data: unknown) {
	if (isUser(data)) {
		// Compile error: Object is of type 'unknown', even though the runtime check passed
		console.log(data.id);
	}
}
```

## ✅ GOOD

```typescript
interface User {
	id: string;
}

// Uses a type predicate to inform the compiler of structural success upon a true return
function isUser(value: unknown): value is User {
	return typeof value === "object" && value !== null && "id" in value;
}

function process(data: unknown) {
	if (isUser(data)) {
		// Completely type-safe access; 'data' is safely narrowed down to 'User'
		console.log(data.id);
	}
}
```
