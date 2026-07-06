# Discriminated unions

**Title:**

- Prefer discriminated unions over optional fields and runtime guessing to enforce compile-time exhaustive type safety.

**ID:**

- TS-DISCRIMINATED-UNIONS

**Scope:**

- `*.ts`

**Related:**

- TS-ENUM-ALTERNATIVE

**Rule:**

- ALWAYS prefer discriminated unions over models that use optional fields to represent mutually exclusive states.
- ALWAYS include a literal, common discriminator property (e.g., `kind`, `type`, `status`) to distinguish between variants within a union type.
- NEVER rely on runtime guessing, partial object shapes, or manual property presence checks (e.g., `if ("message" in obj)`) to infer object states.

**Reason:**

- Because optional properties force developers to write defensive, redundant runtime checks and make it impossible for the compiler to guarantee that related properties exist together.
- Because discriminated unions enable the TypeScript compiler to perform precise control-flow analysis and narrow down object types safely within conditional blocks.
- Because this pattern supports exhaustive type checking with `switch` statements or `never` casts, ensuring that additions of new states trigger compile-time errors if they are not handled.

**Exceptions:**

- None.

**Enforcement:**

- MUST

**Category:**

- Architecture

## ❌ BAD

```typescript
// Uses optional fields to represent mutually exclusive operations, leading to runtime ambiguity.
type Result = {
	value?: string;
	message?: string;
};

function handleResult(result: Result) {
	// Highly fragile approach requiring guessing what state the object is in
	if (result.value) {
		console.log(result.value.toUpperCase());
	} else if (result.message) {
		console.log(result.message.toLowerCase());
	}
}
```

## ✅ GOOD

```typescript
// Uses a explicit literal discriminator property ("kind") to clearly separate states.
type Result = { kind: "ok"; value: string } | { kind: "error"; message: string };

function handleResult(result: Result) {
	// TypeScript perfectly narrows the specific object shape inside each switch branch
	switch (result.kind) {
		case "ok":
			console.log(result.value.toUpperCase()); // Safe property access
			break;
		case "error":
			console.log(result.message.toLowerCase()); // Safe property access
			break;
	}
}
```
