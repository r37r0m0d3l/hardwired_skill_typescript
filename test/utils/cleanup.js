import fs from "node:fs";
import path from "node:path";

export function makeContext(testDir) {
	return {
		createdTestPkg: false,
		src: null,
		destPacked: null,
		extractDir: null,
		nodeModules: null,
		testPkg: null,
		testDir: testDir,
	};
}

export function cleanup(ctx) {
	if (!ctx) {
		return;
	}
	try {
		const { createdTestPkg, testPkg, destPacked, src, nodeModules, extractDir, testDir } = ctx;

		if (createdTestPkg && testPkg && fs.existsSync(testPkg)) {
			try {
				fs.rmSync(testPkg, { force: true });
				console.log(`Removed test package.json: ${testPkg}`);
			} catch (_error) {
				// ignore errors removing test package
			}
		}

		if (destPacked && fs.existsSync(destPacked)) {
			try {
				fs.rmSync(destPacked, { force: true });
				console.log(`Removed copied packed archive: ${destPacked}`);
			} catch (_error) {
				// ignore errors removing packed archive
			}
		}

		if (src && fs.existsSync(src)) {
			try {
				fs.rmSync(src, { force: true });
				console.log(`Removed repo packed archive: ${src}`);
			} catch (_error) {
				// ignore if unable to remove (permissions or other tooling expects it)
			}
		}

		const nm = nodeModules || path.join(testDir || ".", "node_modules");
		if (fs.existsSync(nm)) {
			try {
				fs.rmSync(nm, { recursive: true, force: true });
				console.log(`Removed test node_modules: ${nm}`);
			} catch (_error) {
				// ignore errors during node_modules removal
			}
		}

		if (extractDir && fs.existsSync(extractDir)) {
			try {
				fs.rmSync(extractDir, { recursive: true, force: true });
				console.log(`Removed extract dir: ${extractDir}`);
			} catch (_error) {
				// ignore errors during extract dir removal
			}
		}

		// Remove generated files and directories created by installation
		const generated = ["AGENTS.md", "CLAUDE.md", "CURSOR.md", ".agent", ".cursor", ".github"];
		for (const name of generated) {
			const pathToTestDir = path.join(testDir || ".", name);
			if (fs.existsSync(pathToTestDir)) {
				try {
					fs.rmSync(pathToTestDir, { recursive: true, force: true });
					console.log(`Removed generated item: ${pathToTestDir}`);
				} catch (_error) {
					// ignore
				}
			}
		}
	} catch (cleanupErr) {
		console.error("Cleanup failed:", cleanupErr && cleanupErr.message ? cleanupErr.message : cleanupErr);
	}
}
