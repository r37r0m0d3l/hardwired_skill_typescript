# Template Literal Types

**Title:**

- Use template literal types for string-based type manipulation instead of wide `string` types or manual union maintenance.

**ID:**

- TS-TEMPLATE-LITERAL-TYPES

**Scope:**

- `*.ts`

**Related:**

- TS-TYPING-FROM-CONSTANTS
- TS-INTERFACE-VS-TYPE

**Rule:**

- ALWAYS use template literal types to derive string union types from existing unions rather than writing them manually.
- ALWAYS prefer template literal types over plain `string` when a function parameter or return value must conform to a specific string pattern.
- ALWAYS combine template literal types with built-in string manipulation types (`Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`) when casing transformations are part of the type contract.
- NEVER duplicate string union members manually when they can be computed from a source-of-truth union via a template literal type.

**Reason:**

- Because a manually maintained string union (e.g., `"onFoo" | "onBar" | "onBaz"`) drifts out of sync when the source union changes, silently accepting stale values.
- Because template literal types derive their members from a single source of truth, making additions or removals to the base union automatically propagate to all derived types.
- Because template literal types give the compiler enough information to catch typos and incorrect string constructions that a plain `string` type would silently accept.

**Exceptions:**

- When the resulting union would be excessively large (e.g., a cartesian product of two large unions), and the compiler performance cost outweighs the safety benefit.
- Simple one-off string parameters where the valid values are not derived from an existing type and a plain `string` is genuinely correct.

**Enforcement:**

- SHOULD

**Category:**

- Expressiveness

## ❌ BAD

```typescript
// Manually listed - drifts out of sync when the base union changes.
type EventName = "onClick" | "onFocus" | "onBlur";

// Adding a new action requires updating both unions separately.
type Action = "create" | "read" | "update" | "delete";
type ActionPath = "/create" | "/read" | "/update" | "/delete"; // duplicated maintenance
```

## ✅ GOOD

```typescript
// Template literal type - automatically stays in sync with the base union.
type BaseEvent = "click" | "focus" | "blur";
type EventName = `on${Capitalize<BaseEvent>}`; // "onClick" | "onFocus" | "onBlur"

// Single source of truth: adding an action propagates to all derived types.
type Action = "create" | "read" | "update" | "delete";
type ActionPath = `/${Action}`; // "/create" | "/read" | "/update" | "/delete"

// Combined with utility types for CSS-class-like patterns.
type Side = "top" | "right" | "bottom" | "left";
type SpacingClass = `m${Capitalize<Side>}-${number}`; // e.g. "mTop-4"

// Ensures event handler names are always correctly prefixed.
function addEventListener<T extends BaseEvent>(event: T, handler: (e: Event) => void): void {
	const key: `on${Capitalize<T>}` = `on${event.charAt(0).toUpperCase()}${event.slice(1)}` as `on${Capitalize<T>}`;
	console.log(`Registering ${key}`);
}
```
