import { SheetGrid, type SheetColumn, type SheetRow } from "@twoux/ui";

/* The real SheetGrid, cut to two narrow columns and two rows: typed column icons, the computed column's status
   row under the header, and per-cell states in words. The keyboard hint line under the grid is hidden to fit. */
const COLUMNS: SheetColumn[] = [
	{ id: "name", label: "Name", type: "text", width: 84 },
	{ id: "email", label: "Work email", type: "enrichment", provider: "hubspot", width: 132, costPerRow: 0.5, status: { done: 2, total: 2, errors: 1 } },
];
const ROWS: SheetRow[] = [
	{ id: "1", values: { name: "Ana" }, computed: { email: { state: "done", value: "ana@harbourvale.co.uk" } } },
	{ id: "3", values: { name: "Chloe" }, computed: { email: { state: "failed", reason: "No company domain." } } },
];
const noop = () => {};

export default function Thumbnail() {
	return <SheetGrid aria-label="Prospects" size="dense" className="w-64 [&>:last-child]:hidden" columns={COLUMNS} onColumnsChange={noop} rows={ROWS} onCellChange={noop} />;
}
