import path from "node:path";
import {fileURLToPath} from "node:url";
import {makeContext, cleanup} from "../utils/cleanup.js";
import {assertFileContains, assertFileExists, assertInstalledPackage, installPackedArchive, run} from "../utils/install-test.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, "..", "..");
const testDir = path.resolve(__dirname);
const ctx = makeContext(testDir);

(async () => {
	try {
		await installPackedArchive(ctx, repoRoot);
		run("npx hardwired-install-typescript --agentsmd", {cwd: ctx.testDir});

		assertInstalledPackage(ctx.testDir);

		const installedPrinciplesPath = "./.agent/skills/hardwired-skill-typescript/principles.md";
		assertFileContains(path.join(ctx.testDir, "AGENTS.md"), installedPrinciplesPath, "AGENTS.md");
		assertFileExists(path.join(ctx.testDir, ".agent", "skills", "hardwired-skill-typescript", "principles.md"), "Installed principles file");

		console.log("Install `AGENTS.md`: SUCCESS — installed files left in test folder.");
	} catch (error) {
		console.error("Install `AGENTS.md`: FAILED", error && error.message ? error.message : error);
		process.exitCode = 1;
	} finally {
		cleanup(ctx);
	}
})();
