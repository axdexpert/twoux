import { CartesianChart, ChartLegend, seriesColor } from "@twoux/ui";

const X = ["6 Oct", "13 Oct", "20 Oct", "27 Oct", "3 Nov", "10 Nov"];
const SERIES = [
	{ id: "eng", label: "Engineering", data: [88, 95, 102, 97, 115, 121] },
	{ id: "design", label: "Design", data: [42, 51, 47, 63, 58, 71] },
];

/* The chart and legend of a line chart card: the real CartesianChart and ChartLegend, without the card's title. */
export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-2">
			<CartesianChart kind="line" x={X} series={SERIES} height={86} aria-label="Example" />
			<ChartLegend items={SERIES.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i), shape: "line" }))} />
		</div>
	);
}
