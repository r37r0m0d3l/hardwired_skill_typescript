# Prefer `satisfies` over `as`

**Title:**

- Prefer the `satisfies` operator over type assertions (`as`) to validate object shapes while preserving specific inferred types.

**ID:**

- TS-PREFER-SATISFIES-OVER-AS

**Scope:**

- `*.ts`

**Related:**

- TS-PREFER-UNKNOWN-OVER-ANY

**Rule:**

- ALWAYS prefer `satisfies` when you need to validate that a value matches a type/interface without losing the specific inferred type of the literal.
- ALWAYS avoid using `as SomeType` for object-literal validation, as it performs type casting rather than type checking.
- ALWAYS use `satisfies` to ensure better IDE autocomplete and more accurate property access for complex configuration objects.

**Reason:**

- Because `satisfies` performs a "downward" type check that catches errors if the object doesn't match the interface, whereas `as` tells the compiler to trust the developer, potentially masking missing or incorrect properties.
- Because `satisfies` preserves the literal types of keys and values, whereas `as` widens the type to the general interface, leading to a loss of specific type information for downstream code.
- Because it prevents "over-assertion" bugs where a developer might cast an object to a type it doesn't actually implement.

**Exceptions:**

- `as const` assertions for creating read-only literal types.
- `as unknown` (or double casting) when dealing with unsafe external API boundaries like `JSON.parse`.
- Manual narrowing with `as` when TypeScript cannot automatically infer a refined type after custom runtime validation logic.

**Enforcement:**

- MUST

**Category:**

- Reliability

## ❌ BAD

```typescript
// Using 'as' widens the type to Record<string, string>.
// TypeScript now thinks any string key is valid, losing 'home' and 'about' specificity.
const routes = {
	home: "/",
	about: "/about",
} as Record<string, string>;

// No error here, but this will be undefined at runtime.
console.log(routes.dashboard.toLowerCase());
```

## ✅ GOOD

```typescript
// Using 'satisfies' validates the shape against the record but keeps the specific keys.
const routes = {
	home: "/",
	about: "/about",
} satisfies Record<string, string>;

// IDE knows exactly which keys exist.
// TypeScript would throw a compile-time error if we tried to access 'dashboard'.
console.log(routes.home.toUpperCase());

// Example with complex types:
type Color = "red" | "green" | "blue" | [number, number, number];
const palette = {
	primary: "red",
	secondary: [0, 255, 0],
} satisfies Record<string, Color>;

// Specific methods for arrays are available because the type wasn't widened to a general union.
palette.secondary.map((value) => value.toFixed());
```
