# Data grid

An editable, spreadsheet-like grid for enriching and exporting many columns, with pinned columns, cell-by-cell keyboard navigation, a totals row and AI-generated columns.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- People edit, enrich or export many columns of data, and cells contain interactive or editable content.
- The table is wider than the screen and people compare values across columns, so the identifying column must stay in view.
- People need summary content such as totals kept in view while they scroll, for example total salary or average apply rate.

## When not to use

- For scanning and triage of records. Use the TwoUX List table; a static table keeps reading simpler.
- For deep edits of one record. Use the side panel or full record page; in-place editing only works for narrow edits.
- For a handful of records. Use the TwoUX List table without pagination or totals.
- For spreadsheet work: selecting ranges, copying to and pasting from Excel or Google Sheets, fill down and undo. Use the Sheet grid, with size="dense" for 28px rows.

## Structure

1. Toolbar (view name, Columns, Group, Export)
2. Pinned header row with column type icons
3. Pinned checkbox and identifying columns
4. Scrollable data cells
5. AI column (tinted, with run state per cell)
6. Pinned totals row
7. Status line for save and validation messages

## Guidelines

- The grid has one tab stop. Arrow keys move between cells, Home and End go to the first and last cell in the row.
- Enter or F2 starts editing, Escape cancels, Enter or Tab commits. Validation is per field.
- Pin the checkbox and Role columns while scrolling sideways, and the header and totals row while scrolling down.
- Mark editable columns in the header and show the edit affordance on hover.
- The totals row is chosen per column (sum, average, empty percentage) and counts only rows on screen; say so in the label.
- The AI column runs on demand with progress, Stop and per-cell state, and never overwrites real data.
- The Data grid keeps 36px rows. For spreadsheet-like data where people need many rows in view, use the Sheet grid with size="dense" instead of changing the Data grid's height.

## Content

- Each column shows its type icon so people recognise number, money, person, link, date and AI columns at a glance.
- Right-align numbers and money with consistent decimals.
- Keep three empty states apart: a dash when there is nothing, "Not found" when the AI looked and found nothing, and a red message with Retry when it failed.
- Validation messages name the field and the rule, for example "Enter at least £23,400, the UK minimum for a full-time role."

## Accessibility

- APG grid pattern: role="grid", roving focus on cells, aria-selected on selected rows, aria-sort on the sorted header.
- 2.1.1 Keyboard: every cell action, including sort, hide, totals and AI run, works from the keyboard.
- 3.3.1 Error Identification: invalid values stay in edit with a red outline and a text message, not the outline alone.
- 4.1.3 Status Messages: save confirmations and AI progress are announced from the status line without moving focus.
- 2.4.11 Focus Not Obscured: pinned columns and rows must not hide the focused cell; scroll it into view.

## Keyboard

| Keys | Action |
|---|---|
| ← → ↑ ↓ | Move one cell |
| Home / End | First or last cell in the row |
| Enter / F2 | Edit the focused cell |
| Enter (editing) | Save and stay |
| Tab (editing) | Save and move to the next cell |
| Esc (editing) | Cancel the edit |
| ⇧Space | Select or deselect the active row; the bulk action bar shows above the header |

## Examples

### enrich

```tsx
import { DataGrid, type GridColumn, type GridRow, toast } from "@twoux/ui";
import { Copy, Trash2 } from "lucide-react";
import { useState } from "react";

export const meta = { title: "Enrich listings in place", description: "Focus the grid, move with the arrow keys and press Enter, F2 or just type to edit. Esc cancels; Enter saves and stays; Tab saves and moves on. Salary must be a whole number above the minimum.", order: 1 };

const COLUMNS: GridColumn[] = [
	{ id: "role", label: "Role", width: 220, pin: true },
	{ id: "team", label: "Team", width: 130, editable: true },
	{ id: "location", label: "Location", width: 140, editable: true },
	{ id: "salary", label: "Salary from (£)", width: 150, editable: true, type: "number", total: "average", validate: (v) => (!/^[0-9]+$/.test(v.replace(/,/g, "")) ? "Enter a whole number, such as 32000." : Number(v.replace(/,/g, "")) < 23400 ? "Enter at least £23,400, the full-time minimum." : undefined) },
	{ id: "applicants", label: "Applicants", width: 120, type: "number", total: "sum" },
	{ id: "manager", label: "Hiring manager", width: 160, editable: true },
];

export default function Example() {
	const [rows, setRows] = useState<GridRow[]>([
		{ id: "1", role: "Junior Product Designer", team: "Design", location: "Leeds", salary: 30000, applicants: 38, manager: "Priya Shah" },
		{ id: "2", role: "Frontend Engineer", team: "Engineering", location: "Manchester", salary: 52000, applicants: 112, manager: "Tom Becker" },
		{ id: "3", role: "Data Analyst", team: "Data", location: "Remote (UK)", salary: 41000, applicants: 64, manager: "" },
		{ id: "4", role: "Recruitment Coordinator", team: "People", location: "London", salary: 29000, applicants: 0, manager: "Amara Okafor" },
		{ id: "5", role: "Customer Success Lead", team: "Customer", location: "Bristol", salary: 45000, applicants: 21, manager: "" },
	]);
	const [selected, setSelected] = useState<string[]>([]);
	const n = selected.length;
	const noun = n === 1 ? "listing" : "listings";
	const duplicate = () => {
		setRows((rs) => [...rs, ...rs.filter((r) => selected.includes(r.id)).map((r, i) => ({ ...r, id: `${r.id}-copy-${rs.length + i}`, role: `${r.role} (copy)` }))]);
		toast.success(`Duplicated ${n} ${noun}`);
		setSelected([]);
	};
	const remove = () => {
		const before = rows;
		setRows((rs) => rs.filter((r) => !selected.includes(r.id)));
		toast(`Deleted ${n} ${noun}`, { action: { label: "Undo", onClick: () => setRows(before) } });
		setSelected([]);
	};
	return (
		<DataGrid
			className="w-full"
			aria-label="Listings"
			columns={COLUMNS}
			rows={rows}
			onCellChange={(id, col, v) => setRows((r) => r.map((x) => (x.id === id ? { ...x, [col]: v } : x)))}
			selectedRowIds={selected}
			onSelectedRowIdsChange={setSelected}
			noun={noun}
			bulkActions={[
				{ label: "Duplicate", icon: <Copy />, onSelect: duplicate },
				{ label: "Delete", icon: <Trash2 />, destructive: true, onSelect: remove },
			]}
		/>
	);
}
```

## Related

- List table
- Columns menu
- Export menu
- Saved views
- Filter pills and filter bar
- Bulk action bar
- Sheet grid
- Dense table
