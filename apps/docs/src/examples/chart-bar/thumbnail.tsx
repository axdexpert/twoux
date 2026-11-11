import { CartesianChart, ChartLegend, seriesColor } from "@twoux/ui";

/* The real grouped bar CartesianChart with its legend; the ChartFrame title is left out to fit. */
const X = ["W1", "W2", "W3", "W4"];
const SERIES = [
	{ id: "design", label: "Design", data: [1, 2, 1, 3] },
	{ id: "eng", label: "Engineering", data: [3, 2, 4, 5] },
	{ id: "data", label: "Data", data: [1, 1, 2, 1] },
];

export default function Thumbnail() {
	return (
		<div className="grid w-64 gap-1.5" aria-hidden="true">
			<CartesianChart kind="bar" x={X} series={SERIES} height={86} aria-label="Hires per week by team" />
			<ChartLegend items={SERIES.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i) }))} />
		</div>
	);
}
