# Ban `Array.splice`

**Title:**

- Ban the mutable `Array.prototype.splice()` method in favor of the non-destructive `Array.prototype.toSpliced()` alternative to prevent unintended side effects from array mutation.

**ID:**

- TS-BAN-ARRAY-SPLICE

**Scope:**

- `*.ts`

**Related:**

- TS-BAN-ARRAY-REVERSE
- TS-BAN-ARRAY-SORT

**Rule:**

- ALWAYS avoid mutating shared arrays in-place with `Array.prototype.splice()`.
- PREFER the non-mutating `Array.prototype.toSpliced()` method when creating a modified shallow copy of an array after inserting, removing, or replacing elements.
- If `toSpliced()` is unavailable, clone first (e.g., `const copy = [...array]; copy.splice(...)`) so only the clone is mutated.

**Reason:**

- Because `Array.prototype.splice()` is a destructive method that mutates the array in-place, which frequently leads to hidden side effects, state bugs, and erratic behavior when the original array reference is shared across different parts of an application.
- Because `Array.prototype.toSpliced()` explicitly returns a brand new shallow copy containing the specified mutations, preserving the original array state intact and aligning with immutable programming paradigms.

**Exceptions:**

- High-performance algorithms operating inside tight loops on localized arrays where allocations are heavily restricted, memory footprint must be minimal, and the reference is completely isolated from downstream scope.

**Enforcement:**

- MUST

**Category:**

- Reliability

## ❌ BAD

```typescript
const array = ["apple", "cherry", "banana"];
console.log("array:", array);
// Expected output: "array:" Array ["apple", "cherry", "banana"]

// Violates the rule: splice is destructive and mutates the original array in-place
const removed = array.splice(1, 1, "blueberry");
console.log("removed:", removed);
// Expected output: "removed:" Array ["cherry"]

// The original array reference is now corrupted and mutated
console.log("array:", array);
// Expected output: "array:" Array ["apple", "blueberry", "banana"]
```

## ✅ GOOD

```typescript
const items = ["apple", "cherry", "banana"];
console.log(items); // ["apple", "cherry", "banana"]

// Follows the rule: returns a modified copy without altering the source reference
const splicedItems = items.toSpliced(1, 1, "blueberry");
console.log(splicedItems); // ["apple", "blueberry", "banana"]
console.log(items); // ["apple", "cherry", "banana"]
```
