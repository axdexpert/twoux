import { RankedList } from "@twoux/ui";

/* The real RankedList as a chart legend: rank, series dot, name, value and change with arrow and sign. */
export default function Thumbnail() {
	return (
		<div className="w-64" aria-hidden="true">
			<RankedList
				aria-label="Top models"
				format={(n) => `${n.toFixed(1)}bn`}
				upIs="neutral"
				items={[
					{ id: "atlas", label: "Atlas 3", value: 4.2, change: 12.4, colorIndex: 0 },
					{ id: "nimbus", label: "Nimbus Pro", value: 2.8, change: 6.1, colorIndex: 1 },
					{ id: "kestrel", label: "Kestrel 2", value: 1.9, change: -9.7, colorIndex: 2 },
				]}
			/>
		</div>
	);
}
