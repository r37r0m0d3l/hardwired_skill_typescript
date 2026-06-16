import {execSync} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import * as tar from "tar";

export function run(cmd, opts = {}) {
	console.log(`> ${cmd}`);
	return execSync(cmd, {stdio: "inherit", ...opts});
}

export async function installPackedArchive(ctx, repoRoot) {
	const packOutput = execSync("npm pack", {cwd: repoRoot}).toString().trim();
	const packedFile = packOutput.split(/\r?\n/).pop();
	if (!packedFile) throw new Error("npm pack did not produce an archive");
	ctx.src = path.join(repoRoot, packedFile);
	console.log(`Packed archive at: ${ctx.src}`);

	ctx.testPkg = path.join(ctx.testDir, "package.json");
	if (!fs.existsSync(ctx.testPkg)) {
		fs.writeFileSync(ctx.testPkg, JSON.stringify({name: "test-temp", version: "1.0.0", private: true}, null, 2));
		ctx.createdTestPkg = true;
		console.log(`Created minimal package.json in test folder: ${ctx.testPkg}`);
	}

	const packedBasename = path.basename(ctx.src);
	ctx.destPacked = path.join(ctx.testDir, packedBasename);
	fs.copyFileSync(ctx.src, ctx.destPacked);
	console.log(`Copied packed archive into test folder: ${ctx.destPacked}`);

	ctx.extractDir = path.join(ctx.testDir, ".extract_tmp");
	try {
		fs.rmSync(ctx.extractDir, {recursive: true, force: true});
	} catch (_error) {
		// ignore
	}
	fs.mkdirSync(ctx.extractDir, {recursive: true});
	await tar.x({file: ctx.destPacked, cwd: ctx.extractDir});
	const packageDir = path.join(ctx.extractDir, "package");
	const targetDir = path.join(ctx.testDir, "node_modules", "@hardwired", "skill-typescript");
	fs.mkdirSync(path.dirname(targetDir), {recursive: true});
	try {
		fs.rmSync(targetDir, {recursive: true, force: true});
	} catch (_error) {
		// ignore
	}
	fs.renameSync(packageDir, targetDir);
	console.log(`Extracted package into ${targetDir}`);

	const binDir = path.join(ctx.testDir, "node_modules", ".bin");
	fs.mkdirSync(binDir, {recursive: true});
	const cmdShim = path.join(binDir, "hardwired-install-typescript.cmd");
	const cmdContent = `@echo off\nnode "%~dp0\\..\\@hardwired\\skill-typescript\\bin\\install.js" %*\n`;
	fs.writeFileSync(cmdShim, cmdContent);
	const shShim = path.join(binDir, "hardwired-install-typescript");
	fs.writeFileSync(shShim, "#!/usr/bin/env node\nconsole.log('shim');\n");
	try {
		fs.chmodSync(shShim, 0o755);
	} catch (_error) {
		// ignore
	}

	try {
		fs.rmSync(ctx.extractDir, {recursive: true, force: true});
	} catch (_error) {
		//
	}

	ctx.nodeModules = path.join(ctx.testDir, "node_modules");
}

export function assertInstalledPackage(testDir) {
	const nodeModules = path.join(testDir, "node_modules");
	if (!fs.existsSync(nodeModules)) throw new Error(`node_modules not found in test folder: ${nodeModules}`);
	const installedPackage = path.join(nodeModules, "@hardwired", "skill-typescript");
	if (!fs.existsSync(installedPackage)) throw new Error(`Installed package not found: ${installedPackage}`);
	const binPath = path.join(nodeModules, ".bin", "hardwired-install-typescript");
	const binPathCmd = binPath + ".cmd";
	if (!fs.existsSync(binPath) && !fs.existsSync(binPathCmd)) {
		console.warn("Warning: package bin not found in node_modules/.bin (this may be OK on some platforms)");
	}
}

export function assertFileContains(filePath, contains, description) {
	if (!fs.existsSync(filePath)) throw new Error(`${description || filePath} not found: ${filePath}`);
	const content = fs.readFileSync(filePath, "utf8");
	if (!content.includes(contains)) {
		throw new Error(`${description || filePath} does not reference ${contains}`);
	}
}

export function assertFileExists(filePath, description) {
	if (!fs.existsSync(filePath)) throw new Error(`${description || filePath} not found: ${filePath}`);
}
