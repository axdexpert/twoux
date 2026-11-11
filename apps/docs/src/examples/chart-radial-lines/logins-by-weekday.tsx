import { ChartFrame, RadialLines, radialLinesTable } from "@twoux/ui";

export const meta = { title: "One series: sign-ins by day of week", description: "One series needs no legend. Sunday meets Monday, so the weekend dip reads as one shape.", order: 2 };

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SERIES = [{ id: "signins", label: "Sign-ins", data: [4_820, 5_130, 5_060, 4_910, 3_980, 820, 640] }];

export default function Example() {
	return (
		<ChartFrame className="w-full max-w-md" title="Sign-ins by day of week" description="Average per day, last 12 weeks" table={radialLinesTable(DAYS, SERIES, undefined, "Day")} height={260}>
			<RadialLines periods={DAYS} series={SERIES} periodLabel="Day" maxSize={260} aria-label="Sign-ins by day of week, last 12 weeks" />
		</ChartFrame>
	);
}
