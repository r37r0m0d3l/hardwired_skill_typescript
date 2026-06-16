# Import of native modules

**Title:**

- Enforce the use of the `node:` protocol prefix when importing built-in Node.js native modules.

**ID:**

- TS-IMPORT-NATIVE-MODULES

**Scope:**

- `*.ts`

**Related:**

- None.

**Rule:**

- ALWAYS use the `node:` prefix for imports of native Node.js modules.
- NEVER omit the protocol prefix when importing core Node.js built-ins.

**Reason:**

- Because the `node:` prefix makes it instantly clear that the module is a built-in Node.js core library, improving code readability and intent.
- Because it eliminates the risk of malicious dependency confusion attacks or naming conflicts with third-party community packages published on npm with the same name.
- Because prefixing aligns with modern Node.js standards, optimizing module resolution speeds by allowing the runtime to bypass checking `node_modules` entirely.

**Exceptions:**

- None.

**Enforcement:**

- MUST

**Category:**

- Maintainability

## ❌ BAD

```typescript
// Imports native modules without the protocol prefix, risking dependency conflict or confusion
import test from "test";
import assert from "assert";
import fs from "fs";
```

## ✅ GOOD

```typescript
// Clearly distinguishes built-in Node.js APIs using the standard node: protocol
import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
```
