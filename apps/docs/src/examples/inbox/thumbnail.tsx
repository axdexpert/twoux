import { Badge, Tabs, TabsList, TabsTrigger } from "@twoux/ui";

/* The Inbox's list pane, built with the classes Inbox uses: view tabs with counts, then the item that blocks an agent,
   first and selected. The other items and the detail pane are left out to fit. */
const ITEMS = [
	{ title: "Approve: extend 3 listings", source: "Agent · Weekly check", time: "09:12", needsYou: true },
];

export default function Thumbnail() {
	return (
		<div className="w-64 overflow-hidden rounded-sm border border-line bg-surface" aria-hidden="true">
			<Tabs value="inbox" className="px-3 pt-2">
				<TabsList aria-label="Inbox views">
					<TabsTrigger value="inbox" count={3} tabIndex={-1}>Inbox</TabsTrigger>
					<TabsTrigger value="snoozed" count={0} tabIndex={-1}>Snoozed</TabsTrigger>
					<TabsTrigger value="done" count={1} tabIndex={-1}>Done</TabsTrigger>
				</TabsList>
			</Tabs>
			<ul className="py-1">
				{ITEMS.map((it, i) => (
					<li key={it.title} className={`mx-1 grid gap-0.5 rounded-xs px-2.5 py-2 ${i === 0 ? "bg-selected" : ""}`}>
						<span className="flex items-center gap-2">
							<span className="min-w-0 flex-1 truncate text-base font-medium text-ink">{it.title}</span>
							<span className="tabular shrink-0 text-sm text-ink-3">{it.time}</span>
						</span>
						<span className="flex items-center gap-2">
							<span className="min-w-0 flex-1 truncate text-sm text-ink-2">{it.source}</span>
							{it.needsYou && <Badge variant="warning" dot>Needs you</Badge>}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
