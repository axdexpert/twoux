import { Pencil } from "lucide-react";

/* DataGrid drawn with its own classes (the real one moves focus into the grid on mount): header with the pencil on
   editable columns, 36px cells, numbers right-aligned, the active cell outlined in primary. The keyboard hint line
   under the grid is left out to fit. */
const COLS = [
	{ label: "Role", w: "w-24" },
	{ label: "Team", w: "w-20", editable: true },
	{ label: "Salary", w: "", editable: true, number: true },
];
const ROWS = [["Designer", "Design", "30,000"], ["Engineer", "Eng", "52,000"]];

export default function Thumbnail() {
	return (
		<div className="grid w-64 overflow-hidden rounded-sm border border-line bg-surface" aria-hidden="true">
			<table className="w-full table-fixed border-separate border-spacing-0 text-base">
				<thead>
					<tr>
						{COLS.map((c) => (
							<th key={c.label} className={`${c.w} h-9 border-b border-line bg-surface-2 px-3 text-sm font-medium whitespace-nowrap text-ink-2 ${c.number ? "text-right" : "text-left"}`}>
								<span className="inline-flex items-center gap-1">{c.label}{c.editable && <Pencil className="size-3 text-ink-3" />}</span>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{ROWS.map((row, r) => (
						<tr key={row[0]}>
							{row.map((v, ci) => (
								<td key={ci} className={`h-9 border-b border-line bg-surface px-3 whitespace-nowrap last:text-right ${ci === 2 ? "tabular" : ""} ${r === 0 && ci === 1 ? "ring-2 ring-primary ring-inset" : ""} ${r === ROWS.length - 1 ? "border-b-0" : ""}`}>
									<span className="block truncate">{v}</span>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
