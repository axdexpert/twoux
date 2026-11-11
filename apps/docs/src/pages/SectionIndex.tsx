import { Link } from "react-router-dom";
import { H2, OnThisPage } from "../components/docs";
import { DocCard } from "../components/DocCard";
import { docPath, docs } from "../content";
import { PageHeader } from "./ComponentPage";

export const slug = (s: string) => s.toLowerCase().replace(/^patterns: /, "").replace(/[^a-z0-9]+/g, "-");

const SECTIONS = {
	foundation: { title: "Foundation", summary: "The values and principles every component and pattern is built from: colour, type, spacing, density, layout, icons, motion and tokens, plus consistency, accessibility, writing and the keyboard model." },
	pattern: { title: "Patterns", summary: "Which components to combine for a recurring job, and in what order. Use a pattern before designing a new flow, so the same problem is solved the same way on every screen." },
} as const;

export function SectionIndex({ kind }: { kind: "foundation" | "pattern" }) {
	const meta = SECTIONS[kind];
	const items = docs.filter((d) => d.kind === kind);
	const groups = [...new Set(items.map((d) => d.group))];
	return (
		<div className="docs-cols pt-10 pb-20 max-md:pt-8">
			<div className="min-w-0">
			<PageHeader eyebrow="Library" title={meta.title} summary={meta.summary} />
				<article>
					{groups.map((g, gi) => (
						<section key={g}>
							<H2 id={slug(g)} className={gi === 0 ? "mt-0" : undefined}>{g.replace(/^Patterns: (\w)/, (_, c) => c.toUpperCase())}</H2>
							<div className="grid grid-cols-2 gap-3 max-lg:grid-cols-1">
								{items
									.filter((d) => d.group === g)
									.map((d) => (
										<DocCard key={d.id} to={docPath(d)} id={d.id} title={d.name} summary={d.summary} />
									))}
							</div>
						</section>
					))}
				</article>
				</div>
				<OnThisPage items={groups.map((g) => ({ id: slug(g), label: g.replace(/^Patterns: (\w)/, (_, c: string) => c.toUpperCase()) }))} />
		</div>
	);
}
