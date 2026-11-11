import { AssistantMessage, Citation, Tabs, TabsList, TabsTrigger } from "@twoux/ui";

/* AssistantPage's layout, built from its own markup at a smaller size: Answer and Records tabs over the thread, and the
   Sources column on the right. The question and the composer are left out to fit. */
export default function Thumbnail() {
	return (
		<div className="grid w-64 grid-cols-[minmax(0,1fr)_80px] overflow-hidden rounded-sm border border-line bg-surface" aria-hidden="true">
			<Tabs value="answer" className="min-w-0 gap-0">
				<div className="border-b border-line px-2.5">
					<TabsList aria-label="Assistant views" className="border-b-0">
						<TabsTrigger tabIndex={-1} value="answer">Answer</TabsTrigger>
						<TabsTrigger tabIndex={-1} value="records">Records</TabsTrigger>
					</TabsList>
				</div>
				<div className="grid content-start p-2.5">
					<AssistantMessage from="listings"><p><strong>2 listings</strong> <Citation id="LST-1041" /></p></AssistantMessage>
				</div>
			</Tabs>
			<aside aria-label="Sources" className="grid content-start gap-1 border-l border-line bg-surface-2 p-1.5">
				<span className="text-sm font-medium text-ink-2">Sources</span>
				{["LST-1041", "LST-1044"].map((id) => <span key={id} className="rounded-xs border border-line bg-surface px-1 py-0.5 font-mono text-xs text-ink-3">{id}</span>)}
			</aside>
		</div>
	);
}
