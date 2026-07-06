import path from "node:path";
import { fileURLToPath } from "node:url";
import { makeContext, cleanup } from "../utils/cleanup.js";
import { assertFileContains, assertFileExists, assertInstalledPackage, installPackedArchive, run } from "../utils/install-test.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, "..", "..");
const testDir = path.resolve(__dirname);
const ctx = makeContext(testDir);

(async () => {
	try {
		await installPackedArchive(ctx, repoRoot);
		run("npx hardwired-install-typescript --all", { cwd: ctx.testDir });

		assertInstalledPackage(ctx.testDir);

		const internalPrinciplesPath = "./.cursor/rules/hardwired-skill-typescript/principles.md";
		const publicRouterPath = "./.agent/skills/hardwired-skill-typescript.md";

		// Verify structural directory installations
		assertFileContains(path.join(ctx.testDir, ".github", "copilot-instructions.md"), internalPrinciplesPath, ".github/copilot-instructions.md");
		assertFileContains(path.join(ctx.testDir, ".agent", "skills", "hardwired-skill-typescript.md"), internalPrinciplesPath, ".agent/skills/hardwired-skill-typescript.md");

		const mdcRulesContentSnippet = "Follow `principles.md` as the absolute single source of truth";
		assertFileContains(path.join(ctx.testDir, ".cursor", "rules", "hardwired-skill-typescript.mdc"), mdcRulesContentSnippet, ".cursor/rules/hardwired-skill-typescript.mdc");

		// Verify Root Router configurations mapping to public router path
		assertFileContains(path.join(ctx.testDir, "AGENTS.md"), publicRouterPath, "AGENTS.md");
		assertFileContains(path.join(ctx.testDir, "CLAUDE.md"), publicRouterPath, "CLAUDE.md");
		assertFileContains(path.join(ctx.testDir, "CURSOR.md"), publicRouterPath, "CURSOR.md");

		// Validate assets existence guarantees
		assertFileExists(path.join(ctx.testDir, ".cursor", "rules", "hardwired-skill-typescript", "principles.md"), "Installed internal cursor principles file");
		assertFileExists(path.join(ctx.testDir, ".agent", "skills", "hardwired-skill-typescript", "principles.md"), "Installed internal agent principles file");
		assertFileExists(path.join(ctx.testDir, ".github", "skills", "hardwired-skill-typescript", "principles.md"), "Installed internal copilot principles file");

		console.log("Install all: SUCCESS — installed files left in test folder.");
	} catch (error) {
		console.error("Install all: FAILED", error && error.message ? error.message : error);
		process.exitCode = 1;
	} finally {
		cleanup(ctx);
	}
})();
