// Every component file must be exported from @twoux/ui, or agents can't use it (Select was missed once).
import { readdirSync, readFileSync } from "node:fs";
const dir = new URL("../../packages/ui/src/components/", import.meta.url);
const index = readFileSync(new URL("../../packages/ui/src/index.ts", import.meta.url), "utf8");
const missing = readdirSync(dir).filter((f) => f.endsWith(".tsx")).map((f) => f.slice(0, -4)).filter((c) => !index.includes(`./components/${c}"`));
if (missing.length) { console.error(`Not exported from packages/ui/src/index.ts: ${missing.join(", ")}`); process.exit(1); }
console.log("Exports: every component file is exported.");
