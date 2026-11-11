import { ChartFrame, Heatmap } from "@twoux/ui";

export const meta = { title: "When candidates apply", description: "One hue from light to dark, a legend from fewer to more, and every value in the cell's accessible name. Zero is grey, not the lightest step.", order: 1 };

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TEAMS = ["Design", "Engineering", "Data", "People"];
const V = [[12, 18, 15, 14, 9, 2, 4], [31, 36, 33, 29, 21, 6, 9], [7, 9, 11, 8, 6, 0, 1], [4, 6, 5, 7, 3, 0, 0]];

export default function Example() {
	return (
		<ChartFrame className="w-full max-w-2xl" title="Applications by weekday" description="Last 4 weeks, by team">
			<Heatmap rows={TEAMS} columns={DAYS} values={V} aria-label="Applications by team and weekday" />
		</ChartFrame>
	);
}
