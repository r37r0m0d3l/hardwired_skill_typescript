# Derive Types From Values Instead of Duplicating Them

**Title:**

- Derive compile-time union types directly from runtime literal configurations instead of duplicating value definitions manually.

**ID:**

- TS-DERIVE-TYPES-FROM-VALUES

**Scope:**

- `*.ts`

**Related:**

- TS-ENUM-ALTERNATIVE

**Rule:**

- ALWAYS combine array literals with an `as const` assertion to freeze values as read-only tuple types when they
  represent fixed domain options.[cite: 16]
- ALWAYS use index access types paired with the `typeof` operator (`typeof values[number]`) to extract compile-time
  unions dynamically from runtime values.[cite: 16]
- NEVER manually maintain an independent string or number type union that mirrors a separate data collection
  declaration.

**Reason:**

- Because deriving types from data structures forms a fundamental TypeScript mindset shift that establishes a clean,
  unified single source of truth across code layers.[cite: 16]
- Because it entirely eliminates silent synchronization failures and maintenance overhead when your runtime data arrays
  expand or change over time.
- Because it enables complete type safety for matching, iterating, and validating collections while keeping
  configurations compact and explicit.

**Exceptions:**

- None.

**Enforcement:**

- MUST

**Category:**

- Maintainability

## ❌ BAD

```typescript
// Separating the type definition from the array values introduces data duplication.
type Role = "admin" | "user" | "guest";

// If a new role is added or renamed here, the developer must manually keep the type union above in sync.
const roles: Array<Role> = ["admin", "user", "guest"];
```

## ✅ GOOD

```typescript
// Locks down runtime data configurations as an immutable literal tuple definition.[cite: 16]
const roles = ["admin", "user", "guest"] as const;

// Automatically extracts a perfectly synchronized string literal union type from the frozen array values.[cite: 16]
type Role = (typeof roles)[number];
```
