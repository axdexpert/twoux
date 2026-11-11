import { ScatterChart } from "@twoux/ui";

const P = [[30, 38, "Design"], [58, 37, "Design"], [42, 21, "Design"], [52, 92, "Engineering"], [60, 64, "Engineering"], [40, 47, "Engineering"], [41, 64, "Data"], [55, 33, "Data"], [66, 41, "Data"]] as const;

/* The real ScatterChart: three groups, each with its own colour and marker shape, plus axis titles and legend. */
export default function Thumbnail() {
	return (
		<div className="w-64">
			<ScatterChart aria-label="Example" xTitle="Salary (£000s)" yTitle="Applicants" height={90} points={P.map(([x, y, group], i) => ({ id: String(i), label: group, x, y, group }))} />
		</div>
	);
}
