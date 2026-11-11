import { BulkActionBar, Button, Checkbox, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, toast } from "@twoux/ui";
import { CalendarPlus, Copy } from "lucide-react";
import { useState } from "react";
import { LISTINGS } from "../list-table/data";

export const meta = { title: "Act on selected listings", description: "While rows are selected, a band appears directly above the table with the actions, then the count and Clear selection. The header row and any filters stay in view. Arrow keys move between its buttons; Esc clears.", order: 1 };

const ROWS = LISTINGS.slice(0, 4);

export default function Example() {
	const [sel, setSel] = useState<string[]>([ROWS[0].id, ROWS[2].id]);
	const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
	const all = sel.length === ROWS.length ? true : sel.length ? "indeterminate" : false;
	const setAll = (v: boolean) => setSel(v ? ROWS.map((r) => r.id) : []);
	const n = sel.length;
	return (
		<div className="w-full max-w-xl overflow-hidden rounded-sm border border-line bg-surface">
			<BulkActionBar count={n} noun={n === 1 ? "listing" : "listings"} onClear={() => setSel([])} actions={[
					{ label: "Extend 30 days", icon: <CalendarPlus />, shortcut: "T", onSelect: () => toast.success(`Extended ${n} listing${n === 1 ? "" : "s"} by 30 days`, { action: { label: "Undo", onClick: () => {} } }) },
					{ label: "Duplicate", icon: <Copy />, shortcut: "D", onSelect: () => toast.success(`Duplicated ${n} listing${n === 1 ? "" : "s"}`) },
				]} />
			<Table aria-label="Listings">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						<TableHead className="w-9"><Checkbox aria-label="Select all on this page" checked={all} onCheckedChange={(v) => setAll(!!v)} /></TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Location</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{ROWS.map((r) => (
						<TableRow key={r.id} data-state={sel.includes(r.id) ? "selected" : undefined}>
							<TableCell><Checkbox checked={sel.includes(r.id)} onCheckedChange={() => toggle(r.id)} aria-label={`Select ${r.role}`} /></TableCell>
							<TableCell className="font-medium text-ink">{r.role}</TableCell>
							<TableCell className="text-ink-2">{r.location}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
