# Dropdown menu

Opens a short list of actions or options from a button, with optional groups and one level of submenus.

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- To group related actions behind one button: Export, row actions, Add context.
- For about 5 to 15 commands, ordered by how often they are used.
- For settings with a current value, shown on the right and changed in a one-level submenu: Writing style Concise.

## When not to use

- For one or two actions. Show them as Buttons.
- When people must search or pick from a long list of values. Use a select or combobox.
- For the main action in a view. Use a primary Button.
- For rich content or forms. Use a popover or dialog.

## Structure

1. Trigger button with chevron
2. Menu panel
3. Group label (optional)
4. Menu item: icon, label, shortcut or current value
5. Separator
6. Submenu caret
7. Destructive item (last)

## Guidelines

- Panel 200px minimum, 10px radius, 4px padding, shadow. Items 30px high, 6px radius, hover in grey.
- Group with uppercase group labels and separators; put destructive items last, in red, after a separator.
- At most one level of submenu. Submenus open on hover, focus or Right arrow, and flip to the side with room.
- Icons on items: none by default. Add them only when every item in a group has a well-known icon from the icon meaning table, and then on all items in that group; never on one item alone. The label always stays, and the icon is 14px and muted.
- Show each item's shortcut on the right.
- Disable items that do not apply rather than hide them, so people can still find them.
- Keep the list under about 12 items.

## Content

- Action items start with a verb; navigation items are nouns.
- Sentence case, one line, no articles: Duplicate listing.
- Front-load the key word so the list scans: Export CSV, Export PDF.
- Ellipsis for items that open more input: Extend to a date…

## Accessibility

- Trigger has aria-haspopup="menu" and aria-expanded. Enter, Space or Down opens and focuses the first item.
- role="menu" with menuitem, menuitemcheckbox or menuitemradio; checked items use aria-checked.
- Up and Down move, Right opens a submenu, Left closes it, Esc closes and returns focus to the trigger.
- Items are 30px high, above the 24px target minimum.
- Focus returns to the trigger on close, so the person is not lost.

## Keyboard

| Keys | Action |
|---|---|
| Enter / Space / Down | Open the menu and focus the first item |
| Up / Down | Move between items |
| Right | Open a submenu |
| Left | Close a submenu |
| Home / End | First or last item |
| Type a letter | Jump to the next item starting with it |
| Esc | Close and return focus to the trigger |

## Examples

### actions

```tsx
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
```

### options

```tsx
import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@twoux/ui";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
export const meta = {"title": "Options with a check", "description": "Radio items for one choice, checkbox items for several. The menu stays a menu: it does not replace a form.", "order": 2};

export default function Example() {
	const [sort, setSort] = useState("posted");
	const [cols, setCols] = useState({ salary: true, owner: false });
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild><Button variant="outline">Display<ChevronDown /></Button></DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuLabel>Sort by</DropdownMenuLabel>
				<DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
					<DropdownMenuRadioItem value="posted">Posted date</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="applies">Applies</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuLabel>Columns</DropdownMenuLabel>
				<DropdownMenuCheckboxItem checked={cols.salary} onCheckedChange={(v) => setCols({ ...cols, salary: v })}>Salary</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem checked={cols.owner} onCheckedChange={(v) => setCols({ ...cols, owner: v })}>Owner</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
```

## Related

- Button
- Popover rules
- Keyboard shortcut hint
