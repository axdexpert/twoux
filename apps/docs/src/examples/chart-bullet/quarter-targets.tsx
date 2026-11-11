import { BulletChart, ChartFrame } from "@twoux/ui";

export const meta = { title: "Quarter to date against target", description: "Each measure is a thin bar over grey bands, with the target as a dark tick. It replaces a row of gauges in a third of the space.", order: 1 };

const ROWS = [
	{ id: "new", label: "New business", value: 412_000, target: 450_000, bands: [300_000, 400_000, 500_000] },
	{ id: "expansion", label: "Expansion", value: 188_000, target: 160_000, bands: [100_000, 150_000, 220_000] },
	{ id: "renewals", label: "Renewals", value: 731_000, target: 820_000, bands: [700_000, 800_000, 900_000] },
];
const gbp = (n: number) => (n === 0 ? "£0" : `£${Math.round(n / 1000)}k`);

export default function Example() {
	return (
		<ChartFrame
			className="w-full"
			title="Bookings against target"
			description="Quarter to date, Q4 2026"
			table={{ columns: ["Measure", "Actual", "Target", "Of target"], rows: ROWS.map((r) => [r.label, gbp(r.value), gbp(r.target), `${Math.round((r.value / r.target) * 100)}%`]) }}
		>
			<BulletChart rows={ROWS} format={gbp} aria-label="Bookings against target, quarter to date" />
		</ChartFrame>
	);
}
