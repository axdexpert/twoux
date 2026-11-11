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
