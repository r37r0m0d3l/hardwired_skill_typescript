# Mandatory Control Flow Braces

**Title:**

- Enforce Explicit Braces for All Control Flow Statements

**ID:**

- TS-MANDATORY-BRACES

**Scope:**

- `*.ts`

**Related:**

- None.

**Rule:**

- ALWAYS wrap the body of control flow statements (`if`, `else`, `for`, `while`, `do`) in explicit curly braces,
  regardless of line count.
- ALWAYS place single-line block instructions on a new indented line within the braces.

**Reason:**

- Because omitting braces from single-line control structures introduces significant risks during later line additions or refactoring phases.
- Because clear structural boundaries dramatically improve code readability and prevent logic misinterpretations by downstream developer tools.

**Exceptions:**

- None.

**Enforcement:**

- MUST

**Category:**

- Style

## ❌ BAD

```typescript
// Omitting block braces leaves control flow implicit and vulnerable to refactoring bugs.
if (rel === "package.json") continue;

for (const item of list) process(item);
```

## ✅ GOOD

```typescript
// Explicit curly braces define strict, unambiguous execution boundaries.
if (rel === "package.json") {
	continue;
}

for (const item of list) {
	process(item);
}
```
