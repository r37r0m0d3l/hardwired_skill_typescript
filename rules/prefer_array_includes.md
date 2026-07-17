# Prefer Array includes

**Title:**

- Prefer the `Array.prototype.includes()` method over `Array.prototype.indexOf()` for element existence checks to improve readability and handle `NaN` correctly.

**ID:**

- TS-PREFER-ARRAY-INCLUDES

**Scope:**

- `*.ts`

**Related:**

- None.

**Rule:**

- ALWAYS use `.includes()` when checking if an array contains a specific primitive value.
- ALWAYS avoid checking `indexOf() >= 0` or `indexOf() !== -1` for membership testing unless targeting an environment that strictly lacks ES2016 support.
- ALWAYS use `.includes()` when working with arrays that could contain `NaN`, as `indexOf` cannot locate `NaN`.

**Reason:**

- Because `.includes()` returns a direct boolean, eliminating redundant comparison operators (`>= 0` or `!== -1`) and ternary expressions, which makes the intent clearer at a glance.
- Because `.includes()` uses the SameValueZero algorithm under the hood, allowing it to correctly detect the presence of `NaN` elements, whereas `indexOf()` uses Strict Equality Comparison (`===`) and will always return `-1` for `NaN`.

**Exceptions:**

- When finding the specific numerical index of an item rather than checking for its existence.
- Legacy project configurations explicitly restricted to ES5 compilation targets where polyfills are strictly banned.

**Enforcement:**

- MUST

**Category:**

- Reliability

## ❌ BAD

```typescript
const items = ["a", "b", "c", NaN];

// Redundant ternary and comparison operators
const hasA = items.indexOf("a") >= 0 ? true : false;

// Bug: indexOf uses strict equality (===), meaning NaN === NaN evaluates to false
const hasNaN = items.indexOf(NaN) >= 0 ? true : false; // evaluates to false
```

## ✅ GOOD

```typescript
const items = ["a", "b", "c", NaN];

// Direct, semantic boolean evaluation
const hasA = items.includes("a"); // true

// Correctly handles tracking and matching NaN values
const hasNaN = items.includes(NaN); // true
```
