import { Button } from "@twoux/ui";
import { MoreHorizontal, Pencil, X } from "lucide-react";

export const meta = {
	title: "Icon only",
	description: "For well-known actions in dense places. The aria-label names the action and its target, not the icon, and a tooltip shows the same words.",
	order: 7,
};

export default function Example() {
	return (
		<div className="flex items-center gap-4">
			<Button variant="ghost" size="icon-xs" aria-label="Edit Junior Product Designer" title="Edit"><Pencil /></Button>
			<Button variant="ghost" size="icon-sm" aria-label="More actions for this listing" title="More actions"><MoreHorizontal /></Button>
			<Button variant="ghost" size="icon" aria-label="Close details" title="Close (Esc)"><X /></Button>
		</div>
	);
}
