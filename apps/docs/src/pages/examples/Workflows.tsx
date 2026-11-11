import {
	AgentRun,
	Alert,
	AlertDescription,
	AlertTitle,
	AssistantMessage,
	AssistantPanel,
	Badge,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Button,
	ChangeRequest,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	ConfidenceNote,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
	FLOW_KIND_WORD,
	FlowCanvas,
	type FlowBranch,
	type FlowChange,
	FlowStepList,
	type FlowDirection,
	type FlowLink,
	type FlowValue,
	Input,
	Label,
	MessageComposer,
	PageHeader,
	PersonAvatar,
	RadioGroup,
	RadioGroupItem,
	type RunStep,
	Segment,
	SegmentedControl,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	ShimmerText,
	ShortcutSheet,
	ShortcutsProvider,
	SidePanel,
	SidebarItem,
	SidebarSection,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Timestamp,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	UserMessage,
	cn,
	flowOrder,
	placeAfter,
	layoutFlow,
	toast,
} from "@twoux/ui";
import { ArrowLeft, Briefcase, LayoutGrid, ListTree, CalendarDays, ChevronRight, Ellipsis, FlaskConical, Inbox, MessageSquare, Plug, Plus, Send, Users, Workflow as WorkflowIcon } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ExampleShell } from "../../components/example-shell";
import { ExampleBrand } from "../../components/example-brand";
import {
	type Flow,
	INTERVIEWERS,
	OWNERS,
	REMINDER_DIFF,
	REMINDER_SIM,
	SAMPLE,
	STARTER,
	STARTER_DIFF,
	STEP_TYPES,
	type Step,
	type StepTypeId,
	SUGGESTIONS,
	TEMPLATES,
	TEST_RESULT,
	TYPE,
	WORKFLOWS,
	type Workflow,
	type WorkflowStatus,
	step as makeStep,
	withReminder,
} from "./workflows/data";

/* Workflows for a UK hiring team: a list of automations, and an editor where people build one as connected steps,
   test it with a sample application and publish it. The assistant proposes changes as a change request the person
   approves, with Undo. No step decides about a candidate on its own: misses go to a recruiter. */

const STATUS_TONE: Record<WorkflowStatus, "success" | "secondary" | "warning"> = { Live: "success", Off: "secondary", Draft: "secondary", "Needs attention": "warning" };
const time = (d = new Date()) => d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
/** A comparable signature of a flow (React icons can't be compared). */
const sig = (f: Flow) => JSON.stringify({ s: f.steps.map(({ icon: _i, run: _r, ...s }) => s), l: f.links });
const strip = (v: FlowValue) => ({ links: v.links, steps: v.steps.map(({ run: _r, ...s }) => s) }) as Flow;

/** A control that's unavailable for now: the reason shows in a tooltip, and the control stays focusable (aria-disabled). */
function Unavailable({ when, reason, children }: { when: boolean; reason: string; children: React.ReactElement }) {
	if (!when) return children;
	return (
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent>{reason}</TooltipContent>
		</Tooltip>
	);
}

/* ---------------------------------------------------------------- list */

function WorkflowList({ rows, onOpen, onToggle, onDuplicate, onDelete, onCreate }: { rows: Workflow[]; onOpen: (id: string) => void; onToggle: (w: Workflow) => void; onDuplicate: (w: Workflow) => void; onDelete: (w: Workflow) => void; onCreate: () => void }) {
	const live = rows.filter((r) => r.status === "Live").length;
	const attention = rows.filter((r) => r.status === "Needs attention").length;
	return (
		<>
			<PageHeader
				title="Workflows"
				description={`${live} live${attention ? `, ${attention} needs attention` : ""}. Workflows run on your listings and candidates; a recruiter reviews every rejection.`}
				actions={<Button shortcut="C" onClick={onCreate}><Plus />Create workflow</Button>}
			/>
			<div className="px-page pb-page">
				<div className="overflow-x-auto rounded-sm border border-line bg-surface">
					<Table aria-label="Workflows">
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead>Name</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="max-lg:hidden">Trigger</TableHead>
								<TableHead>Last run</TableHead>
								<TableHead className="text-right max-md:hidden">Runs, 7 days</TableHead>
								<TableHead className="max-xl:hidden">Owner</TableHead>
								<TableHead className="w-12">On</TableHead>
								<TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((w) => (
								<TableRow key={w.id}>
									<TableCell className="max-w-96 whitespace-normal">
										<span className="grid">
											<a href={`#${w.id}`} onClick={(e) => { e.preventDefault(); onOpen(w.id); }} className="w-fit rounded-xs font-medium text-primary-ink hover:underline">{w.name}</a>
											<span className="line-clamp-1 text-sm text-ink-2">{w.description}</span>
										</span>
									</TableCell>
									<TableCell><Badge variant={STATUS_TONE[w.status]}>{w.status}</Badge></TableCell>
									<TableCell className="text-ink-2 max-lg:hidden">{w.trigger}</TableCell>
									<TableCell>
										{w.lastRun ? (
											<span className="grid">
												<span className={cn("text-sm", w.lastRun.outcome === "Failed" ? "text-bad" : "text-ink")}>{w.lastRun.outcome}{w.lastRun.note ? `: ${w.lastRun.note}` : ""}</span>
												<Timestamp value={w.lastRun.at} className="text-sm text-ink-3" />
											</span>
										) : (
											<span className="text-sm text-ink-3">Never run</span>
										)}
									</TableCell>
									<TableCell className="tabular text-right text-ink-2 max-md:hidden">{w.runs7d.toLocaleString("en-GB")}</TableCell>
									<TableCell className="max-xl:hidden"><span className="flex items-center gap-inline"><PersonAvatar name={w.owner} size="sm" /><span className="text-ink-2">{w.owner}</span></span></TableCell>
									<TableCell>
										{w.published ? (
											<Switch checked={w.status !== "Off"} onCheckedChange={() => onToggle(w)} aria-label={`${w.status === "Off" ? "Turn on" : "Turn off"} ${w.name}`} />
										) : (
											<Tooltip>
												<TooltipTrigger asChild><span className="inline-flex"><Switch checked={false} aria-disabled="true" onCheckedChange={() => {}} aria-label={`Turn on ${w.name}`} /></span></TooltipTrigger>
												<TooltipContent>Publish the workflow before turning it on.</TooltipContent>
											</Tooltip>
										)}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={`More actions for ${w.name}`}><Ellipsis /></Button></DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem onSelect={() => onOpen(w.id)}>Open</DropdownMenuItem>
												<DropdownMenuItem onSelect={() => onDuplicate(w)}>Duplicate</DropdownMenuItem>
												{w.published && <DropdownMenuItem onSelect={() => onToggle(w)}>{w.status === "Off" ? "Turn on" : "Turn off"}</DropdownMenuItem>}
												<DropdownMenuSeparator />
												<DropdownMenuItem variant="destructive" onSelect={() => onDelete(w)}>Delete</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</>
	);
}

/* ---------------------------------------------------------------- step settings */

function StepSettings({ step, onChange }: { step: Step; onChange: (patch: Partial<Step>) => void }) {
	const t = TYPE[step.typeId];
	const choose = (label: string, value: string, options: string[], apply: (v: string) => Partial<Step>, hint?: string) => (
		<Field>
			<FieldLabel htmlFor={`f-${step.id}-${label}`}>{label}</FieldLabel>
			<Select value={value} onValueChange={(v) => onChange(apply(v))}>
				<SelectTrigger id={`f-${step.id}-${label}`} className="w-full"><SelectValue placeholder={`Choose ${label.toLowerCase()}`} /></SelectTrigger>
				<SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
			</Select>
			{hint && <FieldDescription>{hint}</FieldDescription>}
		</Field>
	);
	const radios = (label: string, value: string, options: string[], apply: (v: string) => Partial<Step>) => (
		<fieldset className="grid gap-inline">
			<legend className="mb-inline text-base font-medium text-ink">{label}</legend>
			<RadioGroup value={value} onValueChange={(v) => onChange(apply(v))}>
				{options.map((o) => (
					<div key={o} className="flex items-center gap-inline"><RadioGroupItem id={`r-${step.id}-${o}`} value={o} /><Label htmlFor={`r-${step.id}-${o}`}>{o}</Label></div>
				))}
			</RadioGroup>
		</fieldset>
	);
	const after = (prefix: string) => (step.summary?.startsWith(prefix) ? step.summary.slice(prefix.length) : "");

	return (
		<div className="grid gap-group">
			{step.issue && (
				<Alert variant="warning">
					<AlertTitle>Needs set-up</AlertTitle>
					<AlertDescription>Choose {step.issue.replace(/^(choose|say) /, (m) => (m === "say " ? "what " : ""))} before publishing.</AlertDescription>
				</Alert>
			)}
			<Field>
				<FieldLabel htmlFor={`f-${step.id}-name`}>Name</FieldLabel>
				<Input id={`f-${step.id}-name`} value={step.title} onChange={(e) => onChange({ title: e.target.value })} />
				<FieldDescription>Say what happens, such as Offer interview times.</FieldDescription>
			</Field>
			{step.typeId === "application" && radios("Listings", step.summary === "Any Live listing" ? "All Live listings" : "Live listings in chosen locations", ["All Live listings", "Live listings in chosen locations"], (v) => ({ summary: v === "All Live listings" ? "Any Live listing" : "Live listings in Leeds, Manchester and Remote (UK)" }))}
			{step.typeId === "screen" && (
				<>
					{radios("Screen against", "The listing's must-haves", ["The listing's must-haves", "Criteria written here"], () => ({}))}
					<p className="text-base text-ink-2">The assistant writes a summary and which must-haves are met. It never rejects anyone: candidates who miss a must-have go to Recruiter review.</p>
				</>
			)}
			{step.typeId === "condition" && choose("Check", step.title.replace(/\?$/, ""), ["Meets every must-have", "Still no time chosen", "Has the right to work in the UK", "Applied in the last 7 days"], (v) => ({ title: `${v}?`, issue: undefined, summary: "Yes and No each lead to their own steps" }))}
			{step.typeId === "email" && (
				<>
					{choose("Template", after("Template: "), TEMPLATES, (v) => ({ summary: `Template: ${v}`, issue: undefined }), "Templates are in Settings, Email templates.")}
					<p className="text-base text-ink-2">{step.reaches}. In a test run this step is skipped and nothing is sent.</p>
				</>
			)}
			{step.typeId === "offer" && (
				<>
					{choose("Interviewer", step.issue ? "" : INTERVIEWERS[0], INTERVIEWERS, (v) => ({ issue: undefined, summary: `Two 45-minute times with ${v.replace(/ \(.*/, "")}, this week or next` }))}
					{radios("Length", "45 minutes", ["30 minutes", "45 minutes", "60 minutes"], () => ({}))}
				</>
			)}
			{step.typeId === "wait" && radios("Wait for", step.title.replace("Wait ", ""), ["1 day", "3 days", "1 week"], (v) => ({ title: `Wait ${v}` }))}
			{step.typeId === "review" && (
				<>
					{choose("Reviewer", "The listing's recruiter", ["The listing's recruiter", ...OWNERS], () => ({}))}
					<p className="text-base text-ink-2">The reviewer decides in their Inbox. Nothing reaches the candidate until they do.</p>
				</>
			)}
			{step.typeId === "slack" && choose("Channel", after("") || "#hiring", ["#hiring", "#recruiting-leads"], (v) => ({ summary: v }))}
			{["stage", "schedule", "update", "task", "end"].includes(step.typeId) && <p className="text-base text-ink-2">{t.hint}.</p>}
		</div>
	);
}

/* ---------------------------------------------------------------- test run */

type RunState = { phase: "idle" | "running" | "done" | "stopped" | "failed"; path: string[]; states: Record<string, NonNullable<Step["run"]>> };
const IDLE: RunState = { phase: "idle", path: [], states: {} };

/** The path the sample application takes: every condition answers Yes. */
function samplePath(flow: Flow) {
	const order: string[] = [];
	const queue = flow.steps.filter((s) => s.kind === "trigger").map((s) => s.id);
	while (queue.length) {
		const id = queue.shift()!;
		if (order.includes(id)) continue;
		order.push(id);
		const s = flow.steps.find((x) => x.id === id);
		const outs = flow.links.filter((l) => l.from === id && (s?.kind !== "condition" || l.branch === "yes"));
		queue.push(...outs.map((l) => l.to));
	}
	return order;
}

function resultFor(s: Step): { state: "done" | "skipped" | "failed"; note: string } {
	if (s.issue) return { state: "failed", note: `Needs set-up: ${s.issue}` };
	const known = TEST_RESULT[s.id];
	if (known && known.state !== "skipped") return known;
	if (s.reaches) return { state: "skipped", note: `Skipped in test: ${s.reaches.charAt(0).toLowerCase()}${s.reaches.slice(1)}` };
	if (s.typeId === "wait") return { state: "done", note: "Wait skipped in test" };
	return { state: "done", note: known?.note ?? "Done" };
}

function useTestRun(flow: Flow) {
	const [run, setRun] = useState<RunState>(IDLE);
	const timer = useRef<number | undefined>(undefined);
	const stop = () => {
		window.clearTimeout(timer.current);
		setRun((r) => ({ ...r, phase: "stopped", states: Object.fromEntries(Object.entries(r.states).map(([k, v]) => [k, v.state === "running" ? { state: "skipped", note: "Stopped" } : v])) }));
	};
	const start = () => {
		window.clearTimeout(timer.current);
		const path = samplePath(flow);
		const off = flow.steps.filter((s) => !path.includes(s.id)).map((s) => [s.id, { state: "skipped" as const, note: "Not on this path" }]);
		const tick = (i: number, states: RunState["states"]) => {
			if (i >= path.length) { setRun({ phase: "done", path, states }); return; }
			const s = flow.steps.find((x) => x.id === path[i])!;
			const running = { ...states, [s.id]: { state: "running" as const } };
			setRun({ phase: "running", path, states: running });
			timer.current = window.setTimeout(() => {
				const r = resultFor(s);
				const next = { ...running, [s.id]: r };
				if (r.state === "failed") {
					for (const id of path.slice(i + 1)) next[id] = { state: "skipped", note: "Not reached" };
					setRun({ phase: "failed", path, states: next });
					return;
				}
				tick(i + 1, next);
			}, 750);
		};
		tick(0, Object.fromEntries(off));
	};
	const clear = () => { window.clearTimeout(timer.current); setRun(IDLE); };
	useEffect(() => () => window.clearTimeout(timer.current), []);
	return { run, start, stop, clear };
}

function RunPanelBody({ flow, run, onRerun }: { flow: Flow; run: RunState; onRerun: () => void }) {
	const steps: RunStep[] = run.path.map((id) => {
		const s = flow.steps.find((x) => x.id === id);
		const st = run.states[id];
		return { title: s?.title ?? id, detail: st?.note, state: !st ? "waiting" : st.state === "running" ? "running" : st.state === "done" ? "done" : st.state === "failed" ? "failed" : "skipped" };
	});
	const done = steps.filter((s) => s.state === "done").length;
	const skipped = run.path.filter((id) => run.states[id]?.state === "skipped" && run.states[id]?.note?.startsWith("Skipped in test")).length;
	const failedStep = run.path.map((id) => flow.steps.find((s) => s.id === id)).find((s) => s && run.states[s.id]?.state === "failed");
	const meta = run.phase === "stopped" ? `${done} of ${steps.length} steps · stopped` : run.phase === "failed" ? `${done} of ${steps.length} steps · stopped at ${failedStep?.title}` : `${done} of ${steps.length} steps${skipped ? ` · ${skipped} skipped in test` : ""}`;
	const status = run.phase === "running" ? "Running" : run.phase === "failed" ? "Failed" : run.phase === "stopped" ? "Stopped" : "Done";
	return (
		<div className="grid gap-group">
			<dl className="grid grid-cols-[auto_1fr] gap-x-group gap-y-tight text-base">
				<dt className="text-ink-2">Sample</dt><dd className="text-ink">{SAMPLE.name}</dd>
				<dt className="text-ink-2">Listing</dt><dd className="text-ink">{SAMPLE.listing}</dd>
				<dt className="text-ink-2">Sends</dt><dd className="text-ink">Nothing. Steps that reach candidates or Slack are skipped.</dd>
			</dl>
			<AgentRun task="Test run with a sample application" status={status} steps={steps} meta={meta} />
			{failedStep && run.phase === "failed" && (
				<Alert variant="destructive">
					<AlertTitle>{failedStep.title} can't run yet</AlertTitle>
					<AlertDescription>{failedStep.issue ? `Open the step and ${failedStep.issue}, then run the test again.` : "Open the step to see why."}</AlertDescription>
				</Alert>
			)}
			{run.phase !== "running" && (
				<section aria-labelledby="run-output" className="grid gap-inline">
					<h3 id="run-output" className="text-base font-semibold text-ink">What each step did</h3>
					<ul className="grid rounded-sm border border-line">
						{run.path.filter((id) => TEST_RESULT[id]?.output || run.states[id]).map((id) => {
							const s = flow.steps.find((x) => x.id === id);
							const out = TEST_RESULT[id]?.output;
							return (
								<li key={id} className="border-b border-line last:border-b-0">
									<Collapsible>
										<CollapsibleTrigger className="group flex min-h-row w-full items-center gap-inline px-region text-left hover:bg-hover">
											<ChevronRight className="size-3.5 text-ink-3 transition-transform duration-(--duration-fast) group-data-[state=open]:rotate-90" aria-hidden="true" />
											<span className="flex-1 text-base text-ink">{s?.title}</span>
											<span className="text-sm text-ink-3">{run.states[id]?.note}</span>
										</CollapsibleTrigger>
										<CollapsibleContent className="bg-surface-2 px-region py-inline">
											{out ? (
												<dl className="grid grid-cols-[auto_1fr] gap-x-group gap-y-tight text-sm">{out.map(([k, v]) => <Fragment key={k}><dt className="text-ink-2">{k}</dt><dd className="text-ink">{v}</dd></Fragment>)}</dl>
											) : (
												<p className="text-sm text-ink-2">No output.</p>
											)}
										</CollapsibleContent>
									</Collapsible>
								</li>
							);
						})}
					</ul>
					<div><Button variant="outline" size="sm" onClick={onRerun}><FlaskConical />Run test again</Button></div>
				</section>
			)}
		</div>
	);
}

/* ---------------------------------------------------------------- assistant */

type Msg = { id: number; role: "user"; text: string } | { id: number; role: "assistant"; kind: "reminder" | "starter" | "decline" | "ack" | "help"; state: "open" | "approved" | "rejected"; decided?: string };

/* ---------------------------------------------------------------- editor */

type Panel = { kind: "step"; id: string } | { kind: "assistant" } | { kind: "run" } | null;

function useEditor({ wf, onBack, onSave }: { wf: Workflow; onBack: (flow: Flow) => void; onSave: (flow: Flow, published: Flow | null) => void }) {
	const [draft, setDraft] = useState<Flow>(wf.flow);
	const [published, setPublished] = useState<Flow | null>(wf.published ? wf.flow : null);
	const [savedAt, setSavedAt] = useState(wf.savedAt);
	// Undo history: the committed versions before and after this one. Typing in step settings isn't a separate step.
	const history = useRef<Flow[]>([]);
	const future = useRef<Flow[]>([]);
	const committed = useRef(draft);
	const [panel, setPanel] = useState<Panel>(wf.flow.steps.length ? null : { kind: "assistant" });
	// The step list sits beside the canvas on wide screens; below 768px it replaces the canvas while it's open.
	const [listOpen, setListOpen] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 1280px)").matches);
	const direction: FlowDirection = draft.direction ?? "vertical";
	const [locked, setLocked] = useState(false);
	const [picker, setPicker] = useState<{ from?: string; branch?: FlowBranch; between?: FlowLink } | null>(null);
	const [problems, setProblems] = useState<Step[] | null>(null);
	const [thread, setThread] = useState<Msg[]>([]);
	const [thinking, setThinking] = useState(false);
	const { run, start, stop, clear } = useTestRun(draft);

	const dirty = !published || sig(draft) !== sig(published);
	const selectedId = panel?.kind === "step" ? panel.id : null;
	const selected = draft.steps.find((s) => s.id === selectedId);

	const commit = (next: Flow, change?: FlowChange, undoable = true) => {
		if (change) {
			history.current = [...history.current.slice(-49), committed.current];
			future.current = [];
			committed.current = next;
			if (run.phase !== "idle") clear();
			setProblems(null);
		}
		setDraft(next);
		setSavedAt(new Date());
		if (change && undoable && change.type !== "move") toast(change.text, { action: { label: "Undo", onClick: undo } });
	};
	const restore = (to: Flow) => {
		committed.current = to;
		setDraft(to);
		setSavedAt(new Date());
		setProblems(null);
		if (run.phase !== "idle") clear();
	};
	const undo = () => {
		const prev = history.current.at(-1);
		if (!prev) return;
		history.current = history.current.slice(0, -1);
		future.current = [committed.current, ...future.current];
		restore(prev);
	};
	const redo = () => {
		const [next, ...rest] = future.current;
		if (!next) return;
		future.current = rest;
		history.current = [...history.current, committed.current];
		restore(next);
	};
	const updateStep = (id: string, patch: Partial<Step>) => {
		const next = { ...draft, steps: draft.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)) };
		committed.current = next;
		setDraft(next);
		setSavedAt(new Date());
	};

	// ⌘Z and ⌘⇧Z, outside text fields.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
			if ((e.target as HTMLElement).closest("input, textarea, [contenteditable=true]")) return;
			e.preventDefault();
			if (e.shiftKey) redo();
			else undo();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	});

	const shown = useMemo<FlowValue>(() => ({ links: draft.links, steps: draft.steps.map((s) => (run.states[s.id] ? { ...s, run: run.states[s.id] } : s)) }), [draft, run.states]);
	const onFlowChange = (next: FlowValue, change?: FlowChange) => commit({ ...strip(next), direction: draft.direction }, change);
	const arrange = (d: FlowDirection, text: string) => {
		commit({ ...layoutFlow(draft, d), direction: d }, { type: "move", text });
		toast(text, { action: { label: "Undo", onClick: undo } });
	};

	const addStep = (typeId: StepTypeId) => {
		const t = TYPE[typeId];
		if (picker?.between) {
			// Insert into a connection: from → new step → to, keeping the branch, then tidy so nothing overlaps.
			const l = picker.between;
			const id = `${typeId}-${Date.now().toString(36)}`;
			const s = makeStep(id, typeId, 0, 0);
			const links = [...draft.links.filter((x) => x.id !== l.id), { id: `${l.from}-${l.branch ?? "out"}-${id}`, from: l.from, to: id, branch: l.branch }, ...(t.kind === "end" ? [] : [{ id: `${id}-${t.kind === "condition" ? "yes" : "out"}-${l.to}`, from: id, to: l.to, branch: t.kind === "condition" ? ("yes" as const) : undefined }])];
			const name = (sid: string) => draft.steps.find((x) => x.id === sid)?.title;
			commit({ ...layoutFlow({ steps: [...draft.steps, s], links }, direction), direction }, { type: "connect", text: `${t.title} inserted between ${name(l.from)} and ${name(l.to)}` });
			setPicker(null);
			setPanel({ kind: "step", id });
			return;
		}
		const order = flowOrder(draft);
		const from = picker?.from ?? selectedId ?? order.filter((s) => s.kind !== "end").at(-1)?.id;
		const source = draft.steps.find((s) => s.id === from);
		const id = `${typeId}-${Date.now().toString(36)}`;
		const s = makeStep(id, typeId, 0, 0);
		s.position = placeAfter(draft, source?.id, picker?.branch, direction);
		const link = source && source.kind !== "end" && t.kind !== "trigger" ? [{ id: `${source.id}-${picker?.branch ?? "out"}-${id}`, from: source.id, to: id, branch: source.kind === "condition" ? picker?.branch ?? "yes" : undefined }] : [];
		commit({ direction: draft.direction, steps: [...draft.steps, s], links: [...draft.links, ...link] }, { type: "connect", text: source && link.length ? `${t.title} added after ${source.title}` : `${t.title} added` });
		setPicker(null);
		setPanel({ kind: "step", id });
	};

	const publish = () => {
		const incoming = new Set(draft.links.map((l) => l.to));
		const list = draft.steps.filter((s) => s.issue || (s.kind !== "trigger" && !incoming.has(s.id)));
		if (!draft.steps.some((s) => s.kind === "trigger")) { setProblems([]); return; }
		if (list.length) { setProblems(list); return; }
		const before = published;
		setPublished(draft);
		setProblems(null);
		onSave(draft, draft);
		toast(`${wf.name} published. New applications use this version.`, { action: { label: "Undo", onClick: () => { setPublished(before); onSave(draft, before); } } });
	};

	const send = (text: string) => {
		const id = Date.now();
		setThread((t) => [...t, { id, role: "user", text }]);
		setThinking(true);
		window.setTimeout(() => {
			setThinking(false);
			const kind = /reject/i.test(text) ? "decline" : draft.steps.length === 0 ? "starter" : draft.steps.some((s) => s.id === "o1") && !draft.steps.some((s) => s.id === "w1") ? "reminder" : "help";
			setThread((t) => [...t, { id: id + 1, role: "assistant", kind, state: "open" }]);
		}, 1100);
	};
	const decide = (msg: Msg, approved: boolean, reason?: string) => {
		const decided = `${approved ? "Approved" : "Rejected"} by you · ${time()}${reason ? ` · “${reason}”` : ""}`;
		setThread((t) => [...t.map((m) => (m.id === msg.id ? { ...m, state: approved ? "approved" : "rejected", decided } as Msg : m)), ...(approved ? [] : [{ id: Date.now(), role: "assistant", kind: "ack", state: "approved" } as Msg])]);
		if (!approved || msg.role !== "assistant") return;
		if (msg.kind === "reminder") commit({ ...layoutFlow(withReminder(draft), direction), direction }, { type: "connect", text: "3 steps added from the assistant" });
		if (msg.kind === "starter") commit({ ...layoutFlow(STARTER, direction), direction }, { type: "connect", text: `${STARTER.steps.length} steps added from the assistant` });
	};

	const statusWord: WorkflowStatus = published ? (wf.status === "Draft" ? "Live" : wf.status) : "Draft";

	const panelNode =
		panel?.kind === "assistant" ? (
			<AssistantPanel
				open
				onOpenChange={(o) => !o && setPanel(null)}
				caveat="Reads this workflow and its runs from the last 30 days, not candidate emails. Check every step that reaches candidates before publishing."
				composer={<MessageComposer noun={{ one: "step", many: "steps" }} placeholder={draft.steps.length ? "Describe a change to this workflow" : "Describe what should happen, and when"} chips={[{ id: "wf", label: wf.name }]} mentions={draft.steps.map((s) => ({ id: s.id, label: s.title }))} busy={thinking} onStop={() => setThinking(false)} onSend={(t) => send(t)} />}
			>
				{thread.length === 0 && (
					<div className="grid gap-inline">
						<p className="text-base text-ink-2">{draft.steps.length ? "Describe a change and I'll propose it for you to review. Nothing changes until you approve." : "Describe what should happen when someone applies, and I'll draft the steps for you to review."}</p>
						<div className="flex flex-wrap gap-tight">
							{(draft.steps.length ? SUGGESTIONS : ["Screen new applications and offer interviews to strong matches"]).map((s) => <Button key={s} variant="outline" size="sm" onClick={() => send(s)}>{s}</Button>)}
						</div>
					</div>
				)}
				{thread.map((m) =>
					m.role === "user" ? (
						<UserMessage key={m.id}>{m.text}</UserMessage>
					) : m.kind === "decline" ? (
						<AssistantMessage key={m.id} from={wf.name}>
							<p>I can't set up automatic rejections: decisions about candidates stay with a recruiter. Candidates who miss a must-have already go to Recruiter review, where the recruiter can send a rejection from a template.</p>
						</AssistantMessage>
					) : m.kind === "ack" ? (
						<AssistantMessage key={m.id} from={wf.name}><p>Understood. I haven't changed the workflow.</p></AssistantMessage>
					) : m.kind === "help" ? (
						<AssistantMessage key={m.id} from={wf.name}><p>I can add, connect or set up steps in this workflow. Say what should happen and when, such as “email the hiring manager when someone is moved to Offer”.</p></AssistantMessage>
					) : (
						<AssistantMessage key={m.id} from={m.kind === "reminder" ? `${wf.name} and 20 past applications` : "your description"}>
							<p>{m.kind === "reminder" ? "I'd wait 3 days after offering times, then remind anyone who hasn't chosen one. Move to Interview then runs once a time is chosen." : "Here's a first version. Strong matches get interview times; everyone else goes to a recruiter, so nobody is rejected automatically."}</p>
							<ChangeRequest
								title={m.kind === "reminder" ? "Remind candidates after 3 days" : "Screen new applications"}
								reason={m.kind === "reminder" ? "14 of the last 120 candidates never chose a time, and 9 of them were strong matches." : "Built from your description. Each step needs your check before publishing."}
								from={m.kind === "reminder" ? "20 past applications" : "your description"}
								files={[{ path: wf.name, lines: m.kind === "reminder" ? REMINDER_DIFF : STARTER_DIFF }]}
								simulation={m.kind === "reminder" ? { suite: "20 past applications, replayed", cases: REMINDER_SIM } : undefined}
								state={m.state}
								decidedBy={m.decided}
								onApprove={() => decide(m, true)}
								onReject={(why) => decide(m, false, why)}
							/>
							{m.kind === "reminder" && m.state === "open" && <ConfidenceNote cause="the times offered may have gone by day 4">Check the Send reminder step, or offer new times instead of a reminder.</ConfidenceNote>}
						</AssistantMessage>
					),
				)}
				{thinking && <ShimmerText className="text-sm">Reading the workflow</ShimmerText>}
			</AssistantPanel>
		) : panel?.kind === "run" ? (
			<SidePanel open onOpenChange={(o) => !o && setPanel(null)} label="Test run" title="Test run" meta={<span className="text-sm text-ink-2">Sample data · nothing is sent</span>} footer={run.phase === "running" ? <Button variant="outline" size="sm" onClick={stop}>Stop test</Button> : undefined}>
				<RunPanelBody flow={draft} run={run} onRerun={start} />
			</SidePanel>
		) : selected ? (
			<SidePanel
				open
				onOpenChange={(o) => !o && setPanel(null)}
				label="Step settings"
				title={selected.title || "Untitled step"}
				meta={<span className="text-sm text-ink-2">{selected.type} · {FLOW_KIND_WORD[selected.kind]}</span>}
			>
				<StepSettings step={selected} onChange={(p) => updateStep(selected.id, p)} />
			</SidePanel>
		) : null;

	return {
		topBar: (
			<>
				<Button variant="ghost" size="icon-sm" aria-label="Back to Workflows" onClick={() => onBack(draft)}><ArrowLeft /></Button>
				<Breadcrumb className="min-w-0">
					<BreadcrumbList>
						<BreadcrumbItem className="max-md:hidden"><BreadcrumbLink href="#workflows" onClick={(e) => { e.preventDefault(); onBack(draft); }}>Workflows</BreadcrumbLink></BreadcrumbItem>
						<BreadcrumbSeparator className="max-md:hidden" />
						<BreadcrumbItem><BreadcrumbPage className="truncate">{wf.name}</BreadcrumbPage></BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<Badge variant={STATUS_TONE[statusWord]}>{statusWord}</Badge>
				<span className="truncate text-sm text-ink-2 max-xl:hidden">{dirty ? <>Unpublished changes, saved <Timestamp key={savedAt.getTime()} value={savedAt} format="time" /></> : "No changes since publishing"}</span>
				<span className="flex-1" />
				<Button variant="ghost" size="sm" shortcut="⌘J" aria-pressed={panel?.kind === "assistant"} onClick={() => setPanel((p) => (p?.kind === "assistant" ? null : { kind: "assistant" }))}><MessageSquare />Ask</Button>
				<Button variant="outline" size="sm" shortcut="T" onClick={() => { setPanel({ kind: "run" }); start(); }}><FlaskConical />Test run</Button>
				<Button size="sm" shortcut="⌘↵" onClick={publish}><Send />Publish</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="More workflow actions"><Ellipsis /></Button></DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem disabled={!history.current.length} onSelect={undo}>Undo</DropdownMenuItem>
						<DropdownMenuItem disabled={!future.current.length} onSelect={redo}>Redo</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem disabled={!published || !dirty} onSelect={() => published && commit(published, { type: "delete", text: "Draft changes discarded" })}>Discard draft changes</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</>
		),
		panel: panelNode,
		body: (
			<div className="flex h-full min-h-0 flex-col">
				<div className="flex shrink-0 flex-wrap items-center gap-inline border-b border-line px-page py-control">
					<h1 className="sr-only">{wf.name}</h1>
					<Button variant="ghost" size="sm" shortcut="L" aria-pressed={listOpen} aria-controls="wf-steps" onClick={() => setListOpen((o) => !o)}><ListTree />Steps</Button>
					{/* Locked: changes that add or rearrange steps say why they're unavailable (aria-disabled keeps them focusable). */}
					<Unavailable when={locked} reason="Unlock the canvas to add steps.">
						<Button variant="ghost" size="sm" shortcut="A" aria-disabled={locked || undefined} onClick={() => !locked && setPicker({})}><Plus />Add step</Button>
					</Unavailable>
					<span className="text-sm text-ink-2 max-lg:hidden">{draft.steps.length} steps · {draft.steps.filter((s) => s.issue).length ? `${draft.steps.filter((s) => s.issue).length} need set-up` : "all set up"}</span>
					<span className="flex-1" />
					<Unavailable when={locked} reason="Unlock the canvas to change the layout.">
						<span className="inline-flex">
							<SegmentedControl value={direction} onValueChange={(v) => !locked && arrange(v as FlowDirection, v === "vertical" ? "Steps laid out top to bottom" : "Steps laid out left to right")} aria-label="Layout" size="sm">
								<Segment value="vertical" aria-disabled={locked || undefined}>Vertical</Segment>
								<Segment value="horizontal" aria-disabled={locked || undefined}>Horizontal</Segment>
							</SegmentedControl>
						</span>
					</Unavailable>
					<Unavailable when={locked} reason="Unlock the canvas to tidy the steps.">
						<Button variant="ghost" size="sm" aria-disabled={locked || undefined} onClick={() => !locked && arrange(direction, "Steps tidied")}><LayoutGrid />Tidy up</Button>
					</Unavailable>
				</div>
				{problems && (
					<div className="shrink-0 border-b border-line px-page py-inline">
						<Alert variant="warning">
							<AlertTitle>{problems.length ? `${problems.length} ${problems.length === 1 ? "step needs" : "steps need"} attention before publishing` : "Add a trigger before publishing"}</AlertTitle>
							<AlertDescription>
								{problems.length ? (
									<ul className="grid gap-hair">
										{problems.map((s) => (
											<li key={s.id}>
												<a href={`#${s.id}`} className="rounded-xs font-medium text-primary-ink hover:underline" onClick={(e) => { e.preventDefault(); setPanel({ kind: "step", id: s.id }); }}>{s.title}</a>
												<span className="text-ink-2">: {s.issue ? `needs set-up, ${s.issue}` : "not connected to the flow"}</span>
											</li>
										))}
									</ul>
								) : (
									"A trigger says what starts the workflow, such as a new application."
								)}
							</AlertDescription>
						</Alert>
					</div>
				)}
				<div className="flex min-h-0 flex-1">
					{listOpen && (
						<aside id="wf-steps" aria-label="Steps" className="w-72 shrink-0 overflow-y-auto border-r border-line bg-surface p-inline max-md:w-full max-md:border-r-0">
							<FlowStepList aria-label={`${wf.name} steps`} value={shown} onValueChange={onFlowChange} selectedId={selectedId} onSelect={(id) => setPanel(id ? { kind: "step", id } : null)} onAddAfter={(from, branch) => setPicker({ from, branch })} onAddTrigger={() => setPicker({})} locked={locked} />
						</aside>
					)}
					<div className={cn("min-w-0 flex-1", listOpen && "max-md:hidden")}>
						<FlowCanvas aria-label={`${wf.name} steps`} value={shown} direction={direction} onValueChange={onFlowChange} selectedId={selectedId} onSelect={(id) => setPanel(id ? { kind: "step", id } : (p) => (p?.kind === "step" ? null : p) as Panel)} onAddAfter={(from, branch) => setPicker({ from, branch })} onInsert={(link) => setPicker({ between: link })} onAddTrigger={() => setPicker({})} locked={locked} onLockedChange={setLocked} />
					</div>
				</div>
				<CommandDialog open={!!picker} onOpenChange={(o) => !o && setPicker(null)} title="Add step" description="Choose a step to add">
					<CommandInput placeholder={picker?.between ? `Insert a step between ${draft.steps.find((s) => s.id === picker.between!.from)?.title} and ${draft.steps.find((s) => s.id === picker.between!.to)?.title}` : picker?.from ? `Add a step after ${draft.steps.find((s) => s.id === picker.from)?.title}` : "Search steps"} />
					<CommandList>
						<CommandEmpty>No steps match. Try email, wait or condition.</CommandEmpty>
						{(["Triggers", "Actions", "Logic"] as const).map((g) => (
							<CommandGroup key={g} heading={g}>
								{STEP_TYPES.filter((t) => t.group === g && (g !== "Triggers" || (!picker?.from && !picker?.between))).map((t) => (
									<CommandItem key={t.id} value={`${t.label} ${t.hint}`} onSelect={() => addStep(t.id)}>
										<span aria-hidden="true" className="grid size-6 place-items-center rounded-xs border border-line bg-surface-2 text-ink-2 [&>svg]:size-3.5">{t.icon}</span>
										<span className="grid"><span className="text-base text-ink">{t.label}</span><span className="text-sm text-ink-2">{t.hint}</span></span>
									</CommandItem>
								))}
							</CommandGroup>
						))}
					</CommandList>
				</CommandDialog>
			</div>
		),
	};
}

/* ---------------------------------------------------------------- create */

function CreateDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (o: boolean) => void; onCreate: (name: string, start: "assistant" | "blank") => void }) {
	const [name, setName] = useState("");
	const [start, setStart] = useState<"assistant" | "blank">("assistant");
	const [error, setError] = useState("");
	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) { setError("Enter a name, such as Screen new applications."); return; }
		onCreate(name.trim(), start);
		setName("");
		setError("");
	};
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<form onSubmit={submit} noValidate className="grid gap-group">
					<DialogHeader>
						<DialogTitle>Create workflow</DialogTitle>
						<DialogDescription>It starts as a draft. Nothing runs until you publish it.</DialogDescription>
					</DialogHeader>
					<Field data-invalid={!!error || undefined}>
						<FieldLabel htmlFor="wf-name">Name</FieldLabel>
						<Input id="wf-name" value={name} aria-invalid={!!error || undefined} onChange={(e) => { setName(e.target.value); setError(""); }} autoFocus />
						{error && <FieldError>{error}</FieldError>}
					</Field>
					<fieldset className="grid gap-inline">
						<legend className="mb-inline text-base font-medium text-ink">Start from</legend>
						<RadioGroup value={start} onValueChange={(v) => setStart(v as "assistant" | "blank")}>
							<div className="flex items-start gap-inline"><RadioGroupItem id="wf-a" value="assistant" className="mt-hair" /><Label htmlFor="wf-a" className="grid gap-hair"><span>Describe it to the assistant</span><span className="text-sm font-normal text-ink-2">It drafts the steps for you to review</span></Label></div>
							<div className="flex items-start gap-inline"><RadioGroupItem id="wf-b" value="blank" className="mt-hair" /><Label htmlFor="wf-b" className="grid gap-hair"><span>Blank canvas</span><span className="text-sm font-normal text-ink-2">Add a trigger, then each step</span></Label></div>
						</RadioGroup>
					</fieldset>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
						<Button type="submit">Create workflow</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

/* ---------------------------------------------------------------- screen */

function EditorScreen(props: { wf: Workflow; onBack: (flow: Flow) => void; onSave: (flow: Flow, published: Flow | null) => void; sidebar: React.ReactNode }) {
	const ed = useEditor(props);
	return (
		<ExampleShell className="h-example-frame" frame="flush" sidebar={props.sidebar} topBar={ed.topBar} panel={ed.panel}>
			{ed.body}
		</ExampleShell>
	);
}

export function WorkflowsExample() {
	const [rows, setRows] = useState<Workflow[]>(WORKFLOWS);
	const [openId, setOpenId] = useState<string | null>("WF-201");
	const [creating, setCreating] = useState(false);
	const [singleKeys, setSingleKeys] = useState(true);
	const open = rows.find((r) => r.id === openId);

	const set = (id: string, patch: Partial<Workflow>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
	const toggle = (w: Workflow) => {
		const next: WorkflowStatus = w.status === "Off" ? "Live" : "Off";
		set(w.id, { status: next });
		toast(`${w.name} turned ${next === "Off" ? "off" : "on"}`, { action: { label: "Undo", onClick: () => set(w.id, { status: w.status }) } });
	};
	const duplicate = (w: Workflow) => {
		const copy: Workflow = { ...w, id: `WF-${206 + rows.length}`, name: `${w.name} (copy)`, status: "Draft", published: false, lastRun: undefined, runs7d: 0, savedAt: new Date() };
		setRows((rs) => [copy, ...rs]);
		toast(`${copy.name} created as a draft`, { action: { label: "Undo", onClick: () => setRows((rs) => rs.filter((r) => r.id !== copy.id)) } });
	};
	const remove = (w: Workflow) => {
		const before = rows;
		setRows((rs) => rs.filter((r) => r.id !== w.id));
		toast(`${w.name} moved to Deleted. It no longer runs.`, { action: { label: "Undo", onClick: () => setRows(before) } });
	};
	const create = (name: string, start: "assistant" | "blank") => {
		const wf: Workflow = { id: `WF-${206 + rows.length}`, name, description: "New workflow", status: "Draft", trigger: "Not set", runs7d: 0, owner: "Priya Shah", flow: { steps: [], links: [] }, published: false, savedAt: new Date() };
		setRows((rs) => [wf, ...rs]);
		setCreating(false);
		setOpenId(wf.id);
		if (start === "blank") toast(`${name} created as a draft`);
	};

	const sidebar = (
		<>
			<ExampleBrand label="Hiring" />
			<SidebarSection>
				<SidebarItem label="Inbox" icon={<Inbox />} count={4} />
				<SidebarItem label="Listings" icon={<Briefcase />} />
				<SidebarItem label="Candidates" icon={<Users />} />
				<SidebarItem label="Interviews" icon={<CalendarDays />} />
			</SidebarSection>
			<SidebarSection title="Automation">
				<SidebarItem label="Workflows" icon={<WorkflowIcon />} current onClick={() => setOpenId(null)} />
				<SidebarItem label="Connections" icon={<Plug />} />
			</SidebarSection>
		</>
	);

	return (
		<ShortcutsProvider enabled={singleKeys}>
			<div className="h-full min-h-0">
				{open ? (
					<EditorScreen
						key={open.id}
						wf={open}
						sidebar={sidebar}
						onBack={(flow) => { set(open.id, { flow, savedAt: new Date() }); setOpenId(null); }}
						onSave={(flow, published) => set(open.id, { flow, published: !!published, status: published ? (open.status === "Draft" ? "Live" : open.status) : "Draft", trigger: flow.steps.find((s) => s.kind === "trigger")?.type ?? "Not set" })}
					/>
				) : (
					<ExampleShell
						className="h-example-frame"
						sidebar={sidebar}
						topBar={
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem><BreadcrumbLink href="#automation">Automation</BreadcrumbLink></BreadcrumbItem>
									<BreadcrumbSeparator />
									<BreadcrumbItem><BreadcrumbPage>Workflows</BreadcrumbPage></BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						}
					>
						<WorkflowList rows={rows} onOpen={setOpenId} onToggle={toggle} onDuplicate={duplicate} onDelete={remove} onCreate={() => setCreating(true)} />
					</ExampleShell>
				)}
				<CreateDialog open={creating} onOpenChange={setCreating} onCreate={create} />
				<ShortcutSheet
					singleKeys={singleKeys}
					onSingleKeysChange={setSingleKeys}
					groups={[
						{ title: "Workflows", items: [{ keys: ["C"], action: "Create workflow" }, { keys: ["?"], action: "Show keyboard shortcuts" }] },
						{ title: "Editor", items: [{ keys: ["A"], action: "Add step" }, { keys: ["L"], action: "Show or hide the step list" }, { keys: ["T"], action: "Test run with a sample application" }, { keys: ["⌘", "↵"], action: "Publish" }, { keys: ["⌘", "J"], action: "Ask the assistant" }, { keys: ["⌘", "Z"], action: "Undo" }, { keys: ["⌘", "⇧", "Z"], action: "Redo" }] },
						{
							title: "Canvas",
							items: [
								{ keys: ["←", "→", "↑", "↓"], action: "Go to the next step in that direction" },
								{ keys: ["Home", "End"], action: "First or last step" },
								{ keys: ["Enter"], action: "Open the step's settings, or select a connection" },
								{ keys: ["Space"], action: "Pick up the step; arrows move it, Enter drops, Esc cancels" },
								{ keys: ["⇧", "F10"], action: "Step actions: add after, connect, disconnect, delete" },
								{ keys: ["Delete"], action: "Delete the step or selected connection, with Undo" },
								{ keys: ["⌘", "="], action: "Zoom in" },
								{ keys: ["⌘", "−"], action: "Zoom out" },
								{ keys: ["⇧", "1"], action: "Fit the whole flow" },
							],
						},
					]}
				/>
			</div>
		</ShortcutsProvider>
	);
}
