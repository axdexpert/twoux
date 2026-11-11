import { BoxPlot, boxTable, ChartFrame } from "@twoux/ui";

export const meta = { title: "First response time by team", description: "Four teams on one axis: the box is the middle half of tickets, the line the median, dots the slow outliers worth opening.", order: 1 };

const TEAMS = [
	{ id: "billing", label: "Billing", values: [4.7, 1.3, 2.9, 3.3, 4.0, 4.2, 3.4, 2.1, 3.4, 5.1, 2.6, 1.9, 2.4, 5.4, 2.1, 3.7, 2.2, 0.9, 2.4, 3.3, 1.7, 10.8, 3.2, 2.4, 2.7, 5.0, 2.8, 1.3, 4.3, 5.4, 1.6, 2.1, 6.8, 2.9, 2.9, 2.7, 3.0, 1.8, 1.6, 7.0] },
	{ id: "onboarding", label: "Onboarding", values: [9.5, 3.2, 3.3, 11.4, 7.0, 2.4, 4.1, 9.9, 3.3, 18.5, 2.0, 15.3, 5.2, 11.0, 9.5, 6.5, 9.4, 6.5, 8.4, 7.9, 4.3, 2.1, 5.7, 4.8, 4.1, 4.7, 6.5, 2.3, 3.5, 4.4, 5.6, 5.3, 31.2, 8.4, 11.4, 4.3, 6.2, 5.9, 2.1, 5.7] },
	{ id: "integrations", label: "Integrations", values: [27.7, 7.3, 6.3, 18.5, 10.2, 22.2, 8.0, 22.1, 6.1, 3.5, 8.3, 12.8, 6.9, 10.9, 12.7, 11.7, 12.8, 9.4, 6.0, 8.5, 15.8, 5.0, 5.4, 20.1, 7.7, 15.4, 7.4, 7.5, 13.6, 2.9, 12.4, 3.6, 8.6, 9.0, 4.1, 2.2, 20.4, 11.0, 13.6, 11.3] },
	{ id: "enterprise", label: "Enterprise", values: [0.9, 1.8, 2.3, 1.1, 2.6, 3.0, 1.8, 2.4, 3.9, 0.8, 2.1, 2.3, 1.2, 0.8, 2.0, 1.3, 2.6, 3.6, 2.2, 4.0, 0.9, 1.5, 2.8, 2.4, 1.4, 2.4, 1.8, 4.9, 3.3, 4.0, 2.5, 2.9, 4.1, 1.5, 2.4, 1.9, 1.4, 1.6, 3.1, 1.5] },
];
const hours = (n: number) => `${Math.round(n * 10) / 10}h`;

export default function Example() {
	return (
		<ChartFrame className="w-full" title="First response time by team" description="Last 40 tickets per team" table={boxTable(TEAMS, hours, "Team")}>
			<BoxPlot groups={TEAMS} format={hours} xTitle="Hours to first response" aria-label="First response time by team, last 40 tickets" />
		</ChartFrame>
	);
}
