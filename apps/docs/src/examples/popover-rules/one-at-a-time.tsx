import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, FilterBar, FilterPill } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "One at a time, never cut off", description: "Open the Status filter, then the menu: the first closes. Each opens 4px from its trigger, flips and shifts to stay 8px inside the screen, and Esc returns focus to the trigger.", order: 1 };

const OPTIONS = ["Open", "Closing soon", "Draft", "Closed"].map((v) => ({ value: v, label: v }));

export default function Example() {
	const [status, setStatus] = useState<string[]>([]);
	return (
		<div className="flex w-full items-center justify-between gap-3">
			<FilterBar><FilterPill field="Status" options={OPTIONS} selected={status} onChange={setStatus} /></FilterBar>
			<DropdownMenu>
				<DropdownMenuTrigger asChild><Button variant="outline" size="sm">Actions</Button></DropdownMenuTrigger>
				<DropdownMenuContent align="end"><DropdownMenuItem>Duplicate</DropdownMenuItem><DropdownMenuItem>Archive</DropdownMenuItem></DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
