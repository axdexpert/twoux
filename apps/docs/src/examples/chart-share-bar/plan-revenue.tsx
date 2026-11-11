import { ChartFrame, ShareBar, shareTable } from "@twoux/ui";

export const meta = { title: "Recurring revenue by plan", description: "A thin bar under a legend that already gives each share. Eight plans arrive; the two smallest fold into Other so the bar keeps six parts.", order: 1 };

const PLANS = [
	{ id: "business", label: "Business", value: 1_284_000 },
	{ id: "team", label: "Team", value: 612_000 },
	{ id: "enterprise", label: "Enterprise", value: 498_000 },
	{ id: "starter", label: "Starter", value: 231_000 },
	{ id: "agency", label: "Agency", value: 104_000 },
	{ id: "education", label: "Education", value: 46_000 },
	{ id: "charity", label: "Charity", value: 21_000 },
	{ id: "legacy", label: "Legacy", value: 9_000 },
];
const gbp = (n: number) => `£${(n / 1000).toLocaleString("en-GB", { maximumFractionDigits: 0 })}k`;

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Recurring revenue by plan" description="Annual run rate, 5 November 2026" table={shareTable(PLANS, gbp, "Plan")} height={60}>
			<ShareBar parts={PLANS} format={gbp} aria-label="Recurring revenue by plan" />
		</ChartFrame>
	);
}
