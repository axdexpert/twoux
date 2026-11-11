import type { ComponentType } from "react";
import actions from "./content/actions.json";
import ai from "./content/ai.json";
import data from "./content/data.json";
import feedback from "./content/feedback.json";
import foundation from "./content/foundation.json";
import patterns from "./content/patterns.json";
import workspace from "./content/workspace.json";

export type Bullet = { t: string; s: string[] };
export type Ref = { id: string; label: string; url: string; kind: string };
export type Doc = {
	id: string;
	name: string;
	kind?: "foundation" | "component" | "pattern";
	group: string;
	summary: string;
	structure?: string[];
	principles?: Bullet[];
	whenToUse?: Bullet[];
	whenNotToUse?: Bullet[];
	guidelines?: Bullet[];
	content?: Bullet[];
	accessibility?: Bullet[];
	dos?: Bullet[];
	donts?: Bullet[];
	keyboard?: { keys: string; action: string }[];
	decisions?: { decision: string; why: string; s: string[] }[];
	tokens?: { name: string; value: string; use: string }[];
	problem?: string;
	solution?: string;
	steps?: Bullet[];
	components?: string[];
	related?: string[];
	references: Ref[];
};

const ALIAS: Record<string, string> = {
	menu: "dropdown-menu",
	"data-table": "data-grid",
	filters: "filter-bar",
	dialog: "confirmation-dialog",
	"chart-colours": "data-vis-colours",
};

const raw = [foundation, actions, feedback, data, workspace, ai, patterns].flatMap((f) => (f as { components: Doc[] }).components);
export const docs: Doc[] = raw
	.filter((d) => d.id !== "chart-colours")
	.map((d) => ({
		...d,
		kind: d.kind ?? "component",
		related: d.related ? [...new Set(d.related.map((r) => ALIAS[r] ?? r))] : [],
		components: d.components ? [...new Set(d.components.map((r) => ALIAS[r] ?? r))] : undefined,
	}));
export const docById = Object.fromEntries(docs.map((d) => [d.id, d]));


/**
 * Pages new in the TwoUX release on 30 November 2026. The sidebar labels them New until one month after the release,
 * then every label goes by itself on the same day. Pages added after the release need their own date.
 */
const NEW_IN_RELEASE = [
	"date-picker",
	"combobox",
	"tag-input",
	"chart-radial-lines",
	"chart-radial-bars",
	"chart-map",
	"voice-and-tone",
	"guide-cue",
	"csv-import",
	"saved-views",
	"agents-on-behalf",
	"configurable-dashboard",
	"saving-views",
	"order-book",
	"pane-layout",
	"example:workflows",
];
/** The last day the New labels show: one month after the 30 November 2026 release. */
const NEW_UNTIL = new Date(2026, 11, 30, 23, 59, 59);
export const isNew = (id: string, today = new Date()) => NEW_IN_RELEASE.includes(id) && today <= NEW_UNTIL;

export const docPath = (d: Doc) => `/${d.kind === "foundation" ? "foundation" : d.kind === "pattern" ? "patterns" : "components"}/${d.id}`;

/** Category order for the gallery and sidebar. */
export const COMPONENT_GROUPS = ["Actions and inputs", "Content", "Navigation", "Feedback and overlays", "Data", "Data visualisation", "AI and agents"];

/* ---------- navigation order: one source for the sidebar and for Previous / Next ---------- */
export const START_PAGES: { to: string; label: string }[] = [
	{ to: "/docs", label: "Get started" },
	{ to: "/for-agents", label: "For AI agents" },
	{ to: "/how-its-built", label: "How components are built" },
];

export type LibrarySection = { id: "foundation" | "components" | "patterns"; label: string; to: string; groups: { label: string; items: Doc[] }[] };
export const LIBRARY: LibrarySection[] = [
	{ id: "foundation", label: "Foundation", to: "/foundation", groups: ["Visual foundation", "Key principles", "Adopting TwoUX"].map((g) => ({ label: g, items: docs.filter((d) => d.kind === "foundation" && d.group === g) })) },
	{ id: "components", label: "Components", to: "/components", groups: COMPONENT_GROUPS.map((g) => ({ label: g, items: docs.filter((d) => d.kind === "component" && d.group === g) })) },
	{
		id: "patterns",
		label: "Patterns",
		to: "/patterns",
		groups: [["General", "Patterns: general"], ["Data and dashboards", "Patterns: data and dashboards"], ["AI", "Patterns: AI"]].map(([label, g]) => ({ label, items: docs.filter((d) => d.group === g) })),
	},
];

/** Example apps: full screens built only from @twoux/ui. Each opens at its own route, full page, without the docs chrome.
 *  Ordered by how much of TwoUX each one shows: the richest, most interactive first. `shows` names the parts worth looking at. */
export const EXAMPLE_APPS: { id: string; to: string; label: string; description: string; shows: string[] }[] = [
	{ id: "workflows", to: "/examples/workflows", label: "Workflows", description: "Hiring automations built as connected steps, tested with a sample application and changed through the assistant's proposals.", shows: ["Flow canvas", "Change request", "Test run"] },
	{ id: "agents", to: "/examples/agents", label: "Agent workspace", description: "A coding agent's sessions, its thread and the work it produced, such as a test report.", shows: ["Agent run", "Plan card", "Change request"] },
	{ id: "trading", to: "/examples/trading", label: "Trading", description: "One market's live price, order book and order form side by side, as on a crypto exchange.", shows: ["Candlestick chart", "Order book", "Pane layout"] },
	{ id: "data-workspace", to: "/examples/data-workspace", label: "Data workspace", description: "Workbooks whose columns are looked up or written per row, with what each costs.", shows: ["Sheet grid", "Action catalogue", "Run status bar"] },
	{ id: "operations", to: "/examples/operations", label: "Operations console", description: "An on-call workspace: alarms, events, live traffic and capacity in panes people resize and arrange.", shows: ["Pane layout", "Dense table", "Charts"] },
	{ id: "crm", to: "/examples/crm", label: "CRM record", description: "A contact record with communication preferences, website activity and an assistant you can stop.", shows: ["Tabs", "Grouped list", "Assistant panel"] },
	{ id: "onboarding", to: "/examples/onboarding", label: "Sign-up and onboarding", description: "Sign in, then set-up steps that ask who you are, what you'll use it for and which tools to connect.", shows: ["Sign in", "Onboarding step", "Connector picker"] },
	{ id: "hiring", to: "/example-app", label: "Hiring (ATS)", description: "Listings and candidates with filters, bulk actions and record detail in a side panel.", shows: ["List table", "Filter bar", "Side panel"] },
];

/** Every docs page in sidebar order, with its section and group (for Previous / Next and the breadcrumb). */
export const PAGE_ORDER: { to: string; label: string; section: string; group?: string }[] = [
	...START_PAGES.map((p) => ({ ...p, section: "Start" })),
	...LIBRARY.flatMap((s) => [
		{ to: s.to, label: s.label, section: s.label },
		...s.groups.flatMap((g) => g.items.map((d) => ({ to: docPath(d), label: d.name, section: s.label, group: g.label }))),
	]),
	{ to: "/examples", label: "Example apps", section: "Example apps" },
];

/* ---------- live examples: one file per example, read twice (as code to render, as text to show) ---------- */
type ExampleModule = { default: ComponentType; meta?: { title: string; description?: string; order?: number } };
const modules = import.meta.glob<ExampleModule>("./examples/*/*.tsx", { eager: true });
const sources = import.meta.glob<string>("./examples/*/*.tsx", { eager: true, query: "?raw", import: "default" });

export type Example = { id: string; file: string; title: string; description?: string; order: number; Component: ComponentType; code: string };
export const examplesFor = (componentId: string): Example[] =>
	Object.entries(modules)
		.filter(([path]) => path.split("/")[2] === componentId)
		.map(([path, mod]) => {
			const file = path.split("/")[3].replace(".tsx", "");
			return {
				id: file,
				file: `apps/docs/src/examples/${componentId}/${file}.tsx`,
				title: mod.meta?.title ?? file,
				description: mod.meta?.description,
				order: mod.meta?.order ?? 50,
				Component: mod.default,
				code: sources[path],
			};
		})
		.filter((e) => e.id !== "thumbnail")
		.sort((a, b) => a.order - b.order);

export const isBuilt = (componentId: string) => examplesFor(componentId).length > 0;
/** Gallery card preview: examples/<id>/thumbnail.tsx, rendered live at card size. */
export const thumbnailFor = (componentId: string) => modules[`./examples/${componentId}/thumbnail.tsx`]?.default;
/** Thumbnails that mark their parts with data-anatomy="n", so the page can number the anatomy and place the same numbers on the preview. */
const thumbSources = import.meta.glob<string>("./examples/*/thumbnail.tsx", { query: "?raw", import: "default", eager: true });
export const thumbnailHasAnatomy = (componentId: string) => !!thumbSources[`./examples/${componentId}/thumbnail.tsx`]?.includes("data-anatomy");

/* ---------- API tables (one file per component, next to its examples) ---------- */
export type Prop = { name: string; type: string; default?: string; description: string };
const apis = import.meta.glob<{ api: { component: string; props: Prop[] }[]; install?: string }>("./examples/*/api.ts", { eager: true });
export const apiFor = (componentId: string) => apis[`./examples/${componentId}/api.ts`];
