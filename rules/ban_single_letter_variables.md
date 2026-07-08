# Avoid Single-Letter Variable Names

**Title:**

- Avoid single-letter variable names - use descriptive, self-explanatory names that convey intent and context.

**ID:**

- TS-BAN-SINGLE-LETTER-VARIABLES

**Scope:**

- `*.ts`, `*.js`, `*.tsx`, `*.jsx`

**Related:**

- TS-USE-EXPLICIT-NAMING-AND-TYPING

**Rule:**

- NEVER declare variables, function parameters, loop indices, or catch block bindings using a single letter (e.g., `e`, `i`, `v`, `x`).
- ALWAYS use explicit, meaningful nouns or short descriptive phrases that represent what the value holds.
- ALWAYS maintain a minimum variable name length of two characters, prioritizing clear readability over brevity.

**Reason:**

- **Destroys Readability:** Single letters provide zero context about the data type or domain semantics, forcing developers to continuously scan back up the scope chain to see where it was declared.
- **Hinders Debugging & Diagnostics:** Single-letter variables are notoriously difficult to track inside terminal trace outputs, debugger variable watches, and print statements.
- **Impossible to Search in Logs:** Searching log pipelines or source code strings for isolated characters like `i`, `v`, or `t` yields massive lists of noise, rendering global search-and-replace or regex tracing useless.
- **Reduces AI Prompt Effectiveness:** LLM agents and code completion layers lose standard contextual anchors when working with anonymous scopes, leading to inferior architectural completions or variable hallucinations.

**Detailed Mappings & Semantic Clashes:**

- **`m` (`match` / `module` / `message` / `metric`):** In text processing, regular expressions, or routing code, `m` is constantly overloaded. A developer reading a trace line like `if (!m) return;` cannot tell if the code is validating a RegExp match results array, a dynamically imported module wrapper, or an incoming message socket buffer payload.
   - _Preferred strict alternatives:_ `matchResult`, `loadedModule`, `payloadMsg`, `performanceMetric`.
- **`u` (`user` / `url` / `uuid` / `utility`):** In backend pipelines, authorization logic frequently mixes current user identities, resource ownership checks, and API routes. Representing a user actor object as `u` turns complex access rules into a confusing puzzle (e.g., `if (u.id === o.uid)`).
   - _Preferred strict alternatives:_ `activeUser`, `targetUser`, `requestUrl`, `itemUuid`.
- **`e` (`error` / `event` / `element` / `entity`):** This is the most volatile single letter in JavaScript ecosystems. It is frequently reused across adjacent nested blocks: a DOM click `event` callback contains an array loop mapping an HTML `element`, wrapping a database save block for a domain `entity`, caught inside a `try/catch` processing an execution `error`. Nesting multiple `e` blocks shadows variables, breaks runtime tracing, and makes telemetry tracing impossible.
   - _Preferred strict alternatives:_ `catchError`, `domEvent`, `targetElement`, `dbEntity`.
- **`a`, `b` (Array sort tracking):** The boilerplate signature `(a, b) => a - b` introduces structural ambiguity once arrays scale beyond plain numbers to complex nested object comparisons.
   - _Preferred strict alternatives:_ `alphaItem`, `betaItem`, `alphaProduct`, `betaProduct`. Using descriptive, contextual prefixes (or explicit terms like `alpha` and `beta` based on Greek comparative roots) retains abstraction while guaranteeing clean global text search paths.

**Exceptions:**

- Mathematical, geometric, or generic statistical formulas where single-character symbols match an immutable industry standard (e.g., coordinates `x`, `y`, `z` or matrix dimensions `m`, `n`).
- Standard TypeScript Generic constraints where the compiler conventionally expects a single capital letter (e.g., `<T>`, `<K, V>`, `<R>`).

**Enforcement:**

- MUST

**Category:**

- Maintainability

## ❌ BAD

```typescript
// Overloaded, ambiguous single letters that break global text searching and log tracing
function calculate(d: string, u: User) {
	try {
		const r = JSON.parse(d);
		for (let i = 0; i < r.length; i++) {
			const v = r[i];
			save(v, u.id);
		}
	} catch (e) {
		logger.error(`Failed at iteration ${e}`); // "Failed at iteration [object Object]" - impossible to diagnose
	}
}

// Ambiguous sorting block with zero structural clarity
products.sort((a, b) => b.p - a.p);
```

## ✅ GOOD

```typescript
// Explicit descriptive naming guarantees clean global string searching and obvious log tracing
function ingestPayload(rawJsonPayload: string, activeUser: User): void {
	try {
		const parsedRecords = JSON.parse(rawJsonPayload);

		for (let recordIndex = 0; recordIndex < parsedRecords.length; recordIndex++) {
			const currentRecord = parsedRecords[recordIndex];
			saveRecord(currentRecord, activeUser.id);
		}
	} catch (parsingError) {
		logger.error({ error: parsingError }, `Failed to execute record ingestion step`);
	}
}

// Explicit comparative anchors make sorting field directions clear and maintainable
products.sort((alphaProduct, betaProduct) => {
	return betaProduct.priceUSD - alphaProduct.priceUSD;
});
```
