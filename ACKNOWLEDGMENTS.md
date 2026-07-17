# 📖 Documentation and Principles

This package enforces a strict, opinionated set of TypeScript rules. The single source of truth for these rules is [`principles.md`](./principles.md).

> ⚠️ **Important:** If you need to modify or override any rules, **always edit `principles.md` first**. Then, rerun the
> installer or manually update `AGENTS.md`, `CURSOR.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, and `rulebook.yaml` to sync your changes.
> If a rule conflicts with explicit project requirements, your project requirements take precedence.

## 🛠️ Core Rules Reference

Below is the categorized list of the TypeScript conventions injected by this skill:

### 🔒 Strict Type Safety and Banning Loose Types

- **[Avoid Loose Types](./rules/ban_loose_types.md):** Rejects broad types like `Function`, `object`, and `{}`.
- **[Avoid Non-Null Assertion](./rules/ban_non_null_assertion.md):** Bans the use of the `!` operator.
- **[Force using `Error.isError`](./rules/force_is_error.md):** Encourages the use of `Error.isError()` utility check over the standard `instanceof Error` operator to reliably detect cross-realm error exceptions.
- **[Prefer `unknown` over `any`](./rules/prefer_unknown_over_any.md):** Forces safer type narrowing workflows.
- **[Validate External Data at Runtime](./rules/validate_at_runtime.md):** Ensures boundaries are secure from unvalidated data.

### 📐 Code Architecture and Modeling

- **[Branded / Nominal Types](./rules/discretion_branded_types.md):** Implements opaque type patterns to prevent accidental mixing of primitive types (e.g., UserId vs OrderId).
- **[Discriminated Unions](./rules/prefer_discriminated_unions.md):** Encourages clear, safe object variants.
- **[Enum Alternative](./rules/alternative_to_enum.md):** Uses safer modern structures over native TypeScript enums.
- **[No `namespace` or `module`](./rules/ban_namespace_or_module.md):** Bans legacy modules in favor of standard ES imports.
- **[Prefer Composing Types](./rules/prefer_composing_types_over_duplicating_object_shapes.md):** Avoids duplicating object shapes across the codebase.
- **[`interface` vs `type`](./rules/discretion_interface_vs_type.md):** Strict criteria for when to use an interface versus a type alias.

### 👁️ Formatting, Readability, and Clarity

- **[Array Typing](./rules/typing_array.md) & [Async / Promise Typing](./rules/typing_async.md):** Consistent syntax for collections and asynchronous flows.
- **[Avoid Single-Letter Variable Names](./rules/ban_single_letter_variables.md):** Bans ambiguous variables like `e`, `m`, `u`, or `a`/`b` to protect log traceability and readability.
- **[Ban `Array.reverse`](./rules/ban_array_reverse.md):** Encourages the use of the non-destructive `Array.prototype.toReversed()` method over the mutable `Array.prototype.reverse()` to prevent unintended side effects from array mutation.
- **[Ban `Array.sort`](./rules/ban_array_sort.md):** Encourages the use of the non-destructive `Array.prototype.toSorted()` method over the mutable `Array.prototype.sort()` to prevent unintended side effects from array mutation.
- **[Ban `Array.splice`](./rules/ban_array_splice.md):** Encourages the use of non-destructive methods over the mutable `Array.prototype.splice()` to prevent unintended side effects from array mutation.
- **[Explicit Return Types](./rules/force_explicit_return_type_annotations.md):** Mandates explicit return type annotations on functions.
- **[Prefer Array includes](./rules/prefer_array_includes.md):** Encourages the use of `Array.prototype.includes()` over `Array.prototype.indexOf()` for element existence checks.
- **[Prefer Type Definitions over Inference](./rules/prefer_type_definitions_over_type_inference.md):** Favors explicit declarations for contracts.
- **[Self-Explanatory & Explicit Typing](./rules/use_explicit_naming_and_typing.md):** Combines clear variable naming with explicit types.
- **[Use Error Cause](./rules/use_error_cause.md):** Encourages the use of the `cause` property when rethrowing errors to preserve original exception stack traces and context.

### ⚡ Modern TypeScript Features

- **[Derive Types From Values](./rules/typing_from_constants.md):** Promotes type generation directly from single-source objects.
- **[Prefer `satisfies` over `as`](./rules/prefer_satisfies_over_as.md):** Upgrades type-casting to safe conformity checking.
- **[Template Literal Types](./rules/force_template_literal_types.md):** Leverages string-literal types for complex string pattern checking.
- **[TypeScript Utility Types](./rules/typing_utilities.md):** Favors built-in utilities (`Omit`, `Pick`, `Partial`) over duplication.
- **[Use `as const` for Configurations](./rules/use_as_const.md):** Prevents literal widening on constants and configuration objects.

### 🔄 Control Flow and Correctness

- **[Exhaustive Checks with `never`](./rules/validate_with_never.md):** Leverages the compiler to guarantee all logic branches are handled.
- **[Exhaustive Switch](./rules/use_exhaustive_switch.md):** Enforce exhaustive compile-time `switch` statements.
- **[Mandatory Control Flow Braces](./rules/force_control_flow_braces.md):** Bans single-line blocks without braces for `if`, `for`, and `while` loops.
- **[Typed Catch Error Handling](./rules/typing_catch_error_handling.md):** Ensures catch-clause variables are correctly narrowed from `unknown`.
- **[Typed Error Handling](./rules/typing_error_handling.md):** Enforces safe catch-clause type parsing.
- **[Use Type Predicates](./rules/typing_return_type.md):** Encourages `is` type guards for reusable type narrowing.

### ⚙️ Mechanics and Setup

- **[Class Modifiers](./rules/use_class_modifiers.md):** Enforces `private`, `protected`, `public`, and `readonly` properties.
- **[Generics That Infer Automatically](./rules/typing_generics_that_infer_automatically.md):** Restricts generics to cases where they can be implicitly deduced.
- **[Import of Native Modules](./rules/use_import_of_native_modules.md):** Standardizes Node.js native imports using the `node:` prefix.
- **[Readonly Where Possible](./rules/use_readonly_where_possible.md):** Maximizes immutability across data models.
- **[TS Config](./rules/configuration_tsconfig.md):** Base compiler rules required for these principles to function.
