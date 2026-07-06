#!/usr/bin/env node
import { appendFileSync, copyFileSync, existsSync, linkSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync, } from "node:fs";
import { createInterface } from "node:readline/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { stdin as input, stdout as output } from "node:process";
const SKILL_NAME = "hardwired-skill-typescript";
const PATH_RULES = "rules";
const PATH_SKILLS = "skills";
const PATH_PRINCIPLES = "principles.md";
const PATH = {
    AGENT: {
        dir: ".agent",
        dirSub: PATH_SKILLS,
        file: `${SKILL_NAME}.md`,
        fileRoot: "AGENTS.md",
    },
    COPILOT: {
        dir: ".github",
        dirSub: PATH_SKILLS,
        file: "copilot-instructions.md",
        fileRoot: "",
    },
    CLAUDE: {
        dir: "",
        dirSub: "",
        file: "",
        fileRoot: "CLAUDE.md",
    },
    CURSOR: {
        dir: ".cursor",
        dirSub: PATH_RULES,
        file: `${SKILL_NAME}.mdc`,
        fileRoot: "CURSOR.md",
    },
};
let requiredNodeVersion = "22.18.0";
try {
    const pkgPath = join(dirname(fileURLToPath(import.meta.url)), "..", "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    if (pkg && pkg.engines && pkg.engines.node) {
        const match = String(pkg.engines.node).match(/(\d+(?:\.\d+){0,2})/);
        if (match) {
            requiredNodeVersion = match[1];
        }
    }
}
catch (_error) {
}
function versionLessThan(alpha, beta) {
    const pa = String(alpha).split(".").map(Number);
    const pb = String(beta).split(".").map(Number);
    for (let index = 0; index < 3; index++) {
        const alphaNum = pa[index] || 0;
        const betaNum = pb[index] || 0;
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
    scriptDir;
    packageRoot;
    workspaceRoot;
    paths;
    hasErrors;
    constructor() {
        this.hasErrors = false;
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
    ensureDir(pathTo) {
        try {
            mkdirSync(pathTo, { recursive: true });
        }
        catch (_error) {
        }
    }
    walk(dir) {
        const results = [];
        if (!existsSync(dir)) {
            return results;
        }
        try {
            for (const name of readdirSync(dir)) {
                if (name === "node_modules" || name === ".git" || name === "bin") {
                    continue;
                }
                const full = join(dir, name);
                const stat = lstatSync(full);
                if (stat.isDirectory()) {
                    results.push(...this.walk(full));
                }
                else if (stat.isFile()) {
                    results.push(full);
                }
            }
        }
        catch (error) {
            console.error(`[${SKILL_NAME}] Directory traversal error:`, error?.message || error);
            this.hasErrors = true;
        }
        return results;
    }
    isEphemeralSourcePath(sourcePath) {
        const normalizedPath = sourcePath.replace(/\\/g, "/").toLowerCase();
        return normalizedPath.includes("/_npx/");
    }
    tryCreateSymlink(sourcePath, destinationPath) {
        const relativeLinkTarget = relative(dirname(destinationPath), sourcePath);
        try {
            symlinkSync(relativeLinkTarget, destinationPath, "file");
            return true;
        }
        catch (_relativeSymlinkError) {
            try {
                symlinkSync(sourcePath, destinationPath, "file");
                return true;
            }
            catch (_absoluteSymlinkError) {
                return false;
            }
        }
    }
    tryCreateHardLink(sourcePath, destinationPath) {
        try {
            linkSync(sourcePath, destinationPath);
            return true;
        }
        catch (_hardLinkError) {
            return false;
        }
    }
    transferFiles(targetDir) {
        const allowedExtensions = [".json", ".json5", ".jsonc", ".md", ".mdx", ".txt", ".yaml", ".yml"];
        const files = this
            .walk(this.packageRoot)
            .filter((fileName) => allowedExtensions.some((fileExtension) => fileName.toLowerCase().endsWith(fileExtension)));
        for (const src of files) {
            const rel = relative(this.packageRoot, src);
            if (rel.endsWith("package.json") || rel.startsWith("templates")) {
                continue;
            }
            const dest = join(targetDir, rel);
            this.ensureDir(dirname(dest));
            let isPathExists = false;
            let destStat;
            try {
                destStat = lstatSync(dest);
                isPathExists = true;
            }
            catch (_error) {
            }
            if (isPathExists && destStat) {
                try {
                    if (destStat.isFile() || destStat.isSymbolicLink()) {
                        rmSync(dest, { force: true });
                    }
                    else if (destStat.isDirectory()) {
                        console.warn(`[${SKILL_NAME}] Warning: Destination exists and is a directory (skipping removal) for ${rel}`);
                        this.hasErrors = true;
                        continue;
                    }
                    else {
                        rmSync(dest, { force: true });
                    }
                }
                catch (unlinkErr) {
                    console.warn(`[${SKILL_NAME}] Warning: Failed to remove existing path for ${rel} (${dest}):`, unlinkErr?.message || unlinkErr);
                    this.hasErrors = true;
                }
            }
            try {
                const isEphemeralSource = this.isEphemeralSourcePath(src);
                if (isEphemeralSource) {
                    if (!this.tryCreateHardLink(src, dest) && !this.tryCreateSymlink(src, dest)) {
                        copyFileSync(src, dest);
                    }
                }
                else if (!this.tryCreateSymlink(src, dest) && !this.tryCreateHardLink(src, dest)) {
                    copyFileSync(src, dest);
                }
            }
            catch (copyErr) {
                console.error(`[${SKILL_NAME}] File install failed for ${rel}:`, copyErr?.message || copyErr);
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
                console.log(`✅ [${SKILL_NAME}] Created and initialized "${logName}".`);
            }
            catch (error) {
                console.error(`[${SKILL_NAME}] Failed to create "${logName}":`, error?.message || error);
                this.hasErrors = true;
            }
            return;
        }
        try {
            const content = readFileSync(filePath, "utf8");
            const normalizedCheck = String(checkPath).replace(/\\/g, "/");
            const checkNoDot = normalizedCheck.replace(/^\.\//, "");
            const candidates = [normalizedCheck, checkNoDot, encodeURI(normalizedCheck), encodeURI(checkNoDot)];
            let isFound = candidates.some((text) => text && content.includes(text));
            if (!isFound) {
                const escapeForRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
            }
            else {
                const spacingPrefix = content.endsWith("\n") ? "" : "\n";
                appendFileSync(filePath, `${spacingPrefix}${linkContent}\n`, "utf8");
                console.log(`✅ [${SKILL_NAME}] Successfully appended reference to "${logName}".`);
            }
        }
        catch (error) {
            console.error(`[${SKILL_NAME}] Failed to update "${logName}":`, error?.message || error);
            this.hasErrors = true;
        }
    }
    async askQuestion(rl, query) {
        const answer = await rl.question(`${query} (y/N): `);
        const normalized = answer.toLowerCase().trim();
        return normalized === "y" || normalized === "yes";
    }
    async execute() {
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
        let shouldInstallAgentDir = false;
        let shouldInstallCopilotDir = false;
        let shouldInstallCursorDir = false;
        let shouldWriteAgentsMd = false;
        let shouldWriteClaudeMd = false;
        let shouldWriteCursorMd = false;
        let shouldLinkViaAgentRouter = false;
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
            }
            else {
                shouldInstallAgentDir = Boolean(values.agentdir);
                shouldInstallCopilotDir = Boolean(values.copilotdir);
                shouldInstallCursorDir = Boolean(values.cursordir);
                shouldWriteAgentsMd = Boolean(values.agentsmd);
                shouldWriteClaudeMd = Boolean(values.claudemd);
                shouldWriteCursorMd = Boolean(values.cursormd);
                shouldLinkViaAgentRouter = shouldInstallAgentDir;
            }
        }
        else {
            const rl = createInterface({ input, output });
            console.log(`\n📦 ${SKILL_NAME} Setup Matrix:`);
            console.log("\t1. Install everything (all folders + all routers)");
            console.log(`\t2. Install "${PATH.AGENT.dir}/" folder and "${PATH.AGENT.fileRoot}" file (unified shared standard)`);
            console.log(`\t3. Install "${PATH.CURSOR.dir}/" folder and "${PATH.CURSOR.fileRoot}" file (Cursor standard)`);
            console.log(`\t4. Install "${PATH.COPILOT.dir}/" folder (GitHub Copilot standard)`);
            console.log(`\t5. Write "${PATH.CLAUDE.fileRoot}" root router file only (Claude standard)`);
            console.log("\t6. Cancel");
            try {
                const selection = (await rl.question("\n👉 Select option (1-6): ")).trim();
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
                }
                else if (selection === "2") {
                    shouldInstallAgentDir = true;
                    shouldWriteAgentsMd = true;
                    shouldLinkViaAgentRouter = true;
                }
                else if (selection === "3") {
                    shouldInstallCursorDir = true;
                    shouldWriteCursorMd = true;
                }
                else if (selection === "4") {
                    shouldInstallCopilotDir = true;
                }
                else if (selection === "5") {
                    shouldWriteClaudeMd = true;
                }
                if (selection !== "1" && selection !== "5") {
                    console.log("\n📝 Root Router References Configuration:");
                    shouldWriteAgentsMd = await this.askQuestion(rl, `\t🕵️\tWrite references to "${PATH.AGENT.fileRoot}"?`);
                    shouldWriteClaudeMd = await this.askQuestion(rl, `\t🧠\tWrite references to "${PATH.CLAUDE.fileRoot}"?`);
                    shouldWriteCursorMd = await this.askQuestion(rl, `\t🖱️\tWrite references to "${PATH.CURSOR.fileRoot}"?`);
                }
            }
            finally {
                rl.close();
            }
            console.log("");
        }
        const shouldInstall = shouldInstallCopilotDir || shouldInstallCursorDir || shouldInstallAgentDir || shouldWriteAgentsMd || shouldWriteClaudeMd || shouldWriteCursorMd;
        if (!shouldInstall) {
            console.log(`ℹ️\t[${SKILL_NAME}] No targets selected. Exiting.`);
            return;
        }
        const shouldWriteRootMarkdown = shouldWriteAgentsMd || shouldWriteClaudeMd || shouldWriteCursorMd;
        if (shouldWriteRootMarkdown && !shouldInstallAgentDir && !shouldInstallCopilotDir && !shouldInstallCursorDir) {
            shouldInstallAgentDir = true;
        }
        console.log(`🏁\t[${SKILL_NAME}] Initializing system build…`);
        if (shouldInstallAgentDir) {
            const target = join(this.workspaceRoot, PATH.AGENT.dir, PATH.AGENT.dirSub, SKILL_NAME);
            this.ensureDir(target);
            this.transferFiles(target);
        }
        if (shouldInstallCopilotDir) {
            const target = join(this.workspaceRoot, PATH.COPILOT.dir, PATH.COPILOT.dirSub, SKILL_NAME);
            this.ensureDir(target);
            this.transferFiles(target);
        }
        if (shouldInstallCursorDir) {
            const target = join(this.workspaceRoot, PATH.CURSOR.dir, PATH.CURSOR.dirSub, SKILL_NAME);
            this.ensureDir(target);
            this.transferFiles(target);
        }
        let internalPrinciplesPath;
        if (shouldInstallCursorDir) {
            internalPrinciplesPath = join(PATH.CURSOR.dir, PATH.CURSOR.dirSub, SKILL_NAME, PATH_PRINCIPLES);
        }
        else if (shouldInstallAgentDir) {
            internalPrinciplesPath = join(PATH.AGENT.dir, PATH.AGENT.dirSub, SKILL_NAME, PATH_PRINCIPLES);
        }
        else {
            internalPrinciplesPath = join(PATH.COPILOT.dir, PATH.COPILOT.dirSub, SKILL_NAME, PATH_PRINCIPLES);
        }
        let routerPathRaw;
        if (shouldLinkViaAgentRouter) {
            routerPathRaw = join(PATH.AGENT.dir, PATH.AGENT.dirSub, PATH.AGENT.file);
        }
        else {
            routerPathRaw = internalPrinciplesPath;
        }
        const primaryInternalPrinciples = `./${internalPrinciplesPath.replace(/\\/g, "/")}`;
        const publicRouterPath = `./${routerPathRaw.replace(/\\/g, "/")}`;
        const encodedPublicRouterPath = encodeURI(publicRouterPath);
        const encodedInternalPrinciples = encodeURI(primaryInternalPrinciples);
        const templatesSrcDir = join(this.packageRoot, "templates");
        let templates;
        try {
            templates = {
                agentdir: readFileSync(join(templatesSrcDir, PATH.AGENT.dir, PATH.AGENT.dirSub, PATH.AGENT.file), "utf8").replace(/{{ENCODED_INTERNAL_PRINCIPLES}}/g, encodedInternalPrinciples),
                agentsmd: readFileSync(join(templatesSrcDir, PATH.AGENT.fileRoot), "utf8").replace(/{{ENCODED_PUBLIC_ROUTER_PATH}}/g, encodedPublicRouterPath),
                claudemd: readFileSync(join(templatesSrcDir, PATH.CLAUDE.fileRoot), "utf8").replace(/{{ENCODED_PUBLIC_ROUTER_PATH}}/g, encodedPublicRouterPath),
                copilotdir: readFileSync(join(templatesSrcDir, PATH.COPILOT.dir, PATH.COPILOT.file), "utf8").replace(/{{PRIMARY_INTERNAL_PRINCIPLES}}/g, primaryInternalPrinciples),
                cursordir: readFileSync(join(templatesSrcDir, PATH.CURSOR.dir, PATH.CURSOR.dirSub, PATH.CURSOR.file), "utf8").replace(/{{SKILL_NAME}}/g, SKILL_NAME),
                cursormd: readFileSync(join(templatesSrcDir, PATH.CURSOR.fileRoot), "utf8").replace(/{{ENCODED_PUBLIC_ROUTER_PATH}}/g, encodedPublicRouterPath),
            };
        }
        catch (error) {
            console.error(`[${SKILL_NAME}] Failed to load template files:`, error?.message || error);
            this.hasErrors = true;
            return;
        }
        if (shouldInstallCursorDir) {
            try {
                this.ensureDir(dirname(this.paths.cursordir));
                writeFileSync(this.paths.cursordir, templates.cursordir, "utf8");
                console.log(`✅ [${SKILL_NAME}] Created and initialized custom MDC context target "${PATH.CURSOR.dir}/${PATH.CURSOR.dirSub}/${PATH.CURSOR.file}".`);
            }
            catch (error) {
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
    .execute()
    .catch((error) => {
    console.error(`[${SKILL_NAME}] Unhandled error during installation:`, error?.message || error);
    process.exit(1);
});
