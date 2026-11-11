import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, Kbd } from "@twoux/ui";
import { Copy, ExternalLink, MoreHorizontal, Pencil, Trash2, UserRound } from "lucide-react";
export const meta = {"title": "Actions on a record", "description": "Shortcuts on the right, destructive last and separated. Submenus open on the side with room. Arrow keys and typeahead work.", "order": 1};

export default function Example() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" aria-label="Actions for Junior Product Designer" size="icon"><MoreHorizontal /></Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuLabel>Listing</DropdownMenuLabel>
				<DropdownMenuItem><Pencil />Edit<DropdownMenuShortcut><Kbd>E</Kbd></DropdownMenuShortcut></DropdownMenuItem>
				<DropdownMenuItem><Copy />Duplicate<DropdownMenuShortcut><Kbd>D</Kbd></DropdownMenuShortcut></DropdownMenuItem>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger><UserRound />Change owner</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>Grace L.</DropdownMenuItem>
						<DropdownMenuItem>Rahul S.</DropdownMenuItem>
						<DropdownMenuItem>Jess M.</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuItem><ExternalLink />View public page</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive"><Trash2 />Delete listing</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
