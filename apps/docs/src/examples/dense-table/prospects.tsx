import { BulkActionBar, Button, DropdownMenuItem, type SheetCellChange, SheetGrid, type SheetRow, type SheetSort, ShortcutList, sheetGridShortcuts, toast } from "@twoux/ui";
import { Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { PROSPECT_COLUMNS, prospectRows } from "./prospects-data";

export const meta = {
	title: "TwoUX prospects: every cell editable",
	description:
		"When every cell is editable, use Sheet grid with size=\"dense\". Stage and Seniority are selectors: click the active cell or its chevron, or press Enter. Hover shows the row, the cell under the pointer and the active cell in three tones. Drag a header edge to resize, double-click it to fit; pin or unpin from the column menu. Add row scrolls to the new row. Every key is listed under the grid.",
	order: 0,
};

export default function Example() {
	const [columns, setColumns] = useState(PROSPECT_COLUMNS);
	const [rows, setRows] = useState<SheetRow[]>(() => prospectRows());
	const [sort, setSort] = useState<SheetSort>(null);
	const [selected, setSelected] = useState<string[]>([]);
	// A paste or fill arrives as one batch, so one state update covers every cell.
	const onCellsChange = (changes: SheetCellChange[]) =>
		setRows((rs) => rs.map((r) => {
			const mine = changes.filter((c) => c.rowId === r.id);
			return mine.length ? { ...r, values: { ...r.values, ...Object.fromEntries(mine.map((c) => [c.columnId, c.value])) } } : r;
		}));
	const remove = (ids: string[]) => {
		const before = rows;
		setRows((rs) => rs.filter((r) => !ids.includes(r.id)));
		setSelected((s) => s.filter((id) => !ids.includes(id)));
		toast(`Deleted ${ids.length} ${ids.length === 1 ? "person" : "people"}`, { action: { label: "Undo", onClick: () => setRows(before) } });
	};
	const duplicate = (ids: string[]) =>
		setRows((rs) => [...rs, ...rs.filter((r) => ids.includes(r.id)).map((r, i) => ({ id: `${r.id}-copy-${rs.length + i}`, values: { ...r.values, name: `${r.values.name} (copy)` } }))]);
	const n = selected.length;
	return (
		<div className="grid w-full gap-6">
			<BulkActionBar
				size="dense"
				count={n}
				noun={n === 1 ? "person" : "people"}
				onClear={() => setSelected([])}
				className="-mb-6 rounded-sm border border-line"
				actions={[
					{ label: "Duplicate", icon: <Copy />, onSelect: () => { duplicate(selected); toast.success(`Duplicated ${n} ${n === 1 ? "person" : "people"}`); setSelected([]); } },
					{ label: "Delete", icon: <Trash2 />, destructive: true, onSelect: () => remove(selected) },
				]}
			/>
			<SheetGrid
				aria-label="TwoUX prospects"
				size="dense"
				filterRow
				className="h-112 w-full"
				columns={columns}
				onColumnsChange={setColumns}
				rows={rows}
				onCellChange={(id, col, v) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, values: { ...r.values, [col]: v } } : r)))}
				onCellsChange={onCellsChange}
				sort={sort}
				onSortChange={setSort}
				selectedRowIds={selected}
				onSelectedRowIdsChange={setSelected}
				rowActions={(row) => (
					<>
						<DropdownMenuItem onSelect={() => duplicate([row.id])}><Copy />Duplicate</DropdownMenuItem>
						<DropdownMenuItem variant="destructive" onSelect={() => remove([row.id])}><Trash2 />Delete</DropdownMenuItem>
					</>
				)}
				onAddRows={(n) => setRows((rs) => [...rs, ...Array.from({ length: n }, (_, i) => ({ id: `new-${rs.length + i}`, values: { subscribed: false } }))])}
			/>
			{/* The keys work as in Google Sheets; list them under the grid so nobody has to guess. */}
			<ShortcutList groups={sheetGridShortcuts()} />
		</div>
	);
}
