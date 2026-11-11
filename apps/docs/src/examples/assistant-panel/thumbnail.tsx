import { AiMark, Button } from "@twoux/ui";
import { ArrowUp, Maximize2, X } from "lucide-react";

/* AssistantPanel, built from SidePanel's and MessageComposer's markup at a smaller size: the header bar with the title,
   Open as page and Close, the empty-thread prompt, and the composer with its context chip and Send. */
export default function Thumbnail() {
	return (
		<div className="flex w-64 flex-col overflow-hidden rounded-sm border border-line bg-surface" aria-hidden="true">
			<div className="flex h-9 shrink-0 items-center gap-1 border-b border-line pr-1 pl-3">
				<span className="flex min-w-0 flex-1 items-center gap-1.5 truncate text-base font-semibold text-ink"><AiMark className="size-3.5" />Assistant</span>
				<Button variant="ghost" size="icon-xs" tabIndex={-1} aria-label="Open as full page"><Maximize2 /></Button>
				<Button variant="ghost" size="icon-xs" tabIndex={-1} aria-label="Close assistant"><X /></Button>
			</div>
			<p className="px-3 py-1.5 text-base text-ink-2">Ask about the 2 selected listings.</p>
			<div className="mx-2.5 mb-2.5 flex items-center gap-1 rounded-md border border-input bg-surface p-1 shadow-xs">
				<span className="inline-flex h-5.5 items-center rounded-xs border border-line bg-surface-2 px-1.5 text-sm text-ink-2">2 selected listings</span>
				<span className="flex-1" />
				<Button size="icon-xs" tabIndex={-1} aria-label="Send"><ArrowUp /></Button>
			</div>
		</div>
	);
}
