import { Badge, Button, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, Kbd, Segment, SegmentedControl, type ThemeChoice, Tooltip, TooltipContent, TooltipTrigger, cn, setTheme, useTheme } from "@twoux/ui";
import * as Dialog from "@radix-ui/react-dialog";
import {
	ArrowRightLeft,
	Activity,
	BarChart3,
	BookOpen,
	Bot,
	ChevronLeft,
	ChevronRight,
	Compass,
	Component,
	Contact,
	FileText,
	Hammer,
	CandlestickChart,
	Layers,
	LayoutDashboard,
	LayoutGrid,
	Menu,
	MessageSquare,
	Monitor,
	Moon,
	MousePointerClick,
	Navigation,
	Palette,
	Rocket,
	Search,
	Sun,
	Table2,
	Workflow,
	X,
} from "lucide-react";
import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { SearchDialog } from "./components/Search";
import { PrevNext } from "./components/docs";
import { EXAMPLE_APPS, LIBRARY, PAGE_ORDER, START_PAGES, docPath, docs, isBuilt, isNew } from "./content";
import { ComponentPage } from "./pages/ComponentPage";
import { ExampleApp } from "./pages/ExampleApp";
import { ExampleApps } from "./pages/ExampleApps";
import { ForAgents } from "./pages/ForAgents";
import { FoundationPage } from "./pages/FoundationPage";
import { Gallery } from "./pages/Gallery";
import { Home } from "./pages/Home";
import { HowBuilt } from "./pages/HowBuilt";
import { Licence } from "./pages/Licence";
import { SectionIndex } from "./pages/SectionIndex";
import { AgentsExample } from "./pages/examples/Agents";
import { CrmExample } from "./pages/examples/Crm";
import { DataWorkspaceExample } from "./pages/examples/DataWorkspace";
import { TradingExample } from "./pages/examples/Trading";
import { OnboardingExample } from "./pages/examples/Onboarding";
import { OperationsExample } from "./pages/examples/Operations";
import { WorkflowsExample } from "./pages/examples/Workflows";
import { TwoUXLogo } from "./components/twoux-logo";

/* Docs shell. Navigation model:
   - The root lists short sections flat (Start, Library, Example apps).
   - Library sections are large (Components has 110 pages in 7 groups), so each opens in its own panel with a way back.
   - Inside a panel, every group is open so all pages show at once; people can close groups, the group holding
     the current page reopens by itself, and their choices are remembered.
   - Choosing a section on the root also opens its overview page (All components, Overview).
   Look: section labels, muted icons, tree lines under an open group, hairlines between header, sidebar and content. */

type Icon = typeof BookOpen;

/** Example app icons, by id (the list itself lives in content.ts). */
const EXAMPLE_ICONS: Record<string, Icon> = { hiring: LayoutDashboard, crm: Contact, operations: Activity, trading: CandlestickChart, agents: Bot, onboarding: Rocket, "data-workspace": Table2, workflows: Workflow };

const START_ICONS: Record<string, Icon> = { "/docs": BookOpen, "/for-agents": Bot, "/how-its-built": Hammer };
const SECTION_ICONS: Record<string, Icon> = { foundation: Layers, components: Component, patterns: Workflow };
const SECTION_OVERVIEW: Record<string, string> = { foundation: "Overview", components: "All components", patterns: "Overview" };
const GROUP_ICONS: Record<string, Icon> = {
	"foundation/Visual foundation": Palette,
	"foundation/Key principles": Compass,
	"foundation/Adopting TwoUX": ArrowRightLeft,
	"components/Actions and inputs": MousePointerClick,
	"components/Content": FileText,
	"components/Navigation": Navigation,
	"components/Feedback and overlays": MessageSquare,
	"components/Data": Table2,
	"components/Data visualisation": BarChart3,
	"components/AI and agents": Bot,
	"patterns/General": Workflow,
	"patterns/Data and dashboards": LayoutDashboard,
	"patterns/AI": Bot,
};

/** The library section a page belongs to, so the sidebar opens on it. */
const sectionFor = (pathname: string) => LIBRARY.find((s) => pathname === s.to || pathname.startsWith(`${s.to}/`))?.id ?? null;

/* ---------- open groups: open by default, the current one reopens itself, choices are remembered ---------- */
const STORE = "twoux-docs-nav-open-groups";
function useOpenGroups() {
	const [open, setOpen] = useState<Record<string, boolean>>(() => {
		try {
			return JSON.parse(localStorage.getItem(STORE) ?? "{}");
		} catch {
			return {};
		}
	});
	useEffect(() => {
		try {
			localStorage.setItem(STORE, JSON.stringify(open));
		} catch {}
	}, [open]);
	// A group is open unless the person closed it.
	const isOpen = (k: string) => open[k] !== false;
	const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: o[k] === false }));
	const reveal = (k: string) => setOpen((o) => (o[k] === false ? { ...o, [k]: true } : o));
	return { open, isOpen, toggle, reveal };
}

/* ---------- building blocks ---------- */

const ITEM = "flex h-8 w-full min-w-0 items-center gap-2.5 rounded-sm px-2 text-left text-md text-ink-2 transition-colors duration-(--duration-fast) hover:bg-hover hover:text-ink focus-visible:outline-offset-[-2px]";
const ITEM_CURRENT = "bg-hover font-medium text-ink";

function SectionLabel({ children }: { children: ReactNode }) {
	return <p className="px-2 pt-6 pb-1.5 text-sm text-ink-3 first:pt-1">{children}</p>;
}

/** Height animates open and closed (grid rows 0fr → 1fr); closed content is inert so it can't be tabbed into. */
function Collapse({ open, id, children }: { open: boolean; id: string; children: ReactNode }) {
	return (
		<div id={id} inert={!open} className={cn("grid transition-[grid-template-rows,opacity] duration-(--duration-base) ease-(--ease-out)", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
			<div className="min-h-0 overflow-hidden">{children}</div>
		</div>
	);
}

/** Pages under an open group, joined to it by a tree line with a curved elbow per item. */
function TreeList({ items }: { items: { to: string; label: string; planned?: boolean; fresh?: boolean }[] }) {
	return (
		<ul className="ml-4 grid grid-cols-[minmax(0,1fr)] pt-0.5 pb-1">
			{items.map((it, i) => (
				<li key={it.to} className="relative min-w-0 pl-3.5">
					<span aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-1/2 w-2.5 rounded-bl-md border-b border-l border-line-strong" />
					{i < items.length - 1 && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 border-l border-line-strong" />}
					<NavLink
						to={it.to}
						end
						className={({ isActive }) => cn("flex h-8 min-w-0 items-center gap-2 rounded-sm px-2 text-md text-ink-2 transition-colors duration-(--duration-fast) hover:text-ink focus-visible:outline-offset-[-2px]", isActive && "font-medium text-ink")}
					>
						<span className="truncate" title={it.label}>{it.label}</span>
						{it.fresh && <><span className="sr-only">, </span><Badge className="ml-auto">New</Badge></>}
						{it.planned && <span className="ml-auto size-1.5 shrink-0 rounded-full bg-line-strong" title="Planned" />}
					</NavLink>
				</li>
			))}
		</ul>
	);
}

/* ---------- sidebar filter: narrows the navigation only; ⌘K in the header searches everything ---------- */

type NavItem = { to: string; label: string; planned?: boolean; fresh?: boolean };

/** Every word typed appears somewhere in the label, in any order. */
const matchesFilter = (label: string, q: string) => {
	const l = label.toLowerCase();
	return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => l.includes(w));
};

const docItem = (d: (typeof docs)[number]): NavItem => ({ to: docPath(d), label: d.name, planned: d.kind === "component" && !isBuilt(d.id), fresh: isNew(d.id) });

/** At the root the filter covers every page in the sidebar, grouped by where it lives. */
const ROOT_SECTIONS: { label: string; items: NavItem[] }[] = [
	{ label: "Start", items: START_PAGES },
	...LIBRARY.map((s) => ({ label: s.label, items: s.groups.flatMap((g) => g.items.map(docItem)) })),
	{ label: "Example apps", items: EXAMPLE_APPS.map((a) => ({ to: `/examples#${a.id}`, label: a.label, fresh: isNew(`example:${a.id}`) })) },
];

function NavFilter({ value, onChange, placeholder, onSubmit }: { value: string; onChange: (v: string) => void; placeholder: string; onSubmit: () => void }) {
	const ref = useRef<HTMLInputElement>(null);
	return (
		<InputGroup>
			<InputGroupAddon>
				<Search className="text-ink-3" aria-hidden="true" />
			</InputGroupAddon>
			<InputGroupInput
				ref={ref}
				type="search"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && value.trim()) {
						e.preventDefault();
						onSubmit();
					} else if (e.key === "Escape" && value) {
						// First Esc clears the filter; the next one closes whatever holds the sidebar (the phone drawer).
						e.preventDefault();
						e.stopPropagation();
						onChange("");
					}
				}}
				placeholder={placeholder}
				aria-label={placeholder}
				autoComplete="off"
				spellCheck={false}
				className="[&::-webkit-search-cancel-button]:hidden"
			/>
			{value && (
				<InputGroupAddon align="inline-end">
					<InputGroupButton size="icon-xs" aria-label="Clear filter" onClick={() => { onChange(""); ref.current?.focus(); }}>
						<X aria-hidden="true" />
					</InputGroupButton>
				</InputGroupAddon>
			)}
		</InputGroup>
	);
}

/** Flat list of matching pages; the current page is marked as in the tree. */
function FilteredList({ items, pathname, hash }: { items: NavItem[]; pathname: string; hash: string }) {
	return (
		<ul className="grid grid-cols-[minmax(0,1fr)] gap-0.5">
			{items.map((it) => {
				const current = it.to.includes("#") ? `${pathname}${hash}` === it.to : pathname === it.to;
				return (
					<li key={it.to} className="min-w-0">
						<Link to={it.to} aria-current={current ? "page" : undefined} className={cn(ITEM, current && ITEM_CURRENT)}>
							<span className="min-w-0 flex-1 truncate" title={it.label}>{it.label}</span>
							{it.fresh && <><span className="sr-only">, </span><Badge>New</Badge></>}
							{it.planned && <span className="size-1.5 shrink-0 rounded-full bg-line-strong" title="Planned" />}
						</Link>
					</li>
				);
			})}
		</ul>
	);
}

/* ---------- sidebar ---------- */

function Sidebar({ onSearchAll }: { onSearchAll: (q: string) => void }) {
	const { pathname, hash } = useLocation();
	const [panel, setPanel] = useState<string | null>(() => sectionFor(pathname));
	// Direction of the last move, for the slide. Null on first render, so the sidebar doesn't animate on page load.
	const [dir, setDir] = useState<"in" | "back" | null>(null);
	const { open, isOpen: groupOpen, toggle, reveal } = useOpenGroups();
	const navigate = useNavigate();
	const navRef = useRef<HTMLElement>(null);
	const focusNext = useRef<string | null>(null);

	// Navigating to a page in another section (search, a link) opens that section's panel and the page's group.
	useEffect(() => {
		const s = sectionFor(pathname);
		if (!s) return;
		setPanel((p) => {
			if (p !== s) setDir("in");
			return s;
		});
		for (const sec of LIBRARY) for (const g of sec.groups) if (g.items.some((d) => docPath(d) === pathname)) reveal(`${sec.id}/${g.label}`);
	}, [pathname]);

	// Keyboard users land on the back button when a panel opens, and on the section row when they come back.
	useEffect(() => {
		const t = focusNext.current;
		if (!t) return;
		focusNext.current = null;
		navRef.current?.querySelector<HTMLElement>(`[data-focus="${t}"]`)?.focus();
	}, [panel]);

	// After navigating, bring the current page into view once its group has opened. Only scrolls when it is off-screen.
	const pending = useRef(true);
	useEffect(() => { pending.current = true; }, [pathname]);
	useEffect(() => {
		if (!pending.current) return;
		let tries = 0;
		let id = 0;
		let last = -1;
		const tick = () => {
			const nav = navRef.current;
			const item = nav?.querySelector<HTMLElement>('[aria-current="page"]');
			const scroller = nav?.closest<HTMLElement>("[data-sidebar-scroll]");
			const a = item?.getBoundingClientRect();
			if (!item || !scroller || !a || a.height === 0 || document.querySelector("[role=dialog]")) { if (tries++ < 40) id = window.setTimeout(tick, 50); return; }
			if (Math.round(a.top) !== last) { last = Math.round(a.top); if (tries++ < 40) id = window.setTimeout(tick, 50); return; }
			pending.current = false;
			const b = scroller.getBoundingClientRect();
			if (a.top < b.top + 72 || a.bottom > b.bottom - 8) scroller.scrollTop += a.top - b.top - (b.height - a.height) / 2;
		};
		id = window.setTimeout(tick, 0);
		return () => window.clearTimeout(id);
	}, [pathname, open, panel]);

	const enter = (id: string) => {
		focusNext.current = "back";
		setDir("in");
		setPanel(id);
		const to = LIBRARY.find((s) => s.id === id)?.to;
		if (to && sectionFor(pathname) !== id) navigate(to);
	};
	const leave = () => { focusNext.current = `root-${panel}`; setDir("back"); setPanel(null); };

	const section = LIBRARY.find((s) => s.id === panel);
	const here = sectionFor(pathname);

	// The filter narrows what this panel lists. It empties when the panel changes, so a new section starts whole.
	const [query, setQuery] = useState("");
	useEffect(() => setQuery(""), [panel]);
	const q = query.trim();
	const filtered = q
		? section
			? section.groups.map((g) => ({ label: g.label, key: `${section.id}/${g.label}`, items: g.items.map(docItem).filter((it) => matchesFilter(it.label, q)) })).filter((g) => g.items.length)
			: ROOT_SECTIONS.map((s) => ({ label: s.label, key: s.label, items: s.items.filter((it) => matchesFilter(it.label, q)) })).filter((s) => s.items.length)
		: [];
	const matchCount = filtered.reduce((n, g) => n + g.items.length, 0);
	const noun = section ? section.label.toLowerCase() : "pages";

	return (
		<>
			<div role="search" className="sticky top-0 z-10 bg-surface pt-5 pb-3">
				<NavFilter value={query} onChange={setQuery} placeholder={section ? `Search ${noun}` : "Search navigation"} onSubmit={() => { const first = filtered[0]?.items[0]; if (first) navigate(first.to); }} />
			</div>
			<p className="sr-only" aria-live="polite">{q ? (matchCount ? `${matchCount} ${matchCount === 1 ? "page" : "pages"} shown` : `No ${noun} match ${q}`) : ""}</p>
		<nav ref={navRef} aria-label="Documentation" className="grid grid-cols-[minmax(0,1fr)]">
			<div key={panel ?? "root"} className={cn("grid grid-cols-[minmax(0,1fr)] gap-0.5", dir === "in" && "animate-panel-in", dir === "back" && "animate-panel-back")}>
				{section && (
					<button type="button" data-focus="back" onClick={leave} aria-label={`${section.label}. Back to all docs`} className={cn(ITEM, "mb-2 font-medium text-ink")}>
						<ChevronLeft className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
						{section.label}
					</button>
				)}
				{q ? (
					matchCount ? (
						filtered.map((g) => {
							const GroupIcon = section ? (GROUP_ICONS[g.key] ?? Layers) : null;
							// Group rows sit on the tree inside a panel; at the root, section labels stay siblings so only the first loses its top space.
							return GroupIcon ? (
								<div key={g.key} className="grid grid-cols-[minmax(0,1fr)]">
									<p className={cn(ITEM, "hover:bg-transparent hover:text-ink-2")}>
										<GroupIcon className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
										<span className="min-w-0 flex-1 truncate">{g.label}</span>
										<span className="text-sm text-ink-3 tabular">{g.items.length}</span>
									</p>
									<TreeList items={g.items} />
								</div>
							) : (
								<Fragment key={g.key}>
									<SectionLabel>{g.label}</SectionLabel>
									<FilteredList items={g.items} pathname={pathname} hash={hash} />
								</Fragment>
							);
						})
					) : (
						<div className="grid justify-items-start gap-1 pt-2">
							<p className="px-2 text-md text-ink-2">No {noun} match “{q}”.</p>
							<Button variant="link" size="sm" onClick={() => onSearchAll(q)}>
								Search all docs for “{q}”
							</Button>
						</div>
					)
				) : section ? (
					<>
						<NavLink to={section.to} end className={({ isActive }) => cn(ITEM, isActive && ITEM_CURRENT)}>
							<LayoutGrid className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
							{SECTION_OVERVIEW[section.id]}
						</NavLink>
						<SectionLabel>Groups</SectionLabel>
						{section.groups.map((g) => {
							if (!g.items.length) return null;
							const k = `${section.id}/${g.label}`;
							const isOpen = groupOpen(k);
							const holdsCurrent = g.items.some((d) => docPath(d) === pathname);
							const GroupIcon = GROUP_ICONS[k] ?? Layers;
							return (
								<div key={k} className="grid grid-cols-[minmax(0,1fr)]">
									<button type="button" aria-expanded={isOpen} aria-controls={`nav-${k}`} onClick={() => toggle(k)} className={cn(ITEM, holdsCurrent && "text-ink")}>
										<GroupIcon className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
										<span className="min-w-0 flex-1 truncate">{g.label}</span>
										<span className="text-sm text-ink-3 tabular">{g.items.length}</span>
										<ChevronRight className={cn("size-3.5 shrink-0 text-ink-3 transition-transform duration-(--duration-fast)", isOpen && "rotate-90")} aria-hidden="true" />
									</button>
									<Collapse open={isOpen} id={`nav-${k}`}>
										<TreeList items={g.items.map((d) => ({ to: docPath(d), label: d.name, planned: d.kind === "component" && !isBuilt(d.id), fresh: isNew(d.id) }))} />
									</Collapse>
								</div>
							);
						})}
					</>
				) : (
					<>
						<SectionLabel>Start</SectionLabel>
						{START_PAGES.map(({ to, label }) => {
							const StartIcon = START_ICONS[to] ?? BookOpen;
							return (
								<NavLink key={to} to={to} end className={({ isActive }) => cn(ITEM, isActive && ITEM_CURRENT)}>
									<StartIcon className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
									<span className="truncate">{label}</span>
								</NavLink>
							);
						})}
						<SectionLabel>Library</SectionLabel>
						{LIBRARY.map((s) => {
							const SectionIcon = SECTION_ICONS[s.id];
							return (
								<button key={s.id} type="button" data-focus={`root-${s.id}`} onClick={() => enter(s.id)} className={cn(ITEM, here === s.id && "text-ink")}>
									<SectionIcon className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
									<span className="min-w-0 flex-1 truncate">{s.label}</span>
									<span className="text-sm text-ink-3 tabular">{s.groups.reduce((n, g) => n + g.items.length, 0)}</span>
									<ChevronRight className="size-3.5 shrink-0 text-ink-3" aria-hidden="true" />
								</button>
							);
						})}
						<SectionLabel>Example apps</SectionLabel>
						<NavLink to="/examples" end className={({ isActive }) => cn(ITEM, isActive && !hash && ITEM_CURRENT)}>
							<LayoutGrid className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
							<span className="truncate">All example apps</span>
						</NavLink>
						{/* Each app opens at its live preview; the full page is one click away from there. */}
						{EXAMPLE_APPS.map((app) => {
							const ExampleIcon = EXAMPLE_ICONS[app.id] ?? LayoutGrid;
							const current = pathname === "/examples" && hash === `#${app.id}`;
							return (
								<Link key={app.id} to={`/examples#${app.id}`} aria-current={current ? "location" : undefined} className={cn(ITEM, current && ITEM_CURRENT)}>
									<ExampleIcon className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
									<span className="min-w-0 flex-1 truncate">{app.label}</span>
									{isNew(`example:${app.id}`) && <><span className="sr-only">, </span><Badge>New</Badge></>}
								</Link>
							);
						})}
					</>
				)}
			</div>
		</nav>
		</>
	);
}

/* ---------- theme: Light, Dark or Match system, at the foot of the sidebar ---------- */

const THEMES: [ThemeChoice, string, Icon][] = [["system", "Match system", Monitor], ["light", "Light", Sun], ["dark", "Dark", Moon]];

/** One option. It stays a direct child of the control, which finds the chosen segment there for its sliding pill.
    The segment opens its own tooltip on hover and focus: a trigger wrapping it would overwrite its "on" state,
    and its enlarged 24px hit area covers anything inside, so the inner span only anchors the tooltip. */
function ThemeSegment({ value, label, icon: ThemeIcon }: { value: ThemeChoice; label: string; icon: Icon }) {
	const [open, setOpen] = useState(false);
	return (
		<Segment value={value} aria-label={label} onPointerEnter={() => setOpen(true)} onPointerLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
			<Tooltip open={open} onOpenChange={setOpen}>
				<TooltipTrigger asChild><span className="grid place-items-center"><ThemeIcon aria-hidden="true" /></span></TooltipTrigger>
				<TooltipContent>{label}</TooltipContent>
			</Tooltip>
		</Segment>
	);
}

function ThemeToggle() {
	const { choice } = useTheme();
	return (
		<SegmentedControl value={choice} onValueChange={(v) => v && setTheme(v as ThemeChoice)} size="sm" aria-label="Theme">
			{THEMES.map(([value, label, ThemeIcon]) => <ThemeSegment key={value} value={value} label={label} icon={ThemeIcon} />)}
		</SegmentedControl>
	);
}

/** Navigation filter pinned on top, then the scrolling list; theme pinned under a hairline at the foot. Used in the desktop sidebar and the phone drawer. */
function SidebarBody({ onSearchAll }: { onSearchAll: (q: string) => void }) {
	return (
		<>
			<div data-sidebar-scroll className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 pb-6">
				<Sidebar onSearchAll={onSearchAll} />
			</div>
			<div className="border-t border-line px-3 py-3"><ThemeToggle /></div>
		</>
	);
}

/* ---------- header: logo over the sidebar; breadcrumb and search over the content ---------- */

function Logo() {
	return (
		<Link to="/docs" aria-label="TwoUX home" className="flex h-8 items-center rounded-sm">
			<TwoUXLogo />
		</Link>
	);
}

function Crumbs() {
	const { pathname } = useLocation();
	const page = PAGE_ORDER.find((p) => p.to === pathname);
	if (!page) return null;
	const section = LIBRARY.find((s) => s.label === page.section);
	const parts: { label: string; to?: string }[] = [];
	if (section && page.to !== section.to) parts.push({ label: section.label, to: section.to });
	if (page.group) parts.push({ label: page.group });
	parts.push({ label: page.label });
	return (
		<nav aria-label="Breadcrumb" className="min-w-0">
			<ol className="flex min-w-0 items-center gap-2 text-md">
				{parts.map((p, i) => (
					<Fragment key={p.label}>
						{i > 0 && <li aria-hidden="true" className="text-ink-3">/</li>}
						<li className={cn("min-w-0 truncate", i === parts.length - 1 ? "text-ink" : "text-ink-3")} aria-current={i === parts.length - 1 ? "page" : undefined}>
							{p.to ? <Link to={p.to} className="hover:text-ink">{p.label}</Link> : p.label}
						</li>
					</Fragment>
				))}
			</ol>
		</nav>
	);
}

function SearchButton({ onSearch }: { onSearch: () => void }) {
	return (
		<button
			type="button"
			onClick={onSearch}
			aria-label="Search the docs"
			aria-keyshortcuts="Meta+K Control+K"
			className="flex h-8 w-44 shrink-0 items-center lg:w-64 gap-2 rounded-sm border border-input bg-surface px-2.5 text-base text-ink-3 shadow-xs transition-colors duration-(--duration-fast) hover:border-input-hover"
		>
			<Search className="size-4" aria-hidden="true" />
			<span className="flex-1 truncate text-left">Search {docs.length} pages</span>
			<span className="flex gap-0.5"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
		</button>
	);
}

/** New page: scroll to top. Same page with a #hash: smooth scroll to that section. Query changes (tabs) never jump. */
function useHashScroll(main: React.RefObject<HTMLElement | null>) {
	const { pathname, hash } = useLocation();
	const lastPath = useRef(pathname);
	useEffect(() => {
		const samePage = lastPath.current === pathname;
		lastPath.current = pathname;
		if (!hash) {
			if (!samePage) main.current?.scrollTo({ top: 0 });
			return;
		}
		const id = decodeURIComponent(hash.slice(1));
		let tries = 0;
		const t = setInterval(() => {
			const el = document.getElementById(id);
			if (el || ++tries > 20) {
				clearInterval(t);
				el?.scrollIntoView({ block: "start", behavior: samePage ? "smooth" : "auto" });
			}
		}, 40);
		return () => clearInterval(t);
	}, [pathname, hash, main]);
}

function MobileNav({ open, onOpenChange, onSearchAll }: { open: boolean; onOpenChange: (o: boolean) => void; onSearchAll: (q: string) => void }) {
	const { pathname } = useLocation();
	useEffect(() => onOpenChange(false), [pathname, onOpenChange]);
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-40 animate-fade-in bg-ink/20 md:hidden" />
				<Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface shadow-pop outline-none md:hidden data-[state=open]:animate-slide-in">
					<div className="flex h-12 items-center gap-2 border-b border-line px-3">
						<Dialog.Title className="flex-1 text-md font-semibold">TwoUX docs</Dialog.Title>
						<Dialog.Description className="sr-only">Site navigation</Dialog.Description>
						<Dialog.Close className="grid size-8 place-items-center rounded-sm text-ink-2 hover:bg-hover" aria-label="Close navigation">
							<X className="size-4" aria-hidden="true" />
						</Dialog.Close>
					</div>
					<SidebarBody onSearchAll={onSearchAll} />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

/** Example apps open on their own page (a new tab), full screen, without the docs header and sidebar. */
export function App() {
	const { pathname } = useLocation();
	// There is no marketing home: the site opens on Get started.
	if (pathname === "/") return <Navigate to="/docs" replace />;
	if (pathname === "/example-app" || pathname.startsWith("/examples/"))
		return (
			<div className="h-dvh bg-bg">
				<Routes>
					<Route path="/example-app" element={<ExampleApp />} />
					<Route path="/examples/crm" element={<CrmExample />} />
					<Route path="/examples/operations" element={<OperationsExample />} />
					<Route path="/examples/trading" element={<TradingExample />} />
					<Route path="/examples/agents" element={<AgentsExample />} />
					<Route path="/examples/onboarding" element={<OnboardingExample />} />
					<Route path="/examples/data-workspace" element={<DataWorkspaceExample />} />
					<Route path="/examples/workflows" element={<WorkflowsExample />} />
				</Routes>
			</div>
		);
	return <DocsApp />;
}

function DocsApp() {
	const [searchOpen, setSearchOpen] = useState(false);
	// What the sidebar filter hands over when it found nothing in the navigation; ⌘K and the header button start empty.
	const [searchSeed, setSearchSeed] = useState("");
	const openSearch = (q = "") => { setSearchSeed(q); setSearchOpen(true); };
	const [navOpen, setNavOpen] = useState(false);
	const mainRef = useRef<HTMLElement>(null);
	useHashScroll(mainRef);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const typing = (e.target as HTMLElement).closest("input, textarea, [contenteditable]");
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setSearchSeed("");
				setSearchOpen((o) => !o);
			} else if (e.key === "/" && !typing) {
				e.preventDefault();
				setSearchSeed("");
				setSearchOpen(true);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	return (
		<div className="grid h-dvh grid-rows-[48px_minmax(0,1fr)] bg-surface">
			<header className="grid grid-cols-[264px_minmax(0,1fr)] border-b border-line max-md:grid-cols-[minmax(0,1fr)]">
				<div className="flex min-w-0 items-center gap-2 border-r border-line px-4 max-md:border-r-0 max-md:px-2">
					<button type="button" onClick={() => setNavOpen(true)} className="grid size-8 place-items-center rounded-sm text-ink-2 hover:bg-hover hover:text-ink md:hidden" aria-label="Open navigation" aria-expanded={navOpen}>
						<Menu className="size-4" aria-hidden="true" />
					</button>
					<Logo />
					<span aria-hidden="true" className="h-4 border-l border-line-strong" />
					<span className="text-md text-ink-2">Docs</span>
					<span className="flex-1" />
					<button type="button" onClick={() => openSearch()} aria-label="Search the docs" className="grid size-8 place-items-center rounded-sm text-ink-2 hover:bg-hover hover:text-ink md:hidden">
						<Search className="size-4" aria-hidden="true" />
					</button>
				</div>
				<div className="flex min-w-0 items-center gap-4 px-6 max-md:hidden">
					<Crumbs />
					<span className="flex-1" />
					<SearchButton onSearch={() => openSearch()} />
				</div>
			</header>
			<div className="grid min-h-0 grid-cols-[264px_minmax(0,1fr)] max-md:grid-cols-1">
				<aside className="flex min-h-0 flex-col border-r border-line max-md:hidden">
					<SidebarBody onSearchAll={openSearch} />
				</aside>
				<main ref={mainRef} className="relative min-h-0 overflow-y-auto">
					<Routes>
						<Route path="/docs" element={<Home />} />
						<Route path="/get-started" element={<Navigate to="/docs" replace />} />
						<Route path="/components" element={<Gallery />} />
						<Route path="/components/column-preferences" element={<Navigate to="/components/columns-menu" replace />} />
						<Route path="/components/:id" element={<ComponentPage />} />
						<Route path="/foundation" element={<SectionIndex kind="foundation" />} />
						<Route path="/patterns" element={<SectionIndex kind="pattern" />} />
						<Route path="/foundation/:id" element={<FoundationPage />} />
						<Route path="/patterns/:id" element={<FoundationPage />} />
						<Route path="/for-agents" element={<ForAgents />} />
						<Route path="/how-its-built" element={<HowBuilt />} />
						<Route path="/licence" element={<Licence />} />
						<Route path="/examples" element={<ExampleApps />} />
					</Routes>
					<PrevNext />
				</main>
			</div>
			<SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} initialQuery={searchSeed} />
			<MobileNav open={navOpen} onOpenChange={setNavOpen} onSearchAll={(q) => { setNavOpen(false); openSearch(q); }} />
		</div>
	);
}
