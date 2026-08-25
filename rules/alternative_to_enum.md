# Enum Alternative (Smart Enum)

**Title:**

- Avoid TypeScript `enum` in favor of Smart Const Object Enums with type mappings and non-enumerable `toString` methods for clean runtime execution, safe `JSON.stringify` logging, and type safety.

**ID:**

- TS-ENUM-ALTERNATIVE

**Scope:**

- `*.ts`

**Related:**

- TS-PREFER-SATISFIES-OVER-AS

**Rule:**

- NEVER use the TypeScript `enum` or `const enum` keywords.
- ALWAYS define fixed sets of constants using plain JavaScript object literals with an `as const` assertion.
- ALWAYS augment the const object with a non-enumerable, non-writable, non-configurable `toString()` method returning `JSON.stringify(this)` via `Object.defineProperty()`.
- ALWAYS freeze the resulting object using `Object.freeze()`.
- ALWAYS derive key union types using `keyof typeof ConstObject`.
- ALWAYS derive value union types using `(typeof ConstObject)[KeyType]`.

**Reason:**

- **Erasable Syntax / Type Stripping Compatibility:** TypeScript `enum` generates runtime IIFEs that fail under native Node.js type-stripping (`--experimental-strip-types`, `--experimental-transform-types`), Deno, Bun, and the TC39 Stage 1 Type Annotations proposal.
- **Reverse Mapping Pollution:** Numeric TypeScript `enum` definitions generate bidirectional mappings (`{ "1": "KEY", "KEY": 1 }`), polluting `Object.keys()`, iteration, and JSON serialization.
- **Smart JSON/String Serialization:** Defining a non-enumerable `toString()` method ensures seamless string conversion and deterministic logging (`JSON.stringify`) without polluting `Object.keys()` or iteration loops.
- **Runtime Immutability:** Combining `as const`, `Object.defineProperty()`, and `Object.freeze()` guarantees strict immutability both at compile-time and runtime.

**Exceptions:**

- None.

**Enforcement:**

- MAY

**Category:**

- Architecture

---

## ❌ BAD

```typescript
// Uses non-standard TypeScript syntax that generates runtime IIFEs and breaks native type-stripping runtimes.
export enum DirectionEnum {
	Down = "⬇️",
	Left = "⬅️",
	Right = "➡️",
	Up = "⬆️",
}
// Numeric enums pollute reverse mappings ({ "1": "KEY_ONE", "KEY_ONE": 1 }), breaking Object.keys() and standard JSON serialization.
```

## ✅ GOOD

```typescript
// Uses standard JavaScript object literal with 'as const' compile-time immutability.
// Supports numeric, string, or mixed primitive values seamlessly.
const Direction = {
	Down: "⬇️",
	Left: "⬅️",
	Right: "➡️",
	Up: "⬆️",
} as const;
// Defines a non-enumerable `toString` method to prevent `Object.keys()` pollution while enabling JSON stringification.
export const DirectionEnum = Object.defineProperty(Direction, "toString", {
	configurable: false,
	enumerable: false,
	value() {
		return JSON.stringify(this);
	},
	writable: false,
});
Object.freeze(DirectionEnum); // Prevents runtime mutation of the lookup object.
// Derives key union type: 'Down' | 'Left' | 'Right' | 'Up'
export type DirectionEnumKeyType = keyof typeof Direction;
// Derives value union type: '⬇️' | '⬅️' | '➡️' | '⬆️'
export type DirectionEnumValueType = (typeof Direction)[DirectionEnumKeyType];
```
