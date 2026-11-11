import { DataGrid, type GridColumn, type GridRow, toast } from "@twoux/ui";
import { Copy, Trash2 } from "lucide-react";
import { useState } from "react";

export const meta = { title: "Enrich listings in place", description: "Focus the grid, move with the arrow keys and press Enter, F2 or just type to edit. Esc cancels; Enter saves and stays; Tab saves and moves on. Salary must be a whole number above the minimum.", order: 1 };

const COLUMNS: GridColumn[] = [
	{ id: "role", label: "Role", width: 220, pin: true },
	{ id: "team", label: "Team", width: 130, editable: true },
	{ id: "location", label: "Location", width: 140, editable: true },
	{ id: "salary", label: "Salary from (£)", width: 150, editable: true, type: "number", total: "average", validate: (v) => (!/^[0-9]+$/.test(v.replace(/,/g, "")) ? "Enter a whole number, such as 32000." : Number(v.replace(/,/g, "")) < 23400 ? "Enter at least £23,400, the full-time minimum." : undefined) },
	{ id: "applicants", label: "Applicants", width: 120, type: "number", total: "sum" },
	{ id: "manager", label: "Hiring manager", width: 160, editable: true },
];

export default function Example() {
	const [rows, setRows] = useState<GridRow[]>([
		{ id: "1", role: "Junior Product Designer", team: "Design", location: "Leeds", salary: 30000, applicants: 38, manager: "Priya Shah" },
		{ id: "2", role: "Frontend Engineer", team: "Engineering", location: "Manchester", salary: 52000, applicants: 112, manager: "Tom Becker" },
		{ id: "3", role: "Data Analyst", team: "Data", location: "Remote (UK)", salary: 41000, applicants: 64, manager: "" },
		{ id: "4", role: "Recruitment Coordinator", team: "People", location: "London", salary: 29000, applicants: 0, manager: "Amara Okafor" },
		{ id: "5", role: "Customer Success Lead", team: "Customer", location: "Bristol", salary: 45000, applicants: 21, manager: "" },
	]);
	const [selected, setSelected] = useState<string[]>([]);
	const n = selected.length;
	const noun = n === 1 ? "listing" : "listings";
	const duplicate = () => {
		setRows((rs) => [...rs, ...rs.filter((r) => selected.includes(r.id)).map((r, i) => ({ ...r, id: `${r.id}-copy-${rs.length + i}`, role: `${r.role} (copy)` }))]);
		toast.success(`Duplicated ${n} ${noun}`);
		setSelected([]);
	};
	const remove = () => {
		const before = rows;
		setRows((rs) => rs.filter((r) => !selected.includes(r.id)));
		toast(`Deleted ${n} ${noun}`, { action: { label: "Undo", onClick: () => setRows(before) } });
		setSelected([]);
	};
	return (
		<DataGrid
			className="w-full"
			aria-label="Listings"
			columns={COLUMNS}
			rows={rows}
			onCellChange={(id, col, v) => setRows((r) => r.map((x) => (x.id === id ? { ...x, [col]: v } : x)))}
			selectedRowIds={selected}
			onSelectedRowIdsChange={setSelected}
			noun={noun}
			bulkActions={[
				{ label: "Duplicate", icon: <Copy />, onSelect: duplicate },
				{ label: "Delete", icon: <Trash2 />, destructive: true, onSelect: remove },
			]}
		/>
	);
}
