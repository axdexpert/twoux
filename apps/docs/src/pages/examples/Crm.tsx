import {
	AiOrigin,
	AnswerActions,
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
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Checkbox,
	Citation,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
	Field,
	FieldLabel,
	FilterBar,
	FilterPill,
	FilterSummary,
	FollowUps,
	GroupedList,
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	Kbd,
	ListGroup,
	MessageComposer,
	PersonAvatar,
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
	RadioField,
	RadioGroup,
	ShimmerText,
	ShortcutSheet,
	ShortcutsProvider,
	SidebarItem,
	SidebarSection,
	Starters,
	StatCompare,
	StreamingText,
	SuggestedChanges,
	Swap,
	SwitchField,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	TextField,
	Timestamp,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	UserMessage,
	toast,
} from "@twoux/ui";
import {
	BarChart3,
	Building2,
	Calendar,
	Check,
	CheckSquare,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	Copy,
	Ellipsis,
	FileText,
	Handshake,
	Inbox,
	LifeBuoy,
	Mail,
	Pencil,
	Phone,
	Plus,
	Search,
	Settings,
	MessageSquare,
	Square,
	Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ASK_ANSWERS, ASK_STARTERS, type Act, type ActKind, CONTACTS, COMPANIES, type Company, type Contact, type Deal, DEALS, STAGES, SUMMARIES, type Ticket, TICKETS, at, initialActivities } from "./crm/data";
import { ExampleShell } from "../../components/example-shell";
import { ExampleBrand } from "../../components/example-brand";

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const KIND_ICON: Record<ActKind, React.ReactNode> = { call: <Phone />, email: <Mail />, task: <CheckSquare />, meeting: <Calendar />, note: <FileText /> };
const KIND_LABEL: Record<ActKind, string> = { call: "Calls", email: "Emails", task: "Tasks", meeting: "Meetings", note: "Notes" };
const RANGES = [{ value: "all", label: "All time", days: 0 }, { value: "30", label: "Last 30 days", days: 30 }, { value: "90", label: "Last 90 days", days: 90 }];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BACK_REASONS = ["Wrong stage when it was set", "Buyer went quiet", "Budget or scope changed", "Duplicate or merged record"];

type Overrides = Partial<Pick<Contact, "email" | "phone" | "title" | "city">>;
type Turn = { q: string; text: string; status: "working" | "streaming" | "done" | "stopped" };

const firstName = (c: Contact) => c.name.split(" ")[0];
const stageBadge = (s: number) => (s === 4 ? "success" : s === 3 ? "default" : "secondary") as "success" | "default" | "secondary";

/* ------------------------------------------------------------------ helpers */

/** Runs the assistant's canned replies with a visible working state and a Stop. */
function useAsk(contact: Contact, acts: Act[], resetKey: string) {
	const [thread, setThread] = useState<Turn[]>([]);
	const timers = useRef<number[]>([]);
	const clear = () => { timers.current.forEach((t) => { window.clearTimeout(t); window.clearInterval(t); }); timers.current = []; };
	useEffect(() => { clear(); setThread([]); return clear; }, [resetKey]);
	const answer = (q: string) => {
		if (contact.id === "C-2041") return (ASK_ANSWERS.find((a) => a.match.test(q)) ?? { text: "Marta is engaged and the next step is the pricing walkthrough on Thursday. Ask about tasks, risks or a draft reply for something more specific." }).text;
		const next = acts.find((a) => a.kind === "task" && !a.done);
		return `${firstName(contact)} is at the ${STAGES[contact.stage].toLowerCase()} stage. ${next ? `The next open task is "${next.title}".` : "There are no open tasks."} Ask about risks or a draft reply for something more specific.`;
	};
	const ask = (q: string) => {
		clear();
		const full = answer(q).split(" ");
		setThread((t) => [...t, { q, text: "", status: "working" }]);
		timers.current.push(window.setTimeout(() => {
			setThread((t) => t.map((x, i) => (i === t.length - 1 ? { ...x, status: "streaming" } : x)));
			let n = 0;
			const iv = window.setInterval(() => {
				n += 2;
				const done = n >= full.length;
				setThread((t) => t.map((x, i) => (i === t.length - 1 ? { ...x, text: full.slice(0, n).join(" "), status: done ? "done" : "streaming" } : x)));
				if (done) window.clearInterval(iv);
			}, 50);
			timers.current.push(iv);
		}, 1100));
	};
	const stop = () => { clear(); setThread((t) => t.map((x, i) => (i === t.length - 1 && x.status !== "done" ? { ...x, status: "stopped" } : x))); };
	return { thread, ask, stop, busy: thread.at(-1)?.status === "working" || thread.at(-1)?.status === "streaming" };
}

/** Collapsible block of the left column: heading button on the left, an optional action on the right. */
function Section({ title, action, defaultOpen = true, children }: { title: string; action?: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }) {
	const [open, setOpen] = useState(defaultOpen);
	return (
		<Collapsible open={open} onOpenChange={setOpen} className="border-t border-line">
			<div className="flex h-9 items-center gap-1">
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="sm" className="min-w-0 flex-1 justify-start text-ink" aria-label={`${title}, ${open ? "collapse" : "expand"}`}>
						<ChevronRight className={`text-ink-3 transition-transform duration-fast ${open ? "rotate-90" : ""}`} />
						<span className="truncate">{title}</span>
					</Button>
				</CollapsibleTrigger>
				{action}
			</div>
			<CollapsibleContent><div className="pb-3 pl-1">{children}</div></CollapsibleContent>
		</Collapsible>
	);
}

/* ------------------------------------------------------------------ left column */

function EditableRow({ id, label, value, editing, onEdit, onClose, onSave, validate, hint, type = "text" }: {
	id: string; label: string; value: string; editing: boolean; onEdit: () => void; onClose: () => void; onSave: (v: string) => void;
	validate: (v: string) => string | undefined; hint?: string; type?: string;
}) {
	const [draft, setDraft] = useState(value);
	const [error, setError] = useState<string | undefined>();
	useEffect(() => { if (editing) { setDraft(value); setError(undefined); } }, [editing, value]);
	if (!editing) {
		return (
			<>
				<dt className="pt-1 text-sm text-ink-2">{label}</dt>
				<dd className="min-w-0">
					<Button variant="ghost" size="sm" className="group w-full justify-between" onClick={onEdit} aria-label={`Edit ${label.toLowerCase()}: ${value || "empty"}`}>
						<span className={`min-w-0 truncate text-left ${value ? "text-ink" : "text-ink-3"}`}>{value || "Add"}</span>
						<Pencil className="shrink-0 text-ink-3 opacity-0 transition-opacity duration-fast group-hover:opacity-100 group-focus-visible:opacity-100" />
					</Button>
				</dd>
			</>
		);
	}
	const submit = () => { const e = validate(draft.trim()); setError(e); if (!e) onSave(draft.trim()); };
	return (
		<dd className="col-span-2 grid gap-2 rounded-sm bg-surface-2 p-2.5">
			<form onSubmit={(e) => { e.preventDefault(); submit(); }} onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } }} className="grid gap-2" noValidate>
				<TextField id={id} label={label} type={type} value={draft} autoFocus hint={hint} error={error} onChange={(e) => { setDraft(e.target.value); if (error) setError(validate(e.target.value.trim())); }} onBlur={() => setError(validate(draft.trim()))} />
				<div className="flex items-center gap-2">
					<Button type="submit" size="sm">Save</Button>
					<Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
				</div>
			</form>
		</dd>
	);
}

function QuickAction({ label, shortcut, icon, onClick }: { label: string; shortcut: string; icon: React.ReactNode; onClick: () => void }) {
	return (
		<div className="grid min-w-0 justify-items-center gap-1">
			<Tooltip>
				<TooltipTrigger asChild><Button variant="outline" size="icon" aria-label={label} shortcut={shortcut} onClick={onClick}>{icon}</Button></TooltipTrigger>
				<TooltipContent>{label} <Kbd>{shortcut}</Kbd></TooltipContent>
			</Tooltip>
			<span className="text-sm text-ink-2">{label}</span>
		</div>
	);
}

function ProfileColumn({ c, onOverride, editing, setEditing, quick, onDelete, deals }: {
	c: Contact; onOverride: (o: Overrides) => void; editing: string | null; setEditing: (f: string | null) => void;
	quick: { note: () => void; email: () => void; call: () => void; task: () => void; meeting: () => void }; onDelete: () => void; deals: Deal[];
}) {
	const [copied, setCopied] = useState(false);
	const [prefs, setPrefs] = useState({ marketing: true, product: true, calls: true, sms: false });
	useEffect(() => { setCopied(false); }, [c.id]);
	const copy = () => { void navigator.clipboard?.writeText(c.email); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
	const save = (key: keyof Overrides, label: string) => (v: string) => {
		const before = c[key];
		onOverride({ [key]: v });
		setEditing(null);
		toast.success(`${label} updated`, { description: v || "Cleared", action: { label: "Undo", onClick: () => onOverride({ [key]: before }) } });
	};
	const views = 8 + Math.round(c.score * 0.6);
	return (
		<div className="grid content-start gap-3 p-4">
			<div className="grid gap-3">
				<div className="flex items-start gap-3">
					<PersonAvatar name={c.name} size="lg" />
					<div className="grid min-w-0 gap-0.5">
						<h1 className="text-lg font-semibold text-ink">{c.name}</h1>
						<p className="text-base text-ink-2">{c.title}</p>
						<p className="flex items-center gap-1.5 text-base text-ink-2"><Building2 className="size-3.5 shrink-0 text-ink-3" /><span className="truncate">{c.company}</span></p>
					</div>
				</div>
				<div className="flex items-center gap-1.5">
					<Mail className="size-3.5 shrink-0 text-ink-3" aria-hidden="true" />
					<span className="min-w-0 flex-1 truncate text-base text-ink" title={c.email}>{c.email}</span>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon-xs" aria-label={copied ? "Email copied" : "Copy email address"} onClick={copy}>
								<Swap kind="icon" swapKey={copied ? "copied" : "copy"}>{copied ? <Check className="text-ok" /> : <Copy />}</Swap>
							</Button>
						</TooltipTrigger>
						<TooltipContent>{copied ? "Copied" : "Copy email"}</TooltipContent>
					</Tooltip>
				</div>
				<div className="grid grid-cols-6 gap-1.5">
					<QuickAction label="Note" shortcut="N" icon={<FileText />} onClick={quick.note} />
					<QuickAction label="Email" shortcut="⇧E" icon={<Mail />} onClick={quick.email} />
					<QuickAction label="Call" shortcut="⇧C" icon={<Phone />} onClick={quick.call} />
					<QuickAction label="Task" shortcut="⇧T" icon={<CheckSquare />} onClick={quick.task} />
					<QuickAction label="Meeting" shortcut="⇧M" icon={<Calendar />} onClick={quick.meeting} />
					<div className="grid min-w-0 justify-items-center gap-1">
						<DropdownMenu>
							<Tooltip>
								<TooltipTrigger asChild><DropdownMenuTrigger asChild><Button variant="outline" size="icon" aria-label="More actions"><Ellipsis /></Button></DropdownMenuTrigger></TooltipTrigger>
								<TooltipContent>More actions</TooltipContent>
							</Tooltip>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onSelect={() => { void navigator.clipboard?.writeText(c.phone); toast.success("Phone number copied", { description: c.phone }); }}>Copy phone number</DropdownMenuItem>
								<DropdownMenuItem onSelect={() => toast.success("Added to “Q4 procurement leads”", { action: { label: "Undo", onClick: () => {} } })}>Add to a list</DropdownMenuItem>
								<DropdownMenuItem onSelect={() => toast.success("You are following this contact")}>Follow contact</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem variant="destructive" onSelect={onDelete}>Delete contact</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<span className="text-sm text-ink-2">More</span>
					</div>
				</div>
			</div>

			<div>
				<Section
					title="About this contact"
					action={
						<Tooltip>
							<TooltipTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Edit contact details" shortcut="E" onClick={() => setEditing(editing ? null : "email")}><Pencil /></Button></TooltipTrigger>
							<TooltipContent>Edit details <Kbd>E</Kbd></TooltipContent>
						</Tooltip>
					}
				>
					<dl className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-x-2 gap-y-0.5 text-base">
						<EditableRow id="f-email" label="Email" type="email" value={c.email} editing={editing === "email"} onEdit={() => setEditing("email")} onClose={() => setEditing(null)} onSave={save("email", "Email")} hint="Use a work address, like name@company.co.uk" validate={(v) => (!v ? "Email is required" : EMAIL_RE.test(v) ? undefined : "Enter a valid email address, like name@example.co.uk")} />
						<EditableRow id="f-phone" label="Phone" value={c.phone} editing={editing === "phone"} onEdit={() => setEditing("phone")} onClose={() => setEditing(null)} onSave={save("phone", "Phone")} hint="UK number, like 020 7946 0318" validate={(v) => (v && v.replace(/\D/g, "").length < 10 ? "Enter a phone number with at least 10 digits, like 020 7946 0318" : undefined)} />
						<EditableRow id="f-title" label="Job title" value={c.title} editing={editing === "title"} onEdit={() => setEditing("title")} onClose={() => setEditing(null)} onSave={save("title", "Job title")} validate={(v) => (!v ? "Job title is required" : v.length > 80 ? `Job title has too many characters. ${v.length} of 80.` : undefined)} />
						<EditableRow id="f-city" label="City" value={c.city} editing={editing === "city"} onEdit={() => setEditing("city")} onClose={() => setEditing(null)} onSave={save("city", "City")} validate={() => undefined} />
						<dt className="pt-1.5 text-sm text-ink-2">Contact owner</dt><dd className="px-2 py-1 text-ink">{c.owner}</dd>
						<dt className="pt-1.5 text-sm text-ink-2">Lead source</dt><dd className="px-2 py-1 text-ink">{c.source}</dd>
						<dt className="pt-1.5 text-sm text-ink-2">Lead score</dt><dd className="tabular px-2 py-1 text-ink">{c.score} of 100</dd>
					</dl>
				</Section>
				<Section title="Communication preferences">
					<div className="grid gap-3 px-1.5 pt-1">
						<SwitchField id="p-marketing" label="Marketing emails" hint="Offers and event invitations" checked={prefs.marketing} onCheckedChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))} />
						<SwitchField id="p-product" label="Product updates" hint="Release notes, about once a month" checked={prefs.product} onCheckedChange={(v) => setPrefs((p) => ({ ...p, product: v }))} />
						<SwitchField id="p-calls" label="Phone calls" hint="Consent given on a webinar form" checked={prefs.calls} onCheckedChange={(v) => setPrefs((p) => ({ ...p, calls: v }))} />
						<SwitchField id="p-sms" label="Text messages" checked={prefs.sms} onCheckedChange={(v) => setPrefs((p) => ({ ...p, sms: v }))} />
						<p className="text-sm text-ink-3">Last changed <Timestamp value={at(-30, 9, 12)} className="text-ink-3" /></p>
					</div>
				</Section>
				<Section title="Website activity">
					<div className="grid gap-3 px-1.5 pt-1">
						<div className="grid grid-cols-2 gap-3">
							<StatCompare label="Page views" value={String(views)} change="+18%" period="last month" good />
							<StatCompare label="Form submits" value={String(Math.max(1, Math.round(c.score / 25)))} change="+1" period="last month" good />
						</div>
						<div>
							<h4 className="pb-1 text-sm font-medium text-ink-2">Top pages</h4>
							<ul className="grid divide-y divide-line text-base">
								{[["/pricing", Math.round(views * 0.3)], ["/integrations/freight", Math.round(views * 0.22)], ["/security", Math.round(views * 0.14)]].map(([p, n]) => (
									<li key={p} className="flex items-center justify-between gap-2 py-1.5"><span className="min-w-0 truncate font-mono text-sm text-ink-2">{p}</span><span className="tabular text-ink">{n}</span></li>
								))}
							</ul>
						</div>
						<p className="text-sm text-ink-3">Last seen <Timestamp value={at(-1, 15, 4)} className="text-ink-3" />. {deals.length > 0 ? "Visited pricing three times this week." : "No pricing visits yet."}</p>
					</div>
				</Section>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ lifecycle path */

function StagePath({ stage, onForward, onBack }: { stage: number; onForward: (i: number) => void; onBack: (i: number, reason: string) => void }) {
	const [open, setOpen] = useState<number | null>(null);
	const [reason, setReason] = useState("");
	const [error, setError] = useState<string | undefined>();
	return (
		<nav aria-label="Lifecycle stage" className="overflow-x-auto border-b border-line px-4 py-2.5">
			<ol className="flex min-w-max items-center gap-1">
				{STAGES.map((s, i) => {
					const state = i < stage ? "done" : i === stage ? "current" : "next";
					const label = `${s}${state === "done" ? ", completed" : state === "current" ? ", current stage" : ""}`;
					const btn = (
						<Button
							variant={state === "current" ? "outline" : "ghost"}
							size="sm"
							aria-current={state === "current" ? "step" : undefined}
							aria-label={label}
							className={state === "current" ? "border-primary bg-primary-soft text-primary-ink hover:bg-primary-soft" : state === "next" ? "text-ink-2" : "text-ink"}
							onClick={() => (state === "next" ? onForward(i) : undefined)}
						>
							{state === "done" ? <Check className="text-ok" /> : <span aria-hidden="true" className={`tabular text-sm ${state === "current" ? "text-primary-ink" : "text-ink-3"}`}>{i + 1}</span>}
							{s}
						</Button>
					);
					return (
						<li key={s} className="flex items-center gap-1">
							{i > 0 && <ChevronRight className="size-3.5 text-ink-3" aria-hidden="true" />}
							{state === "done" ? (
								<Popover open={open === i} onOpenChange={(o) => { setOpen(o ? i : null); if (o) { setReason(""); setError(undefined); } }}>
									<PopoverTrigger asChild>{btn}</PopoverTrigger>
									<PopoverContent align="start" className="w-80">
										<form
											className="grid gap-3"
											noValidate
											onSubmit={(e) => {
												e.preventDefault();
												if (!reason) { setError("Choose a reason so the team can see why this moved back."); return; }
												onBack(i, reason);
												setOpen(null);
											}}
										>
											<PopoverHeader>
												<PopoverTitle>Move back to {s}?</PopoverTitle>
												<PopoverDescription>This changes the stage for everyone who follows this contact.</PopoverDescription>
											</PopoverHeader>
											<RadioGroup value={reason} onValueChange={(v) => { setReason(v); setError(undefined); }} aria-label="Reason for moving back" className="gap-1.5">
												{BACK_REASONS.map((r, k) => <RadioField key={r} id={`reason-${i}-${k}`} value={r} label={r} />)}
											</RadioGroup>
											{error && <p role="alert" className="text-sm text-bad">{error}</p>}
											<div className="flex justify-end gap-2">
												<Button type="button" variant="ghost" size="sm" onClick={() => setOpen(null)}>Cancel</Button>
												<Button type="submit" size="sm">Move back</Button>
											</div>
										</form>
									</PopoverContent>
								</Popover>
							) : btn}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

/* ------------------------------------------------------------------ activities */

function dueBadge(a: Act, now: Date) {
	if (a.done) return <Badge variant="success" dot>Done</Badge>;
	if (a.at < now) return <Badge variant="destructive" dot>Overdue</Badge>;
	if (a.at.toDateString() === now.toDateString()) return <Badge variant="warning" dot>Due today</Badge>;
	return <Badge variant="secondary">Due <Timestamp value={a.at} className="text-inherit" /></Badge>;
}

function ActivityCard({ a, now, open, onOpenChange, onToggleTask }: { a: Act; now: Date; open: boolean; onOpenChange: (o: boolean) => void; onToggleTask: (id: string, done: boolean) => void }) {
	const badge =
		a.kind === "task" ? dueBadge(a, now)
		: a.kind === "call" && a.outcome ? <Badge variant={a.outcome === "Connected" ? "success" : a.outcome === "No answer" ? "warning" : "secondary"} dot>{a.outcome}</Badge>
		: a.kind === "email" ? (a.draft ? <Badge variant="secondary">Draft</Badge> : <Badge variant={a.opened ? "success" : "secondary"} dot>{a.opened ? "Opened" : "Not opened"}</Badge>)
		: a.kind === "meeting" ? <Badge variant={a.at > now ? "default" : "secondary"}>{a.at > now ? "Upcoming" : "Held"}</Badge>
		: null;
	const overdue = a.kind === "task" && !a.done && a.at < now;
	const verb = { call: "Call", email: "Email", task: "Task", meeting: "Meeting", note: "Note" }[a.kind];
	return (
		<li className="relative pl-9" id={a.id}>
			<span aria-hidden="true" className={`absolute top-2 left-0 z-10 grid size-6 place-items-center rounded-full border bg-surface [&_svg]:size-3.5 ${overdue ? "border-bad-line text-bad" : "border-line-strong text-ink-2"}`}>{KIND_ICON[a.kind]}</span>
			<Collapsible open={open} onOpenChange={onOpenChange}>
				<Card className="gap-0 py-0">
					<div className="flex items-start gap-2 px-3 py-2">
						{a.kind === "task" && (
							<span className="flex h-6 items-center">
								<Checkbox aria-label={`Mark “${a.title}” as ${a.done ? "not done" : "done"}`} checked={!!a.done} onCheckedChange={(v) => onToggleTask(a.id, v === true)} />
							</span>
						)}
						<CollapsibleTrigger asChild>
							<button type="button" className="flex min-w-0 flex-1 items-start gap-2 rounded-xs text-left" aria-label={`${verb}: ${a.title}`}>
								<span className="grid min-w-0 flex-1 gap-0.5">
									<span className={`truncate text-base font-medium ${a.done ? "text-ink-3 line-through" : "text-ink"}`}>{a.title}</span>
									<span className="truncate text-sm text-ink-2">{verb} by {a.by}{a.duration ? ` · ${a.duration}` : ""}</span>
								</span>
								<span className="flex shrink-0 items-center gap-2 pt-0.5">
									<span className="max-sm:hidden">{badge}</span>
									<Timestamp value={a.at} short className="text-sm" />
									<ChevronDown className={`size-3.5 text-ink-3 transition-transform duration-fast ${open ? "rotate-180" : ""}`} aria-hidden="true" />
								</span>
							</button>
						</CollapsibleTrigger>
					</div>
					<CollapsibleContent>
						<div className="grid gap-2 border-t border-line px-3 py-2.5 text-base text-ink-2">
							<div className="sm:hidden">{badge}</div>
							{a.body && <p className="max-w-prose text-ink">{a.body}</p>}
							{a.attendees && <p className="text-sm">With {a.attendees.join(", ")}</p>}
							{a.kind === "task" ? <p className="text-sm">Due <Timestamp value={a.at} format="absolute" /></p> : <p className="text-sm text-ink-3"><Timestamp value={a.at} format="absolute" className="text-ink-3" /></p>}
						</div>
					</CollapsibleContent>
				</Card>
			</Collapsible>
		</li>
	);
}

function ActivitiesTab({ acts, now, open, setOpen, onToggleTask, composer }: { acts: Act[]; now: Date; open: Set<string>; setOpen: (s: Set<string>) => void; onToggleTask: (id: string, done: boolean) => void; composer: React.ReactNode }) {
	const [query, setQuery] = useState("");
	const [kinds, setKinds] = useState<string[]>([]);
	const [range, setRange] = useState("all");
	const days = RANGES.find((r) => r.value === range)?.days ?? 0;
	const filtered = acts.filter((a) => {
		if (kinds.length && !kinds.includes(a.kind)) return false;
		if (days && a.at < at(-days) && !(a.kind === "task" && !a.done)) return false;
		const q = query.trim().toLowerCase();
		return !q || `${a.title} ${a.body ?? ""} ${a.by}`.toLowerCase().includes(q);
	});
	const isUp = (a: Act) => (a.kind === "task" && !a.done) || (a.kind === "meeting" && a.at > now);
	const upcoming = filtered.filter(isUp).sort((x, y) => +x.at - +y.at);
	const overdueCount = upcoming.filter((a) => a.kind === "task" && a.at < now).length;
	const months = new Map<string, Act[]>();
	filtered.filter((a) => !isUp(a)).sort((x, y) => +y.at - +x.at).forEach((a) => {
		const k = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(a.at);
		months.set(k, [...(months.get(k) ?? []), a]);
	});
	const groups: { title: string; items: Act[]; note?: string }[] = [
		...(upcoming.length ? [{ title: "Upcoming and overdue", items: upcoming, note: overdueCount ? `${overdueCount} overdue` : undefined }] : []),
		...[...months].map(([title, items]) => ({ title, items })),
	];
	const allIds = filtered.map((a) => a.id);
	const anyOpen = allIds.some((id) => open.has(id));
	const clearFilters = () => { setQuery(""); setKinds([]); setRange("all"); };
	const hasFilter = !!query || kinds.length > 0 || range !== "all";
	return (
		<div className="grid gap-4">
			{composer}
			<div className="grid gap-2">
				<div className="flex flex-wrap items-center gap-2">
					<InputGroup className="max-w-72 min-w-40 flex-1">
						<InputGroupAddon><Search className="size-4" aria-hidden="true" /></InputGroupAddon>
						<InputGroupInput aria-label="Search activities" placeholder="Search activities" value={query} onChange={(e) => setQuery(e.target.value)} />
					</InputGroup>
					<DropdownMenu>
						<DropdownMenuTrigger asChild><Button variant="outline" size="sm" aria-label={`Date range: ${RANGES.find((r) => r.value === range)?.label}`}>{RANGES.find((r) => r.value === range)?.label}<ChevronDown className="text-ink-3" /></Button></DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuRadioGroup value={range} onValueChange={setRange}>
								{RANGES.map((r) => <DropdownMenuRadioItem key={r.value} value={r.value}>{r.label}</DropdownMenuRadioItem>)}
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>
					<span className="flex-1" />
					<Button variant="ghost" size="sm" onClick={() => setOpen(anyOpen ? new Set() : new Set(allIds))}>{anyOpen ? "Collapse all" : "Expand all"}</Button>
				</div>
				<FilterBar>
					<FilterPill field="Type" options={(Object.keys(KIND_LABEL) as ActKind[]).map((k) => ({ value: k, label: KIND_LABEL[k], count: acts.filter((a) => a.kind === k).length }))} selected={kinds} onChange={setKinds} />
					{hasFilter && <FilterSummary shown={filtered.length} total={acts.length} noun="activities" onClear={clearFilters} />}
				</FilterBar>
			</div>
			{groups.length === 0 ? (
				<Empty className="border border-dashed border-line">
					<EmptyHeader>
						<EmptyTitle>No activities match</EmptyTitle>
						<EmptyDescription>Nothing on this contact fits the search and filters. Clear them to see all {acts.length} activities.</EmptyDescription>
					</EmptyHeader>
					<EmptyContent><Button variant="outline" size="sm" onClick={clearFilters}>Clear filters</Button></EmptyContent>
				</Empty>
			) : (
				groups.map((g) => (
					<section key={g.title} aria-label={g.title} className="grid gap-2">
						<h3 className="flex items-center gap-2 text-sm font-medium text-ink-2">{g.title}<span className="tabular font-normal text-ink-3">{g.items.length}</span>{g.note && <Badge variant="destructive">{g.note}</Badge>}</h3>
						<ul className="relative grid gap-2 before:absolute before:top-4 before:bottom-4 before:left-3 before:w-px before:bg-line-strong">
							{g.items.map((a) => (
								<ActivityCard key={a.id} a={a} now={now} open={open.has(a.id)} onOpenChange={(o) => { const n = new Set(open); if (o) n.add(a.id); else n.delete(a.id); setOpen(n); }} onToggleTask={onToggleTask} />
							))}
						</ul>
					</section>
				))
			)}
		</div>
	);
}

/* ------------------------------------------------------------------ overview and intelligence */

function OverviewTab({ c, acts, now, goActivities }: { c: Contact; acts: Act[]; now: Date; goActivities: () => void }) {
	const past = acts.filter((a) => !(a.kind === "task" && !a.done) && a.at <= now).sort((x, y) => +y.at - +x.at);
	const next = acts.filter((a) => (a.kind === "task" && !a.done) || a.at > now).sort((x, y) => +x.at - +y.at)[0];
	const overdue = acts.filter((a) => a.kind === "task" && !a.done && a.at < now).length;
	const attention = acts.filter((a) => (a.kind === "task" && !a.done) || (a.kind === "meeting" && a.at > now)).sort((x, y) => +x.at - +y.at);
	const kindWord = { call: "Call", email: "Email", meeting: "Meeting", note: "Note", task: "Task" };
	return (
		<div className="grid gap-4">
			<section aria-label="Data highlights" className="grid gap-3 rounded-sm border border-line p-3">
				<h2 className="text-base font-semibold text-ink">Data highlights</h2>
				<dl className="grid grid-cols-2 gap-x-4 gap-y-3 @xl:grid-cols-4">
					<div className="grid content-start gap-0.5"><dt className="text-sm text-ink-2">Create date</dt><dd className="text-base text-ink"><Timestamp value={c.created} format="absolute" className="text-ink" /></dd></div>
					<div className="grid content-start gap-0.5"><dt className="text-sm text-ink-2">Lifecycle stage</dt><dd><Badge variant={stageBadge(c.stage)} dot>{STAGES[c.stage]}</Badge></dd></div>
					<div className="grid content-start gap-0.5"><dt className="text-sm text-ink-2">Last activity</dt><dd className="text-base text-ink">{past[0] ? <>{kindWord[past[0].kind]} · <Timestamp value={past[0].at} className="text-ink" /></> : "None yet"}</dd></div>
					<div className="grid content-start gap-0.5"><dt className="text-sm text-ink-2">Next activity</dt><dd className="text-base text-ink">{next ? <><span className="block truncate">{next.title}</span><Timestamp value={next.at} className="text-sm" /></> : "None planned"}</dd></div>
				</dl>
			</section>
			{attention.length > 0 && (
				<section aria-label="Needs attention" className="grid gap-2">
					<h2 className="text-base font-semibold text-ink">Needs attention</h2>
					<ul className="grid divide-y divide-line rounded-sm border border-line">
						{attention.slice(0, 3).map((a) => (
							<li key={a.id} className="flex items-center gap-3 px-3 py-2">
								<span aria-hidden="true" className="text-ink-3 [&_svg]:size-3.5">{KIND_ICON[a.kind]}</span>
								<span className="min-w-0 flex-1 truncate text-base text-ink">{a.title}</span>
								{a.kind === "task" ? dueBadge(a, now) : <Badge variant="default">Upcoming</Badge>}
							</li>
						))}
					</ul>
				</section>
			)}
			<section aria-label="Recent activity" className="grid gap-2">
				<div className="flex items-center justify-between gap-2">
					<h2 className="text-base font-semibold text-ink">Recent activity</h2>
					<Button variant="ghost" size="sm" onClick={goActivities}>View all {acts.length}<ChevronRight /></Button>
				</div>
				<p className="text-base text-ink-2">
					{past.length} logged touchpoints{overdue ? `, ${overdue} overdue task${overdue === 1 ? "" : "s"}` : ""}. The latest {Math.min(4, past.length)} are below.
				</p>
				<ul className="grid divide-y divide-line rounded-sm border border-line">
					{past.slice(0, 4).map((a) => (
						<li key={a.id} className="flex items-center gap-3 px-3 py-2">
							<span aria-hidden="true" className="text-ink-3 [&_svg]:size-3.5">{KIND_ICON[a.kind]}</span>
							<span className="min-w-0 flex-1"><span className="block truncate text-base text-ink">{a.title}</span><span className="block truncate text-sm text-ink-2">{a.by}</span></span>
							<Timestamp value={a.at} short className="text-sm" />
						</li>
					))}
				</ul>
			</section>
		</div>
	);
}

function IntelligenceTab({ c, onApply }: { c: Contact; onApply: (ids: string[]) => void }) {
	const [open, setOpen] = useState(true);
	const signals = [
		["Visited the pricing page three times this week", "success", "Intent"],
		["Opened the last four emails within an hour", "success", "Engagement"],
		["Security page viewed, questionnaire not yet returned", "warning", "Risk"],
		["Decision maker has not joined any call", "warning", "Risk"],
	] as const;
	return (
		<div className="grid gap-4">
			<div className="grid grid-cols-1 gap-3 @xl:grid-cols-2">
				<div className="rounded-sm border border-line p-3"><StatCompare label="Engagement score" value={String(c.score)} change="+9" period="last month" good spark={[48, 52, 55, 61, 66, 72, c.score]} /></div>
				<div className="rounded-sm border border-line p-3"><StatCompare label="Days since last reply" value="1" change="-6 days" period="last month" good spark={[9, 8, 8, 5, 4, 2, 1]} /></div>
			</div>
			<section aria-label="Buying signals" className="grid gap-2">
				<div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-base font-semibold text-ink">Buying signals</h2><AiOrigin from="website visits, email opens and 14 activities" /></div>
				<ul className="grid divide-y divide-line rounded-sm border border-line">
					{signals.map(([text, tone, kind]) => (
						<li key={text} className="flex items-center gap-3 px-3 py-2"><Badge variant={tone}>{kind}</Badge><span className="text-base text-ink">{text}</span></li>
					))}
				</ul>
			</section>
			{open && (
				<SuggestedChanges
					changes={[
						{ id: "t1", label: `Create task: ask ${firstName(c)} to bring the COO on Thursday`, detail: "Due in 2 days, assigned to you" },
						{ id: "t2", label: "Create task: name a security contact for the vendor review", detail: "Due today, assigned to Daniel Ferreira" },
					]}
					onApply={(ids) => { onApply(ids); setOpen(false); }}
					onDismiss={() => setOpen(false)}
				/>
			)}
		</div>
	);
}

/* ------------------------------------------------------------------ right column */

function SummaryCard({ c, deals, acts, onAsk, onCite }: { c: Contact; deals: Deal[]; acts: Act[]; onAsk: () => void; onCite: (id: string) => void }) {
	const base = c.id === "C-2041";
	const openTasks = acts.filter((a) => a.kind === "task" && !a.done).length;
	const make = (v: number) => base ? SUMMARIES[v] : `${firstName(c)} is ${c.title.toLowerCase()} at ${c.company} and sits at the ${STAGES[c.stage].toLowerCase()} stage. ${deals.length ? `${deals.length} deal${deals.length === 1 ? " is" : "s are"} linked, ${gbp.format(deals.reduce((s, d) => s + d.amount, 0))} in total.` : "No deals are linked yet."}${v ? ` ${acts.length} activities are logged and ${openTasks} task${openTasks === 1 ? " is" : "s are"} open.` : ""}`;
	const [text, setText] = useState(make(0));
	const [phase, setPhase] = useState<"idle" | "working" | "streaming">("idle");
	const [stopped, setStopped] = useState(false);
	const [when, setWhen] = useState("6 Nov, 09:12");
	const version = useRef(0);
	const timers = useRef<number[]>([]);
	const clear = () => { timers.current.forEach((t) => { window.clearTimeout(t); window.clearInterval(t); }); timers.current = []; };
	useEffect(() => clear, []);
	const run = () => {
		clear();
		setStopped(false);
		setPhase("working");
		version.current += 1;
		const words = make(version.current % 2).split(" ");
		timers.current.push(window.setTimeout(() => {
			setPhase("streaming");
			let n = 0;
			const iv = window.setInterval(() => {
				n += 3;
				setText(words.slice(0, n).join(" "));
				if (n >= words.length) { window.clearInterval(iv); setPhase("idle"); setWhen("just now"); }
			}, 45);
			timers.current.push(iv);
		}, 1600));
	};
	const stop = () => { clear(); setPhase("idle"); setStopped(true); };
	const cite = base ? ["ACT-316", "ACT-315", "D-881", "T-5512"] : ([acts[0]?.id, deals[0]?.id].filter(Boolean) as string[]);
	return (
		<Card className="gap-2 py-3">
			<CardHeader className="gap-1 px-4">
				<CardTitle level={2}>Record summary</CardTitle>
				<AiOrigin from={`${acts.length} activities, ${deals.length} deal${deals.length === 1 ? "" : "s"} and website visits`} time={`generated ${when}`} />
			</CardHeader>
			<CardContent className="grid gap-3 px-4">
				<div aria-live="polite" className="text-base text-ink [&_p]:max-w-prose">
					{phase === "working" ? (
						<p><ShimmerText>Reading {acts.length} activities and {deals.length} deal{deals.length === 1 ? "" : "s"}</ShimmerText></p>
					) : (
						<p><StreamingText text={text} /></p>
					)}
				</div>
				{phase === "idle" && cite.length > 0 && <p className="flex flex-wrap items-center gap-1 text-sm text-ink-3">Sources {cite.map((id) => <Citation key={id} id={id} onOpen={onCite} />)}</p>}
				{stopped && phase === "idle" && <p className="text-sm text-ink-3">Stopped. This is the earlier version.</p>}
				<div className="flex flex-wrap items-center justify-between gap-2">
					{phase === "idle" ? (
						<AnswerActions text={text} onRegenerate={run} onFeedback={() => new Promise((r) => window.setTimeout(r, 500))} />
					) : (
						<Button variant="outline" size="sm" onClick={stop}><Square className="fill-current" />Stop</Button>
					)}
					<Button variant="outline" size="sm" onClick={onAsk}>Ask a question</Button>
				</div>
			</CardContent>
		</Card>
	);
}

const priorityTone = { High: "destructive", Medium: "warning", Low: "secondary" } as const;
const ticketTone = { Open: "default", "Waiting on customer": "warning", Resolved: "success" } as const;

function Associations({ c, companies, deals, tickets, onAdd }: { c: Contact; companies: (Company & { primary?: boolean })[]; deals: Deal[]; tickets: Ticket[]; onAdd: (kind: "company" | "deal" | "ticket") => void }) {
	const add = (kind: "company" | "deal" | "ticket") => (
		<Button variant="ghost" size="xs" aria-label={`Add ${kind}`} onClick={() => onAdd(kind)}><Plus />Add</Button>
	);
	const live = deals.filter((d) => d.stage !== "Closed won");
	return (
		<section aria-label="Associations" className="grid gap-2">
			<h2 className="flex items-baseline justify-between gap-2 text-base font-semibold text-ink">Associations<span className="text-sm font-normal text-ink-3">{live.length} open deal{live.length === 1 ? "" : "s"}, {gbp.format(live.reduce((s, d) => s + d.amount, 0))}</span></h2>
			<GroupedList>
				<ListGroup title="Company" count={companies.length} action={add("company")}>
					{companies.map((co) => (
						<li key={co.name} className="grid gap-1 px-3 py-2.5">
							<div className="flex items-center gap-2"><Building2 className="size-3.5 shrink-0 text-ink-3" aria-hidden="true" /><span className="min-w-0 flex-1 truncate text-base font-medium text-ink">{co.name}</span>{co.primary && <Badge variant="default">Primary</Badge>}</div>
							<p className="pl-5.5 text-sm text-ink-2">{co.domain} · {co.industry}</p>
							<p className="pl-5.5 text-sm text-ink-2">{co.employees} employees · {co.city}</p>
						</li>
					))}
				</ListGroup>
				<ListGroup title="Deals" count={deals.length} action={add("deal")}>
					{deals.length === 0 && <li className="px-3 py-3 text-base text-ink-2">No deals yet. Add one when {firstName(c)} has a buying conversation.</li>}
					{deals.map((d) => (
						<li key={d.id} className="grid gap-1 px-3 py-2.5">
							<div className="flex items-start justify-between gap-2"><span className="min-w-0 text-base font-medium text-ink">{d.name}</span><span className="tabular shrink-0 text-base text-ink">{gbp.format(d.amount)}</span></div>
							<div className="flex flex-wrap items-center gap-2 text-sm text-ink-2"><Badge variant={d.tone} dot>{d.stage}</Badge><span>Closes <Timestamp value={d.closes} /></span><span className="font-mono text-ink-3">{d.id}</span></div>
						</li>
					))}
				</ListGroup>
				<ListGroup title="Tickets" count={tickets.length} action={add("ticket")}>
					{tickets.length === 0 && <li className="px-3 py-3 text-base text-ink-2">No tickets. {firstName(c)} has not raised anything with support.</li>}
					{tickets.map((t) => (
						<li key={t.id} className="grid gap-1 px-3 py-2.5">
							<span className="text-base font-medium text-ink">{t.subject}</span>
							<div className="flex flex-wrap items-center gap-2 text-sm text-ink-2"><Badge variant={ticketTone[t.status]} dot>{t.status}</Badge><Badge variant={priorityTone[t.priority]}>{t.priority}</Badge><span>Updated <Timestamp value={t.updated} /></span><span className="font-mono text-ink-3">{t.id}</span></div>
						</li>
					))}
				</ListGroup>
			</GroupedList>
		</section>
	);
}

/* ------------------------------------------------------------------ the screen */

export function CrmExample() {
	const now = useMemo(() => new Date(), []);
	const [idx, setIdx] = useState(0);
	const [acts, setActs] = useState(initialActivities);
	const [overrides, setOverrides] = useState<Record<string, Overrides>>({});
	const [stages, setStages] = useState<Record<string, number>>({});
	const [dealsBy, setDealsBy] = useState<Record<string, Deal[]>>(DEALS);
	const [ticketsBy, setTicketsBy] = useState<Record<string, Ticket[]>>(TICKETS);
	const [extraCo, setExtraCo] = useState<Record<string, Company[]>>({});
	const [tab, setTab] = useState("overview");
	const [assistantOpen, setAssistantOpen] = useState(false);
	const [singleKeys, setSingleKeys] = useState(true);
	const [editing, setEditing] = useState<string | null>(null);
	const [open, setOpen] = useState<Set<string>>(new Set(["ACT-310", "ACT-315"]));
	const [searchOpen, setSearchOpen] = useState(false);
	const [noteError, setNoteError] = useState<string | undefined>();
	const [note, setNote] = useState("");
	const noteRef = useRef<HTMLTextAreaElement>(null);

	const base = CONTACTS[idx];
	const c: Contact = { ...base, ...overrides[base.id], stage: stages[base.id] ?? base.stage };
	const list = acts[c.id] ?? [];
	const deals = dealsBy[c.id] ?? [];
	const tickets = ticketsBy[c.id] ?? [];
	const companies = [{ ...COMPANIES[c.id], primary: true }, ...(extraCo[c.id] ?? [])];
	const ask = useAsk(c, list, c.id);

	const go = (n: number) => { if (n < 0 || n >= CONTACTS.length) return; setIdx(n); setEditing(null); setNote(""); setNoteError(undefined); setOpen(new Set()); };
	const patchActs = (fn: (l: Act[]) => Act[]) => setActs((m) => ({ ...m, [c.id]: fn(m[c.id] ?? []) }));
	const addAct = (a: Act, message: string, description?: string) => {
		patchActs((l) => [a, ...l]);
		setOpen((o) => new Set(o).add(a.id));
		toast.success(message, { description, action: { label: "Undo", onClick: () => patchActs((l) => l.filter((x) => x.id !== a.id)) } });
	};
	const uid = () => `ACT-${Math.floor(500 + Math.random() * 4000)}`;
	const you = "Amira Haddad";

	const toggleTask = (id: string, done: boolean) => {
		const title = list.find((a) => a.id === id)?.title ?? "Task";
		patchActs((l) => l.map((a) => (a.id === id ? { ...a, done } : a)));
		toast.success(done ? "Task completed" : "Task reopened", { description: title, action: { label: "Undo", onClick: () => patchActs((l) => l.map((a) => (a.id === id ? { ...a, done: !done } : a))) } });
	};
	const setStage = (i: number, description: string) => {
		const prev = c.stage;
		const id = c.id;
		setStages((s) => ({ ...s, [id]: i }));
		toast.success(`Moved to ${STAGES[i]}`, { description, action: { label: "Undo", onClick: () => setStages((s) => ({ ...s, [id]: prev })) } });
	};
	const logNote = () => {
		if (!note.trim()) { setNoteError("Write a line about what happened before you log it."); noteRef.current?.focus(); return; }
		addAct({ id: uid(), kind: "note", title: note.trim().split("\n")[0].slice(0, 80), body: note.trim(), at: new Date(), by: you }, "Note logged", `On ${c.name}`);
		setNote(""); setNoteError(undefined);
	};
	const focusNote = () => { setTab("activities"); window.setTimeout(() => noteRef.current?.focus(), 60); };
	const addAssoc = (kind: "company" | "deal" | "ticket") => {
		const id = c.id;
		if (kind === "deal") {
			const d: Deal = { id: `D-${Math.floor(930 + Math.random() * 60)}`, name: `${c.company}, new deal`, amount: 0, stage: "Qualification", tone: "secondary", closes: at(45) };
			setDealsBy((m) => ({ ...m, [id]: [...(m[id] ?? []), d] }));
			toast.success("Deal added", { description: d.name, action: { label: "Undo", onClick: () => setDealsBy((m) => ({ ...m, [id]: (m[id] ?? []).filter((x) => x.id !== d.id) })) } });
		} else if (kind === "ticket") {
			const t: Ticket = { id: `T-${Math.floor(5700 + Math.random() * 90)}`, subject: "New ticket, no subject yet", priority: "Low", status: "Open", updated: new Date() };
			setTicketsBy((m) => ({ ...m, [id]: [t, ...(m[id] ?? [])] }));
			toast.success("Ticket added", { description: t.id, action: { label: "Undo", onClick: () => setTicketsBy((m) => ({ ...m, [id]: (m[id] ?? []).filter((x) => x.id !== t.id) })) } });
		} else {
			const word = c.company.split(" ")[0];
			const co: Company = { name: `${word} Services Ltd`, domain: `${word.toLowerCase().replace(/[^a-z]/g, "")}services.example`, industry: "Subsidiary", employees: "50 to 200", city: c.city };
			setExtraCo((m) => ({ ...m, [id]: [...(m[id] ?? []), co] }));
			toast.success("Company added", { description: co.name, action: { label: "Undo", onClick: () => setExtraCo((m) => ({ ...m, [id]: (m[id] ?? []).filter((x) => x.name !== co.name) })) } });
		}
	};
	const openCitation = (id: string) => {
		if (id.startsWith("ACT-") && list.some((a) => a.id === id)) {
			setTab("activities");
			setOpen((o) => new Set(o).add(id));
			window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "center", behavior: "smooth" }), 120);
		} else toast(`${id} is listed under Associations`);
	};
	const deleteContact = () => toast.success(`${c.name} deleted`, { description: "Deleted contacts stay in Recently deleted for 30 days.", action: { label: "Undo", onClick: () => {} } });

	const composer = (
		<form onSubmit={(e) => { e.preventDefault(); logNote(); }} noValidate className="grid gap-2 rounded-sm border border-line p-3">
			<Field className="gap-1.5" data-invalid={!!noteError || undefined}>
				<FieldLabel htmlFor="note-body">Log a note</FieldLabel>
				<Textarea ref={noteRef} id="note-body" value={note} placeholder={`What did you and ${firstName(c)} agree, and what happens next?`} aria-invalid={noteError ? true : undefined} aria-describedby={noteError ? "note-error" : undefined} onChange={(e) => { setNote(e.target.value); if (noteError && e.target.value.trim()) setNoteError(undefined); }} onKeyDown={(e) => { if (e.key === "Escape") e.currentTarget.blur(); }} />
				{noteError && <p id="note-error" role="alert" className="text-sm text-bad">{noteError}</p>}
			</Field>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<span className="text-sm text-ink-3">Visible to everyone who can see {firstName(c)}</span>
				<Button type="submit" variant="outline" size="sm" shortcut="⌘↵">Log note</Button>
			</div>
		</form>
	);

	const assistant = (
		<AssistantPanel caveat="Reads this contact, its company and logged activity, not your inbox. Check deal amounts against the quote."
			open
			onOpenChange={() => setAssistantOpen(false)}
			title={c.name}
			composer={<MessageComposer noun={{ one: "contact", many: "contacts" }} chips={[{ id: "c", label: c.name }, { id: "a", label: `${list.length} activities` }]} busy={ask.busy} onStop={ask.stop} onSend={(q) => ask.ask(q)} placeholder={`Ask about ${firstName(c)}`} />}
		>
			{ask.thread.length === 0 ? (
				<div className="grid gap-3">
					<p className="text-base text-ink-2">Ask about this record. The assistant reads the activities, deals and tickets shown here and cites what it used.</p>
					<Starters items={ASK_STARTERS} onPick={ask.ask} />
				</div>
			) : (
				ask.thread.map((t, i) => {
					const last = i === ask.thread.length - 1 && t.status === "done";
					return (
						<div key={`${t.q}-${i}`} className="grid gap-5">
							<UserMessage>{t.q}</UserMessage>
							<AssistantMessage
								from={`${firstName(c)}'s activities and deals`}
								actions={last ? <AnswerActions text={t.text} onFeedback={() => new Promise((r) => window.setTimeout(r, 400))} /> : undefined}
								followUps={last ? <FollowUps items={ASK_STARTERS.filter((s) => s !== t.q)} onPick={ask.ask} /> : undefined}
							>
								{t.status === "working" ? <p><ShimmerText>Reading activities and deals</ShimmerText></p> : <p><StreamingText text={t.text} />{t.status === "stopped" && <span className="text-ink-3"> Stopped.</span>}</p>}
							</AssistantMessage>
						</div>
					);
				})
			)}
		</AssistantPanel>
	);

	return (
		<ShortcutsProvider enabled={singleKeys}>
		<div className="h-full min-h-0">
			<ExampleShell
				className="h-example-frame"
				sidebar={
					<>
						<ExampleBrand label="CRM" />
						<SidebarSection>
							<SidebarItem label="Inbox" icon={<Inbox />} count={7} />
							<SidebarItem label="Assistant" icon={<MessageSquare />} current={assistantOpen} onClick={() => setAssistantOpen(true)} />
						</SidebarSection>
						<SidebarSection title="Records">
							<SidebarItem label="Contacts" icon={<Users />} current />
							<SidebarItem label="Companies" icon={<Building2 />} />
							<SidebarItem label="Deals" icon={<Handshake />} />
							<SidebarItem label="Tickets" icon={<LifeBuoy />} />
						</SidebarSection>
						<SidebarSection title="Insight">
							<SidebarItem label="Reports" icon={<BarChart3 />} />
						</SidebarSection>
						<SidebarSection title="Workspace"><SidebarItem label="Settings" icon={<Settings />} /></SidebarSection>
					</>
				}
				topBar={
					<>
						<Breadcrumb className="min-w-0 flex-1">
							<BreadcrumbList className="flex-nowrap overflow-hidden">
								<BreadcrumbItem className="shrink-0 max-sm:hidden"><BreadcrumbLink href="#contacts">Contacts</BreadcrumbLink></BreadcrumbItem>
								<BreadcrumbSeparator className="shrink-0 max-sm:hidden" />
								<BreadcrumbItem className="min-w-0"><BreadcrumbPage className="block truncate">{c.name}</BreadcrumbPage></BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
						<div className="flex shrink-0 items-center gap-0.5">
							<Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Previous contact" shortcut="K" disabled={idx === 0} onClick={() => go(idx - 1)}><ChevronUp /></Button></TooltipTrigger><TooltipContent>Previous contact <Kbd>K</Kbd></TooltipContent></Tooltip>
							<Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Next contact" shortcut="J" disabled={idx === CONTACTS.length - 1} onClick={() => go(idx + 1)}><ChevronDown /></Button></TooltipTrigger><TooltipContent>Next contact <Kbd>J</Kbd></TooltipContent></Tooltip>
							{!assistantOpen && <span className="tabular px-1 text-sm text-ink-3 max-sm:hidden">{idx + 1} of {CONTACTS.length}</span>}
						</div>
						<Button variant="outline" size="sm" shortcut="⌘K" onClick={() => setSearchOpen(true)} aria-label="Search records"><Search />{!assistantOpen && <span className="max-md:hidden">Search records</span>}</Button>
						<Button variant="ghost" size="sm" shortcut="⌘J" onClick={() => setAssistantOpen(true)}>Ask</Button>
					</>
				}
				panel={assistantOpen ? assistant : null}
			>
				<div className="@container h-full">
					<div className="grid @2xl:grid-cols-[320px_minmax(0,1fr)] @6xl:h-full @6xl:grid-cols-[320px_minmax(0,1fr)_340px] @6xl:grid-rows-[minmax(0,1fr)]">
						<aside aria-label="Contact profile" className="min-w-0 border-b border-line @2xl:row-span-2 @2xl:border-r @2xl:border-b-0 @6xl:row-span-1 @6xl:overflow-y-auto">
							<ProfileColumn
								c={c}
								editing={editing}
								setEditing={setEditing}
								deals={deals}
								onDelete={deleteContact}
								onOverride={(o) => setOverrides((m) => ({ ...m, [c.id]: { ...m[c.id], ...o } }))}
								quick={{
									note: focusNote,
									email: () => addAct({ id: uid(), kind: "email", title: `Following up, ${firstName(c)}`, body: "Draft saved to send later.", at: new Date(), by: you, draft: true }, "Email draft created", "Find it under Activities"),
									call: () => addAct({ id: uid(), kind: "call", title: `Call with ${firstName(c)}`, body: "Add the outcome once the call ends.", at: new Date(), by: you, outcome: "Connected", duration: "0 min" }, "Call started", c.phone),
									task: () => addAct({ id: uid(), kind: "task", title: `Follow up with ${firstName(c)}`, at: at(1, 10), by: you, done: false }, "Task created", "Due tomorrow at 10:00"),
									meeting: () => addAct({ id: uid(), kind: "meeting", title: `Catch-up with ${firstName(c)}`, at: at(7, 14), by: you, attendees: [c.name, you], duration: "30 min" }, "Meeting scheduled", "Next week at 14:00"),
								}}
							/>
						</aside>
						<section aria-label="Contact record" className="min-w-0 @6xl:overflow-y-auto">
							<StagePath stage={c.stage} onForward={(i) => setStage(i, `${c.name} is now ${STAGES[i].toLowerCase()}`)} onBack={(i, r) => setStage(i, r)} />
							<Tabs value={tab} onValueChange={setTab} className="gap-0">
								<div className="px-4"><TabsList aria-label="Record sections"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="activities" count={list.length}>Activities</TabsTrigger><TabsTrigger value="intelligence">Intelligence</TabsTrigger></TabsList></div>
								<div className="p-4">
									<TabsContent value="overview"><OverviewTab c={c} acts={list} now={now} goActivities={() => setTab("activities")} /></TabsContent>
									<TabsContent value="activities"><ActivitiesTab acts={list} now={now} open={open} setOpen={setOpen} onToggleTask={toggleTask} composer={composer} /></TabsContent>
									<TabsContent value="intelligence">
										<IntelligenceTab
											c={c}
											onApply={(ids) => {
												const made: Act[] = ids.map((id) => ({ id: uid(), kind: "task", title: id === "t1" ? `Ask ${firstName(c)} to bring the COO on Thursday` : "Name a security contact for the vendor review", at: id === "t1" ? at(2, 12) : at(0, 17), by: id === "t1" ? you : c.owner, done: false }));
												patchActs((l) => [...made, ...l]);
												toast.success(`Created ${made.length} task${made.length === 1 ? "" : "s"}`, { action: { label: "Undo", onClick: () => patchActs((l) => l.filter((a) => !made.some((m) => m.id === a.id))) } });
											}}
										/>
									</TabsContent>
								</div>
							</Tabs>
						</section>
						<aside aria-label="Summary and associations" className="min-w-0 border-t border-line @2xl:col-start-2 @6xl:col-start-3 @6xl:overflow-y-auto @6xl:border-t-0 @6xl:border-l">
							<div className="grid content-start gap-4 p-4">
								<SummaryCard key={c.id} c={c} deals={deals} acts={list} onAsk={() => setAssistantOpen(true)} onCite={openCitation} />
								<Associations c={c} companies={companies} deals={deals} tickets={tickets} onAdd={addAssoc} />
							</div>
						</aside>
					</div>
				</div>
			</ExampleShell>

			<CommandDialog open={searchOpen} onOpenChange={setSearchOpen} title="Search records" description="Jump to a contact">
				<CommandInput placeholder="Search contacts by name or company" />
				<CommandList>
					<CommandEmpty>No contacts match. Try a company name.</CommandEmpty>
					<CommandGroup heading="Contacts">
						{CONTACTS.map((k, n) => (
							<CommandItem key={k.id} value={`${k.name} ${k.company}`} onSelect={() => { go(n); setSearchOpen(false); }}>
								<PersonAvatar name={k.name} size="sm" /><span className="truncate">{k.name}</span><span className="ml-auto truncate text-sm text-ink-3">{k.company}</span>
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>

			<ShortcutSheet
				singleKeys={singleKeys}
				onSingleKeysChange={setSingleKeys}
				groups={[
					{ title: "Records", items: [{ keys: ["J"], action: "Next contact" }, { keys: ["K"], action: "Previous contact" }, { keys: ["⌘", "K"], action: "Search records" }] },
					{ title: "Act", items: [{ keys: ["N"], action: "New note" }, { keys: ["E"], action: "Edit details" }, { keys: ["⇧", "T"], action: "Create task" }, { keys: ["⇧", "C"], action: "Log call" }, { keys: ["⇧", "E"], action: "Draft email" }, { keys: ["⇧", "M"], action: "Schedule meeting" }, { keys: ["⌘", "↵"], action: "Log note" }, { keys: ["⌘", "J"], action: "Ask the assistant" }] },
				]}
			/>
		</div>
		</ShortcutsProvider>
	);
}
