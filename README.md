# 🛠️ TypeScript Skill

[![npm version](https://img.shields.io/npm/v/hardwired-skill-typescript.svg)](https://www.npmjs.com/package/hardwired-skill-typescript)
[![License](https://img.shields.io/npm/l/hardwired-skill-typescript.svg)](LICENSE)
[![Node](https://img.shields.io/node/v/hardwired-skill-typescript.svg)](package.json)

> Opinionated TypeScript rules designed to be reused as a shared skill or injected directly into your project's AI instruction files.

A reusable, configurable skill that injects strict TypeScript coding rules into AI context files (such as `CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md`, and the `.github/agents/` directory). Ensure assistants like **Claude** and **GitHub Copilot** generate consistent, high-quality TypeScript code every time.

## ✨ Features

- 🎯 **Opinionated TypeScript Rules** — Curated best practices, strict type safety, and clean code conventions.
- 🔌 **Multi-Target Injection** — Native support for `CLAUDE.md`, `AGENTS.md`, Copilot instructions, and dedicated agent directories.
- ⚡ **Interactive CLI** — Pick and choose which rules and formats to deploy via terminal prompts.
- 📦 **Shared Dependency** — Install via npm to keep your AI prompts synchronized across multiple repositories.

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

```shell
npx hardwired-install-typescript --all
```

This is a shorthand equivalent to running:

```shell
npx hardwired-install-typescript --agentdir --copilotdir --agentsmd --claudemd
```

#### 📂 Option 3: Target Specific Directories

Target the `.agent` directory for universal AI configurations, or `.github` specifically for GitHub Copilot.

> ℹ️ **Note:** The CLI automatically defaults to copying files directly if your operating system or environment lacks the permissions required to establish symlinks back to `node_modules`.

```shell
npx hardwired-install-typescript --agentdir --copilotdir
```

#### 📝 Option 4: Target Specific Markdown Files

Append or write rules directly into individual top-level files:

> ℹ️ **Note:** If the specified files do not exist, the command will automatically create them for you.

```shell
npx hardwired-install-typescript --agentsmd --claudemd
```
