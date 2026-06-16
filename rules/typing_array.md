# Array Typing

**Title:**

- Enforce generic `Array<T>` syntax over square bracket `T[]` notation for consistent collection typing.

**ID:**

- TS-ARRAY-TYPING

**Scope:**

- `*.ts`

**Related:**

- TS-PREFER-UNKNOWN-OVER-ANY

**Rule:**

- ALWAYS define TypeScript arrays using the generic `Array<T>` syntax.
- NEVER use the shorthanded `T[]` square bracket notation for array declarations.

**Reason:**

- Because the generic `Array<T>` syntax is more visually consistent with other TypeScript generics (like `Promise<T>`, `Record<K, V>`, or `Observable<T>`), leading to a more unified codebase.
- Because it improves readability when dealing with complex types, such as arrays of unions or intersections (e.g., `Array<string | number>` is often clearer than `(string | number)[]`).
- Because it simplifies the transition to ReadonlyArray or custom collection types without changing the mental model of the syntax.

**Exceptions:**

- None.

**Enforcement:**

- MUST

**Category:**

- Style

## ❌ BAD

```typescript
// Uses the shorthand notation which deviates from standard generic patterns.
const allowList: string[] = [];

// Can become hard to read with complex union types.
const data: (string | number | boolean)[] = [];

// Functional arguments using shorthand.
function processItems(items: MyComplexInterface[]) {
	// …
}
```

## ✅ GOOD

```typescript
// Uses the explicit generic form consistent with other TS structures.
const allowList: Array<string> = [];

// Clearer separation of types in complex unions.
const data: Array<string | number | boolean> = [];

// Consistent generic usage in function signatures.
function processItems(items: Array<MyComplexInterface>) {
	// …
}
```
