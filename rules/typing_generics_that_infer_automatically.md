# Generics That Infer Automatically

**Title:**

- Use Generics That Infer Automatically to Design Intuitive APIs and Scale Typing Patterns.

**ID:**

- TS-GENERICS-AUTOMATIC-INFERENCE

**Scope:**

- `*.ts`

**Related:**

- TS-PREFER-TYPE-DEFINITIONS
- TS-VALIDATE-EXTERNAL-DATA

**Rule:**

- ALWAYS design functions and generic APIs to infer type arguments automatically from runtime arguments like schema
  definitions or input payloads.
- NEVER force consumer code to supply manual generic type parameters if the compiler can narrow the contract through
  runtime signatures.

**Reason:**

- Because automated inference scales dramatically better over complex architectures than annotation-heavy APIs that introduce manual typing debt.
- Because building APIs around value-driven inference provides a cleaner, more fluid developer experience while preserving structural type safety.

**Exceptions:**

- Low-level utility abstractions, data mapping layers, or mock primitives where no physical runtime argument exists to trigger type deduction.

**Enforcement:**

- SHOULD

**Category:**

- Developer Experience

## ❌ BAD

```typescript
// Forcing the developer to pass explicit generic parameters creates manual overhead and makes refactoring brittle.
const user = getData<User>();
```

## ✅ GOOD

```typescript
// The API automatically infers the return type structure straight from the schema parameter.
const user = getData(userSchema);
```
