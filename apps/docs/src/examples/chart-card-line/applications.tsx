import { CartesianChart, ChartFrame, ChartLegend, type ChartStatus, SegmentedControl, Segment, chartTable, seriesColor } from "@twoux/ui";
import { useState } from "react";
import { APPLICATIONS, WEEKS } from "./data";

export const meta = { title: "Applications by team", description: "Hover, or focus the chart and use the arrow keys, to read every value. Click a legend key to hide a series. The table button shows the same numbers as a table.", order: 1 };

export default function Example() {
	const [hidden, setHidden] = useState<string[]>([]);
	const [state, setState] = useState<ChartStatus>("ready");
	const [period, setPeriod] = useState("8w");
	const n = period === "4w" ? 4 : 8;
	const x = WEEKS.slice(-n);
	const series = APPLICATIONS.map((s) => ({ ...s, data: s.data.slice(-n) }));
	return (
		<div className="grid w-full gap-3">
			<ChartFrame
				title="Applications per week"
				description={`All open listings, last ${n} weeks`}
				status={state}
				onRetry={() => setState("ready")}
				table={chartTable("Week", x, series)}
				actions={
					<SegmentedControl value={period} onValueChange={setPeriod} size="sm" aria-label="Period">
						<Segment value="4w">4 weeks</Segment>
						<Segment value="8w">8 weeks</Segment>
					</SegmentedControl>
				}
				legend={<ChartLegend items={APPLICATIONS.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i), shape: "line" }))} hidden={hidden} onToggle={(id) => setHidden((h) => (h.includes(id) ? h.filter((x) => x !== id) : [...h, id]))} />}
			>
				<CartesianChart kind="line" x={x} series={series} hidden={hidden} aria-label="Applications per week by team" />
			</ChartFrame>
			<SegmentedControl value={state} onValueChange={(v) => setState(v as ChartStatus)} size="sm" aria-label="Preview state" className="justify-self-start">
				{(["ready", "loading", "empty", "error"] as const).map((s) => <Segment key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</Segment>)}
			</SegmentedControl>
		</div>
	);
}
