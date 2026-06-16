# TS Config

**Title:**

- Strict Configuration for TypeScript 7.0+

**ID:**

- TS-CONFIG

**Scope:**

- `tsconfig.json`

**Related:**

- None.

**Rule:**

- ALWAYS enable `strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes` in `tsconfig.json`.
- ALWAYS prefer `moduleResolution: "bundler"` or `"nodenext"` as legacy `node` resolution is removed in TS 7.0.

**Reason:**

- Because `strict: true` is now the default behavior in TypeScript 7.0 and higher to ensure baseline type safety.
- Because `noUncheckedIndexedAccess` prevents runtime crashes by treating array access as potentially `undefined`.
- Because `exactOptionalPropertyTypes` ensures object shapes strictly match their definitions, preventing ambiguous `undefined` keys.
- Many of these safety flags are enabled by default, but explicitly defining them ensures consistency across different developer environments and CI pipelines.

**Exceptions:**

- Legacy projects undergoing incremental migration.

**Enforcement:**

- MUST

**Category:**

- Reliability

```json
{
	"compilerOptions": {
		"exactOptionalPropertyTypes": true,
		"moduleResolution": "bundler",
		"noUncheckedIndexedAccess": true,
		"strict": true,
		"target": "es2022"
	}
}
```
