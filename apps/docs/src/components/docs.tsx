import { Badge, Button, DropdownMenuItem, DropdownMenuSeparator, SplitButton, Swap, Tabs, TabsContent, TabsList, TabsTrigger, cn, toast } from "@twoux/ui";
import { Check, ChevronLeft, ChevronRight, Copy, ExternalLink, FileText } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { codeToHtml } from "shiki";
import { type Bullet, type Doc, type Example, PAGE_ORDER, docById, docPath } from "../content";
import { examplePrompt } from "./prompt";

/* ---------- inline text: `backticks` become code chips that never break mid-token ---------- */
export function Inline({ text }: { text: string }) {
	return (
		<>
			{text.split(/(`[^`]+`)/g).map((part, i) =>
				part.startsWith("`") && part.endsWith("`") ? (
					// biome-ignore lint/suspicious/noArrayIndexKey: static split
					<code key={i} className="rounded-xs bg-surface-2 px-1 font-mono text-docs-sm whitespace-nowrap text-ink ring-1 ring-line ring-inset">{part.slice(1, -1)}</code>
				) : (
					part
				),
			)}
		</>
	);
}

/* ---------- code ---------- */
export function CodeBlock({ code, lang = "tsx", className, copyable = true }: { code: string; lang?: string; className?: string; copyable?: boolean }) {
	const [html, setHtml] = useState<string>("");
	const [copied, setCopied] = useState(false);
	useEffect(() => {
		let live = true;
		codeToHtml(code.trim(), { lang, themes: { light: "github-light", dark: "github-dark" }, defaultColor: false }).then((h) => live && setHtml(h));
		return () => {
			live = false;
		};
	}, [code, lang]);
	return (
		<div className={cn("code-panel relative bg-surface-2", className)}>
			{copyable && <Button variant="ghost" size="icon-sm" className="absolute top-2 right-2" aria-label={copied ? "Copied" : "Copy code"} title={copied ? "Copied" : "Copy code"} onClick={() => {
					navigator.clipboard?.writeText(code.trim()).then(() => {
						setCopied(true);
						setTimeout(() => setCopied(false), 1500);
					});
				}}>{copied ? <Check /> : <Copy />}</Button>}
			{html ? (
				// biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output from our own source files
				<div dangerouslySetInnerHTML={{ __html: html }} />
			) : (
				<pre className="text-ink-2">{code.trim()}</pre>
			)}
		</div>
	);
}

/* ---------- live example: preview first, then the brief for a coding agent, then the raw source ---------- */
type ExampleTab = "preview" | "prompt" | "code";
export function ExampleBlock({ example, id, doc }: { example: Example; id?: string; doc?: Doc }) {
	const [tab, setTab] = useState<ExampleTab>("preview");
	const Comp = example.Component;
	return (
		<section id={id} className="scroll-mt-4">
			<h3 className="group flex items-center gap-2 text-docs-h3 font-semibold">
				{example.title}
				{id && <AnchorLink id={id} label={example.title} />}
			</h3>
			{example.description && <p className="mt-1.5 text-docs text-ink-prose">{example.description}</p>}
			<Tabs value={tab} onValueChange={(v) => setTab(v as ExampleTab)} className="mt-4 gap-0 overflow-hidden rounded-sm border border-line bg-surface">
				<div className="flex items-center gap-1 border-b border-line px-2 py-1.5">
					<TabsList variant="default" aria-label={`${example.title} view`} className="h-7 rounded-sm p-0.5">
						<TabsTrigger value="preview" className="h-6 flex-none px-3 text-sm">Preview</TabsTrigger>
						{doc && <TabsTrigger value="prompt" className="h-6 flex-none px-3 text-sm">Prompt</TabsTrigger>}
						<TabsTrigger value="code" className="h-6 flex-none px-3 text-sm">Code</TabsTrigger>
					</TabsList>
					<span className="ml-auto truncate font-mono text-xs text-ink-3">{example.file}</span>
				</div>
				<TabsContent value="preview" className="flex min-h-36 animate-fade-in items-center justify-center-safe overflow-x-auto bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[16px_16px] p-6">
					<Comp />
				</TabsContent>
				{doc && (
					<TabsContent value="prompt" className="animate-fade-in">
						{tab === "prompt" && <PromptPanel doc={doc} example={example} />}
					</TabsContent>
				)}
				<TabsContent value="code" className="animate-fade-in">
					<CodeBlock code={example.code} />
				</TabsContent>
			</Tabs>
		</section>
	);
}

/** The brief for a coding agent: what to build, which component, the rules that bind it, the data to replace and the code. */
function PromptPanel({ doc, example }: { doc: Doc; example: Example }) {
	const text = examplePrompt(doc, example);
	const [copied, setCopied] = useState(false);
	const copy = () =>
		(navigator.clipboard?.writeText(text) ?? Promise.reject()).then(
			() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
				toast.success("Prompt copied", { description: "Paste it into Claude Code, Cursor or Codex." });
			},
			() => toast.error("Couldn't copy the prompt", { description: "Allow clipboard access for this site, then try again." }),
		);
	const ask = encodeURIComponent(text);
	return (
		<div className="grid">
			<div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface px-3 py-2">
				<p className="min-w-0 flex-1 text-sm text-ink-2">A brief for your coding agent: the job, the rules that bind it, the data to replace and the code.</p>
				<SplitButton
					size="sm"
					onClick={copy}
					menuLabel="More ways to use this prompt"
					menu={
						<>
							<DropdownMenuItem asChild><a href={`https://claude.ai/new?q=${ask}`} target="_blank" rel="noreferrer"><ExternalLink />Open in Claude<span className="sr-only">(opens in a new tab)</span></a></DropdownMenuItem>
							<DropdownMenuItem asChild><a href={`https://chatgpt.com/?q=${ask}`} target="_blank" rel="noreferrer"><ExternalLink />Open in ChatGPT<span className="sr-only">(opens in a new tab)</span></a></DropdownMenuItem>
						</>
					}
				>
					<Swap swapKey={copied ? "done" : "copy"} kind="icon">{copied ? <Check /> : <Copy />}</Swap>
					Copy prompt
				</SplitButton>
			</div>
			<CodeBlock code={text} lang="md" copyable={false} className="code-wrap max-h-96 overflow-y-auto" />
		</div>
	);
}

/* ---------- cited guidance ---------- */
export function refNumbers(doc: Doc) {
	return Object.fromEntries(doc.references.map((r, i) => [r.id, i + 1]));
}

export function Cites({ doc, ids }: { doc: Doc; ids: string[] }) {
	const n = refNumbers(doc);
	const nums = ids.filter((s) => n[s]);
	if (!nums.length) return null;
	return (
		<span className="ml-1 whitespace-nowrap text-xs text-ink-3 tabular" aria-label="Sources">
			[
			{nums.map((s, i) => (
				<span key={s}>
					<a href={`#ref-${n[s]}`} title={doc.references[n[s] - 1].label} className="hover:text-primary-ink hover:underline">
						{n[s]}
					</a>
					{i < nums.length - 1 ? "," : ""}
				</span>
			))}
			]
		</span>
	);
}

export function Bullets({ doc, items, tone }: { doc: Doc; items?: Bullet[]; tone?: "do" | "dont" }) {
	if (!items?.length) return null;
	return (
		<ul className="grid gap-2">
			{items.map((b) => (
				<li key={b.t} className="grid grid-cols-[20px_1fr] gap-2.5 text-docs text-ink-prose">
					<span
						className={cn("mt-2 ml-1.5 size-1.5 rounded-full", tone === "do" ? "bg-ok" : tone === "dont" ? "bg-bad" : "bg-primary")}
						aria-hidden="true"
					/>
					<span>
						<Inline text={b.t} />
						<Cites doc={doc} ids={b.s} />
					</span>
				</li>
			))}
		</ul>
	);
}

/** Section heading with a shareable # link (appears on hover and focus). */
export function H2({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
	return (
		<h2 id={id} className={cn("group mt-14 mb-3 flex scroll-mt-16 items-center gap-2 text-docs-h2 font-semibold", className)}>
			{children}
			<AnchorLink id={id} label={typeof children === "string" ? children : id} />
		</h2>
	);
}

export function AnchorLink({ id, label }: { id: string; label: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<a
			href={`#${id}`}
			aria-label={`Link to ${label}`}
			onClick={() => {
				const url = `${location.origin}${location.pathname}${location.search}#${id}`;
				navigator.clipboard?.writeText(url).then(() => {
					setCopied(true);
					setTimeout(() => setCopied(false), 1200);
				});
			}}
			className="text-md font-normal text-ink-3 no-underline opacity-0 group-hover:opacity-100 hover:text-primary-ink focus-visible:opacity-100"
		>
			{copied ? "Copied" : "#"}
		</a>
	);
}

const KIND: Record<string, { label: string; tone: "success" | "default" | "warning" | "secondary" }> = {
	standard: { label: "Standard", tone: "success" },
	"design-system": { label: "Design system", tone: "default" },
	law: { label: "UX law", tone: "warning" },
	research: { label: "Research", tone: "warning" },
	article: { label: "Article", tone: "secondary" },
	"reference-app": { label: "Reference app", tone: "secondary" },
};

export function References({ doc }: { doc: Doc }) {
	return (
		<ol className="grid grid-cols-2 gap-1.5 max-lg:grid-cols-1">
			{doc.references.map((r, i) => (
				<li id={`ref-${i + 1}`} key={r.id} className="scroll-mt-24 rounded-sm bg-surface-2 target:bg-primary-soft">
					<a href={r.url} target="_blank" rel="noreferrer" className="grid grid-cols-[22px_1fr] gap-2 rounded-sm px-3 py-2 transition-colors duration-(--duration-fast) hover:bg-hover">
						<span className="font-mono text-docs-sm text-ink-3">{i + 1}</span>
						<span className="grid min-w-0 gap-1">
							<span className="flex items-start gap-1.5 font-medium text-ink">
								{r.label}
								<ExternalLink className="mt-1 size-3 shrink-0 text-ink-3" aria-hidden="true" />
							</span>
							<span className="flex items-center gap-2">
								<Badge variant={KIND[r.kind]?.tone ?? "secondary"}>{KIND[r.kind]?.label ?? r.kind}</Badge>
								<span className="truncate text-sm text-ink-3">{new URL(r.url).hostname.replace(/^www\./, "")}</span>
							</span>
						</span>
					</a>
				</li>
			))}
		</ol>
	);
}

export function Related({ ids }: { ids?: string[] }) {
	const items = (ids ?? []).map((r) => docById[r]).filter(Boolean);
	if (!items.length) return null;
	return (
		<div className="flex flex-wrap gap-2">
			{items.map((d) => (
				<Link
					key={d.id}
					to={docPath(d)}
					className="rounded-sm bg-surface-2 px-2.5 py-1 text-docs-sm font-medium transition-colors duration-(--duration-fast) hover:bg-hover"
				>
					{d.name}
				</Link>
			))}
		</div>
	);
}

/* ---------- on-this-page: links are real #anchors, the current section is highlighted as you scroll ---------- */
export function OnThisPage({ items }: { items: { id: string; label: string }[] }) {
	const [active, setActive] = useState(items[0]?.id);
	const key = items.map((i) => i.id).join("|");
	useEffect(() => {
		const root = document.querySelector("main");
		const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
		if (!root || !els.length) return;
		const onScroll = () => {
			const top = root.getBoundingClientRect().top + 80;
			let current = els[0].id;
			for (const el of els) if (el.getBoundingClientRect().top <= top) current = el.id;
			if (root.scrollTop + root.clientHeight >= root.scrollHeight - 4) current = els[els.length - 1].id;
			setActive(current);
		};
		onScroll();
		const later = [setTimeout(onScroll, 150), setTimeout(onScroll, 600)];
		root.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("hashchange", onScroll);
		return () => {
			later.forEach(clearTimeout);
			root.removeEventListener("scroll", onScroll);
			window.removeEventListener("hashchange", onScroll);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key]);
	if (!items.length) return <div className="max-xl:hidden" />;
	return (
		<nav aria-label="On this page" className="sticky top-10 max-h-[calc(100dvh-120px)] self-start overflow-y-auto max-xl:hidden">
			{/* Label indented by the rail, so it shares one left edge with the links. */}
			<div className="mb-3 pl-4 text-docs-sm text-ink-3">On this page</div>
			<ul className="grid border-l border-line">
				{items.map((i) => (
					<li key={i.id}>
						<a
							href={`#${i.id}`}
							title={i.label}
							aria-current={active === i.id ? "location" : undefined}
							className={cn(
								"-ml-px block truncate border-l-2 border-transparent py-1.5 pl-4 text-docs-sm text-ink-3 transition-colors duration-(--duration-fast) hover:text-ink",
								active === i.id && "border-primary text-ink",
							)}
						>
							{i.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}

/* ---------- previous / next: the neighbours of this page in sidebar order ---------- */
function Neighbour({ page, dir, from }: { page: (typeof PAGE_ORDER)[number]; dir: "prev" | "next"; from: string }) {
	const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
	return (
		<Link to={page.to} className={cn("group grid min-w-0", dir === "next" && "justify-items-end text-right")}>
			{/* Indented by the chevron (14px) plus its gap (4px), so the label lines up with the title. */}
			<span className={`text-docs-sm text-ink-3 ${dir === "prev" ? "pl-4.5" : "pr-4.5"}`}>{dir === "prev" ? "Previous" : "Next"}</span>
			<span className={cn("flex min-w-0 items-center gap-1 text-md", dir === "next" && "flex-row-reverse")}>
				<Icon className="size-3.5 shrink-0 text-ink-3 transition-transform duration-(--duration-fast) group-hover:text-ink" aria-hidden="true" />
				<span className="min-w-0 truncate">
					{page.section !== from && page.section !== page.label && <span className="text-ink-3">{page.section} / </span>}
					<span className="font-medium text-ink group-hover:underline group-hover:underline-offset-4">{page.label}</span>
				</span>
			</span>
		</Link>
	);
}

export function PrevNext() {
	const { pathname } = useLocation();
	const i = PAGE_ORDER.findIndex((p) => p.to === pathname);
	if (i < 0) return null;
	const prev = PAGE_ORDER[i - 1];
	const next = PAGE_ORDER[i + 1];
	const from = PAGE_ORDER[i].section;
	return (
		<nav aria-label="Previous and next page" className="docs-cols pb-16">
			<div className="flex justify-between gap-8 border-t border-line pt-10">
				{prev ? <Neighbour page={prev} dir="prev" from={from} /> : <span />}
				{next ? <Neighbour page={next} dir="next" from={from} /> : <span />}
			</div>
		</nav>
	);
}

/** The foot of every docs page: who makes TwoUX, its licence, and where to find and reach it. */
export function SiteFooter() {
	const link = "hover:text-ink hover:underline hover:underline-offset-4";
	return (
		<footer className="docs-cols pb-10">
			<div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line pt-6 text-docs-sm text-ink-3">
				<p>© 2026 TwoUX</p>
				<ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
					<li><Link to="/licence" className={link}>Licence</Link></li>
					<li><a href="https://github.com/axdexpert/twoux" target="_blank" rel="noreferrer" className={link}>GitHub<span className="sr-only"> (opens in a new tab)</span></a></li>
					<li><a href="mailto:hi@axdexpert.ai" className={link}>Get in touch</a></li>
				</ul>
			</div>
		</footer>
	);
}

/* ---------- shared building blocks for every docs page ---------- */

/** The number of a step in an ordered list: outlined, so the list reads as a sequence without competing with the text. */
export function NumberMarker({ n, solid = false }: { n: number; /** Filled, for markers placed over content such as an anatomy preview. */ solid?: boolean }) {
	return <span className={`mt-1 grid size-4.5 shrink-0 place-items-center rounded-full border border-primary text-xs font-semibold ${solid ? "bg-primary text-primary-foreground" : "text-primary-ink"}`}>{n}</span>;
}

/** A card that goes somewhere: icon, title and one line. External files open in a new tab. */
export function LinkCard({ icon: Icon, title, text, href }: { icon: typeof FileText; title: string; text: string; href: string }) {
	const external = /\.(md|txt)$/.test(href);
	const cls = "block h-full rounded-md border border-line bg-surface p-5 transition duration-(--duration-base) hover:border-line-strong hover:shadow-raised focus-visible:outline-offset-2";
	const body = (
		<>
			<Icon className="size-4 text-ink-3" aria-hidden="true" />
			<span className="mt-3 block text-docs font-semibold text-ink">{title}</span>
			<span className="mt-1 block text-docs-sm text-ink-prose">{text}</span>
		</>
	);
	return external ? (
		<a href={href} target="_blank" rel="noreferrer" className={cls}>{body}<span className="sr-only">(opens in a new tab)</span></a>
	) : (
		<Link to={href} className={cls}>{body}</Link>
	);
}

/** Copy the page as Markdown for an agent or chat, or open it elsewhere. `url` is the page's Markdown file. */
export function CopyPage({ url, title }: { url: string; title: string }) {
	const [copied, setCopied] = useState(false);
	const copy = async () => {
		try {
			const res = await fetch(url);
			if (!res.ok) throw new Error(String(res.status));
			await navigator.clipboard.writeText(await res.text());
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
			toast.success("Page copied as Markdown", { description: "Paste it into your coding agent or chat." });
		} catch {
			toast.error("Couldn't copy the page", { description: "Open it as Markdown from the menu, then copy it from there." });
		}
	};
	const absolute = new URL(url, location.origin).href;
	const ask = encodeURIComponent(`Read ${absolute} and use it to answer my questions about ${title} in TwoUX.`);
	return (
		<SplitButton
			onClick={copy}
			menuLabel="More ways to use this page"
			menu={
				<>
					<DropdownMenuItem onSelect={copy}><Copy />Copy page as Markdown</DropdownMenuItem>
					<DropdownMenuItem asChild><a href={url} target="_blank" rel="noreferrer"><FileText />View as Markdown<span className="sr-only">(opens in a new tab)</span></a></DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild><a href={`https://claude.ai/new?q=${ask}`} target="_blank" rel="noreferrer"><ExternalLink />Open in Claude<span className="sr-only">(opens in a new tab)</span></a></DropdownMenuItem>
					<DropdownMenuItem asChild><a href={`https://chatgpt.com/?q=${ask}`} target="_blank" rel="noreferrer"><ExternalLink />Open in ChatGPT<span className="sr-only">(opens in a new tab)</span></a></DropdownMenuItem>
				</>
			}
		>
			<Swap swapKey={copied ? "done" : "copy"} kind="icon">{copied ? <Check /> : <Copy />}</Swap>
			Copy page
		</SplitButton>
	);
}
