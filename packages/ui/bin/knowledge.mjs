// Shared lookups over TwoUX's agent knowledge, used by `twoux docs`, `twoux find` and `twoux mcp`.
// Reads only files shipped in the package: agent/AGENTS.md, agent/docs-md/*.md and registry/jobs.json.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const pkg = new URL("..", import.meta.url).pathname;
const docsDir = join(pkg, "agent/docs-md");

export const rules = () => readFileSync(join(pkg, "agent/AGENTS.md"), "utf8");

let docsCache;
/** Every page: id, name, kind (foundation, component, pattern…), one-line summary. */
export function listDocs() {
	if (docsCache) return docsCache;
	docsCache = readdirSync(docsDir)
		.filter((f) => f.endsWith(".md"))
		.map((f) => {
			const lines = readFileSync(join(docsDir, f), "utf8").split("\n");
			const name = (lines.find((l) => l.startsWith("# ")) ?? f).replace(/^# /, "");
			const summary = lines.find((l, i) => i > 0 && l.trim() && !l.startsWith("#")) ?? "";
			const meta = lines.find((l) => l.startsWith("Kind: ")) ?? "";
			const kind = meta.match(/^Kind: ([^·]+)/)?.[1].trim() ?? "foundation";
			const status = meta.match(/Status: ([^·]+)/)?.[1].trim() ?? "";
			return { id: f.replace(/\.md$/, ""), name, kind, status, summary: summary === meta ? "" : summary };
		})
		.sort((a, b) => a.id.localeCompare(b.id));
	return docsCache;
}

export function getDoc(id) {
	const clean = String(id).toLowerCase().trim().replace(/\.md$/, "").replace(/[^a-z0-9-]/g, "-");
	const file = join(docsDir, `${clean}.md`);
	if (existsSync(file)) return { id: clean, text: readFileSync(file, "utf8") };
	// Accept a name such as "Side panel" or "SidePanel".
	const flat = String(id).toLowerCase().replace(/[^a-z0-9]/g, "");
	const hit = listDocs().find((d) => d.name.toLowerCase().replace(/[^a-z0-9]/g, "") === flat || d.id.replace(/-/g, "") === flat);
	return hit ? { id: hit.id, text: readFileSync(join(docsDir, `${hit.id}.md`), "utf8") } : null;
}

const jobsFile = join(pkg, "registry/jobs.json");
const STOP = new Set("a an and the of to for in on or with by at as is it its that this from into show let people someone".split(" "));
const words = (s) => String(s).toLowerCase().replace(/[`"“”]/g, " ").split(/[^a-z0-9]+/).filter((w) => w.length > 1 && !STOP.has(w)).map((w) => w.replace(/(?:ly|ing|ed|es|s)$/, ""));

/** Rank the job table, then page summaries, against a plain-language job such as "confirm a delete". */
export function findJob(query, limit = 5) {
	const q = new Set(words(query));
	if (!q.size) return [];
	const docs = Object.fromEntries(listDocs().map((d) => [d.id, d]));
	// Jobs that cover more of the query's words rank first; weights break ties.
	const hits = (...texts) => new Set(texts.flatMap(words).filter((w) => q.has(w))).size * 10;
	const score = (text, weight) => words(text).reduce((n, w) => n + (q.has(w) ? weight : 0), 0);
	const named = (id) => docs[id]?.name ?? id;
	const jobs = JSON.parse(readFileSync(jobsFile, "utf8")).jobs.map((j) => ({
		job: j.job,
		use: j.use,
		name: docs[j.use]?.name ?? j.use,
		how: j.how ?? "",
		notThis: (j.notThis ?? []).map(named),
		score: hits(j.job, named(j.use), j.how ?? "") + score(j.job, 3) + score(docs[j.use]?.name ?? j.use, 2) + score(j.how ?? "", 1),
	}));
	const seen = new Set();
	const ranked = jobs.filter((j) => j.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
	for (const j of ranked) seen.add(j.use);
	// Pages that no job names directly, matched on their name and summary.
	const pages = listDocs()
		.filter((d) => !seen.has(d.id))
		.map((d) => ({ job: d.summary, use: d.id, name: d.name, how: "", notThis: [], score: hits(d.name, d.summary) + score(d.name, 3) + score(d.summary, 1) }))
		.filter((d) => d.score > 11)
		.sort((a, b) => b.score - a.score)
		.slice(0, Math.max(0, limit - ranked.length));
	return [...ranked, ...pages];
}

export function formatMatches(matches) {
	if (!matches.length) return "No job matched. Run `twoux docs` to list every page, or read the job table in AGENTS.md.";
	return matches
		.map((m) => [`${m.job}\n  Use: ${m.name} (twoux docs ${m.use})`, m.how && `  How: ${m.how.replace(/`/g, "")}`, m.notThis.length && `  Not this: ${m.notThis.join(", ")}`].filter(Boolean).join("\n"))
		.join("\n\n");
}

export function formatList(kind) {
	const docs = listDocs().filter((d) => !kind || d.kind === kind);
	const kinds = [...new Set(docs.map((d) => d.kind))];
	return kinds
		.map((k) => `## ${k}\n${docs.filter((d) => d.kind === k).map((d) => `- ${d.id}: ${d.name}${d.status && !d.status.startsWith("built") ? ` (${d.status})` : ""}`).join("\n")}`)
		.join("\n\n");
}
