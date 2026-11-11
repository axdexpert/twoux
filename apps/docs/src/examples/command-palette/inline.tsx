import { Command, CommandEmpty, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut, Kbd } from "@twoux/ui";
import { Briefcase, Clock, Copy, Plus, Users } from "lucide-react";

export const meta = { title: "Commands and pages", description: "One line per item: icon, label, shortcut on the right. Groups have quiet sentence-case labels. Type to filter; arrows and Enter to run.", order: 1 };

export default function Example() {
	return (
		<Command className="w-full max-w-md rounded-sm border border-line shadow-card">
			<CommandInput placeholder="Search or run a command…" />
			<CommandList>
				<CommandEmpty>No results. Try “extend” or “listings”.</CommandEmpty>
				<CommandGroup heading="Actions on 2 listings">
					<CommandItem><Clock />Extend by 30 days<CommandShortcut><Kbd>T</Kbd></CommandShortcut></CommandItem>
					<CommandItem><Copy />Duplicate<CommandShortcut><Kbd>D</Kbd></CommandShortcut></CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Go to">
					<CommandItem><Briefcase />Listings<CommandShortcut><Kbd>G</Kbd><Kbd>L</Kbd></CommandShortcut></CommandItem>
					<CommandItem><Users />Pipeline<CommandShortcut><Kbd>G</Kbd><Kbd>P</Kbd></CommandShortcut></CommandItem>
					<CommandItem><Plus />New listing<CommandShortcut><Kbd>C</Kbd></CommandShortcut></CommandItem>
				</CommandGroup>
			</CommandList>
			<CommandFooter><span className="flex items-center gap-1"><Kbd>↵</Kbd> run</span><span className="flex items-center gap-1"><Kbd>esc</Kbd> close</span></CommandFooter>
		</Command>
	);
}
