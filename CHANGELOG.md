# 📝 Changelog

[1.0.4]

## ✨ Added

- 📄 **[Typed Catch Error Handling](./rules/typing_catch_error_handling.md):** Encourages the use of typed catch error handling to improve type safety and error management.

[1.0.3]

## ✨ Added

- 📄 **[Ban `Array.reverse`](./rules/ban_array_reverse.md):** Encourages the use of the non-destructive `Array.prototype.toReversed()` method over the mutable `Array.prototype.reverse()` to prevent unintended side effects from array mutation.
- 📄 **[Ban `Array.sort`](./rules/ban_array_sort.md):** Encourages the use of the non-destructive `Array.prototype.toSorted()` method over the mutable `Array.prototype.sort()` to prevent unintended side effects from array mutation.
- 📄 **[Ban `Array.splice`](./rules/ban_array_splice.md):** Encourages the use of non-destructive methods over the mutable `Array.prototype.splice()` to prevent unintended side effects from array mutation.
- 📄 **[Force using `Error.isError`](./rules/force_is_error.md):** Encourages the use of `Error.isError()` utility check over the standard `instanceof Error` operator to reliably detect cross-realm error exceptions.
- 📄 **[Prefer Array includes](./rules/prefer_array_includes.md):** Encourages the use of `Array.prototype.includes()` over `Array.prototype.indexOf()` for element existence checks.
- 📄 **[Use Error Cause](./rules/use_error_cause.md):** Encourages the use of the `cause` property when rethrowing errors to preserve original exception stack traces and context.

[1.0.2]

## ✨ Added

- ⚙️ **Cursor Automation Integration:** Added full deployment support for `.cursor/rules/*.mdc` project rulesets and `CURSOR.md` root-level context routers.
- 📄 **[Avoid Single-Letter Variable Names](./rules/ban_single_letter_variables.md):** Bans ambiguous variables like `e`, `m`, `u`, or `a`/`b` to protect log traceability and readability.

[1.0.1]

## ✨ Added

- 📄 Add documentation.

[1.0.0]

- Initial release.
