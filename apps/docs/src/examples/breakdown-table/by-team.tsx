import type React from "react";
import { CartesianChart, ChartFrame, ChartLegend, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, seriesColor } from "@twoux/ui";
import { APPLICATIONS, WEEKS } from "../chart-card-line/data";

export const meta = { title: "Chart with its breakdown", description: "The table under the chart splits the same figure by team, with current, previous and change. The colour key in each row ties it to the chart.", order: 1 };

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Applications per week" description="Last 8 weeks" legend={<ChartLegend items={APPLICATIONS.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i), shape: "line" }))} />}>
			<CartesianChart kind="line" x={WEEKS} series={APPLICATIONS} height={180} aria-label="Applications per week by team" />
			<div className="overflow-hidden rounded-xs border border-line">
				<Table aria-label="Applications by team">
					<TableHeader><TableRow><TableHead>Team</TableHead><TableHead className="text-right">This week</TableHead><TableHead className="text-right">Last week</TableHead><TableHead className="text-right">Change</TableHead></TableRow></TableHeader>
					<TableBody>
						{APPLICATIONS.map((s, i) => {
							const [now, prev] = [s.data[s.data.length - 1] ?? 0, s.data[s.data.length - 2] ?? 0];
							const pct = Math.round(((now - prev) / (prev || 1)) * 100);
							return (
								<TableRow key={s.id}>
									<TableCell><span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-0.5 w-3 rounded-full bg-(--c)" style={{ "--c": seriesColor(i) } as React.CSSProperties} />{s.label}</span></TableCell>
									<TableCell className="tabular text-right font-medium">{now}</TableCell>
									<TableCell className="tabular text-right text-ink-2">{prev}</TableCell>
									<TableCell className="tabular text-right">{pct >= 0 ? "↑" : "↓"} {Math.abs(pct)}%</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</ChartFrame>
	);
}
