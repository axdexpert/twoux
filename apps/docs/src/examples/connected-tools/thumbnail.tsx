import { Badge } from "@twoux/ui";
import { Plug } from "lucide-react";

/* ConnectedToolCard, built with its own classes: the tool tile, name and kind, status badge, then what it can read and
   change. Data stored, Connected by and the footer are left out to fit. */
export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-3 rounded-sm border border-line bg-surface p-3" aria-hidden="true">
			<div className="flex items-center gap-2.5">
				<span className="grid size-8 place-items-center rounded-sm bg-surface-2 text-ink-2"><Plug className="size-4" /></span>
				<span className="grid min-w-0 flex-1"><span className="truncate text-base font-semibold text-ink">Outlook</span><span className="text-sm text-ink-3">Calendar</span></span>
				<Badge variant="success" dot>Connected</Badge>
			</div>
			<div className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-1.5 text-sm">
				<span className="text-ink-2">Can read</span><span className="text-ink">Busy times</span>
				<span className="text-ink-2">Can change</span><span className="text-ink">Nothing</span>
			</div>
		</div>
	);
}
