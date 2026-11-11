import {
	ActionCatalogue,
	type ActionConfig,
	AssistantMessage,
	AssistantPanel,
	Badge,
	BulkActionBar,
	Button,
	type CatalogueAction,
	type ComputedCellState,
	ColumnsMenu,
	CsvImport,
	type CsvImportResult,
	DropdownMenuItem,
	DropdownMenuSeparator,
	ExportMenu,
	FilterButton,
	type FilterFieldDef,
	FilterRow,
	type FilterValue,
	Popover,
	PopoverContent,
	PopoverTrigger,
	MessageComposer,
	PersonAvatar,
	RunStatusBar,
	type SheetCellChange,
	SheetGrid,
	type SheetColumn,
	type SheetRow,
	type SheetSort,
	ShortcutList,
	ShortcutSheet,
	SidePanel,
	SidebarItem,
	SidebarSection,
	TableSettings,
	type TableSettingsValue,
	Tabs,
	TabsList,
	TabsTrigger,
	Tag,
	Timestamp,
	UsageMeter,
	UserMessage,
	sheetGridShortcuts,
	toast,
} from "@twoux/ui";
import { AtSign, Clock, Copy, FileUp, Gauge, Globe, Keyboard, Languages, MailCheck, PenLine, Plug, Plus, RefreshCw, Settings, Sigma, Table2, Tags, Trash2 } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ACTIONS, COLUMNS, COMPANY_COLUMNS, COMPANY_ROWS, FAILS, HISTORY_SEED, IMPORT_ALIASES, IMPORT_TARGETS, PEOPLE, type Person, SAMPLE_CSV, SENIORITY, emailFor, fitScore, gbp, isClosed, summaryFor, weighted } from "./data-workspace/data";
import { ExampleShell, RailSwap } from "../../components/example-shell";
import { ExampleBrand } from "../../components/example-brand";

type Panel = null | "add" | "settings" | "assistant" | "record";
type Sheet = "overview" | "people" | "companies";

const ICONS: Record<string, ReactNode> = { sigma: <Sigma />, at: <AtSign />, clock: <Clock />, globe: <Globe />, mailcheck: <MailCheck />, tags: <Tags />, pen: <PenLine />, languages: <Languages /> };
const CATALOGUE: CatalogueAction[] = ACTIONS.map(({ iconKey, ...a }) => ({ ...a, icon: iconKey ? ICONS[iconKey] : undefined }));
const START_AT = 128;
const TICK_MS = 450;
const FINISHED = new Set(["done", "failed", "not-found"]);

/** Owner: their avatar beside the name. Editing and paste still treat it as text. */
const ownerCell = (v: unknown) =>
	v ? (
		<span className="flex min-w-0 items-center gap-1.5">
			<span aria-hidden="true"><PersonAvatar name={String(v)} size="sm" /></span>
			<span className="truncate">{String(v)}</span>
		</span>
	) : null;
const PEOPLE_COLUMNS: SheetColumn[] = COLUMNS.map((c) => (c.id === "owner" ? { ...c, render: ownerCell } : c));

/** Fields people can filter the sheet by; three or more values are counted with the noun. */
const FILTER_FIELDS = [
	{ id: "seniority", label: "Seniority", noun: { one: "seniority", many: "seniorities" } },
	{ id: "stage", label: "Stage", noun: { one: "stage", many: "stages" } },
	{ id: "owner", label: "Owner", noun: { one: "owner", many: "owners" } },
];

const personOf = (r: SheetRow): Person => ({ id: r.id, name: String(r.values.name ?? ""), title: String(r.values.title ?? ""), company: String(r.values.company ?? ""), domain: String(r.values.domain ?? ""), seniority: String(r.values.seniority ?? ""), employees: Number(r.values.employees ?? 0), added: String(r.values.added ?? "") });

/** The value a computed column writes for a row, or why it couldn't. */
function result(colId: string, actionId: string | undefined, r: SheetRow): ComputedCellState {
	const p = personOf(r);
	const fail = FAILS[r.id];
	if (colId === "summary" || actionId === "summarise") {
		if (fail?.summary || !p.title) return { state: "failed", reason: "Job title is empty. Add one, then try again." };
		return { state: "done", value: summaryFor(p) };
	}
	if (colId === "email" || actionId === "work-email") {
		if (fail?.email === "failed" || !p.domain) return { state: "failed", reason: "No company domain on this row." };
		if (fail?.email === "not-found") return { state: "not-found" };
		return { state: "done", value: emailFor(p) };
	}
	const v: Record<string, string> = {
		"company-details": `${p.employees.toLocaleString("en-GB")} staff · ${p.company.includes("Legal") ? "Legal services" : p.company.includes("Freight") ? "Logistics" : "Business services"}`,
		"domain-from-site": p.domain || "Not found",
		"verify-email": p.domain ? "Accepts mail" : "No address to check",
		classify: p.company.includes("Health") ? "Healthcare" : p.company.includes("Energy") ? "Energy" : p.company.includes("Lending") ? "Financial services" : "Software and services",
		opener: `Saw ${p.company} is growing its ${p.title.split(" ").slice(-1)[0]?.toLowerCase() || "operations"} team this year.`,
		translate: summaryFor(p),
		combine: `${p.name} · ${p.company}`,
		"domain-from-email": p.domain,
		"days-since": `${Math.max(0, Math.round((Date.UTC(2026, 10, 6) - new Date(p.added).getTime()) / 86400000))} days`,
		"hubspot-sync": "Contact updated",
		sheets: "Added",
		slack: "Not posted: doesn't match",
	};
	return { state: "done", value: v[actionId ?? ""] ?? "Done" };
}

function seedRows(): SheetRow[] {
	return PEOPLE.map((p, i) => {
		const r: SheetRow = { id: p.id, values: { name: p.name, company: p.company, title: p.title, stage: p.stage, owner: p.owner, deal: p.deal, probability: p.probability, closes: p.closes, subscribed: p.subscribed, domain: p.domain, seniority: p.seniority, employees: p.employees, added: p.added } };
		const st = (col: string): ComputedCellState => (i < START_AT ? result(col, undefined, r) : i === START_AT ? { state: "writing" } : { state: "queued" });
		return { ...r, computed: { summary: st("summary"), email: st("email") } };
	});
}

/** "TwoUX prospects": a workbook of people whose summary and work email are filled in per row, at a cost. */
export function DataWorkspaceExample() {
	const [sheet, setSheet] = useState<Sheet>("people");
	const [columns, setColumns] = useState<SheetColumn[]>(PEOPLE_COLUMNS);
	const [rows, setRows] = useState<SheetRow[]>(seedRows);
	const [companyCols, setCompanyCols] = useState<SheetColumn[]>(COMPANY_COLUMNS);
	const [companyRows, setCompanyRows] = useState<SheetRow[]>(COMPANY_ROWS);
	const [sort, setSort] = useState<SheetSort>(null);
	// Applied filters, as TwoUX's FilterButton and FilterRow share them: field id to values, in the order added.
	const [filters, setFilters] = useState<FilterValue>({});
	const [freshIds, setFreshIds] = useState<Set<string>>(new Set());
	const seniority = filters.seniority ?? [];
	const optionsFor = (id: string) => (id === "seniority" ? SENIORITY : [...new Set(rows.map((r) => String(r.values[id] ?? "")).filter(Boolean))].sort()).map((v) => ({ value: v, label: v, count: rows.filter((r) => String(r.values[id]) === v).length }));
	const filterFields: FilterFieldDef[] = FILTER_FIELDS.map((f) => ({ id: f.id, label: f.label, options: optionsFor(f.id), valueNoun: f.noun }));
	const [panel, setPanel] = useState<Panel>(null);
	const [importing, setImporting] = useState(false);
	const [autoRun, setAutoRun] = useState(false);
	const [credits, setCredits] = useState(START_AT * 1.5 - 1);
	const [history, setHistory] = useState(HISTORY_SEED);
	const [settings, setSettings] = useState<TableSettingsValue>({ duplicates: "keep-oldest", matchOn: "email", deleteEmptyRows: false, template: { shared: false, audience: "workspace" } });
	const [thread, setThread] = useState<string[]>([]);
	const [onlyVisible, setOnlyVisible] = useState(true);
	const [selected, setSelected] = useState<string[]>([]);
	const [recordId, setRecordId] = useState<string | null>(null);
	const [singleKeys, setSingleKeys] = useState(true);
	const actionOf = useRef<Record<string, string>>({});
	const runStart = useRef(0);
	const stopping = useRef(false);

	const computedCols = columns.filter((c) => c.type === "ai" || c.type === "enrichment" || (c.type === "formula" && actionOf.current[c.id]));
	const running = rows.some((r) => Object.values(r.computed ?? {}).some((c) => c.state === "writing" || c.state === "queued"));

	// The simulated run: each tick finishes the row being written and starts the next queued one.
	useEffect(() => {
		if (!running) return;
		const t = window.setInterval(() => {
			setRows((rs) => {
				let spent = 0;
				// Copy only the rows that change, so the grid re-renders two rows per tick, not all of them.
				const next = [...rs];
				const own = (k: number) => { const r = { ...next[k], computed: { ...next[k].computed } }; next[k] = r; return r; };
				const i = next.findIndex((r) => Object.values(r.computed ?? {}).some((c) => c.state === "writing"));
				if (i >= 0) { const row = own(i); for (const [col, c] of Object.entries(row.computed)) if (c.state === "writing") {
					const out = result(col, actionOf.current[col], row);
					row.computed[col] = out;
					if (out.state === "done") spent += columns.find((x) => x.id === col)?.costPerRow ?? 0;
				} }
				const j = next.findIndex((r) => Object.values(r.computed ?? {}).some((c) => c.state === "queued"));
				if (j >= 0) { const row = own(j); for (const [col, c] of Object.entries(row.computed)) if (c.state === "queued") row.computed[col] = { state: "writing" }; }
				if (spent) setCredits((x) => x + spent);
				return next;
			});
		}, TICK_MS);
		return () => window.clearInterval(t);
	}, [running, columns]);

	const wasRunning = useRef(running);
	useEffect(() => {
		if (wasRunning.current && !running && !stopping.current) {
			const errs = rows.reduce((n, r) => n + Object.values(r.computed ?? {}).filter((c) => c.state === "failed").length, 0);
			setHistory((h) => [{ id: `h${Date.now()}`, label: "Computed columns, whole table", rows: rows.length, credits: Math.round(credits - runStart.current), outcome: "Done" as const, at: Date.now() }, ...h]);
			toast.success("Run finished", { description: errs ? `${errs} cells failed. Open the column menu to run them again.` : "Every row is up to date." });
		}
		if (!wasRunning.current && running) runStart.current = credits;
		stopping.current = false;
		wasRunning.current = running;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [running]);

	const queue = (pred: (r: SheetRow, i: number) => boolean, colIds: string[]) =>
		setRows((rs) => rs.map((r, i) => {
			if (!pred(r, i)) return r;
			const c = { ...r.computed };
			for (const id of colIds) if (!c[id] || c[id].state === "failed") c[id] = { state: "queued" };
			return { ...r, computed: c };
		}));

	const finishedRows = rows.filter((r) => computedCols.every((c) => FINISHED.has(r.computed?.[c.id]?.state ?? ""))).length;
	const stop = () => {
		stopping.current = true;
		setRows((rs) => rs.map((r) => ({ ...r, computed: Object.fromEntries(Object.entries(r.computed ?? {}).filter(([, c]) => c.state !== "writing" && c.state !== "queued")) })));
		setHistory((h) => [{ id: `h${Date.now()}`, label: "Computed columns, whole table", rows: finishedRows, credits: Math.round(credits - runStart.current), outcome: "Stopped" as const, at: Date.now() }, ...h]);
		toast(`Stopped at ${finishedRows} of ${rows.length} rows`, { description: "Finished cells are kept. Nothing else runs until you choose Run remaining." });
	};

	// The two formula columns are worked out per row; a row keeps its object until it changes, so the grid can skip it.
	const withFormulas = useMemo(() => new WeakMap<SheetRow, SheetRow>(), []);
	const gridRows = useMemo(
		() => rows
			.filter((r) => freshIds.has(r.id) || Object.entries(filters).every(([k, v]) => !v.length || v.includes(String(r.values[k]))))
			.map((r) => {
				const hit = withFormulas.get(r);
				if (hit) return hit;
				const out = { ...r, computed: { ...r.computed, fit: { state: "done", value: fitScore(r.values) } as ComputedCellState, weighted: { state: "done", value: gbp(weighted(r.values)) } as ComputedCellState } };
				withFormulas.set(r, out);
				return out;
			}),
		[rows, filters, freshIds, withFormulas],
	);
	const shownColumns = useMemo(() => columns.map((c) => {
		if (c.type === "formula" && !actionOf.current[c.id]) return { ...c, status: { done: rows.length, total: rows.length } };
		if (!["ai", "enrichment", "formula"].includes(c.type)) return c;
		const cells = rows.map((r) => r.computed?.[c.id]);
		return { ...c, status: { total: rows.length, done: cells.filter((x) => x && FINISHED.has(x.state)).length, errors: cells.filter((x) => x?.state === "failed").length, running: cells.some((x) => x?.state === "writing" || x?.state === "queued") } };
	}), [columns, rows]);

	const failed = rows.reduce((n, r) => n + Object.values(r.computed ?? {}).filter((c) => c.state === "failed").length, 0);
	const costPerRow = computedCols.reduce((n, c) => n + (c.costPerRow ?? 0), 0);
	const runningNames = computedCols.filter((c) => rows.some((r) => ["writing", "queued"].includes(r.computed?.[c.id]?.state ?? ""))).map((c) => c.label);

	// A paste, fill, clear, undo or redo arrives as one batch: one state update for every cell.
	const onCellsChange = (changes: SheetCellChange[]) =>
		setRows((rs) => {
			const by = new Map<string, SheetCellChange[]>();
			for (const c of changes) by.set(c.rowId, [...(by.get(c.rowId) ?? []), c]);
			return rs.map((r) => {
				const mine = by.get(r.id);
				return mine ? { ...r, values: { ...r.values, ...Object.fromEntries(mine.map((c) => [c.columnId, c.value])) } } : r;
			});
		});
	const deleteRows = (ids: string[]) => {
		const before = rows;
		setRows((rs) => rs.filter((r) => !ids.includes(r.id)));
		setSelected((s) => s.filter((id) => !ids.includes(id)));
		toast(`Deleted ${ids.length} ${ids.length === 1 ? "row" : "rows"}`, { action: { label: "Undo", onClick: () => setRows(before) } });
	};
	const duplicateRow = (id: string) => {
		const src = rows.find((r) => r.id === id);
		if (!src) return;
		const copy: SheetRow = { id: `d${Date.now()}`, values: { ...src.values, name: `${src.values.name} (copy)` }, computed: {} };
		setRows((rs) => { const i = rs.findIndex((r) => r.id === id); const next = [...rs]; next.splice(i + 1, 0, copy); return next; });
		toast.success(`Duplicated ${src.values.name}`, { description: "Computed columns haven't run for the copy." });
	};
	const openRecord = (id: string) => { setRecordId(id); setPanel("record"); };
	const record = rows.find((r) => r.id === recordId);
	const recordAt = gridRows.findIndex((r) => r.id === recordId);

	const addRows = (count: number) => {
		// Empty rows directly below the last one: no placeholder name, nothing queued until someone types. In a grouped view
		// a new row joins the last group (as spreadsheets do), so it never opens an "(Empty)" group; while filters are
		// on, rows added in this session stay visible, so they do not vanish the moment they are added.
		// The grid orders groups by the column's options, so the last group on screen is the last option that has rows.
		const present = new Set(gridRows.map((r) => String(r.values.stage ?? "")));
		const stage = [...(columns.find((c) => c.id === "stage")?.options ?? [])].reverse().find((o) => present.has(o)) ?? gridRows[gridRows.length - 1]?.values.stage;
		const fresh: SheetRow[] = Array.from({ length: count }, (_, i) => ({ id: `n${Date.now()}-${i}`, values: stage ? { stage } : {}, computed: {} }));
		setRows((rs) => [...rs, ...fresh]);
		setFreshIds((s) => new Set([...s, ...fresh.map((r) => r.id)]));
	};

	const onImport = (res: CsvImportResult) => {
		const before = rows;
		const created = res.created.map((label) => ({ id: `imp-${label.toLowerCase().replace(/\W+/g, "-")}`, label, type: "text" as const, width: 140 }));
		const fresh: SheetRow[] = res.rows.map((r, i) => ({
			id: `i${Date.now()}-${i}`,
			values: { name: r.name, title: r.title, company: r.company, domain: (r.domain ?? "").replace(/^https?:\/\//, ""), seniority: r.seniority, employees: r.employees ? Number(r.employees) : null, added: "2026-11-06", ...Object.fromEntries(created.map((c) => [c.id, r[c.label]])) },
			computed: (r.email ? { email: { state: "done", value: r.email } } : {}) as Record<string, ComputedCellState>,
		}));
		setColumns((cs) => [...cs, ...created.filter((c) => !cs.some((x) => x.id === c.id))]);
		setRows((rs) => [...rs, ...fresh]);
		if (autoRun) queue((r) => fresh.some((f) => f.id === r.id), computedCols.map((c) => c.id));
		toast.success(`Imported ${res.rows.length} rows${res.skipped ? `, skipped ${res.skipped}` : ""}`, { description: autoRun ? `Auto-run is on: about ${Math.round(res.rows.length * costPerRow)} credits.` : "Computed columns haven't run for them yet.", action: { label: "Undo", onClick: () => setRows(before) } });
	};

	const addColumn = (cfg: ActionConfig) => {
		const a = cfg.action;
		const id = `${a.id}-${Date.now().toString(36)}`;
		actionOf.current[id] = a.id;
		const type = a.category === "AI" ? "ai" : a.category === "Formulas" ? "formula" : "enrichment";
		setColumns((cs) => [...cs, { id, label: cfg.columnName, type, provider: a.provider, costPerRow: a.costPerRow || undefined, width: type === "ai" ? 280 : 200 }]);
		setPanel(null);
		if (cfg.run !== "none") queue((_, i) => cfg.run === "all" || i < 10, [id]);
		toast.success(`Added “${cfg.columnName}”`, { description: cfg.run === "none" ? "Run it from its column menu." : cfg.run === "test" ? "Testing on the first 10 rows." : `Running on ${rows.length} rows.` });
	};

	const meter = <UsageMeter used={13240 + Math.round(credits)} limit={20000} unit="credits" resets="1 Dec" atLimit="Computed columns stop until 1 Dec" />;

	const sidebar = (
		<>
			<ExampleBrand />
			<SidebarSection title="Workbooks">
				<SidebarItem label="TwoUX prospects" icon={<Table2 />} current />
				<SidebarItem label="Event leads, October" icon={<Table2 />} />
				<SidebarItem label="Partner accounts" icon={<Table2 />} />
			</SidebarSection>
			<SidebarSection>
				<SidebarItem label="Connections" icon={<Plug />} />
				<SidebarItem label="Settings" icon={<Settings />} />
			</SidebarSection>
			<div className="mt-auto px-2"><RailSwap icon={<Gauge />} label={`Credits, ${Math.round(((13240 + Math.round(credits)) / 20000) * 100)}% used`}>{meter}</RailSwap></div>
		</>
	);

	const topBar = (
		<>
			<h1 className="min-w-0 truncate text-md font-semibold text-ink">TwoUX prospects</h1>
			<span className="flex-1" />
			{/* Every key the sheet understands, a click away; ? opens the same list as a dialog. */}
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="ghost" size="icon-sm" aria-label="Keyboard shortcuts"><Keyboard /></Button>
				</PopoverTrigger>
				<PopoverContent align="end" className="max-h-[min(36rem,calc(100dvh-6rem))] w-[min(46rem,calc(100vw-2rem))] overflow-y-auto p-4">
					<ShortcutList groups={sheetGridShortcuts()} title="Sheet shortcuts" />
				</PopoverContent>
			</Popover>
			<Button variant="ghost" size="sm" shortcut="⌘J" onClick={() => setPanel((p) => (p === "assistant" ? null : "assistant"))}>Ask</Button>
			<Button variant="ghost" size="icon-sm" aria-label="Table settings" aria-pressed={panel === "settings"} onClick={() => setPanel((p) => (p === "settings" ? null : "settings"))}><Settings /></Button>
		</>
	);

	const people = (
		<>
			{/* Toolbar: the count on the left; the filter button with the other table actions on the right. */}
			<div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2 max-md:px-2">
				<span className="tabular min-w-0 flex-1 text-sm text-ink-2">{Object.keys(filters).length ? "" : `${rows.length} people`}</span>
				<FilterButton fields={filterFields} value={filters} onChange={setFilters} />
				<ColumnsMenu columns={columns} onChange={setColumns} />
				<Button variant="outline" size="sm" onClick={() => setImporting(true)}><FileUp />Import CSV</Button>
				<ExportMenu onlyVisible={onlyVisible} onOnlyVisibleChange={setOnlyVisible} onDownload={(f) => toast.success(`Downloaded ${gridRows.length} rows as ${f}`)} />
				<Button size="sm" onClick={() => setPanel((p) => (p === "add" ? null : "add"))}><Plus />Add column</Button>
			</div>
			{/* Applied filters on their own row; FilterRow renders nothing until one is applied. */}
			<FilterRow fields={filterFields} value={filters} onChange={setFilters} shown={gridRows.length} total={rows.length} noun="people" className="border-b border-line bg-surface-2 px-4 py-2 max-md:px-2" />
			<div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
				<BulkActionBar size="dense" count={selected.length} noun={selected.length === 1 ? "person" : "people"} onClear={() => setSelected([])} className="mb-2 rounded-sm border border-line max-md:mb-0 max-md:rounded-none max-md:border-x-0" actions={[
						{ label: "Run computed columns", icon: <RefreshCw />, onSelect: () => { queue((r) => selected.includes(r.id), computedCols.map((c) => c.id)); toast(`Running ${selected.length} rows`, { description: `About ${Math.round(selected.length * costPerRow)} credits.` }); } },
						{ label: "Subscribe", icon: <MailCheck />, onSelect: () => { const ids = selected; const before = rows; setRows((rs) => rs.map((r) => (ids.includes(r.id) ? { ...r, values: { ...r.values, subscribed: true } } : r))); toast.success(`Subscribed ${ids.length} people to the newsletter`, { action: { label: "Undo", onClick: () => setRows(before) } }); } },
						{ label: "Delete", icon: <Trash2 />, destructive: true, onSelect: () => deleteRows(selected) },
					]} />
				<SheetGrid
					aria-label="People"
					size="dense"
					className="min-h-0 flex-1 max-md:rounded-none max-md:border-x-0"
					columns={shownColumns}
					onColumnsChange={(cs) => setColumns(cs.map(({ status: _s, ...c }) => c))}
					rows={gridRows}
					onCellChange={(id, col, v) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, values: { ...r.values, [col]: v } } : r)))}
					onCellsChange={onCellsChange}
					sort={sort}
					onSortChange={setSort}
					groupBy="stage"
					filterRow
					selectedRowIds={selected}
					onSelectedRowIdsChange={setSelected}
					onOpenRow={openRecord}
					rowActions={(row) => (
						<>
							<DropdownMenuItem onSelect={() => queue((r) => r.id === row.id, computedCols.map((c) => c.id))}><RefreshCw />Run computed columns{costPerRow ? ` · ${costPerRow} credits` : ""}</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => duplicateRow(row.id)}><Copy />Duplicate row</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem variant="destructive" onSelect={() => deleteRows([row.id])}><Trash2 />Delete row</DropdownMenuItem>
						</>
					)}
					onFilterColumn={(c) => (FILTER_FIELDS.some((f) => f.id === c) ? toast("Use the filter button to choose values", { description: "Press F, pick the field, then tick the values." }) : toast(`Use the search field under ${columns.find((x) => x.id === c)?.label}`, { description: "Seniority, Stage and Owner also have filters." }))}
					onInsertColumn={() => setPanel("add")}
					onEditColumn={() => setPanel("add")}
					onRetryCell={(rowId, col) => queue((r) => r.id === rowId, [col])}
					onRetryColumn={(col) => queue((r) => r.computed?.[col]?.state === "failed", [col])}
					onAddRows={addRows}
				/>
			</div>
			<RunStatusBar
				running={running}
				label={runningNames.join(" and ")}
				done={finishedRows}
				total={rows.length}
				errors={failed}
				creditsUsed={Math.round(credits * 10) / 10}
				costPerRow={costPerRow}
				onStop={stop}
				onRunRemaining={() => queue((r) => computedCols.some((c) => !r.computed?.[c.id]), computedCols.map((c) => c.id))}
				autoRun={autoRun}
				onAutoRunChange={(on) => { setAutoRun(on); toast.success(on ? "Auto-run on" : "Auto-run off", { description: on ? `New and imported rows run straight away, about ${costPerRow} credits each.` : "New rows wait until you run them." }); }}
				history={history.map((h) => ({ ...h, when: <Timestamp value={new Date(h.at)} /> }))}
			/>
		</>
	);

	const overview = (
		<div className="grid content-start gap-4 p-6 max-md:p-4">
			<h2 className="text-lg font-semibold text-ink">Overview</h2>
			<dl className="grid grid-cols-3 divide-x divide-line rounded-sm border border-line max-md:grid-cols-1 max-md:divide-x-0 max-md:divide-y">
				{([["People", rows.length], ["Companies", companyRows.length], ["Computed columns", computedCols.length + 1]] as const).map(([k, v]) => (
					<div key={k} className="grid gap-0.5 px-3 py-2"><dt className="text-sm text-ink-2">{k}</dt><dd className="tabular text-xl font-semibold text-ink">{v}</dd></div>
				))}
			</dl>
			<div className="max-w-sm">{meter}</div>
		</div>
	);

	const panels = (
		<>
			<SidePanel
				open={panel === "record" && !!record}
				onOpenChange={(o) => !o && setPanel(null)}
				label="Person details"
				title={String(record?.values.name ?? "")}
				meta={`${record?.values.title || "No job title"} · ${record?.values.company ?? ""}`}
				onPrevious={recordAt > 0 ? () => setRecordId(gridRows[recordAt - 1].id) : undefined}
				onNext={recordAt >= 0 && recordAt < gridRows.length - 1 ? () => setRecordId(gridRows[recordAt + 1].id) : undefined}
			>
				{record && (
					<dl className="grid grid-cols-[8rem_1fr] gap-x-3 gap-y-2.5 text-base">
						<dt className="text-ink-2">Stage</dt><dd>{record.values.stage ? <Tag>{String(record.values.stage)}</Tag> : "–"}</dd>
						<dt className="text-ink-2">Owner</dt><dd>{ownerCell(record.values.owner) ?? "–"}</dd>
						<dt className="text-ink-2">Deal size</dt><dd className="tabular">{gbp(Number(record.values.deal ?? 0))}</dd>
						<dt className="text-ink-2">Probability</dt><dd className="tabular">{isClosed(record.values.stage) ? <span aria-label="not applicable" className="text-ink-3">n/a</span> : `${record.values.probability ?? 0} %`}</dd>
						<dt className="text-ink-2">Weighted deal</dt><dd className="tabular">{gbp(weighted(record.values))}</dd>
						<dt className="text-ink-2">Close date</dt><dd className="tabular">{record.values.closes ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(String(record.values.closes))) : "–"}</dd>
						<dt className="text-ink-2">Newsletter</dt><dd>{record.values.subscribed ? "Subscribed" : "Not subscribed"}</dd>
						<dt className="text-ink-2">Work email</dt><dd className="break-all">{record.computed?.email?.state === "done" ? record.computed.email.value : record.computed?.email?.state === "not-found" ? "Not found" : "–"}</dd>
						<dt className="text-ink-2">Role</dt><dd>{record.computed?.summary?.state === "done" ? record.computed.summary.value : "–"}</dd>
						<dt className="text-ink-2">Company size</dt><dd className="tabular">{Number(record.values.employees ?? 0).toLocaleString("en-GB")}</dd>
					</dl>
				)}
			</SidePanel>
			<SidePanel open={panel === "add"} onOpenChange={(o) => !o && setPanel(null)} label="Add column" title="Add column" meta={`${rows.length} rows in People`}>
				<ActionCatalogue actions={CATALOGUE} rowCount={rows.length} onAdd={addColumn} />
			</SidePanel>
			<TableSettings
				open={panel === "settings"}
				onOpenChange={(o) => !o && setPanel(null)}
				value={settings}
				onSave={async (v) => { await new Promise((r) => setTimeout(r, 500)); setSettings(v); }}
				columns={[{ id: "email", label: "Work email" }, { id: "name", label: "Name" }, { id: "domain", label: "Company domain" }]}
				tableName="People"
				workspaceName="TwoUX"
				templateLink="https://app.example.com/t/twoux-prospects"
			/>
			<AssistantPanel
				open={panel === "assistant"}
				onOpenChange={(o) => !o && setPanel(null)}
				title="Ask about this table"
				caveat="Reads this table only, not HubSpot or Salesforce. Check emails marked Not found in HubSpot before writing to those people."
				composer={<MessageComposer noun={{ one: "row", many: "rows" }} placeholder="Ask about these people" chips={[{ id: "sheet", label: "People" }, ...FILTER_FIELDS.filter((f) => filters[f.id]?.length).map((f) => ({ id: `f-${f.id}`, label: `${f.label}: ${filters[f.id].join(", ")}` }))]} mentions={rows.slice(0, 8).map((r) => ({ id: r.id, label: String(r.values.name) }))} onSend={(t) => setThread((x) => [...x, t])} />}
			>
				<UserMessage>Which rows failed and why?</UserMessage>
				<AssistantMessage from="the People sheet">
					<p>{failed ? `${failed} ${failed === 1 ? "cell has" : "cells have"} failed so far.` : "No cells have failed so far."} George Lowe has no company domain, so Work email can't look him up. Yusuf Hassan has no job title, so Summarise role has nothing to read.</p>
					<p>Add the missing values, then press Enter on the cell to run it again. Each retry costs the column's usual price.</p>
				</AssistantMessage>
				{thread.map((t, i) => (
					<div key={i} className="grid gap-5">
						<UserMessage>{t}</UserMessage>
						<AssistantMessage from="the People sheet"><p>This example only answers the first question. In a real table I'd read the {gridRows.length} rows in view.</p></AssistantMessage>
					</div>
				))}
			</AssistantPanel>
		</>
	);

	return (
		<div className="h-full min-h-0">
			<ExampleShell className="h-example-frame" frame="flush" sidebar={sidebar} topBar={topBar} panel={panels}>
				<div className="flex h-full min-h-0 flex-col">
					<div className="flex min-h-0 flex-1 flex-col">
						{sheet === "people" ? people : sheet === "companies" ? (
							<SheetGrid aria-label="Companies" size="dense" className="min-h-0 flex-1" columns={companyCols} onColumnsChange={setCompanyCols} rows={companyRows} onCellChange={(id, col, v) => setCompanyRows((rs) => rs.map((r) => (r.id === id ? { ...r, values: { ...r.values, [col]: v } } : r)))} onAddRows={(n) => setCompanyRows((rs) => [...rs, ...Array.from({ length: n }, (_, i) => ({ id: `c${Date.now()}${i}`, values: {} }))])} />
						) : overview}
					</div>
					<div className="flex shrink-0 items-center gap-1 overflow-x-auto border-t border-line bg-surface-2 px-2">
						<Tabs value={sheet} onValueChange={(v) => setSheet(v as Sheet)}>
							<TabsList aria-label="Sheets" className="border-b-0">
								<TabsTrigger value="overview">Overview</TabsTrigger>
								<TabsTrigger value="people" count={rows.length}>People</TabsTrigger>
								<TabsTrigger value="companies" count={companyRows.length}>Companies</TabsTrigger>
							</TabsList>
						</Tabs>
						<Button variant="ghost" size="xs" onClick={() => toast("Adding sheets isn't set up in this example")}><Plus />Add</Button>
						{running && sheet !== "people" && <Badge variant="secondary" className="ml-auto">People is running</Badge>}
					</div>
				</div>
			</ExampleShell>
			<ShortcutSheet singleKeys={singleKeys} onSingleKeysChange={setSingleKeys} groups={sheetGridShortcuts()} />
			<CsvImport open={importing} onOpenChange={setImporting} targets={IMPORT_TARGETS} tableName="People" sample={SAMPLE_CSV} aliases={IMPORT_ALIASES} onImport={onImport} />
		</div>
	);
}
