# Exhaustive switch

**Title:**

- Enforce exhaustive compile-time `switch` statements over discriminated unions using a `never` type check.

**ID:**

- TS-EXHAUSTIVE-SWITCH

**Scope:**

- `*.ts`

**Related:**

- TS-DISCRIMINATED-UNIONS

**Rule:**

- ALWAYS ensure that `switch` statements acting on a discriminant check all possible values of the union.
- ALWAYS use a `never` type assertion (e.g., passing the value to an `assertNever` helper) in the `default` block to catch unhandled cases at compile time.

**Reason:**

- Because explicitly forcing exhaustive checks guarantees that if a new member is added to a union type later, the compiler will instantly flag every unhandled `switch` block across the application.
- Because it eliminates silent runtime regressions caused by missing conditions, removing the need to debug unhandled edge cases in production.
- Because the `default: return assertNever(value)` pattern turns implicit type-narrowing gaps into hard, visible compile-time errors.

**Exceptions:**

- None.

**Enforcement:**

- MUST

**Category:**

- Reliability

## ❌ BAD

```typescript
type AppStatus = "loading" | "success" | "failed";

function handleStatus(status: AppStatus) {
	// Missing the 'failed' state.
	// TypeScript stays silent, allowing potential silent failures at runtime.
	switch (status) {
		case "loading":
			return "Spinner";
		case "success":
			return "Data View";
	}
}
```

## ✅ GOOD

```typescript
// A dedicated utility function that expects a value narrowed down to `never`
function assertNever(value: never): never {
	throw new Error(`Unhandled case: ${String(value)}`);
}

type AppStatus = "loading" | "success" | "failed";

function handleStatus(status: AppStatus): string {
	switch (status) {
		case "loading":
			return "Spinner";
		case "success":
			return "Data View";
		case "failed":
			return "Error Message";
		default:
			// If any case is omitted, TypeScript will throw a compile error right here
			return assertNever(status);
	}
}
```
