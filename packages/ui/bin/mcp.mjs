// twoux mcp: TwoUX's Model Context Protocol server over stdio, with no dependencies.
// Agents ask it the same questions people ask the docs: which component fits a job, what a page says,
// what the rules are, and whether code passes `twoux check`. Messages are newline-delimited JSON-RPC 2.0.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { findJob, formatList, formatMatches, getDoc, pkg, rules } from "./knowledge.mjs";

const VERSION = JSON.parse(readFileSync(join(pkg, "package.json"), "utf8")).version;
const PROTOCOLS = ["2025-06-18", "2025-03-26", "2024-11-05"];

const INSTRUCTIONS = `TwoUX is the design system for this app's UI. Before writing UI: call find_component with the job in plain words, then get_doc for the page it names (read "When not to use"). Call get_rules once per task for the full rule set. Before finishing, call check on the files you changed and fix every error.`;

const TOOLS = [
	{
		name: "find_component",
		title: "Find the component for a job",
		description: "Given a UI job in plain words (\"confirm a permanent delete\", \"filter a list by a few fields\"), return the one TwoUX component or pattern to use, how to use it and what not to use instead.",
		inputSchema: { type: "object", properties: { job: { type: "string", description: "What the UI must do, in plain words." } }, required: ["job"] },
		annotations: { readOnlyHint: true },
		run: ({ job }) => formatMatches(findJob(job)),
	},
	{
		name: "get_doc",
		title: "Read a TwoUX page",
		description: "Return one foundation, component or pattern page as Markdown: when to use, when not to use, behaviour, accessibility, keyboard, API, example code and sources. Accepts an id (side-panel) or a name (Side panel).",
		inputSchema: { type: "object", properties: { id: { type: "string", description: "Page id or name, such as button, side-panel or filtering-search." } }, required: ["id"] },
		annotations: { readOnlyHint: true },
		run: ({ id }) => {
			const doc = getDoc(id);
			if (doc) return doc.text;
			throw new Error(`No page called "${id}". Call list_docs for every id, or find_component with the job.`);
		},
	},
	{
		name: "list_docs",
		title: "List TwoUX pages",
		description: "List every page id and name, grouped by kind. Filter with kind: component, pattern or foundation.",
		inputSchema: { type: "object", properties: { kind: { type: "string", enum: ["component", "pattern", "foundation"] } } },
		annotations: { readOnlyHint: true },
		run: ({ kind }) => formatList(kind),
	},
	{
		name: "get_rules",
		title: "Read the TwoUX rules",
		description: "Return AGENTS.md: the steps before writing UI, every rule with its reason, and the full job-to-component table.",
		inputSchema: { type: "object", properties: {} },
		annotations: { readOnlyHint: true },
		run: () => rules(),
	},
	{
		name: "check",
		title: "Run twoux check",
		description: "Lint app code against TwoUX's rules (raw colours, arbitrary values, inline styles, local copies, bypassed imports, copy tone). Returns the report; errors must be fixed before finishing.",
		inputSchema: {
			type: "object",
			properties: {
				paths: { type: "array", items: { type: "string" }, description: "Files or folders relative to the project root. Default: src." },
				principles: { type: "boolean", description: "The app is not built with TwoUX: run only the checks that hold outside it." },
			},
		},
		annotations: { readOnlyHint: true },
		run: ({ paths = [], principles = false }) => {
			const safe = paths.filter((p) => typeof p === "string" && !p.startsWith("-"));
			const r = spawnSync(process.execPath, [join(pkg, "bin/twoux.mjs"), "check", ...(principles ? ["--principles"] : []), ...safe], { cwd: process.cwd(), encoding: "utf8", timeout: 120_000 });
			const out = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim() || "No output.";
			return r.status === 0 ? out : { text: out, isError: true };
		},
	},
];

const send = (msg) => process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", ...msg })}\n`);

function handle(req) {
	const { id, method, params = {} } = req;
	switch (method) {
		case "initialize":
			return {
				protocolVersion: PROTOCOLS.includes(params.protocolVersion) ? params.protocolVersion : PROTOCOLS[0],
				capabilities: { tools: {} },
				serverInfo: { name: "twoux", title: "TwoUX", version: VERSION },
				instructions: INSTRUCTIONS,
			};
		case "ping":
			return {};
		case "tools/list":
			return { tools: TOOLS.map(({ run, ...t }) => t) };
		case "tools/call": {
			const tool = TOOLS.find((t) => t.name === params.name);
			if (!tool) throw Object.assign(new Error(`Unknown tool: ${params.name}`), { code: -32602 });
			try {
				const out = tool.run(params.arguments ?? {});
				const { text, isError } = typeof out === "string" ? { text: out, isError: false } : out;
				return { content: [{ type: "text", text }], isError };
			} catch (e) {
				return { content: [{ type: "text", text: e.message }], isError: true };
			}
		}
		default:
			if (id === undefined) return undefined; // notifications such as notifications/initialized need no reply
			throw Object.assign(new Error(`Method not found: ${method}`), { code: -32601 });
	}
}

createInterface({ input: process.stdin }).on("line", (line) => {
	if (!line.trim()) return;
	let req;
	try { req = JSON.parse(line); } catch { return send({ id: null, error: { code: -32700, message: "Parse error" } }); }
	try {
		const result = handle(req);
		if (req.id !== undefined && result !== undefined) send({ id: req.id, result });
	} catch (e) {
		if (req.id !== undefined) send({ id: req.id, error: { code: e.code ?? -32603, message: e.message } });
	}
});
