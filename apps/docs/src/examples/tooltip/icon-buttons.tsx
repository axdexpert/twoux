import { Button, Kbd, Tooltip, TooltipContent, TooltipTrigger } from "@twoux/ui";
import { Bell, Pencil, X } from "lucide-react";

export const meta = { title: "Name an icon button", description: "Hover or Tab to a button. The tooltip repeats the accessible name and its shortcut. It never holds information found nowhere else.", order: 1 };

export default function Example() {
	return (
		<div className="flex items-center gap-2">
			<Tooltip>
				<TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Edit listing"><Pencil /></Button></TooltipTrigger>
				<TooltipContent>Edit listing <Kbd>E</Kbd></TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Inbox"><Bell /></Button></TooltipTrigger>
				<TooltipContent>Inbox</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild><Button variant="ghost" size="icon" aria-label="Close details"><X /></Button></TooltipTrigger>
				<TooltipContent side="bottom">Close details <Kbd>Esc</Kbd></TooltipContent>
			</Tooltip>
		</div>
	);
}
