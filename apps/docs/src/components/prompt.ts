import { type Doc, type Example, apiFor } from "../content";

/**
 * The Prompt tab: a short brief a coding agent can act on, generated from data the docs already hold
 * (the example's meta and source, the component's guidance and API). Nothing is written by hand, so it
 * can't drift from the page.
 */
const take = <T,>(xs: T[] | undefined, n: number) => (xs ?? []).slice(0, n);

/** Names the example imports from docs data files, grouped by file: these are what the person replaces. */
function dataImports(code: string) {
	return [...code.matchAll(/import\s*\{([^}]+)\}\s*from\s*"(\.\.?\/[^"]+)"/g)]
		.map((m) => ({ names: m[1].split(",").map((n) => n.trim().replace(/^type\s+/, "")).filter(Boolean), file: m[2] }))
		.filter((d) => /(^|\/)data$/.test(d.file));
}

/** Components the example uses from the package, in the order they appear. */
function uiImports(code: string) {
	return [...code.matchAll(/import\s*\{([^}]+)\}\s*from\s*"@twoux\/ui"/g)]
		.flatMap((m) => m[1].split(","))
		.map((n) => n.trim())
		.filter((n) => /^[A-Z]/.test(n) && !n.startsWith("type "));
}

export function examplePrompt(doc: Doc, example: Example) {
	const code = example.code.trim();
	const api = (apiFor(doc.id)?.api ?? []).map((a) => a.component);
	const used = code ? uiImports(code) : api;
	const page = `${location.origin}/docs-md/${doc.id}.md`;
	const chart = doc.group === "Data visualisation";
	const lines: string[] = [];
	const section = (title: string, body: string[]) => body.length && lines.push("", `## ${title}`, ...body);

	lines.push(`Build with TwoUX (@twoux/ui). Follow node_modules/@twoux/ui/agent/AGENTS.md.`);
	section("Goal", [`${example.title}${example.description ? `: ${example.description}` : "."}`]);
	section("Use", [
		`${doc.name}${used.length ? `: ${used.join(", ")}` : ""} from @twoux/ui. ${doc.summary}`,
		...take(doc.whenNotToUse, 3).map((b) => `Not for: ${b.t}`),
	]);
	section("Rules", [...take(doc.guidelines, 6), ...take(doc.accessibility, 3)].map((b) => `- ${b.t}`));
	section("Keyboard", take(doc.keyboard, 6).map((k) => `- ${k.keys}: ${k.action}`));
	const data = code ? dataImports(code) : [];
	section("Data", [
		...data.map((d) => `Replace ${d.names.join(", ")} (demo data) with your own, in the same shape.`),
		...(chart && data.length ? ["Missing values stay empty (drawn as a gap), never 0."] : []),
	]);
	section("Reference code", code ? ["```tsx", code, "```"] : []);
	lines.push("", `Full guidance: ${page}. Run npx twoux check before you finish.`);
	return lines.join("\n");
}
