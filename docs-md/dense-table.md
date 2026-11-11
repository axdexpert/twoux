# Dense table

The List table at 28px rows for spreadsheet-like data, such as a life-cycle inventory or a product library, with group rows, row numbers with a row menu, a filter row, in-cell buttons and frozen first columns.

Kind: component · Group: Data · Status: built, import from @twoux/ui

## When to use

- The data is spreadsheet-like and people scan many rows at once to compare values: inventories, ledgers, bills of materials, imports and field mappings.
- Rows fall into a few sections people read separately, such as Inputs, Wastes and emissions and Products.
- Every row has the same attributes and people need to find, compare and act on several rows.

## When not to use

- As a density setting, a comfortable mode or a user preference. TwoUX has one density for the app; dense is only for this kind of data.
- For a list people triage one record at a time (an inbox, candidates). Use the List table at its default 36px rows.
- To type, paste from Excel, fill or undo cell edits. Use the Sheet grid with size="dense": a table's cells are not focusable.

## Structure

1. Table size="dense": 28px header and rows, 8px cell padding, 13px text
2. Frozen first columns (data-pinned): selection, row number with ⋮ row menu, the identifying column
3. Filter row: a search field under each filterable header
4. Group rows: label, info tooltip, count, optionally collapsible
5. Cells: Tag with a value, Switch with its word, two linked items with an arrow, n/a, in-cell button on hover and focus
6. Footer: pagination; the Bulk action bar while rows are selected

## Guidelines

- Use Table size="dense". Rows and the header are 28px, cells have 8px padding and text stays 13px, so dense never means smaller type.
- Freeze the selection column, the row number and the identifying column with data-pinned, and set each one's --pin offset. Wide tables scroll sideways inside their own box.
- Group rows split the table into sections. Put each group in its own TableBody with a TableGroupRow first: label, count, and an info tooltip saying what belongs there. Make it collapsible when the sections are long.
- The row number cell holds the ⋮ row menu, named “Actions for <row>”. Every row action lives there.
- An in-cell button (Open, Share) shows on row hover and keyboard focus, and always on touch screens. It is a shortcut: the same action is always in the row menu.
- A filter row puts one search field under each filterable header, named “Filter <column>”. Filtering goes back to page 1 and Esc clears a field.
- Keep at most one in-cell button per row, and no more than two quick actions plus the row menu, so rows stay scannable.

## Content

- Tag with a value: the category as a Tag, then the value in tabular figures, such as Allocate 90.3 %. The Tag never carries the number.
- Switch with its word: the word says the current state (Published, Draft), never only the switch.
- Linked items: “Magnet preparation → NdFeB magnet powder”, read as “Magnet preparation to NdFeB magnet powder”.
- Use n/a (read as “not applicable”) when a value can't exist for the row, and a dash with hidden text when it exists but is empty.
- Right-align numbers in tabular figures with the same decimals; put units in their own column or the header, and region codes in monospace.
- Header labels in sentence case, short nouns: Amount, In reference unit.

## Accessibility

- APG table pattern: a dense table is still a table, with an accessible name, header cells and scope="rowgroup" on group rows.
- The collapsible group label is a button with aria-expanded and aria-controls naming its TableBody.
- 2.5.8 Target size: row menu buttons and checkboxes keep a 24px hit area inside 28px rows.
- In-cell buttons stay in the tab order when hidden, appear on focus, and are named for their row (“Open Electricity, medium voltage”).
- Filter fields have their own labels, not only a placeholder.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move through checkboxes, row menus, in-cell buttons and filter fields |
| Enter / Space | Open the row menu, press an in-cell button, collapse or expand a group |
| Esc (filter field) | Clear the filter |
| J / K, X, Enter | Row focus, selection and open, with useRowKeyboard as on the List table |

## Examples

### inventory

```tsx
import {
	DropdownMenuItem,
	DropdownMenuSeparator,
	Table,
	TableBody,
	TableCell,
	TableCellAction,
	TableGroupRow,
	TableHead,
	TableHeader,
	TableLinkedItems,
	TableNotApplicable,
	TableRow,
	TableRowNumber,
	Tag,
	toast,
} from "@twoux/ui";
import { Copy, PanelRight, Pencil, Trash2 } from "lucide-react";
import { type CSSProperties, useState } from "react";

export const meta = {
	title: "Life-cycle inventory",
	description: "size=\"dense\" for 28px rows. Group rows with an info tooltip and count collapse their section. Hover or tab into a row to reveal Open; the ⋮ menu on the row number has Open too. Scroll sideways: the row number and Flow stay in view.",
	order: 1,
};

type Exchange = { id: string; flow: string; from?: [string, string]; kind: "Unit process" | "System process" | "Elementary flow"; allocation?: number; region: string; amount: number; unit: string; reference?: string; note?: string };
type Group = { id: string; label: string; info: string; rows: Exchange[] };

const GROUPS: Group[] = [
	{
		id: "intermediary",
		label: "Intermediary inputs",
		info: "Products made by other processes in this model and fed into this one.",
		rows: [
			{ id: "e1", flow: "NdFeB magnet powder", from: ["Magnet preparation", "NdFeB magnet powder"], kind: "Unit process", allocation: 90.3, region: "CN", amount: 1.042, unit: "kg", reference: "1.042 kg" },
			{ id: "e2", flow: "Dysprosium oxide", from: ["Rare earth separation", "Dysprosium oxide"], kind: "System process", allocation: 6.1, region: "CN", amount: 0.031, unit: "kg", reference: "31 g" },
			{ id: "e3", flow: "Nickel plating", from: ["Surface treatment", "Plated part"], kind: "Unit process", region: "GB", amount: 0.18, unit: "m²", reference: "1,800 cm²" },
			{ id: "e4", flow: "Sintering, vacuum furnace", from: ["Heat treatment", "Sintered block"], kind: "Unit process", allocation: 100, region: "GB", amount: 1, unit: "item", reference: "1 item" },
		],
	},
	{
		id: "inputs",
		label: "Inputs",
		info: "Energy, water and resources taken in directly, not made by another process in this model.",
		rows: [
			{ id: "e5", flow: "Electricity, medium voltage", kind: "System process", region: "GB", amount: 14.6, unit: "kWh", reference: "52.56 MJ" },
			{ id: "e6", flow: "Natural gas, burned in furnace", kind: "System process", region: "RER", amount: 21.4, unit: "MJ", reference: "5.94 kWh" },
			{ id: "e7", flow: "Argon, liquid", kind: "System process", region: "RER", amount: 0.42, unit: "kg", reference: "420 g" },
			{ id: "e8", flow: "Water, deionised", kind: "Elementary flow", region: "GB", amount: 0.012, unit: "m³", reference: "12 l" },
			{ id: "e9", flow: "Transport, lorry 16 to 32 t", kind: "System process", region: "RER", amount: 312, unit: "t·km", reference: "312,000 kg·km" },
		],
	},
	{
		id: "wastes",
		label: "Wastes and emissions",
		info: "What leaves the process without value: waste for treatment and emissions to air, water and soil.",
		rows: [
			{ id: "e10", flow: "Grinding sludge", from: ["Hazardous waste treatment", "Treated sludge"], kind: "Unit process", region: "GB", amount: 0.064, unit: "kg", reference: "64 g" },
			{ id: "e11", flow: "Carbon dioxide, fossil", kind: "Elementary flow", region: "GLO", amount: 1.21, unit: "kg", note: "Air, urban" },
			{ id: "e12", flow: "Particulates, < 2.5 µm", kind: "Elementary flow", region: "GLO", amount: 0.0004, unit: "kg", reference: "0.4 g" },
		],
	},
	{
		id: "products",
		label: "Products",
		info: "What the process makes. The reference product carries the result; co-products take a share by allocation.",
		rows: [
			{ id: "e13", flow: "NdFeB magnet, sintered", kind: "Unit process", allocation: 94.5, region: "GB", amount: 1, unit: "kg", reference: "1 kg" },
			{ id: "e14", flow: "Magnet offcuts, for recycling", kind: "Unit process", allocation: 5.5, region: "GB", amount: 0.058, unit: "kg", reference: "58 g" },
		],
	},
];

const COLS = 9;
const fmt = (n: number) => n.toLocaleString("en-GB", { maximumFractionDigits: 4 });

export default function Example() {
	const [collapsed, setCollapsed] = useState<string[]>([]);
	const open = (e: Exchange) => toast(`Opened ${e.flow}`, { description: "In a product it opens in the side panel." });
	let n = 0;
	return (
		<div className="w-full overflow-hidden rounded-sm border border-line bg-surface">
			<div className="flex items-center gap-2 border-b border-line px-3 py-2">
				<h3 className="text-md font-semibold text-ink">NdFeB magnet, per kg</h3>
				<span className="text-sm text-ink-3">Corvane Magnetics · Sheffield plant · 2025</span>
			</div>
			<Table size="dense" aria-label="Inventory for NdFeB magnet, per kg" className="min-w-328 table-fixed" containerClassName="max-h-120">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead data-pinned="" className="w-16"><span aria-hidden="true">#</span><span className="sr-only">Row number</span></TableHead>
						<TableHead data-pinned="last" style={{ "--pin": "64px" } as CSSProperties} className="w-64">Flow</TableHead>
						<TableHead className="w-80">Provider</TableHead>
						<TableHead className="w-44">Allocation</TableHead>
						<TableHead className="w-20">Region</TableHead>
						<TableHead className="w-24 text-right">Amount</TableHead>
						<TableHead className="w-16">Unit</TableHead>
						<TableHead className="w-36 text-right">In reference unit</TableHead>
						<TableHead className="w-28">Compartment</TableHead>
					</TableRow>
				</TableHeader>
				{GROUPS.map((g) => {
					const isOpen = !collapsed.includes(g.id);
					return (
						<TableBody key={g.id} id={`inv-${g.id}`}>
							<TableGroupRow
								label={g.label}
								info={g.info}
								count={g.rows.length}
								colSpan={COLS}
								expanded={isOpen}
								controls={`inv-${g.id}`}
								onExpandedChange={(o) => setCollapsed((c) => (o ? c.filter((x) => x !== g.id) : [...c, g.id]))}
							/>
							{isOpen &&
								g.rows.map((e) => {
									n += 1;
									return (
										<TableRow key={e.id}>
											<TableRowNumber n={n} label={e.flow} data-pinned="">
												<DropdownMenuItem onSelect={() => open(e)}><PanelRight />Open</DropdownMenuItem>
												<DropdownMenuItem><Pencil />Edit amount</DropdownMenuItem>
												<DropdownMenuItem><Copy />Duplicate</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem variant="destructive"><Trash2 />Remove from inventory</DropdownMenuItem>
											</TableRowNumber>
											<TableCell data-pinned="last" style={{ "--pin": "64px" } as CSSProperties}>
												<span className="flex min-w-0 items-center gap-2">
													<span className="min-w-0 flex-1 truncate font-medium text-ink">{e.flow}</span>
													<TableCellAction aria-label={`Open ${e.flow}`} onClick={() => open(e)}>Open</TableCellAction>
												</span>
											</TableCell>
											<TableCell className="max-w-80">{e.from ? <TableLinkedItems from={e.from[0]} to={e.from[1]} /> : <TableNotApplicable />}</TableCell>
											<TableCell>
												<span className="flex items-center gap-2">
													<Tag>{e.kind === "Elementary flow" ? "Elementary" : e.allocation !== undefined ? "Allocate" : e.kind}</Tag>
													{e.allocation !== undefined ? <span className="tabular text-ink">{e.allocation.toLocaleString("en-GB", { minimumFractionDigits: 1 })} %</span> : null}
												</span>
											</TableCell>
											<TableCell className="font-mono text-sm text-ink-2">{e.region}</TableCell>
											<TableCell className="tabular text-right text-ink">{fmt(e.amount)}</TableCell>
											<TableCell className="text-ink-2">{e.unit}</TableCell>
											<TableCell className="tabular text-right text-ink-2">{e.reference ?? <TableNotApplicable />}</TableCell>
											<TableCell className="text-ink-2">{e.note ?? <TableNotApplicable />}</TableCell>
										</TableRow>
									);
								})}
						</TableBody>
					);
				})}
			</Table>
		</div>
	);
}
```

### product-library

```tsx
import {
	BulkActionBar,
	Button,
	Checkbox,
	DropdownMenuItem,
	DropdownMenuSeparator,
	SplitButton,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableCellAction,
	TableFilterRow,
	TableHead,
	TableHeader,
	TablePagination,
	TableRow,
	TableRowNumber,
	Tag,
	toast,
} from "@twoux/ui";
import { Copy, Globe, Share2, Trash2, Upload } from "lucide-react";
import { type CSSProperties, useMemo, useState } from "react";

export const meta = {
	title: "Product library",
	description: "A dense table with a selection column, a search field under each header, Published switches with their word, a Share button revealed on hover or focus (also in the ⋮ menu), pagination and an Import data split button.",
	order: 2,
};

type Product = { id: string; name: string; category: string; unit: string; gwp: number; version: string; published: boolean; updated: string };

const NAMES = [
	["NdFeB magnet, sintered", "Magnets", "1 kg"],
	["Ferrite magnet, ring", "Magnets", "1 kg"],
	["Copper winding wire", "Metals", "1 kg"],
	["Aluminium housing, die cast", "Metals", "1 item"],
	["Steel shaft, machined", "Metals", "1 item"],
	["Motor controller board", "Electronics", "1 item"],
	["Hall sensor", "Electronics", "1 item"],
	["Ball bearing, 6204", "Components", "1 item"],
	["Epoxy potting compound", "Chemicals", "1 kg"],
	["Varnish, insulating", "Chemicals", "1 l"],
	["Cardboard box, double wall", "Packaging", "1 item"],
	["Polyethylene foam insert", "Packaging", "1 item"],
	["Hub motor, 250 W", "Assemblies", "1 item"],
	["Stator assembly", "Assemblies", "1 item"],
	["Rotor assembly", "Assemblies", "1 item"],
	["Cable harness, 1.2 m", "Electronics", "1 item"],
	["Silicon steel lamination", "Metals", "1 kg"],
	["Nickel plating bath", "Chemicals", "1 l"],
	["Pallet, softwood", "Packaging", "1 item"],
	["Shrink wrap film", "Packaging", "1 kg"],
	["Thermal paste", "Chemicals", "1 kg"],
	["Encoder disc", "Components", "1 item"],
	["Brushless fan, 80 mm", "Assemblies", "1 item"],
] as const;

const PRODUCTS: Product[] = NAMES.map(([name, category, unit], i) => ({
	id: `p${i + 1}`,
	name,
	category,
	unit,
	gwp: Math.round(((i * 7.31) % 38) * 100 + 42) / 100,
	version: `${1 + (i % 3)}.${i % 4}`,
	published: i % 3 !== 1,
	updated: new Date(Date.UTC(2025, 9, 28 - i)).toISOString().slice(0, 10),
}));

const PAGE = 8;
const date = (v: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(v));
const pin = (px: number) => ({ "--pin": `${px}px` }) as CSSProperties;

export default function Example() {
	const [products, setProducts] = useState(PRODUCTS);
	const [filters, setFilters] = useState<Record<string, string>>({});
	const [selected, setSelected] = useState<string[]>([]);
	const [page, setPage] = useState(0);

	const shown = useMemo(
		() =>
			products.filter((p) =>
				Object.entries(filters).every(([k, q]) => !q.trim() || String(k === "published" ? (p.published ? "Published" : "Draft") : p[k as keyof Product]).toLowerCase().includes(q.trim().toLowerCase())),
			),
		[products, filters],
	);
	const pageRows = shown.slice(page * PAGE, (page + 1) * PAGE);
	const allOnPage = pageRows.length > 0 && pageRows.every((p) => selected.includes(p.id));
	const someOnPage = pageRows.some((p) => selected.includes(p.id));
	const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
	const share = (p: Product) => toast.success(`Link to ${p.name} copied`, { description: "Anyone in Corvane Magnetics can open it." });
	const publish = (p: Product, on: boolean) => {
		setProducts((ps) => ps.map((x) => (x.id === p.id ? { ...x, published: on } : x)));
		toast(on ? `Published ${p.name}` : `${p.name} is a draft again`, { action: { label: "Undo", onClick: () => setProducts((ps) => ps.map((x) => (x.id === p.id ? { ...x, published: !on } : x))) } });
	};

	return (
		<div className="w-full overflow-hidden rounded-sm border border-line bg-surface">
			<div className="flex flex-wrap items-center gap-2 border-b border-line px-3 py-2">
				<h3 className="text-md font-semibold text-ink">Product library</h3>
				<span className="tabular text-sm text-ink-3">{products.length} products</span>
				<span className="flex-1" />
				<SplitButton
					variant="outline"
					onClick={() => toast("Choose a CSV or Excel file to import")}
					menuLabel="More import options"
					menu={
						<>
							<DropdownMenuItem onSelect={() => toast("Importing all products from the file")}>Import all</DropdownMenuItem>
							<DropdownMenuItem disabled={!selected.length} onSelect={() => toast(`Updating ${selected.length} selected products from the file`)}>Import selection{selected.length ? ` (${selected.length})` : ""}</DropdownMenuItem>
						</>
					}
				>
					<Upload />Import data
				</SplitButton>
			</div>
			<BulkActionBar size="dense" count={selected.length} noun={selected.length === 1 ? "product" : "products"} onClear={() => setSelected([])} actions={[
					{ label: "Publish", icon: <Globe />, onSelect: () => { setProducts((ps) => ps.map((p) => (selected.includes(p.id) ? { ...p, published: true } : p))); toast.success(`Published ${selected.length} products`); setSelected([]); } },
					{ label: "Share", icon: <Share2 />, onSelect: () => toast.success(`Links to ${selected.length} products copied`) },
				]} />
			<Table size="dense" aria-label="Product library" className="min-w-260 table-fixed">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead data-pinned="" className="w-9">
							<Checkbox aria-label="Select all on this page" checked={allOnPage ? true : someOnPage ? "indeterminate" : false} onCheckedChange={(v) => setSelected((s) => (v ? [...new Set([...s, ...pageRows.map((p) => p.id)])] : s.filter((id) => !pageRows.some((p) => p.id === id))))} />
						</TableHead>
						<TableHead data-pinned="" style={pin(36)} className="w-14"><span aria-hidden="true">#</span><span className="sr-only">Row number</span></TableHead>
						<TableHead data-pinned="last" style={pin(92)} className="w-64">Product</TableHead>
						<TableHead className="w-32">Category</TableHead>
						<TableHead className="w-24">Declared unit</TableHead>
						<TableHead className="w-32 text-right">GWP, kg CO₂e</TableHead>
						<TableHead className="w-20">Version</TableHead>
						<TableHead className="w-36">Status</TableHead>
						<TableHead className="w-24">Updated</TableHead>
					</TableRow>
					<TableFilterRow
						columns={[null, null, { id: "name", label: "Product" }, { id: "category", label: "Category" }, { id: "unit", label: "Declared unit" }, { id: "gwp", label: "GWP", align: "right" }, { id: "version", label: "Version" }, { id: "published", label: "Status" }, null]}
						values={filters}
						onChange={(id, v) => { setFilters((f) => ({ ...f, [id]: v })); setPage(0); }}
					/>
				</TableHeader>
				<TableBody>
					{pageRows.map((p, i) => {
						const on = selected.includes(p.id);
						return (
							<TableRow key={p.id} data-state={on ? "selected" : undefined}>
								<TableCell data-pinned=""><Checkbox aria-label={`Select ${p.name}`} checked={on} onCheckedChange={() => toggle(p.id)} /></TableCell>
								<TableRowNumber n={page * PAGE + i + 1} label={p.name} data-pinned="" style={pin(36)}>
									<DropdownMenuItem onSelect={() => share(p)}><Share2 />Share</DropdownMenuItem>
									<DropdownMenuItem><Copy />Duplicate</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem variant="destructive"><Trash2 />Delete product</DropdownMenuItem>
								</TableRowNumber>
								<TableCell data-pinned="last" style={pin(92)}>
									<span className="flex min-w-0 items-center gap-2">
										<span className="min-w-0 flex-1 truncate font-medium text-ink">{p.name}</span>
										<TableCellAction aria-label={`Share ${p.name}`} onClick={() => share(p)}>Share</TableCellAction>
									</span>
								</TableCell>
								<TableCell><Tag>{p.category}</Tag></TableCell>
								<TableCell className="text-ink-2">{p.unit}</TableCell>
								<TableCell className="tabular text-right text-ink">{p.gwp.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</TableCell>
								<TableCell className="tabular text-ink-2">{p.version}</TableCell>
								<TableCell>
									<span className="flex items-center gap-2">
										<Switch size="sm" checked={p.published} onCheckedChange={(v) => publish(p, v)} aria-label={`Publish ${p.name}`} />
										<span className={p.published ? "text-ink" : "text-ink-3"}>{p.published ? "Published" : "Draft"}</span>
									</span>
								</TableCell>
								<TableCell className="tabular text-ink-2">{date(p.updated)}</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
			{shown.length === 0 && <p className="px-3 py-4 text-base text-ink-2">No products match these filters.</p>}
			<TablePagination page={page} pageCount={Math.ceil(shown.length / PAGE)} pageSize={PAGE} total={shown.length} selected={selected.length} noun="products" onPageChange={setPage} />
		</div>
	);
}
```

### prospects

```tsx
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
```

## Related

- List table
- Sheet grid
- Bulk action bar
- Pagination and counts
- Split button
- Tag
- Switch
