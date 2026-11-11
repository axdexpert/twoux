import { useMeta } from "../components/meta";
import { Badge } from "@twoux/ui";
import { slug } from "./SectionIndex";
import { BookMarked, ListOrdered, Workflow } from "lucide-react";
import { Decisions, Meta, PageHeader, UseCards } from "./ComponentPage";
import { Link, useParams } from "react-router-dom";
import { Bullets, Cites, CopyPage, H2, NumberMarker, OnThisPage, References, Related } from "../components/docs";
import { VISUAL } from "../components/tokens";
import { docById, docPath, isBuilt } from "../content";

/** Foundation and pattern pages share one layout: overview, visual or flow, rules, do and don't, decisions, sources. */
export function FoundationPage() {
	const { id = "" } = useParams();
	const doc = docById[id];
	useMeta(doc ? `${doc.name} · TwoUX ${doc.kind === "pattern" ? "patterns" : "foundation"}` : "TwoUX", doc?.summary);
	if (!doc) return <div className="p-10 text-ink-2">No page called “{id}”.</div>;
	const Visual = VISUAL[id];
	const isPattern = doc.kind === "pattern";

	const sections: [string, string, boolean][] = [
		["overview", "Problem and solution", !!(doc.problem || doc.solution)],
		["visual", "Tokens", !!Visual],
		["how", "How it works", !!doc.steps?.length],
		["principles", "Principles", !!doc.principles?.length],
		["when-to-use", "When to use", !!doc.whenToUse?.length],
		["when-not-to-use", "When not to use", !!doc.whenNotToUse?.length],
		["guidelines", "Guidelines", !!doc.guidelines?.length],
		["content", "Content", !!doc.content?.length],
		["accessibility", "Accessibility", !!doc.accessibility?.length],
		["dos", "Do and don't", !!(doc.dos?.length || doc.donts?.length)],
		["token-list", "Token reference", !!doc.tokens?.length],
		["decisions", "TwoUX decisions", !!doc.decisions?.length],
		["related", "Related", !!doc.related?.length],
	];
	const on = sections.filter(([, , show]) => show);

	return (
		<div className="docs-cols pt-10 pb-20 max-md:pt-8">
			<div className="min-w-0">
			<PageHeader
				eyebrow={<nav aria-label="Breadcrumb"><Link to={isPattern ? "/patterns" : "/foundation"} className="hover:underline">{isPattern ? "Patterns" : "Foundation"}</Link> <span className="px-1 text-ink-3">/</span> <Link to={`${isPattern ? "/patterns" : "/foundation"}#${slug(doc.group)}`} className="hover:underline">{doc.group.replace(/^Patterns: (\w)/, (_, c) => c.toUpperCase())}</Link></nav>}
				title={doc.name}
				summary={doc.summary}
				actions={<CopyPage url={`/docs-md/${doc.id}.md`} title={doc.name} />}
				meta={
					<>
						{isPattern && !!doc.steps?.length && <Meta icon={ListOrdered}>{doc.steps.length} steps</Meta>}
						{isPattern && !!doc.components?.length && <Meta icon={Workflow}>{doc.components.length} components</Meta>}
					</>
				}
			/>
			<article>
				{(doc.problem || doc.solution) && (
					<div id="overview" className="grid scroll-mt-20 gap-3">
						<div className="rounded-sm bg-surface-2 p-4">
							<div className="mb-1.5 text-docs-sm font-medium text-ink-2">Problem</div>
							<p className="text-docs">{doc.problem}</p>
						</div>
						<div className="rounded-sm bg-primary-soft p-4">
							<div className="mb-1.5 text-docs-sm font-medium text-primary-ink">Solution</div>
							<p className="text-docs">{doc.solution}</p>
						</div>
					</div>
				)}

				{isPattern && !!doc.components?.length && (
					<section className="mt-6">
						<div className="mb-2 text-docs-sm font-medium text-ink-2">Built from {doc.components.length} components</div>
						<ul className="grid grid-cols-2 overflow-hidden rounded-sm border border-line max-lg:grid-cols-1">
							{doc.components.map((c) => {
								const d = docById[c];
								if (!d) return null;
								const built = d.kind !== "component" || isBuilt(c);
								return (
									<li key={c} className="border-line border-b odd:border-r last:border-b-0 max-lg:odd:border-r-0 [&:nth-last-child(2):nth-child(odd)]:border-b-0">
										<Link to={docPath(d)} className="flex h-full items-center gap-3 px-3 py-2 transition-colors duration-(--duration-fast) hover:bg-surface-2">
											<span className="min-w-0 flex-1">
												<span className="block text-docs-sm font-medium text-ink">{d.name}</span>
												<span className="block truncate text-docs-sm text-ink-3">{d.summary}</span>
											</span>
											<span title={built ? "Built" : "Planned: guidance only"} className={built ? "size-2 shrink-0 rounded-full bg-ok" : "size-2 shrink-0 rounded-full border border-control"} aria-hidden="true" />
											<span className="sr-only">{built ? "Built" : "Planned"}</span>
										</Link>
									</li>
								);
							})}
						</ul>
					</section>
				)}

				{Visual && (
					<>
						<H2 id="visual">Tokens</H2>
						<p className="mb-5 text-docs text-ink-prose">Values are read live from <code className="rounded-xs bg-hover px-1 font-mono text-sm">packages/ui/src/styles/twoux.css</code>, the only place raw values exist.{id === "motion" ? " Demos run at the real durations and stop when your system asks for reduced motion." : " Contrast is measured in your browser."}</p>
						<Visual />
					</>
				)}

				{!!doc.steps?.length && (
					<>
						<H2 id="how">How it works</H2>
						<ol className="grid gap-4">
							{doc.steps.map((s, i) => (
								<li key={s.t} className="grid grid-cols-[20px_1fr] gap-2.5 text-docs">
									<NumberMarker n={i + 1} />
									<span>
										{s.t}
										<Cites doc={doc} ids={s.s} />
									</span>
								</li>
							))}
						</ol>
					</>
				)}

				{!!doc.principles?.length && (<><H2 id="principles">Principles</H2><Bullets doc={doc} items={doc.principles} /></>)}
				{!!(doc.whenToUse?.length || doc.whenNotToUse?.length) && (<div className="mt-14"><UseCards doc={doc} /></div>)}
				{!!doc.guidelines?.length && (<><H2 id="guidelines">Guidelines</H2><Bullets doc={doc} items={doc.guidelines} /></>)}
				{!!doc.content?.length && (<><H2 id="content">Content</H2><Bullets doc={doc} items={doc.content} /></>)}
				{!!doc.accessibility?.length && (<><H2 id="accessibility">Accessibility</H2><Bullets doc={doc} items={doc.accessibility} /></>)}

				{!!(doc.dos?.length || doc.donts?.length) && (
					<>
						<H2 id="dos">Do and don't</H2>
						<div className="grid gap-3">
							<div className="rounded-sm bg-ok-bg/50 p-4">
								<div className="mb-4"><Badge variant="success">Do</Badge></div>
								<Bullets doc={doc} items={doc.dos} tone="do" />
							</div>
							<div className="rounded-sm bg-bad-bg/50 p-4">
								<div className="mb-4"><Badge variant="destructive">Don't</Badge></div>
								<Bullets doc={doc} items={doc.donts} tone="dont" />
							</div>
						</div>
					</>
				)}

				{!!doc.tokens?.length && (
					<>
						<H2 id="token-list">Token reference</H2>
						<div className="overflow-x-auto rounded-sm border border-line bg-surface">
							<table className="w-full min-w-[620px] border-collapse text-left text-docs-sm">
								<thead className="bg-surface-2 text-sm text-ink-2">
									<tr><th className="px-3 py-2 font-medium">Token</th><th className="px-3 py-2 font-medium">Value</th><th className="px-3 py-2 font-medium">Use</th></tr>
								</thead>
								<tbody>
									{doc.tokens.map((t) => (
										<tr key={t.name} className="border-t border-line align-top">
											<td className="px-3 py-2 font-mono text-sm">{t.name}</td>
											<td className="px-3 py-2 font-mono text-sm text-ink-2">{t.value}</td>
											<td className="px-3 py-2 text-ink-2">{t.use}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</>
				)}

				{!!doc.decisions?.length && (
					<>
						<H2 id="decisions">TwoUX decisions</H2>
						<Decisions doc={doc} />
					</>
				)}
				{!!doc.related?.length && (<><H2 id="related">Related</H2><Related ids={doc.related} /></>)}
			</article>
			</div>
			<OnThisPage items={on.map(([i, label]) => ({ id: i, label }))} />
		</div>
	);
}
