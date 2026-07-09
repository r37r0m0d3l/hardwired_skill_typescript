# Async / Promise Typing

**Title:**

- Always annotate async functions with an explicit `Promise<T>` return type and never leave promises floating.

**ID:**

- TS-ASYNC-TYPING

**Scope:**

- `*.ts`

**Related:**

- TS-EXPLICIT-RETURN-TYPE
- TS-TYPED-ERROR-HANDLING

**Rule:**

- ALWAYS annotate `async` functions with an explicit `Promise<T>` return type (do not rely on inference alone).
- ALWAYS use `Awaited<T>` to unwrap the resolved type of a `Promise<T>` instead of manually writing the inner type.
- NEVER leave a `Promise` floating - every `Promise` must be either `await`-ed, `return`-ed, or explicitly handled with `.catch()` / `void`.
- NEVER annotate an `async` function's return type as `Promise<any>` or `Promise<unknown>` unless the resolved value is genuinely unknown and immediately validated.
- ALWAYS propagate errors with `async`/`await` rather than mixing `.then()`/`.catch()` chains with `await` in the same function body.

**Reason:**

- Because an un-annotated `async` function silently infers `Promise<any>` when the return value comes from a loosely typed source, hiding type errors until runtime.
- Because a floating promise swallows unhandled rejections, leading to silent failures that are hard to trace.
- Because mixing `.then()` chains with `await` produces hard-to-read control flow and makes error propagation non-obvious.
- Because `Awaited<T>` keeps unwrapped types accurate even when `T` changes, avoiding manual type maintenance.

**Exceptions:**

- Top-level `void`-returning event handlers or lifecycle hooks where floating is intentional - document with a comment and prefix the call with the `void` operator (`void fetchData()`).
- Fire-and-forget background tasks where rejection is explicitly handled inside the callee.

**Enforcement:**

- MUST

**Category:**

- Reliability

## ❌ BAD

```typescript
// Missing return type - infers Promise<any> from the loose fetch result.
async function fetchUser(id: string) {
	const response = await fetch(`/users/${id}`);
	return response.json(); // any
}

// Floating promise - rejection is silently swallowed.
function initDashboard(): void {
	loadWidgets(); // Promise never awaited or handled
}

// Mixed .then() and await in the same body - hard to follow error flow.
async function save(data: unknown): Promise<void> {
	await validate(data).then(() => persist(data));
}
```

## ✅ GOOD

```typescript
interface User {
	id: string;
	name: string;
}

// Explicit return type - compiler enforces the resolved shape.
async function fetchUser(id: string): Promise<User> {
	const response = await fetch(`/users/${id}`);
	return response.json() as Promise<User>;
}

// Awaited<T> unwraps a generic Promise type without manual duplication.
type ResolvedUser = Awaited<ReturnType<typeof fetchUser>>; // User

// Intentional fire-and-forget - made explicit with the void operator.
function initDashboard(): void {
	void loadWidgets();
}

// Consistent await - error propagation is clear and predictable.
async function save(data: unknown): Promise<void> {
	await validate(data);
	await persist(data);
}
```
