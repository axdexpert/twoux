import { ChartFrame, SankeyChart, sankeyTable } from "@twoux/ui";

export const meta = { title: "Visits to the pricing page", description: "Where visits came from, which page they reached, and what they did next. Hover a node to light every flow through it.", order: 1 };

const NODES = [
	{ id: "organic", label: "Organic search" },
	{ id: "paid", label: "Paid search" },
	{ id: "direct", label: "Direct" },
	{ id: "referral", label: "Referral" },
	{ id: "pricing", label: "Pricing page" },
	{ id: "docs", label: "Docs" },
	{ id: "trial", label: "Started trial" },
	{ id: "demo", label: "Booked demo" },
	{ id: "left", label: "Left" },
];
const LINKS = [
	{ source: "organic", target: "pricing", value: 8_200 },
	{ source: "organic", target: "docs", value: 4_100 },
	{ source: "paid", target: "pricing", value: 5_600 },
	{ source: "direct", target: "pricing", value: 3_900 },
	{ source: "direct", target: "docs", value: 2_300 },
	{ source: "referral", target: "pricing", value: 1_800 },
	{ source: "pricing", target: "trial", value: 2_900 },
	{ source: "pricing", target: "demo", value: 1_100 },
	{ source: "pricing", target: "left", value: 15_500 },
	{ source: "docs", target: "trial", value: 1_200 },
	{ source: "docs", target: "left", value: 5_200 },
];

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Visits to pricing and docs" description="Last 30 days" table={sankeyTable(NODES, LINKS)} height={280}>
			<SankeyChart nodes={NODES} links={LINKS} aria-label="Visits from source to page to outcome, last 30 days" />
		</ChartFrame>
	);
}
