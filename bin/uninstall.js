#!/usr/bin/env node
import { existsSync, lstatSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { createInterface } from "node:readline/promises";
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
catch (_error) { }
function versionLessThan(alpha, beta) {
    const pa = String(alpha).split(".").map(Number);
    const pb = String(beta).split(".").map(Number);
    for (let index = 0; index < 3; index++) {
        const alphaNum = pa[index] || 0;
        const betaNum = pb[index] || 0;
        if (alphaNum < betaNum)
            return true;
        if (alphaNum > betaNum)
            return false;
    }
    return false;
}
if (versionLessThan(process.versions.node, requiredNodeVersion)) {
    console.warn(`[${SKILL_NAME}] Warning: Node.js >= ${requiredNodeVersion} is recommended.`);
}
class SkillUninstaller {
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
    removeDir(dirPath) {
        if (existsSync(dirPath)) {
            try {
                const stat = lstatSync(dirPath);
                if (stat.isDirectory()) {
                    rmSync(dirPath, { recursive: true, force: true });
                    console.log(`✅ [${SKILL_NAME}] Removed directory "${relative(this.workspaceRoot, dirPath)}".`);
                }
            }
            catch (error) {
                console.error(`[${SKILL_NAME}] Failed to remove directory "${dirPath}":`, error?.message || error);
                this.hasErrors = true;
            }
        }
    }
    removeFile(filePath) {
        if (existsSync(filePath)) {
            try {
                rmSync(filePath, { force: true });
                console.log(`✅ [${SKILL_NAME}] Removed file "${relative(this.workspaceRoot, filePath)}".`);
            }
            catch (error) {
                console.error(`[${SKILL_NAME}] Failed to remove file "${filePath}":`, error?.message || error);
                this.hasErrors = true;
            }
        }
    }
    getProcessedTemplate(templatesSrcDir, templatePath, destPath, principlesPath, rulesPath, routerPath = null) {
        const fullTemplatePath = join(templatesSrcDir, templatePath);
        if (!existsSync(fullTemplatePath))
            return "";
        const content = readFileSync(fullTemplatePath, "utf8");
        const getRel = (from, to) => {
            let rel = relative(dirname(from), to).replace(/\\/g, "/");
            if (!rel.startsWith("./") && !rel.startsWith("../") && rel !== ".") {
                rel = "./" + rel;
            }
            return rel;
        };
        const absPrinciples = join(this.workspaceRoot, principlesPath);
        const absRules = join(this.workspaceRoot, rulesPath);
        const absRouter = routerPath ? join(this.workspaceRoot, routerPath) : absPrinciples;
        const relPrinciples = getRel(destPath, absPrinciples);
        const relRules = getRel(destPath, absRules);
        const relRouter = getRel(destPath, absRouter);
        return content
            .replace(/{{PRINCIPLES_PATH}}/g, relPrinciples)
            .replace(/{{RULES_PATH}}/g, relRules)
            .replace(/{{ROUTER_PATH}}/g, relRouter)
            .replace(/{{SKILL_NAME}}/g, SKILL_NAME)
            .replace(/{{ENCODED_INTERNAL_PRINCIPLES}}/g, encodeURI(relPrinciples))
            .replace(/{{ENCODED_PUBLIC_ROUTER_PATH}}/g, encodeURI(relRouter))
            .replace(/{{PRIMARY_INTERNAL_PRINCIPLES}}/g, relPrinciples);
    }
    cleanInstructions(filePath, logName, templateContent, fallbackHeader = "") {
        if (!existsSync(filePath))
            return;
        try {
            const content = readFileSync(filePath, "utf8");
            const normalizedContent = content.replace(/\r\n/g, "\n");
            const normalizedTemplate = templateContent.replace(/\r\n/g, "\n").trim();
            const normalizedFallback = fallbackHeader.replace(/\r\n/g, "\n");
            const initialFullBlock = (normalizedFallback + normalizedTemplate).trim();
            if (normalizedContent.trim() === initialFullBlock || normalizedContent.trim() === normalizedTemplate) {
                this.removeFile(filePath);
                return;
            }
            if (normalizedContent.includes(normalizedTemplate)) {
                const newContent = normalizedContent.replace(normalizedTemplate, "").trim();
                if (normalizedFallback && newContent === normalizedFallback.trim()) {
                    this.removeFile(filePath);
                }
                else {
                    writeFileSync(filePath, newContent + (newContent ? "\n" : ""), "utf8");
                    console.log(`✅ [${SKILL_NAME}] Removed references from "${logName}".`);
                }
            }
            else {
                const header = normalizedTemplate.split("\n")[0]?.trim();
                if (header && normalizedContent.includes(header)) {
                    console.log(`⚠️  [${SKILL_NAME}] Found header but not exact match in "${logName}". Manual cleanup recommended.`);
                }
            }
        }
        catch (error) {
            console.error(`[${SKILL_NAME}] Failed to clean "${logName}":`, error?.message || error);
            this.hasErrors = true;
        }
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
        const hasArgs = Boolean(values.all) || Boolean(values.agentsmd) || Boolean(values.copilotdir) || Boolean(values.claudemd) || Boolean(values.agentdir) || Boolean(values.cursordir) || Boolean(values.cursormd);
        const targets = { ...values };
        let shouldLinkViaAgentRouter = false;
        if (hasArgs) {
            if (targets.all) {
                targets.agentdir = true;
                targets.agentsmd = true;
                targets.claudemd = true;
                targets.copilotdir = true;
                targets.cursordir = true;
                targets.cursormd = true;
                shouldLinkViaAgentRouter = true;
            }
            else {
                shouldLinkViaAgentRouter = Boolean(targets.agentdir);
            }
        }
        else {
            const rl = createInterface({ input, output });
            console.log(`\n🗑️  ${SKILL_NAME} Uninstall Matrix:`);
            console.log("\t1. Uninstall everything");
            console.log("\t2. Cancel");
            try {
                const selection = (await rl.question("\n👉 Select option (1-2): ")).trim();
                if (selection === "1") {
                    targets.all = true;
                    targets.agentdir = true;
                    targets.agentsmd = true;
                    targets.claudemd = true;
                    targets.copilotdir = true;
                    targets.cursordir = true;
                    targets.cursormd = true;
                    shouldLinkViaAgentRouter = true;
                }
                else {
                    console.log(`\nℹ️ [${SKILL_NAME}] Uninstallation canceled.`);
                    rl.close();
                    return;
                }
            }
            finally {
                rl.close();
            }
        }
        const shouldCleanRootMarkdown = Boolean(targets.agentsmd) || Boolean(targets.claudemd) || Boolean(targets.cursormd);
        if (shouldCleanRootMarkdown && !targets.agentdir && !targets.copilotdir && !targets.cursordir) {
            targets.agentdir = true;
        }
        console.log(`🏁\t[${SKILL_NAME}] Initializing uninstallation…`);
        if (targets.agentdir) {
            this.removeDir(join(this.workspaceRoot, PATH.AGENT.dir, PATH.AGENT.dirSub, SKILL_NAME));
        }
        if (targets.copilotdir) {
            this.removeDir(join(this.workspaceRoot, PATH.COPILOT.dir, PATH.COPILOT.dirSub, SKILL_NAME));
        }
        if (targets.cursordir) {
            this.removeDir(join(this.workspaceRoot, PATH.CURSOR.dir, PATH.CURSOR.dirSub, SKILL_NAME));
        }
        const templatesSrcDir = join(this.packageRoot, "templates");
        const bestPrinciplesPath = targets.agentdir
            ? join(PATH.AGENT.dir, PATH.AGENT.dirSub, SKILL_NAME, PATH_PRINCIPLES)
            : targets.cursordir
                ? join(PATH.CURSOR.dir, PATH.CURSOR.dirSub, SKILL_NAME, PATH_PRINCIPLES)
                : join(PATH.COPILOT.dir, PATH.COPILOT.dirSub, SKILL_NAME, PATH_PRINCIPLES);
        const bestRulesPath = targets.agentdir
            ? join(PATH.AGENT.dir, PATH.AGENT.dirSub, SKILL_NAME, PATH_RULES)
            : targets.cursordir
                ? join(PATH.CURSOR.dir, PATH.CURSOR.dirSub, SKILL_NAME, PATH_RULES)
                : join(PATH.COPILOT.dir, PATH.COPILOT.dirSub, SKILL_NAME, PATH_RULES);
        const bestRouterPath = shouldLinkViaAgentRouter ? join(PATH.AGENT.dir, PATH.AGENT.dirSub, PATH.AGENT.file) : bestPrinciplesPath;
        if (targets.cursordir) {
            this.removeFile(this.paths.cursordir);
        }
        if (targets.copilotdir) {
            const template = this.getProcessedTemplate(templatesSrcDir, join(PATH.COPILOT.dir, PATH.COPILOT.file), this.paths.copilotdir, join(PATH.COPILOT.dir, PATH.COPILOT.dirSub, SKILL_NAME, PATH_PRINCIPLES), join(PATH.COPILOT.dir, PATH.COPILOT.dirSub, SKILL_NAME, PATH_RULES));
            this.cleanInstructions(this.paths.copilotdir, `${PATH.COPILOT.dir}/${PATH.COPILOT.file}`, template);
        }
        if (targets.agentdir) {
            const template = this.getProcessedTemplate(templatesSrcDir, join(PATH.AGENT.dir, PATH.AGENT.dirSub, PATH.AGENT.file), this.paths.agentdir, join(PATH.AGENT.dir, PATH.AGENT.dirSub, SKILL_NAME, PATH_PRINCIPLES), join(PATH.AGENT.dir, PATH.AGENT.dirSub, SKILL_NAME, PATH_RULES));
            this.cleanInstructions(this.paths.agentdir, `${PATH.AGENT.dir}/${PATH.AGENT.dirSub}/${PATH.AGENT.file}`, template);
        }
        if (targets.agentsmd) {
            const template = this.getProcessedTemplate(templatesSrcDir, PATH.AGENT.fileRoot, this.paths.agentsmd, bestPrinciplesPath, bestRulesPath, bestRouterPath);
            const fallbackHeader = `# Project Agent Instructions\nThis repository enforces strict TypeScript standards.\n\n## Coding Standards\n`;
            this.cleanInstructions(this.paths.agentsmd, PATH.AGENT.fileRoot, template, fallbackHeader);
        }
        if (targets.claudemd) {
            const template = this.getProcessedTemplate(templatesSrcDir, PATH.CLAUDE.fileRoot, this.paths.claudemd, bestPrinciplesPath, bestRulesPath, bestRouterPath);
            this.cleanInstructions(this.paths.claudemd, PATH.CLAUDE.fileRoot, template);
        }
        if (targets.cursormd) {
            const template = this.getProcessedTemplate(templatesSrcDir, PATH.CURSOR.fileRoot, this.paths.cursormd, bestPrinciplesPath, bestRulesPath, bestRouterPath);
            const fallbackHeader = `# Cursor Configuration Rules\n\n## Context Routing\n`;
            this.cleanInstructions(this.paths.cursormd, PATH.CURSOR.fileRoot, template, fallbackHeader);
        }
        if (this.hasErrors) {
            console.error(`\n❌ [${SKILL_NAME}] Uninstallation completed with errors.`);
            process.exit(1);
        }
        console.log(`\n💯 [${SKILL_NAME}] Uninstallation successful.`);
    }
}
new SkillUninstaller().execute().catch((error) => {
    console.error(`[${SKILL_NAME}] Unhandled error during uninstallation:`, error?.message || error);
    process.exit(1);
});
