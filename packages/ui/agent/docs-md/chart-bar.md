# Bar chart

Vertical bars from a zero baseline for comparing amounts per period or category, with the latest bar labelled and an incomplete period shown lighter.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- Comparing amounts across items or periods; simple bars are quickly processed and understood.
- Emphasising the total of each data point.

## When not to use

- Showing a trend over time where shape matters more than totals. Use the TwoUX Line chart card.
- Two dimensions at once. Use the TwoUX Heatmap.
- Breaking down task outcomes as stacks; stacked bars are hard to read. Use separate simple bars.

## Structure

1. Title and subtitle
2. Zero baseline
3. Bars (4px rounded top, gap between)
4. Latest-bar label
5. Incomplete period bar (lighter, labelled)
6. Hover tooltip

## Guidelines

- Bars always start at zero.
- Use horizontal bars when category names are long.
- Label only the latest bar; hover shows the rest.
- The current, incomplete period is lighter and says so in a label.
- A single series uses colour 1 and no legend.
- Bar charts have the same four states as line charts: skeleton plot while loading, empty, no match with Clear filters, and error with Try again.
- Use horizontal bars when there are many categories or long names, such as applications by listing title; vertical bars for periods.
- With several series, group bars to compare the parts. Stack only when the total is the main reading and there are four parts or fewer, with a 2px surface-colour gap between segments.
- A single series uses one colour for every bar. Never colour bars by month or by category for variety.
- A goal or limit is a dashed threshold line with a text label, such as "Target 120".
- The pinned popover can break a bar down into up to seven parts, with a link on the name or the value, not both.

## Content

- Title names the measure; subtitle gives the period and scope.
- Keep tick increments fixed and match time labels to the data's period.
- Label the incomplete period plainly, "This week so far".

## Accessibility

- 1.1.1 and WAI complex images: provide a short alternative and a table with the values.
- 1.4.11 Non-text Contrast: bars reach 3:1 against the background.
- 1.4.1 Use of Color: the incomplete period is marked in text, not lightness alone.
- 2.1.1 Keyboard: arrow keys move between bars and show each value.
- Description: "Bar chart showing applications per week, last 12 weeks." It matches the visible title and period.
- Grouped and stacked bars name each part in the tooltip and table, so colour is not the only cue.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the chart |
| ← → | Move to the previous or next bar |

## Examples

### hires

```tsx
import { CartesianChart, ChartFrame, ChartLegend, SegmentedControl, Segment, chartTable, seriesColor } from "@twoux/ui";
import { useState } from "react";
import { HIRES, WEEKS } from "../chart-card-line/data";

export const meta = { title: "Hires per week", description: "Grouped bars compare teams week by week; stacked shows the total. Bars start at zero with 4px rounded ends and 2px gaps.", order: 1 };

export default function Example() {
	const [mode, setMode] = useState("grouped");
	return (
		<ChartFrame
			className="w-full"
			title="Hires per week"
			description="Offers accepted, by team"
			table={chartTable("Week", WEEKS, HIRES)}
			actions={
				<SegmentedControl value={mode} onValueChange={setMode} size="sm" aria-label="Bar layout">
					<Segment value="grouped">Grouped</Segment>
					<Segment value="stacked">Stacked</Segment>
				</SegmentedControl>
			}
			legend={<ChartLegend items={HIRES.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i) }))} />}
		>
			<CartesianChart kind="bar" stacked={mode === "stacked"} x={WEEKS} series={HIRES} aria-label="Hires per week by team" />
		</ChartFrame>
	);
}
```

## Related

- Line chart card
- Breakdown table
- Data visualisation colours
