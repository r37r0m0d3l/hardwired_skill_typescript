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

Opinionated TypeScript rules designed to be reused as a shared skill or injected directly into project AI instruction files.

A reusable, configurable skill that injects strict TypeScript coding rules into AI context files (such as `AGENTS.md`, `CURSOR.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.agent/` and `.cursor/` directory).

Enforce immutability, type safety, strict linting, and coding standards across every LLM-based coding assistant - **Cursor**, **Claude**, **Claude Code**, **GitHub Copilot**, **Windsurf**, **Codex**, and more - via `cursorrules`, `AGENTS.md`, `CLAUDE.md`, and Copilot instructions.

## ✨ Features

- 🎯 **Opinionated TypeScript Rules** - Curated best practices, strict type safety, and clean code conventions.
- 🔌 **Multi-Target Injection** - Native support for `AGENTS.md`, `CURSOR.md`, `CLAUDE.md`, Copilot instructions, and dedicated agent directories.
- ⚡ **Interactive CLI** - Pick and choose which rules and formats to deploy via terminal prompts.
- 📦 **Shared Dependency** - Install via npm to keep your AI prompts synchronized across multiple repositories.

##

## 📍 What it does

Real-world codebases have **low-quality-do-not-overengineer-it-we-have-a-release-soon** code.

Your LLM was trained on plenty of code like this.

This skill guides AI to fix obvious issues and enforce best practices - without losing sight of that reality.

<img src=".github/assets/000.webp" alt="Screenshot" width="639">

<img src=".github/assets/001.webp" alt="Screenshot" width="639">

<img src=".github/assets/002.webp" alt="Screenshot" width="639">

## 📦 Installation

Install as dev dependency:

```shell
npm install -D hardwired-skill-typescript
```

Install everything (if you experimenting):

```shell
npx hardwired-install-typescript --all
```

Install `.agent/` directory and `AGENTS.md` file for *universal* AI configurations (for those agents that support it):

```shell
npx hardwired-install-typescript --agentdir --agentsmd
```

For **all** CLI options, flags, and target-specific setup see **[INSTALL.md](./INSTALL.md)**.

## 📖 Documentation and Principles

The single source of truth for all rules is [`principles.md`](./principles.md).

For the full categorized rules reference see **[DOCS.md](./DOCS.md)**.

## ⚙️ Prerequisites

- **Node.js**: `^22.18.0` or higher (recommended)
- **TypeScript**: `^5.0.0` or higher (to support features like `satisfies`)

## 🤝 Contributing

Contributions and feature suggestions are welcome. Feel free to check the [issues page](https://github.com/r37r0m0d3l/hardwired_skill_typescript/issues) if you want to propose a new rule.
