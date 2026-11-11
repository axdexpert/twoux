import { CartesianChart, ChartFrame, ChartLegend, SegmentedControl, Segment, chartTable, seriesColor } from "@twoux/ui";
import { useState } from "react";
import { HIRES, WEEKS } from "../chart-card-line/data";

export const meta = { title: "Hires per week", description: "Grouped bars compare teams week by week; stacked shows the total. Bars start at zero with 4px rounded ends and 2px gaps.", order: 1 };

export default function Example() {
	const [mode, setMode] = useState("grouped");
	return (
		<ChartFrame
			className="w-full"
			title="Hires per week"
			description="Offers accepted, by team"
			table={chartTable("Week", WEEKS, HIRES)}
			actions={
				<SegmentedControl value={mode} onValueChange={setMode} size="sm" aria-label="Bar layout">
					<Segment value="grouped">Grouped</Segment>
					<Segment value="stacked">Stacked</Segment>
				</SegmentedControl>
			}
			legend={<ChartLegend items={HIRES.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i) }))} />}
		>
			<CartesianChart kind="bar" stacked={mode === "stacked"} x={WEEKS} series={HIRES} aria-label="Hires per week by team" />
		</ChartFrame>
	);
}
