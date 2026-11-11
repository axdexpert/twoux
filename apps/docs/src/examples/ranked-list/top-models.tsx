import { useState } from "react";
import { CartesianChart, ChartFrame, type ChartSeries, chartTable, RankedList } from "@twoux/ui";

export const meta = { title: "Top models beside a stacked chart", description: "The ranked list is the legend: each row's dot matches its series, ranked by the last day, with the change since the week before.", order: 1 };

const DAYS = ["22 Apr", "23 Apr", "24 Apr", "25 Apr", "26 Apr", "27 Apr", "28 Apr"];
const SERIES: ChartSeries[] = [
	{ id: "atlas", label: "Atlas 3", data: [3.1, 3.4, 3.3, 3.8, 2.9, 2.6, 4.2] },
	{ id: "nimbus", label: "Nimbus Pro", data: [2.4, 2.5, 2.7, 2.6, 2.1, 1.9, 2.8] },
	{ id: "kestrel", label: "Kestrel 2", data: [1.2, 1.4, 1.5, 1.7, 1.3, 1.2, 1.9] },
	{ id: "orbit", label: "Orbit Mini", data: [1.6, 1.5, 1.4, 1.4, 1.1, 1.0, 1.3] },
	{ id: "other", label: "Others", data: [0.9, 0.9, 1.0, 1.1, 0.8, 0.7, 1.0] },
];
const CHANGE = [12.4, 6.1, 31.0, -9.7, 4.2];
const tokens = (n: number) => `${n.toFixed(1)}bn`;

export default function Example() {
	const [active, setActive] = useState<string | null>(null);
	return (
		<ChartFrame className="w-full" title="Tokens by model" description="Daily tokens, last 7 days" table={chartTable("Day", DAYS, SERIES)}>
			<div className="grid grid-cols-[minmax(0,1fr)_minmax(0,18rem)] gap-6 max-lg:grid-cols-1">
				<CartesianChart kind="bar" stacked x={DAYS} series={SERIES} format={(n) => `${n}bn`} aria-label="Tokens by model, stacked by day" />
				<div className="grid content-start gap-1">
					<h4 className="px-2 text-sm font-medium text-ink-2">Top models on 28 Apr</h4>
					<RankedList
						aria-label="Top models on 28 April, by tokens"
						items={SERIES.map((s, i) => ({ id: s.id, label: s.label, value: s.data[6] ?? 0, change: CHANGE[i], colorIndex: i, href: `#${s.id}` }))}
						format={tokens}
						upIs="neutral"
						activeId={active}
						onActiveChange={setActive}
					/>
				</div>
			</div>
		</ChartFrame>
	);
}

