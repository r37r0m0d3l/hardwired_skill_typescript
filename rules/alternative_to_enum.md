# Enum Alternative

**Title:**

- Avoid TypeScript `enum` in favor of const object literals and type mappings for proper serialization and runtime behavior.

**ID:**

- TS-ENUM-ALTERNATIVE

**Scope:**

- `*.ts`

**Related:**

- TS-PREFER-SATISFIES-OVER-AS

**Rule:**

- NEVER use the TypeScript `enum` keyword to define enumerable constants.
- ALWAYS use a standard JavaScript object literal paired with an `as const` assertion to declare fixed sets of constants.
- ALWAYS derive the matching type from the const object literal using `keyof typeof` expressions when a type representation is needed.

**Reason:**

- Because standard TypeScript `enum` definitions do not align with modern JavaScript design patterns, as they generate custom, verbose IIFE (Immediately Invoked Function Expression) structures at runtime rather than basic primitives.
- Because `enum` structures are not cleanly serializable or transportable over network boundaries without additional structural mapping.
- Because `enum` structures are rigid and cannot be natively extended or combined with other type definitions across module boundaries.

**Exceptions:**

- None.

**Enforcement:**

- MUST

**Category:**

- Architecture

## ❌ BAD

```typescript
// Uses the non-standard TypeScript enum keyword which creates a bloated runtime object.
enum NameEnum {
	KEY_ONE = 1,
	KEY_TWO = "TWO",
}
// Introspecting keys and values at runtime or trying to serialize this can lead to unexpected behavior.
```

## ✅ GOOD

```typescript
// Uses a plain JavaScript object wrapped in an 'as const' assertion.
// This compiles down to a simple, predictable, and highly optimizable object literal.
const NameEnum = {
	KEY_ONE: 1,
	KEY_TWO: "TWO",
} as const;
// Derives a completely strict union type directly from the object values.
// NameType translates exactly to: 1 | "TWO"
type NameType = (typeof NameEnum)[keyof typeof NameEnum];
// This is fully serializable, standard JavaScript that plays perfectly with type checking.
function processValue(value: NameType) {
	console.log(value);
}
```
