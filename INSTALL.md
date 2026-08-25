# 📦 Installation

## Step 1: Install the dependency

Add the package as a development dependency to your project:

```shell
npm install -D hardwired-skill-typescript
```

## Step 2: Run the installer

Choose one of the configuration options below to deploy the skill files.

### 💡 Option 1: Interactive Setup (Default)

Launch the interactive prompts to customize your installation:

```shell
npx hardwired-install-typescript
```

### 🚀 Option 2: Automated Full Installation

Deploy all rules to all supported targets. Ideal for quick setups, tests, or CI/CD pipelines:

- ⌨️ `--all`

```shell
npx hardwired-install-typescript --all
```

This is a shorthand equivalent to running:

```shell
npx hardwired-install-typescript --agentdir --copilotdir --agentsmd --cursordir --cursormd --claudemd
```

### 📂 Option 3: Target Specific Directories

Target the `.agent` directory for `OpenAI` and universal AI configurations, or `.github` specifically for `GitHub Copilot`.

> ℹ️ **Note:** The CLI automatically defaults to copying files directly if your operating system or environment lacks
> the permissions required to establish symlinks back to `node_modules`.

- <img src=".github/assets/openai.svg" alt="OpenAI icon" width="16" height="16"> `--agentdir` for `.agent/`
- <img src=".github/assets/copilot.svg" alt="Copilot icon" width="16" height="16"> `--copilotdir` for `.github/`
- <img src=".github/assets/cursor.svg" alt="Cursor icon" width="16" height="16"> `--cursordir` for `.cursor/`

```shell
npx hardwired-install-typescript --agentdir --cursordir --copilotdir
```

### 📝 Option 4: Target Specific Markdown Files

Append or write rules directly into individual top-level files:

> ℹ️ **Note:** If the specified files do not exist, the command will automatically create them for you.

- <img src=".github/assets/openai.svg" alt="OpenAI icon" width="16" height="16"> `--agentsmd` for `AGENTS.md`
- <img src=".github/assets/claude.svg" alt="Claude icon" width="16" height="16"> `--claudemd` for `CLAUDE.md`
- <img src=".github/assets/cursor.svg" alt="Cursor icon" width="16" height="16"> `--cursormd` for `CURSOR.md`

```shell
npx hardwired-install-typescript --agentsmd --cursormd --claudemd
```

### 📊 Installation Options Summary

| Target File / Directory | CLI Flag       | Installation Behavior                                   |
| :---------------------- | :------------- | :------------------------------------------------------ |
| **All Targets**         | `--all`        | Fully deploys to all supported AI paths and files       |
| **Universal Agents**    | `--agentdir`   | Targets the universal `.agent` directory (symlink/copy) |
| **GitHub Copilot**      | `--copilotdir` | Targets the `.github` configurations (symlink/copy)     |
| **Cursor**              | `--cursordir`  | Targets the `.cursor` configurations (symlink/copy)     |
| **AGENTS.md**           | `--agentsmd`   | Creates/appends rules to a local `AGENTS.md` file       |
| **CLAUDE.md**           | `--claudemd`   | Creates/appends rules to a local `CLAUDE.md` file       |
| **CURSOR.md**           | `--cursormd`   | Creates/appends rules to a local `CURSOR.md` file       |

## 🗑️ Uninstallation

If you need to cleanly remove the skill from your workspace, use the `hardwired-uninstall-typescript` command. It supports the same flags as the installer to target specific areas for cleanup.

### 💡 Option 1: Interactive Uninstallation (Default)

Launch an interactive prompt to confirm uninstalling everything:

```shell
npx hardwired-uninstall-typescript
```

### 🚀 Option 2: Full Uninstallation

Remove all skill files and references from all supported targets:

```shell
npx hardwired-uninstall-typescript --all
```

### 📊 Uninstallation Options Summary

| Target File / Directory | CLI Flag       | Uninstallation Behavior                                 |
| :---------------------- | :------------- | :------------------------------------------------------ |
| **All Targets**         | `--all`        | Removes all skill files and references from all paths   |
| **Universal Agents**    | `--agentdir`   | Removes the `.agent/skills/hardwired-skill-typescript`  |
| **GitHub Copilot**      | `--copilotdir` | Removes the `.github/skills/hardwired-skill-typescript` |
| **Cursor**              | `--cursordir`  | Removes the `.cursor/rules/hardwired-skill-typescript`  |
| **AGENTS.md**           | `--agentsmd`   | Removes skill-specific references from `AGENTS.md`      |
| **CLAUDE.md**           | `--claudemd`   | Removes skill-specific references from `CLAUDE.md`      |
| **CURSOR.md**           | `--cursormd`   | Removes skill-specific references from `CURSOR.md`      |
