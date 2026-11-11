# Bar and line chart

One bar series with one to three lines on the same y-axis and unit, such as weekly applications as bars and their four-week average as a line.

Kind: component · Group: Data visualisation · Status: built, import from @twoux/ui

## When to use

- When a count and a reference for that count share a unit: hires per month as bars, planned hires per month as a line.
- When volume per period is the main reading and the line adds the trend, such as applications per week with the four-week average.

## When not to use

- When the two measures have different units or scales, such as applications (count) and conversion to interview (%). Use two charts side by side; never a second y-axis.
- When every series is the same kind of measure, such as applications for three listings. Use the Line chart card or grouped bars.
- For a fixed target that does not change by period. Use a threshold line on the Bar chart instead.

## Structure

1. Title and subtitle
2. Plot: one y-axis, zero baseline, bars for the main measure
3. Line or lines (2px) for a related measure in the same unit: average, plan or previous period
4. Legend: bar swatch and line swatch with names
5. Crosshair tooltip with each series at the hovered period
6. Optional threshold: dashed line with a text label

## Guidelines

- Only one series is drawn as bars. Lines carry up to three related series, so the chart stays within four series in all.
- Bars start at zero, so the shared axis starts at zero too.
- Bars use categorical colour 1; lines use the next colours in order. A previous-period line stays the dashed grey from the Period comparison pattern.
- Draw lines on top of bars and put a marker on each line point so it stays visible where it crosses a bar.
- Show missing periods as gaps in the line and no bar, not as zero.
- If the line and the bars stop sharing a unit after a change in the data, split the chart. Do not add a right-hand axis.

## Content

- Name each series by role: "Hires", "Plan", "4-week average". The legend says which is the bar and which is the line through its swatch.
- Axis title states the shared unit once: "Applications". No unit on the y-axis for time.
- Title is a noun phrase naming the main measure: "Hires against plan".

## Accessibility

- Description names both marks: "Bar and line chart showing hires per month against plan, last 12 months."
- Bars and lines differ by shape, not only by colour, and the tooltip names every series.
- Bars and lines reach 3:1 against the background; the line marker keeps 3:1 where it sits on a bar.
- The Table view has one column per series with the same names as the legend.

## Keyboard

| Keys | Action |
|---|---|
| Tab | Focus the plot, then each legend item |
| ← → | Move to the previous or next period |
| Enter | Pin the tooltip |
| Esc | Close the tooltip |

## Examples

### applications-target

```tsx
import { CartesianChart, ChartFrame, ChartLegend, type ChartSeries, chartTable, seriesColor } from "@twoux/ui";
import { WEEKS } from "../chart-card-line/data";

export const meta = { title: "Applications against the average", description: "Bars for this period, a line for the 8-week average, and a dashed target. All three share one axis and one unit; different units would need two charts.", order: 1 };

const SERIES: ChartSeries[] = [
	{ id: "apps", label: "Applications", type: "bar", data: [151, 170, 168, 188, 204, 219, 218, 250] },
	{ id: "avg", label: "8-week average", type: "line", data: [160, 163, 165, 171, 178, 186, 192, 196] },
];

export default function Example() {
	return (
		<ChartFrame className="w-full" title="Applications per week" description="Against the rolling average and the target" table={chartTable("Week", WEEKS, SERIES)} legend={<ChartLegend items={SERIES.map((s, i) => ({ id: s.id, label: s.label, color: seriesColor(i), shape: s.type === "line" ? "line" : "box" }))} />}>
			<CartesianChart kind="mixed" x={WEEKS} series={SERIES} threshold={{ value: 220, label: "Target 220" }} aria-label="Applications per week with average and target" />
		</ChartFrame>
	);
}
```

## Related

- Bar chart
- Line chart card
- Stat card with comparison
- Data visualisation colours
- Data visualisation
