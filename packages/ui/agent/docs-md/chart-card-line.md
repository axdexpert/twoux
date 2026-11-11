# Line chart card

A card that shows how one or more series change over time, with a title, period controls, a Chart or Table switch, direct labels, a shared crosshair tooltip and a source footer.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- Showing how a value changes over time.
- Comparing trends across a few series, such as applies per day by team.

## When not to use

- Comparing amounts between categories. Use the TwoUX Bar chart.
- Two measures with different units. Use two charts side by side, never two y-axes.
- One number that matters. Use the TwoUX Stat card with comparison.
- More than 8 series. Fold extras into "Other" or filter.

## Structure

1. Title (what is measured)
2. Subtitle (period)
3. Controls row: time range (7d, 30d, 90d), Chart or Table
4. Plot: 2px lines, faint grid, one y-axis
5. Direct labels at line ends
6. Legend (2 or more series)
7. Crosshair tooltip
8. Footer: source, updated time, Export CSV, Add to dashboard

## Guidelines

- Title says what is measured; the subtitle gives the period.
- Label line ends directly, and add a legend only for two or more series.
- One tooltip lists every series at the hovered day, sorted by value, with both axis values.
- Keep the grid faint and lines 2px; remove anything that does not carry data.
- A line chart may start above zero, unlike a bar chart.
- Every chart can switch to a table, which is also its accessible version.
- Every line chart has four states in the plot area, never blank: Loading: skeleton of the plot (axes and faint grid) with "Loading applications" as the region label. Empty: "No applications in this period" with one next step. No match: "No data matches these filters" with Clear filters. Error: "Couldn't load applications. Your filters are kept." with Try again.
- Missing days show as a break in the line, not a drop to zero.
- Legend items are toggles that show or hide a series; hidden series keep their colour slot. With three or more series, add a Series filter (all selected by default); with one, no filter and no legend.
- Selecting a point or pressing Enter pins the tooltip as a popover. A pinned popover can hold a breakdown of up to seven items and up to two footer buttons; see Chart drill-down.
- A target or limit is a threshold: a dashed line at a fixed value with a text label ("Target 40 a day"), not an extra series.
- Skip x-axis date labels at a regular interval rather than crowding or rotating them. The y-axis never shows time units.
- A forecast after today continues in the same colour but dashed, with a vertical "Today" marker, so the split is not shown by colour alone. Keep grey dashed for the previous period only.

## Content

- Use nouns in titles and keep axis titles to one to three words with units.
- Labels, values and legends use text colours; the series colour sits beside them as a swatch.
- The footer names the data source and when it updated.

## Accessibility

- 1.1.1 and WAI complex images: a short alternative names the chart type, data and period; the table view is the long description.
- 1.4.1 Use of Color: direct labels identify series, so colour is not the only cue.
- 1.4.11 Non-text Contrast: lines needed to read the data reach 3:1 against the background.
- 2.1.1 Keyboard: the plot is focusable and arrow keys move the crosshair day by day.
- The accessible name matches the visible title; the description reads "Line chart showing applications per day by team, last 30 days."
- Legend toggles are buttons with aria-pressed, and hiding a series is announced politely.
- Enter pins the tooltip, Tab moves into its content, Esc closes it and returns focus to the same day.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the plot |
| ← → | Move the crosshair to the previous or next day |
| Esc | Hide the tooltip |

## Examples

### applications

```tsx
import { CartesianChart, ChartFrame, ChartLegend, type ChartStatus, SegmentedControl, Segment, chartTable, seriesColor } from "@twoux/ui";
import { useState } from "react";
import { APPLICATIONS, WEEKS } from "./data";

export const meta = { title: "Applications by team", description: "Hover, or focus the chart and use the arrow keys, to read every value. Click a legend key to hide a series. The table button shows the same numbers as a table.", order: 1 };

export default function Example() {
	const [hidden, setHidden] = useState<string[]>([]);
	const [state, setState] = useState<ChartStatus>("ready");
	const [period, setPeriod] = useState("8w");
	const n = period === "4w" ? 4 : 8;
	const x = WEEKS.slice(-n);
	const series = APPLICATIONS.map((s) => ({ ...s, data: s.data.slice(-n) }));
	return (
		<div className="grid w-full gap-3">
			<ChartFrame
				title="Applications per week"
				description={`All open listings, last ${n} weeks`}
				status={state}
				onRetry={() => setState("ready")}
				table={chartTable("Week", x, series)}
				actions={
					<SegmentedControl value={period} onValueChange={setPeriod} size="sm" aria-label="Period">
						<Segment value="4w">4 weeks</Segment>
						<Segment value="8w">8 weeks</Segment>
					</SegmentedControl>
				}
				legend={<ChartLegend items={APPLICATIONS.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i), shape: "line" }))} hidden={hidden} onToggle={(id) => setHidden((h) => (h.includes(id) ? h.filter((x) => x !== id) : [...h, id]))} />}
			>
				<CartesianChart kind="line" x={x} series={series} hidden={hidden} aria-label="Applications per week by team" />
			</ChartFrame>
			<SegmentedControl value={state} onValueChange={(v) => setState(v as ChartStatus)} size="sm" aria-label="Preview state" className="justify-self-start">
				{(["ready", "loading", "empty", "error"] as const).map((s) => <Segment key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</Segment>)}
			</SegmentedControl>
		</div>
	);
}
```

## Related

- Bar chart
- Stat card with comparison
- Breakdown table
- Data visualisation colours
- Export menu
