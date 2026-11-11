import { useMeta } from "../components/meta";
import { Check, X } from "lucide-react";
import type { ReactNode } from "react";
import licence from "../../../../LICENSE.md?raw";
import { H2, OnThisPage } from "../components/docs";
import { PageHeader } from "./ComponentPage";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const MAY = ["Use TwoUX in any number of your own products, commercial or not", "Build products for clients and hand them over", "Modify the components and let your coding agents read every file", "Ship TwoUX inside your product, in source or compiled form"];
const MAY_NOT = ["Sell or give away TwoUX, or a modified copy, as a design system, UI kit, template or component library", "Offer a service that hands TwoUX components or knowledge files to other people", "Train, fine-tune or evaluate a machine learning model on TwoUX or its documentation", "Use the TwoUX name or logo for your own product"];

/** The licence text, from LICENSE.md at the repository root: "## " starts a section, "1. " a numbered clause. */
function parse(md: string) {
	const sections: { title: string; blocks: ReactNode[] }[] = [];
	let list: string[] = [];
	const flush = () => {
		if (!list.length) return;
		const items = list;
		sections.at(-1)?.blocks.push(<ol key={sections.at(-1)!.blocks.length} className="grid list-decimal gap-2 pl-6 text-docs text-ink-prose">{items.map((t) => <li key={t}>{t}</li>)}</ol>);
		list = [];
	};
	for (const line of md.split("\n")) {
		if (line.startsWith("# ")) { sections.push({ title: "", blocks: [] }); continue; }
		if (line.startsWith("## ")) { flush(); sections.push({ title: line.slice(3), blocks: [] }); continue; }
		const item = line.match(/^\d+\.\s+(.*)/);
		if (item) { list.push(item[1]); continue; }
		flush();
		if (line.trim()) sections.at(-1)?.blocks.push(<p key={sections.at(-1)!.blocks.length} className="text-docs text-ink-prose">{line}</p>);
	}
	flush();
	return sections;
}

function Summary({ title, items, ok }: { title: string; items: string[]; ok: boolean }) {
	const Icon = ok ? Check : X;
	return (
		<div className="rounded-sm border border-line bg-surface p-4">
			<h3 className="text-docs font-semibold text-ink">{title}</h3>
			<ul className="mt-3 grid gap-2">
				{items.map((t) => (
					<li key={t} className="flex gap-2 text-docs text-ink-prose">
						<Icon className={ok ? "mt-1 size-3.5 shrink-0 text-ok" : "mt-1 size-3.5 shrink-0 text-bad"} aria-hidden="true" />
						{t}
					</li>
				))}
			</ul>
		</div>
	);
}

export function Licence() {
	useMeta("Licence · TwoUX", "TwoUX is free to use in your own products, including commercial products and client work. It may not be sold or republished as a design system, UI kit or component library.");
	const [intro, ...sections] = parse(licence);
	return (
		<div className="docs-cols pt-10 pb-20 max-md:pt-8">
			<div className="min-w-0">
				<PageHeader eyebrow="Get started" title="Licence" summary="Every component, pattern and knowledge file in TwoUX is free to use. The TwoUX Licence lets you build and ship your own products with it, and stops anyone selling or republishing TwoUX as their own kit." />
				<article>
					<H2 id="in-short">In short</H2>
					<div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
						<Summary title="You may" items={MAY} ok />
						<Summary title="You may not" items={MAY_NOT} ok={false} />
					</div>
					<p className="mt-4 text-docs-sm text-ink-2">This summary is not the licence. If they differ, the full text below applies.</p>
					<H2 id="full-text">TwoUX Licence 1.0</H2>
					<div className="grid gap-3">{intro?.blocks}</div>
					{sections.map((s) => (
						<section key={s.title} aria-labelledby={slug(s.title)} className="mt-8 grid gap-3">
							<h3 id={slug(s.title)} className="scroll-mt-16 text-docs-h3 font-semibold text-ink">{s.title}</h3>
							{s.blocks}
						</section>
					))}
				</article>
			</div>
			<OnThisPage items={[{ id: "in-short", label: "In short" }, { id: "full-text", label: "Full text" }, ...sections.map((s) => ({ id: slug(s.title), label: s.title }))]} />
		</div>
	);
}
