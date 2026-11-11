import { Button, Kbd } from "@twoux/ui";
import { Pencil } from "lucide-react";

/* An icon button with its tooltip open above it. The bubble copies TooltipContent's classes and arrow, and its
   data-slot lets the real Kbd take its tooltip styling. */
export default function Thumbnail() {
	return (
		<div className="grid justify-items-center gap-1" aria-hidden="true">
			<span data-slot="tooltip-content" className="relative flex w-fit items-center gap-2 rounded-sm bg-foreground px-2 py-1 text-sm text-background">
				Edit listing <Kbd>E</Kbd>
				<span className="absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-xs bg-foreground" />
			</span>
			<Button variant="ghost" size="icon" tabIndex={-1} className="bg-hover"><Pencil /></Button>
		</div>
	);
}
