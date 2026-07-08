# Avoid Loose Types (`Function`, `object`, `{}`)

**Title:**

- Never use `Function`, `object`, or `{}` as type annotations - use explicit signatures and shapes instead.

**ID:**

- TS-NO-LOOSE-TYPES

**Scope:**

- `*.ts`

**Related:**

- TS-PREFER-UNKNOWN-OVER-ANY
- TS-PREFER-TYPE-DEFINITIONS

**Rule:**

- NEVER use `Function` as a type - always write an explicit callable signature `(arg: T) => R`.
- NEVER use `object` as a type - always define the expected shape as an `interface`, `type`, or `Record<K, V>`.
- NEVER use `{}` as a type to mean "any non-nullish value" - use `unknown` or a specific shape instead.
- ALWAYS provide precise types so the compiler can enforce call-site correctness and enable IDE autocompletion.

**Reason:**

- Because `Function` accepts any number of arguments of any types and returns `any`, providing zero type safety at call sites.
- Because `object` excludes primitives but still permits any shape, making property access impossible without unsafe casting.
- Because `{}` matches everything except `null` and `undefined`, meaning it offers essentially the same safety as `any` for object values.
- Because loose types propagate unsafely through the codebase, turning localised imprecision into widespread `any`-like behaviour.

**Exceptions:**

- Higher-order utility types that intentionally accept any callable shape as a constraint (e.g., `type AnyFn = (...args: unknown[]) => unknown`).
- Type-level generic constraints where the exact shape is intentionally deferred to the call site.

**Enforcement:**

- MUST

**Category:**

- Reliability

## ❌ BAD

```typescript
// Accepts any callable - no information about arguments or return value.
function applyTwice(fn: Function, value: number): number {
	return fn(fn(value));
}

// Accepts any object shape - impossible to safely access properties.
function logId(entity: object): void {
	console.log(entity.id); // Error: Property 'id' does not exist on type 'object'
}

// {} is nearly equivalent to any for object values.
function process(input: {}): void {
	console.log(input); // No useful type information
}
```

## ✅ GOOD

```typescript
// Explicit callable signature - compiler enforces argument and return types.
function applyTwice(fn: (value: number) => number, value: number): number {
	return fn(fn(value));
}

// Specific shape - property access is type-safe.
interface Entity {
	id: string;
}

function logId(entity: Entity): void {
	console.log(entity.id);
}

// Record with explicit key and value types.
function process(input: Record<string, unknown>): void {
	console.log(input);
}

// Generic with a constraint when the exact shape is deferred.
function identity<T extends Record<string, unknown>>(value: T): T {
	return value;
}
```
