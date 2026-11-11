# Map chart

Regions shaded by a rate in five steps of one hue, or circles sized by an amount at places. For questions where location itself matters; missing regions are hatched and labelled No data.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- When where something happens is the question: clusters, neighbours, regions with nothing, such as trial conversion by country.
- Placing amounts at locations, such as ARR by customer head office city, with circles sized by value.

## When not to use

- To compare amounts or rank countries. Use a Bar chart or a Ranked list: lengths are read more exactly than shades, and small countries don't disappear.
- For raw counts across regions of very different size or population, as shading. Normalise to a rate or per head, or use markers.
- For change over time. Use a Line chart card; a map shows one moment.

## Structure

1. Title and subtitle
2. Regions from your TopoJSON, thin borders
3. Shading in five classed steps, or circles sized by value
4. Hatched fill for regions with no data
5. Legend: bin ranges and No data
6. Details: name, value, share of total, rank
7. Pinned details with a drill-down button
8. Note listing values with no shape on the map

## Guidelines

- Shade by a rate, a share or a per-head figure; put raw counts and amounts on markers, where circle area grows with value.
- One measure per map: values or markers, never both.
- Colour is five classed steps of one hue (q1 to q5), darkest for the highest in light, lightest in dark. The legend shows the range of each step.
- Regions with no value are hatched and labelled No data in the legend. Never draw them as zero or in the lowest step.
- Join values by feature id (ISO 3166-1 numeric in world-atlas), not by name; names differ between sources.
- Values with no shape on the map, such as Singapore at 1:110m, are listed under the map and stay in the table.
- Use Equal Earth for the world so areas are not inflated towards the poles; leave Antarctica out unless it matters.
- For drill-down, a pinned region offers one button that says where the filter lands (Filter page) and adds a pill to the filter bar.
- Use ChartFrame for the four states and the Table view (mapTable).

## Content

- Title names the measure and period: "Trial conversion by country", subtitle "Paid accounts per 100 trials, July to September".
- Legend ranges read "Under 5%", "5% to 10%", "20% and over". Missing regions read "No data".
- Turn off share of total for rates and averages; a share of a sum of rates means nothing.

## Accessibility

- 1.1.1 and WAI complex images: the map's accessible name is a generated summary (label, number of regions, top three, how many have no data), and the Table view lists every value.
- 2.1.1 Keyboard: the map is one tab stop; arrow keys move between regions with data, highest value first, and show the same details as hover.
- 1.4.13 Content on Hover or Focus: details sit beside the region, stay while the pointer is over the map and close with Esc.
- 1.4.1 Use of Color: values are in the details, legend ranges and table; No data has a pattern as well as a colour.
- Accessible description: "Map showing trial conversion by country, July to September."

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the map |
| ← → ↑ ↓ | Move to the next or previous region with data, highest value first, and show its details |
| Home End | Jump to the highest or lowest value |
| Enter | Pin the details; focus moves to the drill-down button when there is one |
| Esc | Close the details and return focus to the map |

## Examples

### arr-by-city

```tsx
import { ChartFrame, MapChart, mapTable } from "@twoux/ui";
import world from "world-atlas/countries-110m.json";

export const meta = { title: "ARR by customer location", description: "Raw amounts go on markers, never as shading: circle area grows with ARR, so London and New York stand out without painting all of the UK or the US.", order: 2 };

const gbp = (n: number) => `£${(n / 1_000_000).toFixed(1)}m`;
// Annual recurring revenue by the city of the customer's head office.
const ARR = [
	{ id: "lon", label: "London", lon: -0.13, lat: 51.51, value: 4_820_000 },
	{ id: "man", label: "Manchester", lon: -2.24, lat: 53.48, value: 910_000 },
	{ id: "dub", label: "Dublin", lon: -6.26, lat: 53.35, value: 1_340_000 },
	{ id: "ber", label: "Berlin", lon: 13.4, lat: 52.52, value: 2_150_000 },
	{ id: "ams", label: "Amsterdam", lon: 4.9, lat: 52.37, value: 1_620_000 },
	{ id: "par", label: "Paris", lon: 2.35, lat: 48.86, value: 1_280_000 },
	{ id: "sto", label: "Stockholm", lon: 18.07, lat: 59.33, value: 740_000 },
	{ id: "nyc", label: "New York", lon: -74.0, lat: 40.71, value: 3_960_000 },
	{ id: "sfo", label: "San Francisco", lon: -122.42, lat: 37.77, value: 2_480_000 },
	{ id: "tor", label: "Toronto", lon: -79.38, lat: 43.65, value: 860_000 },
	{ id: "syd", label: "Sydney", lon: 151.21, lat: -33.87, value: 1_050_000 },
	{ id: "sin", label: "Singapore", lon: 103.82, lat: 1.35, value: 690_000 },
];

export default function Example() {
	return (
		<ChartFrame className="w-full" title="ARR by customer location" description="Head office city, as of 30 September" table={mapTable(ARR, { format: gbp, first: "City", valueLabel: "ARR" })} height={260}>
			<MapChart topology={world} object="countries" exclude={["010"]} markers={ARR} format={gbp} valueLabel="ARR" aria-label="Map showing ARR by customer head office city, as of 30 September" />
		</ChartFrame>
	);
}
```

### trial-conversion

```tsx
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
```

## Related

- Bar chart
- Ranked list
- Heatmap
- Chart drill-down
- Filter pills and filter bar
