## Use `as const` for Configuration and Constants

**Title:**

- Use `as const` assertions to lock literal types and prevent widening of configuration and constant values.

**ID:**

- TS-USE-AS-CONST

**Scope:**

- `*.ts`

**Related:**

- TS-ENUM-ALTERNATIVE
- TS-READONLY-WHERE-POSSIBLE

**Rule:**

- ALWAYS apply `as const` to configuration objects, fixed data arrays, and constant definitions.
- ALWAYS use `as const` when specific literal values are required for downstream type safety.

**Reason:**

- Because without `as const`, TypeScript widens literal types to their general primitives (e.g., 'dark' becomes string), which weakens type checking.
- Because it effectively turns an object or array into a read-only, deeply immutable structure at the type level.
- Because it allows other TypeScript features, like discriminated unions or specialized utility types, to operate on exact values rather than generic types.

**Exceptions:**

- Objects or arrays that intentionally require runtime mutation.

**Enforcement:**

- MUST

**Category:**

- Reliability

## ❌ BAD

```typescript
// Without 'as const', the 'mode' property is widened to a general string.
// This allows any string to be assigned later, losing the strict 'dark' requirement.
const theme = {
	mode: "dark",
};

// This is permitted by the compiler but might break application logic.
theme.mode = "light-blue";
```

## ✅ GOOD

```typescript
// Applying 'as const' locks the 'mode' property to the literal type 'dark'.
// It also makes the entire object deeply read-only.
const theme = {
	mode: "dark",
} as const;

// The compiler now correctly identifies this as a read-only literal.
// theme.mode = "light"; // Error: Cannot assign to 'mode' because it is a read-only property.
```
