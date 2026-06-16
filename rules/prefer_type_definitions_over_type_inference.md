# Prefer Type Definitions over Type Inference

**Title:**

- Prefer explicit type definitions over implicit type inference to ensure precise type locking and contract visibility.

**ID:**

- TS-PREFER-TYPE-DEFINITIONS

**Scope:**

- `*.ts`

**Related:**

- TS-CLASS-MODIFIERS

**Rule:**

- ALWAYS explicitly define the type of variable or constant upon declaration.
- NEVER rely on implicit TypeScript type inference for values, even when assigning simple primitives or literals.

**Reason:**

- Because explicit type definitions force developers to consciously choose the exact data contract (e.g., distinguishing between `number` and `bigint`), preventing accidental type assignment mistakes.
- Because declaring types explicitly serves as immediate, inline documentation that makes the architectural intentions transparent to code reviewers and other developers.
- Because it provides strict enforcement at the declaration site, ensuring that modifications to the assigned values must always strictly adhere to the defined type boundary.

**Exceptions:**

- Complex inline callbacks or temporary loop index counters (like `for (let i = 0; ...)`) where defining explicit types creates redundant boilerplate without adding safety.

**Enforcement:**

- MUST

**Category:**

- Style

## ❌ BAD

```typescript
// Relies on implicit type inference which leaves the type definition unstated (integer, float).
const counter = 0;
```

```typescript
// Shorthand primitive instantiation without clear type contract anchoring. String may contain not a number but column names or translation text.
const counterName = "Zähler";
```

## ✅ GOOD

```typescript
// Explicitly enforces a number type requirement upon declaration. Floating point numbers are allowed.
const counter: number = 0;
```

```typescript
// Explicitly enforces a precise bigint type requirement upon declaration. Integer type and huge numbers intended.
const counter: bigint = 0n;
```

```typescript
// Clearly locks the contract to a string type representation self-explaining the intent.
const counter: string = "Zähler";
```
