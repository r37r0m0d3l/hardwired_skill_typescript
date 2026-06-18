#!/usr/bin/env node
import {
	//
	appendFileSync,
	copyFileSync,
	existsSync,
	linkSync,
	lstatSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from "node:fs";
import { type Stats } from "node:fs";
import { createInterface } from "node:readline/promises";
import { type Interface } from "node:readline/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { stdin as input, stdout as output } from "node:process";

interface PathInterface {
	readonly dir: string;
	readonly dirSub: string;
	readonly file: string;
	readonly fileRoot: string;
}

const SKILL_NAME: string = "hardwired-skill-typescript" as const;

const PATH_RULES: string = "rules" as const;
const PATH_SKILLS: string = "skills" as const;
const PATH_PRINCIPLES: string = "principles.md" as const;

const PATH: {
	"AGENT": PathInterface;
	"COPILOT": PathInterface;
	"CLAUDE": PathInterface;
	"CURSOR": PathInterface;
} = {
	AGENT: {
		/**
		 * ".agent"
		 */
		dir: ".agent",
		/**
		 * "skills"
		 */
		dirSub: PATH_SKILLS,
		/**
		 * "hardwired-skill-typescript.md"
		 */
		file: `${SKILL_NAME}.md`,
		/**
		 * "AGENTS.md"
		 */
		fileRoot: "AGENTS.md",
	},
	COPILOT: {
		/**
		 * ".github"
		 */
		dir: ".github",
		dirSub: PATH_SKILLS,
		/**
		 * "copilot-instructions.md"
		 */
		file: "copilot-instructions.md",
		fileRoot: "",
	},
	CLAUDE: {
		dir: "",
		dirSub: "",
		file: "",
		/**
		 * "CLAUDE.md"
		 */
		fileRoot: "CLAUDE.md",
	},
	CURSOR: {
		/**
		 * ".cursor"
		 */
		dir: ".cursor",
		/**
		 * "rules"
		 */
		dirSub: PATH_RULES,
		/**
		 * "hardwired-skill-typescript.mdc"
		 */
		file: `${SKILL_NAME}.mdc`,
		/**
		 * "CURSOR.md"
		 */
		fileRoot: "CURSOR.md",
	},
} as const;

let requiredNodeVersion: string = "22.18.0";
try {
	// @ts-ignore
	const pkgPath: string = join(dirname(fileURLToPath(import.meta.url)), "..", "package.json");
	const pkg: any = JSON.parse(readFileSync(pkgPath, "utf8"));
	if (pkg && pkg.engines && pkg.engines.node) {
		const match = String(pkg.engines.node).match(/(\d+(?:\.\d+){0,2})/);
		if (match) {
			requiredNodeVersion = match[1] as string;
		}
	}
} catch (_error: unknown) {
	// try anyway
}

function versionLessThan(alpha: string, beta: string): boolean {
	const pa: Array<number> = String(alpha).split(".").map(Number);
	const pb: Array<number> = String(beta).split(".").map(Number);
	for (let index = 0; index < 3; index++) {
		const alphaNum: number = pa[index] || 0;
		const betaNum: number = pb[index] || 0;
		if (alphaNum < betaNum) {
			return true;
		}
		if (alphaNum > betaNum) {
			return false;
		}
	}
	return false;
}

if (versionLessThan(process.versions.node, requiredNodeVersion)) {
	console.warn(`[${SKILL_NAME}] Warning: Node.js >= ${requiredNodeVersion} is recommended. This script uses modern APIs (parseArgs, readline/promises).`);
}

class SkillInstaller {
	private readonly scriptDir: string;
	private readonly packageRoot: string;
	private readonly workspaceRoot: string;
	private readonly paths: {
		agentdir: string;
		agentsmd: string;
		claudemd: string;
		copilotdir: string;
		cursordir: string;
		cursormd: string;
	};
	private hasErrors: boolean;

	public constructor() {
		this.hasErrors = false;

		// @ts-ignore
		this.scriptDir = dirname(fileURLToPath(import.meta.url));
		this.packageRoot = join(this.scriptDir, "..");
		this.workspaceRoot = process.cwd();

		this.paths = {
			agentdir: join(this.workspaceRoot, PATH.AGENT.dir, PATH.AGENT.dirSub, PATH.AGENT.file),
			agentsmd: join(this.workspaceRoot, PATH.AGENT.fileRoot),
			claudemd: join(this.workspaceRoot, PATH.CLAUDE.fileRoot),
			copilotdir: join(this.workspaceRoot, PATH.COPILOT.dir, PATH.COPILOT.file),
			cursordir: join(this.workspaceRoot, PATH.CURSOR.dir, PATH.CURSOR.dirSub, PATH.CURSOR.file),
			cursormd: join(this.workspaceRoot, PATH.CURSOR.fileRoot),
		};
	}

	private ensureDir(pathTo: string): void {
		try {
			mkdirSync(pathTo, { recursive: true });
		} catch (_error: unknown) {
			/* Directory already exists or is accessible */
		}
	}

	private walk(dir: string): Array<string> {
		const results: Array<string> = [];
		if (!existsSync(dir)) {
			return results;
		}
		try {
			for (const name of readdirSync(dir)) {
				if (name === "node_modules" || name === ".git" || name === "bin") {
					continue;
				}
				const full: string = join(dir, name);
				const stat: Stats = lstatSync(full);
				if (stat.isDirectory()) {
					results.push(...this.walk(full));
				} else if (stat.isFile()) {
					results.push(full);
				}
			}
		} catch (error: any) {
			console.error(`[${SKILL_NAME}] Directory traversal error:`, error?.message || error);
			this.hasErrors = true;
		}
		return results;
	}

	private isEphemeralSourcePath(sourcePath: string): boolean {
		const normalizedPath: string = sourcePath.replace(/\\/g, "/").toLowerCase();
		return normalizedPath.includes("/_npx/");
	}

	private tryCreateSymlink(sourcePath: string, destinationPath: string): boolean {
		const relativeLinkTarget: string = relative(dirname(destinationPath), sourcePath);
		try {
			symlinkSync(relativeLinkTarget, destinationPath, "file");
			return true;
		} catch (_relativeSymlinkError: unknown) {
			try {
				symlinkSync(sourcePath, destinationPath, "file");
				return true;
			} catch (_absoluteSymlinkError: unknown) {
				return false;
			}
		}
	}

	private tryCreateHardLink(sourcePath: string, destinationPath: string): boolean {
		try {
			linkSync(sourcePath, destinationPath);
			return true;
		} catch (_hardLinkError: unknown) {
			return false;
		}
	}

	private transferFiles(targetDir: string): void {
		const allowedExtensions: Array<string> = [".json", ".json5", ".jsonc", ".md", ".mdx", ".txt", ".yaml", ".yml"];
		const files: Array<string> = this
			//
			.walk(this.packageRoot)
			.filter((fileName: string) => allowedExtensions.some((fileExtension: string) => fileName.toLowerCase().endsWith(fileExtension)));

		for (const src of files) {
			const rel = relative(this.packageRoot, src);
			if (rel.endsWith("package.json") || rel.startsWith("templates")) {
				continue;
			}

			const dest: string = join(targetDir, rel);
			this.ensureDir(dirname(dest));

			let isPathExists: boolean = false;
			let destStat: Stats | undefined;
			try {
				destStat = lstatSync(dest);
				isPathExists = true;
			} catch (_error: unknown) {
				/* Path is completely clear */
			}

			if (isPathExists && destStat) {
				try {
					if (destStat.isFile() || destStat.isSymbolicLink()) {
						rmSync(dest, { force: true });
					} else if (destStat.isDirectory()) {
						console.warn(`[${SKILL_NAME}] Warning: Destination exists and is a directory (skipping removal) for ${rel}`);
						this.hasErrors = true;
						continue;
					} else {
						rmSync(dest, { force: true });
					}
				} catch (unlinkErr: any) {
					console.warn(`[${SKILL_NAME}] Warning: Failed to remove existing path for ${rel} (${dest}):`, unlinkErr?.message || unlinkErr);
					this.hasErrors = true;
				}
			}

			try {
				const isEphemeralSource: boolean = this.isEphemeralSourcePath(src);
				if (isEphemeralSource) {
					// _npx paths can disappear after process exit; prefer durable hard links first.
					if (!this.tryCreateHardLink(src, dest) && !this.tryCreateSymlink(src, dest)) {
						copyFileSync(src, dest);
					}
				} else if (!this.tryCreateSymlink(src, dest) && !this.tryCreateHardLink(src, dest)) {
					copyFileSync(src, dest);
				}
			} catch (copyErr: any) {
				console.error(`[${SKILL_NAME}] File install failed for ${rel}:`, copyErr?.message || copyErr);
				this.hasErrors = true;
			}
		}
	}

	private injectInstructions(filePath: string, linkContent: string, logName: string, checkPath: string, fallbackHeader: string = ""): void {
		this.ensureDir(dirname(filePath));

		if (!existsSync(filePath)) {
			try {
				const initialContent = fallbackHeader ? `${fallbackHeader}${linkContent}\n` : `${linkContent}\n`;
				writeFileSync(filePath, initialContent, "utf8");
				console.log(`✅ [${SKILL_NAME}] Created and initialized "${logName}".`);
			} catch (error: any) {
				console.error(`[${SKILL_NAME}] Failed to create "${logName}":`, error?.message || error);
				this.hasErrors = true;
			}
			return;
		}

		try {
			const content: string = readFileSync(filePath, "utf8");

			const normalizedCheck: string = String(checkPath).replace(/\\/g, "/");
			const checkNoDot: string = normalizedCheck.replace(/^\.\//, "");
			const candidates: Array<string> = [normalizedCheck, checkNoDot, encodeURI(normalizedCheck), encodeURI(checkNoDot)];

			let isFound: boolean = candidates.some((text) => text && content.includes(text));

			if (!isFound) {
				const escapeForRegex = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
				const exactPathEscaped = escapeForRegex(checkNoDot);

				const mdLinkTargetRegex = new RegExp(`\[[^\]]*]\([^()]*${exactPathEscaped}[^()]*\)`, "i");
				const inlineCodeRegex = new RegExp("`[^`]*" + exactPathEscaped + "[^`]*`", "i");
				const plainPathRegex = new RegExp("(^|\\s|[\">('])" + exactPathEscaped + "($|\\s|[\"<)'])", "i");

				if (mdLinkTargetRegex.test(content) || inlineCodeRegex.test(content) || plainPathRegex.test(content)) {
					isFound = true;
				}
			}

			if (isFound) {
				console.log(`☑️  [${SKILL_NAME}] Reference already exists in "${logName}".`);
			} else {
				const spacingPrefix = content.endsWith("\n") ? "" : "\n";
				appendFileSync(filePath, `${spacingPrefix}${linkContent}\n`, "utf8");
				console.log(`✅ [${SKILL_NAME}] Successfully appended reference to "${logName}".`);
			}
		} catch (error: any) {
			console.error(`[${SKILL_NAME}] Failed to update "${logName}":`, error?.message || error);
			this.hasErrors = true;
		}
	}

	private async askQuestion(rl: Interface, query: string): Promise<boolean> {
		const answer: string = await rl.question(`${query} (y/N): `);
		const normalized: string = answer.toLowerCase().trim();
		return normalized === "y" || normalized === "yes";
	}

	public async execute(): Promise<void> {
		const { values } = parseArgs({
			options: {
				agentdir: { type: "boolean", default: false },
				agentsmd: { type: "boolean", default: false },
				all: { type: "boolean", default: false },
				claudemd: { type: "boolean", default: false },
				copilotdir: { type: "boolean", default: false },
				cursordir: { type: "boolean", default: false },
				cursormd: { type: "boolean", default: false },
			},
		});

		let shouldInstallAgentDir: boolean = false;
		let shouldInstallCopilotDir: boolean = false;
		let shouldInstallCursorDir: boolean = false;
		let shouldWriteAgentsMd: boolean = false;
		let shouldWriteClaudeMd: boolean = false;
		let shouldWriteCursorMd: boolean = false;
		let shouldLinkViaAgentRouter: boolean = false;

		const hasArgs = values.all || values.agentsmd || values.copilotdir || values.claudemd || values.agentdir || values.cursordir || values.cursormd;

		if (hasArgs) {
			console.log(`⚙️\t[${SKILL_NAME}] Processing arguments…`);
			if (values.all) {
				shouldInstallCopilotDir = true;
				shouldInstallCursorDir = true;
				shouldInstallAgentDir = true;
				shouldWriteAgentsMd = true;
				shouldWriteClaudeMd = true;
				shouldWriteCursorMd = true;
				shouldLinkViaAgentRouter = true;
			} else {
				shouldInstallAgentDir = Boolean(values.agentdir);
				shouldInstallCopilotDir = Boolean(values.copilotdir);
				shouldInstallCursorDir = Boolean(values.cursordir);
				shouldWriteAgentsMd = Boolean(values.agentsmd);
				shouldWriteClaudeMd = Boolean(values.claudemd);
				shouldWriteCursorMd = Boolean(values.cursormd);
				shouldLinkViaAgentRouter = shouldInstallAgentDir;
			}
		} else {
			const rl: Interface = createInterface({ input, output });
			console.log(`\n📦 ${SKILL_NAME} Setup Matrix:`);
			console.log("\t1. Install everything (all folders + all routers)");
			console.log(`\t2. Install "${PATH.AGENT.dir}/" folder and "${PATH.AGENT.fileRoot}" file (unified shared standard)`);
			console.log(`\t3. Install "${PATH.CURSOR.dir}/" folder and "${PATH.CURSOR.fileRoot}" file (Cursor standard)`);
			console.log(`\t4. Install "${PATH.COPILOT.dir}/" folder (GitHub Copilot standard)`);
			console.log(`\t5. Write "${PATH.CLAUDE.fileRoot}" root router file only (Claude standard)`);
			console.log("\t6. Cancel");

			try {
				const selection: string = (await rl.question("\n👉 Select option (1-6): ")).trim();

				if (selection === "6" || !["1", "2", "3", "4", "5"].includes(selection)) {
					console.log(`\nℹ️ [${SKILL_NAME}] Installation canceled.`);
					rl.close();
					return;
				}

				if (selection === "1") {
					shouldInstallCopilotDir = true;
					shouldInstallCursorDir = true;
					shouldInstallAgentDir = true;
					shouldWriteAgentsMd = true;
					shouldWriteClaudeMd = true;
					shouldWriteCursorMd = true;
					shouldLinkViaAgentRouter = true;
				} else if (selection === "2") {
					shouldInstallAgentDir = true;
					shouldWriteAgentsMd = true;
					shouldLinkViaAgentRouter = true;
				} else if (selection === "3") {
					shouldInstallCursorDir = true;
					shouldWriteCursorMd = true;
				} else if (selection === "4") {
					shouldInstallCopilotDir = true;
				} else if (selection === "5") {
					// Write only the CLAUDE.md root router file
					shouldWriteClaudeMd = true;
				}

				if (selection !== "1" && selection !== "5") {
					console.log("\n📝 Root Router References Configuration:");
					shouldWriteAgentsMd = await this.askQuestion(rl, `\t🕵️\tWrite references to "${PATH.AGENT.fileRoot}"?`);
					shouldWriteClaudeMd = await this.askQuestion(rl, `\t🧠\tWrite references to "${PATH.CLAUDE.fileRoot}"?`);
					shouldWriteCursorMd = await this.askQuestion(rl, `\t🖱️\tWrite references to "${PATH.CURSOR.fileRoot}"?`);
				}
			} finally {
				rl.close();
			}
			console.log("");
		}

		const shouldInstall = shouldInstallCopilotDir || shouldInstallCursorDir || shouldInstallAgentDir || shouldWriteAgentsMd || shouldWriteClaudeMd || shouldWriteCursorMd;

		if (!shouldInstall) {
			console.log(`ℹ️\t[${SKILL_NAME}] No targets selected. Exiting.`);
			return;
		}

		const shouldWriteRootMarkdown: boolean = shouldWriteAgentsMd || shouldWriteClaudeMd || shouldWriteCursorMd;
		if (shouldWriteRootMarkdown && !shouldInstallAgentDir && !shouldInstallCopilotDir && !shouldInstallCursorDir) {
			shouldInstallAgentDir = true;
		}

		console.log(`🏁\t[${SKILL_NAME}] Initializing system build…`);

		if (shouldInstallAgentDir) {
			const target: string = join(this.workspaceRoot, PATH.AGENT.dir, PATH.AGENT.dirSub, SKILL_NAME);
			this.ensureDir(target);
			this.transferFiles(target);
		}
		if (shouldInstallCopilotDir) {
			const target: string = join(this.workspaceRoot, PATH.COPILOT.dir, PATH.COPILOT.dirSub, SKILL_NAME);
			this.ensureDir(target);
			this.transferFiles(target);
		}
		if (shouldInstallCursorDir) {
			const target: string = join(this.workspaceRoot, PATH.CURSOR.dir, PATH.CURSOR.dirSub, SKILL_NAME);
			this.ensureDir(target);
			this.transferFiles(target);
		}

		let internalPrinciplesPath: string;
		if (shouldInstallCursorDir) {
			internalPrinciplesPath = join(PATH.CURSOR.dir, PATH.CURSOR.dirSub, SKILL_NAME, PATH_PRINCIPLES);
		} else if (shouldInstallAgentDir) {
			internalPrinciplesPath = join(PATH.AGENT.dir, PATH.AGENT.dirSub, SKILL_NAME, PATH_PRINCIPLES);
		} else {
			internalPrinciplesPath = join(PATH.COPILOT.dir, PATH.COPILOT.dirSub, SKILL_NAME, PATH_PRINCIPLES);
		}

		let routerPathRaw: string;
		if (shouldLinkViaAgentRouter) {
			routerPathRaw = join(PATH.AGENT.dir, PATH.AGENT.dirSub, PATH.AGENT.file);
		} else {
			routerPathRaw = internalPrinciplesPath;
		}

		// Ensure Markdown tracking links explicitly use forward slash tokens on Windows machines
		const primaryInternalPrinciples: string = `./${internalPrinciplesPath.replace(/\\/g, "/")}`;
		const publicRouterPath: string = `./${routerPathRaw.replace(/\\/g, "/")}`;

		const encodedPublicRouterPath: string = encodeURI(publicRouterPath);
		const encodedInternalPrinciples: string = encodeURI(primaryInternalPrinciples);

		const templatesSrcDir: string = join(this.packageRoot, "templates");

		let templates: {
			agentdir: string;
			agentsmd: string;
			claudemd: string;
			copilotdir: string;
			cursordir: string;
			cursormd: string;
		};

		try {
			templates = {
				agentdir: readFileSync(join(templatesSrcDir, PATH.AGENT.dir, PATH.AGENT.dirSub, PATH.AGENT.file), "utf8").replace(/{{ENCODED_INTERNAL_PRINCIPLES}}/g, encodedInternalPrinciples),
				agentsmd: readFileSync(join(templatesSrcDir, PATH.AGENT.fileRoot), "utf8").replace(/{{ENCODED_PUBLIC_ROUTER_PATH}}/g, encodedPublicRouterPath),
				claudemd: readFileSync(join(templatesSrcDir, PATH.CLAUDE.fileRoot), "utf8").replace(/{{ENCODED_PUBLIC_ROUTER_PATH}}/g, encodedPublicRouterPath),
				copilotdir: readFileSync(join(templatesSrcDir, PATH.COPILOT.dir, PATH.COPILOT.file), "utf8").replace(/{{PRIMARY_INTERNAL_PRINCIPLES}}/g, primaryInternalPrinciples),
				cursordir: readFileSync(join(templatesSrcDir, PATH.CURSOR.dir, PATH.CURSOR.dirSub, PATH.CURSOR.file), "utf8").replace(/{{SKILL_NAME}}/g, SKILL_NAME),
				cursormd: readFileSync(join(templatesSrcDir, PATH.CURSOR.fileRoot), "utf8").replace(/{{ENCODED_PUBLIC_ROUTER_PATH}}/g, encodedPublicRouterPath),
			};
		} catch (error: any) {
			console.error(`[${SKILL_NAME}] Failed to load template files:`, error?.message || error);
			this.hasErrors = true;
			return;
		}

		if (shouldInstallCursorDir) {
			try {
				this.ensureDir(dirname(this.paths.cursordir));
				writeFileSync(this.paths.cursordir, templates.cursordir, "utf8");
				console.log(`✅ [${SKILL_NAME}] Created and initialized custom MDC context target "${PATH.CURSOR.dir}/${PATH.CURSOR.dirSub}/${PATH.CURSOR.file}".`);
			} catch (error: any) {
				console.error(`[${SKILL_NAME}] Failed to deploy MDC layout configuration:`, error?.message || error);
				this.hasErrors = true;
			}
		}

		if (shouldInstallCopilotDir) {
			this.injectInstructions(this.paths.copilotdir, templates.copilotdir, `${PATH.COPILOT.dir}/${PATH.COPILOT.file}`, primaryInternalPrinciples);
		}

		if (shouldInstallAgentDir) {
			this.injectInstructions(this.paths.agentdir, templates.agentdir, `${PATH.AGENT.dir}/${PATH.AGENT.dirSub}/${PATH.AGENT.file}`, primaryInternalPrinciples);
		}

		if (shouldWriteAgentsMd) {
			const fallbackHeader = `# Project Agent Instructions\nThis repository enforces strict TypeScript standards.\n\n## Coding Standards\n`;
			this.injectInstructions(this.paths.agentsmd, templates.agentsmd, PATH.AGENT.fileRoot, publicRouterPath, fallbackHeader);
		}

		if (shouldWriteClaudeMd) {
			this.injectInstructions(this.paths.claudemd, templates.claudemd, PATH.CLAUDE.fileRoot, publicRouterPath);
		}

		if (shouldWriteCursorMd) {
			const fallbackHeader = `# Cursor Configuration Rules\n\n## Context Routing\n`;
			this.injectInstructions(this.paths.cursormd, templates.cursormd, PATH.CURSOR.fileRoot, publicRouterPath, fallbackHeader);
		}

		if (this.hasErrors) {
			console.error(`\n❌ [${SKILL_NAME}] Initialization completed with errors.`);
			process.exit(1);
		}

		console.log(`\n💯 [${SKILL_NAME}] Initialization successful.`);
	}
}

new SkillInstaller()
	//
	.execute()
	.catch((error) => {
		console.error(`[${SKILL_NAME}] Unhandled error during installation:`, error?.message || error);
		process.exit(1);
	});
