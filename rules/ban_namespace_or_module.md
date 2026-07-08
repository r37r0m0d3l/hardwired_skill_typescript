# No `namespace` or `module` Keywords

**Title:**

- Never use the `namespace` or `module` keywords - use ES module `import`/`export` instead.

**ID:**

- TS-NO-NAMESPACE

**Scope:**

- `*.ts`

**Related:**

- TS-IMPORT-NATIVE-MODULES

**Rule:**

- NEVER declare a TypeScript `namespace` or `module` block to organise code.
- ALWAYS use ES module syntax (`import` / `export`) to encapsulate and share code between files.
- NEVER use triple-slash reference directives (`/// <reference path="..." />`) in application source code.

**Reason:**

- Because `namespace` and `module` are legacy TypeScript constructs predating the ES module standard. Modern toolchains (Node.js, Bundlers, Deno) natively support ES modules.
- Because namespaces create non-standard runtime artefacts (IIFEs), obscure dependency graphs, and prevent tree-shaking by bundlers.
- Because mixing ES modules with namespaces in the same project causes confusing scoping rules and makes refactoring harder.
- Because ES modules are the JavaScript standard and are better understood by all modern tools, editors, and AI assistants.

**Exceptions:**

- Augmenting third-party library declarations in `.d.ts` ambient declaration files where the library itself uses namespaces.
- Global ambient declarations (`declare global { ... }`) in `.d.ts` files when extending the global scope is unavoidable (e.g., browser globals).

**Enforcement:**

- MUST

**Category:**

- Consistency

## ❌ BAD

```typescript
// Legacy namespace organising related utilities.
namespace StringUtils {
	export function capitalize(value: string): string {
		return value.charAt(0).toUpperCase() + value.slice(1);
	}

	export function truncate(value: string, limit: number): string {
		return value.length > limit ? `${value.slice(0, limit)}…` : value;
	}
}

// Usage requires fully-qualified name - no import statement.
const result = StringUtils.capitalize("hello");
```

## ✅ GOOD

```typescript
// string-utils.ts - plain ES module exports.
export function capitalize(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

export function truncate(value: string, limit: number): string {
	return value.length > limit ? `${value.slice(0, limit)}…` : value;
}
```

```typescript
// consumer.ts - standard ES module import.
import { capitalize, truncate } from "./string-utils.js";

const result = capitalize("hello");
const short = truncate("a very long sentence", 10);
```
