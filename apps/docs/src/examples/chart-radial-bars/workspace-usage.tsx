import { ChartFrame, RadialBars, radialBarsTable } from "@twoux/ui";

export const meta = { title: "Workspace usage this month", description: "Seats, assistant credits and storage, each as a share of the plan's limit. The list says every value in words; the rings only repeat it. Seats at the limit add a status badge.", order: 1 };

const ITEMS = [
	{ id: "seats", label: "Seats", value: 50, limit: 50, unit: "seats" },
	{ id: "credits", label: "Assistant credits", value: 13_200, limit: 20_000, unit: "credits" },
	{ id: "storage", label: "Storage", value: 38, limit: 100, unit: "GB" },
];

export default function Example() {
	return (
		<ChartFrame className="w-full max-w-md" title="Plan usage" description="Growth plan · resets 1 Dec" table={radialBarsTable(ITEMS)} height={140}>
			<RadialBars items={ITEMS} aria-label="Plan usage this month" />
		</ChartFrame>
	);
}
