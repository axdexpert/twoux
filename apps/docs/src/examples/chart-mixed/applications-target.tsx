import { CartesianChart, ChartFrame, ChartLegend, type ChartSeries, chartTable, seriesColor } from "@twoux/ui";
import { WEEKS } from "../chart-card-line/data";

export const meta = { title: "Applications against the average", description: "Bars for this period, a line for the 8-week average, and a dashed target. All three share one axis and one unit; different units would need two charts.", order: 1 };

const SERIES: ChartSeries[] = [
	{ id: "apps", label: "Applications", type: "bar", data: [151, 170, 168, 188, 204, 219, 218, 250] },
	{ id: "avg", label: "8-week average", type: "line", data: [160, 163, 165, 171, 178, 186, 192, 196] },
];

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Applications per week" description="Against the rolling average and the target" table={chartTable("Week", WEEKS, SERIES)} legend={<ChartLegend items={SERIES.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i), shape: s.type === "line" ? "line" : "box" }))} />}>
			<CartesianChart kind="mixed" x={WEEKS} series={SERIES} threshold={{ value: 220, label: "Target 220" }} aria-label="Applications per week with average and target" />
		</ChartFrame>
	);
}
