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
