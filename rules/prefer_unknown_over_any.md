# Prefer `unknown` over `any`

**Title:**

- Prefer `unknown` over `any` type to enforce runtime type safety and validation boundaries.

**ID:**

- TS-PREFER-UNKNOWN-OVER-ANY

**Scope:**

- `*.ts`

**Related:**

- None.

**Rule:**

- ALWAYS use `unknown` instead of `any` for variables, function arguments, and return types where the type is genuinely not determined.
- ALWAYS perform explicit type narrowing, type assertions, or type guards on `unknown` values before accessing their properties or methods.
- ALWAYS cast untyped third-party library outputs, `JSON.parse` results, or environment variable inputs to `unknown` immediately at the boundary.

**Reason:**

- Because `any` completely disables the TypeScript compiler's type checking, which can mask critical runtime errors and lead to application crashes.
- Because `unknown` acts as a type-safe counterpart to `any`, forcing developers to explicitly validate data shapes before interacting with them.
- Because treating unverified boundary data as `unknown` prevents type leakage, ensuring that unsafe data contracts do not propagate deeply into internal application layers.

**Exceptions:**

- None. If you receive an `any` from a dependency, do not propagate it - immediately treat it as `unknown` and validate/narrow.

**Enforcement:**

- MUST

**Category:**

- Reliability

## ❌ BAD

```typescript
// Disables type safety, allowing properties to be accessed without any structural verification.
function parse(data: any) {
	if (typeof data === "string") {
		return data.toUpperCase();
	}
	// No warning that accessing unverified properties could crash at runtime
	return data.someProperty.nestedValue;
}

// Propagates implicitly unsafe return values from native untyped APIs
function processPayload(input: string) {
	const result = JSON.parse(input); // implicitly typed as any
	return result.id; // Type leakage, dynamic property access allowed without guarding
}
```

## ✅ GOOD

```typescript
// Enforces type safety, requiring validation before interacting with the variable.
function parse(data: unknown) {
	if (typeof data === "string") {
		return data.toUpperCase();
	}
	// TypeScript will prevent compiling if you try to access properties here without narrowing
}

// Safely casts dynamic boundaries to unknown and uses type guards to narrow the contract.
function parseJson(input: string): unknown {
	return JSON.parse(input) as unknown;
}

function isUser(value: unknown): value is { id: string } {
	return typeof value === "object" && value !== null && "id" in value;
}

const parsed = parseJson('{"id":"u1"}');
if (isUser(parsed)) {
	// Completely type-safe access after successful narrowing
	console.log(parsed.id);
}
```
