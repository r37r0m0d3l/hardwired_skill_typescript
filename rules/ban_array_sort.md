# Ban `Array.sort`

**Title:**

- Ban the mutable `Array.prototype.sort()` method in favor of the non-destructive `Array.prototype.toSorted()` alternative to prevent unintended side effects from array mutation.

**ID:**

- TS-BAN-ARRAY-SORT

**Scope:**

- `*.ts`

**Related:**

- TS-BAN-ARRAY-REVERSE

**Rule:**

- ALWAYS avoid using the native `Array.prototype.sort()` method on array instances.
- ALWAYS use the non-mutating `Array.prototype.toSorted()` method when creating a sorted shallow copy of an array.
- ALWAYS make an explicit copy first (e.g., using the spread operator `[...array].sort()`) if working in a legacy execution environment where `toSorted()` is unavailable.

**Reason:**

- Because `Array.prototype.sort()` is a destructive method that mutates the array in-place, which frequently leads to hidden side effects, state bugs, and erratic behavior when the original array reference is shared across different parts of an application.
- Because `Array.prototype.toSorted()` explicitly returns a brand new shallow copy containing the elements in sorted order, preserving the original array state intact and aligning with immutable programming paradigms.

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

// Violates the rule: sort is destructive and mutates the original array in-place
const sorted = array.sort();
console.log("sorted:", sorted);
// Expected output: "sorted:" Array ["apple", "banana", "cherry"]

// The original array reference is now corrupted and reordered
console.log("array:", array);
// Expected output: "array:" Array ["apple", "banana", "cherry"]
```

## ✅ GOOD

```typescript
const items = ["apple", "cherry", "banana"];
console.log(items); // ["apple", "cherry", "banana"]

// Follows the rule: returns a sorted copy without altering the source reference
const sortedItems = items.toSorted();
console.log(sortedItems); // ["apple", "banana", "cherry"]
console.log(items); // ["apple", "cherry", "banana"]
```
