import { Heatmap } from "@twoux/ui";

/* The real Heatmap: weekday columns (weekdays only, to fit), team rows, one hue, grey for zero, and its Fewer to More legend. */
export default function Thumbnail() {
	return (
		<Heatmap
			aria-label="Example"
			rows={["Design", "Data"]}
			columns={["Mon", "Tue", "Wed", "Thu", "Fri"]}
			values={[[12, 18, 15, 4, 9], [31, 36, 33, 29, 0]]}
		/>
	);
}
