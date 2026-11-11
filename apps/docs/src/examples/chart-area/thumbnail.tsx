import { CartesianChart, ChartLegend, seriesColor } from "@twoux/ui";

/* The real stacked CartesianChart with its legend; the ChartFrame title is left out to fit. */
const X = ["Oct", "", "", "Nov", "", ""];
const SERIES = [
	{ id: "eng", label: "Engineering", data: [88, 94, 102, 97, 115, 121] },
	{ id: "design", label: "Design", data: [42, 51, 47, 63, 58, 71] },
	{ id: "data", label: "Data", data: [21, 25, 19, 28, 31, 27] },
];

export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-1.5" aria-hidden="true">
			<CartesianChart kind="area" stacked x={X} series={SERIES} height={86} aria-label="Applications per week, stacked by team" />
			<ChartLegend items={SERIES.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i) }))} />
		</div>
	);
}
