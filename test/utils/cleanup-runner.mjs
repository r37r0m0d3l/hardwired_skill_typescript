import path from "node:path";
import {fileURLToPath} from "node:url";
import {makeContext, cleanup} from "./cleanup.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testDirs = ["agentsmd", "claudemd", "agentdir", "copilotdir", "all"];

async function runDir(testDir) {
	try {
		console.log(`Running cleanup for: ${testDir}`);
		const ctx = await makeContext(testDir);
		await cleanup(ctx);
		return {ok: true, testDir};
	} catch (error) {
		console.error(`Cleanup failed for ${testDir}:`, error && error.stack ? error.stack : error);
		return {ok: false, testDir};
	}
}

export async function main() {
	const tasks = testDirs.map((dir) => runDir(path.join(__dirname, "..", dir)));
	const results = await Promise.allSettled(tasks);
	let failed = false;
	for (const r of results) {
		if (r.status === "fulfilled") {
			if (!r.value.ok) failed = true;
		} else {
			failed = true;
			console.error("Cleanup task crashed:", r.reason && r.reason.stack ? r.reason.stack : r.reason);
		}
	}
	console.log("Cleanup runner finished.");
	return failed;
}

// If executed directly, run and exit with appropriate code. If imported, caller can await main().
if (process.argv[1] === __filename) {
	main()
		.then((failed) => process.exit(failed ? 1 : 0))
		.catch((err) => {
			console.error("Cleanup runner encountered a fatal error:", err && err.stack ? err.stack : err);
			process.exit(1);
		});
}
