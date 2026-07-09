# Ban `Array.reverse`

**Title:**

- Ban the mutable `Array.prototype.reverse()` method in favor of the non-destructive `Array.prototype.toReversed()` alternative to prevent unintended side effects from array mutation.

**ID:**

- TS-BAN-ARRAY-REVERSE

**Scope:**

- `*.ts`

**Related:**

- None.

**Rule:**

- ALWAYS avoid using the native `Array.prototype.reverse()` method on array instances.
- ALWAYS use the non-mutating `Array.prototype.toReversed()` method when creating a reversed shallow copy of an array.
- ALWAYS make an explicit copy first (e.g., using the spread operator `[...array].reverse()`) if working in a legacy execution environment where `toReversed()` is unavailable.

**Reason:**

- Because `Array.prototype.reverse()` is a destructive method that mutates the array in-place, which frequently leads to hidden side effects, state bugs, and erratic behavior when the original array reference is shared across different parts of an application.
- Because `Array.prototype.toReversed()` explicitly returns a brand new shallow copy containing the elements in reversed order, preserving the original array state intact and aligning with immutable programming paradigms.

**Exceptions:**

- High-performance algorithms operating inside tight loops on localized arrays where allocations are heavily restricted, memory footprint must be minimal, and the reference is completely isolated from downstream scope.

**Enforcement:**

- MUST

**Category:**

- Reliability

## ❌ BAD

```typescript
const array = ["one", "two", "three"];
console.log("array:", array);
// Expected output: "array:" Array ["one", "two", "three"]

// Violates the rule: reverse is destructive and mutates the original array in-place
const reversed = array.reverse();
console.log("reversed:", reversed);
// Expected output: "reversed:" Array ["three", "two", "one"]

// The original array reference is now corrupted and reversed
console.log("array:", array);
// Expected output: "array:" Array ["three", "two", "one"]
```

## ✅ GOOD

```typescript
const items = [1, 2, 3];
console.log(items); // [1, 2, 3]

// Follows the rule: returns a reversed copy without altering the source reference
const reversedItems = items.toReversed();
console.log(reversedItems); // [3, 2, 1]
console.log(items); // [1, 2, 3]
```
