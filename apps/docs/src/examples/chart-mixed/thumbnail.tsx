import { CartesianChart, ChartLegend, type ChartSeries, seriesColor } from "@twoux/ui";

const X = ["6 Oct", "13 Oct", "20 Oct", "27 Oct", "3 Nov", "10 Nov"];
const SERIES: ChartSeries[] = [
	{ id: "apps", label: "Applications", type: "bar", data: [151, 170, 168, 188, 204, 219] },
	{ id: "avg", label: "Average", type: "line", data: [160, 163, 165, 171, 178, 186] },
];

/* The real CartesianChart in mixed mode (bars, a line on the same axis, a dashed target) with its legend. */
export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-2">
			<CartesianChart kind="mixed" x={X} series={SERIES} height={86} threshold={{ value: 210, label: "Target" }} aria-label="Example" />
			<ChartLegend items={SERIES.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i), shape: s.type === "line" ? "line" : "box" }))} />
		</div>
	);
}
