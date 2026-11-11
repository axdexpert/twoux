import { CommandDialog, CommandEmpty, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandItemMeta, CommandList, CommandShortcut, Kbd } from "@twoux/ui";
import { ArrowRight, BookOpen, FileText, Hash, ListChecks, Search as SearchIcon, Workflow } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import jobs from "../../../../packages/ui/registry/jobs.json";
import rules from "../../../../packages/ui/registry/rules.json";
import { type Doc, docById, docPath, docs, examplesFor } from "../content";

type Hit = { kind: "page" | "section" | "rule" | "job" | "example"; title: string; text?: string; page: Doc; to: string; score: number };

/** Where each kind of section lives: component pages split content into tabs. */
const SECTIONS: [keyof Doc, string, string, "usage" | "accessibility" | null][] = [
	["whenToUse", "when-to-use", "When to use", "usage"],
	["whenNotToUse", "when-not-to-use", "When not to use", "usage"],
	["principles", "principles", "Principles", null],
	["steps", "how", "How it works", null],
	["guidelines", "guidelines", "Guidelines", "usage"],
	["content", "content", "Content", "usage"],
	["accessibility", "a11y", "Accessibility", "accessibility"],
	["dos", "dos", "Do", null],
	["donts", "dos", "Don't", null],
];

function link(d: Doc, anchor: string, tab: "usage" | "accessibility" | "examples" | null) {
	const base = docPath(d);
	if (d.kind === "component") return `${base}${tab && tab !== "examples" ? `?tab=${tab}` : ""}#${anchor}`;
	return `${base}#${anchor === "a11y" ? "accessibility" : anchor}`;
}

type Entry = Omit<Hit, "score"> & { hay: string; weight: number };
function buildIndex(): Entry[] {
	const out: Entry[] = [];
	for (const d of docs) {
		out.push({ kind: "page", title: d.name, text: d.summary, page: d, to: docPath(d), hay: `${d.name} ${d.summary} ${d.group}`.toLowerCase(), weight: 3 });
		for (const [key, anchor, label, tab] of SECTIONS) {
			const items = d[key] as { t?: string; decision?: string; why?: string }[] | undefined;
			if (!items?.length) continue;
			out.push({ kind: "section", title: `${d.name} › ${label}`, page: d, to: link(d, anchor, tab), hay: `${d.name} ${label}`.toLowerCase(), weight: 2 });
			for (const b of items) {
				const t = b.t ?? `${(b.decision ?? "").replace(/\.?$/, ".")} ${b.why}`;
				out.push({ kind: "rule", title: `${d.name} › ${label}`, text: t, page: d, to: link(d, anchor, tab), hay: t.toLowerCase(), weight: 1 });
			}
		}
		for (const e of examplesFor(d.id)) {
			out.push({ kind: "example", title: `${d.name} › ${e.title}`, text: e.description, page: d, to: link(d, `ex-${e.id}`, "examples"), hay: `${d.name} ${e.title} ${e.description ?? ""}`.toLowerCase(), weight: 2 });
		}
	}
	const agents = docs[0];
	for (const g of rules.groups)
		for (const r of g.rules)
			out.push({ kind: "rule", title: `Rule › ${g.title}`, text: `${r.rule} ${r.why}`, page: agents, to: `/for-agents#${g.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, hay: `${g.title} ${r.rule} ${r.why}`.toLowerCase(), weight: 2 });
	for (const j of jobs.jobs) {
		const d = docById[j.use];
		if (!d) continue;
		out.push({ kind: "job", title: j.job, text: `Use ${d.name}${"how" in j && j.how ? `: ${j.how}` : ""}`, page: d, to: docPath(d), hay: `${j.job} ${d.name}`.toLowerCase(), weight: 3 });
	}
	return out;
}

const STOP = new Set(["a", "an", "the", "to", "of", "and", "or", "for", "in", "on", "is", "it", "my", "with"]);
const terms = (q: string) => q.toLowerCase().split(/\s+/).filter((w) => w && !STOP.has(w));
const startsWord = (hay: string, w: string) => new RegExp(`(^|[^a-z0-9])${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(hay);

function search(index: Entry[], q: string): Hit[] {
	const words = terms(q);
	if (!words.length) return [];
	const hits: Hit[] = [];
	for (const e of index) {
		if (!words.every((w) => startsWord(e.hay, w))) continue;
		const titleHit = words.every((w) => startsWord(e.title.toLowerCase(), w));
		const starts = e.title.toLowerCase().startsWith(words[0]);
		hits.push({ ...e, score: e.weight * 10 + (titleHit ? 8 : 0) + (starts ? 6 : 0) - e.hay.length / 400 });
	}
	return hits.sort((a, b) => b.score - a.score).slice(0, 40);
}

const ORDER: Hit["kind"][] = ["page", "job", "section", "example", "rule"];

const LIMIT: Record<Hit["kind"], number> = { job: 3, page: 5, section: 4, example: 3, rule: 5 };
const LABEL: Record<Hit["kind"], string> = { job: "Which component for", page: "Pages", section: "Sections", example: "Examples", rule: "Guidelines" };
const kindName = (d: Doc) => (d.kind === "foundation" ? "Foundation" : d.kind === "pattern" ? "Pattern" : "Component");

function Row({ h }: { h: Hit }) {
	const Icon = h.kind === "job" ? Workflow : h.kind === "page" ? FileText : h.kind === "rule" ? ListChecks : Hash;
	if (h.kind === "job")
		return (
			<>
				<Icon aria-hidden="true" />
				<span className="min-w-0 truncate">{h.title}</span>
				<CommandShortcut className="text-ink-2">
					<ArrowRight className="size-3.5" aria-hidden="true" />
					{h.page.name}
				</CommandShortcut>
			</>
		);
	if (h.kind === "page")
		return (
			<>
				<Icon aria-hidden="true" />
				<span className="shrink-0">{h.title}</span>
				<CommandItemMeta>{h.text}</CommandItemMeta>
				<CommandShortcut>{kindName(h.page)}</CommandShortcut>
			</>
		);
	const [page, section] = h.title.split(" › ");
	return (
		<>
			<Icon aria-hidden="true" />
			{h.kind === "rule" ? (
				<span className="min-w-0 truncate">{h.text}</span>
			) : (
				<span className="shrink-0">{section ?? page}</span>
			)}
			{h.kind !== "rule" && h.text && <CommandItemMeta>{h.text}</CommandItemMeta>}
			<CommandShortcut>{page}</CommandShortcut>
		</>
	);
}

const JUMP: [string, string, typeof FileText][] = [
	["/docs", "Get started", BookOpen],
	["/components", "Components", FileText],
	["/foundation", "Foundation", FileText],
	["/patterns", "Patterns", FileText],
	["/for-agents", "For AI agents", Workflow],
	["/licence", "Licence", FileText],
];
const SUGGEST = ["confirm an action", "filter a list", "show status", "loading", "Ask first", "contrast"];

/** `initialQuery` carries over what someone typed in the sidebar filter when it found nothing in the navigation. */
export function SearchDialog({ open, onClose, initialQuery = "" }: { open: boolean; onClose: () => void; initialQuery?: string }) {
	const index = useMemo(buildIndex, []);
	const [q, setQ] = useState("");
	const navigate = useNavigate();
	const hits = useMemo(() => search(index, q), [index, q]);
	useEffect(() => {
		if (open) setQ(initialQuery);
	}, [open, initialQuery]);
	const go = (to: string) => {
		onClose();
		navigate(to);
	};
	return (
		<CommandDialog open={open} onOpenChange={(o) => !o && onClose()} title="Search TwoUX" description="Search pages, components and rules" commandProps={{ shouldFilter: false, loop: true }}>
				<CommandInput value={q} onValueChange={setQ} placeholder="Search pages, components, rules…" />
				<CommandList>
					{!q ? (
						<>
							<CommandGroup heading="Jump to">
								{JUMP.map(([to, label, Icon]) => (
									<CommandItem key={to} value={`jump-${to}`} onSelect={() => go(to)}>
										<Icon aria-hidden="true" />
										{label}
									</CommandItem>
								))}
							</CommandGroup>
							<CommandGroup heading="Try a job">
								{SUGGEST.map((t) => (
									<CommandItem key={t} value={`try-${t}`} onSelect={() => setQ(t)}>
										<SearchIcon aria-hidden="true" />
										<span>{t}</span>
									</CommandItem>
								))}
							</CommandGroup>
						</>
					) : (
						<>
							<CommandEmpty>No results for “{q}”. Try the job, such as “undo” or “empty”.</CommandEmpty>
							{ORDER.map((k) => {
								const group = hits.filter((h) => h.kind === k).slice(0, LIMIT[k]);
								if (!group.length) return null;
								return (
									<CommandGroup key={k} heading={LABEL[k]}>
										{group.map((h) => (
											<CommandItem key={`${k}-${h.to}-${h.title}-${h.text ?? ""}`} value={`${k}-${h.to}-${h.title}-${h.text ?? ""}`} onSelect={() => go(h.to)}>
												<Row h={h} />
											</CommandItem>
										))}
									</CommandGroup>
								);
							})}
						</>
					)}
				</CommandList>
				<CommandFooter>
					<span className="flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
					<span className="flex items-center gap-1"><Kbd>↵</Kbd> open</span>
					<span className="flex items-center gap-1"><Kbd>esc</Kbd> close</span>
					<span className="ml-auto">{q ? `${hits.length} results` : `${docs.length} pages`}</span>
				</CommandFooter>
		</CommandDialog>
	);
}
