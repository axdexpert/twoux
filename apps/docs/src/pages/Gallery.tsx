import { useMeta } from "../components/meta";
import { Badge, Button, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, InputGroup, InputGroupAddon, InputGroupInput, ToggleGroup, ToggleGroupItem } from "@twoux/ui";
import { Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { COMPONENT_GROUPS, type Doc, docs, isBuilt, thumbnailFor } from "../content";

/* Every thumbnail shows at 110% so text reads the same size from card to card. Only the few that would not fit the
   preview box at the narrowest card (320px, a 288 × 127px box) step down, never below 90%; the donut is a chart, so
   it alone goes lower. Fix a thumbnail that needs less than 90% by trimming its content, not by shrinking it. */
const SCALES: Record<string, string[]> = {
	"scale-75": ["chart-donut"],
	"scale-90": ["timeline", "banner"],
	"scale-95": ["clarifying-question", "chart-box-plot", "confirmation-dialog", "setup-checklist"],
	"scale-100": ["guide-cue", "chart-radial-lines", "scheduler", "chart-map", "chart-radial-bars", "chart-candlestick", "action-catalogue", "agent-permissions", "agent-run", "ai-column", "app-shell", "artifact-card", "assistant-page", "assistant-panel", "board", "breakdown-table", "bulk-action-bar", "card", "change-list", "change-request", "chart-area", "chart-bar", "chart-bullet", "chart-card-line", "chart-funnel", "chart-histogram", "chart-mixed", "chart-price", "chart-sankey", "chart-scatter", "chart-share-bar", "chart-treemap", "chart-waterfall", "citations-sources", "code-block", "columns-menu", "confidence-note", "connected-tools", "connector-picker", "conversation-history", "csv-import", "data-grid", "dense-table", "dropdown-menu", "export-menu", "field-mapping", "file-drop", "filter-panel", "follow-ups-starters", "grouped-list", "help-panel", "inbox", "items-palette", "keyboard-shortcut-sheet", "list-table", "loading-skeleton", "message-composer", "notifications-decision", "onboarding-step", "page-header", "pagination", "plan-card", "popover-rules", "prompt-editor", "ranked-list", "run-status-bar", "saved-views", "sheet-grid", "side-panel", "stepper", "suggested-changes", "table-settings", "task-builder", "team-instructions", "templates-gallery", "toast"],
	"scale-105": ["command-palette"],
};
const scaleFor = (id: string) => Object.keys(SCALES).find((k) => SCALES[k].includes(id)) ?? "scale-110";

function Card({ d }: { d: Doc }) {
	const Thumb = thumbnailFor(d.id);
	const built = isBuilt(d.id);
	return (
		<Link
			to={`/components/${d.id}`}
			className="group flex flex-col overflow-hidden rounded-sm border border-line bg-surface shadow-card transition-[box-shadow,transform,border-color] duration-(--duration-base) ease-(--ease-out) hover:shadow-raised focus-visible:shadow-raised motion-reduce:hover:translate-y-0"
		>
			<div
				aria-hidden="true"
				inert
				className="relative flex h-40 items-center justify-center overflow-hidden border-b border-line bg-surface-2 p-4 bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[14px_14px]"
			>
				{Thumb ? (
					<div className={`pointer-events-none origin-center ${scaleFor(d.id)}`}>
						<Thumb />
					</div>
				) : (
					<div className="grid w-3/5 gap-1.5 opacity-60">
						<span className="h-2 w-2/3 rounded-xs bg-line-strong" />
						<span className="h-2 rounded-xs bg-line" />
						<span className="h-2 w-4/5 rounded-xs bg-line" />
					</div>
				)}
			</div>
			<div className="flex flex-1 flex-col gap-1 p-4">
				<span className="flex items-center gap-2">
					<span className="font-semibold group-hover:text-primary-ink">{d.name}</span>
					{!built && <span className="ml-auto text-xs text-ink-3">Planned</span>}
				</span>
				<span className="line-clamp-2 text-sm leading-snug text-ink-2">{d.summary}</span>
			</div>
		</Link>
	);
}

export function Gallery() {
	useMeta("Components · TwoUX", "Every TwoUX component by the job it does: buttons and forms, data tables and grids, charts, AI and agent interfaces. Live examples, accessibility and API for each.");
	const [q, setQ] = useState("");
	const [group, setGroup] = useState("All");
	const components = useMemo(() => docs.filter((d) => d.kind === "component"), []);
	const builtCount = components.filter((d) => isBuilt(d.id)).length;
	// Faceted counts: each category counts what the search allows.
	const match = (d: Doc, skipGroup?: boolean) =>
		(skipGroup || group === "All" || d.group === group) && (!q || `${d.name} ${d.summary}`.toLowerCase().includes(q.toLowerCase()));
	const shown = components.filter((d) => match(d));
	const forGroups = components.filter((d) => match(d, true));

	return (
		<div className="page-frame pt-6 pb-20">
			<h1 className="text-docs-h1 font-semibold tracking-tight">Components</h1>
			<p className="mt-1.5 max-w-[72ch] text-docs-lead text-ink-2">
				Every component has one job. Pick by the job, read “When not to use”, then use the live examples. {builtCount} of {components.length} are built; the rest have their guidance ready.
			</p>

			<div className="sticky top-0 z-10 -mx-2 mt-4 flex flex-wrap items-center gap-2 border-b border-line bg-surface/95 px-2 py-2.5 backdrop-blur">
				<InputGroup className="w-72 max-md:w-full">
					<InputGroupAddon>
						<Search aria-hidden="true" />
					</InputGroupAddon>
					<InputGroupInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a component" aria-label="Find a component" />
				</InputGroup>
				<ToggleGroup type="single" variant="outline" size="sm" spacing={1.5} value={group} onValueChange={(v) => v && setGroup(v)} aria-label="Category" className="basis-full flex-wrap">
					{["All", ...COMPONENT_GROUPS].map((g) => {
						// Zero stays visible, so the row never shifts while people combine filters.
						const n = g === "All" ? forGroups.length : forGroups.filter((d) => d.group === g).length;
						return (
							<ToggleGroupItem key={g} value={g} className="gap-1.5 px-2.5">
								{g}
								<span className="tabular text-sm font-normal text-ink-3">{n}</span>
							</ToggleGroupItem>
						);
					})}
				</ToggleGroup>
			</div>

			{COMPONENT_GROUPS.map((g) => {
				const items = shown.filter((d) => d.group === g);
				if (!items.length) return null;
				return (
					<section key={g} id={g.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="mt-6 scroll-mt-16">
						<h2 className="mb-2.5 flex items-center gap-2 text-docs-h2 font-semibold">
							{g}
							<Badge variant="secondary">{items.length}</Badge>
						</h2>
						<div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-3">
							{items.map((d) => (
								<Card key={d.id} d={d} />
							))}
						</div>
					</section>
				);
			})}
			{/* No results: the filters stay above, so it is clear they caused it; one action clears them all. */}
			{!shown.length && (
				<Empty className="mt-6 min-h-64">
					<EmptyHeader>
						<EmptyMedia variant="icon"><SearchX /></EmptyMedia>
						<EmptyTitle>No components match these filters</EmptyTitle>
						<EmptyDescription>
							{q ? <>Try the job you need, such as “confirm” or “filter”, </> : <>Try another category, </>}
							or clear the filters to see all {components.length}.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button variant="outline" size="sm" onClick={() => { setQ(""); setGroup("All"); }}>Clear filters</Button>
					</EmptyContent>
				</Empty>
			)}
		</div>
	);
}
