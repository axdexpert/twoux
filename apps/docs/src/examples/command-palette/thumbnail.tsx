import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut, Kbd } from "@twoux/ui";
import { Clock, Copy } from "lucide-react";

export default function Thumbnail() {
	// A fixed value: cmdk scrolls its selected item into view whenever it picks one, which would scroll the gallery page.
	return (
		<Command value="Extend" className="w-56 rounded-sm border border-line shadow-card">
			<CommandInput placeholder="Search…" />
			<CommandList>
				<CommandGroup>
					<CommandItem><Clock />Extend<CommandShortcut><Kbd>T</Kbd></CommandShortcut></CommandItem>
					<CommandItem><Copy />Duplicate<CommandShortcut><Kbd>D</Kbd></CommandShortcut></CommandItem>
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
