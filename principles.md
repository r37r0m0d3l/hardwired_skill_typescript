# TypeScript Principles (Skill)

These rules are opinionated.
If a rule conflicts with explicit project requirements, project requirements win.

## Scope / How to use

- This document (`principles.md`) is the **single source of truth**.
- If you need to change rules, **edit this file first**, then update `AGENTS.md`, `CLAUDE.md`, `CURSOR.md`, `.github/copilot-instructions.md`, and
  `rulebook.yaml` to match.

## Core Rules

- [Array Typing](./rules/typing_array.md)
- [Async / Promise Typing](./rules/typing_async.md)
- [Avoid Loose Types (`Function`, `object`, `{}`)](./rules/ban_loose_types.md)
- [Avoid Non-Null Assertion (`!`)](./rules/ban_non_null_assertion.md)
- [Avoid Single-Letter Variable Names](./rules/ban_single_letter_variables.md)
- [Ban `Array.reverse`](./rules/ban_array_reverse.md)
- [Ban `Array.sort`](./rules/ban_array_sort.md)
- [Ban `Array.splice`](./rules/ban_array_splice.md)
- [Branded / Nominal Types](./rules/discretion_branded_types.md)
- [Class Modifiers](./rules/use_class_modifiers.md)
- [Derive Types From Values](./rules/typing_from_constants.md)
- [Discriminated unions](./rules/prefer_discriminated_unions.md)
- [Enum Alternative](./rules/alternative_to_enum.md)
- [Exhaustive switch](./rules/use_exhaustive_switch.md)
- [Explicit Return Type Annotations](./rules/force_explicit_return_type_annotations.md)
- [Force using `Error.isError`](./rules/force_is_error.md)
- [Generics That Infer Automatically](./rules/typing_generics_that_infer_automatically.md)
- [Import of native modules](./rules/use_import_of_native_modules.md)
- [Mandatory Control Flow Braces](./rules/force_control_flow_braces.md)
- [No `namespace` or `module` Keywords](./rules/ban_namespace_or_module.md)
- [Prefer Array includes](./rules/prefer_array_includes.md)
- [Prefer Type Definitions over Type Inference](./rules/prefer_type_definitions_over_type_inference.md)
- [Prefer `satisfies` over `as`](./rules/prefer_satisfies_over_as.md)
- [Prefer `unknown` over `any`](./rules/prefer_unknown_over_any.md)
- [Prefer composing types over duplicating object shapes](./rules/prefer_composing_types_over_duplicating_object_shapes.md)
- [Readonly Where Possible](./rules/use_readonly_where_possible.md)
- [Self-Explanatory Variable Names with Explicit Typing](./rules/use_explicit_naming_and_typing.md)
- [TS Config](./rules/configuration_tsconfig.md)
- [Template Literal Types](./rules/force_template_literal_types.md)
- [TypeScript Utility Types Over Duplication](./rules/typing_utilities.md)
- [Typed Catch Error Handling](./rules/typing_catch_error_handling.md)
- [Typed Error Handling](./rules/typing_error_handling.md)
- [Use Error Cause](./rules/use_error_cause.md)
- [Use Exhaustive Checks With never](./rules/validate_with_never.md)
- [Use Type Predicates for Reusable Narrowing](./rules/typing_return_type.md)
- [Use `as const` for Configuration and Constants](./rules/use_as_const.md)
- [Validate External Data at Runtime](./rules/validate_at_runtime.md)
- [`interface` vs `type`](./rules/discretion_interface_vs_type.md)
