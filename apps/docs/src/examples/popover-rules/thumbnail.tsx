import { Button, FilterBar, FilterPill } from "@twoux/ui";

/* The one-at-a-time example in small: the Status filter is closed because the Actions menu is open, 4px under its
   trigger and inside the frame. The menu is drawn with DropdownMenuContent's and DropdownMenuItem's classes. */
export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-1" aria-hidden="true">
			<div className="flex items-center justify-between gap-3">
				<FilterBar><FilterPill field="Status" options={[]} selected={[]} onChange={() => {}} /></FilterBar>
				<Button variant="outline" size="sm" tabIndex={-1} aria-expanded="true">Actions</Button>
			</div>
			<div className="min-w-32 justify-self-end rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
				<div className="flex items-center gap-2 rounded-xs bg-accent px-2 py-1.5 text-base text-accent-foreground">Duplicate</div>
				<div className="flex items-center gap-2 rounded-xs px-2 py-1.5 text-base">Archive</div>
			</div>
		</div>
	);
}
