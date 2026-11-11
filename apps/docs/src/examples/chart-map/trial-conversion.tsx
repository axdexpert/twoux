import * as React from "react";
import { ChartFrame, FilterBar, FilterPill, MapChart, mapTable } from "@twoux/ui";
import world from "world-atlas/countries-110m.json";

export const meta = { title: "Trial conversion by country", description: "A rate, so countries of different size compare fairly. Arrow keys move from highest to lowest; Enter pins the details and offers Filter page.", order: 1 };

// Trials that became paid accounts, per 100 trials, last quarter. ISO 3166-1 numeric ids.
const RATES = [
	{ id: "826", label: "United Kingdom", value: 18.4 },
	{ id: "372", label: "Ireland", value: 21.2 },
	{ id: "276", label: "Germany", value: 14.9 },
	{ id: "250", label: "France", value: 11.3 },
	{ id: "528", label: "Netherlands", value: 19.7 },
	{ id: "752", label: "Sweden", value: 16.1 },
	{ id: "724", label: "Spain", value: 8.2 },
	{ id: "616", label: "Poland", value: 9.6 },
	{ id: "840", label: "United States", value: 15.8 },
	{ id: "124", label: "Canada", value: 13.4 },
	{ id: "484", label: "Mexico", value: 5.1 },
	{ id: "076", label: "Brazil", value: 6.7 },
	{ id: "356", label: "India", value: 4.3 },
	{ id: "392", label: "Japan", value: 7.9 },
	{ id: "036", label: "Australia", value: 17.2 },
	{ id: "710", label: "South Africa", value: 6.0 },
	{ id: "702", label: "Singapore", value: 22.5 },
];
const pctFmt = (n: number) => `${n.toFixed(1)}%`;

export default function Example() {
	const [country, setCountry] = React.useState<string[]>([]);
	const options = RATES.map((r) => ({ value: r.id, label: r.label }));
	return (
		<div className="grid w-full gap-3">
			<FilterBar>
				<FilterPill field="Country" options={options} selected={country} onChange={setCountry} />
			</FilterBar>
			<ChartFrame className="w-full" title="Trial conversion by country" description="Paid accounts per 100 trials, July to September" table={mapTable(RATES, { format: pctFmt, share: false, first: "Country", valueLabel: "Conversion" })} height={260}>
				<MapChart
					topology={world}
					object="countries"
					exclude={["010"]}
					values={RATES}
					format={pctFmt}
					share={false}
					valueLabel="Conversion"
					filterField="Country"
					onSelect={(r) => setCountry([r.id])}
					aria-label="Map showing trial conversion by country, July to September"
				/>
			</ChartFrame>
		</div>
	);
}
