export const install = "";
export const api = [
	{
		component: "SheetGrid",
		props: [
			{ name: "columns · onColumnsChange", type: "SheetColumn[] · (columns) => void", description: "{ id, label, type, width, pinned?, hidden?, wrap?, locked?, options?, formula?, provider?, costPerRow?, validate?, status?, currency?, total?, onLabel?, offLabel?, notApplicable?, render? }. Rename, type, wrap, pin, width, hide, insert and delete come back here; delete shows Undo. Drag a header edge to resize (60 to 640px), double-click it to fit; ⌥⇧ and an arrow on a header does the same from the keyboard." },
			{ name: "(workspace)", type: "AppShell frame=\"flush\"", description: "Inside a flush shell the sheet fills its region edge to edge with no border or corners; elsewhere it is a framed card. Rows and text keep their size." },
			{ name: "type", type: "\"text\" | \"number\" | \"date\" | \"select\" | \"boolean\" | \"formula\" | \"ai\" | \"enrichment\"", description: "Sets the header icon, the editor and whether cells are computed. Enrichment shows its provider's logo." },
			{ name: "rows · onCellChange", type: "{ id, values, computed? }[] · (rowId, colId, value) => void", description: "computed holds each computed cell's state: queued, writing, done, failed with reason, not-found." },
			{ name: "sort · onSortChange", type: "{ columnId, direction } | null", description: "Set from the column menu; the header gets aria-sort." },
			{ name: "onFilterColumn", type: "(columnId) => void", description: "Add a pill for the column to the page's FilterBar." },
			{ name: "onInsertColumn · onEditColumn", type: "(index) => void · (columnId) => void", description: "Open the Action catalogue. Without onInsertColumn a text column is inserted and renamed in place." },
			{ name: "onRetryCell · onRetryColumn", type: "(rowId, colId) => void · (colId) => void", description: "Enter on a failed cell, or Run failed cells again in the column menu. The cost is stated first." },
			{ name: "onAddRows", type: "(count) => void", description: "Shows Add row and Add 10 rows." },
			{ name: "size", type: '"default" | "dense"', default: '"default"', description: "dense: 28px rows for spreadsheet-like data (inventories, ledgers, imports, mapping). Not a user setting." },
			{ name: "onCellsChange", type: "(changes: { rowId, columnId, value }[]) => void", description: "Optional. A paste, fill, clear, undo or redo arrives as one batch. Without it, onCellChange is called once per cell, so use a functional state update." },
			{ name: "groupBy", type: "string (column id)", description: "Group rows by that column's value: a collapsible group row with the count and each total column's sum. Enter on a group row collapses it." },
			{ name: "filterRow", type: "boolean", default: "false", description: "A search field under each header, part of the grid: Up from row 1 reaches it, Down or Enter returns, Esc clears." },
			{ name: "selectedRowIds · onSelectedRowIdsChange", type: "string[] · (ids) => void", description: "A checkbox in place of the row number, shown on hover and while any row is checked. ⇧Space selects the rows of the selected cells. Pair with BulkActionBar." },
			{ name: "rowActions · onOpenRow", type: "(row) => ReactNode · (rowId) => void", description: "The ⋮ row menu (DropdownMenuItem), opened from the row number, a right click or ⇧F10. onOpenRow adds Open to it and an Open button in the name cell on hover and focus." },
			{ name: "aria-label", type: "string", description: "Names the grid. One tab stop; Tab leaves the grid unless a cell is being edited." },
		],
	},
	{ component: "SheetColumn extras", props: [
		{ name: "currency", type: "string (ISO code)", description: "Number columns shown as money (GBP: £1,240). Pasted £, $ and € are understood." },
		{ name: "total", type: '"sum" | "average"', description: "Shown in the totals row and in each group row." },
		{ name: "onLabel · offLabel", type: "string", description: "boolean columns: the word beside the switch, such as Subscribed and Not subscribed. Space toggles." },
		{ name: "notApplicable", type: "(row) => boolean", description: "Shows n/a, read as “not applicable”; the cell can't be edited or pasted into." },
		{ name: "render", type: "(value, row) => ReactNode", description: "Custom display, such as PersonAvatar beside an owner's name. Editing and paste still follow the column type." },
	] },
	{ component: "sheetGridShortcuts · toTsv · parseTsv", props: [
		{ name: "sheetGridShortcuts(mac?)", type: "ShortcutGroup[]", description: "Every SheetGrid key for the ShortcutSheet, with ⌘ on a Mac and Ctrl elsewhere." },
		{ name: "toTsv · parseTsv", type: "(string[][]) => string · (string) => string[][]", description: "The clipboard format Excel and Google Sheets use, with their quoting." },
	] },
	{ component: "ColumnTypeIcon", props: [{ name: "type · provider", type: "ColumnType · ProviderId", description: "The header icon on its own, for menus and mapping lists." }] },
];
