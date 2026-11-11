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
