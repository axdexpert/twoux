// twoux check: catches the drift TwoUX exists to stop, in app code and in TwoUX itself.
//   twoux check [--base <git ref>] [--app-only] [--principles] [--check-links] [paths...]   (run from the project root; default path: src)
//   --principles: for an app not built with TwoUX; runs only the checks that hold outside it (copy tone).
// Errors fail the run (exit 1). Warnings are printed for review.
import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const pkg = new URL("..", import.meta.url).pathname; // the installed @twoux/ui package
const root = process.cwd(); // the project being checked
const inTwoUXRepo = existsSync(join(root, "packages/ui/bin/check.mjs"));
const args = process.argv.slice(2);
const baseAt = args.indexOf("--base");
const base = baseAt >= 0 ? args.splice(baseAt, 2)[1] : "HEAD";
const appOnly = args.includes("--app-only");
const checkLinks = args.includes("--check-links"); // open every proposal link (needs network)
if (checkLinks) args.splice(args.indexOf("--check-links"), 1);
if (appOnly) args.splice(args.indexOf("--app-only"), 1); // skip the "TwoUX was edited" check (maintainers)
const principles = args.includes("--principles"); // app not built with TwoUX: skip token, import and restyle checks
if (principles) args.splice(args.indexOf("--principles"), 1);
const PRINCIPLE_RULES = new Set(["tone"]);
const roots = args.length ? args : [existsSync(join(root, "apps/playground/src")) ? "apps/playground/src" : "src"];

// Names exported by @twoux/ui: an app file that defines one of these is a local copy.
const index = readFileSync(join(pkg, "src/index.ts"), "utf8");
const exported = new Set();
for (const m of index.matchAll(/from "\.\/components\/([\w-]+)"/g)) {
	const src = readFileSync(join(pkg, `src/components/${m[1]}.tsx`), "utf8");
	for (const e of src.matchAll(/export\s+(?:function|const)\s+([A-Z]\w+)/g)) exported.add(e[1]);
	for (const e of src.matchAll(/export\s*\{([^}]+)\}/g)) for (const n of e[1].split(",")) { const name = n.trim().split(/\s+as\s+/).pop(); if (/^[A-Z]/.test(name)) exported.add(name); }
}


const RULES = [
	{ level: "error", id: "raw-colour", re: /#[0-9a-fA-F]{3,8}\b(?![\w-])|\b(?:rgba?|hsla?|oklch|oklab)\(/g, msg: "Raw colour. Use a role token (bg-surface, text-ink-2, border-line…) or change the brand in the theme file (twoux.theme.json)." },
	{ level: "error", id: "arbitrary-value", re: /(?<![\w-])(?!(?:[\w-]*:)*(?:has|data|aria|group-[\w-]+|peer-[\w-]+|supports|not|in|nth|grid-cols|grid-rows|col-span|row-span|grid-areas)-\[)(?:[\w-]+:)*[\w-]+-\[(?!--)[^\]\s]+\]/g, msg: "Arbitrary Tailwind value. Use a token step (p-3, rounded-sm, text-base, h-control…). Grid templates and variant selectors are allowed." },
	{ level: "error", id: "inline-style", re: /\bstyle=\{\{(?!\s*["']--[\w-]+["']\s*:)/g, msg: "Inline style. Use TwoUX utilities. Data-driven values (a bar width) may pass one CSS variable: style={{ \"--w\": \"30%\" }} with w-(--w)." },
	{ level: "error", id: "bypass-import", re: /from\s+["'](?:radix-ui|@radix-ui\/[\w-]+|cmdk|sonner|vaul|@\/components\/ui\/[\w-]+|[./]+packages\/ui\/src\/(?:shadcn|components)\/[\w-]+)["']/g, msg: "Imports a primitive directly. Import from @twoux/ui, where the tailored version lives." },
	{ level: "warn", id: "palette-step", re: /\b(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:neutral|indigo|blue|teal|green|amber|orange|red|magenta|brand)-\d{2,3}\b/g, msg: "Palette step in product code. Use a role (primary, ok, warn, bad, ink, line…); steps are for charts and reviewed illustrations." },
	{ level: "warn", id: "tone", re: /["'`>][^"'`<>{}]*?\b(?:Oops|Whoops|Uh-oh|Woohoo|Yay|Hooray|Awesome|[Ss]uccessfully|AI-powered|Sorry|[Pp]lease|We)\b/g, msg: "Copy off the TwoUX voice. Say what happened and what to do next, with no apology, please, \"we\", hype or celebration. See Voice and tone." },
	{ level: "warn", id: "raw-spacing", re: /(?<![\w-])(?:[\w-]+:)*(?:p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-(?!0(?![.\d]))\d+(?:\.5)?(?![\w.-])/g, msg: "Numeric spacing in app code. Use a role: inside a control gap-hair (2px), gap-tight (4px), gap-control (6px), gap-inline (8px); between parts gap-group; inside a card, pane or panel p-region; page sides px-page, top pt-page-top. Region roles tighten by themselves in a workspace (AppShell frame=\"flush\")." },
	{ level: "warn", id: "raw-control", re: /<(button|input|select|textarea)\b(?![^>]*type=["'](?:hidden|file)["'])/g, msg: "Raw control. Use Button, Input/TextField, Checkbox, Switch… from @twoux/ui." },
];

const files = [];
const walk = (p) => {
	if (!existsSync(p)) return;
	if (statSync(p).isDirectory()) { for (const f of readdirSync(p)) if (f !== "node_modules" && !f.startsWith(".")) walk(join(p, f)); }
	else if (/\.(tsx?|jsx?|css)$/.test(p)) files.push(p);
};
for (const r of roots) walk(join(root, r));

const findings = [];
for (const f of files) {
	const text = readFileSync(f, "utf8");
	// Theme CSS written by `twoux theme` holds the palette on purpose.
	if (/^\/\* Generated by twoux theme/.test(text)) continue;
	const lines = text.split("\n");
	const rel = relative(root, f);
	// File-level opt-out for one rule, with a reason: // twoux-check-disable raw-colour: code sample text
	const disabled = new Set([...text.matchAll(/twoux-check-disable\s+([\w-]+)/g)].map((m) => m[1]));
	lines.forEach((line, i) => {
		if (/twoux-check-ignore/.test(line)) return;
		for (const r of RULES) if (!disabled.has(r.id) && (!principles || PRINCIPLE_RULES.has(r.id))) for (const m of line.matchAll(r.re)) findings.push({ level: r.level, id: r.id, where: `${rel}:${i + 1}`, hit: m[0].slice(0, 40), msg: r.msg });
	});
	if (!principles) for (const m of text.matchAll(/(?:export\s+)?(?:function|const)\s+([A-Z]\w+)\s*[=(]/g)) {
		if (exported.has(m[1])) findings.push({ level: "error", id: "local-copy", where: `${rel}:${text.slice(0, m.index).split("\n").length}`, hit: m[1], msg: `Defines ${m[1]}, which @twoux/ui already exports. Import it instead of rebuilding it.` });
	}

}

// Restyling a TwoUX control on one page: padding, height, radius, type size or weight passed through className.
// Layout classes (margin, width, flex, grid, order) are fine; the control's own look is not.
const CONTROL = /(Button|Item|Input|Textarea|Badge|Trigger|Toggle|Checkbox|Switch|Kbd|Segment|Radio|Tab|Field)$/;
const RESTYLE = /(?:^|\s)(?:[\w-]+:)*(?:p[xytrbl]?-\d|h-\d|min-h-\d|size-\d|rounded(?:-[a-z]+)?\b|text-(?:xs|sm|base|md|lg|xl|2xl)\b|font-(?:normal|medium|semibold|bold)\b|leading-|tracking-)/;
for (const f of files) {
	if (principles || !/\.(tsx|jsx)$/.test(f)) continue;
	const text = readFileSync(f, "utf8");
	if (/twoux-check-disable\s+local-restyle/.test(text)) continue;
	for (const m of text.matchAll(/<([A-Z]\w*)\b[^<>]*?className=(?:"([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/g)) {
		const [name, cls] = [m[1], m[2] ?? m[3] ?? m[4] ?? ""];
		if (!exported.has(name) || !CONTROL.test(name)) continue;
		const hit = cls.split(/\s+/).find((c) => RESTYLE.test(` ${c}`));
		if (hit) findings.push({ level: "error", id: "local-restyle", where: `${relative(root, f)}:${text.slice(0, m.index).split("\n").length}`, hit: `${name} ${hit}`, msg: `Restyles ${name} on one page. Use its variant and size props; to change it everywhere, change the theme file (twoux.theme.json).` });
	}
}

// Proposals must cite at least two linked sources.
const propDir = join(root, "proposals");
if (existsSync(propDir)) for (const p of readdirSync(propDir)) {
	if (!p.endsWith(".md") || p === "TEMPLATE.md") continue;
	const text = readFileSync(join(propDir, p), "utf8");
	const sources = (text.split(/^## Sources/m)[1] ?? "").split(/^## /m)[0];
	const links = sources.match(/https?:\/\/[^\s)>\]]+/g) ?? [];
	if (checkLinks) for (const url of links) {
		try {
			const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(10000), headers: { "user-agent": "twoux-check" } });
			if (res.status >= 400) findings.push({ level: "error", id: "dead-link", where: `proposals/${p}`, hit: `${res.status} ${url}`, msg: "This source link doesn't open. Replace it with a working page." });
		} catch (e) { findings.push({ level: "warn", id: "link-unreachable", where: `proposals/${p}`, hit: url, msg: `Couldn't reach this link (${e.name}). Check it by hand.` }); }
	}
	if (links.length < 2) findings.push({ level: "error", id: "proposal-sources", where: `proposals/${p}`, hit: `${links.length} links`, msg: "A proposal needs at least two linked sources under ## Sources (design systems, WAI-ARIA APG, WCAG, usability research). Check each link opens." });
}

// Changes to TwoUX itself. theme.json (and the theme.css it generates) is the one sanctioned way to change the look.
let changed = [];
if (!appOnly && inTwoUXRepo) try {
	const out = execSync(`git -C "${root}" diff --name-only ${base} -- packages/ui && git -C "${root}" ls-files --others --exclude-standard -- packages/ui`, { encoding: "utf8" });
	changed = out.split("\n").filter(Boolean).filter((p) => !/packages\/ui\/(theme\.json|src\/styles\/theme\.css)$/.test(p));
} catch { /* not a git checkout */ }
for (const p of changed) findings.push({ level: "error", id: "edited-twoux", where: p, hit: "", msg: `TwoUX itself was changed since ${base}. Don't edit @twoux/ui from app work: use props or composition instead (see AGENTS.md).` });

const errors = findings.filter((f) => f.level === "error");
const warns = findings.filter((f) => f.level === "warn");
const show = (list, label) => {
	if (!list.length) return;
	console.log(`\n${label} (${list.length})`);
	for (const f of list) console.log(`  ${f.where}  ${f.id}${f.hit ? `  ${f.hit}` : ""}\n      ${f.msg}`);
};
console.log(`twoux check: ${files.length} files in ${roots.join(", ")}${inTwoUXRepo && !appOnly ? `; TwoUX changes since ${base}: ${changed.length}` : ""}`);
show(errors, "Errors");
show(warns, "Warnings");
if (!findings.length) console.log("No problems found.");
process.exit(errors.length ? 1 : 0);
