/**
 * Ballast · Team & Permissions — an ERP screen built from TwoUX only.
 *
 * Doubles as the source for the build-up video:
 *   ?step=0…9  freezes the page at one build step (0 = empty shell, 7 = complete, 8–9 = invite dialog)
 *   ?play      plays the steps in order, for a screen recording
 * Without either it is the normal, interactive page.
 */
import {
	AppShell,
	Badge,
	Button,
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CheckboxField,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	FieldLabel,
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	Kbd,
	PageHeader,
	PersonAvatar,
	RadioField,
	RadioGroup,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SidebarItem,
	SidebarSection,
	Skeleton,
	Sparkline,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tabs,
	TabsList,
	TabsTrigger,
	Tag,
	UsageMeter,
	cn,
	toast,
} from "@twoux/ui";
import {
	Activity,
	ArrowLeftRight,
	Bell,
	Bot,
	Boxes,
	Building2,
	Check,
	ClipboardCheck,
	ClipboardList,
	Ellipsis,
	FileText,
	LayoutDashboard,
	LineChart,
	Package,
	PieChart,
	Plus,
	Search,
	Settings,
	Truck,
	Users,
	Warehouse,
} from "lucide-react";
import * as React from "react";
import { MEMBERS, PERMISSIONS, PERMISSION_ROLES, ROLES, WAREHOUSES } from "./data";

const LAST_STEP = 9;

function useBuildStep() {
	const params = new URLSearchParams(window.location.search);
	const fixed = params.get("step");
	const play = params.has("play");
	const remote = params.has("remote");
	const [step, setStep] = React.useState(fixed !== null ? Number(fixed) : play || remote ? 0 : 7);
	// ?remote: a parent frame (the video scene) sets the step with postMessage({ step, toast? }).
	React.useEffect(() => {
		if (!remote) return;
		const onMessage = (e: MessageEvent) => {
			if (typeof e.data?.step === "number") setStep(e.data.step);
			if (typeof e.data?.toast === "string") toast.success(e.data.toast);
		};
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	}, [remote]);
	React.useEffect(() => {
		if (!play || step >= LAST_STEP) return;
		const t = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 900 : 1400);
		return () => window.clearTimeout(t);
	}, [play, step]);
	return step;
}

/** Shows the placeholder until the build reaches `at`, then the real region rising in. */
function Built({ step, at, placeholder, children }: { step: number; at: number; placeholder: string; children: React.ReactNode }) {
	if (step < at) return <Skeleton className={cn("rounded-sm", placeholder)} />;
	return <div className="animate-rise-in">{children}</div>;
}

export function Ballast() {
	const step = useBuildStep();
	const [inviteOpen, setInviteOpen] = React.useState(false);
	const dialogOpen = step >= 8 || inviteOpen;

	return (
		<div className="h-screen">
			<AppShell sidebar={step >= 1 ? <BallastSidebar /> : <SidebarPlaceholder />}>
				{step >= 2 ? (
					<PageHeader
						className="animate-rise-in"
						title="Team & Permissions"
						description="7 people, 1 invite and 6 agents · approval limits are set by role"
						actions={
							<>
								{step >= 7 && (
									<Badge variant="success" className="animate-fade-in">
										3 agents running
									</Badge>
								)}
								<Button variant="outline" size="sm">
									<Search />
									Search SKUs and orders
									<Kbd>⌘K</Kbd>
								</Button>
								<Button variant="outline" size="sm">
									<FileText />
									Audit log
								</Button>
								<Button size="sm" shortcut="I" onClick={() => setInviteOpen(true)}>
									<Plus />
									Invite people
								</Button>
								<Button variant="ghost" size="icon-sm" aria-label="Notifications">
									<Bell />
								</Button>
							</>
						}
					/>
				) : (
					<div className="grid gap-2 px-6 pt-5 pb-4">
						<Skeleton className="h-6 w-56" />
						<Skeleton className="h-4 w-80" />
					</div>
				)}

				<div className="grid gap-4 px-6 pb-6 max-md:px-4">
					<div className="grid gap-4 lg:grid-cols-5">
						<div className="lg:col-span-2">
							<Built step={step} at={3} placeholder="h-64">
								<ApprovalLimits />
							</Built>
						</div>
						<div className="lg:col-span-3">
							<Built step={step} at={4} placeholder="h-64">
								<RoleMatrix />
							</Built>
						</div>
					</div>
					<Built step={step} at={5} placeholder="h-96">
						<Members rows={step >= 6} />
					</Built>
				</div>
			</AppShell>

			<InviteDialog
				open={dialogOpen}
				onOpenChange={setInviteOpen}
				prefilled={step >= 9}
				key={step >= 9 ? "filled" : "empty"}
			/>
		</div>
	);
}

/* ---------------------------------------------------------------- sidebar */

function SidebarPlaceholder() {
	return (
		<div className="grid gap-3 px-2">
			<Skeleton className="h-7 w-28" />
			<Skeleton className="h-10" />
			{Array.from({ length: 6 }, (_, i) => (
				<Skeleton key={i} className="h-5 w-36" />
			))}
		</div>
	);
}

function BallastSidebar() {
	return (
		<div className="flex flex-1 animate-fade-in flex-col gap-4">
			<div className="flex items-center gap-2 px-2">
				<span className="grid size-6 place-items-center rounded-xs bg-primary text-primary-foreground">
					<Boxes className="size-3.5" aria-hidden="true" />
				</span>
				<span className="text-base font-semibold text-ink">Ballast</span>
			</div>
			<div className="grid rounded-sm border border-line bg-surface px-2 py-1.5 shadow-xs">
				<span className="text-sm font-medium text-ink">Harbor &amp; Pine Supply</span>
				<span className="text-xs text-ink-3">4 warehouses · Columbus, OH</span>
			</div>
			<SidebarSection>
				<SidebarItem icon={<LayoutDashboard />} label="Command Center" href="#" />
			</SidebarSection>
			<SidebarSection title="AI operations">
				<SidebarItem icon={<Bot />} label="Agent Center" href="#" />
				<SidebarItem icon={<ClipboardCheck />} label="Approval Center" count={8} href="#" />
				<SidebarItem icon={<Activity />} label="Agent Activity" href="#" />
			</SidebarSection>
			<SidebarSection title="Inventory">
				<SidebarItem icon={<Package />} label="Products" href="#" />
				<SidebarItem icon={<ArrowLeftRight />} label="Stock Movements" href="#" />
				<SidebarItem icon={<ClipboardList />} label="Inventory Audit" href="#" />
			</SidebarSection>
			<SidebarSection title="Warehouse">
				<SidebarItem icon={<Warehouse />} label="Warehouses" href="#" />
				<SidebarItem icon={<Truck />} label="Stock Transfers" href="#" />
			</SidebarSection>
			<SidebarSection title="Procurement">
				<SidebarItem icon={<FileText />} label="Purchase Orders" href="#" />
				<SidebarItem icon={<Building2 />} label="Suppliers" href="#" />
			</SidebarSection>
			<SidebarSection title="Intelligence">
				<SidebarItem icon={<LineChart />} label="Forecasting" href="#" />
				<SidebarItem icon={<PieChart />} label="Analytics" href="#" />
			</SidebarSection>
			<SidebarSection>
				<SidebarItem icon={<Users />} label="Team & Permissions" current href="#" />
				<SidebarItem icon={<Settings />} label="Settings" href="#" />
			</SidebarSection>
			<div className="mt-auto flex items-center gap-2 px-2">
				<PersonAvatar name="Dana Okafor" size="sm" />
				<span className="grid">
					<span className="text-sm font-medium text-ink">Dana Okafor</span>
					<span className="text-xs text-ink-3">Inventory planner</span>
				</span>
			</div>
		</div>
	);
}

/* ---------------------------------------------------------------- cards */

function MoreMenu({ label }: { label: string }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon-sm" aria-label={`More actions for ${label}`}>
					<Ellipsis />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem>Edit limits</DropdownMenuItem>
				<DropdownMenuItem>Export</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function ApprovalLimits() {
	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle level={2}>Approval limits by role</CardTitle>
				<CardDescription>Largest single order a person can approve</CardDescription>
				<CardAction>
					<MoreMenu label="approval limits" />
				</CardAction>
			</CardHeader>
			<CardContent>
				<Table aria-label="Approval limits by role">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead>Role</TableHead>
							<TableHead className="text-right">Limit</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{ROLES.map((r) => (
							<TableRow key={r.role}>
								<TableCell className="text-ink">{r.role}</TableCell>
								<TableCell className={cn("tabular text-right", r.limit === "Cannot approve" ? "text-ink-3" : "font-medium text-ink")}>{r.limit}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

function RoleMatrix() {
	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle level={2}>What each role can do</CardTitle>
				<CardDescription>Agents follow the same rules as the person who approves them</CardDescription>
				<CardAction>
					<MoreMenu label="role permissions" />
				</CardAction>
			</CardHeader>
			<CardContent className="overflow-x-auto">
				<Table aria-label="What each role can do">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead>Permission</TableHead>
							{PERMISSION_ROLES.map((r) => (
								<TableHead key={r} className="text-center">
									{r === "Operations lead" ? "Ops lead" : r === "Inventory planner" ? "Planner" : r === "Warehouse manager" ? "Warehouse" : r}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{PERMISSIONS.map((p) => (
							<TableRow key={p.label}>
								<TableCell className="text-ink">{p.label}</TableCell>
								{PERMISSION_ROLES.map((r) => (
									<TableCell key={r} className="text-center">
										{p.roles.includes(r) ? (
											<Check className="mx-auto size-3.5 text-ink-2" aria-label="Allowed" />
										) : (
											<span className="text-ink-3" aria-label="Not allowed">
												–
											</span>
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

function Members({ rows }: { rows: boolean }) {
	const people = MEMBERS.filter((m) => m.status === "Active").length;
	const invited = MEMBERS.length - people;
	return (
		<Card>
			<CardHeader>
				<CardTitle level={2}>Members</CardTitle>
				<CardDescription>Everyone who can review, edit or approve agent actions</CardDescription>
				<CardAction>
					<MoreMenu label="members" />
				</CardAction>
			</CardHeader>
			<CardContent className="grid gap-3">
				<div className="flex flex-wrap items-end justify-between gap-2">
					<Tabs defaultValue="people">
						<TabsList>
							<TabsTrigger value="people">People {people}</TabsTrigger>
							<TabsTrigger value="agents">Agents 6</TabsTrigger>
							<TabsTrigger value="invited">Invited {invited}</TabsTrigger>
						</TabsList>
					</Tabs>
					<div className="flex gap-2">
						<Select defaultValue="all">
							<SelectTrigger size="sm" aria-label="Role">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All roles</SelectItem>
								{ROLES.map((r) => (
									<SelectItem key={r.role} value={r.role}>
										{r.role}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select defaultValue="all">
							<SelectTrigger size="sm" aria-label="Warehouse">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All warehouses</SelectItem>
								{WAREHOUSES.map((w) => (
									<SelectItem key={w} value={w}>
										{w}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="overflow-x-auto">
					<Table aria-label="Members">
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead>Person</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Warehouses</TableHead>
								<TableHead className="text-right">Approval limit</TableHead>
								<TableHead>Approvals, 30 days</TableHead>
								<TableHead>Last active</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows
								? MEMBERS.map((m, i) => (
										<TableRow key={m.id} className={cn("animate-rise-in", STAGGER[i])}>
											<TableCell>
												<span className="flex items-center gap-2.5">
													<PersonAvatar name={m.name} size="sm" />
													<span className="grid">
														<span className="flex items-center gap-1.5 font-medium text-ink">
															{m.name}
															{m.you && <Badge variant="secondary">You</Badge>}
														</span>
														<span className="text-sm text-ink-3">{m.email}</span>
													</span>
												</span>
											</TableCell>
											<TableCell className="text-ink">{m.role}</TableCell>
											<TableCell className="text-ink-2">{m.warehouses}</TableCell>
											<TableCell className={cn("tabular text-right", m.limit === "Cannot approve" ? "text-ink-3" : "text-ink")}>{m.limit}</TableCell>
											<TableCell>
												{m.approvals > 0 ? (
													<span className="flex items-center gap-2">
														<span className="tabular w-8 text-right font-medium text-ink">{m.approvals}</span>
														<Sparkline data={m.trend} aria-label={`${m.name} approvals trend`} className="h-5 w-16" />
													</span>
												) : (
													<span className="text-ink-3">None yet</span>
												)}
											</TableCell>
											<TableCell className={m.lastActive === "Active now" ? "text-ok" : "text-ink-2"}>{m.lastActive}</TableCell>
											<TableCell>
												<Badge variant={m.status === "Active" ? "success" : "secondary"}>{m.status}</Badge>
											</TableCell>
										</TableRow>
									))
								: Array.from({ length: 6 }, (_, i) => (
										<TableRow key={i} className="hover:bg-transparent">
											<TableCell colSpan={7}>
												<Skeleton className="h-5" />
											</TableCell>
										</TableRow>
									))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}

// Rows cascade in one after another; delays are TwoUX motion utilities, not hand-timed animation.
const STAGGER = ["", "delay-75", "delay-100", "delay-150", "delay-200", "delay-300", "delay-500", "delay-700"];

/* ---------------------------------------------------------------- invite dialog */

const INVITE_ROLES = ROLES.filter((r) => r.role !== "Owner" && r.role !== "Operations lead");

function InviteDialog({ open, onOpenChange, prefilled }: { open: boolean; onOpenChange: (o: boolean) => void; prefilled: boolean }) {
	const [emails, setEmails] = React.useState<string[]>(prefilled ? ["sam@harborpine.com", "olivia@harborpine.com"] : []);
	const [draft, setDraft] = React.useState("");
	const [role, setRole] = React.useState(prefilled ? "Inventory planner" : "Viewer");
	const [error, setError] = React.useState<string | null>(null);
	const seatsUsed = 8 + emails.length;
	const inputRef = React.useRef<HTMLInputElement>(null);

	const add = () => {
		const v = draft.trim().replace(/,$/, "");
		if (v) setEmails((e) => [...e, v]);
		setDraft("");
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		if (emails.length === 0) {
			setError("Add at least one email address, then send.");
			return;
		}
		onOpenChange(false);
		toast.success(`${emails.length} ${emails.length === 1 ? "invite" : "invites"} sent`);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				onOpenAutoFocus={(e) => {
					e.preventDefault();
					inputRef.current?.focus();
				}}
			>
				<form onSubmit={submit} className="grid gap-4">
					<DialogHeader>
						<DialogTitle>Invite people</DialogTitle>
						<DialogDescription>They get an email and join Harbor &amp; Pine Supply</DialogDescription>
					</DialogHeader>

					<div className="grid gap-1.5">
						<FieldLabel htmlFor="invite-emails">Email addresses</FieldLabel>
						<InputGroup className="h-auto min-h-8 flex-wrap py-1">
							{emails.length > 0 && (
								<InputGroupAddon className="flex-wrap gap-1">
									{emails.map((em) => (
										<Tag key={em} onRemove={() => setEmails((all) => all.filter((x) => x !== em))}>
											{em}
										</Tag>
									))}
								</InputGroupAddon>
							)}
							<InputGroupInput
								ref={inputRef}
								id="invite-emails"
								value={draft}
								aria-invalid={error ? true : undefined}
								aria-describedby="invite-emails-hint"
								onChange={(e) => {
									setDraft(e.target.value);
									setError(null);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === ",") {
										e.preventDefault();
										add();
									}
								}}
								onBlur={add}
							/>
						</InputGroup>
						<p id="invite-emails-hint" className={cn("text-sm", error ? "text-bad" : "text-ink-3")}>
							{error ?? "Separate addresses with commas or press Enter"}
						</p>
					</div>

					<fieldset className="grid gap-2">
						<legend className="mb-1.5 text-base font-medium text-ink">Role</legend>
						<RadioGroup value={role} onValueChange={setRole} className="gap-2">
							{INVITE_ROLES.map((r) => (
								<RadioField key={r.role} id={`role-${r.role}`} value={r.role} label={r.role} hint={r.description} />
							))}
						</RadioGroup>
					</fieldset>

					<fieldset className="grid gap-2">
						<legend className="mb-1.5 text-base font-medium text-ink">Warehouses they can see</legend>
						<div className="grid grid-cols-2 gap-x-4 gap-y-1">
							{WAREHOUSES.map((w) => (
								<CheckboxField key={w} id={`wh-${w}`} label={w} defaultChecked />
							))}
						</div>
					</fieldset>

					<UsageMeter used={seatsUsed} limit={15} unit="seats on the Growth plan" className="rounded-sm bg-surface-2 p-3" />

					<DialogFooter className="items-center sm:justify-between">
						<span className="text-sm text-ink-3">Invites expire in 7 days</span>
						<span className="flex gap-2">
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit">
								{emails.length > 0 ? `Send ${emails.length} ${emails.length === 1 ? "invite" : "invites"}` : "Send invites"}
							</Button>
						</span>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
