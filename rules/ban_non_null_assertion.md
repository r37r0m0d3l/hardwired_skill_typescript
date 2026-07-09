# Avoid Non-Null Assertion Operator (`!`)

**Title:**

- Avoid the non-null assertion operator (`!`) - use optional chaining, nullish coalescing, or explicit narrowing instead.

**ID:**

- TS-NO-NON-NULL-ASSERTION

**Scope:**

- `*.ts`

**Related:**

- TS-PREFER-UNKNOWN-OVER-ANY
- TS-VALIDATE-EXTERNAL-DATA

**Rule:**

- NEVER use the `!` postfix non-null assertion operator to suppress `possibly undefined` or `possibly null` compiler errors.
- ALWAYS use optional chaining (`?.`) when accessing properties or methods on a value that may be `null` or `undefined`.
- ALWAYS use nullish coalescing (`??`) to supply a fallback value instead of asserting non-nullness.
- ALWAYS use an explicit narrowing guard (`if (value !== null && value !== undefined)`) when you need to branch on the presence of a value.

**Reason:**

- Because `!` is a compile-time-only assertion - it produces no runtime check. If the value is actually `null` or `undefined` at runtime, the program crashes with an unhandled `TypeError`.
- Because every use of `!` is a silent lie to the compiler: it trades a type error for a potential runtime crash, undermining the entire purpose of strict null checks.
- Because optional chaining and nullish coalescing are safer, equally concise, and semantically honest about the nullable nature of the value.

**Exceptions:**

- Test setup code where a variable is guaranteed to be initialized in `beforeEach` and would require cumbersome narrowing in every `it` block (use sparingly and comment why).
- Auto-generated code or library interop where the external type declarations are known to be incorrect.

**Enforcement:**

- MUST

**Category:**

- Reliability

## ❌ BAD

```typescript
// Silences the compiler but crashes at runtime if user is null.
function getUsername(user: User | null): string {
	return user!.name;
}

// Asserts that getElementById always returns an element - crashes if the id doesn't exist.
const button = document.getElementById("submit")!;
button.addEventListener("click", handleClick);

// Chained assertions hide every nullable step.
const city = order!.address!.city!.toUpperCase();
```

## ✅ GOOD

```typescript
// Explicit narrowing guard - clear intent, safe at runtime.
function getUsername(user: User | null): string {
	if (user === null) {
		return "Anonymous";
	}
	return user.name;
}

// Optional chaining with a nullish fallback - no crash if the element is absent.
const button = document.getElementById("submit");
button?.addEventListener("click", handleClick);

// Optional chaining propagates null-safety through the whole chain.
const city = order?.address?.city?.toUpperCase() ?? "Unknown";
```
