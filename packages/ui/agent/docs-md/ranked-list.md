# Ranked list

Ranked rows with a series dot or icon, name, value and change, optionally a sparkline. Beside a stacked chart it is the chart's legend; each row links to the record.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- As the legend of a stacked chart when people also need the ranking and values for the latest period.
- A dashboard list of the top items by one measure, each opening its record.

## When not to use

- To compare many attributes per row or sort by them. Use the TwoUX List table.
- For a price or index list where the code and unit matter. Use the TwoUX Change list.

## Structure

1. Heading that names the moment, such as Top models on 28 Apr
2. Rank
3. Series dot (or icon)
4. Name
5. Optional sparkline
6. Value, tabular
7. Change: arrow, sign and percentage

## Guidelines

- Rank by the value shown, highest first, and say which period ranks it in the heading.
- When the list is a legend, each dot keeps its series colour from the chart; never recolour by rank.
- Show change with an arrow and a sign; colour it green or red only when the direction means good or bad, otherwise grey.
- Hovering or focusing a row highlights that series in the chart, and the chart's crosshair can highlight the row.
- Each row is one link or one button for the whole row, never several actions.

## Content

- Values carry their unit (bn tokens, £); changes say the comparison in the heading or subtitle.
- Keep names short enough to fit; the full name goes in the record.

## Accessibility

- 1.4.1 Use of Color: change is an arrow, a sign and a word read out (up or down), not colour.
- 1.3.1 Info and Relationships: the list is an ordered list, so rank is announced.
- 4.1.2 Name, Role, Value: each row is a single link or button whose name includes the label, value and change.
- 2.4.7 Focus Visible: rows show the focus ring inside their edge.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Move to the next row |
| Enter | Open the row's record |

## Examples

### top-models

```tsx
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
```

## Related

- Stacked area chart
- Change list
- Stat card with comparison
