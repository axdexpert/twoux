import { ColumnsMenu, type ColumnsMenuItem, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@twoux/ui";
import { useState } from "react";
import { LISTINGS, type Listing, formatDate } from "../list-table/data";

export const meta = { title: "On a list table", description: "The same menu on a list table, with Wrap long text and Rows per page. Role is locked so every row stays recognisable. Every change applies at once.", order: 2 };

const CELL: Record<string, (l: Listing) => string | number> = { role: (l) => l.role, location: (l) => l.location, status: (l) => l.status, applicants: (l) => l.applicants, closes: (l) => formatDate(l.closes) };

export default function Example() {
	const [columns, setColumns] = useState<ColumnsMenuItem[]>([
		{ id: "role", label: "Role", locked: true },
		{ id: "location", label: "Location" },
		{ id: "status", label: "Status" },
		{ id: "applicants", label: "Applicants", hidden: true },
		{ id: "closes", label: "Closes" },
	]);
	const [wrap, setWrap] = useState(false);
	const [pageSize, setPageSize] = useState(25);
	const cols = columns.filter((c) => !c.hidden);
	return (
		<div className="grid w-full max-w-2xl gap-2">
			<div className="flex justify-end">
				<ColumnsMenu columns={columns} onChange={setColumns} wrap={wrap} onWrapChange={setWrap} pageSize={pageSize} onPageSizeChange={setPageSize} note="Saved for you on this table" />
			</div>
			<div className="overflow-hidden rounded-sm border border-line bg-surface">
				<Table aria-label="Listings">
					<TableHeader>
						<TableRow className="hover:bg-transparent">{cols.map((c) => <TableHead key={c.id}>{c.label}</TableHead>)}</TableRow>
					</TableHeader>
					<TableBody>
						{LISTINGS.slice(0, 4).map((l) => (
							<TableRow key={l.id}>{cols.map((c) => <TableCell key={c.id} className={wrap ? "whitespace-normal" : undefined}>{CELL[c.id](l)}</TableCell>)}</TableRow>
						))}
					</TableBody>
				</Table>
				<p className="tabular border-t border-line px-3 py-2 text-sm text-ink-2">Showing 1–4 of {LISTINGS.length} listings · {pageSize} per page</p>
			</div>
		</div>
	);
}
