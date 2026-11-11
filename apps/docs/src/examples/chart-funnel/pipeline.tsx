import { ChartFrame, Funnel } from "@twoux/ui";

export const meta = { title: "Hiring funnel", description: "Ordered stages as horizontal bars. Each stage shows its count and the share that moved on from the stage before.", order: 1 };

export default function Example() {
	return (
		<ChartFrame className="w-full max-w-2xl" title="Pipeline, this quarter" description="All listings">
			<Funnel aria-label="Hiring funnel this quarter" stages={[{ label: "Viewed", value: 8420 }, { label: "Applied", value: 595 }, { label: "Screened", value: 126 }, { label: "Interviewed", value: 48 }, { label: "Offered", value: 9 }]} />
		</ChartFrame>
	);
}
