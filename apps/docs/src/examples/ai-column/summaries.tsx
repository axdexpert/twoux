import { AiCell, type AiCellState, AiColumnHeader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@twoux/ui";
import { useEffect, useState } from "react";

export const meta = { title: "A generated column", description: "Marked once in the header with when it was written. Cells fill one at a time, each cites its record, and a failed cell says why with Try again. Real data is never overwritten.", order: 1 };

const ROWS = [["LST-1040", "Junior Product Designer", "Portfolio, Figma, hybrid in Leeds"], ["LST-1041", "Frontend Engineer", "React and TypeScript, 3+ years"], ["LST-1043", "Recruitment Coordinator", ""], ["LST-1045", "QA Engineer", "Playwright, CI, test plans"]];

export default function Example() {
	const [n, setN] = useState(0);
	useEffect(() => { if (n < ROWS.length) { const t = setTimeout(() => setN((x) => x + 1), 600); return () => clearTimeout(t); } }, [n]);
	const cell = (i: number): AiCellState => (i > n ? { state: "queued" } : i === n ? { state: "writing" } : ROWS[i][2] ? { state: "done", value: ROWS[i][2], source: ROWS[i][0] } : { state: "failed", reason: "The listing has no description" });
	return (
		<div className="w-full overflow-hidden rounded-sm border border-line">
			<Table aria-label="Listings with requirements summary">
				<TableHeader><TableRow><TableHead>Listing</TableHead><TableHead className="bg-primary-soft/40"><AiColumnHeader name="Key requirements" written={n >= ROWS.length ? "just now" : "writing"} onRefresh={() => setN(0)} /></TableHead></TableRow></TableHeader>
				<TableBody>{ROWS.map((r, i) => <TableRow key={r[0]}><TableCell className="font-medium text-ink">{r[1]}</TableCell><TableCell className="max-w-72 bg-primary-soft/20"><AiCell cell={cell(i)} onRetry={() => setN(i)} /></TableCell></TableRow>)}</TableBody>
			</Table>
		</div>
	);
}
