# 🛠️ AI Agent Skill – TypeScript

<p align="center">
  <img src=".github/assets/banner.webp?raw=true" alt="AI Agent Skill – TypeScript" width="128" />
</p>

---

[![NPM Version](https://badgen.net/npm/v/hardwired-skill-typescript?icon=npm&label=npm&color=dd3636)](https://npmjs.com/package/hardwired-skill-typescript)

[![Target: .agent directory](https://img.shields.io/badge/→-.agent-9d00ff?style=flat-square&logo=smartthings&logoColor=white)](#)
[![Target: .cursor directory](https://img.shields.io/badge/→-.cursor-5456f5?style=flat-square&logo=cursor&logoColor=white)](#)
[![Target: .github directory](https://img.shields.io/badge/→-.github-0fbf3e?style=flat-square&logo=githubcopilot&logoColor=white)](#)
[![Target: AGENTS.md](https://img.shields.io/badge/→-AGENTS.md-9d00ff?style=flat-square&logo=smartthings&logoColor=white)](#)
[![Target: CLAUDE.md](https://img.shields.io/badge/→-CLAUDE.md-d97752?style=flat-square&logo=anthropic&logoColor=white)](#)
[![Target: CURSOR.md](https://img.shields.io/badge/→-CURSOR.md-5456f5?style=flat-square&logo=cursor&logoColor=white)](#)

---

> Opinionated TypeScript rules designed to be reused as a shared skill or injected directly into project AI instruction files.

A reusable, configurable skill that injects strict TypeScript coding rules into AI context files (such as `AGENTS.md`, `CURSOR.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.agent/` and `.cursor/` directory).

Ensure assistants like **Cursor**, **Claude**, **GitHub Copilot** and others generate consistent, high-quality TypeScript code every
time.

## ✨ Features

- 🎯 **Opinionated TypeScript Rules** — Curated best practices, strict type safety, and clean code conventions.
- 🔌 **Multi-Target Injection** — Native support for `AGENTS.md`, `CURSOR.md`, `CLAUDE.md`, Copilot instructions, and dedicated agent
  directories.
- ⚡ **Interactive CLI** — Pick and choose which rules and formats to deploy via terminal prompts.
- 📦 **Shared Dependency** — Install via npm to keep your AI prompts synchronized across multiple repositories.

---

## 📍 Table of Contents

- [✨ Features](#-features)
- [📦 Installation](#-installation)
  - [Step 1: Install the dependency](#step-1-install-the-dependency)
  - [Step 2: Run the installer](#step-2-run-the-installer)
    - [💡 Option 1: Interactive Setup (Default)](#-option-1-interactive-setup-default)
    - [🚀 Option 2: Automated Full Installation](#-option-2-automated-full-installation)
    - [📂 Option 3: Target Specific Directories](#-option-3-target-specific-directories)
    - [📝 Option 4: Target Specific Markdown Files](#-option-4-target-specific-markdown-files)
    - [📊 Installation Options Summary](#-installation-options-summary)
- [📖 Documentation and Principles](#-documentation-and-principles)
  - [🛠️ Core Rules Reference](#️-core-rules-reference)
    - [🔒 Strict Type Safety and Banning Loose Types](#-strict-type-safety-and-banning-loose-types)
    - [📐 Code Architecture and Modeling](#-code-architecture-and-modeling)
    - [📝 Annotations and Typing Styles](#-annotations-and-typing-styles)
    - [⚡ Modern TypeScript Features](#-modern-typescript-features)
    - [🔄 Control Flow and Correctness](#-control-flow-and-correctness)
    - [⚙️ Mechanics and Setup](#️-mechanics-and-setup)
- [⚙️ Prerequisites](#️-prerequisites)
- [🤝 Contributing](#-contributing)

---

## 📦 Installation

### Step 1: Install the dependency

Add the package as a development dependency to your project:

```shell
npm install -D hardwired-skill-typescript
```

### Step 2: Run the installer

Choose one of the configuration options below to deploy the skill files.

#### 💡 Option 1: Interactive Setup (Default)

Launch the interactive prompts to customize your installation:

```shell
npx hardwired-install-typescript
```

#### 🚀 Option 2: Automated Full Installation

Deploy all rules to all supported targets. Ideal for quick setups, tests, or CI/CD pipelines:

- ⌨️ `--all`

```shell
npx hardwired-install-typescript --all
```

This is a shorthand equivalent to running:

```shell
npx hardwired-install-typescript --agentdir --copilotdir --agentsmd --claudemd
```

#### 📂 Option 3: Target Specific Directories

Target the `.agent` directory for universal AI configurations, or `.github` specifically for GitHub Copilot.

> ℹ️ **Note:** The CLI automatically defaults to copying files directly if your operating system or environment lacks
> the permissions required to establish symlinks back to `node_modules`.

- ⌨️ `--agentdir` for `.agent`📁
- ⌨️ `--cursor` for `.cursor`📁
- ⌨️ `--copilotdir` for `.github`📁

```shell
npx hardwired-install-typescript --agentdir --cursor --copilotdir
```

#### 📝 Option 4: Target Specific Markdown Files

Append or write rules directly into individual top-level files:

> ℹ️ **Note:** If the specified files do not exist, the command will automatically create them for you.

- ⌨️ `--agentsmd` for `AGENTS.md`📄
- ⌨️ `--cursormd` for `CURSOR.md`📄
- ⌨️ `--claudemd` for `CLAUDE.md`📄

```shell
npx hardwired-install-typescript --agentsmd --cursormd --claudemd
```

#### 📊 Installation Options Summary

| Target File / Directory | CLI Flag       | Installation Behavior                                   |
|:------------------------|:---------------|:--------------------------------------------------------|
| **All Targets**         | `--all`        | Fully deploys to all supported AI paths and files       |
| **Universal Agents**    | `--agentdir`   | Targets the universal `.agent` directory (symlink/copy) |
| **Cursor**              | `--cursordir`  | Targets the `.cursor` configurations (symlink/copy)     |
| **GitHub Copilot**      | `--copilotdir` | Targets the `.github` configurations (symlink/copy)     |
| **AGENTS.md**           | `--agentsmd`   | Creates/appends rules to a local `AGENTS.md` file       |
| **CURSOR.md**           | `--cursormd`   | Creates/appends rules to a local `CURSOR.md` file       |
| **CLAUDE.md**           | `--claudemd`   | Creates/appends rules to a local `CLAUDE.md` file       |

## 📖 Documentation and Principles

This package enforces a strict, opinionated set of TypeScript rules. The single source of truth for these rules is [`principles.md`](./principles.md).

> ⚠️ **Important:** If you need to modify or override any rules, **always edit `principles.md` first**. Then, rerun the
> installer or manually update `AGENTS.md`, `CURSOR.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, and `rulebook.yaml` to sync your changes.
> If a rule conflicts with explicit project requirements, your project requirements take precedence.

### 🛠️ Core Rules Reference

Below is the categorized list of the TypeScript conventions injected by this skill:

#### 🔒 Strict Type Safety and Banning Loose Types

- **[Avoid Loose Types](./rules/ban_loose_types.md):** Rejects broad types like `Function`, `object`, and `{}`.
- **[Avoid Non-Null Assertion](./rules/ban_non_null_assertion.md):** Bans the use of the `!` operator.
- **[Prefer `unknown` over `any`](./rules/prefer_unknown_over_any.md):** Forces safer type narrowing workflows.
- **[Validate External Data at Runtime](./rules/validate_at_runtime.md):** Ensures boundaries are secure from unvalidated data.

#### 📐 Code Architecture and Modeling

- **[Discriminated Unions](./rules/prefer_discriminated_unions.md):** Encourages clear, safe object variants.
- **[Enum Alternative](./rules/alternative_to_enum.md):** Uses safer modern structures over native TypeScript enums.
- **[No `namespace` or `module`](./rules/ban_namespace_or_module.md):** Bans legacy modules in favor of standard ES imports.
- **[Prefer Composing Types](./rules/prefer_composing_types_over_duplicating_object_shapes.md):** Avoids duplicating object shapes across the codebase.
- **[`interface` vs `type`](./rules/discretion_interface_vs_type.md):** Strict criteria for when to use an interface versus a type alias.

#### 👁️ Formatting, Readability, and Clarity

- **[Array Typing](./rules/typing_array.md) & [Async / Promise Typing](./rules/typing_async.md):** Consistent syntax for collections and asynchronous flows.
- **[Avoid Single-Letter Variable Names](./rules/ban_single_letter_variables.md):** Bans ambiguous variables like `e`, `m`, `u`, or `a`/`b` to protect log traceability and readability.
- **[Explicit Return Types](./rules/force_explicit_return_type_annotations.md):** Mandates explicit return type annotations on functions.
- **[Prefer Type Definitions over Inference](./rules/prefer_type_definitions_over_type_inference.md):** Favors explicit declarations for contracts.
- **[Self-Explanatory & Explicit Typing](./rules/use_explicit_naming_and_typing.md):** Combines clear variable naming with explicit types.

#### ⚡ Modern TypeScript Features

- **[Derive Types From Values](./rules/typing_from_constants.md):** Promotes type generation directly from single-source objects.
- **[Prefer `satisfies` over `as`](./rules/prefer_satisfies_over_as.md):** Upgrades type-casting to safe conformity checking.
- **[Template Literal Types](./rules/force_template_literal_types.md):** Leverages string-literal types for complex string pattern checking.
- **[TypeScript Utility Types](./rules/typing_utilities.md):** Favors built-in utilities (`Omit`, `Pick`, `Partial`) over duplication.
- **[Use `as const` for Configurations](./rules/use_as_const.md):** Prevents literal widening on constants and configuration objects.

#### 🔄 Control Flow and Correctness

- **[Exhaustive Checks with `never`](./rules/validate_with_never.md):** Leverages the compiler to guarantee all logic branches are handled.
- **[Exhaustive Switch](./rules/use_exhaustive_switch.md):** Enforce exhaustive compile-time `switch` statements.
- **[Mandatory Control Flow Braces](./rules/force_control_flow_braces.md):** Bans single-line blocks without braces for `if`, `for`, and `while` loops.
- **[Typed Error Handling](./rules/typing_error_handling.md):** Enforces safe catch-clause type parsing.
- **[Use Type Predicates](./rules/typing_return_type.md):** Encourages `is` type guards for reusable type narrowing.

#### ⚙️ Mechanics and Setup

- **[Class Modifiers](./rules/use_class_modifiers.md):** Enforces `private`, `protected`, `public`, and `readonly` properties.
- **[Generics That Infer Automatically](./rules/typing_generics_that_infer_automatically.md):** Restricts generics to cases where they can be implicitly deduced.
- **[Import of Native Modules](./rules/use_import_of_native_modules.md):** Standardizes Node.js native imports using the `node:` prefix.
- **[Readonly Where Possible](./rules/use_readonly_where_possible.md):** Maximizes immutability across data models.
- **[TS Config](./rules/configuration_tsconfig.md):** Base compiler rules required for these principles to function.

## ⚙️ Prerequisites

- **Node.js**: `^20.0.0` or higher (recommended)
- **TypeScript**: `^5.0.0` or higher (to support features like `satisfies`)

## 🤝 Contributing

Contributions and feature suggestions are welcome. Feel free to check
the [issues page](https://github.com/r37r0m0d3l/hardwired_skill_typescript/issues) if you want to propose a new rule.

---
