import { DropdownMenuItem, Table, TableBody, TableCell, TableGroupRow, TableHead, TableHeader, TableRow, TableRowNumber } from "@twoux/ui";

/* The real dense Table: header, a group row with its info button and count, and numbered 28px rows. */
const ROWS: [string, string, string][] = [["Electricity", "14.6", "kWh"], ["Natural gas", "21.4", "MJ"]];

export default function Thumbnail() {
	return (
		<div className="w-64 overflow-hidden rounded-sm border border-line bg-surface">
			<Table size="dense" aria-label="Inventory" className="table-fixed">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead className="w-14">#</TableHead>
						<TableHead>Flow</TableHead>
						<TableHead className="w-14 text-right">Amount</TableHead>
						<TableHead className="w-12">Unit</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableGroupRow label="Inputs" info="Energy and resources taken in directly." count={5} colSpan={4} />
					{ROWS.map(([flow, amount, unit], i) => (
						<TableRow key={flow}>
							<TableRowNumber n={i + 1} label={flow} className="w-14"><DropdownMenuItem>Open</DropdownMenuItem></TableRowNumber>
							<TableCell className="truncate font-medium text-ink">{flow}</TableCell>
							<TableCell className="tabular text-right">{amount}</TableCell>
							<TableCell className="text-ink-2">{unit}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
