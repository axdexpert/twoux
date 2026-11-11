# Bulk action bar

A grey band directly above the table while rows are selected: the actions that apply to every selected row, the count and Clear selection.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- People act on several records at once; checkboxes plus batch actions is the standard pattern.
- An action applies to all selected items, such as extending or closing listings.
- People select rows from the keyboard with X or Shift with J and K, then act without reaching for the mouse.

## When not to use

- For one or two actions on a single row. Use inline row actions or the side panel.
- For actions on the whole table regardless of selection, such as Export. Put them in the table toolbar.

## Structure

1. Band directly above the table, below any filters; the header row stays visible
2. Actions with icons and shortcuts, up to four (Ask, Extend 30 days, Duplicate); the rest in More
3. Destructive action (Close listings)
4. Count ("2 listings selected") and Clear selection (Esc)

## Guidelines

- Show the bar only while rows are selected, and always show how many.
- Place the bar directly above the table, below the filters, so the filters and the column headers stay in view.
- Show up to four actions as buttons. The rest, and any that don't fit the width, move into a More menu that keeps their shortcuts; never shrink actions to icons only.
- Exit by clearing the selection or pressing Esc.
- Disable row-level actions while the bulk bar is showing so the two do not compete.
- Confirm destructive bulk actions in a dialog that states the count and consequence, and offer Undo when the action can be reversed.
- Selection on the header checkbox covers the visible page only, and actions affect only selected rows.

## Content

- Label actions verb plus noun, "Close listings", and put the count in confirmations, "Close 2 listings?".
- Show each action's shortcut on the button.
- Put destructive actions last.

## Accessibility

- APG toolbar pattern: role="toolbar" with aria-label "Bulk actions", one tab stop, arrow keys between buttons.
- 4.1.3 Status Messages: announce "2 listings selected" when the count changes.
- 2.4.11 Focus Not Obscured: the bar sits in the page flow above the table, so it never covers a focused row.
- 2.5.8 Target Size: every button is at least 24 by 24 CSS pixels.

## Keyboard

| Keys | Action |
|---|---|
| ← → | Move between actions |
| T | Extend 30 days |
| D | Duplicate |
| ⇧C | Close listings (asks to confirm) |
| ⌘J | Ask the assistant about the selection |
| Esc | Clear the selection |

## Examples

### selection

```tsx
import { BulkActionBar, Button, Checkbox, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, toast } from "@twoux/ui";
import { CalendarPlus, Copy } from "lucide-react";
import { useState } from "react";
import { LISTINGS } from "../list-table/data";

export const meta = { title: "Act on selected listings", description: "While rows are selected, a band appears directly above the table with the actions, then the count and Clear selection. The header row and any filters stay in view. Arrow keys move between its buttons; Esc clears.", order: 1 };

const ROWS = LISTINGS.slice(0, 4);

export default function Example() {
	const [sel, setSel] = useState<string[]>([ROWS[0].id, ROWS[2].id]);
	const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
	const all = sel.length === ROWS.length ? true : sel.length ? "indeterminate" : false;
	const setAll = (v: boolean) => setSel(v ? ROWS.map((r) => r.id) : []);
	const n = sel.length;
	return (
		<div className="w-full max-w-xl overflow-hidden rounded-sm border border-line bg-surface">
			<BulkActionBar count={n} noun={n === 1 ? "listing" : "listings"} onClear={() => setSel([])} actions={[
					{ label: "Extend 30 days", icon: <CalendarPlus />, shortcut: "T", onSelect: () => toast.success(`Extended ${n} listing${n === 1 ? "" : "s"} by 30 days`, { action: { label: "Undo", onClick: () => {} } }) },
					{ label: "Duplicate", icon: <Copy />, shortcut: "D", onSelect: () => toast.success(`Duplicated ${n} listing${n === 1 ? "" : "s"}`) },
				]} />
			<Table aria-label="Listings">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead className="w-9"><Checkbox aria-label="Select all on this page" checked={all} onCheckedChange={(v) => setAll(!!v)} /></TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Location</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{ROWS.map((r) => (
						<TableRow key={r.id} data-state={sel.includes(r.id) ? "selected" : undefined}>
							<TableCell><Checkbox checked={sel.includes(r.id)} onCheckedChange={() => toggle(r.id)} aria-label={`Select ${r.role}`} /></TableCell>
							<TableCell className="font-medium text-ink">{r.role}</TableCell>
							<TableCell className="text-ink-2">{r.location}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
```

## Related

- List table
- Data grid
- Export menu
