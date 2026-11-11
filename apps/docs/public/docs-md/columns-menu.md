# Columns menu

A menu that shows, hides and reorders the columns of a sheet or list table, with search, Show all and Hide all, type icons and eye toggles, plus wrapping and rows per page on list tables. Changes apply at once.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- On a sheet or list table where people change which columns they see while they work and expect the change at once.
- A table has more columns than most people need at once; let each person show, hide and reorder them.
- People choose page size or line wrapping for their own work on a list table.

## When not to use

- To change what a column holds. Use the column menu in the sheet.
- For filtering rows. Use the TwoUX Filter bar.
- For saving a full working setup with filters. Use TwoUX Saved views.
- As the main way to make a table usable; most people never customise, so defaults must already work.

## Structure

1. Button: Columns
2. Search field
3. Count with Show all and Hide all
4. Row per column: drag handle, type icon, name, Move up, Move down, eye toggle or lock
5. List tables: Wrap long text and Rows per page (25, 50, 100)
6. Where the choice is kept ("Saved for you on this table") and the help line for keyboard reordering

## Guidelines

- Apply each change at once; there is nothing to confirm. Changing it back is the undo.
- Every drag has a keyboard path (Space to pick up, arrows, Space to drop, Esc to cancel) and Move up and Move down buttons.
- The column that names the record is locked: always shown, marked with a lock and the words Always shown.
- Show the type icon of each column so people recognise it among similar names.
- List columns in the same order they appear in the table.
- Store the choice per person and per table, restore it on return, and say so in the menu: "Saved for you on this table".
- Rows per page is a radio group, not a select, so the menu never opens a second popover.

## Content

- Use sentence case and plain labels, for example "Wrap long text".
- Zero results: No columns match "cost".

## Accessibility

- Eye toggles are buttons with aria-pressed and a name that says what they do: Hide Email.
- Moves are announced: Email moved to position 3 of 10.
- 2.5.7 Dragging movements: the Move buttons do the same as dragging.
- Wrap long text is a labelled switch; Rows per page is a radio group named by its label.

## Keyboard

| Keys | Action |
|---|---|
| Space / Enter on a handle | Pick up or drop |
| ↑ ↓ (picked up) | Move the column |
| Esc (picked up) | Cancel the move |
| Esc | Close the menu; focus returns to Columns |

## Examples

### list-table

```tsx
import { ColumnsMenu, type ColumnsMenuItem, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@twoux/ui";
import { useState } from "react";
import { LISTINGS, type Listing, formatDate } from "../list-table/data";

export const meta = { title: "On a list table", description: "The same menu on a list table, with Wrap long text and Rows per page. Role is locked so every row stays recognisable. Every change applies at once.", order: 2 };

const CELL: Record<string, (l: Listing) => string | number> = { role: (l) => l.role, location: (l) => l.location, status: (l) => l.status, applicants: (l) => l.applicants, closes: (l) => formatDate(l.closes) };

export default function Example() {
	const [columns, setColumns] = useState<ColumnsMenuItem[]>([
		{ id: "role", label: "Role", locked: true },
		{ id: "location", label: "Location" },
		{ id: "status", label: "Status" },
		{ id: "applicants", label: "Applicants", hidden: true },
		{ id: "closes", label: "Closes" },
	]);
	const [wrap, setWrap] = useState(false);
	const [pageSize, setPageSize] = useState(25);
	const cols = columns.filter((c) => !c.hidden);
	return (
		<div className="grid w-full max-w-2xl gap-2">
			<div className="flex justify-end">
				<ColumnsMenu columns={columns} onChange={setColumns} wrap={wrap} onWrapChange={setWrap} pageSize={pageSize} onPageSizeChange={setPageSize} note="Saved for you on this table" />
			</div>
			<div className="overflow-hidden rounded-sm border border-line bg-surface">
				<Table aria-label="Listings">
					<TableHeader>
						<TableRow className="hover:bg-transparent">{cols.map((c) => <TableHead key={c.id}>{c.label}</TableHead>)}</TableRow>
					</TableHeader>
					<TableBody>
						{LISTINGS.slice(0, 4).map((l) => (
							<TableRow key={l.id}>{cols.map((c) => <TableCell key={c.id} className={wrap ? "whitespace-normal" : undefined}>{CELL[c.id](l)}</TableCell>)}</TableRow>
						))}
					</TableBody>
				</Table>
				<p className="tabular border-t border-line px-3 py-2 text-sm text-ink-2">Showing 1–4 of {LISTINGS.length} listings · {pageSize} per page</p>
			</div>
		</div>
	);
}
```

### sheet

```tsx
import { ColumnsMenu, type ColumnsMenuItem } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Show, hide and reorder columns", description: "Changes apply at once. Drag a handle, use Move up and Move down, or focus a handle, press Space, move with the arrow keys and press Space to drop.", order: 1 };

export default function Example() {
	const [columns, setColumns] = useState<ColumnsMenuItem[]>([
		{ id: "name", label: "Name", type: "text", locked: true },
		{ id: "title", label: "Job title", type: "text" },
		{ id: "company", label: "Company", type: "text" },
		{ id: "size", label: "Company size", type: "number" },
		{ id: "added", label: "Added", type: "date", hidden: true },
		{ id: "fit", label: "Fit score", type: "formula" },
		{ id: "summary", label: "Summarise role", type: "ai" },
		{ id: "email", label: "Work email", type: "enrichment", provider: "hubspot" },
	]);
	return (
		<div className="grid justify-items-start gap-2">
			<ColumnsMenu columns={columns} onChange={setColumns} align="start" />
			<p className="text-sm text-ink-2">Shown, in order: {columns.filter((c) => !c.hidden).map((c) => c.label).join(", ")}</p>
		</div>
	);
}
```

## Related

- Sheet grid
- List table
- Saved views
- pagination-counts
