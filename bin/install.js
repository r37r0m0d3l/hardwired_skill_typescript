#!/usr/bin/env node
import {appendFileSync, copyFileSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, symlinkSync, rmSync, writeFileSync} from "node:fs";
import {dirname, join, relative} from "node:path";
import {fileURLToPath} from "node:url";
import {createInterface} from "node:readline/promises";
import {stdin as input, stdout as output} from "node:process";
import {parseArgs} from "node:util";

const SKILL_NAME = "hardwired-skill-typescript";

let requiredNodeVersion = "18.0.0";
try {
	const pkgPath = join(dirname(fileURLToPath(import.meta.url)), "..", "package.json");
	const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
	if (pkg && pkg.engines && pkg.engines.node) {
		const m = String(pkg.engines.node).match(/(\d+(?:\.\d+){0,2})/);
		if (m) {
			requiredNodeVersion = m[1];
		}
	}
} catch (_error) {
	// try anyway
}
function versionLessThan(a, b) {
	const pa = String(a).split(".").map(Number);
	const pb = String(b).split(".").map(Number);
	for (let i = 0; i < 3; i++) {
		const na = pa[i] || 0;
		const nb = pb[i] || 0;
		if (na < nb) {
			return true;
		}
		if (na > nb) {
			return false;
		}
	}
	return false;
}
if (versionLessThan(process.versions.node, requiredNodeVersion)) {
	console.warn(`[${SKILL_NAME}] Warning: Node.js >= ${requiredNodeVersion} is recommended. This script uses modern APIs (parseArgs, readline/promises).`);
}

class SkillInstaller {
	constructor() {
		this.cwd = process.cwd();
		this.dirname = dirname(fileURLToPath(import.meta.url));
		this.srcPackage = join(this.dirname, "..");
		this.skillName = SKILL_NAME;
		this.hasErrors = false;

		this.paths = {
			agentdir: join(this.cwd, ".agent", "rules", `${SKILL_NAME}.md`),
			agentsmd: join(this.cwd, "AGENTS.md"),
			claudemd: join(this.cwd, "CLAUDE.md"),
			copilotdir: join(this.cwd, ".github", "copilot-instructions.md"),
		};
	}

	ensureDir(pathTo) {
		try {
			mkdirSync(pathTo, {recursive: true});
		} catch (_error) {
			/* Directory already exists or is accessible */
		}
	}

	walk(dir) {
		const results = [];
		if (!existsSync(dir)) return results;
		try {
			for (const name of readdirSync(dir)) {
				if (name === "node_modules" || name === ".git" || name === "bin") continue;
				const full = join(dir, name);
				const stat = lstatSync(full);
				if (stat.isDirectory()) {
					results.push(...this.walk(full));
				} else if (stat.isFile()) {
					results.push(full);
				}
			}
		} catch (error) {
			console.error(`[${this.skillName}] Directory traversal error:`, error.message);
			this.hasErrors = true;
		}
		return results;
	}

	transferFiles(targetDir) {
		const allowedExtensions = [".json", ".json5", ".jsonc", ".md", ".mdx", ".txt", ".yaml", ".yml"];
		const files = this.walk(this.srcPackage).filter((file) => allowedExtensions.some((ext) => file.toLowerCase().endsWith(ext)));

		for (const src of files) {
			const rel = relative(this.srcPackage, src);
			if (rel.endsWith("package.json")) {
				continue;
			}

			const dest = join(targetDir, rel);
			this.ensureDir(dirname(dest));

			let pathExists = false;
			let destStat;
			try {
				destStat = lstatSync(dest);
				pathExists = true;
			} catch (_err) {
				/* Path is completely clear */
			}

			if (pathExists) {
				try {
					if (destStat.isFile() || destStat.isSymbolicLink()) {
						rmSync(dest, {force: true});
					} else if (destStat.isDirectory()) {
						console.warn(`[${this.skillName}] Warning: Destination exists and is a directory (skipping removal) for ${rel}`);
						this.hasErrors = true;
						continue;
					} else {
						rmSync(dest, {force: true});
					}
				} catch (unlinkErr) {
					console.warn(`[${this.skillName}] Warning: Failed to remove existing path for ${rel} (${dest}):`, unlinkErr && unlinkErr.message ? unlinkErr.message : unlinkErr);
					this.hasErrors = true;
				}
			}

			try {
				if (process.platform === "win32") {
					// Creating symlinks on Windows often requires special privileges; prefer copying for reliability
					copyFileSync(src, dest);
				} else {
					// Use a relative symlink target so the link remains valid if the repo is moved
					const linkTarget = relative(dirname(dest), src);
					try {
						symlinkSync(linkTarget, dest, "file");
					} catch (symlinkErr) {
						// If relative symlink creation fails, try absolute source path, then fall back to copy
						try {
							symlinkSync(src, dest, "file");
						} catch (_symlinkErr) {
							copyFileSync(src, dest);
						}
					}
				}
			} catch (copyErr) {
				console.error(`[${this.skillName}] File install failed for ${rel}:`, copyErr.message);
				this.hasErrors = true;
			}
		}
	}

	injectInstructions(filePath, linkContent, logName, checkPath, fallbackHeader = "") {
		this.ensureDir(dirname(filePath));

		if (!existsSync(filePath)) {
			try {
				const initialContent = fallbackHeader ? `${fallbackHeader}${linkContent}\n` : `${linkContent}\n`;
				writeFileSync(filePath, initialContent, "utf8");
				console.log(`✅ [${this.skillName}] Created and initialized "${logName}".`);
			} catch (error) {
				console.error(`[${this.skillName}] Failed to create "${logName}":`, error.message);
				this.hasErrors = true;
			}
			return;
		}

		try {
			const content = readFileSync(filePath, "utf8");

			// Normalize check path variants to improve detection (handles ./, encoded, and bare filenames)
			const normalizedCheck = String(checkPath).replace(/\\/g, "/");
			const checkNoDot = normalizedCheck.replace(/^\.\//, "");
			const baseName = normalizedCheck.split("/").pop();
			const candidates = [normalizedCheck, checkNoDot, encodeURI(normalizedCheck), encodeURI(checkNoDot)];

			let found = candidates.some((p) => p && content.includes(p));

			// If a literal match wasn't found, look for markdown links or inline references that include the basename
			if (!found && baseName) {
				// Escape for regex
				const escapeForRegex = (s) => s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
				const bEsc = escapeForRegex(baseName);

				// Match markdown links where the target or path contains the basename: [text](...basename...)
				const mdLinkTargetRegex = new RegExp(`\\[[^\\]]*\\]\\([^\\)]*${bEsc}[^\\)]*\\)`, "i");
				// Match inline code references like `./path/to/basename` or `basename`
				const inlineCodeRegex = new RegExp("`[^`]*" + bEsc + "[^`]*`", "i");
				// Match plain path mentions (best-effort)
				const plainPathRegex = new RegExp("(^|\\s|[\">('])" + escapeForRegex(checkNoDot) + "($|\\s|[\"<)'])", "i");

				if (mdLinkTargetRegex.test(content) || inlineCodeRegex.test(content) || plainPathRegex.test(content)) {
					found = true;
				}
			}

			if (found) {
				console.log(`☑️  [${this.skillName}] Reference already exists in "${logName}".`);
			} else {
				const spacingPrefix = content.endsWith("\n") ? "" : "\n";
				appendFileSync(filePath, `${spacingPrefix}${linkContent}\n`, "utf8");
				console.log(`✅ [${this.skillName}] Successfully appended reference to "${logName}".`);
			}
		} catch (error) {
			console.error(`[${this.skillName}] Failed to update "${logName}":`, error.message);
			this.hasErrors = true;
		}
	}

	async askQuestion(rl, query) {
		const answer = await rl.question(`${query} (y/N): `);
		const normalized = answer.toLowerCase().trim();
		return normalized === "y" || normalized === "yes";
	}

	async execute() {
		const {values} = parseArgs({
			options: {
				agentdir: {type: "boolean", default: false},
				agentsmd: {type: "boolean", default: false},
				all: {type: "boolean", default: false},
				claudemd: {type: "boolean", default: false},
				copilotdir: {type: "boolean", default: false},
			},
		});

		let installCopilotDir = false;
		let installAgentDir = false;
		let writeAgentsMd = false;
		let writeClaudeMd = false;

		const hasArgs = values.all || values.agentsmd || values.copilotdir || values.claudemd || values.agentdir;

		if (hasArgs) {
			console.log(`⚙️  [${this.skillName}] Processing arguments...`);
			if (values.all) {
				installCopilotDir = true;
				installAgentDir = true;
				writeAgentsMd = true;
				writeClaudeMd = true;
			} else {
				installCopilotDir = values.copilotdir === true;
				installAgentDir = values.agentdir === true;
				writeAgentsMd = values.agentsmd === true;
				writeClaudeMd = values.claudemd === true;
			}
		} else {
			const rl = createInterface({input, output});
			console.log(`\n📦 ${this.skillName} Setup Matrix:`);
			console.log("  1. Install everything (all folders + all routers)");
			console.log('  2. Install both ".github/" and ".agent/" folders');
			console.log('  3. Install ".agent/" folder (Unified shared standard)');
			console.log('  4. Install ".github/" folder (GitHub Copilot standard)');
			console.log("  5. Cancel");

			try {
				const selection = (await rl.question("\n👉 Select option (1-5): ")).trim();

				if (selection === "5" || !["1", "2", "3", "4"].includes(selection)) {
					console.log(`\nℹ️  [${this.skillName}] Installation canceled.`);
					rl.close();
					return;
				}

				if (selection === "1") {
					installCopilotDir = true;
					installAgentDir = true;
					writeAgentsMd = true;
					writeClaudeMd = true;
				} else if (selection === "2") {
					installCopilotDir = true;
					installAgentDir = true;
				} else if (selection === "3") {
					installAgentDir = true;
				} else if (selection === "4") {
					installCopilotDir = true;
				}

				if (selection !== "1") {
					console.log("\n📝 Root Router References Configuration:");
					writeAgentsMd = await this.askQuestion(rl, '  🕵️  Write references to "AGENTS.md"?');
					writeClaudeMd = await this.askQuestion(rl, '  🧠  Write references to "CLAUDE.md"?');
				}
			} finally {
				rl.close();
			}
			console.log("");
		}

		const shouldInstall = installCopilotDir || installAgentDir || writeAgentsMd || writeClaudeMd;

		if (!shouldInstall) {
			console.log(`ℹ️  [${this.skillName}] No targets selected. Exiting.`);
			return;
		}

		console.log(`🏁 [${this.skillName}] Initializing system build…`);

		// Resolve layout endpoints deterministically
		let vendorTargetDir;
		let internalPrinciplesPath;

		if (installCopilotDir) {
			// .github is installed (either exclusively or alongside .agent) -> rules live in .github/skills/
			vendorTargetDir = join(this.cwd, ".github", "skills", this.skillName);
			internalPrinciplesPath = `./.github/skills/${this.skillName}/principles.md`;
		} else {
			// Pure .agent setup without .github -> rules live entirely inside .agent/skills/
			vendorTargetDir = join(this.cwd, ".agent", "skills", this.skillName);
			internalPrinciplesPath = `./.agent/skills/${this.skillName}/principles.md`;
		}

		// Fire physical rules distribution
		this.ensureDir(vendorTargetDir);
		this.transferFiles(vendorTargetDir);

		const publicRouterPath = installAgentDir ? `./.agent/rules/${SKILL_NAME}.md` : internalPrinciplesPath;

		const encodedPublicRouterPath = encodeURI(publicRouterPath);
		const encodedInternalPrinciplesPath = encodeURI(internalPrinciplesPath);

		const templates = {
			agentdir: `# Strict TypeScript Architectural Rules\n\nCRITICAL: You must read, interpret, and strictly follow the principles defined in:\n- [TypeScript Core Principles](${encodedInternalPrinciplesPath})`,
			agentsmd: `- [TypeScript Coding Principles](${encodedPublicRouterPath})`,
			claudemd: `- [TypeScript Skill from ${SKILL_NAME}](${encodedPublicRouterPath})`,
			copilotdir: `\n# TypeScript Coding Standards\nCRITICAL: Follow the principles defined in:\n- ${encodedInternalPrinciplesPath}`,
		};

		if (installCopilotDir) {
			this.injectInstructions(this.paths.copilotdir, templates.copilotdir, ".github/copilot-instructions.md", internalPrinciplesPath);
		}

		if (installAgentDir) {
			this.injectInstructions(this.paths.agentdir, templates.agentdir, ".agent/rules/hardwired-typescript.md", internalPrinciplesPath);
		}

		if (writeAgentsMd) {
			const fallbackHeader = `# Project Agent Instructions\nThis repository enforces strict TypeScript standards.\n\n## Coding Standards\n`;
			this.injectInstructions(this.paths.agentsmd, templates.agentsmd, "AGENTS.md", publicRouterPath, fallbackHeader);
		}

		if (writeClaudeMd) {
			this.injectInstructions(this.paths.claudemd, templates.claudemd, "CLAUDE.md", publicRouterPath);
		}

		if (this.hasErrors) {
			console.error(`\n❌ [${this.skillName}] Initialization completed with errors.`);
			process.exit(1);
		}

		console.log(`\n💯 [${this.skillName}] Initialization successful.`);
	}
}

new SkillInstaller().execute().catch((error) => {
	console.error(`[${SKILL_NAME}] Unhandled error during installation:`, error && error.message ? error.message : error);
	process.exit(1);
});
