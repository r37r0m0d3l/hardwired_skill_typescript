# Self-Explanatory Variable Names with Explicit Typing

**Title:**

- Use descriptive naming and explicit typing over short ambiguous variable identifiers.

**ID:**

- TS-EXPLICIT-NAMING-AND-TYPING

**Scope:**

- `*.ts`

**Related:**

- TS-PREFER-UNKNOWN-OVER-ANY

**Rule:**

- ALWAYS use complete, descriptive noun-based words for variable and parameter names instead of single letters or vague
  acronyms.
- ALWAYS append explicit type definitions to block variables, catches, and function definitions where types are not
  inherently inferable by the compiler.

**Reason:**

- Because cryptic abbreviations force engineers to parse surrounding context to guess whether an identifier means an
  error, an event, an element, or an entity.
- Because combining clear naming conventions with explicit type declarations eliminates upstream type inference leakage
  and prevents common runtime crashes.

**Exceptions:**

- Framework-required interfaces.

**Enforcement:**

- MUST

**Category:**

- Maintainability

## ❌ BAD

```typescript
// Single letter catch and untyped callback parameters hide semantic meaning and underlying data contracts.
try {
	// logic code here
} catch (err) {
	console.error(err);
}

function handleInput(e) {
	// Is 'e' an event, an element, or an error payload?
	console.log(e);
}
```

## ✅ GOOD

```typescript
// Explicit variable names state code intentions clearly, backed by protective types.
try {
	// logic code here
} catch (error: unknown) {
	console.error(error);
}

function handleInput(event: Event): void {
	// Clear naming leaving zero room for interpretation
	console.log(event);
}
```
