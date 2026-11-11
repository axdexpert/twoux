import { ChartFrame, RadialLines, radialLinesTable } from "@twoux/ui";

export const meta = { title: "Support tickets by hour of day", description: "Two queues over 24 hours. Midnight sits at the top, so the overnight hours read as one stretch. 04:00 has no data after a logging outage and shows as a gap.", order: 1 };

const HOURS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`);
const SERIES = [
	{ id: "billing", label: "Billing", data: [6, 4, 3, 2, null, 3, 8, 18, 34, 52, 61, 58, 49, 55, 60, 54, 44, 31, 22, 17, 14, 12, 10, 8] },
	{ id: "technical", label: "Technical", data: [14, 12, 10, 9, null, 11, 16, 24, 31, 38, 42, 40, 36, 39, 43, 41, 37, 33, 29, 27, 24, 21, 18, 16] },
];

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Tickets opened by hour" description="Average per day, last 30 days, UK time" table={radialLinesTable(HOURS, SERIES, undefined, "Hour")} height={320}>
			<RadialLines periods={HOURS} series={SERIES} periodLabel="Hour" aria-label="Support tickets opened by hour of day, last 30 days" />
		</ChartFrame>
	);
}
