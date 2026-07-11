# Typed Catch Error Handling

**Title:**

- Force the use of explicit `unknown` typing for error arguments in Promise `.catch()` callbacks and rejection handlers to prevent type unsafety.

**ID:**

- TS-TYPED-CATCH-ERROR-HANDLING

**Scope:**

- `*.ts`

**Related:**

- TS-FORCE-IS-ERROR

**Rule:**

- ALWAYS explicitly type the error parameter in Promise `.catch()` callbacks as `unknown`.
- ALWAYS explicitly type the rejection parameter in the second argument of Promise `.then(onFulfilled, onRejected)` as `unknown`.
- NEVER omit the type annotation or use permissive types like `any` or specific classes like `Error` for catch callback parameters.

**Reason:**

- Because JavaScript allows throwing any primitive value or object reference, meaning the runtime type of unhandled rejection or caught error is fundamentally unpredictable at compile time.
- Because omitting the type or using `any` disables type safety, while declaring a specific structural type like `Error` creates a false sense of security that breaks if cross-realm or primitive exceptions bypass runtime expectations.

**Exceptions:**

- None.

**Enforcement:**

- MUST

**Category:**

- Reliability

## ❌ BAD

```typescript
// Violates the rule by omitting the type annotation, implicitly falling back to any or contextual unsafety
Promise.reject(new Error("I will reject!")).catch((err) => {
	console.log(err);
});

// Violates the rule by explicitly spreading type unsafety into the handler via any
Promise.reject(new Error("I will reject!")).catch((err: any) => {
	console.log(err);
});

// Violates the rule by assuming the type is an Error without enforcing narrowing
Promise.reject(new Error("I will reject!")).catch((err: Error) => {
	console.log(err);
});

// Violates the rule by leaving the rejection parameter untyped in a split .then handler
Promise.reject(new Error("I will reject!")).then(
	(result) => {
		console.log(result);
	},
	(err) => {
		console.log(err);
	},
);
```

## ✅ GOOD

```typescript
// Follows the rule by explicitly typing the caught exception parameter as unknown
Promise.reject(new Error("I will reject!")).catch((err: unknown) => {
	console.log(err);
});
```
