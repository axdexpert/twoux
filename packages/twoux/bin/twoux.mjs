#!/usr/bin/env node
// twoux: runs the twoux command from @twoux/ui. Uses the copy installed in the current project when there
// is one, so the rules, docs and checks always match the version the app builds with; otherwise the
// copy installed alongside this package.
import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

function resolveFrom(base) {
	try {
		return createRequire(base).resolve("@twoux/ui/package.json");
	} catch {
		return null;
	}
}

const pkgJson = resolveFrom(join(process.cwd(), "noop.js")) ?? resolveFrom(import.meta.url);
if (!pkgJson) {
	console.error("TwoUX is not installed. Run npm install @twoux/ui in your project, then run this command again.");
	process.exit(1);
}
await import(pathToFileURL(join(pkgJson, "..", "bin/twoux.mjs")).href);
