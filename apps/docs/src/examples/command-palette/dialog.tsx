import { Button, CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut, Kbd } from "@twoux/ui";
import { Search, Settings, Users } from "lucide-react";
import { useState } from "react";

export const meta = { title: "As a dialog (⌘K)", description: "Opens over the page, traps focus, and returns it to where it came from on close (Radix Dialog). Press the button to try.", order: 2 };

export default function Example() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button shortcut="⌘K" onClick={() => setOpen(true)} variant="outline"><Search />Search</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
					<CommandInput placeholder="Search or run a command…" />
					<CommandList>
						<CommandGroup heading="Go to">
							<CommandItem onSelect={() => setOpen(false)}><Users />Members</CommandItem>
							<CommandItem onSelect={() => setOpen(false)}><Settings />Settings<CommandShortcut><Kbd>G</Kbd><Kbd>S</Kbd></CommandShortcut></CommandItem>
						</CommandGroup>
					</CommandList>
			</CommandDialog>
		</>
	);
}
