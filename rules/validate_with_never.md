# Use Exhaustive Checks With never

**Title:**

- Use Exhaustive Checks With `never` to ensure comprehensive handling of all discriminated union members at compile time.

**ID:**

- TS-EXHAUSTIVE-CHECKS-NEVER

**Scope:**

- `*.ts`

**Related:**

- TS-EXHAUSTIVE-NEVER

**Rule:**

- ALWAYS assign the `default` fallback of a discriminated union conditional or switch block to a variable typed explicitly as `never`.
- ALWAYS ensure that any missing case in a conditional evaluation fails compilation early via the strict `never` assignment.

**Reason:**

- Because assigning an unhandled status fallback to a `never` type ensures that future refactors or union additions turn into immediate compile-time errors instead of silent runtime bugs.
- Because it maximizes the structural validation power of discriminated unions by providing a compile-time safety net across the codebase.

**Exceptions:**

- None.

**Enforcement:**

- MAY

**Category:**

- Reliability

## ❌ BAD

```typescript
// If 'pending' is added to the Status union later, this function will silently return undefined at runtime.
type Status = "success" | "failure";

function handleStatus(status: Status) {
	switch (status) {
		case "success":
			return "Yay!";
		case "failure":
			return "Oh no!";
	}
}
```

## ✅ GOOD

```typescript
// The compiler forces validation of all members because any unhandled branch cannot be assigned to the 'never' type.
type Status = "success" | "failure";

function handleStatus(status: Status) {
	switch (status) {
		case "success":
			return "Yay!";
		case "failure":
			return "Oh no!";
		default:
			// If you add 'pending' to Status later, THIS line will turn red and break the build.
			const _check: never = status;
			return _check;
	}
}
```
