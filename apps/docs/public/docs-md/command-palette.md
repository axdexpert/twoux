# Command palette (⌘K)

A searchable list of actions and destinations, scoped to the current selection, opened with ⌘K from anywhere.

Kind: component · Group: Navigation · Status: built, import from @twoux/ui

## When to use

- Run any action by name without hunting through menus, especially on a selection of rows.
- Jump to a record or page by typing part of its name.
- Learn shortcuts: every action shows its key, so the palette teaches the faster path.

## When not to use

- As the only way to reach an action. Every command also exists as a visible button or menu item.
- Filtering the table. Use Filter (F) and its type-ahead field list.
- Confirming irreversible actions. A destructive command picked in the palette still opens the Confirmation dialog.

## Structure

1. Search input with a scope chip ("2 listings") and Esc hint
2. Group: Actions on selection, each with its shortcut
3. Group: Go to (records and pages)
4. Footer hints: ↑ ↓ navigate, ↵ run, Tab change scope

## Guidelines

- Opens centred near the top, up to 560px wide, with focus in the search input.
- Scope defaults to the current selection and shows it as a chip; Tab switches to the whole workspace.
- Order results with actions on the selection first, then Go to; show the most used actions before typing.
- Results update with each keystroke, within 400 ms.
- Enter runs the highlighted item and closes the palette; reversible results offer Undo in a toast.
- Esc closes it and focus returns to where it was.

## Content

- Commands start with a verb and name the object: "Extend end by 30 days", "Export 2 rows as CSV".
- Commands that need more input end with an ellipsis: "Extend end to a date…".
- Use the same command names as the buttons and menus they mirror.
- Placeholder text says what can be typed: "Search or run a command".

## Accessibility

- Built as a modal dialog containing a combobox with a listbox popup; DOM focus stays in the input and aria-activedescendant points to the highlighted item.
- Group headings are exposed as group labels and each option's shortcut is part of its accessible description (1.3.1).
- ⌘K uses a modifier, so it stays on when single-key shortcuts are turned off (2.1.4).
- Announce the number of results through a polite live region as the person types (4.1.3).
- Esc always exits; there is no keyboard trap (2.1.2).

## Keyboard

| Keys | Action |
|---|---|
| ⌘K / Ctrl+K | Open or close the palette |
| ↑ / ↓ | Move through results |
| Enter | Run the highlighted command |
| Tab | Switch scope between selection and workspace |
| Esc | Close and return focus |

## Examples

### dialog

```tsx
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
```

### inline

```tsx
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
```

## Related

- Shortcut sheet (?)
- App shell and sidebar navigation
- Page header
- Toast
