# Sheet grid

A spreadsheet of records with typed columns, a menu per column, row numbers and a status row for computed columns, and Excel and Google Sheets keys: select ranges, copy and paste to and from either, fill, clear and undo. size="dense" gives 28px rows for spreadsheet-like data.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- People build a table of records and add columns that are typed, calculated or filled in per row, such as a work email looked up for every person.
- The table is wider than the screen and people compare values across columns, so the name column must stay in view.
- People work as they would in Excel or Google Sheets: they paste blocks of values in, fill down, copy ranges out and undo mistakes.
- Spreadsheet-like data, such as inventories, ledgers and imports, where people need many rows in view: use size="dense".

## When not to use

- For scanning and triage of records. Use the List table; a static table is simpler to read.
- For editing a few columns of known data without computed columns. Use the Data grid.
- For deep edits of one record. Use the side panel.

## Structure

1. Header row: type icon (or the service's logo), column name, sort arrow, menu
2. Filter row (optional): a search field under each header
3. Status row for computed columns: Up to date, 62%, 3 errors
4. Pinned row numbers (with checkbox and ⋮ row menu when set) and frozen first columns
5. Group rows (optional): label, count and each total column's sum, collapsible
6. Cells: values, Tag for select, Switch with its word, n/a, or Waiting, Writing, Looking up, Failed with the reason, Not found; the selected range in indigo
7. Totals row (optional), then Add row, Add 10 rows, the status line and the sum and count of the selection

## Guidelines

- Every column shows its type in the header: an icon for text, number, date and select, the formula mark, the AI origin mark, or the logo of the service an enrichment uses.
- The grid has one tab stop. Arrow keys move between cells; Up from the first row reaches the column headers, where Enter opens the column menu.
- The column menu holds rename, change type, sort, filter, wrap text, pin or unpin, column width, hide, insert left or right and delete. Delete happens at once with Undo.
- Columns resize from the header: drag its right edge (60 to 640px) or double-click the edge to fit the widest value. From the keyboard, ⌥⇧ with an arrow on a header, or Column width in the column menu (Wider, Narrower, Fit to content).
- Pin any column from its menu to keep it in view when scrolling sideways; pinned columns move to the left edge and show a pin in the header. Pinned columns never take more than 60% of the grid's width.
- You always see where you are and which record changes: the row being edited is tinted (--color-active-row), and its row number and column header turn primary, as in Google Sheets. The active cell has a 2px primary outline on the surface. Under the pointer, the row takes --color-hover and the cell --color-selected. A select's list opens below the cell, never over it.
- Select columns read as selectors: the value with a chevron, shown on row hover and focus. A second click on the active cell, a click on the chevron, Enter or any letter opens the list. Don't show select values as badges in an editable grid; badges read as status, not as something to change.
- The row header is one compact slot: the row number, replaced by a checkbox on hover, on focus and while any row is checked, then the ⋮ menu, shown on hover. On touch screens both stay visible.
- Computed columns show their progress in the status row and their state in each cell, in words. A run never overwrites a typed value.
- Pressing Enter on a failed cell runs it again; the status line states the cost first.
- Keys follow Excel and Google Sheets: Shift with an arrow extends the selection, ⌘ or Ctrl with an arrow jumps to the edge of the data, ⌘C and ⌘V copy and paste, ⌘D and ⌘R fill, ⌘Z undoes. Ctrl replaces ⌘ on Windows and Linux.
- Copy puts tab-separated values on the clipboard, so a range pastes straight into Excel or Google Sheets, and numbers stay numbers.
- Paste reads tab-separated values from Excel or Sheets into the range starting at the active cell, and checks each value against its column's type. Cells that don't fit keep their value, are outlined in red with the reason, and the status line says how many were left and why. Nothing is dropped without saying so.
- Paste, fill, clear and edits can all be undone (⌘Z) and redone (⌘⇧Z or Ctrl+Y), and each one is announced: “Pasted 12 cells”, “Undid paste of 12 cells”.
- Use size="dense" (28px rows) for spreadsheet-like data. It is a variant for that data, never a row height setting; offer Wrap text per column for long values.
- Tab moves out of the grid unless a cell is being edited, where it saves and moves right, so the grid stays one tab stop.
- With onOpenRow, the name cell shows Open on hover and focus and the row menu has Open too; ⇧F10 opens the row menu from the keyboard.
- Pair the grid with a ShortcutSheet group from sheetGridShortcuts(), which writes ⌘ on a Mac and Ctrl elsewhere, and list the same groups on the page with ShortcutList, so the keys are visible without pressing ? or ⌘/.
- Add row and Add 10 rows put the new rows at the bottom, scroll there and make the first new cell active, so people can type straight away.

## Content

- Keep the three empty-looking states apart: a dash when there is nothing, Not found when the service looked and found nothing, and Failed with the reason.
- Status row words: Up to date, 62%, 3 errors, Out of date. Never a bare spinner.
- Right-align numbers; show dates as 14 Mar 2026.
- Status line messages say what happened and to how many cells: Copied 6 cells, Pasted 12 cells. 2 cells left as they were, Filled down 4 cells, Cleared 3 cells.
- Rejection reasons say what to enter: “Enter a number, such as 1200.”, “Choose one of Lead, Qualified, Proposal.”

## Accessibility

- APG grid pattern: role grid, roving focus on cells, aria-sort on the sorted header, row numbers as row headers.
- 2.1.1 Keyboard: every column action is in a menu reached from the header by keyboard.
- 1.4.1 Use of colour: failed cells carry an icon and the reason, not only red.
- 4.1.3 Status messages: saves, clears and retries are announced from the status line.
- 2.4.11 Focus not obscured: cells scroll clear of the sticky header and frozen columns.
- APG grid: aria-multiselectable on the grid and aria-selected on cells in the range; selections are announced as “6 cells selected: Job title to Seniority, rows 1 to 3.”
- 4.1.3 Status messages: copy, paste, fill, clear, undo and redo are announced from the status line, including the reason any cell was rejected.
- 3.3.1 Error identification: a rejected paste cell has aria-invalid, a red dashed outline and its reason in text, not colour alone.

## Keyboard

| Keys | Action |
|---|---|
| ← → ↑ ↓ | Move one cell; up from row 1 to the filter row and the headers |
| ⌘ / Ctrl + arrow | Jump to the edge of the data in that direction |
| Home / End | First or last cell in the row |
| ⌘ Home / ⌘ End (Ctrl on Windows) | First or last cell in the sheet |
| Page Up / Page Down | Move 10 rows |
| ⇧ + arrow, ⇧ Home / End | Extend the selection |
| ⌘ ⇧ + arrow | Extend the selection to the edge of the data |
| ⇧ click, click and drag | Select a range with the mouse |
| ⌘ A | Select all cells |
| Ctrl Space | Select the column |
| ⇧ Space | Select or deselect the rows of the selected cells (with row selection) |
| ⌘ C | Copy the range as tab-separated values, for here, Excel or Google Sheets |
| ⌘ X | Copy the range and clear it |
| ⌘ V | Paste from here, Excel or Google Sheets into the range from the active cell; each value is checked |
| Delete / Backspace | Clear the editable cells in the range |
| ⌘ D | Fill down: the top row of the range into the rows below (one row: from the row above) |
| ⌘ R | Fill right: the left column of the range into the columns to its right |
| ⌘ Z | Undo the last edit, paste, clear or fill |
| ⌘ ⇧ Z / Ctrl Y | Redo |
| Enter / F2 | Edit; on a header, open the column menu; on a failed cell, run it again; on a group row, collapse or expand |
| Any character | Start editing and replace the value; on a select cell, open the list |
| Space (yes or no cell) | Turn it on or off |
| Enter (editing) | Save and move down |
| ⇧ Enter (editing) | Save and move up |
| Tab (editing) | Save and move right |
| ⇧ Tab (editing) | Save and move left |
| ⌘ Enter (editing) | Save the value into every selected cell |
| Esc (editing) | Cancel the edit |
| Esc | Clear the selection back to the active cell |
| ⇧ F10 / Menu key, right click | Open the row's actions |
| Alt ↓ | Open the column menu from a header |
| ⌥ ⇧ ← / → (Alt Shift on Windows) | On a header: make the column narrower or wider by 16px |
| ⌘ ; (Ctrl ; on Windows) | Put today's date in a date cell |
| ⌘ / (Ctrl / on Windows), ? | Show every shortcut |
| Tab | Leave the grid (one tab stop) |

## Examples

### dense

```tsx
import { Button, type SheetCellChange, SheetGrid, type SheetRow, ShortcutSheet, sheetGridShortcuts } from "@twoux/ui";
import { Keyboard } from "lucide-react";
import { useState } from "react";
import { PROSPECT_COLUMNS, prospectRows } from "../dense-table/prospects-data";

export const meta = {
	title: "Dense, with spreadsheet keys",
	description: "The TwoUX prospects table at size=\"dense\" for 28px rows. Shift+arrows or drag to select, ⌘C to copy as tab-separated values, ⌘V to paste from here, Excel or Google Sheets (each value is checked against its column), ⌘D and ⌘R to fill, Delete to clear, ⌘Z to undo. Press ? for every key.",
	order: 2,
};

export default function Example() {
	const [columns, setColumns] = useState(PROSPECT_COLUMNS);
	const [single, setSingle] = useState(true);
	const [rows, setRows] = useState<SheetRow[]>(() => prospectRows(30));
	const onCellsChange = (changes: SheetCellChange[]) =>
		setRows((rs) => rs.map((r) => {
			const mine = changes.filter((c) => c.rowId === r.id);
			return mine.length ? { ...r, values: { ...r.values, ...Object.fromEntries(mine.map((c) => [c.columnId, c.value])) } } : r;
		}));
	return (
		<div className="grid w-full gap-2">
			<div className="flex items-center gap-2">
				<span className="text-sm text-ink-2">TwoUX prospects · {rows.length} people</span>
				<span className="flex-1" />
				<Button variant="ghost" size="sm" onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }))}><Keyboard />Keys (?)</Button>
			</div>
			<SheetGrid
				size="dense"
				aria-label="TwoUX prospects"
				className="h-96 w-full"
				columns={columns}
				onColumnsChange={setColumns}
				rows={rows}
				onCellChange={(id, col, v) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, values: { ...r.values, [col]: v } } : r)))}
				onCellsChange={onCellsChange}
				onAddRows={(n) => setRows((rs) => [...rs, ...Array.from({ length: n }, (_, i) => ({ id: `new-${rs.length + i}`, values: { subscribed: false } }))])}
			/>
			<ShortcutSheet singleKeys={single} onSingleKeysChange={setSingle} groups={sheetGridShortcuts()} />
		</div>
	);
}
```

### prospects

```tsx
import { SheetGrid, type SheetColumn, type SheetRow, type SheetSort } from "@twoux/ui";
import { useState } from "react";

export const meta = { title: "Prospects with computed columns", description: "Focus a cell and use the arrow keys. Enter edits, Esc cancels, Tab saves and moves on. Press Up from the first row to reach the headers, then Enter for the column menu. Enter on a failed cell runs it again.", order: 1 };

const COLUMNS: SheetColumn[] = [
	{ id: "name", label: "Name", type: "text", width: 160, pinned: true, locked: true },
	{ id: "title", label: "Job title", type: "text", width: 200 },
	{ id: "seniority", label: "Seniority", type: "select", width: 120, options: ["Mid", "Senior", "Director", "VP"] },
	{ id: "size", label: "Company size", type: "number", width: 130 },
	{ id: "summary", label: "Summarise role", type: "ai", width: 260, costPerRow: 1, status: { done: 3, total: 5, running: true } },
	{ id: "email", label: "Work email", type: "enrichment", provider: "hubspot", width: 230, costPerRow: 0.5, status: { done: 5, total: 5, errors: 1 } },
];

export default function Example() {
	const [columns, setColumns] = useState(COLUMNS);
	const [sort, setSort] = useState<SheetSort>(null);
	const [rows, setRows] = useState<SheetRow[]>([
		{ id: "1", values: { name: "Ana Silva", title: "Head of Revenue Operations", seniority: "Senior", size: 240 }, computed: { summary: { state: "done", value: "Leads a function; shortlists tools." }, email: { state: "done", value: "ana.silva@harbourvale.co.uk" } } },
		{ id: "2", values: { name: "Ben Hughes", title: "Chief Operating Officer", seniority: "VP", size: 160 }, computed: { summary: { state: "done", value: "Runs the business; owns the budget." }, email: { state: "not-found" } } },
		{ id: "3", values: { name: "Chloe Patel", title: "", seniority: "Mid", size: 410 }, computed: { summary: { state: "failed", reason: "Job title is empty." }, email: { state: "done", value: "chloe.patel@mosaiclending.co.uk" } } },
		{ id: "4", values: { name: "Daniel Murray", title: "IT Director", seniority: "Director", size: 1200 }, computed: { summary: { state: "writing" }, email: { state: "failed", reason: "No company domain." } } },
		{ id: "5", values: { name: "Ella Brennan", title: "Operations Manager", seniority: "Mid", size: 130 }, computed: { summary: { state: "queued" }, email: { state: "done", value: "ella.brennan@orrin.dev" } } },
	]);
	return (
		<SheetGrid
			aria-label="Prospects"
			className="h-96 w-full"
			columns={columns}
			onColumnsChange={setColumns}
			rows={rows}
			onCellChange={(id, col, v) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, values: { ...r.values, [col]: v } } : r)))}
			sort={sort}
			onSortChange={setSort}
			onRetryCell={(id, col) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, computed: { ...r.computed, [col]: { state: "queued" } } } : r)))}
			onAddRows={(n) => setRows((rs) => [...rs, ...Array.from({ length: n }, (_, i) => ({ id: `n${rs.length + i}`, values: {} }))])}
		/>
	);
}
```

## Related

- Data grid
- Columns menu
- Run status bar
- Action catalogue
- AI column
- Dense table
