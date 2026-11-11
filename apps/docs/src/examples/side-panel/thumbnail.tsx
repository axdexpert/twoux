import { Badge, Button } from "@twoux/ui";
import { ChevronDown, ChevronUp, X } from "lucide-react";

/* SidePanel in push mode beside its list, copied from the component: the selected row stays highlighted, the panel's
   bar has previous, next, the position and Close, and the record's name and status sit under it. */
export default function Thumbnail() {
	return (
		<div className="flex h-28 w-64 overflow-hidden rounded-sm border border-line bg-surface" aria-hidden="true">
			<div className="grid min-w-0 flex-1 content-start">
				{["Designer", "Analyst", "QA lead"].map((r, i) => <span key={r} className={`truncate border-b border-line px-2 py-2 text-base ${i === 1 ? "bg-selected font-medium text-ink" : "text-ink-2"}`}>{r}</span>)}
			</div>
			<aside className="flex w-40 shrink-0 flex-col border-l border-line">
				<div className="flex h-11 shrink-0 items-center gap-1 border-b border-line px-2">
					<Button variant="ghost" size="icon-sm" tabIndex={-1}><ChevronUp /></Button>
					<Button variant="ghost" size="icon-sm" tabIndex={-1}><ChevronDown /></Button>
					<span className="tabular flex-1 px-1 text-sm text-ink-3">2 of 6</span>
					<Button variant="ghost" size="icon-sm" tabIndex={-1}><X /></Button>
				</div>
				<div className="grid gap-1 px-3 pt-2.5">
					<span className="truncate text-lg font-semibold text-ink">Data Analyst</span>
					<span><Badge variant="success" dot>Live</Badge></span>
				</div>
			</aside>
		</div>
	);
}
