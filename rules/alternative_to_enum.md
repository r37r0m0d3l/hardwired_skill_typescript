# Enum Alternative

**Title:**

- Avoid TypeScript `enum` in favor of const object literals and type mappings for native runtime execution, predictable serialization, and clean tree-shaking.

**ID:**

- TS-ENUM-ALTERNATIVE

**Scope:**

- `*.ts`

**Related:**

- TS-PREFER-SATISFIES-OVER-AS

**Rule:**

- NEVER use the TypeScript `enum` or `const enum` keywords.
- ALWAYS use plain JavaScript object literals paired with an `as const` assertion to declare fixed sets of constants.
- ALWAYS derive value union types using `(typeof ConstObject)[keyof typeof ConstObject]`.
- ALWAYS derive key union types using `keyof typeof ConstObject`.

**Reason:**

- **Erasable Syntax / Type Stripping Compatibility:** TypeScript `enum` generates runtime IIFEs (Immediately Invoked Function Expressions) that fail under native Node.js type-stripping (`--experimental-strip-types`, `--experimental-transform-types`), Deno, Bun, and the TC39 Stage 1 Type Annotations proposal.
- **Reverse Mapping Pollution:** Numeric `enum` definitions generate bidirectional mappings (`{ "1": "KEY", "KEY": 1 }`), polluting `Object.keys()`, `JSON.stringify()`, and iteration.
- **Serialization & Interop:** Const object literals are plain, standard JavaScript primitives that serialize deterministically across network boundaries, work seamlessly with third-party libraries, and tree-shake cleanly.

**Exceptions:**

- None.

**Enforcement:**

- MUST

**Category:**

- Architecture

---

## ❌ BAD

```typescript
// Uses non-standard TypeScript syntax that generates runtime IIFEs and breaks native type-stripping runtimes.
export enum NameEnum {
	KEY_ONE = 1,
	KEY_TWO = "TWO",
	KEY_THREE = "THREE",
}
// Numeric enum values generate reverse mappings ({ "1": "KEY_ONE", "KEY_ONE": 1 }).
// Object.keys(NameEnum) produces ["1", "KEY_ONE", "KEY_TWO", "KEY_THREE"], breaking iteration and serialization.
```

## ✅ GOOD

```typescript
// Uses standard JavaScript object literal with 'as const' compile-time immutability.
// Supports numeric, string, or mixed primitive values seamlessly.
export const NameEnum = {
	KEY_ONE: 1,
	KEY_TWO: "TWO",
	KEY_THREE: "THREE",
} as const;
// Derives value union type: 1 | "TWO" | "THREE"
export type NameType = (typeof NameEnum)[keyof typeof NameEnum];
// Derives key union type: "KEY_ONE" | "KEY_TWO" | "KEY_THREE"
export type NameKeyType = keyof typeof NameEnum;
// Standard JavaScript that works cleanly with native type-stripping and type checkers.
function processValue(value: NameType): void {
	console.log(value);
}
```
