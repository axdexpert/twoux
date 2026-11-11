import {
	AiOrigin,
	AssistantMessage,
	AssistantPanel,
	Badge,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BulkActionBar,
	Button,
	Checkbox,
	Citation,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	ExportMenu,
	FilterBar,
	FilterMenu,
	FilterPill,
	FilterSummary,
	MessageComposer,
	PageHeader,
	SavedViews,
	ShortcutSheet,
	SidePanel,
	SidebarItem,
	SidebarSection,
	StatCompare,
	SuggestedChanges,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TablePagination,
	TableRow,
	TableSortHead,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Timestamp,
	UserMessage,
	toast,
	useRowKeyboard,
} from "@twoux/ui";
import { BarChart3, Briefcase, Ellipsis, Inbox, Plus, Settings, MessageSquare, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LISTINGS, type Listing, STATUS_VARIANT, formatDate } from "../examples/list-table/data";
import { ExampleShell } from "../components/example-shell";
import { ExampleBrand } from "../components/example-brand";

type Field = "status" | "location" | "role";
type Sort = { key: "role" | "applicants" | "closes"; dir: "asc" | "desc" };
const VIEWS: Record<string, Partial<Record<Field, string[]>>> = { all: {}, open: { status: ["Open", "Closing soon"] }, closing: { status: ["Closing soon"] } };
const PAGE = 10;

/** A whole working screen, built only from TwoUX: the reference for how the parts fit together. */
export function ExampleApp() {
	const [rows, setRows] = useState<Listing[]>(LISTINGS);
	const [view, setView] = useState("open");
	const [filters, setFilters] = useState(VIEWS.open);
	const [sort, setSort] = useState<Sort>({ key: "closes", dir: "asc" });
	const [selected, setSelected] = useState<string[]>([]);
	const [page, setPage] = useState(0);
	const [panel, setPanel] = useState<{ kind: "record"; id: string } | { kind: "assistant" } | null>(null);
	const [onlyVisible, setOnlyVisible] = useState(true);
	const [singleKeys, setSingleKeys] = useState(true);
	const [asked, setAsked] = useState(false);

	const matches = (l: Listing, skip?: Field) => (Object.entries(filters) as [Field, string[]][]).every(([f, v]) => f === skip || !v?.length || v.includes(String(l[f])));
	const filtered = useMemo(() => {
		const r = rows.filter((l) => matches(l));
		const k = sort.key;
		return r.sort((a, b) => (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0) * (sort.dir === "asc" ? 1 : -1));
	}, [rows, filters, sort]);
	const shown = filtered.slice(page * PAGE, page * PAGE + PAGE);
	useEffect(() => { setPage(0); setSelected([]); }, [filters]);
	const saved = VIEWS[view] ?? {};
	const dirty = JSON.stringify(saved) !== JSON.stringify(Object.fromEntries(Object.entries(filters).filter(([, v]) => v?.length)));
	const options = (f: Field) => [...new Set(rows.map((l) => String(l[f])))].sort().map((v) => ({ value: v, label: v, count: rows.filter((l) => matches(l, f) && String(l[f]) === v).length }));
	const pills: Field[] = [...new Set<Field>(["status", "location", ...(Object.keys(filters) as Field[])])];

	const toggle = (id: string, on?: boolean) => setSelected((s) => (on ?? !s.includes(id) ? [...new Set([...s, id])] : s.filter((x) => x !== id)));
	const keys = useRowKeyboard({ count: shown.length, enabled: singleKeys, onToggle: (i, v) => shown[i] && toggle(shown[i].id, v), onOpen: (i) => shown[i] && setPanel({ kind: "record", id: shown[i].id }), onClear: () => setSelected([]), selected: selected.length });
	const current = panel?.kind === "record" ? rows.find((r) => r.id === panel.id) : null;
	// Keep the last record on screen while the panel animates closed.
	const lastRecord = useRef(current);
	if (current) lastRecord.current = current;
	const record = current ?? (panel === null ? lastRecord.current : null);
	const recIndex = record ? shown.findIndex((r) => r.id === record.id) : -1;

	const closeListings = (ids: string[]) => {
		const before = rows;
		setRows((r) => r.map((l) => (ids.includes(l.id) ? { ...l, status: "Closed" } : l)));
		setSelected([]);
		toast.success(`Closed ${ids.length} listing${ids.length === 1 ? "" : "s"}`, { description: "Closed listings stay in the Deleted view for 30 days.", action: { label: "Undo", onClick: () => setRows(before) } });
	};

	const sortHead = (key: Sort["key"], label: string, align?: "right") => (
		<TableSortHead sorted={sort.key === key && sort.dir} align={align} onSort={() => setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }))}>{label}</TableSortHead>
	);

	const sidePanel =
		panel?.kind === "assistant" ? (
			<AssistantPanel caveat="Reads listings and applications, not emails. Check closing dates before you extend a listing."
				open
				onOpenChange={() => setPanel(null)}
				title="Listings at risk"
				composer={<MessageComposer noun={{ one: "listing", many: "listings" }} chips={[...(selected.length ? [{ id: "sel", label: `${selected.length} selected` }] : []), { id: "view", label: `View: ${view === "open" ? "Open" : view}` }]} onSend={() => setAsked(true)} />}
			>
				{!asked ? (
					<p className="text-base text-ink-2">Ask about the listings in this view, for example “Which open listings are at risk?”</p>
				) : (
					<>
						<UserMessage>Which open listings are at risk?</UserMessage>
						<AssistantMessage from={`${filtered.length} listings in this view`}>
							<p><strong>2 listings</strong> close within 10 days with fewer than 10 applicants: Recruitment Coordinator <Citation id="L-1043" /> and QA Engineer <Citation id="L-1047" />.</p>
						</AssistantMessage>
						<SuggestedChanges changes={[{ id: "a", label: "Extend Recruitment Coordinator by 30 days", detail: "L-1043" }, { id: "b", label: "Extend QA Engineer by 30 days", detail: "L-1047" }]} onApply={(ids) => { toast.success(`Extended ${ids.length} listings`, { action: { label: "Undo", onClick: () => {} } }); setAsked(false); }} onDismiss={() => setAsked(false)} />
					</>
				)}
			</AssistantPanel>
		) : record ? (
			<SidePanel
				open={!!current}
				onOpenChange={() => setPanel(null)}
				label="Listing details"
				title={record.role}
				meta={<span className="flex items-center gap-2"><span className="font-mono">{record.id}</span><Badge variant={STATUS_VARIANT[record.status]} dot>{record.status}</Badge></span>}
				position={recIndex >= 0 ? { index: recIndex, total: shown.length } : undefined}
				onPrevious={() => recIndex > 0 && setPanel({ kind: "record", id: shown[recIndex - 1].id })}
				onNext={() => recIndex < shown.length - 1 && setPanel({ kind: "record", id: shown[recIndex + 1].id })}
				footer={<><Button variant="outline" size="sm" onClick={() => closeListings([record.id])}>Close listing</Button><Button size="sm" shortcut="E">Edit listing</Button></>}
			>
				<Tabs defaultValue="overview">
					<TabsList aria-label="Listing sections"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="candidates" count={record.applicants}>Candidates</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList>
					<TabsContent value="overview" className="pt-3">
						<dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 text-base">
							<dt className="text-ink-2">Location</dt><dd className="text-ink">{record.location}</dd>
							<dt className="text-ink-2">Applicants</dt><dd className="tabular text-ink">{record.applicants}</dd>
							<dt className="text-ink-2">Closes</dt><dd className="text-ink">{formatDate(record.closes)}</dd>
						</dl>
					</TabsContent>
					<TabsContent value="candidates" className="pt-3 text-base text-ink-2">{record.applicants} applicants. Open the pipeline to review them one at a time.</TabsContent>
					<TabsContent value="activity" className="grid gap-1.5 pt-3 text-base text-ink-2">
						<span>Edited by Priya Shah · <Timestamp value={new Date(Date.now() - 3 * 3600e3)} /></span>
						<span className="inline-flex items-center gap-2">Description rewritten <AiOrigin from="the hiring handbook" /></span>
					</TabsContent>
				</Tabs>
			</SidePanel>
		) : null;

	return (
		<div className="h-full min-h-0">
			<ExampleShell
				className="h-example-frame"
				sidebar={
					<>
						<ExampleBrand label="Hiring" />
						<SidebarSection>
							<SidebarItem label="Inbox" icon={<Inbox />} count={4} />
							<SidebarItem label="Assistant" icon={<MessageSquare />} current={panel?.kind === "assistant"} onClick={() => setPanel({ kind: "assistant" })} />
						</SidebarSection>
						<SidebarSection title="Hiring">
							<SidebarItem label="Listings" icon={<Briefcase />} current />
							<SidebarItem label="Candidates" icon={<Users />} />
							<SidebarItem label="Reports" icon={<BarChart3 />} />
						</SidebarSection>
						<SidebarSection title="Workspace"><SidebarItem label="Settings" icon={<Settings />} /></SidebarSection>
					</>
				}
				topBar={
					<>
						<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#hiring">Hiring</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Listings</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
						<span className="flex-1" />
						<Button variant="ghost" size="sm" shortcut="⌘J" onClick={() => setPanel({ kind: "assistant" })}>Ask</Button>
					</>
				}
				panel={sidePanel}
			>
				<PageHeader
					title="Listings"
					description={`${rows.length} listings across 8 locations`}
					actions={
						<>
							<ExportMenu onlyVisible={onlyVisible} onOnlyVisibleChange={setOnlyVisible} onDownload={(f) => toast.success(`listings.${f.toLowerCase()} downloaded`)} />
							<Button size="sm" shortcut="C" onClick={() => toast.success("Draft listing created")}><Plus />New listing</Button>
						</>
					}
				/>
				<div className="grid gap-4 px-6 pb-6 max-md:px-4">
					<div className="grid grid-cols-3 gap-3 max-lg:grid-cols-1">
						<div className="rounded-sm border border-line p-3"><StatCompare label="Open listings" value={String(rows.filter((r) => r.status === "Open" || r.status === "Closing soon").length)} change="-2" period="last week" spark={[18, 19, 21, 20, 19, 19, 18]} /></div>
						<div className="rounded-sm border border-line p-3"><StatCompare label="Applications this month" value="595" change="+12%" period="October" good spark={[42, 48, 51, 47, 55, 60, 66]} /></div>
						<div className="rounded-sm border border-line p-3"><StatCompare label="Median time to hire" value="23 days" change="-4 days" period="last quarter" good spark={[31, 30, 29, 27, 25, 24, 23]} /></div>
					</div>
					<SavedViews
						views={[{ id: "all", name: "All", count: rows.length }, { id: "open", name: "Open", count: rows.filter((r) => r.status === "Open" || r.status === "Closing soon").length }, { id: "closing", name: "Closing soon", count: rows.filter((r) => r.status === "Closing soon").length }]}
						value={view}
						onValueChange={(v) => { setView(v); setFilters(VIEWS[v] ?? {}); }}
						dirty={dirty}
						onReset={() => setFilters(saved)}
						onSave={() => toast.success("View updated", { action: { label: "Undo", onClick: () => {} } })}
						onSaveAs={(n) => toast.success(`Saved “${n}”`)}
					/>
					<FilterBar>
						{pills.map((f) => (
							<FilterPill key={f} field={{ status: "Status", location: "Location", role: "Role" }[f]} options={options(f)} selected={filters[f] ?? []} onChange={(v) => setFilters((p) => ({ ...p, [f]: v }))} onRemove={f === "status" || f === "location" ? undefined : () => setFilters((p) => { const { [f]: _, ...rest } = p; return rest; })} />
						))}
						<FilterMenu fields={[{ id: "role", label: "Role", group: "Most used" }]} onPick={(id) => setFilters((p) => ({ ...p, [id]: [] }))} />
						<FilterSummary shown={filtered.length} total={rows.length} noun="listings" onClear={() => setFilters({})} />
					</FilterBar>
					<div className="relative overflow-hidden rounded-sm border border-line bg-surface">
						<BulkActionBar count={selected.length} noun={selected.length === 1 ? "listing" : "listings"} onClear={() => setSelected([])} actions={[
								{ label: "Extend 30 days", shortcut: "T", onSelect: () => { toast.success(`Extended ${selected.length} listings by 30 days`, { action: { label: "Undo", onClick: () => {} } }); setSelected([]); } },
								{ label: "Ask about these", onSelect: () => setPanel({ kind: "assistant" }) },
								{ label: "Close listings", destructive: true, onSelect: () => closeListings(selected) },
							]} />
						<Table aria-label="Listings">
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="w-9"><Checkbox aria-label="Select all on this page" checked={shown.length > 0 && shown.every((r) => selected.includes(r.id)) ? true : shown.some((r) => selected.includes(r.id)) ? "indeterminate" : false} onCheckedChange={(v) => setSelected(v ? shown.map((r) => r.id) : [])} /></TableHead>
									{sortHead("role", "Role")}
									<TableHead>Location</TableHead>
									<TableHead>Status</TableHead>
									{sortHead("applicants", "Applicants", "right")}
									{sortHead("closes", "Closes")}
									<TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody {...keys.bodyProps} aria-label="Listings. J and K move, X selects, Enter opens.">
								{shown.map((l, i) => (
									<TableRow key={l.id} data-state={selected.includes(l.id) ? "selected" : undefined} {...keys.rowProps(i)} onDoubleClick={() => setPanel({ kind: "record", id: l.id })} className={record?.id === l.id ? "bg-hover" : undefined}>
										<TableCell><Checkbox aria-label={`Select ${l.role}`} checked={selected.includes(l.id)} onCheckedChange={() => toggle(l.id)} /></TableCell>
										<TableCell><button type="button" className="rounded-xs font-medium text-ink hover:underline" onClick={() => setPanel({ kind: "record", id: l.id })}>{l.role}</button></TableCell>
										<TableCell className="text-ink-2">{l.location}</TableCell>
										<TableCell><Badge variant={STATUS_VARIANT[l.status]} dot>{l.status}</Badge></TableCell>
										<TableCell className="tabular text-right">{l.applicants}</TableCell>
										<TableCell className="tabular text-ink-2">{formatDate(l.closes)}</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={`Actions for ${l.role}`} disabled={selected.length > 0}><Ellipsis /></Button></DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem onSelect={() => setPanel({ kind: "record", id: l.id })}>Open</DropdownMenuItem>
													<DropdownMenuItem onSelect={() => toast.success(`Duplicated ${l.role}`)}>Duplicate</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem variant="destructive" onSelect={() => closeListings([l.id])}>Close listing</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<TablePagination page={page} pageCount={Math.ceil(filtered.length / PAGE)} pageSize={PAGE} total={filtered.length} selected={selected.length} noun="listings" onPageChange={(p) => { setPage(p); setSelected([]); }} />
					</div>
				</div>
			</ExampleShell>
			<ShortcutSheet
				singleKeys={singleKeys}
				onSingleKeysChange={setSingleKeys}
				groups={[
					{ title: "Table", items: [{ keys: ["J"], action: "Next row" }, { keys: ["K"], action: "Previous row" }, { keys: ["X"], action: "Select row" }, { keys: ["↵"], action: "Open in side panel" }] },
					{ title: "Act", items: [{ keys: ["C"], action: "New listing" }, { keys: ["F"], action: "Add a filter" }, { keys: ["⌘", "J"], action: "Ask the assistant" }, { keys: ["⇧", "E"], action: "Export" }] },
				]}
			/>
		</div>
	);
}
