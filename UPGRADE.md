# 🆙 Upgrade Guide

Use this when updating `hardwired-skill-typescript` to a newer version.

## 1. Update the package

```shell
npm install -D hardwired-skill-typescript@latest
```

## 2. Re-run installer for directory targets

For upgrades, refresh the generated skill directories:

```shell
npx hardwired-install-typescript --agentdir --copilotdir --cursordir
```

If you want every target refreshed in one command:

```shell
npx hardwired-install-typescript --all
```

## 3. If generated files are not symlinked, do a clean reinstalling

In some environments, files are copied instead of symlinked. If the upgrade output looks stale, use the uninstaller to remove generated targets and then install again:

```shell
npx hardwired-uninstall-typescript --all
npx hardwired-install-typescript --all
```

## 4. Skip root Markdown flags during a normal upgrade

Usually there is no reason to pass:

- `--agentsmd`
- `--claudemd`
- `--cursormd`

Those root files (`AGENTS.md`, `CLAUDE.md`, `CURSOR.md`) already contain the router/reference text and installer updates are idempotent. Re-run these flags only if you removed those files or intentionally want them recreated.

## 5. Keep your custom instructions safe

If you added project-specific rules in `AGENTS.md`, `CLAUDE.md`, or `CURSOR.md`, keep them outside the generated reference block before upgrade. The installer appends/ensures references, but team-specific policy text should remain manually maintained.

---

For full installation options, see [INSTALL.md](./INSTALL.md).
