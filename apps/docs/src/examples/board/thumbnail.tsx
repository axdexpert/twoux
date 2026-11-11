import { Button } from "@twoux/ui";
import { Ellipsis, GripVertical } from "lucide-react";

/* Two BoardItems, built from BoardItem's markup (the real one needs a Board): drag handle, title, settings menu, content. */
const ITEMS = [
	{ title: "Applied", value: "595", change: "↑ 12%", good: true },
	{ title: "Listings", value: "14", change: "↓ 2", good: false },
];

export default function Thumbnail() {
	return (
		<div className="grid w-64 grid-cols-2 gap-2" aria-hidden="true">
			{ITEMS.map((it) => (
				<article key={it.title} className="flex flex-col rounded-sm border border-line bg-surface shadow-card">
					<header className="flex items-start gap-1 py-2 pr-1 pl-1">
						<span className="mt-px grid size-6 shrink-0 place-items-center rounded-xs text-ink-3"><GripVertical className="size-3.5" /></span>
						<span className="min-w-0 flex-1 truncate pt-0.5 text-base font-semibold text-ink">{it.title}</span>
						<Button variant="ghost" size="icon-xs" tabIndex={-1} aria-label={`Settings for ${it.title}`}><Ellipsis /></Button>
					</header>
					<div className="grid gap-0.5 px-3 pb-3">
						<span className="tabular text-xl font-semibold text-ink">{it.value}</span>
						<span className={it.good ? "text-sm font-medium text-ok" : "text-sm font-medium text-ink"}>{it.change}</span>
					</div>
				</article>
			))}
		</div>
	);
}
