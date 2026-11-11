import {
	AgentRun,
	AiOrigin,
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AnswerActions,
	ArtifactCard,
	AssistantMessage,
	Badge,
	Button,
	ClarifyingQuestion,
	CodeBlock,
	CodeBlockActions,
	CodeBlockContent,
	CodeBlockCopyButton,
	CodeBlockHeader,
	CodeBlockTitle,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Count,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	Input,
	MessageComposer,
	PersonAvatar,
	ShimmerText,
	ShortcutSheet,
	SidePanel,
	SidebarItem,
	SidebarSection,
	StreamingText,
	ChangeRequest,
	ConfidenceNote,
	PlanCard,
	PlanChange,
	WhyChoice,
	Swap,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Tag,
	ThinkingSteps,
	UserMessage,
	toast,
	type RunStep,
} from "@twoux/ui";
import {
	BookOpen,
	Building2,
	Check,
	ChevronDown,
	ChevronRight,
	ChevronsUpDown,
	Copy,
	Ellipsis,
	FileText,
	Folder,
	FolderInput,
	GitPullRequest,
	History,
	ListChecks,
	MessageSquare,
	PanelLeftClose,
	PanelLeftOpen,
	PanelRight,
	Pencil,
	Pin,
	Play,
	RotateCcw,
	ScanSearch,
	Search,
	Square,
	Timer,
	Trash2,
	Wand2,
	X,
	Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ANSWER, CHECKS, FILES, FOLDERS, INSIGHTS, REPORT_LOG, REVIEWERS, SESSIONS, SEVERITY, SHORTCUTS, type Session, type SessionStatus, TESTS } from "./agents/data";
import { ExampleShell, RailSwap } from "../../components/example-shell";
import { ExampleBrand } from "../../components/example-brand";

type Phase = "working" | "ready" | "stopped" | "ended";
type Tab = "worklog" | "changes" | "pr" | "report";
type Meta = { title?: string; pinned?: boolean; folder?: string | null; read?: boolean };

const LIVE = "ses_8f3k2m";
const RUN_MS = 14500;
const STREAM_FROM = 9000;
const EDITED_AT = 7500;
const PR_AT = 12000;
const MERGE_MODES = ["Squash and merge", "Rebase and merge", "Create a merge commit"];
const SEV_DOT = { high: "bg-bad", medium: "bg-warn", event: "bg-primary", value: "bg-ok" } as const;

const wide = () => typeof window !== "undefined" && window.matchMedia("(min-width: 861px)").matches;

function StatusLine({ status, prs }: { status: SessionStatus | "stopped" | "ended"; prs?: number }) {
	if (status === "working") return <ShimmerText className="text-sm">Working</ShimmerText>;
	if (status === "needs-you") return <span className="text-sm text-warn">Needs you</span>;
	if (status === "ready") return <span className="text-sm text-ok">Ready for review{prs ? ` · ${prs} ${prs === 1 ? "PR" : "PRs"}` : ""}</span>;
	if (status === "failed") return <span className="text-sm text-bad">Failed</span>;
	return <span className="text-sm text-ink-3">{status === "ended" ? "Ended" : "Stopped"}</span>;
}

function Waiting({ children }: { children: string }) {
	return <p className="rounded-sm border border-dashed border-line px-3 py-6 text-center text-base text-ink-2">{children}</p>;
}

function Resolved({ children, tone = "ok" }: { children: React.ReactNode; tone?: "ok" | "neutral" }) {
	return (
		<p className="flex items-start gap-2 text-sm text-ink-2">
			{tone === "ok" ? <Check className="mt-0.5 size-3.5 shrink-0 text-ok" aria-hidden="true" /> : <X className="mt-0.5 size-3.5 shrink-0 text-ink-3" aria-hidden="true" />}
			<span>{children}</span>
		</p>
	);
}

/** An autonomous coding agent workspace: sessions on the left, the thread in the middle, the work product on the right. */
export function AgentsExample() {
	const [elapsed, setElapsed] = useState(0);
	const [planApproved, setPlanApproved] = useState(false);
	const [phase, setPhase] = useState<Phase>("working");
	const [current, setCurrent] = useState(LIVE);
	const [meta, setMeta] = useState<Record<string, Meta>>({});
	const [renaming, setRenaming] = useState(false);
	const [copied, setCopied] = useState(false);
	const [focus, setFocus] = useState(false);
	const [panelOpen, setPanelOpen] = useState(wide);
	const [expanded, setExpanded] = useState(false);
	const [tab, setTab] = useState<Tab>("worklog");
	const [fileIx, setFileIx] = useState(0);
	const [insights, setInsights] = useState(false);
	const [palette, setPalette] = useState(false);
	const [confirm, setConfirm] = useState<null | "stop" | "end" | "merge">(null);
	const [mergeMode, setMergeMode] = useState(MERGE_MODES[0]);
	const [merged, setMerged] = useState(false);
	const [changes, setChanges] = useState<"pending" | "applied" | "rejected">("pending");
	const [answer, setAnswer] = useState<string | null>(null);
	const [sent, setSent] = useState<{ id: number; text: string }[]>([]);
	const [folderOpen, setFolderOpen] = useState(true);
	const approvals = useRef<HTMLDivElement>(null);

	// The simulated run: one clock drives every step, the streamed text and the final state.
	useEffect(() => {
		if (phase !== "working" || !planApproved) return;
		const t = window.setInterval(() => setElapsed((e) => Math.min(e + 100, RUN_MS)), 100);
		return () => window.clearInterval(t);
	}, [phase, planApproved]);
	useEffect(() => {
		if (phase === "working" && elapsed >= RUN_MS) setPhase("ready");
	}, [elapsed, phase]);

	const doStop = () => {
		setPhase("stopped");
		setConfirm(null);
	};
	const requestStop = () => {
		if (elapsed >= EDITED_AT && elapsed < PR_AT) setConfirm("stop");
		else doStop();
	};
	const restart = () => {
		setElapsed(0);
		setPhase("working");
		setChanges("pending");
		setAnswer(null);
		setMerged(false);
		setSent([]);
		toast.success("Session restarted from the first step");
	};

	// Keyboard: Esc stops, ⌘⇧F toggles focus mode. Esc is caught first so the panel's own Esc does not also close it.
	const latest = useRef({ phase, requestStop });
	latest.current = { phase, requestStop };
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				if ((e.target as HTMLElement | null)?.closest("[role=dialog], [role=alertdialog], [role=menu], [role=listbox]")) return;
				if (latest.current.phase !== "working") return;
				e.preventDefault();
				latest.current.requestStop();
			}
			if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "f") {
				e.preventDefault();
				setFocus((f) => !f);
			}
		};
		document.addEventListener("keydown", onKey, true);
		return () => document.removeEventListener("keydown", onKey, true);
	}, []);

	const sessions = useMemo(
		() =>
			SESSIONS.map((s) => {
				const m = meta[s.id] ?? {};
				const live = s.id === LIVE;
				const status: SessionStatus | "stopped" | "ended" = live ? (phase === "ready" ? "ready" : phase === "working" && !planApproved ? "needs-you" : phase) : s.status;
				return { ...s, title: m.title ?? s.title, pinned: !!m.pinned, folder: m.folder === undefined ? s.folder : m.folder ?? undefined, unread: s.unread && !m.read, shownStatus: status, ago: live && phase === "working" ? "just now" : s.ago };
			}),
		[meta, phase, planApproved],
	);
	const session = sessions.find((s) => s.id === current) ?? sessions[0];
	const live = session.id === LIVE;
	const patch = (id: string, p: Meta) => setMeta((m) => ({ ...m, [id]: { ...m[id], ...p } }));
	const open = (id: string) => {
		setCurrent(id);
		patch(id, { read: true });
		setPalette(false);
	};

	const row = (s: (typeof sessions)[number]) => (
		<li key={s.id}>
			<button type="button" aria-current={s.id === current ? "true" : undefined} onClick={() => open(s.id)} className={`grid w-full grid-cols-[0.5rem_minmax(0,1fr)] gap-x-1.5 rounded-xs px-1.5 py-1.5 text-left transition-colors duration-(--duration-fast) hover:bg-hover ${s.id === current ? "bg-selected" : ""}`}>
				<span className="pt-1.5">{s.unread && <span role="img" aria-label="Unread" className="block size-1.5 rounded-full bg-primary" />}</span>
				<span className="grid min-w-0 gap-0.5">
					<span className="truncate text-base text-ink">{s.title}</span>
					<span className="flex items-center gap-1.5">
						<StatusLine status={s.shownStatus} prs={s.prs} />
						<span className="tabular ml-auto shrink-0 text-sm text-ink-3">{s.ago}</span>
					</span>
				</span>
			</button>
		</li>
	);
	const pinned = sessions.filter((s) => s.pinned);
	const inFolder = sessions.filter((s) => s.folder === FOLDERS[0] && !s.pinned);
	const recent = sessions.filter((s) => !s.pinned && s.folder !== FOLDERS[0]);

	const sidebar = (
		<>
			<ExampleBrand />
			<RailSwap icon={<Building2 />} label="Workspace: Harbourline Labs">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="lg" className="w-full justify-start">
						<span className="grid size-6 place-items-center rounded-xs bg-primary text-xs font-semibold text-primary-foreground" aria-hidden="true">H</span>
						<span className="min-w-0 flex-1 truncate text-left font-semibold">Harbourline Labs</span>
						<ChevronsUpDown className="text-ink-3" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-56">
					<DropdownMenuLabel>Workspaces</DropdownMenuLabel>
					<DropdownMenuRadioGroup value="hl" onValueChange={() => toast.message("Switching workspace is not wired in this example")}>
						<DropdownMenuRadioItem value="hl">Harbourline Labs</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="ps">Pennine Software</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			</RailSwap>
			<SidebarSection>
				<SidebarItem label="Sessions" icon={<ListChecks />} current />
				<SidebarItem label="Ask" icon={<MessageSquare />} />
				<SidebarItem label="Automations" icon={<Zap />} />
				<SidebarItem label="Review" icon={<GitPullRequest />} count={3} />
				<SidebarItem label="Knowledge" icon={<BookOpen />} />
			</SidebarSection>
			{/* Session lists need the full width; in the rail, Sessions above leads to them. */}
			<RailSwap>
			<section aria-label="Pinned" className="grid gap-0.5">
				<h2 className="px-2 pb-1 text-xs font-medium text-ink-3">Pinned</h2>
				{pinned.length ? <ul className="grid gap-0.5">{pinned.map(row)}</ul> : <p className="px-2 text-sm text-ink-3">Pin a session to keep it here.</p>}
			</section>
			<Collapsible open={folderOpen} onOpenChange={setFolderOpen} className="grid gap-0.5">
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="sm" className="w-full justify-start">
						<ChevronRight className={`text-ink-3 transition-transform duration-(--duration-fast) ${folderOpen ? "rotate-90" : ""}`} aria-hidden="true" />
						<Folder className="text-ink-3" aria-hidden="true" />
						<span className="min-w-0 flex-1 truncate text-left">{FOLDERS[0]}</span>
						<Count value={inFolder.length} className="text-sm text-ink-3" />
					</Button>
				</CollapsibleTrigger>
				<CollapsibleContent><ul className="grid gap-0.5">{inFolder.map(row)}</ul></CollapsibleContent>
			</Collapsible>
			<section aria-label="Recent sessions" className="grid gap-0.5">
				<h2 className="px-2 pb-1 text-xs font-medium text-ink-3">Recent sessions</h2>
				<ul className="grid gap-0.5">{recent.map(row)}</ul>
			</section>
			</RailSwap>
		</>
	);

	// What the agent has done, derived from the clock.
	const stage = elapsed < 3000 ? 0 : elapsed < 6000 ? 1 : 2;
	const thinkingDone = elapsed >= STREAM_FROM;
	const ready = phase === "ready";
	const words = ANSWER.split(" ");
	const shownWords = elapsed < STREAM_FROM ? 0 : Math.min(words.length, Math.floor((elapsed - STREAM_FROM) / 55) + 1);
	const streamed = words.slice(0, shownWords).join(" ");
	const liveSteps = [
		{ title: "Thinking", detail: "Reading the invoice module and the billing blueprint" },
		{ title: "Running the billing tests", detail: "pnpm test billing" },
		{ title: "Editing 3 files", detail: "round.ts, invoice.ts and totals.ts" },
	].slice(0, stage + 1);
	const doneSteps = [
		{ title: "Thought for 9s", detail: "Found the cause: each line rounds half up" },
		{ title: "Ran tests 7/7", detail: "All passed in 2.1 s" },
		{ title: "Edited 3 files", detail: "src/billing/round.ts, invoice.ts, totals.ts" },
	];

	const runSteps: RunStep[] = useMemo(() => {
		const defs: [number, string, string | undefined][] = [
			[0, "Read the invoice module and the blueprint", "12 files"],
			[2500, "Reproduced the one penny drift on INV-2041", undefined],
			[5000, "Ran the billing tests", "7 of 7 passed"],
			[7500, "Edited 3 files", "Not yet committed"],
			[10000, "Proposed changes to the blueprint", "Waiting for your approval"],
			[PR_AT, "Opened PR 482", "+393 −94"],
		];
		const out: RunStep[] = [];
		defs.forEach(([at, title, detail], i) => {
			if (elapsed < at) return;
			const next = defs[i + 1]?.[0] ?? RUN_MS;
			const finished = elapsed >= next;
			if (i === 4 && finished && changes === "pending") {
				out.push({ title, detail, state: "waiting", action: <Button variant="outline" size="xs" onClick={() => approvals.current?.scrollIntoView({ block: "center", behavior: "smooth" })}>Review</Button> });
			} else if (!finished && phase !== "ready") {
				out.push({ title, state: phase === "stopped" || phase === "ended" ? "skipped" : "running" });
			} else out.push({ title, detail: i === 4 && changes !== "pending" ? (changes === "applied" ? "Approved by you" : "Rejected by you") : detail, state: "done" });
		});
		if (phase === "stopped") out.push({ title: "Stopped by you", detail: "Steps after this point did not run", state: "skipped" });
		return out;
	}, [elapsed, phase, changes]);

	const panelBody = (
		<Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="gap-0">
			<TabsList aria-label="Session workspace">
				<TabsTrigger value="worklog">Worklog</TabsTrigger>
				<TabsTrigger value="changes" count={FILES.length}>Changes</TabsTrigger>
				<TabsTrigger value="pr">PR</TabsTrigger>
				<TabsTrigger value="report">Report</TabsTrigger>
			</TabsList>
			{!live ? (
				<div className="pt-3"><Waiting>The full workspace is built for the first session in this example.</Waiting></div>
			) : (
				<>
					<TabsContent value="worklog" className="pt-3">
						<AgentRun
							task="Fix part-penny rounding"
							status={phase === "working" ? (planApproved ? "Running" : "Needs you") : phase === "ready" ? (changes === "pending" ? "Needs you" : "Done") : "Needs you"}
							steps={runSteps}
							meta={`Started by Imogen Hart · ${(Math.min(elapsed, 14000) / 1000).toFixed(0)} s · harbourline/billing-api`}
							onStop={requestStop}
						/>
					</TabsContent>
					<TabsContent value="changes" className="grid gap-3 pt-3">
						{elapsed < EDITED_AT ? (
							<Waiting>The agent has not edited any files yet.</Waiting>
						) : (
							<>
								<p className="text-sm text-ink-2">
									<span className="tabular">{FILES.length}</span> files · <span className="tabular text-ok">+{FILES.reduce((a, f) => a + f.add, 0)}</span> <span className="tabular text-bad">−{FILES.reduce((a, f) => a + f.del, 0)}</span>
								</p>
								<ul aria-label="Changed files" className="grid gap-0.5">
									{[...new Set(FILES.map((f) => f.path.split("/").slice(0, -1).join("/")))].map((dir) => (
										<li key={dir} className="grid gap-0.5">
											<span className="flex items-center gap-1.5 px-1.5 py-0.5 text-sm text-ink-3"><Folder className="size-3.5" aria-hidden="true" />{dir}</span>
											<ul className="grid gap-0.5">
												{FILES.map((f, i) => ({ f, i })).filter(({ f }) => f.path.startsWith(`${dir}/`) && f.path.split("/").slice(0, -1).join("/") === dir).map(({ f, i }) => (
													<li key={f.path}>
														<button type="button" aria-current={i === fileIx ? "true" : undefined} onClick={() => setFileIx(i)} className={`flex h-7 w-full items-center gap-2 rounded-xs pr-2 pl-6 text-left text-base hover:bg-hover ${i === fileIx ? "bg-selected" : ""}`}>
															<FileText className="size-3.5 shrink-0 text-ink-3" aria-hidden="true" />
															<span className="min-w-0 flex-1 truncate font-mono text-sm text-ink">{f.path.split("/").pop()}</span>
															<span className="tabular text-sm text-ok">+{f.add}</span>
															<span className="tabular text-sm text-bad">−{f.del}</span>
														</button>
													</li>
												))}
											</ul>
										</li>
									))}
								</ul>
								{FILES[fileIx].diff ? (
									<CodeBlock>
										<CodeBlockHeader>
											<CodeBlockTitle icon={<FileText />}>{FILES[fileIx].path}</CodeBlockTitle>
											<CodeBlockActions><CodeBlockCopyButton value={FILES[fileIx].diff.code} /></CodeBlockActions>
										</CodeBlockHeader>
										<CodeBlockContent code={FILES[fileIx].diff.code} lineNumbers startLine={FILES[fileIx].diff.start} added={FILES[fileIx].diff.added} removed={FILES[fileIx].diff.removed} aria-label={`Changes in ${FILES[fileIx].path}`} />
									</CodeBlock>
								) : (
									<p className="text-sm text-ink-2">The diff for {FILES[fileIx].path.split("/").pop()} is collapsed in this example. Open the pull request to read it.</p>
								)}
							</>
						)}
					</TabsContent>
					<TabsContent value="pr" className="grid gap-4 pt-3">
						{elapsed < PR_AT ? (
							<Waiting>The pull request opens when the agent has finished editing.</Waiting>
						) : (
							<>
								<div className="grid gap-1">
									<div className="flex items-start gap-2"><h3 className="min-w-0 flex-1 text-base font-semibold text-ink">PR 482: Fix part-penny rounding in invoice totals</h3><Badge variant={merged ? "default" : "success"} dot>{merged ? "Merged" : "Open"}</Badge></div>
									<p className="text-sm text-ink-2"><span className="font-mono">fix/part-penny-rounding</span> into <span className="font-mono">main</span></p>
									<AiOrigin from="the diff and the test run" />
								</div>
								<section aria-label="Checks" className="grid gap-1">
									<h3 className="text-sm font-medium text-ink-3">Checks</h3>
									<ul className="grid divide-y divide-line rounded-sm border border-line">
										{CHECKS.map((c) => (
											<li key={c.name} className="flex items-start gap-2.5 px-3 py-2">
												{c.state === "pass" ? <Check className="mt-0.5 size-3.5 shrink-0 text-ok" aria-hidden="true" /> : <X className="mt-0.5 size-3.5 shrink-0 text-bad" aria-hidden="true" />}
												<span className="grid min-w-0 flex-1">
													<span className="text-base text-ink">{c.name}<span className="sr-only"> ({c.state === "pass" ? "passed" : "failed"})</span></span>
													<span className="text-sm text-ink-2">{c.detail}</span>
												</span>
												{c.optional && <Badge variant="secondary">Optional</Badge>}
											</li>
										))}
									</ul>
								</section>
								<section aria-label="Reviewers" className="grid gap-1">
									<h3 className="text-sm font-medium text-ink-3">Reviewers</h3>
									<ul className="grid gap-1.5">
										{REVIEWERS.map((r) => (
											<li key={r.name} className="flex items-center gap-2"><PersonAvatar name={r.name} size="sm" /><span className="flex-1 text-base text-ink">{r.name}</span><Badge variant={r.state === "Approved" ? "success" : "secondary"} dot>{r.state}</Badge></li>
										))}
									</ul>
								</section>
							</>
						)}
					</TabsContent>
					<TabsContent value="report" className="grid gap-4 pt-3">
						{elapsed < 5000 ? (
							<Waiting>The report appears when the test run finishes.</Waiting>
						) : (
							<>
								<div className="grid gap-1"><h3 className="text-base font-semibold text-ink">Billing suite test report</h3><AiOrigin from="the billing test run" /></div>
								<dl className="grid grid-cols-3 divide-x divide-line rounded-sm border border-line">
									{[["Passed", "7"], ["Failed", "0"], ["Duration", "2.1 s"]].map(([k, v]) => (
										<div key={k} className="grid gap-0.5 px-3 py-2"><dt className="text-sm text-ink-2">{k}</dt><dd className="tabular text-lg font-semibold text-ink">{v}</dd></div>
									))}
								</dl>
								<section aria-label="Results" className="grid gap-1">
									<h3 className="text-sm font-medium text-ink-3">Results</h3>
									<ul className="grid divide-y divide-line rounded-sm border border-line">
										{TESTS.map((t) => <li key={t} className="flex items-center gap-2 px-3 py-1.5"><span className="min-w-0 flex-1 text-base text-ink">{t}</span><Badge variant="success">PASSED</Badge></li>)}
									</ul>
								</section>
								<section aria-label="Evidence" className="grid gap-1">
									<h3 className="text-sm font-medium text-ink-3">Evidence</h3>
									<CodeBlock>
										<CodeBlockHeader><CodeBlockTitle icon={<FileText />}>billing-tests.log</CodeBlockTitle><CodeBlockActions><CodeBlockCopyButton value={REPORT_LOG} /></CodeBlockActions></CodeBlockHeader>
										<CodeBlockContent code={REPORT_LOG} aria-label="Test log" />
									</CodeBlock>
								</section>
							</>
						)}
					</TabsContent>
				</>
			)}
		</Tabs>
	);

	const mergeControl = (
		<div className="inline-flex gap-px">
			<Button size="sm" onClick={() => (merged ? undefined : setConfirm("merge"))}>{merged ? "Merged" : mergeMode}</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild><Button size="icon-sm" aria-label="Choose how to merge"><ChevronDown /></Button></DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuRadioGroup value={mergeMode} onValueChange={setMergeMode}>{MERGE_MODES.map((m) => <DropdownMenuRadioItem key={m} value={m}>{m}</DropdownMenuRadioItem>)}</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);

	const sidePanel = expanded ? null : (
		<SidePanel open={panelOpen} onOpenChange={setPanelOpen} label="Session workspace" title="Session workspace" meta={<span className="font-mono">harbourline/billing-api</span>} onOpenFull={() => setExpanded(true)} footer={tab === "pr" && live && elapsed >= PR_AT ? mergeControl : undefined}>
			{panelBody}
		</SidePanel>
	);

	const topBar = (
		<>
			{renaming ? (
				<Input autoFocus aria-label="Session title" defaultValue={session.title} className="max-w-sm" onBlur={(e) => { patch(session.id, { title: e.target.value.trim() || session.title }); setRenaming(false); }} onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") { e.stopPropagation(); setRenaming(false); } }} />
			) : (
				<h1 className="min-w-0 truncate text-md font-semibold text-ink">{session.title}</h1>
			)}
			<span className="flex items-center gap-1 max-2xl:hidden">{session.tags.map((t) => <Tag key={t}>{t}</Tag>)}</span>
			<span className="flex-1" />
			<Button variant="outline" size="sm" className="max-md:hidden" shortcut="⌘K" onClick={() => setPalette(true)}><Search />Search</Button>
			{session.prs ? <Button variant="outline" size="sm" onClick={() => { setTab("pr"); setPanelOpen(true); setExpanded(false); }}><GitPullRequest />PR<span className="tabular rounded-xs bg-surface-2 px-1 text-sm text-ink-2"><Count value={session.prs} /></span></Button> : null}
			<Button variant="ghost" size="icon-sm" aria-label={panelOpen && !expanded ? "Hide session workspace" : "Show session workspace"} aria-pressed={panelOpen && !expanded} onClick={() => { setExpanded(false); setPanelOpen((o) => !o); }}><PanelRight /></Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Session actions"><Ellipsis /></Button></DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-64">
					<DropdownMenuGroup>
						<DropdownMenuItem onSelect={() => { patch(session.id, { pinned: !session.pinned }); toast.success(session.pinned ? "Unpinned" : "Pinned to the top of the sidebar"); }}><Pin />{session.pinned ? "Unpin" : "Pin"}</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger><FolderInput />Move to folder</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								<DropdownMenuRadioGroup value={session.folder ?? "none"} onValueChange={(v) => { patch(session.id, { folder: v === "none" ? null : v }); toast.success(v === "none" ? "Removed from its folder" : `Moved to ${v}`); }}>
									<DropdownMenuRadioItem value="none">No folder</DropdownMenuRadioItem>
									{FOLDERS.map((f) => <DropdownMenuRadioItem key={f} value={f}>{f}</DropdownMenuRadioItem>)}
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuSub>
						<DropdownMenuItem onSelect={() => setRenaming(true)}><Pencil />Rename</DropdownMenuItem>
						<DropdownMenuItem onSelect={(e) => { e.preventDefault(); void navigator.clipboard?.writeText(session.id); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>
							<Swap kind="icon" swapKey={copied ? "c" : "n"}>{copied ? <Check className="text-ok" /> : <Copy />}</Swap>
							<Swap swapKey={copied ? "copied" : "copy"}>{copied ? "Copied" : "Copy session ID"}</Swap>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem onSelect={() => toast.message("Scheduling is not wired in this example")}><Timer />Schedule</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => toast.message("Playbooks are not wired in this example")}><Wand2 />Create playbook</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => setInsights(true)}><ScanSearch />Analyse session</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem onSelect={restart}><RotateCcw />Restart session</DropdownMenuItem>
						<DropdownMenuItem variant="destructive" onSelect={() => setConfirm("end")}><Trash2 />End session</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={() => setFocus((f) => !f)}>{focus ? <PanelLeftOpen /> : <PanelLeftClose />}Focus mode<DropdownMenuShortcut>⌘⇧F</DropdownMenuShortcut></DropdownMenuItem>
					<DropdownMenuSeparator />
					<p className="px-2 py-1.5 text-sm text-ink-3">Usage £1.84 · 23 messages · 412 KB</p>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);

	const ended = phase === "ended";
	const running = phase === "working" && planApproved;
	const thread = !live ? (
		<>
			<UserMessage>{session.ask}</UserMessage>
			<AssistantMessage from="the session log">
				<p>{session.shownStatus === "ready" ? "The work is finished and the pull request is waiting for review." : session.shownStatus === "needs-you" ? "I stopped at a decision I should not make for you. Open the question to carry on." : "The upgrade failed on a type error in the queue consumer. I have left the branch as it was."}</p>
			</AssistantMessage>
			<Resolved tone="neutral">Open the first session to see the full thread in this example.</Resolved>
		</>
	) : (
		<>
			<UserMessage>{session.ask}</UserMessage>
			{!planApproved ? (
				phase === "stopped" ? <Resolved tone="neutral">Plan cancelled. Nothing ran.</Resolved> :
				<PlanCard
					title="Fix part-penny rounding in invoice totals"
					from="the request, the billing module and the blueprint"
					steps={[
						{ id: "read", title: "Read the invoice module and the billing blueprint", detail: "src/billing, docs/blueprint/billing.md" },
						{ id: "repro", title: "Reproduce the one penny drift on INV-2041" },
						{ id: "fix", title: "Round each line half to even, then sum", detail: "3 files in src/billing" },
						{ id: "test", title: "Add tests and run the billing suite", detail: "24 finance fixtures" },
						{ id: "pr", title: "Open a pull request for review", detail: "Reviewers are notified by email", risk: "external" },
					]}
					onApprove={() => setPlanApproved(true)}
					onCancel={() => setPhase("stopped")}
				/>
			) : (
			<>
			<Resolved>Plan approved · 5 steps</Resolved>
			<ThinkingSteps verb="Worked" steps={thinkingDone ? doneSteps : liveSteps} done={thinkingDone} seconds={thinkingDone ? Math.min(elapsed, 14000) / 1000 : elapsed / 1000} />
			{elapsed >= STREAM_FROM && (
				<AssistantMessage
					from="the repository and the test run"
					actions={ready ? <AnswerActions text={ANSWER} latest onFeedback={async () => { await new Promise((r) => setTimeout(r, 400)); }} /> : undefined}
				>
					<p><StreamingText text={streamed} /></p>
					{ready && (
						<p className="text-sm text-ink-2">
							Rounding rule: half to even, per line.{" "}
							<WhyChoice
								choice="half to even"
								factors={["The 24 finance fixtures expect it", "It removes the drift on INV-2041 and 6 similar invoices", "HMRC accepts per-line rounding when applied consistently"]}
								alternatives={[{ name: "Half up", why: "kept a one penny drift on credit lines" }, { name: "Round the total only", why: "is what the blueprint says, but the code never did it" }]}
								onChange={() => toast("Tell the agent which rule to use in the composer")}
								onKeep={() => toast.success("Kept half to even")}
							/>
						</p>
					)}
				</AssistantMessage>
			)}
			{elapsed >= EDITED_AT && <PlanChange what="Added a step to propose a blueprint change" why="The blueprint says totals round once at the end, which contradicts the fix, so I will ask instead of editing it" />}
			{phase === "stopped" && <Resolved tone="neutral">Stopped by you. {elapsed >= EDITED_AT && elapsed < PR_AT ? "The 3 uncommitted edits were discarded." : "Nothing was lost."} <Button variant="link" size="xs" onClick={restart}>Restart session</Button></Resolved>}
			{ready && (
				<>
					<div className="grid gap-2">
						<ArtifactCard title="Billing suite test report" meta="7 of 7 passed · 2.1 s" from="the billing test run" actions={<Button variant="outline" size="sm" onClick={() => { setTab("report"); setPanelOpen(true); setExpanded(false); }}>Open</Button>} />
						<ArtifactCard title="PR 482: Fix part-penny rounding in invoice totals" meta={merged ? "+393 −94 · Merged" : "+393 −94 · Ready to merge"} from="the diff and the test run" actions={<Button variant="outline" size="sm" onClick={() => { setTab("pr"); setPanelOpen(true); setExpanded(false); }}>Open</Button>} />
					</div>
					<div ref={approvals} className="grid scroll-mt-24 gap-5">
						{changes === "pending" ? (
							<ChangeRequest
								title="Update the billing blueprint to match the fix"
								from="this run and 2 failing fixtures"
								reason="The blueprint says totals round once at the end, but the code has always rounded each line. I propose describing what the code does and adding a worked example, so the next change starts from the right rule."
								files={[{ path: "docs/blueprint/billing.md", lines: [
									{ type: "ctx", text: "## 4.2 Rounding" },
									{ type: "del", text: "Totals round once at the end, half up." },
									{ type: "add", text: "Each line rounds half to even, then the lines are summed." },
									{ type: "ctx", text: "" },
									{ type: "add", text: "## 4.3 Worked example" },
									{ type: "add", text: "A £10.25 line at 20% VAT is £2.05 VAT, not £2.06." },
								] }]}
								simulation={{ suite: "Billing fixtures, 24 invoices and credit notes", cases: [
									{ name: "INV-2041 part-penny VAT", status: "fixed" },
									{ name: "CN-118 credit note, two lines", status: "fixed" },
									{ name: "CN-131 credit note with discount", status: "new-fail", detail: "Totals £0.01 lower than the customer's statement" },
									...Array.from({ length: 21 }, (_, i) => ({ name: `INV-${2100 + i} standard invoice`, status: "pass" as const })),
								] }}
								onApprove={() => { setChanges("applied"); toast.success("Blueprint change approved", { action: { label: "Undo", onClick: () => setChanges("pending") } }); }}
								onReject={() => setChanges("rejected")}
							/>
						) : changes === "applied" ? (
							<Resolved>Approved 2 changes to docs/blueprint/billing.md. <Button variant="link" size="xs" onClick={() => setChanges("pending")}>Undo</Button></Resolved>
						) : (
							<>
								<Resolved tone="neutral">Rejected the blueprint changes.</Resolved>
								<AssistantMessage from="your decision"><p>Understood. I have left the blueprint as it is and noted the mismatch in the pull request description.</p></AssistantMessage>
							</>
						)}
						{answer === null ? (
							<div className="grid gap-2">
								<span className="flex items-center gap-2 text-sm font-medium text-ink"><Badge variant="warning" dot>Needs you</Badge>One decision before this can merge</span>
								<ConfidenceNote cause="the blueprint doesn't say how credit notes round, and the two fixtures that cover them disagree">Until you decide, credit notes keep their current rounding. CN-131 shows the difference.</ConfidenceNote>
								<ClarifyingQuestion
									questions={[{ question: "How should credit notes round a half penny?", options: [{ id: "even", title: "Half to even, like invoices", detail: "One rule everywhere. Matches the finance fixtures." }, { id: "away", title: "Half away from zero", detail: "Credits round in the customer's favour." }] }]}
									onDone={(a) => setAnswer(a[0])}
								/>
							</div>
						) : (
							<>
								<Resolved>You chose “{answer === "even" ? "Half to even, like invoices" : answer === "away" ? "Half away from zero" : answer}” for credit notes.</Resolved>
								<AssistantMessage from="your answer"><p>Thanks. I will apply that rule to credit notes and push one more commit to the pull request. Nothing is merged until you do it.</p></AssistantMessage>
							</>
						)}
					</div>
				</>
			)}
			</>
			)}
			{sent.map((m) => (
				<div key={m.id} className="grid gap-5">
					<UserMessage>{m.text}</UserMessage>
					<AssistantMessage from="your message"><p>Noted. I will use that for the rest of this session.</p></AssistantMessage>
				</div>
			))}
			{merged && <Resolved>PR 482 merged with “{mergeMode}” by you.</Resolved>}
			{ended && <Resolved tone="neutral">Session ended by you. It can't be reopened.</Resolved>}
		</>
	);

	const centre = (
		<div className="flex min-h-full flex-col">
			<div role="log" aria-label="Session thread" className="mx-auto grid w-full max-w-3xl flex-1 content-start gap-5 px-6 py-5 max-md:px-4">{thread}</div>
			<div className="sticky bottom-0 border-t border-line bg-surface">
				<div className="mx-auto grid w-full max-w-3xl gap-2 px-6 py-3 max-md:px-4">
					{ended ? (
						<p className="py-2 text-center text-base text-ink-2">This session has ended. Start a new session to carry on.</p>
					) : (
						<>
							<div role="status" className="flex h-5 items-center gap-2 text-sm text-ink-2">
								{live && phase === "working" && !planApproved ? <span>Waiting for you to approve the plan.</span> : running && live ? <><ShimmerText>Updating the blueprint</ShimmerText><span className="tabular text-ink-3">{(elapsed / 1000).toFixed(0)} s</span></> : live && ready ? <span>Ready for review. Nothing is running.</span> : live ? <span>Stopped. Send a message or restart to go on.</span> : null}
							</div>
							<MessageComposer
								noun={{ one: "file", many: "files" }}
								placeholder="Guide the agent while it works"
								chips={[{ id: "repo", label: "harbourline/billing-api" }, { id: "branch", label: "fix/part-penny-rounding" }]}
								mentions={FILES.map((f) => ({ id: f.path, label: f.path }))}
								tasks={["run the billing tests", "open a pull request", "explain the change"]}
								plusMenu={<><DropdownMenuLabel>Add context</DropdownMenuLabel><DropdownMenuItem onSelect={() => toast.message("Attachments are not wired in this example")}>Attach a file</DropdownMenuItem><DropdownMenuItem onSelect={() => toast.message("Issue links are not wired in this example")}>Link an issue</DropdownMenuItem></>}
								busy={running && live}
								onStop={requestStop}
								onSend={(text) => setSent((s) => [...s, { id: s.length, text }])}
							/>
							<p className="text-xs text-ink-3">Works in harbourline/billing-api only and never merges or edits the blueprint without you. Check the simulation results before approving a change.</p>
						</>
					)}
				</div>
			</div>
		</div>
	);

	const expandedView = (
		<div className="mx-auto grid w-full max-w-4xl content-start gap-3 px-6 py-5 max-md:px-4">
			<div className="flex items-center gap-2"><h2 className="flex-1 text-lg font-semibold text-ink">Session workspace</h2>{tab === "pr" && live && elapsed >= PR_AT && mergeControl}<Button variant="outline" size="sm" onClick={() => setExpanded(false)}>Back to thread</Button></div>
			{panelBody}
		</div>
	);

	return (
		<div className="h-full min-h-0">
			<ExampleShell className="h-example-frame" sidebarCollapsed={focus} sidebar={sidebar} topBar={topBar} panel={sidePanel}>
				{expanded ? expandedView : centre}
			</ExampleShell>

			<ShortcutSheet groups={SHORTCUTS} singleKeys onSingleKeysChange={() => {}} />

			<CommandDialog open={palette} onOpenChange={setPalette} title="Search sessions" description="Find a session by its title">
				<CommandInput placeholder="Search sessions" />
				<CommandList>
					<CommandEmpty>No sessions match.</CommandEmpty>
					<CommandGroup heading="Sessions">
						{sessions.map((s) => (
							<CommandItem key={s.id} value={s.title} onSelect={() => open(s.id)}>
								<span className="min-w-0 flex-1 truncate">{s.title}</span>
								<StatusLine status={s.shownStatus} prs={s.prs} />
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>

			<Dialog open={insights} onOpenChange={setInsights}>
				<DialogContent className="max-h-9/10 grid-rows-[auto_auto_minmax(0,1fr)] sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Session insights</DialogTitle>
						<DialogDescription>What happened in this session and what it meant.</DialogDescription>
						<AiOrigin from="the session log" time="just now" />
					</DialogHeader>
					<ul aria-label="Legend" className="flex flex-wrap gap-1.5">
						{(Object.keys(SEVERITY) as (keyof typeof SEVERITY)[]).map((k) => <li key={k}><Badge variant={SEVERITY[k].badge} dot>{SEVERITY[k].label}</Badge></li>)}
					</ul>
					<div tabIndex={0} role="region" aria-label="Timeline" className="-mr-2 min-h-0 overflow-y-auto pr-2 outline-none focus-visible:outline-2 focus-visible:outline-primary">
						<ol className="grid">
							{INSIGHTS.map((e) => (
								<li key={e.at} className="grid grid-cols-[3rem_0.75rem_minmax(0,1fr)] gap-x-3 pb-4 last:pb-0">
									<span className="tabular pt-px font-mono text-sm text-ink-3">{e.at}</span>
									<span className="relative flex justify-center"><span aria-hidden="true" className="absolute top-2 -bottom-4 w-px bg-line" /><span aria-hidden="true" className={`relative mt-1.5 size-2.5 rounded-full ${SEV_DOT[e.sev]}`} /></span>
									<span className="grid gap-0.5">
										<span className="flex flex-wrap items-center gap-2"><span className="text-base font-medium text-ink">{e.title}</span><span className="text-sm text-ink-3">{SEVERITY[e.sev].label}</span></span>
										<span className="text-sm text-ink-2">{e.detail}</span>
									</span>
								</li>
							))}
						</ol>
					</div>
				</DialogContent>
			</Dialog>

			<AlertDialog open={confirm === "stop"} onOpenChange={(o) => !o && setConfirm(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Stop the agent?</AlertDialogTitle>
						<AlertDialogDescription>3 edited files are not committed yet. Stopping now discards them. The tests and the blueprint stay as they were.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel autoFocus>Keep working</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={doStop}>Stop and discard edits</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<AlertDialog open={confirm === "end"} onOpenChange={(o) => !o && setConfirm(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>End this session?</AlertDialogTitle>
						<AlertDialogDescription>The agent stops and the workspace is deleted. The thread and the pull request stay, but the session can't be reopened. This can't be undone.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel autoFocus>Keep session</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={() => { setPhase("ended"); setConfirm(null); toast.success("Session ended"); }}>End session</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<AlertDialog open={confirm === "merge"} onOpenChange={(o) => !o && setConfirm(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Merge PR 482?</AlertDialogTitle>
						<AlertDialogDescription>This uses “{mergeMode}” and changes main for everyone on the team. Tomasz Brandt has not reviewed it yet and the optional accessibility check failed.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel autoFocus>Not yet</AlertDialogCancel>
						<AlertDialogAction onClick={() => { setMerged(true); setConfirm(null); toast.success("PR 482 merged"); }}>{mergeMode}</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
