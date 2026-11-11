import { Button } from "@twoux/ui";
import { ArrowUp, ChevronDown, Plus, X } from "lucide-react";

/* MessageComposer built with its classes and real Buttons: a context chip, the message field showing its placeholder,
   the + menu, the mode and Send. Drawn so the field can be one line tall and the preview fits. */
export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-2 rounded-md border border-input bg-surface p-2 shadow-xs" aria-hidden="true">
			<div className="flex flex-wrap gap-1">
				<span className="inline-flex h-5.5 items-center gap-1 rounded-xs border border-line bg-surface-2 pr-0.5 pl-1.5 text-sm text-ink-2">
					3 selected listings
					<span className="grid size-4 place-items-center rounded-xs text-ink-3"><X className="size-3" aria-hidden="true" /></span>
				</span>
			</div>
			<p className="p-1 text-md whitespace-nowrap text-muted-foreground">Ask about these listings</p>
			<div className="flex items-center gap-1">
				<Button variant="ghost" size="icon-sm" tabIndex={-1} aria-label="Add context or options"><Plus /></Button>
				<Button variant="ghost" size="sm" tabIndex={-1}>Quick<ChevronDown className="text-ink-3" /></Button>
				<span className="flex-1" />
				<Button size="icon-sm" disabled tabIndex={-1} aria-label="Send"><ArrowUp /></Button>
			</div>
		</div>
	);
}
