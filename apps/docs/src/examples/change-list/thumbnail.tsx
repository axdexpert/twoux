import { ChangeList } from "@twoux/ui";

/* The real ChangeList with two rows: name and code, today's line, value and change by arrow, sign and colour.
   Its title is hidden to fit. */
const ITEMS = [
	{ id: "uk100", name: "UK 100", symbol: "UKX", value: 8412.36, unit: "pts", change: 0.42, spark: [3, 4, 3.5, 5, 4.6, 5.8, 5.2, 6.4, 6.1, 7] },
	{ id: "uk250", name: "UK 250", symbol: "MCX", value: 20184.9, unit: "pts", change: -0.31, spark: [7, 6.2, 6.6, 5.4, 5.9, 4.8, 5.1, 4.2, 4.5, 3.8] },
];

export default function Thumbnail() {
	return (
		<div className="w-64 [&_header]:hidden" aria-hidden="true">
			<ChangeList title="Major indices" items={ITEMS} className="p-2 px-3" />
		</div>
	);
}
