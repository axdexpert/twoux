import { AiCell, AiColumnHeader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@twoux/ui";

/* The real generated column: AiColumnHeader marks it once, one cell done with its citation, one failed with the reason. */
export default function Thumbnail() {
	return (
		<div className="w-64 overflow-hidden rounded-sm border border-line" aria-hidden="true">
			<Table>
				<TableHeader><TableRow><TableHead>Listing</TableHead><TableHead className="bg-primary-soft/40"><AiColumnHeader name="Skills" written="now" /></TableHead></TableRow></TableHeader>
				<TableBody>
					<TableRow><TableCell className="font-medium text-ink">QA Engineer</TableCell><TableCell className="max-w-36 bg-primary-soft/20"><AiCell cell={{ state: "done", value: "Playwright", source: "LST-1045" }} /></TableCell></TableRow>
					<TableRow><TableCell className="font-medium text-ink">Coordinator</TableCell><TableCell className="max-w-36 bg-primary-soft/20"><AiCell cell={{ state: "failed", reason: "No description" }} /></TableCell></TableRow>
				</TableBody>
			</Table>
		</div>
	);
}
