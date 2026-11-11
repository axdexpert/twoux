import { BoxPlot } from "@twoux/ui";

/* The real BoxPlot with one precomputed group; its axis title and legend come with it. */
export default function Thumbnail() {
	return (
		<div className="w-64">
			<BoxPlot
				xTitle="Hours"
				format={(n) => `${n}h`}
				aria-label="Example"
				groups={[{ id: "a", label: "Onboarding", stats: { min: 2, q1: 4, median: 5.5, q3: 9, max: 15, outliers: [18] } }]}
			/>
		</div>
	);
}
