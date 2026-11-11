import { ChartFrame, DonutChart } from "@twoux/ui";

export const meta = { title: "Where applicants come from", description: "Two to five parts of one whole, each labelled with its count and share. For more parts, or to compare sizes closely, use a bar chart.", order: 1 };

export default function Example() {
	return (
		<ChartFrame className="w-full max-w-xl" title="Applications by source" description="This month">
			<DonutChart totalLabel="applications" aria-label="Applications by source" segments={[
				{ id: "board", label: "Job boards", value: 312 },
				{ id: "site", label: "Careers page", value: 164 },
				{ id: "ref", label: "Referrals", value: 71 },
				{ id: "agency", label: "Agencies", value: 48 },
			]} />
		</ChartFrame>
	);
}
