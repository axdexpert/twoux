import { Badge, Code } from "@twoux/ui";
import { Link } from "react-router-dom";
import { H2, Inline, NumberMarker, OnThisPage } from "../components/docs";
import { COMPONENT_GROUPS, docById, docs, isBuilt } from "../content";
import { PageHeader } from "./ComponentPage";

/** What each component is built on. Keep in sync when a component ships. */
const BASE: Record<string, [string, string]> = {
	button: ["shadcn pattern", "cva variants + Radix Slot for asChild"],
	"split-button": ["shadcn", "ButtonGroup (tailored) + Button + Dropdown menu; TwoUX SplitButton names the chevron"],
	"status-badge": ["shadcn pattern", "cva variants, no behaviour needed"],
	"keyboard-shortcut-hint": ["TwoUX", "Purely visual"],
	"code-block": ["shadcn", "Code Block parts (header, actions, content, line, footer)"],
	card: ["shadcn", "Card, plus TwoUX footer band"],
	separator: ["shadcn + Radix", "@radix-ui/react-separator; labelled via FieldSeparator"],
	stepper: ["TwoUX", "Ordered list with aria-current=\"step\""],
	"text-input": ["shadcn", "Native input"],
	"form-validation": ["shadcn", "Form (React Hook Form) + Label"],
	checkbox: ["shadcn + Radix", "@radix-ui/react-checkbox"],
	radio: ["shadcn + Radix", "@radix-ui/react-radio-group"],
	switch: ["shadcn + Radix", "@radix-ui/react-switch"],
	tabs: ["shadcn + Radix", "@radix-ui/react-tabs"],
	"segmented-control": ["shadcn + Radix", "@radix-ui/react-toggle-group"],
	"dropdown-menu": ["shadcn + Radix", "@radix-ui/react-dropdown-menu"],
	tooltip: ["shadcn + Radix", "@radix-ui/react-tooltip"],
	"popover-rules": ["Radix", "@radix-ui/react-popover collision handling + one-at-a-time manager"],
	toast: ["shadcn", "Sonner"],
	banner: ["shadcn", "Alert, plus TwoUX AlertAction"],
	"confirmation-dialog": ["shadcn + Radix", "@radix-ui/react-alert-dialog"],
	"command-palette": ["shadcn + Radix", "Command (cmdk) in a Radix Dialog"],
	"loading-skeleton": ["shadcn", "Skeleton"],
	"empty-state": ["shadcn", "Empty"],
	"error-state": ["shadcn", "Empty with the error tile"],
	"list-table": ["shadcn", "Table + TanStack Table; TwoUX sort header and row keyboard"],
	"dense-table": ["shadcn", "Table size=\"dense\" (tailoring rule) + TwoUX group row, row number menu, filter row, in-cell action"],
	pagination: ["TwoUX", "TablePagination, built on Button"],
	"bulk-action-bar": ["TwoUX", "Toolbar pattern on Badge, Button, Separator"],
	"filter-bar": ["shadcn + Radix", "Popover + Command (cmdk); TwoUX pills apply on tick"],
	"export-menu": ["shadcn + Radix", "Dropdown menu with checkbox items that stay open"],
	"grouped-list": ["shadcn + Radix", "Collapsible group headers"],
	"saved-views": ["shadcn + Radix", "Tabs with counts, Dialog to save"],
	board: ["TwoUX", "keyboard and menu alternatives to dragging"],
	"app-shell": ["TwoUX", "Sheet for the sidebar below 860px"],
	"page-header": ["TwoUX", "Button, Tabs"],
	breadcrumb: ["shadcn", "Breadcrumb, one line"],
	"side-panel": ["shadcn + Radix", "Push column, or Sheet (Dialog) for overlay"],
	"help-panel": ["TwoUX", "Side panel slot"],
	tag: ["TwoUX", "4px label, TagList with +N"],
	avatar: ["shadcn + Radix", "Avatar and AvatarGroup; per-person colours"],
	timestamp: ["TwoUX", "<time> + Tooltip"],
	"feedback-prompt": ["TwoUX", "Button, Textarea"],
	"keyboard-shortcut-sheet": ["shadcn + Radix", "Dialog, Kbd, Switch"],
	inbox: ["TwoUX", "Listbox, Tabs, Dropdown menu"],
	"assistant-panel": ["TwoUX", "Side panel slot, composer, thread parts"],
	"assistant-page": ["TwoUX", "Tabs, Sources list"],
	"message-composer": ["TwoUX", "Textarea combobox, Dropdown menu"],
	"thinking-steps": ["TwoUX", "Status text, timer"],
	"clarifying-question": ["TwoUX", "Radio pattern, number keys"],
	"suggested-changes": ["TwoUX", "Checkbox list, diff, Apply"],
	"step-card": ["TwoUX", "Status list"],
	"follow-ups-starters": ["TwoUX", "Buttons"],
	"citations-sources": ["TwoUX", "Record ID buttons"],
	"ai-origin-label": ["TwoUX", "One mark plus words"],
	"ai-column": ["TwoUX", "Table cells with states"],
	"task-builder": ["TwoUX", "Popover slots"],
	"agent-permissions": ["TwoUX", "Segmented control per action"],
	"agent-run": ["TwoUX", "Step list, Badge"],
	"plan-card": ["TwoUX", "Step list, risk marks, equal-weight approval"],
	"change-request": ["TwoUX", "DiffView, SimulationResults, Field"],
	"confidence-note": ["TwoUX", "Warn callout with cause and action"],
	"why-choice": ["TwoUX", "Popover"],
	"connected-tools": ["TwoUX", "Card, Badge"],
	"provider-logo": ["TwoUX", "Generated official marks on a white tile"],
	"sign-in": ["TwoUX", "Button, Field, Input"],
	"onboarding-step": ["TwoUX", "Field, Button, step text"],
	"file-drop": ["TwoUX", "Field, Button, hidden native file input"],
	"connector-picker": ["TwoUX", "Dialog, Input, Badge, Provider logo"],
	"setup-checklist": ["TwoUX", "Button, list, progress text"],
	"usage-meter": ["TwoUX", "Button, ARIA meter role"],
	"team-instructions": ["TwoUX", "Textarea, file list"],
	"conversation-history": ["TwoUX", "Search, list"],
	"templates-gallery": ["TwoUX", "Dialog"],
	"prompt-editor": ["TwoUX", "Field chips, test rows"],
	"answer-actions": ["TwoUX", "Icon buttons, Dropdown menu"],
	"artifact-card": ["TwoUX", "Card, origin label"],
	"data-grid": ["TwoUX", "WAI-ARIA grid pattern: one tab stop, cell editing"],
	"filter-panel": ["shadcn + Radix", "Collapsible, Checkbox"],
	"items-palette": ["TwoUX", "Board drop target and Add button"],
	"chart-scatter": ["TwoUX", "Own SVG, three groups, shape plus colour"],
	"chart-colours": ["TwoUX", "Validated palette tokens"],

	"chart-card-line": ["TwoUX", "Own SVG, so marks and colours follow the validated rules"],
	"chart-bar": ["TwoUX", "Own SVG"],
	"chart-heatmap": ["TwoUX", "Own SVG"],
	"chart-funnel": ["TwoUX", "Own SVG"],
	"sheet-grid": ["TwoUX", "WAI-ARIA grid with Excel and Google Sheets keys (ranges, TSV copy and paste, fill, undo), Dropdown menu per column, AI cell states"],
	"columns-menu": ["shadcn + Radix", "Popover, Input, Switch, RadioGroup, Button; applies at once; keyboard and button alternatives to dragging"],
	"run-status-bar": ["TwoUX", "Switch, Popover, ARIA progressbar, ShimmerText"],
	"field-mapping": ["shadcn + Radix", "Select per field, type checks"],
	"csv-import": ["shadcn + Radix", "Dialog, File drop, Field mapping, Alert, RadioGroup"],
	"action-catalogue": ["TwoUX", "Tabs, Input, Provider logo, RadioGroup"],
	"table-settings": ["TwoUX", "Side panel, RadioGroup, Checkbox, Alert dialog"],
	"chart-share-bar": ["TwoUX", "Flex blocks with 2px gaps, Other fold"],
	"ranked-list": ["TwoUX", "Ordered list, Sparkline, ChangeValue"],
	"change-list": ["TwoUX", "List of links, Sparkline, ChangeValue"],
	"chart-price": ["TwoUX", "Own SVG, range axis, last-value tag"],
	"chart-waterfall": ["TwoUX", "Own SVG, floating bars and connectors"],
	"chart-bullet": ["TwoUX", "Few's bullet graph spec, plain divs"],
	"chart-treemap": ["TwoUX", "Own SVG, squarified layout"],
	"chart-sankey": ["TwoUX", "Own SVG, column layout and ribbons"],
	"chart-histogram": ["TwoUX", "Own SVG, binValues helper"],
	"chart-box-plot": ["TwoUX", "Own SVG, boxStats helper"],
	"chart-candlestick": ["TwoUX", "Own SVG, two panels, one crosshair"],
	"chart-radial-bars": ["TwoUX", "Own SVG arcs on chart-kit, adapted from MUI X radial bars and narrowed to share of a fixed limit"],
	"chart-map": ["TwoUX", "Own SVG on d3-geo and topojson-client; the app passes its TopoJSON. Reuses the Heatmap's q1–q5 sequential scale and chart-kit."],
	"timeline": ["TwoUX", "Composition: HTML grid with sticky track labels, SegmentedControl zoom, chart-kit tooltip, ChartFrame states; adapted from Astro UXDS"],
	"scheduler": ["TwoUX", "Composition of Button, SegmentedControl, DropdownMenu, Popover, Badge and Skeleton with its own slot grid, lane layout and pointer and keyboard move model; no calendar library."],
	"chart-radial-lines": ["TwoUX", "Own SVG polar lines on chart-kit, adapted from MUI X radial lines and narrowed to cyclical periods"],
	"guide-cue": ["TwoUX", "Composition on the @twoux/ui Popover with the target element as the anchor's virtual ref, plus Button, Tooltip and Kbd; the target's focus ring is a pointer-transparent outline that follows it on scroll and resize."],
};
const TONE: Record<string, "default" | "success" | "secondary" | "warning"> = { "shadcn + Radix": "default", shadcn: "default", "shadcn pattern": "default", Radix: "default", "TanStack Table": "warning", TwoUX: "success" };

export function HowBuilt() {
	const comps = docs.filter((d) => d.kind === "component");
	return (
		<div className="docs-cols pt-10 pb-20 max-md:pt-8">
			<div className="min-w-0">
			<PageHeader
				eyebrow="Get started"
				title="How components are built"
				summary="TwoUX is not built from scratch, and it is not shadcn out of the box. Radix gives tested behaviour, shadcn gives starting code we own, and TwoUX adds the tokens, restrictions and rules."
			/>
				<article>
					<H2 id="layers">Three layers</H2>
					<p className="mb-4 text-docs text-ink-prose">Each layer builds on the one before. TwoUX never re-solves what Radix already does well.</p>
					<ol className="grid gap-3">
						{(
							[
								["Radix UI", "Behaviour", "Keyboard handling, focus trapping and return, ARIA roles, positioning and collision. The hard, risky accessibility work, already tested with assistive technology.", "Dialog returns focus to the button that opened it."],
								["shadcn/ui", "Starting code", "Not a dependency. A CLI copies source files into packages/ui: Radix plus Tailwind classes and cva variants. From then on TwoUX owns and edits the code.", "npx shadcn add dropdown-menu"],
								["TwoUX", "Rules and look", "Restyles with role tokens, keeps only the variants TwoUX allows, adds TwoUX props such as shortcut and loading, and documents every decision with a source.", "Button keeps 4 sizes and 6 variants, and one primary per view."],
							] as const
						).map(([name, role, what, eg], i) => (
							<li key={name} className="grid grid-cols-[20px_1fr] gap-3 rounded-sm border border-line bg-surface p-4 shadow-card">
								<NumberMarker n={i + 1} />
								<div className="grid gap-1">
									<div className="flex items-baseline gap-2">
										<span className="text-docs font-semibold">{name}</span>
										<span className="text-docs-sm text-ink-3">{role}</span>
									</div>
									<p className="text-docs text-ink-prose">{what}</p>
									<p className="mt-1 text-docs-sm text-ink-3">
										Example: {i < 2 ? <Code className="whitespace-normal break-words">{eg}</Code> : eg}
									</p>
								</div>
							</li>
						))}
					</ol>

					<H2 id="why">Why not from scratch, and why not plain shadcn</H2>
					<ul className="grid gap-3 text-docs">
						<li><b className="font-semibold">From scratch</b> would mean re-solving focus management, keyboard models and screen reader behaviour for every menu, dialog and tooltip. That is where most accessibility bugs come from.</li>
						<li><b className="font-semibold">Plain shadcn</b> is a generic starting point with many options. Left as is, every team picks different variants and sizes, which is the drift TwoUX exists to stop.</li>
						<li><b className="font-semibold">Owning the code</b> means a fix in packages/ui reaches every product at once, and nothing upstream changes TwoUX without review.</li>
					</ul>

					<H2 id="flow">Adding a component</H2>
					<ol className="grid gap-3 text-docs">
						{[
							"Write or update its guidance first: when to use, when not, behaviour, accessibility, with sources.",
							"Download the untouched shadcn source into `packages/ui/src/shadcn/` (never edit it).",
							"Add its tailoring to `scripts/tailor-shadcn.mjs`: each change with the reason, then run `pnpm tailor`. The generated file lands in `components/`.",
							"TwoUX-only helpers (such as `TextField` or `SegmentedControl`) go in their own file and build on the generated parts.",
							"Add examples in `apps/docs/src/examples/<id>/`, its job to `registry/jobs.json`, then run `pnpm llm`.",
						].map((s, i) => (
							<li key={s} className="grid grid-cols-[20px_1fr] gap-2.5">
								<NumberMarker n={i + 1} />
								<span><Inline text={s} /></span>
							</li>
						))}
					</ol>

					<H2 id="diff">What TwoUX changes in shadcn</H2>
					<p className=" text-docs text-ink-prose">
						Every component is generated from shadcn's untouched source by <Code>scripts/tailor-shadcn.mjs</Code>. The script lists each change and its reason, and fails if an upstream update breaks one. The full list is in <Code>packages/ui/SHADCN-DIFF.md</Code>. The API stays shadcn's (<Code>variant="outline"</Code>, <Code>size="icon"</Code>, icons as children), so people and AI agents who know shadcn already know TwoUX.
					</p>

					<H2 id="registry">Installing TwoUX in an app</H2>
					<p className=" text-docs text-ink-prose">
						Today: add <code className="rounded-xs bg-hover px-1 font-mono text-docs-sm">@twoux/ui</code> as a workspace or package dependency and import from it. <Badge variant="warning">Not yet</Badge> a public shadcn registry, so <code className="rounded-xs bg-hover px-1 font-mono text-docs-sm">npx shadcn add @twoux/…</code> does not work until it is published.
					</p>

					<H2 id="per-component">What each component is built on</H2>
					<div className="overflow-x-auto rounded-sm border border-line">
						<table className="w-full min-w-[700px] border-collapse text-left text-docs-sm">
							<thead className="bg-surface-2 text-docs-sm text-ink-2">
								<tr><th className="px-3 py-2 font-medium">Component</th><th className="px-3 py-2 font-medium">Base</th><th className="px-3 py-2 font-medium">Detail</th><th className="px-3 py-2 font-medium">Status</th></tr>
							</thead>
							<tbody>
								{COMPONENT_GROUPS.flatMap((g) => comps.filter((c) => c.group === g && BASE[c.id])).map((c) => (
									<tr key={c.id} className="border-t border-line">
										<td className="px-3 py-2"><Link to={`/components/${c.id}`} className="font-medium text-primary-ink hover:underline">{docById[c.id].name}</Link></td>
										<td className="px-3 py-2"><Badge variant={TONE[BASE[c.id][0]]}>{BASE[c.id][0]}</Badge></td>
										<td className="px-4 py-2.5 text-ink-2">{BASE[c.id][1]}</td>
										<td className="px-3 py-2">{isBuilt(c.id) ? <Badge variant="success" dot>Built</Badge> : <span className="text-docs-sm text-ink-3">Planned</span>}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<p className="mt-3 text-docs-sm text-ink-3">AI and agent components are composed from the parts above (side panel, dropdown menu, data grid, buttons), so they inherit the same behaviour.</p>
				</article>
				</div>
				<OnThisPage items={[{ id: "layers", label: "Three layers" }, { id: "why", label: "Why this approach" }, { id: "flow", label: "Adding a component" }, { id: "diff", label: "What TwoUX changes" }, { id: "registry", label: "Installing in an app" }, { id: "per-component", label: "Per component" }]} />
		</div>
	);
}
