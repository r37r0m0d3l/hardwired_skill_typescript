# Typed Error Handling

**Title:**

- Always type caught errors as `unknown` and prefer structured `Result<T, E>` patterns over raw throws.

**ID:**

- TS-TYPED-ERROR-HANDLING

**Scope:**

- `*.ts`

**Related:**

- TS-PREFER-UNKNOWN-OVER-ANY
- TS-PREFER-DISCRIMINATED-UNIONS

**Rule:**

- ALWAYS type the catch-clause binding as `unknown` (never `any` or an assumed error type).
- ALWAYS narrow the caught value with a type guard before accessing properties on it.
- PREFER returning a `Result<T, E>` discriminated union (or an equivalent `{ ok: true; value: T } | { ok: false; error: E }`) over throwing for expected, recoverable failures.
- NEVER throw raw strings or plain object literals — throw instances of `Error` or a typed subclass.
- ALWAYS include enough context in error messages to trace the failure without a full stack dump.

**Reason:**

- Because `catch (e: any)` spreads `any` into the catch body, silently disabling type safety for all error-handling code that follows.
- Because `throw "something went wrong"` produces an error without a stack trace and is indistinguishable from other thrown values.
- Because the `Result<T, E>` pattern makes failure a first-class part of the function signature, forcing callers to handle both outcomes and eliminating hidden control-flow jumps.
- Because typed error subclasses allow `instanceof` narrowing, giving structured access to error metadata without stringly-typed property checks.

**Exceptions:**

- Truly unexpected failures (programming errors, invariant violations) are fine to throw directly as `Error` instances and let them bubble.
- Simple scripts or one-off utilities where the overhead of a `Result` type outweighs the benefit.

**Enforcement:**

- SHOULD

**Category:**

- Reliability

## ❌ BAD

```typescript
// catch binding typed as any — spreads unsafety into the handler.
async function loadConfig(path: string): Promise<Config> {
	try {
		return await readFile(path);
	} catch (e: any) {
		console.error(e.message); // works, but e is any
		throw e;
	}
}

// Throws a raw string — no stack trace, no type information.
function divide(a: number, b: number): number {
	if (b === 0) {
		throw "division by zero";
	}
	return a / b;
}
```

## ✅ GOOD

```typescript
// catch binding typed as unknown — forces explicit narrowing.
async function loadConfig(path: string): Promise<Config> {
	try {
		return await readFile(path);
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(`Failed to load config at "${path}": ${error.message}`, { cause: error });
		}
		throw new Error(`Failed to load config at "${path}": unknown error`);
	}
}

// Result<T, E> pattern — failure is part of the signature, not a hidden throw.
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

class DivisionByZeroError extends Error {
	readonly name = "DivisionByZeroError" as const;
}

function divide(a: number, b: number): Result<number, DivisionByZeroError> {
	if (b === 0) {
		return { ok: false, error: new DivisionByZeroError("Cannot divide by zero") };
	}
	return { ok: true, value: a / b };
}

// Caller is forced to handle both outcomes.
const result = divide(10, 0);
if (!result.ok) {
	console.error(result.error.message);
} else {
	console.log(result.value);
}
```
