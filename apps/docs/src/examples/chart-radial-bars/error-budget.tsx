import { ChartFrame, RadialBars, radialBarsTable } from "@twoux/ui";

export const meta = { title: "One ring: SLA error budget", description: "A single ring shows its share in the centre. The budget is a fixed limit for the month, so the ring fits; progress against a target would be a bullet chart.", order: 2 };

const ITEMS = [{ id: "budget", label: "Error budget used", value: 26, limit: 43, unit: "min" }];

export default function Example() {
	return (
		<ChartFrame className="w-full max-w-sm" title="Checkout API error budget" description="99.9% availability · November" table={radialBarsTable(ITEMS)} height={120}>
			<RadialBars items={ITEMS} size={104} aria-label="Checkout API error budget used in November" />
		</ChartFrame>
	);
}
