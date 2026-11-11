import {
	Badge,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Button,
	CartesianChart,
	ChartFrame,
	ChartLegend,
	type ChartSeries,
	Count,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
	HelpPanel,
	type PaneDef,
	PaneLayout,
	type PaneLayoutValue,
	RollingNumber,
	ShortcutSheet,
	ShortcutsProvider,
	SidebarItem,
	SidebarSection,
	Swap,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Timestamp,
	chartTable,
	cn,
	seriesColor,
	toast,
	usePaneSize,
} from "@twoux/ui";
import { Bell, Boxes, Calendar, Camera, Check, ChevronRight, CircleHelp, Cpu, Disc3, FileStack, HardDrive, LayoutDashboard, Network, RefreshCw, Scale, Server, Shield, Tag } from "lucide-react";
import { Fragment, type CSSProperties, useEffect, useState } from "react";
import { ALARMS, type AlarmState, CAPACITY, DAYS, EVENTS, HOURS_SERIES, LIMITS, NOTIFICATIONS, TIMES, TRAFFIC_SERIES } from "./operations/data";
import { ExampleShell } from "../../components/example-shell";
import { ExampleBrand } from "../../components/example-brand";

/* Operations console for Meridian Compute in uk-south-1: a workspace for the on-call engineer, who watches alarms,
   traffic and capacity together for a whole shift. Regions are panes people resize, move and collapse; details stay
   behind an expanded row or the pane's menu until asked for. */

const ALARM_TONE: Record<AlarmState, "destructive" | "secondary" | "success"> = { "In alarm": "destructive", "Insufficient data": "secondary", OK: "success" };
const link = "rounded-xs font-medium text-primary-ink hover:underline";
const num = (n: number) => n.toLocaleString("en-GB");

const DEFAULT_LAYOUT: PaneLayoutValue = [
	{ id: "c1", size: 34, panes: [{ id: "alarms", size: 55 }, { id: "events", size: 45 }] },
	{ id: "c2", size: 40, panes: [{ id: "traffic", size: 52 }, { id: "hours", size: 48 }] },
	{ id: "c3", size: 26, panes: [{ id: "zones", size: 40 }, { id: "limits", size: 60 }] },
];

const HELP = {
	id: "console",
	title: "Operations console",
	body: (
		<>
			<p>The console shows Meridian Compute in <strong>uk-south-1</strong>: what is firing, what is scheduled and how much capacity is left. Figures refresh every 10 seconds.</p>
			<p>Resize a pane by dragging the line between panes, or focus it and use the arrow keys. Move a pane by dragging its handle, or press Space on the handle, use the arrow keys and press Space again. Each pane's menu also has Move, Wider, Taller, Collapse and Reset layout.</p>
		</>
	),
	links: [{ label: "Alarm runbooks", href: "https://example.com/docs/runbooks" }],
};

/* Layout kept between visits. A real app saves it per person on the server. */
function useSavedLayout() {
	const [layout, setLayout] = useState<PaneLayoutValue>(() => {
		try {
			const raw = window.localStorage.getItem("twoux.operations.layout");
			return raw ? (JSON.parse(raw) as PaneLayoutValue) : DEFAULT_LAYOUT;
		} catch {
			return DEFAULT_LAYOUT;
		}
	});
	useEffect(() => {
		try { window.localStorage.setItem("twoux.operations.layout", JSON.stringify(layout)); } catch { /* keep for this visit */ }
	}, [layout]);
	return [layout, setLayout] as const;
}

/* ---------------------------------------------------------------- panes */

/* A chart that fills its pane. The legend toggles series; the table view is in the pane's menu. */
function ChartPane({ title, description, kind, stacked, x, series, xLabel, yLabel, view, onViewChange }: { title: string; description: string; kind: "line" | "bar"; stacked?: boolean; x: string[]; series: ChartSeries[]; xLabel: string; yLabel: string; view: "chart" | "table"; onViewChange: (v: "chart" | "table") => void }) {
	const { height, stacked: narrow } = usePaneSize();
	const [hidden, setHidden] = useState<string[]>([]);
	const h = narrow ? 220 : Math.max(110, height - 52);
	return (
		<ChartFrame
			titleHidden
			level={2}
			view={view}
			onViewChange={onViewChange}
			title={title}
			description={description}
			height={h}
			table={chartTable(xLabel, x, series)}
			legend={<ChartLegend items={series.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i), shape: kind === "line" ? "line" : "box" }))} hidden={hidden} onToggle={(id) => setHidden((hs) => (hs.includes(id) ? hs.filter((v) => v !== id) : [...hs, id]))} />}
		>
			<CartesianChart kind={kind} stacked={stacked} x={x} series={series} hidden={hidden} height={h} yLabel={yLabel} aria-label={`${kind === "line" ? "Line" : "Stacked bar"} chart showing ${title.toLowerCase()}, ${description.toLowerCase()}`} />
		</ChartFrame>
	);
}

/* Alarms firing first; a row opens to show the current value, when it started and the runbook. */
function Alarms() {
	const [open, setOpen] = useState<string[]>(["a1"]);
	const order: AlarmState[] = ["In alarm", "Insufficient data", "OK"];
	const rows = [...ALARMS].sort((a, b) => order.indexOf(a.state) - order.indexOf(b.state));
	return (
		<Table size="dense" aria-label="Alarms">
			<TableHeader>
				<TableRow className="hover:bg-transparent"><TableHead className="w-8"><span className="sr-only">Details</span></TableHead><TableHead>Name</TableHead><TableHead>Status</TableHead><TableHead>Since</TableHead></TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((a) => {
					const isOpen = open.includes(a.id);
					return (
						<Fragment key={a.id}>
							<TableRow>
								<TableCell>
									<Button variant="ghost" size="icon-xs" aria-expanded={isOpen} aria-controls={`alarm-${a.id}`} aria-label={`${isOpen ? "Hide" : "Show"} details for ${a.name}`} onClick={() => setOpen((o) => (o.includes(a.id) ? o.filter((x) => x !== a.id) : [...o, a.id]))}>
										<ChevronRight className={cn("transition-transform duration-(--duration-fast)", isOpen && "rotate-90")} />
									</Button>
								</TableCell>
								<TableCell><a href={`#${a.name}`} className={`${link} font-mono`}>{a.name}</a></TableCell>
								<TableCell><Badge variant={ALARM_TONE[a.state]}>{a.state}</Badge></TableCell>
								<TableCell className="text-ink-2"><Timestamp value={a.since} short /></TableCell>
							</TableRow>
							{isOpen && (
								<TableRow id={`alarm-${a.id}`} className="hover:bg-transparent">
									<TableCell />
									<TableCell colSpan={3} className="whitespace-normal">
										<dl className="grid grid-cols-[auto_1fr] gap-x-group gap-y-tight py-tight text-sm">
											<dt className="text-ink-2">Condition</dt><dd className="text-ink">{a.metric}</dd>
											<dt className="text-ink-2">Now</dt><dd className="text-ink tabular">{a.current}</dd>
											<dt className="text-ink-2">Resource</dt><dd className="text-ink">{a.resource}</dd>
											<dt className="text-ink-2">Runbook</dt><dd><a href={a.runbook} className={link}>Open runbook</a></dd>
										</dl>
									</TableCell>
								</TableRow>
							)}
						</Fragment>
					);
				})}
			</TableBody>
		</Table>
	);
}

/* Ongoing first, then by start time; the description stays behind the row until asked for. */
function Events() {
	const [open, setOpen] = useState<string[]>([]);
	const rows = [...EVENTS].sort((a, b) => (a.status === b.status ? a.starts.getTime() - b.starts.getTime() : a.status === "Ongoing" ? -1 : 1));
	return (
		<Table size="dense" aria-label="Scheduled events">
			<TableHeader>
				<TableRow className="hover:bg-transparent"><TableHead className="w-8"><span className="sr-only">Details</span></TableHead><TableHead>Type</TableHead><TableHead>Instance</TableHead><TableHead>Status</TableHead><TableHead>Starts</TableHead></TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((e) => {
					const isOpen = open.includes(e.id);
					return (
						<Fragment key={e.id}>
							<TableRow>
								<TableCell>
									<Button variant="ghost" size="icon-xs" aria-expanded={isOpen} aria-controls={`event-${e.id}`} aria-label={`${isOpen ? "Hide" : "Show"} details for ${e.type} on ${e.instance}`} onClick={() => setOpen((o) => (o.includes(e.id) ? o.filter((x) => x !== e.id) : [...o, e.id]))}>
										<ChevronRight className={cn("transition-transform duration-(--duration-fast)", isOpen && "rotate-90")} />
									</Button>
								</TableCell>
								<TableCell className="text-ink">{e.type}</TableCell>
								<TableCell><a href={`#${e.instance}`} className={`${link} font-mono`}>{e.instance}</a></TableCell>
								<TableCell>{e.status === "Ongoing" ? <Badge variant="warning">Ongoing</Badge> : <Badge variant="secondary">Scheduled</Badge>}</TableCell>
								<TableCell className="text-ink-2"><Timestamp value={e.starts} short /></TableCell>
							</TableRow>
							{isOpen && (
								<TableRow id={`event-${e.id}`} className="hover:bg-transparent">
									<TableCell />
									<TableCell colSpan={4} className="whitespace-normal">
										<dl className="grid grid-cols-[auto_1fr] gap-x-group gap-y-tight py-tight text-sm">
											<dt className="text-ink-2">Event</dt><dd className="font-mono text-ink">{e.id}</dd>
											<dt className="text-ink-2">Window</dt><dd className="text-ink"><Timestamp value={e.starts} format="absolute" /> to <Timestamp value={e.ends} format="absolute" /></dd>
											<dt className="text-ink-2">What to do</dt><dd className="text-ink">{e.note}</dd>
										</dl>
									</TableCell>
								</TableRow>
							)}
						</Fragment>
					);
				})}
			</TableBody>
		</Table>
	);
}

/* Capacity per zone with the zone's status in words; the bar turns warning from 90%. */
function Zones() {
	return (
		<ul className="grid gap-group p-region">
			{CAPACITY.map((c) => (
				<li key={c.zone} className="grid gap-tight">
					<div className="flex items-center justify-between gap-inline text-sm">
						<span className="font-mono text-ink">{c.zone}</span>
						{c.state === "Disrupted" ? <Badge variant="warning">Disrupted</Badge> : <Badge variant="success">Operating normally</Badge>}
					</div>
					<div className="grid grid-cols-[1fr_3rem] items-center gap-inline text-sm">
						<span className="h-2 overflow-hidden rounded-xs bg-hover" aria-hidden="true">
							<span className={`block h-full w-(--w) rounded-xs ${c.used >= 90 ? "bg-warn" : "bg-primary"}`} style={{ "--w": `${c.used}%` } as CSSProperties} />
						</span>
						<span className="tabular text-right text-ink">{c.used}%<span className="sr-only"> of capacity used{c.used >= 90 ? ", near capacity" : ""}</span></span>
					</div>
					{c.note && <p className="text-sm text-ink-2">{c.note}</p>}
				</li>
			))}
		</ul>
	);
}

/* Limits closest to full first; a request link only where it is needed. */
function Limits() {
	const rows = [...LIMITS].sort((a, b) => b.used / b.limit - a.used / a.limit);
	return (
		<Table size="dense" aria-label="On-demand limits">
			<TableHeader>
				<TableRow className="hover:bg-transparent"><TableHead>Resource</TableHead><TableHead className="text-right">Used</TableHead><TableHead>Status</TableHead></TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((l) => {
					const near = l.used / l.limit >= 0.9;
					return (
						<TableRow key={l.id}>
							<TableCell className="whitespace-normal text-ink">{l.name}</TableCell>
							<TableCell className="tabular text-right text-ink-2">{num(l.used)} of {num(l.limit)}</TableCell>
							<TableCell>{near ? <a href="https://example.com/limit-increase" target="_blank" rel="noreferrer" className={link}>Request increase<span className="sr-only"> for {l.name} (opens in a new tab)</span></a> : <Badge variant="secondary">Within limit</Badge>}</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}

/* ---------------------------------------------------------------- screen */

export function OperationsExample() {
	const [layout, setLayout] = useSavedLayout();
	const [help, setHelp] = useState(false);
	const [singleKeys, setSingleKeys] = useState(true);
	const [updated, setUpdated] = useState(() => new Date());
	const [phase, setPhase] = useState<"idle" | "busy" | "done">("idle");
	const [notes, setNotes] = useState(NOTIFICATIONS);
	const [views, setViews] = useState<Record<string, "chart" | "table">>({ traffic: "chart", hours: "chart" });
	const [tick, setTick] = useState(0);

	// Figures refresh every 10 seconds; Refresh (R) does it now.
	useEffect(() => {
		const id = window.setInterval(() => { setTick((t) => t + 1); setUpdated(new Date()); }, 10_000);
		return () => window.clearInterval(id);
	}, []);
	const refresh = () => {
		if (phase === "busy") return;
		setPhase("busy");
		window.setTimeout(() => {
			setTick((t) => t + 1);
			setUpdated(new Date());
			setPhase("done");
			window.setTimeout(() => setPhase("idle"), 1400);
		}, 600);
	};

	// Traffic is in 3-hour buckets. Buckets still to come are gaps, never zero; the current one moves with each refresh.
	const now = updated.getHours();
	const current = Math.min(TIMES.length - 1, Math.floor(now / 3));
	const jitter = (n: number, k: number) => Math.round(n * (1 + Math.sin(tick * 1.7 + k) * 0.06));
	const traffic = TRAFFIC_SERIES.map((s, k) => ({ ...s, data: s.data.map((v, i) => (i > current || v === null ? null : i === current ? jitter(v as number, k) : v)) }));
	const running = LIMITS.filter((l) => l.id !== "eip").reduce((t, l) => t + l.used, 0) + (tick % 3) - 1;
	const firing = ALARMS.filter((a) => a.state === "In alarm").length;
	const ongoing = EVENTS.filter((e) => e.status === "Ongoing").length;
	const peak = [...CAPACITY].sort((a, b) => b.used - a.used)[0];
	const disrupted = CAPACITY.filter((c) => c.state === "Disrupted");
	const degraded = firing > 0 || disrupted.length > 0;
	const lastIn = traffic[0].data[current] as number;
	const lastOut = traffic[1].data[current] as number;

	const reset = () => {
		const before = layout;
		setLayout(DEFAULT_LAYOUT);
		toast.success("Layout reset", { action: { label: "Undo", onClick: () => setLayout(before) } });
	};
	const viewMenu = (id: string) => <DropdownMenuItem onSelect={() => setViews((v) => ({ ...v, [id]: v[id] === "chart" ? "table" : "chart" }))}>{views[id] === "chart" ? "Show as table" : "Show chart"}</DropdownMenuItem>;

	const panes: Record<string, PaneDef> = {
		alarms: { title: `Alarms, ${firing} in alarm`, menu: <DropdownMenuItem asChild><a href="#alarms">View all alarms</a></DropdownMenuItem>, children: <Alarms /> },
		events: { title: "Scheduled events", menu: <DropdownMenuItem asChild><a href="#events">View all events</a></DropdownMenuItem>, children: <Events /> },
		traffic: {
			title: "Network traffic, today",
			menu: viewMenu("traffic"),
			children: <ChartPane title="Network traffic" description="Today in 3-hour blocks, in MB/s; hours still to come are empty" kind="line" x={TIMES} series={traffic} xLabel="Hour" yLabel="MB/s" view={views.traffic} onViewChange={(v) => setViews((s) => ({ ...s, traffic: v }))} />,
		},
		hours: {
			title: "Instance hours by type, 1 to 15 November",
			menu: viewMenu("hours"),
			children: <ChartPane title="Instance hours by type" description="1 to 15 November, in hours" kind="bar" stacked x={DAYS} series={HOURS_SERIES} xLabel="Day" yLabel="hours" view={views.hours} onViewChange={(v) => setViews((s) => ({ ...s, hours: v }))} />,
		},
		zones: { title: "Capacity by zone", children: <Zones /> },
		limits: { title: "On-demand limits", menu: <DropdownMenuItem asChild><a href="#limits">View all limits</a></DropdownMenuItem>, children: LIMITS.length ? <Limits /> : <Empty><EmptyHeader><EmptyTitle level={3}>No limits apply</EmptyTitle><EmptyDescription>This region has no on-demand limits.</EmptyDescription></EmptyHeader></Empty> },
	};

	return (
		<ShortcutsProvider enabled={singleKeys}>
			<div className="h-full min-h-0">
				<ExampleShell
					className="h-example-frame"
					frame="flush"
					sidebar={
						<>
							<ExampleBrand label="Meridian Compute" />
							<SidebarSection>
								<SidebarItem label="Console" icon={<LayoutDashboard />} current />
								<SidebarItem label="Events" icon={<Calendar />} count={EVENTS.length} />
							</SidebarSection>
							<SidebarSection title="Instances">
								<SidebarItem label="Instances" icon={<Server />} />
								<SidebarItem label="Instance types" icon={<Cpu />} />
								<SidebarItem label="Launch templates" icon={<FileStack />} />
								<SidebarItem label="Reserved instances" icon={<Tag />} />
								<SidebarItem label="Capacity reservations" icon={<Boxes />} />
							</SidebarSection>
							<SidebarSection title="Images"><SidebarItem label="Machine images" icon={<Disc3 />} /></SidebarSection>
							<SidebarSection title="Storage">
								<SidebarItem label="Volumes" icon={<HardDrive />} />
								<SidebarItem label="Snapshots" icon={<Camera />} />
							</SidebarSection>
							<SidebarSection title="Networking">
								<SidebarItem label="Security groups" icon={<Shield />} />
								<SidebarItem label="Load balancers" icon={<Network />} />
							</SidebarSection>
							<SidebarSection title="Autoscaling"><SidebarItem label="Scaling groups" icon={<Scale />} /></SidebarSection>
						</>
					}
					topBar={
						<>
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem><BreadcrumbLink href="#compute">Meridian Compute</BreadcrumbLink></BreadcrumbItem>
									<BreadcrumbSeparator />
									<BreadcrumbItem><BreadcrumbPage>Operations console</BreadcrumbPage></BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
							<span className="flex-1" />
							<span className="text-sm text-ink-2 max-md:hidden">Updated <Timestamp key={updated.getTime()} value={updated} format="time" /></span>
							<Button variant="ghost" size="sm" shortcut="R" onClick={refresh} loading={phase === "busy"}>
								{phase !== "busy" && <Swap swapKey={phase} kind="icon">{phase === "done" ? <Check /> : <RefreshCw />}</Swap>}
								Refresh
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm" aria-label={`Notifications, ${notes.length} unread`}>
										<Bell />
										{notes.length > 0 && <Count value={notes.length} className="text-sm" />}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-80">
									{notes.length === 0 ? (
										<p className="px-inline py-group text-base text-ink-2">You have no unread notifications.</p>
									) : (
										<>
											{notes.map((n) => (
												<DropdownMenuItem key={n.id} className="grid gap-hair" onSelect={() => setNotes((cur) => cur.filter((c) => c.id !== n.id))}>
													<span className="text-base text-ink">{n.text}</span>
													<Timestamp value={n.when} className="text-sm text-ink-3" />
												</DropdownMenuItem>
											))}
											<DropdownMenuSeparator />
											<DropdownMenuItem onSelect={() => setNotes([])}>Mark all as read</DropdownMenuItem>
										</>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
							<Button variant="ghost" size="icon-sm" aria-label="Help for this page" aria-pressed={help} onClick={() => setHelp((h) => !h)}><CircleHelp /></Button>
						</>
					}
					panel={<HelpPanel open={help} onOpenChange={setHelp} topic={HELP} />}
				>
					<div className="flex h-full min-h-0 flex-col">
						{/* Region status and the figures the on-call engineer checks first. */}
						<section aria-labelledby="region" className="flex shrink-0 flex-wrap items-center gap-x-7 gap-y-tight border-b border-line px-page py-control">
							<div className="flex items-center gap-inline">
								<h1 id="region" className="font-mono text-lg font-semibold text-ink">uk-south-1</h1>
								{degraded ? <Badge variant="warning">Degraded</Badge> : <Badge variant="success">Operating normally</Badge>}
							</div>
							<dl className="flex flex-wrap gap-x-7 gap-y-inline text-sm">
								<div className="grid"><dt className="text-xs text-ink-3">Running instances</dt><dd className="font-semibold text-ink"><RollingNumber value={num(running)} /></dd></div>
								<div className="grid"><dt className="text-xs text-ink-3">Alarms</dt><dd className={cn("font-semibold tabular", firing ? "text-bad" : "text-ink")}>{firing} in alarm <span className="font-normal text-ink-2">of {ALARMS.length}</span></dd></div>
								<div className="grid"><dt className="text-xs text-ink-3">Events</dt><dd className="text-ink tabular">{ongoing} ongoing, {EVENTS.length - ongoing} scheduled</dd></div>
								<div className="grid"><dt className="text-xs text-ink-3">Busiest zone</dt><dd className={cn("tabular", peak.used >= 90 ? "text-warn" : "text-ink")}>{peak.zone} at {peak.used}%</dd></div>
								<div className="grid"><dt className="text-xs text-ink-3">Traffic now (MB/s)</dt><dd className="text-ink tabular"><RollingNumber value={`${lastIn} in, ${lastOut} out`} /></dd></div>
							</dl>
							{degraded && <p className="text-sm text-ink-2 max-xl:hidden">{firing} alarms firing{disrupted.length ? `, ${disrupted.map((d) => d.zone).join(", ")} disrupted` : ""}</p>}
						</section>
						<PaneLayout aria-label="Operations console" value={layout} onValueChange={setLayout} panes={panes} onReset={reset} />
					</div>
				</ExampleShell>
				<ShortcutSheet
					singleKeys={singleKeys}
					onSingleKeysChange={setSingleKeys}
					groups={[
						{ title: "Console", items: [{ keys: ["R"], action: "Refresh now" }, { keys: ["?"], action: "Show keyboard shortcuts" }, { keys: ["⌘", "B"], action: "Collapse or expand the sidebar" }] },
						{
							title: "Panes",
							items: [
								{ keys: ["Space"], action: "On a pane's handle: pick up, then drop" },
								{ keys: ["←", "→", "↑", "↓"], action: "Move the picked-up pane, or resize from a divider" },
								{ keys: ["Esc"], action: "Put the pane back" },
							],
						},
					]}
				/>
			</div>
		</ShortcutsProvider>
	);
}
