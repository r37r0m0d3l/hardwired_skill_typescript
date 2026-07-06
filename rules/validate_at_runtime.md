# Validate External Data at Runtime

**Title:**

- Validate External Data at Runtime to Ensure Structural Integrity Beyond Compile-Time Type Boundaries.

**ID:**

- TS-VALIDATE-EXTERNAL-DATA

**Scope:**

- `*.ts`

**Related:**

- TS-PREFER-UNKNOWN-OVER-ANY
- TS-TYPE-PREDICATES

**Rule:**

- ALWAYS parse and validate dynamic payloads originating from external runtime resources (e.g., API responses, database inputs, file operations) using a parsing schema library like Zod.
- NEVER force structural typing assertions (`as T`) on unverified data payloads directly from I/O boundaries.

**Reason:**

- Because TypeScript does not carry its verification structures into compiled execution environments, leaving runtime operations completely blind to mismatched structural mutations.
- Because type safety completely ends at physical system integration boundaries unless explicitly validated through dynamic criteria.

**Exceptions:**

- None.

**Enforcement:**

- MAY

**Category:**

- Reliability

## ❌ BAD

```typescript
// Forcing a direct type assertion bypasses actual verification.
// If the API drops or modifies fields, your code will fail unexpectedly at runtime.
const user = (await response.json()) as User;
```

## ✅ GOOD

```typescript
// Uses an explicit runtime schema verification step to catch data anomalies.
import { z } from "zod";

const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
});

// Safely structuralizes the runtime response payload against the compiled schema
const user = UserSchema.parse(await response.json());
```
