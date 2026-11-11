import type React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, seriesColor } from "@twoux/ui";

/* The breakdown under a chart, with the real Table: a colour key tying each row to its series, current figure and change.
   The chart above it and the Last week column are left out to fit. */
const ROWS = [["Engineering", "132", "↑ 12%"], ["Design", "80", "↑ 18%"]];

export default function Thumbnail() {
	return (
		<div className="w-64 overflow-hidden rounded-xs border border-line" aria-hidden="true">
			<Table>
				<TableHeader><TableRow><TableHead>Team</TableHead><TableHead className="text-right">This week</TableHead><TableHead className="text-right">Change</TableHead></TableRow></TableHeader>
				<TableBody>
					{ROWS.map(([t, now, ch], i) => (
						<TableRow key={t}>
							<TableCell><span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-0.5 w-3 rounded-full bg-(--c)" style={{ "--c": seriesColor(i) } as React.CSSProperties} />{t}</span></TableCell>
							<TableCell className="tabular text-right font-medium">{now}</TableCell>
							<TableCell className="tabular text-right">{ch}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
