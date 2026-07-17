# Cursor System Rules & Context (CURSOR.md)

## 🎯 Source of Truth
- **Follow `{{PRINCIPLES_PATH}}` as the single source of truth for all code generation and architectural rules.**
- If a rule conflicts with explicit project requirements, project requirements win.
- If anything in this file or a `.cursor/rules/*.mdc` file conflicts with `{{PRINCIPLES_PATH}}`, **`{{PRINCIPLES_PATH}}` wins**.
- Keep `CURSOR.md`, `.cursor/rules/hardwired-skill-typescript.mdc`, `CLAUDE.md`, and `rulebook.yaml` completely aligned with `{{PRINCIPLES_PATH}}`.

## 🛠️ TypeScript Rules of Engagement
When generating, refactoring, or reviewing code, you must adhere strictly to the rules documented in `{{RULES_PATH}}/`. Key guardrails include:

- **Type Safety:** Prefer `unknown` over `any`, avoid loose types (`Function`, `object`, `{}`), and avoid non-null assertions (`!`).
- **Declarations:** Prefer explicit type definitions over type inference, force explicit return type annotations, and use `satisfies` over `as`.
- **Constants:** Use `as const` for configuration and constants, and derive types from values directly.
- **Control Flow:** Mandatory control flow braces for all blocks and implement exhaustive switch statements using `never` validation.
- **Data Integrity:** Always validate external data at runtime and implement typed error handling.

*For detailed explanations and code examples, read the entry table of contents mapping located directly at [TypeScript Coding Principles]({{ROUTER_PATH}}) and refer to the specific files inside `{{RULES_PATH}}/`.*

## 🤖 Cursor Integration
- The primary rule is committed at `.cursor/rules/hardwired-skill-typescript.mdc` with `alwaysApply: true`.
- When executing complex workspace-wide changes, Agent/Composer mode must cross-reference this `CURSOR.md` file and `{{PRINCIPLES_PATH}}` to guarantee alignment with project skills.
