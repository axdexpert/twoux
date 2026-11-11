import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Badge,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	ChangeRequest,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	type Connector,
	ConnectDialog,
	ConnectorPicker,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	FeatureLabel,
	Field,
	FieldLabel,
	FileDrop,
	MessageComposer,
	OnboardingStep,
	PageHeader,
	PersonAvatar,
	PROVIDERS,
	ProviderLogo,
	type ProviderId,
	RadioGroup,
	RadioGroupItem,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SetupChecklist,
	SidebarItem,
	SidebarSection,
	SidePanel,
	SignInOptions,
	SwitchField,
	type Template,
	TemplatesGallery,
	Textarea,
	TextField,
	Timestamp,
	toast,
	UsageMeter,
} from "@twoux/ui";
import { Bot, Check, ChevronRight, CircleHelp, Gauge, Home, ListTodo, Plug, Plus, Settings, Table2, Workflow, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ABILITIES, AGENTS, type Agent, type AgentSettings, CONNECTORS, GOOGLE_DOMAIN, INITIAL_SETTINGS, META, MODELS, POOLS, SSO_DOMAINS, TEMPLATES, UPDATES, USE_CASES } from "./onboarding/data";
import { ExampleShell, RailSwap } from "../../components/example-shell";
import { ExampleBrand } from "../../components/example-brand";
import { TwoUXLogo } from "../../components/twoux-logo";

type Screen = "signin" | "steps" | "home";
type Invite = { email: string; role: string };
type Profile = { first: string; last: string; photo: string };
const TOTAL = 5;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/* ---------------------------------------------------------------- frame */

function Restart({ onClick }: { onClick: () => void }) {
	return (
		<Button variant="link" size="xs" onClick={onClick}>
			Restart example
		</Button>
	);
}

/** A plain full-height page for the screens before the workspace: sign in and set-up steps. */
function Stage({ onRestart, children }: { onRestart: () => void; children: React.ReactNode }) {
	return (
		<div className="relative h-example-frame bg-bg">
			<div className="absolute top-2 right-4 z-10 flex h-7 items-center">
				<Restart onClick={onRestart} />
			</div>
			<TwoUXLogo className="absolute top-3 left-4 z-10 h-4" />
			<div className="flex h-full overflow-y-auto px-4 py-14">
				<div className="m-auto flex w-full justify-center">{children}</div>
			</div>
		</div>
	);
}

/* ---------------------------------------------------------------- 1. sign in */

function SignIn({ onDone, onRestart }: { onDone: () => void; onRestart: () => void }) {
	const [busy, setBusy] = useState<ProviderId | "email" | "sso" | undefined>();
	const [error, setError] = useState<string | undefined>();
	const timer = useRef<number>(0);
	useEffect(() => () => window.clearTimeout(timer.current), []);
	// Simulated: a real product waits for the provider or the emailed link.
	const go = (how: ProviderId | "email" | "sso") => {
		setError(undefined);
		setBusy(how);
		timer.current = window.setTimeout(onDone, 1100);
	};
	return (
		<Stage onRestart={onRestart}>
			<div className="grid w-full max-w-sm gap-4">
				<Card>
					<CardHeader>
						<CardTitle level={1} className="text-xl">Sign in to TwoUX</CardTitle>
						<CardDescription>Use the account your team already has.</CardDescription>
					</CardHeader>
					<CardContent>
						<SignInOptions
							ssoDomains={SSO_DOMAINS}
							busy={busy}
							error={error}
							onProvider={go}
							onSso={() => go("sso")}
							onEmail={(email) => {
								if (email.toLowerCase().endsWith(`@${GOOGLE_DOMAIN}`)) setError("This email uses Google to sign in. Continue with Google instead.");
								else go("email");
							}}
						/>
					</CardContent>
				</Card>
				<p className="text-center text-sm text-ink-3">
					By continuing you agree to the{" "}
					<a href="#terms" className="font-medium text-primary-ink hover:underline">Terms</a> and the{" "}
					<a href="#privacy" className="font-medium text-primary-ink hover:underline">Privacy policy</a>.
				</p>
				<p className="text-center text-sm text-ink-3">Example: try sam@twoux.example for single sign-on, or priya@{GOOGLE_DOMAIN} to see the Google message.</p>
			</div>
		</Stage>
	);
}

/* ---------------------------------------------------------------- 2. steps */

function StepProfile({ profile, setProfile, onPhoto, onNext }: { profile: Profile; setProfile: (p: Profile) => void; onPhoto: (f: File | null) => void; onNext: () => void }) {
	const [errors, setErrors] = useState<{ first?: string; last?: string }>({});
	const cont = () => {
		const e = { first: profile.first.trim() ? undefined : "Enter your first name.", last: profile.last.trim() ? undefined : "Enter your last name." };
		setErrors(e);
		const bad = e.first ? "profile-first" : e.last ? "profile-last" : undefined;
		if (bad) { requestAnimationFrame(() => document.getElementById(bad)?.focus()); return; }
		onNext();
	};
	return (
		<OnboardingStep step={1} total={TOTAL} title="Tell us who you are" description="Your name appears on agents you create and on changes you approve." onContinue={cont}>
			<div className="grid gap-4">
				<div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
					<TextField id="profile-first" label="First name" autoComplete="given-name" value={profile.first} error={errors.first} onChange={(e) => { setProfile({ ...profile, first: e.target.value }); setErrors((x) => ({ ...x, first: undefined })); }} />
					<TextField id="profile-last" label="Last name" autoComplete="family-name" value={profile.last} error={errors.last} onChange={(e) => { setProfile({ ...profile, last: e.target.value }); setErrors((x) => ({ ...x, last: undefined })); }} />
				</div>
				<FileDrop id="profile-photo" label="Profile picture (optional)" accept="image/png,image/jpeg" hint="PNG or JPEG, up to 10 MB" maxBytes={10e6} preview={profile.photo || undefined} onFile={(f) => onPhoto(f)} onRemove={() => onPhoto(null)} />
			</div>
		</OnboardingStep>
	);
}

function StepUse({ value, onChange, onBack, onNext, onSkip }: { value: string; onChange: (v: string) => void; onBack: () => void; onNext: () => void; onSkip: () => void }) {
	return (
		<OnboardingStep step={2} total={TOTAL} title="What will you use TwoUX for?" description="Used to suggest templates. You can change it later." optional onBack={onBack} onSkip={onSkip} onContinue={onNext}>
			<RadioGroup value={value} onValueChange={onChange} aria-label="What you will use TwoUX for" className="grid-cols-2 gap-2 max-sm:grid-cols-1">
				{USE_CASES.map((u) => (
					<label key={u.id} htmlFor={`use-${u.id}`} className={`flex h-row cursor-pointer items-center gap-2.5 rounded-sm border border-line px-3 text-base text-ink ${value === u.id ? "bg-selected" : "hover:bg-hover"}`}>
						<RadioGroupItem id={`use-${u.id}`} value={u.id} />
						<u.icon className="size-3.5 text-ink-3" aria-hidden="true" />
						{u.label}
					</label>
				))}
			</RadioGroup>
		</OnboardingStep>
	);
}

function ConnectorAside({ c }: { c?: Connector }) {
	if (!c)
		return (
			<div className="grid content-start gap-2">
				<h2 className="text-md font-semibold text-ink">What a connection adds</h2>
				<p className="text-base text-ink-2">Point at a service to see what it lets TwoUX do. Nothing is shared until you connect it, and each connection says who can use it.</p>
			</div>
		);
	const name = PROVIDERS[c.provider].label;
	return (
		<div className="grid content-start gap-3">
			<h2 className="flex items-center gap-2.5 text-md font-semibold text-ink"><ProviderLogo provider={c.provider} size="lg" />{name}</h2>
			{c.connected && <div><Badge variant={c.problem ? "warning" : "success"} dot>{c.problem ? "Needs attention" : "Connected"}</Badge></div>}
			<div className="grid gap-1.5">
				<h3 className="text-sm font-medium text-ink-2">Connecting {name} lets TwoUX</h3>
				<ul className="grid gap-1.5 text-base text-ink">
					{c.can.map((x) => <li key={x} className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-ok" aria-hidden="true" />{x}</li>)}
				</ul>
			</div>
			<p className="text-sm text-ink-2">Shared with: {META[c.id].scope}. Changes that reach other people always wait for your approval.</p>
		</div>
	);
}

function StepConnect({ connectors, onConnected, onBack, onNext }: { connectors: Connector[]; onConnected: (id: string) => void; onBack: () => void; onNext: () => void }) {
	const [sel, setSel] = useState<string>();
	const [dlg, setDlg] = useState<Connector | null>(null);
	const [open, setOpen] = useState(false);
	const pick = (e: React.SyntheticEvent) => {
		const text = (e.target as HTMLElement).closest("li")?.textContent;
		if (!text) return;
		const hit = connectors.filter((c) => text.startsWith(PROVIDERS[c.provider].label)).sort((a, b) => PROVIDERS[b.provider].label.length - PROVIDERS[a.provider].label.length)[0];
		if (hit) setSel(hit.id);
	};
	const current = connectors.find((c) => c.id === sel);
	return (
		<>
			<OnboardingStep step={3} total={TOTAL} title="Connect your tools" description="Agents can only use the services you connect. You can add more later." onBack={onBack} onContinue={onNext} aside={<ConnectorAside c={current} />}>
				<div className="max-h-80 overflow-y-auto pr-1" onMouseOver={pick} onFocus={pick}>
					<ConnectorPicker connectors={connectors} onConnect={(c) => { setSel(c.id); setDlg(c); setOpen(true); }} />
				</div>
			</OnboardingStep>
			<ConnectDialog product="TwoUX"
				connector={dlg}
				open={open}
				onOpenChange={setOpen}
				method={dlg ? META[dlg.id].method : "oauth"}
				scope={dlg ? META[dlg.id].scope : undefined}
				onAuthorise={() => wait(1600)}
				onTestKey={async (key) => {
					await wait(900);
					return key.startsWith("pat-") ? undefined : "That doesn't look like a HubSpot private app token. It should start with pat-. Copy it from Settings, Integrations, Private apps in HubSpot.";
				}}
				onDone={() => dlg && onConnected(dlg.id)}
			/>
		</>
	);
}

function StepInvite({ invites, setInvites, onBack, onNext }: { invites: Invite[]; setInvites: (i: Invite[]) => void; onBack: () => void; onNext: () => void }) {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("Member");
	const [error, setError] = useState("");
	/** Returns the new list when the field is valid, otherwise shows the error and returns undefined. */
	const add = (): Invite[] | undefined => {
		const parts = email.split(/[,;\s]+/).filter(Boolean);
		if (!parts.length) { setError("Enter an email address, for example priya@twoux.example."); return; }
		const bad = parts.filter((p) => !EMAIL.test(p));
		if (bad.length) { setError(`${bad.join(", ")} ${bad.length === 1 ? "isn't" : "aren't"} a valid email address. Check for a missing @ or domain.`); return; }
		const fresh = parts.filter((p, i) => parts.indexOf(p) === i && !invites.some((x) => x.email.toLowerCase() === p.toLowerCase()));
		if (!fresh.length) { setError("That person is already on the list."); return; }
		const next = [...invites, ...fresh.map((p) => ({ email: p, role }))];
		setInvites(next);
		setEmail("");
		setError("");
		return next;
	};
	const n = invites.length;
	return (
		<OnboardingStep
			step={4}
			total={TOTAL}
			title="Invite your team"
			description="People you invite can see the agents and connections you share with the workspace. Admins can also change settings."
			optional
			onBack={onBack}
			onSkip={() => { setInvites([]); onNext(); }}
			continueLabel={n ? `Send ${n} ${n === 1 ? "invite" : "invites"}` : "Continue"}
			onContinue={() => { if (email.trim() && !add()) return; onNext(); }}
		>
			<div className="grid gap-4">
				<div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-start gap-2 max-sm:grid-cols-[minmax(0,1fr)_auto]">
					<TextField id="invite-email" label="Email address" type="email" autoComplete="off" hint="Paste several addresses to add them together." value={email} error={error} onChange={(e) => { setEmail(e.target.value); setError(""); }} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} className="max-sm:col-span-2" />
					<Field className="gap-1.5">
						<FieldLabel htmlFor="invite-role">Role</FieldLabel>
						<Select value={role} onValueChange={setRole}>
							<SelectTrigger id="invite-role" className="w-28"><SelectValue /></SelectTrigger>
							<SelectContent><SelectItem value="Admin">Admin</SelectItem><SelectItem value="Member">Member</SelectItem></SelectContent>
						</Select>
					</Field>
					<Button variant="outline" className="mt-6" onClick={add}><Plus />Add</Button>
				</div>
				{n > 0 && (
					<ul aria-label="People to invite" className="divide-y divide-line rounded-sm border border-line">
						{invites.map((p, i) => (
							<li key={p.email} className="flex items-center gap-2 px-3 py-1.5">
								<PersonAvatar name={p.email.split("@")[0].replace(/[._]/g, " ")} size="sm" />
								<span className="min-w-0 flex-1 truncate text-base text-ink">{p.email}</span>
								<Select value={p.role} onValueChange={(v) => setInvites(invites.map((x, j) => (j === i ? { ...x, role: v } : x)))}>
									<SelectTrigger aria-label={`Role for ${p.email}`} className="w-28"><SelectValue /></SelectTrigger>
									<SelectContent><SelectItem value="Admin">Admin</SelectItem><SelectItem value="Member">Member</SelectItem></SelectContent>
								</Select>
								<Button variant="ghost" size="icon-sm" aria-label={`Remove ${p.email}`} onClick={() => setInvites(invites.filter((_, j) => j !== i))}><X /></Button>
							</li>
						))}
					</ul>
				)}
			</div>
		</OnboardingStep>
	);
}

function StepDone({ profile, useCase, connectors, invites, onBack, onNext }: { profile: Profile; useCase: string; connectors: Connector[]; invites: Invite[]; onBack: () => void; onNext: () => void }) {
	const on = connectors.filter((c) => c.connected);
	const broken = on.filter((c) => c.problem);
	const row = "grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 px-3 py-2.5 text-base";
	return (
		<OnboardingStep step={5} total={TOTAL} title="You're all set" description="Here is what is ready. You can change any of it later in Settings." onBack={onBack} onContinue={onNext} continueLabel="Go to TwoUX">
			<dl className="grid divide-y divide-line rounded-sm border border-line">
				<div className={row}>
					<dt className="text-ink-2">Profile</dt>
					<dd className="flex items-center gap-2 text-ink"><PersonAvatar name={`${profile.first} ${profile.last}`} src={profile.photo || undefined} size="sm" />{profile.first} {profile.last}</dd>
				</div>
				<div className={row}>
					<dt className="text-ink-2">Used for</dt>
					<dd className="text-ink">{USE_CASES.find((u) => u.id === useCase)?.label ?? <span className="text-ink-2">Not set. Templates will not be tailored yet.</span>}</dd>
				</div>
				<div className={row}>
					<dt className="text-ink-2">Connected</dt>
					<dd className="grid gap-1.5 text-ink">
						<span className="flex items-center gap-2">
							<span className="flex -space-x-1">{on.slice(0, 6).map((c) => <ProviderLogo key={c.id} provider={c.provider} size="sm" className="ring-2 ring-surface" />)}</span>
							{on.length} {on.length === 1 ? "tool" : "tools"}
						</span>
						{broken.map((c) => <span key={c.id} className="text-sm text-warn">{PROVIDERS[c.provider].label} needs reconnecting.</span>)}
					</dd>
				</div>
				<div className={row}>
					<dt className="text-ink-2">Invited</dt>
					<dd className="text-ink">{invites.length ? `${invites.length} ${invites.length === 1 ? "person" : "people"}: ${invites.map((i) => i.email).join(", ")}` : <span className="text-ink-2">No one yet. You can invite people from Settings.</span>}</dd>
				</div>
			</dl>
		</OnboardingStep>
	);
}

/* ---------------------------------------------------------------- 4. agent settings */

function Section({ title, count, extra, children }: { title: string; count?: React.ReactNode; extra?: React.ReactNode; children: React.ReactNode }) {
	const [open, setOpen] = useState(true);
	return (
		<Collapsible open={open} onOpenChange={setOpen} className="border-b border-line py-1.5">
			<CollapsibleTrigger asChild>
				<Button variant="ghost" size="sm" className="w-full justify-start">
					<ChevronRight className={`text-ink-3 transition-transform duration-(--duration-fast) ${open ? "rotate-90" : ""}`} aria-hidden="true" />
					<span className="font-medium">{title}</span>
					{count !== undefined && <span className="tabular text-sm font-normal text-ink-3">{count}</span>}
					<span className="flex-1" />
					{extra}
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="grid grid-cols-[minmax(0,1fr)] gap-3 px-2 pt-2 pb-2">{children}</CollapsibleContent>
		</Collapsible>
	);
}

function ListEditor({ items, pool, noun, onAdd, onRemove, render }: { items: string[]; pool: string[]; noun: string; onAdd: (v: string) => void; onRemove: (v: string) => void; render?: (v: string) => React.ReactNode }) {
	const left = pool.filter((p) => !items.includes(p));
	return (
		<div className="grid gap-2">
			{items.length === 0 && <p className="text-base text-ink-2">No {noun}s yet. Add one so the agent knows what to use.</p>}
			{items.length > 0 && (
				<ul className="divide-y divide-line rounded-sm border border-line">
					{items.map((v) => (
						<li key={v} className="flex items-center gap-2 py-1 pr-1 pl-3 text-base text-ink">
							<span className="flex min-w-0 flex-1 items-center gap-2"><span className="truncate">{render ? render(v) : v}</span></span>
							<Button variant="ghost" size="icon-xs" aria-label={`Remove ${v}`} onClick={() => onRemove(v)}><X /></Button>
						</li>
					))}
				</ul>
			)}
			<div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild><Button variant="outline" size="sm"><Plus />Add {noun}</Button></DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						{left.length ? left.map((v) => <DropdownMenuItem key={v} onSelect={() => onAdd(v)}>{render ? render(v) : v}</DropdownMenuItem>) : <DropdownMenuItem disabled>Nothing left to add</DropdownMenuItem>}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}

const FORM_KEYS = ["model", "instructions", "triggers", "connectors", "skills", "knowledge"] as const;
const formOf = (s: AgentSettings) => JSON.stringify(FORM_KEYS.map((k) => s[k]));
const provLabel = (v: string) => (
	<span className="flex items-center gap-2"><ProviderLogo provider={v as ProviderId} size="sm" />{PROVIDERS[v as ProviderId].label}</span>
);

function AgentPanel({ agent, saved, userName, onSave, onLive, onDirty, onClose }: { agent: Agent; saved: AgentSettings; userName: string; onSave: (s: AgentSettings) => void; onLive: (u: (s: AgentSettings) => AgentSettings) => void; onDirty: (d: boolean) => void; onClose: () => void }) {
	const [draft, setDraft] = useState(saved);
	const [example, setExample] = useState(false);
	const [decision, setDecision] = useState<{ state: "approved" | "rejected"; by: string }>();
	const dirty = formOf(draft) !== formOf(saved);
	useEffect(() => { onDirty(dirty); }, [dirty, onDirty]);
	useEffect(() => () => onDirty(false), [onDirty]);

	const patch = (p: Partial<AgentSettings>) => setDraft((d) => ({ ...d, ...p }));
	/** Switches apply at once and offer Undo; the rest of the panel waits for Save. */
	const live = (update: (s: AgentSettings) => AgentSettings, undo: (s: AgentSettings) => AgentSettings, message: string) => {
		setDraft(update);
		onLive(update);
		toast.success(message, { action: { label: "Undo", onClick: () => { setDraft(undo); onLive(undo); } } });
	};
	const list = (key: "triggers" | "skills" | "knowledge", noun: string) => (
		<ListEditor items={draft[key]} pool={POOLS[key]} noun={noun} onAdd={(v) => patch({ [key]: [...draft[key], v] })} onRemove={(v) => patch({ [key]: draft[key].filter((x) => x !== v) })} />
	);
	const abilitiesOn = ABILITIES.filter((a) => draft.abilities[a.id]).length;

	return (
		<SidePanel
			open
			onOpenChange={(o) => !o && onClose()}
			label="Agent settings"
			title={agent.name}
			meta={<span>{agent.does}</span>}
			footer={
				<>
					{dirty ? <span role="status" className="mr-auto self-center text-sm text-warn">Unsaved changes</span> : <span className="mr-auto self-center text-sm text-ink-3">Switches apply at once. The rest needs Save.</span>}
					<Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
					<Button size="sm" onClick={() => { if (!dirty) { toast("No changes to save"); return; } onSave(draft); toast.success("Settings saved", { description: `${agent.name} uses them from its next run.` }); }}>Save changes</Button>
				</>
			}
		>
			<Section title="Model" extra={<span className="text-sm font-normal text-ink-3">{draft.model}</span>}>
				<Field className="gap-1.5">
					<FieldLabel htmlFor="agent-model">Model</FieldLabel>
					<Select value={draft.model} onValueChange={(v) => patch({ model: v })}>
						<SelectTrigger id="agent-model" className="w-full"><SelectValue /></SelectTrigger>
						<SelectContent>{MODELS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
					</Select>
				</Field>
			</Section>
			<Section title="Instructions">
				<Field className="gap-1.5">
					<FieldLabel htmlFor="agent-instructions">What this agent should do</FieldLabel>
					<Textarea id="agent-instructions" rows={6} value={draft.instructions} onChange={(e) => patch({ instructions: e.target.value })} />
				</Field>
			</Section>
			<Section title="Self-updates">
				<SwitchField id="self-updates" label="Allow self-updates" hint="Updates still arrive as change requests for you to approve" checked={draft.selfUpdates} onCheckedChange={(v) => live((s) => ({ ...s, selfUpdates: v }), (s) => ({ ...s, selfUpdates: !v }), `Self-updates ${v ? "allowed" : "off"}`)} />
				<div>
					<Button variant="link" size="sm" aria-expanded={example} onClick={() => setExample((x) => !x)}>{example ? "Hide the example change request" : "See an example change request"}</Button>
				</div>
				{example && (
					<ChangeRequest
						className="grid-cols-[minmax(0,1fr)]"
						title="Add an answer for damaged parcels"
						reason="Nine customers this week wrote about damaged parcels, and the instructions have nothing to say about them."
						from="9 conversations this week"
						files={[{ path: "instructions.md", lines: [{ type: "ctx", text: "Never promise a refund." }, { type: "add", text: "If a parcel is damaged, offer a replacement." }] }]}
						simulation={{ suite: "Golden set, 120 conversations", cases: [{ name: "Damaged parcel, asks for a refund", status: "fixed" }, { name: "Late delivery, no refund promised", status: "pass" }, { name: "Invoice dispute", status: "pass" }] }}
						state={decision?.state}
						decidedBy={decision?.by}
						onApprove={() => { setDecision({ state: "approved", by: `Approved by ${userName}. It applies from the next run.` }); toast.success("Change approved"); }}
						onReject={(why) => setDecision({ state: "rejected", by: `Rejected by ${userName}: ${why}` })}
					/>
				)}
			</Section>
			<Section title="Triggers" count={draft.triggers.length}>{list("triggers", "trigger")}</Section>
			<Section title="Connectors" count={draft.connectors.length} extra={<span className="flex -space-x-1">{draft.connectors.map((c) => <ProviderLogo key={c} provider={c} size="sm" className="ring-2 ring-surface" />)}</span>}>
				<ListEditor items={draft.connectors} pool={POOLS.connectors} noun="connector" render={provLabel} onAdd={(v) => patch({ connectors: [...draft.connectors, v as ProviderId] })} onRemove={(v) => patch({ connectors: draft.connectors.filter((x) => x !== v) })} />
			</Section>
			<Section title="Skills" count={draft.skills.length}>{list("skills", "skill")}</Section>
			<Section title="Knowledge" count={draft.knowledge.length}>{list("knowledge", "source")}</Section>
			<Section title="Abilities" count={`${abilitiesOn} of ${ABILITIES.length} on`}>
				<div className="grid gap-3">
					{ABILITIES.map((a) => (
						<SwitchField key={a.id} id={`ability-${a.id}`} label={a.label} hint={a.scope} checked={!!draft.abilities[a.id]} onCheckedChange={(v) => live((s) => ({ ...s, abilities: { ...s.abilities, [a.id]: v } }), (s) => ({ ...s, abilities: { ...s.abilities, [a.id]: !v } }), `${a.label} ${v ? "on" : "off"}`)} />
					))}
				</div>
			</Section>
		</SidePanel>
	);
}

/* ---------------------------------------------------------------- 3. workspace home */

type Panel = { kind: "news" } | { kind: "agent"; id: string } | null;
const PREFERRED: Record<string, string> = { sales: "Sales", support: "Support", recruiting: "Recruiting", finance: "Finance", operations: "Operations" };

function AgentList({ onConfigure }: { onConfigure: (id: string) => void }) {
	return (
		<ul className="divide-y divide-line rounded-sm border border-line">
			{AGENTS.map((a) => (
				<li key={a.id} className="flex items-center gap-3 px-3 py-2">
					<Bot className="size-3.5 shrink-0 text-ink-3" aria-hidden="true" />
					<span className="grid min-w-0 flex-1"><span className="truncate text-base font-medium text-ink">{a.name}</span><span className="truncate text-sm text-ink-2">{a.does}</span></span>
					<Badge variant="success" dot>{a.status}</Badge>
					<Button variant="outline" size="sm" onClick={() => onConfigure(a.id)}>Configure<span className="sr-only"> {a.name}</span></Button>
				</li>
			))}
		</ul>
	);
}

function WorkspaceHome({ profile, useCase, connectors, invites, onStep, onRestart }: { profile: Profile; useCase: string; connectors: Connector[]; invites: Invite[]; onStep: (n: number) => void; onRestart: () => void }) {
	const [view, setView] = useState<"home" | "agents">("home");
	const [panel, setPanel] = useState<Panel>(null);
	const [pending, setPending] = useState<{ next: Panel } | null>(null);
	const [dirty, setDirty] = useState(false);
	const [saved, setSaved] = useState(INITIAL_SETTINGS);
	const [hideTemplates, setHideTemplates] = useState(false);
	const [hideChecklist, setHideChecklist] = useState(false);
	const [gallery, setGallery] = useState(false);
	const userName = `${profile.first} ${profile.last}`;

	// Ask only while the form is dirty, and register the browser prompt only then.
	useEffect(() => {
		if (!dirty) return;
		const h = (e: BeforeUnloadEvent) => e.preventDefault();
		window.addEventListener("beforeunload", h);
		return () => window.removeEventListener("beforeunload", h);
	}, [dirty]);

	const go = (next: Panel) => {
		const leaving = panel?.kind === "agent" && !(next?.kind === "agent" && next.id === panel.id);
		if (leaving && dirty) { setPending({ next }); return; }
		setPanel(next);
	};
	const agent = panel?.kind === "agent" ? AGENTS.find((a) => a.id === panel.id) : undefined;
	const elsewhere = (label: string) => toast(`${label} is not part of this example.`);

	const connected = connectors.filter((c) => c.connected);
	const slack = connectors.find((c) => c.id === "slack");
	const added = connected.filter((c) => !CONNECTORS.find((o) => o.id === c.id)?.connected).length;
	const checklist = [
		{ id: "photo", label: "Add a profile photo", done: !!profile.photo, onStart: () => onStep(1) },
		{ id: "use", label: "Say what you use it for", done: !!useCase, onStart: () => onStep(2) },
		{ id: "slack", label: "Reconnect Slack", done: !slack?.problem, onStart: () => onStep(3) },
		{ id: "tool", label: "Connect another tool", done: added > 0, onStart: () => onStep(3) },
		{ id: "team", label: "Invite your team", done: invites.length > 0, onStart: () => onStep(4) },
	];
	const pref = PREFERRED[useCase];
	const templates: Template[] = [...TEMPLATES].sort((a, b) => Number(b.category === pref) - Number(a.category === pref));
	const useTemplate = (t: Template) => { setGallery(false); toast.success("Draft agent created", { description: `${t.name} is ready to review. It does not run until you approve it.` }); };

	const sidebar = (
		<>
			<ExampleBrand />
			<SidebarSection>
				<SidebarItem label="Home" icon={<Home />} current={view === "home"} onClick={() => setView("home")} />
				<SidebarItem label="Agents" icon={<Bot />} current={view === "agents"} onClick={() => setView("agents")} />
				<SidebarItem label="Tables" icon={<Table2 />} tag="Beta" onClick={() => elsewhere("Tables")} />
				<SidebarItem label="Automations" icon={<Workflow />} tag="New" onClick={() => elsewhere("Automations")} />
			</SidebarSection>
			<SidebarSection title="Workspace">
				<SidebarItem label="Connections" icon={<Plug />} count={connected.length} onClick={() => elsewhere("Connections")} />
				<SidebarItem label="Settings" icon={<Settings />} onClick={() => elsewhere("Settings")} />
			</SidebarSection>
			<div className="mt-auto grid gap-4">
				{!hideChecklist && <RailSwap icon={<ListTodo />} label={`Get set up, ${checklist.filter((c) => c.done).length} of ${checklist.length}`}><SetupChecklist items={checklist} onDismiss={() => { setHideChecklist(true); toast("Setup checklist hidden", { action: { label: "Undo", onClick: () => setHideChecklist(false) } }); }} /></RailSwap>}
				<RailSwap icon={<Gauge />} label="Credits, 82% used"><UsageMeter className="px-2 pb-1" used={16400} limit={20000} unit="credits" resets="1 Dec" atLimit="Agents pause until 1 Dec" onDetails={() => elsewhere("Usage details")} onUpgrade={() => elsewhere("Adding credits")} /></RailSwap>
			</div>
		</>
	);

	const topBar = (
		<>
			<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>{view === "home" ? "Home" : "Agents"}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
			<span className="flex-1" />
			<DropdownMenu>
				<DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><CircleHelp />Help</Button></DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onSelect={() => go({ kind: "news" })}>What's new</DropdownMenuItem>
					<DropdownMenuItem onSelect={() => elsewhere("The help centre")}>Help centre</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={() => elsewhere("Contacting support")}>Contact support</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<Restart onClick={onRestart} />
		</>
	);

	const news = (
		<SidePanel open onOpenChange={(o) => !o && go(null)} label="What's new" title="What's new" meta="Product updates, newest first">
			<ul className="grid gap-5 pt-1">
				{UPDATES.map((u) => (
					<li key={u.id} className="grid gap-1.5 border-b border-line pb-5 last:border-b-0">
						<h3 className="flex items-center gap-1.5 text-md font-semibold text-ink">{u.title}<FeatureLabel kind={u.isNew ? "New" : "Beta"} /></h3>
						<Timestamp value={u.date} format="absolute" className="text-sm" />
						<p className="text-base text-ink-2">{u.body}</p>
						<div><Button variant="link" size="sm" onClick={() => elsewhere("The help centre")}>{u.link}</Button></div>
					</li>
				))}
			</ul>
		</SidePanel>
	);

	const sidePanel = panel?.kind === "news" ? news : agent ? (
		<AgentPanel key={agent.id} agent={agent} saved={saved[agent.id]} userName={userName} onDirty={setDirty} onClose={() => go(null)} onSave={(s) => setSaved((p) => ({ ...p, [agent.id]: s }))} onLive={(u) => setSaved((p) => ({ ...p, [agent.id]: u(p[agent.id]) }))} />
	) : null;

	return (
		<div className="h-full min-h-0">
			<ExampleShell className="h-example-frame" sidebar={sidebar} topBar={topBar} panel={sidePanel}>
				{view === "home" ? (
					<>
						<PageHeader title={`Good morning, ${profile.first}`} actions={<Button variant="outline" size="sm" onClick={() => setGallery(true)}>Browse templates</Button>} />
						<div className="grid max-w-3xl gap-6 px-6 pb-8 max-md:px-4">
							<MessageComposer noun={{ one: "file", many: "files" }} placeholder="Ask or start an agent" onSend={(t) => toast.success("Draft agent created", { description: `“${t}” is ready to review. It does not run until you approve it.` })} />
							{!hideTemplates && (
								<section aria-labelledby="tpl-h" className="grid gap-2">
									<div className="flex items-center gap-2">
										<h2 id="tpl-h" className="flex-1 text-md font-semibold text-ink">Start from a template</h2>
										<Button variant="ghost" size="sm" onClick={() => { setHideTemplates(true); toast("Templates hidden", { description: "Browse templates is still above.", action: { label: "Undo", onClick: () => setHideTemplates(false) } }); }}>Don't show again</Button>
									</div>
									<ul className="grid grid-cols-3 gap-2 max-lg:grid-cols-2 max-sm:grid-cols-1">
										{templates.slice(0, 3).map((t) => (
											<li key={t.id}>
												<button type="button" onClick={() => useTemplate(t)} className="grid h-full w-full content-start gap-1 rounded-sm border border-line p-3 text-left transition-shadow hover:shadow-raised">
													<span className="text-base font-medium text-ink">{t.name}</span>
													<span className="text-sm text-ink-2">{t.does}</span>
													<span className="text-xs text-ink-3">Uses {t.tools.join(", ")}</span>
												</button>
											</li>
										))}
									</ul>
								</section>
							)}
							<section aria-labelledby="agents-h" className="grid gap-2">
								<h2 id="agents-h" className="text-md font-semibold text-ink">Your agents</h2>
								<AgentList onConfigure={(id) => go({ kind: "agent", id })} />
							</section>
						</div>
					</>
				) : (
					<>
						<PageHeader title="Agents" description="Agents act only within the connections and abilities you give them." />
						<div className="max-w-3xl px-6 pb-8 max-md:px-4"><AgentList onConfigure={(id) => go({ kind: "agent", id })} /></div>
					</>
				)}
			</ExampleShell>
			<TemplatesGallery open={gallery} onOpenChange={setGallery} templates={templates} onPick={useTemplate} />
			<AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Discard changes to {agent?.name}?</AlertDialogTitle>
						<AlertDialogDescription>Your changes to {agent?.name} haven't been saved. Discarding them can't be undone.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel autoFocus>Keep editing</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={() => { const n = pending?.next ?? null; setDirty(false); setPending(null); setPanel(n); }}>Discard changes</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

/* ---------------------------------------------------------------- flow */

function Flow({ onRestart }: { onRestart: () => void }) {
	const [screen, setScreen] = useState<Screen>("signin");
	const [step, setStep] = useState(1);
	const [profile, setProfile] = useState<Profile>({ first: "", last: "", photo: "" });
	const [useCase, setUseCase] = useState("");
	const [connectors, setConnectors] = useState<Connector[]>(CONNECTORS);
	const [invites, setInvites] = useState<Invite[]>([]);
	const photo = useRef("");
	useEffect(() => () => { if (photo.current) URL.revokeObjectURL(photo.current); }, []);

	const setPhoto = (f: File | null) => {
		if (photo.current) URL.revokeObjectURL(photo.current);
		photo.current = f ? URL.createObjectURL(f) : "";
		setProfile((p) => ({ ...p, photo: photo.current }));
	};
	const next = () => setStep((s) => s + 1);
	const back = () => setStep((s) => s - 1);

	if (screen === "signin") return <SignIn onRestart={onRestart} onDone={() => { setStep(1); setScreen("steps"); }} />;
	if (screen === "home")
		return <WorkspaceHome profile={profile} useCase={useCase} connectors={connectors} invites={invites} onRestart={onRestart} onStep={(n) => { setStep(n); setScreen("steps"); }} />;
	return (
		<Stage onRestart={onRestart}>
			{step === 1 && <StepProfile profile={profile} setProfile={setProfile} onPhoto={setPhoto} onNext={next} />}
			{step === 2 && <StepUse value={useCase} onChange={setUseCase} onBack={back} onNext={next} onSkip={() => { setUseCase(""); next(); }} />}
			{step === 3 && <StepConnect connectors={connectors} onConnected={(id) => setConnectors((cs) => cs.map((c) => (c.id === id ? { ...c, connected: true, problem: undefined } : c)))} onBack={back} onNext={next} />}
			{step === 4 && <StepInvite invites={invites} setInvites={setInvites} onBack={back} onNext={next} />}
			{step === 5 && <StepDone profile={profile} useCase={useCase} connectors={connectors} invites={invites} onBack={back} onNext={() => setScreen("home")} />}
		</Stage>
	);
}

export function OnboardingExample() {
	const [run, setRun] = useState(0);
	return <Flow key={run} onRestart={() => setRun((r) => r + 1)} />;
}
