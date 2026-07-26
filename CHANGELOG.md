# 📝 Changelog

## [1.0.6]

### Updates

- 📄 Minor doc updates

## [1.0.5]

### Added

- ⚙️ **Uninstallation Support:** Introduced `hardwired-uninstall-typescript` CLI tool to cleanly remove the skill, its directories, and its references from project files.
- 📄 **[Avoid Loose Types](./rules/ban_loose_types.md):** Bans the use of `Function`, `object`, and `{}` as type annotations in favor of explicit signatures and shapes.
- 📄 **[Avoid Non-Null Assertion](./rules/ban_non_null_assertion.md):** Bans the use of the non-null assertion operator (`!`) in favor of optional chaining, nullish coalescing, or explicit narrowing.
- 📄 **[Enum Alternative](./rules/alternative_to_enum.md):** Encourages using `as const` object literals and type mappings instead of the TypeScript `enum` keyword for better serialization and runtime behavior.
- 📄 **[Exhaustive switch](./rules/use_exhaustive_switch.md):** Enforces exhaustive compile-time `switch` statements over discriminated unions using a `never` type check.
- 📄 **[Mandatory Control Flow Braces](./rules/force_control_flow_braces.md):** Enforces explicit curly braces for all control flow statements to improve readability and prevent refactoring bugs.
- 📄 **[No `namespace` or `module`](./rules/ban_namespace_or_module.md):** Bans the use of `namespace` or `module` keywords in favor of ES module `import`/`export` syntax.
- 📄 **[Prefer `satisfies` over `as`](./rules/prefer_satisfies_over_as.md):** Encourages the use of the `satisfies` operator over type assertions (`as`) to validate object shapes while preserving specific inferred types.
- 📄 **[Prefer `unknown` over `any`](./rules/prefer_unknown_over_any.md):** Encourages the use of `unknown` over `any` to enforce runtime type safety and validation boundaries.
- 📄 **[Use `as const`](./rules/use_as_const.md):** Encourages the use of `as const` assertions to lock literal types and prevent widening of configuration and constant values.

## [1.0.4]

### Added

- 📄 **[Typed Catch Error Handling](./rules/typing_catch_error_handling.md):** Encourages the use of typed catch error handling to improve type safety and error management.

## [1.0.3]

### Added

- 📄 **[Ban `Array.reverse`](./rules/ban_array_reverse.md):** Encourages the use of the non-destructive `Array.prototype.toReversed()` method over the mutable `Array.prototype.reverse()` to prevent unintended side effects from array mutation.
- 📄 **[Ban `Array.sort`](./rules/ban_array_sort.md):** Encourages the use of the non-destructive `Array.prototype.toSorted()` method over the mutable `Array.prototype.sort()` to prevent unintended side effects from array mutation.
- 📄 **[Ban `Array.splice`](./rules/ban_array_splice.md):** Encourages the use of non-destructive methods over the mutable `Array.prototype.splice()` to prevent unintended side effects from array mutation.
- 📄 **[Force using `Error.isError`](./rules/force_is_error.md):** Encourages the use of `Error.isError()` utility check over the standard `instanceof Error` operator to reliably detect cross-realm error exceptions.
- 📄 **[Prefer Array includes](./rules/prefer_array_includes.md):** Encourages the use of `Array.prototype.includes()` over `Array.prototype.indexOf()` for element existence checks.
- 📄 **[Use Error Cause](./rules/use_error_cause.md):** Encourages the use of the `cause` property when rethrowing errors to preserve original exception stack traces and context.

## [1.0.2]

### Added

- ⚙️ **Cursor Automation Integration:** Added full deployment support for `.cursor/rules/*.mdc` project rulesets and `CURSOR.md` root-level context routers.
- 📄 **[Avoid Single-Letter Variable Names](./rules/ban_single_letter_variables.md):** Bans ambiguous variables like `e`, `m`, `u`, or `a`/`b` to protect log traceability and readability.

## [1.0.1]

### Added

- 📄 Add documentation.

## [1.0.0]

- Initial release.
