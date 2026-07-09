# Force using `Error.isError` instead of `instanceof Error`

**Title:**

- Force the use of `Error.isError()` utility check over the standard `instanceof Error` operator to reliably detect cross-realm error exceptions.

**ID:**

- TS-FORCE-IS-ERROR

**Scope:**

- `*.ts`

**Related:**

- TS-USE-ERROR-CAUSE

**Rule:**

- ALWAYS evaluate whether a caught `unknown` structure is an error instance using `Error.isError()`.
- ALWAYS avoid using `instanceof Error` inside catch blocks or type guards.
- ALWAYS make sure fallback string conversions (`String(error)`) process unexpected non-error primitives safely within fallback conditions.

**Reason:**

- Because the native `instanceof Error` statement frequently generates false-negative results when verifying exceptions thrown across runtime realms, such as code running inside independent iframes, worker threads, or custom Node.js `vm` execution modules where distinct global contexts manage isolated constructor instances.
- Because utility guards like `Error.isError()` robustly check internal structural signatures or prototype chains, providing a bulletproof type narrowing layer regardless of structural background contexts.

**Exceptions:**

- External codebase projects where custom error utilities do not exist or environment constraints prevent wrapping default types.

**Enforcement:**

- MUST

**Category:**

- Reliability

## ❌ BAD

```typescript
try {
	throw new Error("This is an error");
} catch (error: unknown) {
	// Violates the rule by relying on instanceof, which breaks across cross-realm structures
	if (error instanceof Error) {
		console.warn(`An error occurred: [${error.message}]`);
		console.error(error);
	} else {
		// IFrame Error, VM execution Error, class named Error
		console.warn(`An unknown error occurred: [${String(error)}]`);
	}
}
```

## ✅ GOOD

```typescript
try {
	throw new Error("This is an error");
} catch (error: unknown) {
	// Follows the rule by executing a context-safe robust check via Error.isError()
	if (Error.isError(error)) {
		console.warn(`An error occurred: [${error.message}]`);
		console.error(error);
	} else {
		console.warn(`An unknown error occurred: [${String(error)}]`);
	}
}
```
