# 🛠️ AI Agent Skill – TypeScript

![AI Agent Skill – TypeScript](.github/assets/banner.webp)

---

[![NPM Version](https://badgen.net/npm/v/hardwired-skill-typescript?icon=npm&label=npm&color=dd3636)](https://npmjs.com/package/hardwired-skill-typescript)

![Target: .agent directory](https://img.shields.io/badge/→-.agent-9d00ff?style=flat-square&logo=smartthings&logoColor=white)
![Target: .cursor directory](https://img.shields.io/badge/→-.cursor-5456f5?style=flat-square&logo=cursor&logoColor=white)
![Target: .github directory](https://img.shields.io/badge/→-.github-0fbf3e?style=flat-square&logo=githubcopilot&logoColor=white)
![Target: AGENTS.md](https://img.shields.io/badge/→-AGENTS.md-9d00ff?style=flat-square&logo=smartthings&logoColor=white)
![Target: CLAUDE.md](https://img.shields.io/badge/→-CLAUDE.md-d97752?style=flat-square&logo=anthropic&logoColor=white)
![Target: CURSOR.md](https://img.shields.io/badge/→-CURSOR.md-5456f5?style=flat-square&logo=cursor&logoColor=white)

**Opinionated, pure TypeScript rules** designed to be reused as a shared skill or injected directly into project AI instruction files.

This skill focuses **exclusively** on the TypeScript language and coding practices—it is **not** a **framework-specific** skill (no NestJS, Angular, Vue, React, etc.)

A reusable, configurable skill that injects strict TypeScript coding rules into AI context files (such as `AGENTS.md`, `CLAUDE.md`, `.agent/` and `.cursor/` directory).

Enforce immutability, type safety, strict linting, and coding standards across every LLM-based coding assistant—**Cursor**, **Claude Code**, **GitHub Copilot**, **Windsurf**, **Codex**, and more—via `AGENTS.md`, `CLAUDE.md`, and Copilot instructions etc.

## 🔗 Related Skills

- **[`hardwired-skill-mikroorm`](https://www.npmjs.com/package/hardwired-skill-mikroorm)** – MikroORM skill library with strict rules.

## ✨ Features

- **🎯 _Opinionated TypeScript Rules_**\
  Curated best practices, strict type safety, and clean code conventions.
- **🔌 _Multi-Target Injection_**\
  Native support for `AGENTS.md`, `CURSOR.md`, `CLAUDE.md`, Copilot instructions, and dedicated agent directories.
- **⚡ _Interactive CLI_**\
  Pick and choose which rules and formats to deploy via terminal prompts.
- **📦 _Shared Dependency_**\
  Install via npm to keep your AI prompts synchronized across multiple repositories.

## 📍 What it does

Real-world codebases have **low-quality-do-not-overengineer-it-we-have-a-release-soon** code.

Your LLM was trained on plenty of code like this. This skill guides AI to fix obvious issues and enforce best practices.

![Before and After Fix Screenshot 1](.github/assets/000.webp)

![Before and After Fix Screenshot 2](.github/assets/001.webp)

![Before and After Fix Screenshot 3](.github/assets/002.webp)

## 📦 Installation

### 1. Install as a dev dependency

```shell
npm install -D hardwired-skill-typescript
```

### 2. Install everything (for experimentation)

```shell
npx hardwired-install-typescript --all
```

### 3. Targeted universal setups

Install `.agent/` directory and `AGENTS.md` file for **universal** AI configurations (for those agents that support it):

```shell
npx hardwired-install-typescript --agentdir --agentsmd
```

### 4. Uninstall (Clean up)

If you need to remove the skill from your project:

```shell
npx hardwired-uninstall-typescript --all
```

**📌 NOTE**\
For **all** CLI options, flags, and target-specific setup see [**INSTALL.md**](./INSTALL.md).

## 📖 Documentation and Principles

- The single source of truth for all rules is [`principles.md`](./principles.md).
- For the full categorized rules reference see [*ACKNOWLEDGMENTS](./ACKNOWLEDGMENTS.md).

## ⚙️ Prerequisites

- **Node.js**: `^22.18.0` or higher (recommended)
- **TypeScript**: `^5.0.0` or higher (to support features like `satisfies`)
