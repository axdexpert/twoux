// twoux init: sets up the current project so AI coding agents build with TwoUX.
// Never overwrites: appends to AGENTS.md and CLAUDE.md, merges the hook into .claude/settings.json,
// and skips files that already exist (use --force to replace skills and the proposal template).
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const pkg = new URL("..", import.meta.url).pathname;
const cwd = process.cwd();
const force = process.argv.includes("--force");
// --principles: the app is not built with TwoUX and isn't migrating; agents follow TwoUX's principles with the app's own components.
const principles = process.argv.includes("--principles");
const done = [];
const skip = [];

const AGENTS_LINE = principles
	? "This app is not built with TwoUX. Follow the principles in `node_modules/@twoux/ui/agent/AGENTS.md` (every rule not marked TwoUX only) using this app's own components, tokens and brand; never import TwoUX components piecemeal, and keep the look of anything you rebuild. Before finishing, run `npx twoux check --principles`, type-check, and open each changed screen in a browser to try the states you changed; say what you could not verify. To move onto TwoUX, follow `node_modules/@twoux/ui/agent/docs-md/migrating.md`."
	: "Follow `node_modules/@twoux/ui/agent/AGENTS.md` for all UI work: components, tokens, patterns, and how to propose additions. Run `npx twoux check` before finishing.";
const agents = join(cwd, "AGENTS.md");
if (!existsSync(agents)) { writeFileSync(agents, `# Agent instructions\n\n## UI: TwoUX\n\n${AGENTS_LINE}\n`); done.push("AGENTS.md (created)"); }
else if (!readFileSync(agents, "utf8").includes("@twoux/ui/agent/AGENTS.md")) { writeFileSync(agents, `${readFileSync(agents, "utf8").trimEnd()}\n\n## UI: TwoUX\n\n${AGENTS_LINE}\n`); done.push("AGENTS.md (section added)"); }
else skip.push("AGENTS.md already points to TwoUX");

const claude = join(cwd, "CLAUDE.md");
const IMPORT = "@node_modules/@twoux/ui/agent/AGENTS.md";
// In principles mode Claude Code must read the scope line too, not only the imported rules.
const CLAUDE_BLOCK = principles ? `${AGENTS_LINE}\n\n${IMPORT}` : IMPORT;
if (!existsSync(claude)) { writeFileSync(claude, `${CLAUDE_BLOCK}\n`); done.push("CLAUDE.md (created)"); }
else if (!readFileSync(claude, "utf8").includes(IMPORT)) { writeFileSync(claude, `${readFileSync(claude, "utf8").trimEnd()}\n\n${CLAUDE_BLOCK}\n`); done.push("CLAUDE.md (import added)"); }
else skip.push("CLAUDE.md already imports TwoUX");

// Design skills such as Impeccable take the product's voice from PRODUCT.md ("Brand Commitments"), not from AGENTS.md,
// so the TwoUX voice is written there too. Created only when Impeccable is in use; otherwise left alone.
const VOICE = "- Voice (TwoUX): interface copy follows `node_modules/@twoux/ui/agent/docs-md/voice-and-tone.md` and `writing.md`: precise, calm, candid and respectful of expertise; UK English, sentence case, verb-first labels. No humour, playful or celebratory copy, exclamation marks or \"we\"; delight comes from speed and precision, not words. This overrides any general writing or design skill.";
const product = join(cwd, "PRODUCT.md");
const home = process.env.HOME ?? "";
const usesImpeccable = [join(cwd, ".impeccable"), join(cwd, ".claude/skills/impeccable"), join(cwd, ".agents/skills/impeccable"), join(home, ".claude/skills/impeccable")].some((p) => existsSync(p));
if (existsSync(product)) {
	const text = readFileSync(product, "utf8");
	if (text.includes("docs-md/voice-and-tone.md")) skip.push("PRODUCT.md already carries the TwoUX voice");
	else {
		const m = text.match(/^## Brand Commitments[^\n]*\n/m);
		let next = `${text.trimEnd()}\n\n## Brand Commitments\n\n${VOICE}\n`;
		if (m) {
			const head = text.slice(0, m.index + m[0].length);
			const rest = text.slice(m.index + m[0].length);
			next = rest.startsWith("\n- ") ? `${head}\n${VOICE}${rest}` : `${head}\n${VOICE}\n${rest}`;
		}
		writeFileSync(product, next);
		done.push("PRODUCT.md (TwoUX voice in Brand Commitments)");
	}
} else if (usesImpeccable) {
	writeFileSync(product, `# Product\n\n## Brand Commitments\n\n${VOICE}\n`);
	done.push("PRODUCT.md (created with the TwoUX voice; /impeccable init fills in the rest)");
} else skip.push("PRODUCT.md not created (no design skill found that reads it)");

const settingsPath = join(cwd, ".claude/settings.json");
mkdirSync(join(cwd, ".claude"), { recursive: true });
const settings = existsSync(settingsPath) ? JSON.parse(readFileSync(settingsPath, "utf8")) : {};
const hookCmd = 'node "$CLAUDE_PROJECT_DIR/node_modules/@twoux/ui/bin/twoux.mjs" guard';
settings.hooks ??= {};
settings.hooks.PreToolUse ??= [];
if (!JSON.stringify(settings.hooks.PreToolUse).includes("twoux.mjs\\\" guard") && !JSON.stringify(settings.hooks.PreToolUse).includes("twoux.mjs guard")) {
	settings.hooks.PreToolUse.push({ matcher: "Edit|Write|MultiEdit|NotebookEdit|Bash", hooks: [{ type: "command", command: hookCmd }] });
	writeFileSync(settingsPath, `${JSON.stringify(settings, null, 2)}\n`);
	done.push(".claude/settings.json (guard hook)");
} else skip.push("guard hook already set");

// MCP: the same knowledge as tools (find_component, get_doc, list_docs, get_rules, check).
// Claude Code reads .mcp.json; Cursor and VS Code get theirs only when the project already uses them.
const MCP = { command: "npx", args: ["-y", "@twoux/ui", "mcp"] };
for (const [file, key, entry, when] of [
	[".mcp.json", "mcpServers", MCP, true],
	[".cursor/mcp.json", "mcpServers", MCP, existsSync(join(cwd, ".cursor"))],
	[".vscode/mcp.json", "servers", { type: "stdio", ...MCP }, existsSync(join(cwd, ".vscode"))],
]) {
	if (!when) continue;
	const path = join(cwd, file);
	let json = {};
	if (existsSync(path)) {
		try { json = JSON.parse(readFileSync(path, "utf8")); } catch { skip.push(`${file} is not valid JSON, so the TwoUX server was not added`); continue; }
	}
	json[key] ??= {};
	if (json[key].twoux) { skip.push(`${file} already lists twoux`); continue; }
	json[key].twoux = entry;
	writeFileSync(path, `${JSON.stringify(json, null, 2)}\n`);
	done.push(`${file} (TwoUX MCP server)`);
}

// Build, design and propose assume @twoux/ui; an app that only follows the principles gets audit and write.
for (const s of principles ? ["twoux-audit", "twoux-write"] : ["twoux-audit", "twoux-build", "twoux-design", "twoux-propose", "twoux-write"]) {
	const to = join(cwd, ".claude/skills", s);
	if (!existsSync(join(pkg, "agent/skills", s))) continue; // not in this edition
	if (existsSync(to) && !force) { skip.push(`.claude/skills/${s} exists`); continue; }
	cpSync(join(pkg, "agent/skills", s), to, { recursive: true });
	done.push(`.claude/skills/${s}`);
}

if (principles) skip.push("twoux.theme.json not created (--principles: the app keeps its own theme)");
else if (!existsSync(join(cwd, "twoux.theme.json"))) {
	const t = JSON.parse(readFileSync(join(pkg, "theme.json"), "utf8"));
	writeFileSync(join(cwd, "twoux.theme.json"), `${JSON.stringify(t, null, 2)}\n`);
	done.push("twoux.theme.json (default: indigo, 4/6/8px)");
} else skip.push("twoux.theme.json exists");

if (!principles) mkdirSync(join(cwd, "proposals"), { recursive: true });
if (!principles && existsSync(join(pkg, "agent/proposals-TEMPLATE.md")) && (!existsSync(join(cwd, "proposals/TEMPLATE.md")) || force)) { cpSync(join(pkg, "agent/proposals-TEMPLATE.md"), join(cwd, "proposals/TEMPLATE.md")); done.push("proposals/TEMPLATE.md"); }

console.log("TwoUX is set up for AI agents.\n");
for (const d of done) console.log(`  + ${d}`);
for (const s of skip) console.log(`  · ${s}`);
console.log(principles
	? "\nNext: ask your agent to /twoux-audit a screen. It reviews it against TwoUX's principles and proposes fixes in your own components."
	: "\nNext: import '@twoux/ui/styles.css' (then './twoux-theme.css' after running npx twoux theme), and ask your agent to /twoux-audit a screen.");
