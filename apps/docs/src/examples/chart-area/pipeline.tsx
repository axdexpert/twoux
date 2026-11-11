import { CartesianChart, ChartFrame, ChartLegend, chartTable, seriesColor } from "@twoux/ui";
import { APPLICATIONS, WEEKS } from "../chart-card-line/data";

export const meta = { title: "Applications, stacked by team", description: "Stacked from zero, so the top edge is the total and each band is one team. Use it when the total matters as much as the parts; for comparing teams, use lines.", order: 1 };

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Applications per week" description="Stacked by team" table={chartTable("Week", WEEKS, APPLICATIONS)} legend={<ChartLegend items={APPLICATIONS.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i) }))} />}>
			<CartesianChart kind="area" stacked x={WEEKS} series={APPLICATIONS} aria-label="Applications per week, stacked by team" />
		</ChartFrame>
	);
}
