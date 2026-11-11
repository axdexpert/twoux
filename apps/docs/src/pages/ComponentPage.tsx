import { useMeta } from "../components/meta";
import { Badge, Kbd, Tabs, TabsContent, TabsList, TabsTrigger, cn } from "@twoux/ui";
import { BookMarked, CheckCircle2, Code2, Keyboard, Lightbulb, XCircle } from "lucide-react";
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Bullets, CodeBlock, Cites, CopyPage, ExampleBlock, H2, NumberMarker, OnThisPage, References, Related } from "../components/docs";
import { type Doc, apiFor, docById, examplesFor, thumbnailFor, thumbnailHasAnatomy } from "../content";

const TABS = [
	["examples", "Examples"],
	["usage", "Usage"],
	["accessibility", "Accessibility"],
	["api", "API"],
] as const;
type Tab = (typeof TABS)[number][0];

/* ---------- building blocks used by component, foundation and pattern pages ---------- */

/** Page title block. `eyebrow` is no longer shown: the breadcrumb lives in the docs header. */
export function PageHeader({ title, summary, status, meta, actions, children }: { eyebrow?: ReactNode; title: string; /** Right of the title, such as Copy page. */ actions?: ReactNode; summary: string; status?: ReactNode; meta?: ReactNode; children?: ReactNode }) {
	return (
		<header data-page-header className="pb-8">
			<div>
				<div className="min-w-0">
				<div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
					<div className="flex min-w-0 flex-wrap items-center gap-3">
						<h1 className="font-display text-docs-title font-semibold text-balance">{title}</h1>
					{status}
					</div>
					{actions && <div className="flex shrink-0 items-center gap-2 pt-1">{actions}</div>}
				</div>
				<p className="mt-6 text-docs-intro text-ink-prose">{summary}</p>
				{meta && <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-docs-sm text-ink-2">{meta}</div>}
				{children}
				</div>
			</div>
		</header>
	);
}

export function Meta({ icon: Icon, children }: { icon: typeof BookMarked; children: ReactNode }) {
	return (
		<span className="flex items-center gap-1.5">
			<Icon className="size-4 text-ink-3" aria-hidden="true" />
			{children}
		</span>
	);
}

export function UseCards({ doc }: { doc: Doc }) {
	return (
		<div className="grid items-start gap-3">
			<section className="rounded-sm border border-line bg-surface p-4 shadow-card">
				<h3 id="when-to-use" className="mb-3 flex scroll-mt-20 items-center gap-2 text-docs-h3 font-semibold">
					<CheckCircle2 className="size-4 text-ok" aria-hidden="true" />
					When to use
				</h3>
				<Bullets doc={doc} items={doc.whenToUse} tone="do" />
			</section>
			<section className="rounded-sm border border-line bg-surface p-4 shadow-card">
				<h3 id="when-not-to-use" className="mb-3 flex scroll-mt-20 items-center gap-2 text-docs-h3 font-semibold">
					<XCircle className="size-4 text-bad" aria-hidden="true" />
					When not to use
				</h3>
				<Bullets doc={doc} items={doc.whenNotToUse} tone="dont" />
			</section>
		</div>
	);
}

/**
 * The parts of a component. Numbered only when the preview carries the same numbers (thumbnails mark parts with
 * data-anatomy="n"); otherwise plain bullets, so a number never points at nothing. Parts the preview can't show
 * keep their number with a dashed marker. Hovering a part outlines it in the preview.
 */
export function Anatomy({ parts, compact, numbered, shown, active, onActive }: { parts: string[]; compact?: boolean; numbered?: boolean; shown?: Set<number>; active?: number | null; onActive?: (n: number | null) => void }) {
	const List = numbered ? "ol" : "ul";
	return (
		<List className={cn("grid gap-x-8 gap-y-2.5", compact ? "grid-cols-1" : "grid-cols-2 max-md:grid-cols-1")}>
			{parts.map((p, i) => {
				const n = i + 1;
				const missing = numbered && shown && !shown.has(n);
				return (
					<li
						key={p}
						onPointerEnter={() => onActive?.(n)}
						onPointerLeave={() => onActive?.(null)}
						className={cn("grid items-start gap-2.5 rounded-xs text-docs text-ink-prose", numbered ? "grid-cols-[1.125rem_minmax(0,1fr)]" : "grid-cols-[0.75rem_minmax(0,1fr)]", active === n && "text-ink")}
					>
						{numbered ? (
							<span className={cn(missing && "opacity-60 [&>span]:border-dashed")} title={missing ? "Not shown in this preview" : undefined}><NumberMarker n={n} /></span>
						) : (
							<span aria-hidden="true" className="mt-2.5 size-1.5 rounded-full bg-line-strong" />
						)}
						<span>{p}{missing && <span className="sr-only"> (not shown in the preview)</span>}</span>
					</li>
				);
			})}
		</List>
	);
}

/** The preview with numbered markers on the parts its thumbnail marks, beside the numbered anatomy. */
function AnatomyPreview({ Thumb, parts, annotated }: { Thumb?: React.ComponentType<{ anatomy?: boolean }>; parts: string[]; annotated: boolean }) {
	const stage = useRef<HTMLDivElement>(null);
	const [marks, setMarks] = useState<{ n: number; x: number; y: number }[]>([]);
	const [active, setActive] = useState<number | null>(null);
	// Clear first: without this, markers measured on the previous page stay on screen after client-side navigation.
	useLayoutEffect(() => {
		setMarks([]);
		setActive(null);
		const el = stage.current;
		if (!el || !annotated) return;
		const measure = () => {
			const box = el.getBoundingClientRect();
			setMarks([...el.querySelectorAll<HTMLElement>("[data-anatomy]")].map((t) => {
				const r = t.getBoundingClientRect();
				// Markers sit on the part's top-left corner; data-anatomy-pos="end" moves one to the top-right, for a part that starts where another does.
				return { n: Number(t.dataset.anatomy), x: Math.round((t.dataset.anatomyPos === "end" ? r.right : r.left) - box.left), y: Math.round(r.top - box.top) };
			}));
		};
		measure();
		// Web fonts change text widths after first paint, which moves the parts the markers sit on.
		let live = true;
		document.fonts?.ready.then(() => live && measure());
		const ro = new ResizeObserver(measure);
		ro.observe(el);
		for (const t of el.querySelectorAll<HTMLElement>("[data-anatomy]")) ro.observe(t);
		return () => {
			live = false;
			ro.disconnect();
		};
	}, [annotated, Thumb]);
	// Outline the part being read about, in the preview.
	useEffect(() => {
		stage.current?.querySelectorAll<HTMLElement>("[data-anatomy]").forEach((t) => t.toggleAttribute("data-anatomy-active", Number(t.dataset.anatomy) === active));
	}, [active]);
	const shown = new Set(marks.map((m) => m.n));
	return (
		<div className="mt-5 grid grid-cols-[1.4fr_1fr] gap-3 max-lg:grid-cols-1">
			<div className="flex min-h-40 items-center justify-center rounded-sm border border-line bg-surface bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[16px_16px] p-8">
				{Thumb ? (
					<div ref={stage} className="relative">
						<Thumb anatomy={annotated} />
						{marks.map((m) => (
							// Positions are measured from the rendered part, so they can't be tokens.
							<span key={`${m.n}-${m.x}-${m.y}`} aria-hidden="true" onPointerEnter={() => setActive(m.n)} onPointerLeave={() => setActive(null)} className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-xs [&>span]:mt-0" style={{ left: m.x, top: m.y }}>
								<NumberMarker n={m.n} solid />
							</span>
						))}
					</div>
				) : (
					<span className="grid justify-items-center gap-1 text-center">
						<span className="text-docs font-medium">Not built yet</span>
						<span className="text-docs-sm text-ink-2">The live preview appears here once the React component ships. The guidance below is final.</span>
					</span>
				)}
			</div>
			{parts.length > 0 && (
				<div className="rounded-sm bg-surface-2 p-4">
					<div className="mb-3 text-docs-sm font-medium text-ink-2">Anatomy</div>
					<Anatomy parts={parts} compact numbered={annotated} shown={annotated ? shown : undefined} active={active} onActive={setActive} />
				</div>
			)}
		</div>
	);
}

export function Decisions({ doc }: { doc: Doc }) {
	return (
		<div className="grid gap-3">
			{(doc.decisions ?? []).map((d) => (
				<div key={d.decision} className="rounded-sm border border-line bg-surface p-4 shadow-card">
					<div className="flex items-start gap-2.5">
						<Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
						<div>
							<div className="text-docs font-semibold">{d.decision}</div>
							<p className="mt-1.5 text-docs text-ink-prose">
								{d.why}
								<Cites doc={doc} ids={d.s} />
							</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

function TableCard({ head, children }: { head: string[]; children: ReactNode }) {
	return (
		<div className="overflow-x-auto rounded-sm border border-line bg-surface">
			<table className="w-full min-w-[560px] border-collapse text-left text-docs-sm">
				<thead className="bg-surface-2 text-docs-sm text-ink-2">
					<tr>{head.map((h) => <th key={h} className="px-3 py-2 font-medium">{h}</th>)}</tr>
				</thead>
				<tbody>{children}</tbody>
			</table>
		</div>
	);
}

/** Underline tabs with a sliding indicator. Switching keeps your place: if you had scrolled past the header, the new tab starts right under the sticky bar. */
function TabBar() {
	return (
		<TabsList aria-label="Page sections" className="flex h-auto gap-7 border-b-0">
			{TABS.map(([k, label]) => (
				<TabsTrigger key={k} value={k} className="h-auto min-w-6 py-2.5 text-docs">
					{label}
				</TabsTrigger>
			))}
		</TabsList>
	);
}

/* ---------- page ---------- */

export function ComponentPage() {
	const { id = "" } = useParams();
	const [params, setParams] = useSearchParams();
	const doc = docById[id];
	useMeta(doc ? `${doc.name} · TwoUX components` : "TwoUX", doc?.summary);
	const examples = examplesFor(id);
	const api = apiFor(id);
	const Thumb = thumbnailFor(id);
	const built = examples.length > 0;
	const tab = ((params.get("tab") as Tab) ?? (built ? "examples" : "usage")) as Tab;

	const selectTab = (t: Tab) => {
		// A sticky bar reports its stuck position, so measure the end of the header above it instead.
		const main = document.querySelector("main");
		const header = document.querySelector<HTMLElement>("[data-page-header]");
		const start = header ? header.offsetTop + header.offsetHeight : 0;
		if (main && header && main.scrollTop > start) main.scrollTo({ top: start, behavior: "instant" });
		setParams({ tab: t }, { replace: true });
	};

	if (!doc) return <div className="p-10 text-ink-2">No page called “{id}”.</div>;

	const onThisPage: Record<Tab, { id: string; label: string }[]> = {
		examples: examples.map((e) => ({ id: `ex-${e.id}`, label: e.title })),
		usage: [
			["when-to-use", "When to use"],
			["when-not-to-use", "When not to use"],
			["structure", "Anatomy"],
			["guidelines", "Guidelines"],
			["content", "Content"],
			["related", "Related"],
		]
			.filter(([k]) => k !== "structure" || doc.structure?.length)
			.map(([i, label]) => ({ id: i, label })),
		accessibility: [
			{ id: "a11y", label: "Requirements" },
			...(doc.keyboard?.length ? [{ id: "keyboard", label: "Keyboard" }] : []),
		],
		api: [{ id: "install", label: "Install" }, ...(api?.api ?? []).map((a) => ({ id: `api-${a.component}`, label: a.component }))],
	};

	return (
		<div className="docs-cols pt-10 pb-20 max-md:pt-8">
			<div className="min-w-0">
			<PageHeader
				eyebrow={
					<nav aria-label="Breadcrumb">
						<Link to="/components" className="hover:underline">Components</Link> <span className="px-1 text-ink-3">/</span>{" "}
						<Link to={`/components#${doc.group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="hover:underline">{doc.group}</Link>
					</nav>
				}
				title={doc.name}
				summary={doc.summary}
				actions={<CopyPage url={`/docs-md/${doc.id}.md`} title={doc.name} />}
				status={<span className="flex items-center gap-1.5">{built ? <Badge variant="success" dot>Stable</Badge> : <Badge variant="secondary" dot>Planned</Badge>}</span>}
				meta={
					<>
						<Meta icon={Code2}>{built ? `${examples.length} live example${examples.length === 1 ? "" : "s"}` : "Guidance ready, component next"}</Meta>
						{!!doc.keyboard?.length && <Meta icon={Keyboard}>{doc.keyboard.length} shortcuts</Meta>}
						<Meta icon={CheckCircle2}>WCAG 2.2 AA</Meta>
					</>
				}
			>
				<AnatomyPreview key={doc.id} Thumb={Thumb} parts={doc.structure ?? []} annotated={thumbnailHasAnatomy(doc.id)} />
			</PageHeader>

			<Tabs value={tab} onValueChange={(t) => selectTab(t as Tab)} className="gap-0">
			<div className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
				<TabBar />
			</div>

			<TabsContent value={tab} key={tab} className="min-w-0 animate-rise-in pt-4">
					{tab === "examples" &&
						(built ? (
							<div className="grid gap-10">
								{examples.map((e) => (
									<ExampleBlock key={e.id} example={e} id={`ex-${e.id}`} doc={doc} />
								))}
							</div>
						) : (
							<div className="rounded-sm border border-dashed border-line-strong p-10 text-center">
								<p className="text-docs-h3 font-semibold">Live examples come with the component</p>
								<p className="mt-2 text-docs text-ink-prose">
									Until then, everything you need to design with it is in{" "}
									<button type="button" className="font-medium text-primary-ink underline" onClick={() => setParams({ tab: "usage" })}>Usage</button>.
								</p>
							</div>
						))}

					{tab === "usage" && (
						<div>
							<UseCards doc={doc} />
							{!!doc.structure?.length && (
								<>
									<H2 id="structure">Anatomy</H2>
									<div className="rounded-sm bg-surface-2 p-4">
										<Anatomy parts={doc.structure} numbered={thumbnailHasAnatomy(doc.id)} />
									</div>
								</>
							)}
							<H2 id="guidelines">Guidelines</H2>
							<Bullets doc={doc} items={doc.guidelines} />
							<H2 id="content">Content</H2>
							<Bullets doc={doc} items={doc.content} />
							<H2 id="related">Related</H2>
							<Related ids={doc.related} />
						</div>
					)}

					{tab === "accessibility" && (
						<div>
							<H2 className="mt-0" id="a11y">Requirements</H2>
							<Bullets doc={doc} items={doc.accessibility} />
							{!!doc.keyboard?.length && (
								<>
									<H2 id="keyboard">Keyboard</H2>
									<TableCard head={["Keys", "Action"]}>
										{doc.keyboard.map((k) => (
											<tr key={k.keys + k.action} className="border-t border-line">
												<td className="w-60 px-3 py-2">
													<span className="flex flex-wrap gap-1">
														{k.keys.split(/\s*\+\s*|\s*,\s*|\s+or\s+/).map((x) => (
															<Kbd key={x}>{x}</Kbd>
														))}
													</span>
												</td>
												<td className="px-3 py-2 text-ink-2">{k.action}</td>
											</tr>
										))}
									</TableCard>
								</>
							)}
						</div>
					)}

					{tab === "api" && (
						<div>
							<H2 className="mt-0" id="install">Install</H2>
							{api ? (
								<>
									<p className="mb-3 text-docs text-ink-prose">Import it from the package. A shadcn registry install (<code className="font-mono text-docs-sm">npx shadcn add @twoux/…</code>) comes once the registry is published; see <Link to="/how-its-built#registry" className="font-medium text-primary-ink hover:underline">How components are built</Link>.</p>
									<div className="grid gap-3">
										<div className="overflow-hidden rounded-sm border border-line"><CodeBlock code={`import { ${api.api.map((a) => a.component).join(", ")} } from "@twoux/ui";`} /></div>
									</div>
									{api.api.map((a) => (
										<section key={a.component}>
											<H2 id={`api-${a.component}`}>{a.component}</H2>
											<TableCard head={["Prop", "Type", "Default", "Description"]}>
												{a.props.map((p) => (
													<tr key={p.name} className="border-t border-line align-top">
														<td className="px-3 py-2 font-mono text-docs-sm font-medium">{p.name}</td>
														<td className="px-3 py-2 font-mono text-docs-sm text-primary-ink">{p.type}</td>
														<td className="px-3 py-2 font-mono text-docs-sm text-ink-2">{p.default ?? "–"}</td>
														<td className="px-3 py-2 text-ink-2">{p.description}</td>
													</tr>
												))}
											</TableCard>
										</section>
									))}
								</>
							) : (
								<p className="text-docs text-ink-prose">Available once the component is built.</p>
							)}
						</div>
					)}
				</TabsContent>
			</Tabs>
			</div>
			<OnThisPage items={onThisPage[tab]} />
		</div>
	);
}
