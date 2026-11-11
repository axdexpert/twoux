# Split button

A button joined to a chevron: the button runs the usual action (Import data), the chevron opens its variants (Import all, Import selection).

Kind: component · Group: Actions and inputs · Status: built, import from @twoux/ui

## When to use

- One action is the usual choice and a few close variants of it are needed now and then, such as Import data with Import all and Import selection.
- Space is tight and the variants belong together, as in a table header toolbar.

## When not to use

- For unrelated actions. Use separate buttons, or a Dropdown menu behind More actions.
- When no option is clearly the usual one. Use a menu button (Button with a chevron) so people choose every time.
- For a destructive main action. Put destructive variants in the menu, never on the main part.

## Structure

1. Main part: icon (optional) and label
2. Divider
3. Chevron part with its own name, opening a menu

## Guidelines

- Use SplitButton instead of joining a Button and a menu by hand, so the parts, divider, names and menu alignment are the same everywhere.
- The main part runs the action at once; the chevron only opens the menu. Repeat the main action first in the menu so the list is complete.
- Outline by default. Use the primary variant only when it is the view's one primary action.
- Disable a variant that can't run yet (Import selection with nothing selected) rather than hiding it, and say why nearby.

## Content

- Main label: a verb and an object, Import data. Menu items: short variants, Import all, Import selection.
- Name the chevron by what it opens: More import options.

## Accessibility

- Two buttons in a group: the main button, then a menu button with aria-haspopup, aria-expanded and its own accessible name.
- 2.5.8 Target size: the chevron part is at least 24px wide.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move from the main part to the chevron |
| Enter / Space | Run the main action, or open the menu from the chevron |
| ↓ (chevron) | Open the menu on the first item |
| Esc | Close the menu and return to the chevron |

## Examples

### import

```tsx
import { DropdownMenuItem, DropdownMenuSeparator, SplitButton, toast } from "@twoux/ui";
import { FileSpreadsheet, Upload } from "lucide-react";

export const meta = { title: "Import data", description: "The main part runs the usual action. The chevron, named “More import options”, opens its variants; Import selection is disabled until rows are selected.", order: 1 };

export default function Example() {
	return (
		<div className="flex flex-wrap items-center gap-3">
			<SplitButton
				onClick={() => toast("Choose a CSV or Excel file to import")}
				menuLabel="More import options"
				menu={
					<>
						<DropdownMenuItem onSelect={() => toast("Importing all rows from the file")}>Import all</DropdownMenuItem>
						<DropdownMenuItem disabled>Import selection</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={() => toast("Downloaded the import template")}><FileSpreadsheet />Download template</DropdownMenuItem>
					</>
				}
			>
				<Upload />Import data
			</SplitButton>
			<SplitButton
				variant="default"
				onClick={() => toast.success("Published 12 products")}
				menuLabel="More publish options"
				menu={
					<>
						<DropdownMenuItem onSelect={() => toast.success("Published 12 products")}>Publish now</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => toast("Scheduled for 9:00 tomorrow")}>Schedule for tomorrow</DropdownMenuItem>
					</>
				}
			>
				Publish 12 products
			</SplitButton>
		</div>
	);
}
```

## Related

- Button
- Dropdown menu
- Dense table
- CSV import
