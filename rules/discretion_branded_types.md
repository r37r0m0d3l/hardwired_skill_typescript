# Branded / Nominal Types

**Title:**

- Use branded types to distinguish semantically different primitives that share the same structural type.

**ID:**

- TS-BRANDED-TYPES

**Scope:**

- `*.ts`

**Related:**

- TS-PREFER-TYPE-DEFINITIONS
- TS-AVOID-LOOSE-TYPES

**Rule:**

- ALWAYS create a branded type for domain-specific primitive values (IDs, tokens, currencies, units) that must not be interchangeable at the type level.
- ALWAYS expose a constructor / factory function or Zod schema that validates and brands the raw value, keeping the brand creation centralised.
- NEVER use plain `string` or `number` for values that carry domain identity (e.g., `UserId`, `OrderId`, `Email`, `Milliseconds`).
- NEVER cast an unvalidated value directly to a branded type — always go through the factory/validator.

**Reason:**

- Because TypeScript uses structural typing, meaning `type UserId = string` and `type OrderId = string` are identical to the compiler and can be passed interchangeably without error.
- Because a branding intersection (`string & { readonly _brand: "UserId" }`) makes the two types structurally incompatible, turning accidental swaps into compile-time errors.
- Because catching ID confusion (e.g., passing an `OrderId` where a `UserId` is expected) at compile time is vastly cheaper than debugging production data corruption.

**Exceptions:**

- Purely internal, short-lived variables within a single function scope where the semantic distinction is obvious and a brand would add noise without safety benefit.
- Performance-critical hot paths in algorithms where the brand intersection would be stripped anyway at runtime but the overhead of a factory call matters.

**Enforcement:**

- SHOULD

**Category:**

- Reliability

## ❌ BAD

```typescript
// Both are plain strings — the compiler cannot distinguish them.
type UserId = string;
type OrderId = string;

function getOrdersForUser(userId: UserId, orderId: OrderId): void {
	// No compile error if arguments are swapped at the call site.
}

// Accidentally swapped — TypeScript is silent.
const uid = "user-123";
const oid = "order-456";
getOrdersForUser(oid, uid); // ← wrong order, no error
```

## ✅ GOOD

```typescript
// Branded type — structurally incompatible with other string brands.
type UserId = string & {readonly _brand: "UserId"};
type OrderId = string & {readonly _brand: "OrderId"};

// Factory functions centralise validation and branding.
function toUserId(raw: string): UserId {
	if (!raw.startsWith("user-")) {
		throw new Error(`Invalid UserId: "${raw}"`);
	}
	return raw as UserId;
}

function toOrderId(raw: string): OrderId {
	if (!raw.startsWith("order-")) {
		throw new Error(`Invalid OrderId: "${raw}"`);
	}
	return raw as OrderId;
}

function getOrdersForUser(userId: UserId, orderId: OrderId): void {
	// Implementation.
}

const uid = toUserId("user-123");
const oid = toOrderId("order-456");

getOrdersForUser(uid, oid); // ✅ correct
// getOrdersForUser(oid, uid); // ✅ compile error — types are incompatible
```
