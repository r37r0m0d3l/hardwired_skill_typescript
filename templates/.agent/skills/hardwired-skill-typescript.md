---
description: System rules for TypeScript development. Use when writing, reviewing, or refactoring code to ensure alignment with core project specifications.
alwaysApply: true
globs: "**/*.{ts,tsx,js,jsx,json}"
---

# TypeScript System Rules

## 🎯 Core Alignment & Source of Truth
- **Follow the core principles document as the absolute single source of truth for all TypeScript code generation and style rules:**
	- [TypeScript Core Principles]({{PRINCIPLES_PATH}})
- If anything in this rule or file conflicts with the core principles, **the core principles win**.
- If a rule conflicts with explicit project requirements, project requirements win.
- For specific implementations, consult the relevant rule files located inside `{{RULES_PATH}}/`.
- Keep `CURSOR.md`, `.cursor/rules/hardwired-skill-typescript.mdc`, `CLAUDE.md`, and `rulebook.yaml` completely aligned with the core principles.
